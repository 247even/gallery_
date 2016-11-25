function processNewFolders(cb) {

    loader();

    if (stat.newFolders.length === 0) {
        return false;
    }

    processNewFolder({
        'folder': stat.newFolders[0],
        'cb': function() {
            if (stat.newFolders.length > 0) {
                // if there are new folders left, do it again...
                processNewFolders();

            } else {

                if (cb) {
                    cb();
                }
            }
        }
    });
};

function processNewFolder(d) {
   //console.log("processNewFolder()");

    var folder = d ? d.folder : stat.workingFolder;

    // read images from folder:
    imagesFromFolder(folder).done(function(imagesFromFolderData) {
        // error:
        var er = false;

        if (imagesFromFolderData) {
            var keys = Object.keys(imagesFromFolderData);
            var kLength = keys.length;
        } else {
            // somethings wrong with the response, so error = true
            er = true;
        }

        if (er || kLength < 1) {
           //console.log("no images");
            stat.newImages = [];
						// callback:
            if (d.cb) {
                d.cb();
            }
            //stat.newFolders = _.without(stat.newFolders, folder);
            return false;
        }

        stat.newImages = keys;

        var i = 0;

        function resizeStoreSync() {

            if (i < kLength) {
                //var key = keys[i];
                var key = stat.newImages[0];
                var val = imagesFromFolderData[key];
                var folder = val.folder;
                var file = val.file;

                stat.workingImage = file;

                var resizeStoreSizes = new _resizeStoreSizes(folder, file);
                resizeStoreSizes.done(function() {
                    // add images to gJ
                    //stat.newImages = _.without(stat.newImages, key);
                    stat.newImages = arrayWithout(stat.newImages, [key])
                    gJ.images[key] = imagesFromFolderData[key];
                    i++;
                    resizeStoreSync();
                });

                // add folder to known folders
                if (gJ.folders.indexOf(folder) === -1) {
                    gJ.folders.push(folder);
                }

            } else {
                // all files from folder processed
                if (d.cb) {
                    d.cb();
                }
            }
        }; // <-- end resizeStoreSync

        resizeStoreSync();

        // ...and remove from stat.newFolders
        //stat.newFolders = _.without(stat.newFolders, folder);
        stat.newFolders = arrayWithout(stat.newFolders, [folder]);

    }).fail(function(){
        //stat.newFolders = _.without(stat.newFolders, folder);
        stat.newFolders = arrayWithout(stat.newFolders, [folder]);
       //console.log("images from folder error");
    });
    // <-- end images from folder function

    fnf++;

};
