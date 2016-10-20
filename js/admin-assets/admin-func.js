function ignoreFolder(f) {
    var tr = $("#foldersTable tr[data='" + f + "']");
    if (_.indexOf(gJ.ignore, f) == -1) {
        gJ.ignore.push(f);
        tr.removeClass().addClass('warning');
    } else {
        gJ.ignore = _.without(gJ.ignore, f);
        tr.removeClass().addClass('success');
        console.log(f);
    }
};

function processImages() {

    loader();

    $('#allImagesButton').off('click').text('resize ' + imagesAdded.length + ' image/s').on('click', function() {

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
    //loader('off');

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
            console.log('all images added');
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

function checkImageSizes(images, deep, cb) {
    console.log('checkImageSizes');

    var images = (images) ? images : gJ.images;
    var imagesLength = images.length;
    // if 'images' is not an array, but an object:
    if (!imagesLength) {
        var imageKeys = Object.keys(images);
        imagesLength = imageKeys.length;
    };
    var sizesLength = gJ.sizes.length;
    var deep = (deep) ? true : false;
    deep = true;
    var id = 0;
    var sz = 0;

    function checkImage() {
        console.log('checkImage');
        if (id < imagesLength) {
            var image = images[imageKeys[id]];
            var folder = image.path;
            console.log('checkImageSizeFolder: ' + folder);

            if (sz < sizesLength) {
                var sizeId = folder + '_' + gJ.sizes[sz] + image.file;
                var path = 'gallery/' + folder + '_' + gJ.sizes[sz] + '/' + image.file;

                // deep: request each image from server
                if (deep) {
                    fileExists(path)
                        .done(function() {
                            console.log(path + ' does deep exist');
                        })
                        .fail(function() {
                            console.log(path + ' does not deep exist');
                            stat.imagesNotProcessed.push(id);
                            stat.imagesNotProcessed = _.uniq(stat.imagesNotProcessed);
                        })
                        .always(function() {
                            sz++;
                            checkImage();
                        });

                    return false;
                }

                // quick check against all images in stat.allImages:
                if (!stat.allImages[sizeId]) {
                    console.log(sizeId + ' does not exist');
                    stat.imagesNotProcessed.push(id);
                    stat.imagesNotProcessed = _.uniq(stat.imagesNotProcessed);
                }
                sz++;
                checkImage();

            } else {
                sz = 0;
                id++;
                checkImage();
            }
        } else {
            console.log("check image done");
            if (cb) {
                cb();
            }
        }
    };

    // initial call:
    checkImage();
};


function getNewImages(images) {

    if (!images) {
        var images = stat.allImages;
    }

    var match = [];
    stat.newImages = [];

    for (var key in images) {
        if (!gJ.images[key]) {
            // this image is not in gJ, must be new
            //match[key] = images[key];
            match.push(key);
        }
    }

    if (match.length > 0) {
        // we have new images
        console.log('we have ' + match.length + ' new images');
    }
    stat.newImages = match;
    return match;


    /*
        var matchKeys = Object.keys(match);
        if (matchKeys.length > 0) {
            // we have new images
            console.log('we have '+matchKeys.length+' new images');
            stat.newImages = matchKeys;
            return matchKeys;
        }
        return false;
        */
};

function gjFilteredByFolder(fo) {
    var folder = (fo) ? fo : stat.workingFolder;

    // all IDs from gJ filtered by folder:
    return _.pickBy(gJ.images, {
        'path': folder
    });
};

function deleteFolderRelations(folder, cb) {
    var folders = [folder];
    var sizesLength = gJ.sizes.length;
    var i = 0;

    //check if folder is in 'ignore' and remove it
    var ignoreKey = gJ.ignore.indexOf(folder);
    if (ignoreKey > -1) {
        gJ.ignore.splice(ignoreKey, 1);
    } else {
        // remove images from galleryJSON:
        _.omitBy(gJ.images, {
            'path': folder
        });
    }

    for (var l = 0; l < sizesLength; l++) {
        folders.push(folder + '_' + gJ.sizes[l]);
    }

    function deleteFolder() {
        if (i < folders.length) {
            removeFolder(folders[i])
                .done(function() {

                })
                .always(function() {
                    i++
                    deleteFolder();
                });
        } else {
            console.log('deleteFolder done');
            if (cb) {
                cb();
            }
        }
    }

    deleteFolder();
};

function getRemovedImages(folder) {
    var galleryByFolder = gjFilteredByFolder(folder);
    for (var key in galleryByFolder) {
        if (!stat.imagesFromFolder[key]) {
            // this image is not present anymore
            stat.imagesRemoved.push(kk);
        }
    }
};

var saving = false;

function saveJSON() {
    //saveStatus(false);
    saving = true;
    $('#saveButton').prop('disabled', true).text('saving');
    backup().done(function() {
        var content = JSON.stringify(gJ);
        var target = 'gallery.json';
        saveFileAs(content, target).done(function() {
            //saveStatus(true);
            $('#saveButton').prop('disabled', false).text('Save');
            saving = false;
        });
    });
};

function saveStatus(state) {
    var st = (state) ? false : true;
    if (saving) {
        st = true
    }
    $('#saveButton').prop('disabled', st);
};
