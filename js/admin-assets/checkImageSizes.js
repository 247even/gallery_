

function checkImageSizes(images, deep, cb) {
    console.log('checkImageSizes');

    var images = images || gJ.images;
    var imagesLength = images.length;
    // if 'images' is not an array, but an object:
    if (!imagesLength) {
        var imageKeys = Object.keys(images);
        imagesLength = imageKeys.length;
    };
    var sizesLength = gJ.sizes.length;
    // deep true = request image from server
    var deep = deep ? true : false;
    //deep = true;
    var id = 0;
    var sz = 0;

    function checkImage() {
        //console.log('checkImage');
        if (id < imagesLength) {
            var image = images[imageKeys[id]];
            var folder = image.folder;
            //console.log('checkImageSizeFolder: ' + folder);

            if (sz < sizesLength) {
                var sizeId = folder + '_' + gJ.sizes[sz] + image.file;
                var path = 'gallery/' + folder + '_' + gJ.sizes[sz] + '/' + image.file;

                // deep: request each image from server
                if (deep) {
                    fileExists(path)
                        .done(function() {
                            //console.log(path + ' does deep exist');
                        })
                        .fail(function() {
                            //console.log(path + ' does not deep exist');
                            if (stat.imagesNotProcessed.indexOf(imageKeys[id]) === -1) {
                                stat.imagesNotProcessed.push(imageKeys[id]);
                            }
                            //stat.imagesNotProcessed = stat.imagesNotProcessed.unique();
                        })
                        .always(function() {
                            sz++;
                            checkImage();
                        });

                    return false;
                }

                // quick check against all images in stat.allImages:
                if (!stat.allImages[sizeId]) {
                    //console.log(sizeId + ' does not exist');
                    stat.imagesNotProcessed.push(id);
                    stat.imagesNotProcessed = stat.imagesNotProcessed.unique();
                }
                sz++;
                checkImage();

            } else {
                sz = 0;
                id++;
                checkImage();
            }

        } else {
            //console.log("check image done");
            if (cb) {
                cb();
            }
        }
    };

    // initial call:
    checkImage();
};
