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
                stat.imagesNotProcessed.push(id);
                stat.imagesNotProcessed = _.uniq(stat.imagesNotProcessed);
            }
        }
    }
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
