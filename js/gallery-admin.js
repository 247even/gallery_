jsLoader({
    'url': 'gallery/jsLoader.php',
    'path': '../js/admin-assets/',
    'outpath': '/js/',
    'filter': '*.{js,json}',
    'srcpath': 'js/',
    'concat': true,
    'minify': false,
    'gzip': false,
    'cache': false
});

var fnf = 0;
var autoprocess = false;

function adminInit() {
    console.log('adminInit');

    // check login
    // this is for development only!
    initLogin();
    if (loggedin() == false) {
        return false;
    }
    // we're logged in, continue...
    $('#login-screen').hide();

    loader();
    fnf = 0;

    // wait for js to be loaded
    /*
    if (typeof adminAssets == 'undefined' || !adminAssets) {
        setTimeout(function() {
            adminInit();
        }, 1000);
        return false;
    }
    */
    //jsCheckLoad( 'adminAssets', adminInit() );

    // set folder modal
    $('#folder-modal').modal({
        backdrop: 'static'
    });

    $('#modal-add-button').on('click', function() {
        processNewFolder({
            'folder': $('#folder-modal').attr('data'),
            'cb': function() {
                stat.newFolders = _.without(stat.newFolders, stat.workingFolder);
            }
        });
        //$('#folder-modal').modal('hide');
    });

    $('#modal-process-button').on('click', function() {
        processNewFolder({
            'folder': $('#folder-modal').attr('data')
        });
        $('#folder-modal').modal('hide');
    });

    $('#modal-ignore-button').on('click', function() {
        var folder = $('#folder-modal').attr('data');
        ignoreFolder(folder);
        $('#folder-modal').modal('hide').on('hidden.bs.modal', function(e) {
            stat.newFolders = _.without(stat.newFolders, folder);
        });
    });

    $('#modal-close-button').on('click', function() {
        for (var i = 0, len = stat.newFolders.length; len > i; i++) {
            ignoreFolder(stat.newFolders[i]);
        }
        stat.newFolders = [];
        $('#folder-modal').modal('hide');
    });

    allFolders().done(function(data) {
        //var data = data.sort();

        // get thumbnail folders:
        var subFolders = _.filter(data, function(v, k) {
            for (var i = 0, len = gJ.sizes.length; i < len; i++) {
                if (v.indexOf(gJ.sizes[i]) > -1) {
                    return v;
                }
            }
        });

        stat.allFolders = _.difference(data, subFolders);
        getAllImages(stat.allFolders, false, function() {
            stat.newFolders = _.difference(_.difference(stat.allFolders, gJ.folders), gJ.ignore);
            var oldFolders = _.intersection(data, gJ.folders);
        });
        loader('off');
    });


    $('.admin-header a[aria-controls="start-panel"]').on('shown.bs.tab', function(e) {

        $('.scan-button').on('click', function() {
            loader();
            getAllImages();
            loader('off');
        });

    });
    // <-- end start panel

    $('.admin-header a[aria-controls="start-panel"]').trigger('click');
};

/*
function setFolderIgnoreButton() {
    // the row ignore button stuff:
    $('#foldersTable .btn-ign').on('click', function() {
        ignoreFolder($(this).closest('tr').attr('data'));
    });
};

function setDeleteFolderButton() {
    // the row delete button stuff:
    $('#foldersTable .btn-del').on('click', function() {
        var dataFolder = $(this).closest('tr').attr('data');
        removeFolder(dataFolder).done(function(data) {
            console.log('folder removed');
            $('#tr-' + dataFolder).remove();
        });
    });
};
*/

function removeImages() {
    var l = imagesRemoved.length;
    var paths = [];
    var i = 0;

    if (l > 0) {
        var id = imagesRemoved[i];

        for (var sz in gJ.sizes) {
            var size = gJ.sizes[sz];
            var file = gJ.images[sz].file;
            var folder = gJ.images[sz].path;
            var gid = folder + '_' + size + file;

            // check if this file's thumbnail is on the server
            if (allImagesFromServer[gid]) {
                paths.push(gJ.images[id].path + '_' + size + '/' + gJ.images[id].file);
            }
        }
    }

    function removeImageSync() {
        if (i < paths.length) {
            removeImage(paths[i])
                .done(function() {
                    i++;
                    delete gJ.images[key];
                    delete imagesRemoved[key];
                    console.log('done ' + i);
                    removeImageSync();
                })
                .fail(function() {
                    i++;
                    console.log('fail ' + i);
                    removeImageSync();
                });
        } else {
            console.log('finished deleting');
            // save JSON:
            $('#deleteImagesButton').off('click').text('save').on('click', function() {
                /*
                 backup().done(function(data){
                 var content = JSON.stringify(gJ);
                 var target = 'gallery.json';
                 saveFileAs(content, target);
                 });
                 */

                saveJSON();
            });
        }
    };

    var p = 0;
    var pl = paths.length;
    removeImageSync();
};

/*
function listAllFolders(cb) {

    return allFolders().done(function(data) {
        //var data = data.sort();

        // remove thumbnail folders:
        var subFolders = _.filter(data, function(v, k) {
            for (var i = 0, len = gJ.sizes.length; i < len; i++) {
                if (v.indexOf(gJ.sizes[i]) > -1) {
                    return v;
                }
            }
        });

        stat.allFolders = _.difference(data, subFolders);
        stat.newFolders = _.difference(_.difference(stat.allFolders, gJ.folders), gJ.ignore);
        var oldFolders = _.intersection(data, gJ.folders);

        if (cb) {
            cb();
        }

    });
};
*/

function buildFolderTable(folders) {
    if (!folders) {
        var folders = stat.allFolders;
    }

    $('#foldersTable tbody').html('');
    for (var i = 0; i < folders.length; i++) {
        var number = i + 1;
        var folder = folders[i];
        // set table row style for new, known or ignored folders:
        var fclass = 'warning';
        if (_.indexOf(gJ.ignore, folder) == -1) {
            fclass = 'default';
        }
        if (_.indexOf(stat.newFolders, folder) > -1) {
            fclass = 'danger';
        }

        var imgtd = ' ';
        if (stat.folderImages[folder] != null) {
            var foIm = stat.folderImages[folder];
            imgtd = foIm[0];
            if (foIm[1] != 0 && foIm[2] != 0) {
                imgtd = imgtd + '/' + foIm[1] + '/' + foIm[2];
            }
        }

        prototype({
            'template': '#foldersTable-row-prototype',
            'selectors': ['number', 'imgtd', 'folder', 'fclass'],
            'values': [number, imgtd, folder, fclass],
            'targets': '#foldersTable tbody'
        });
    };

    $('#foldersTable .btn-scn').on('click', function() {
        stat.workingFolder = $(this).closest('tr').attr('data');
        imagesFromFolder(stat.workingFolder);
    });

    //setFolderIgnoreButton();
    $('#foldersTable .btn-ign').on('click', function() {
        ignoreFolder($(this).closest('tr').attr('data'));
    });
    //setDeleteFolderButton();
    $('#foldersTable .btn-del').on('click', function() {
        var dataFolder = $(this).closest('tr').attr('data');
        removeFolder(dataFolder).done(function(data) {
            console.log('folder removed');
            $('#tr-' + dataFolder).remove();
        });
    });

};




$('#saveButton').on('click', function() {
    //$('#saveButton').prop('disabled', true);
    saveJSON();
});
