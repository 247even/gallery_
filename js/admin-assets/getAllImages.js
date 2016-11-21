
function getAllImages(data) {
    // deep = if true, include thumbnail folders;
    var i = 0;
    var si = 0;
    var deep = data && data.deep ? data.deep : false
    var tmpFolderImages = [];
//    var allImagesFromServer = {};
    var sourceFolder = stat.allFolders[0];

    function getImages() {

        var folder = stat.allFolders[i];
        stat.workingFolder = folder;

        imagesFromFolder(sourceFolder).done(function(data) {
            var ol = 0;
            console.log(data);
            if (data) {
                ol = Object.keys(data).length;
                for (var key in data) {
                    stat.existingImages[key] = data[key];
                }
            }
            tmpFolderImages[folder] = [ol, 0, 0];
        }).fail(function() {
            //console.log('imagesFromFolder fail');
        }).always(function() {
            // si = 0 == base folder, without thumbnails
            if (si === 0) {
                // getNewImages();
                // getRemovedImages();
            }

            // deep === true => check thumbnail-folders
            if (deep && si < options.sizes.length) {
                sourceFolder = folder + '_' + options.sizes[si];
                si++;
                getImages();
            } else {
                // we now have all images from this folder
                //checkImageSizes();

                // Done! Next folder...
                i++;
                if (i < stat.allFolders.length) {
                    si = 0;
                    sourceFolder = stat.allFolders[i];
                    getImages();
                } else {
                    stat.folderImages = tmpFolderImages;
                    if (data && data.cb) {
                        data.cb();
                    }
                }
            }
        });
    };

    getImages();
};
