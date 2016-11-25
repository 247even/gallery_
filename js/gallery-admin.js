jsLoader({
    url: 'jsLoader.php',
    path: 'js/admin-assets/',
    outpath: '/js/',
    filter: '*.{js,json}',
    srcpath: 'js/',
    concat: true,
    minify: false,
    skipmin: false,
    gzip: false,
    cache: false
});

var fnf = 0;
var autoprocess = false;

function adminInit() {
   //console.log('adminInit');

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

    stat._ignoreFolders = gJ.ignore;
    //jsCheckLoad( 'adminAssets', adminInit() );

    allFolders().done(function(data) {

        var folders = withoutGalleryBase(data);

        // remove thumbnail folders:
        var fl = folders.length;
        var osl = options.sizes.length;
        for (var i = 0; i < osl; i++) {
            var size = options.sizes[i];
            for (var j = 0; j < fl; j++) {
                if (folders[j].includes(size)) {
                    folders.splice(j,1);
                    fl = folders.length;
                }
            }
        }

        stat.allFolders = folders;
        stat._ignoreFolders = stat._ignoreFolders.filter(function(val){
            if (stat.allFolders.indexOf(val) > -1) {
                return val;
            }
        });


        getAllImages({
            folders: stat.allFolders,
            cb: function() {
                for (var key in stat.existingImages) {
                    if (checkIrregularFilename(key).error) {
                      console.log(checkIrregularFilename(key));
                    }
                }
                checkImageSizes(stat.allImages,true,function(){
                    console.log(stat.imagesNotProcessed);
                });
                //stat.newFolders = _.difference(_.difference(stat.allFolders, gJ.folders), gJ.ignore);
                stat.newFolders = arrayDiff(arrayDiff(stat.allFolders, gJ.folders), gJ.ignore);
                //var oldFolders = _.intersection(data, gJ.folders);
                var oldFolders = arrayIntersection(data, gJ.folders);
            }
        });
        loader('off');
    });

    $('.admin-header a[aria-controls="start-panel"]').trigger('click');
};

function buildFolderTable(folders) {
    if (!folders) {
        var folders = stat.allFolders;
    }

    $('#foldersTable').find('tbody').html('');
    for (var i = 0; i < folders.length; i++) {
        var number = i + 1;
        var folder = folders[i];
        // set table row style for new, known or ignored folders:
        var fclass = 'warning';
        if (stat.ignoreFolders.indexOf(folder) === -1) {
            fclass = 'default';
        }
        if (stat.newFolders.indexOf(folder) > -1) {
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

    $('#foldersTable').find('.btn-scn').on('click', function() {
        loader();
        stat.workingFolder = $(this).closest('tr').attr('data');
        imagesFromFolder(stat.workingFolder).done(function() {
            loader('off');
            if (stat.newImages.length > 0) {
                bootbox.confirm({
                    title: stat.newImages.length + " new images found!",
                    message: 'Process ' + stat.newImages.length + ' new images in "' + stat.workingFolder + '"?',
                    buttons: {
                        confirm: {
                            label: '<i class="fa fa-check"></i> Yes'
                        },
                        cancel: {
                            label: '<i class="fa fa-times"></i> No'
                        }
                    },
                    size: 'small',
                    callback: function(result) {
                        if (result) {
                            addNewImages();
                        }
                    }
                });
            } else {
                bootbox.alert({
                    message: "No new images found.",
                    size: 'small',
                    backdrop: true
                });
            }
        });
    });

    $('#foldersTable').find('.btn-ign').on('click', function() {
        var folder = $(this).closest('tr').attr('data');
        var msg = 'Ignore folder "' + folder + '"?';
        if (stat.ignoreFolders.indexOf(folder) > -1) {
            msg = 'Add folder "' + folder + '"?';
        }
        bootbox.confirm({
            size: 'small',
            message: msg,
            callback: function(result) {
                if (result) {
                    stat.ignoreFolders = folder;
                }
            }
        });
    });

    $('#foldersTable').find('.btn-del').on('click', function() {
        var folder = $(this).closest('tr').attr('data');
        var msg = 'Delete folder "' + folder + '"?'
        bootbox.confirm({
            size: 'small',
            message: msg,
            callback: function(result) {
                if (result) {
                    deleteFolderRelations(folder, function() {
                        $('#tr-' + folder).remove();
                    });
                }
            }
        });
    });

};


$('#saveButton').on('click', function() {
    //$('#saveButton').prop('disabled', true);
    saveJSON();
});
