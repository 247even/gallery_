jsLoader({
    // path to jsLoader.php
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

function adminInit() {
    console.log("adminInit");

    initLogin();
    //console.log(checkLoggedin());
    console.log(loggedin());
    if(loggedin() == false){
      return false;
    }
    $('#login-screen').hide();

    loader();
    fnf = 0;

    // wait for js to be loaded
    if (typeof request == 'undefined') {
        setTimeout(function() {
            adminInit();
        }, 1000);
        return false;
    }

    // set folder modal
    $('#folder-modal').modal({
        backdrop: 'static'
    });

    $("#modal-add-button").on('click', function() {
        processNewFolder({
            'folder': $('#folder-modal').attr('data')
        });
        $('#folder-modal').modal('hide');
    });

    $("#modal-ignore-button").on('click', function() {
        var folder = $('#folder-modal').attr('data');
        ignoreFolder(folder);
        $('#folder-modal').modal('hide').on('hidden.bs.modal', function(e) {
            stat.newFolders = _.without(stat.newFolders, folder);
        });
    });

    $("#modal-close-button").on('click', function() {
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
        getAllImages(stat.allFolders, false);
        stat.newFolders = _.difference(_.difference(stat.allFolders, gJ.folders), gJ.ignore);
        var oldFolders = _.intersection(data, gJ.folders);

        loader("off");
    });


    $('#allImagesButton').on("click", function() {
        loader();
        getAllImages();
    });

    $('.admin-header a[aria-controls="start-panel"]').on('shown.bs.tab', function(e) {

    });
    // <-- end start panel

    $('.admin-header a[aria-controls="start-panel"]').trigger("click");
};

function ignoreFolder(f) {
    var tr = $("#foldersTable tr[data='" + f + "']");
    if (_.indexOf(gJ.ignore, f) == -1) {
        gJ.ignore.push(f);
        tr.removeClass().addClass("warning");
    } else {
        gJ.ignore = _.without(gJ.ignore, f);
        tr.removeClass().addClass("success");
        console.log(f);
    }
};

function setFolderIgnoreButton() {
    // the row ignore button stuff:
    $("#foldersTable .btn-ign").on("click", function() {
        ignoreFolder($(this).closest("tr").attr("data"));
    });
};

function setDeleteFolderButton() {
    // the row delete button stuff:
    $("#foldersTable .btn-del").on("click", function() {
        var dataFolder = $(this).closest("tr").attr("data");
        removeFolder(dataFolder).done(function(data) {
            console.log("folder removed");
            $("#tr-" + dataFolder).remove();
        });
    });
};

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
            //var path = folder+'_'+size+'/'+file;
            var path = paths[i];
            removeImage(path).done(function() {
                i++;
                delete gJ.images[key];
                delete imagesRemoved[key];
                console.log("done " + i);
                removeImageSync();
            }).fail(function() {
                i++;
                console.log("fail " + i);
                removeImageSync();
            });

        } else {
            console.log("finished deleting");
            // save JSON:
            $("#deleteImagesButton").off("click").text("save").on("click", function() {
                /*
                 backup().done(function(data){
                 var content = JSON.stringify(gJ);
                 var target = "gallery.json";
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

function processImages() {

    loader();

    $('#allImagesButton').off("click").text("resize " + imagesAdded.length + " image/s").on("click", function() {

        window.ri = 0;
        var data = imagesFromFolderData;
        var keys = imagesAdded;
        var length = 0;
        if (keys) {
            var length = keys.length;
        }
        resizeStoreSync(data, keys, length, folder);

    });

    processImages();
    //loader("off");

}; // end function processImages

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
    if(!folders){
      var folders = stat.allFolders;
    }

    $("#foldersTable tbody").html('');
    for (var i = 0; i < folders.length; i++) {
        var number = i + 1;
        var folder = folders[i];
        // set table row style for new, known or ignored folders:
        var fclass = "warning";
        if (_.indexOf(gJ.ignore, folder) == -1) {
            fclass = "default";
        }
        if (_.indexOf(stat.newFolders, folder) > -1) {
            fclass = "danger";
        }

        var imgtd = " ";
        if(stat.folderImages[folder] != null){
            var foIm = stat.folderImages[folder];
            imgtd = foIm[0];
            if(foIm[1] != 0 && foIm[2] != 0){
                imgtd = imgtd+"/"+foIm[1]+"/"+foIm[2];
            }
        }

        prototype({
            'template': '#foldersTable-row-prototype',
            'selectors': ['number', 'imgtd', 'folder', 'fclass'],
            'values': [number, imgtd, folder, fclass],
            'targets': '#foldersTable tbody'
        });
    };

    $("#foldersTable .btn-scn").on("click", function() {
        stat.workingFolder = $(this).closest("tr").attr("data");
        imagesFromFolder(stat.workingFolder);
    });

    //setFolderIgnoreButton();
    $("#foldersTable .btn-ign").on("click", function() {
        ignoreFolder($(this).closest("tr").attr("data"));
    });
    //setDeleteFolderButton();
    $("#foldersTable .btn-del").on("click", function() {
        var dataFolder = $(this).closest("tr").attr("data");
        removeFolder(dataFolder).done(function(data) {
            console.log("folder removed");
            $("#tr-" + dataFolder).remove();
        });
    });

};

function resizeStoreSync(data, keys, length, folder) {

    if (window.ri < length) {
        var key = keys[window.ri];
        var val = data[key];
        var folder = val.path;
        var file = val.file;

        resizeStore(folder, file).done(function(resizeData) {
            window.ri++;

            // add images to gJ
            gJ.images[key] = data[key];

            resizeStoreSync();
        });
    }
};

function checkImages() {

    for (var id in galleryByFolder) {

        if (!allImagesFromServer[id]) {
            // this image was deleted, as it is not in gallery.json
        }

        // search for unprocessed images:
        for (var sz in gJ.sizes) {
            var idkey = folder + '_' + gJ.sizes[sz] + galleryByFolder[id].file;
            //console.log(allImagesFromServer[idkey]);
            if (!allImagesFromServer[idkey]) {
                imagesNotProcessed.push(id);
                imagesNotProcessed = _.uniq(imagesNotProcessed);
                //console.log(imagesNotProcessed);

                $("#imageStatus").html("").html(statusCt + ' ' + imagesNotProcessed.length + ' image/s unprocessed from "' + folder + '".<br>');
            }
        }
    }
};

function addNewImages() {
    var ani = 0;

    function addImages() {

        var length = imagesAddedKeys.length;

        if (length <= 0) {
            return false;
        }

        if (ani < length) {
            var key = imagesAddedKeys[ani];
            var file = imagesAdded[key].file;
            var folder = imagesAdded[key].path;
            console.log(file);

            resizeStore(folder, file).done(function() {
                gJ.images[key] = imagesAdded[key];
                ani++;
                addImages()
            });
        } else {
            console.log("all images added");
            buildGallery(gJ);
            saveStatus(true);
        }

    };
};

var saving = false;

function saveJSON() {
    //saveStatus(false);
    saving = true;
    $("#saveButton").prop('disabled', true).text("saving");
    backup().done(function() {
        var content = JSON.stringify(gJ);
        var target = "gallery.json";
        saveFileAs(content, target).done(function() {
            //saveStatus(true);
            $("#saveButton").prop('disabled', false).text("Save");
            saving = false;
        });
    });
};

function saveStatus(state) {
    var st = (state) ? false : true;
    if (saving) {
        st = true
    }
    $("#saveButton").prop('disabled', st);
};

$("#saveButton").on("click", function() {
    //$("#saveButton").prop('disabled', true);
    saveJSON();
});
