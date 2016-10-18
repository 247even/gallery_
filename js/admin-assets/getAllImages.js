function getAllImages(folders, d, cb) {
    // deep = if true, include thumbnail folders;

    var i = 0;
    var si = 0;
    var deep = d ? d : false;
    var tmpFolderImages = [];

    function getImages() {
        //var folder = folders[i];
        var folder = stat.allFolders[i];
        console.log("getImages init folder: "+folder);
        stat.workingFolder = folder;
        var sourceFolder = folder;
        console.log("getImages sourceFolder: "+folder);
        var allImagesFromServer = [];

        function getImagesFromServer() {
            imagesFromFolder(sourceFolder).done(function(data) {

                var ol = 0;
                if (data) {
                    ol = Object.keys(data).length;
                    _.extend(allImagesFromServer, data);
                }

                tmpFolderImages[folder] = [ol, 0, 0];

                getImagesFromServerSync();

            }).fail(function() {
                console.log("getImagesFromServer fail");
                getImagesFromServerSync();
            });
        };

        function getImagesFromServerSync() {
            // si = 0 == base folder, without thumbnails
            if (si == 0) {
                //getNewImages();
                //getRemovedImages();
            }

            // deep = true => check thumbnail-folders
            if (deep && si < gJ.sizes.length) {

                sourceFolder = folder + '_' + gJ.sizes[si];
                si++;
                //console.log("new sourceFolder: "+sourceFolder);
                getImagesFromServer();
            } else {
                // we now have all images from the folder!
                //checkImages();

                // Done! Next folder...
                i++;

                //if (i < gJ.folders.length) {
                if (i < stat.allFolders.length) {
                    si = 0;
                    //folder = gJ.folders[i];

                    //console.log("i: " + i + ", gJ.folders.length: " + gJ.folders.length);
                    //getImagesFromServerSync();
                    getImages();

                } else {

                    stat.folderImages = tmpFolderImages;
                    //console.log(stat.folderImages);

                    if (cb) {
                        cb();
                    }
                }
            }
        };

        getImagesFromServer();
    }; // <-- end function getImages()

    getImages();

}; // <-- end function getAllImages()
