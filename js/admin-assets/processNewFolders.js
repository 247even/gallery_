function processNewFolders(cb) {

    loader();
    if (stat.newFolders.length <= 0) {
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

    if (!d) {
        console.log("something's missing");
        return false;
    }

    var folder = d.folder;

    // read images from first new folder:
    imagesFromFolder(folder).done(function(imagesFromFolderData) {
        // error:
        var er = false;

        if (imagesFromFolderData) {
					//var keys = _.keys(imagesFromFolderData);
            var keys = Object.keys(imagesFromFolderData);
            var kLength = keys.length;
        } else {
            er = true;
        }

        if (er || kLength < 1) {
            console.log("no images");
						// callback:
            if (d.cb) {
                d.cb();
            }
						stat.newImages = [];
            stat.newFolders = _.without(stat.newFolders, folder);
            return false;
        }

        var i = 0;

        function resizeStoreSync() {

            if (i < kLength) {
                var key = keys[i];
                var val = imagesFromFolderData[key];
                var folder = val.path;
                var file = val.file;
                console.log(val);

                var resizeStore = new _resizeStore(folder, file);
                resizeStore.done(function() {
                    // add images to gJ
                    gJ.images[key] = imagesFromFolderData[key];
                    i++;
                    resizeStoreSync();
                }).fail(function(){
                    i++;
                    resizeStoreSync();
                    console.log("resizeStore error");
                });

                // add folder to known folders
                if (_.indexOf(gJ.folders, folder) < 0) {
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
        stat.newFolders = _.without(stat.newFolders, folder);

    }).fail(function(){
        stat.newFolders = _.without(stat.newFolders, folder);
        console.log("images from folder error");
    });
    // <-- end images from folder function

    fnf++;

    /*
    	} else {

    		$('#allFoldersButton').off("click").text("go on").on("click", function() {
    			for (var i = 0,
    			    len = stat.newFolders.length; i < len; i++) {
    				request.imagesFromFolder(stat.newFolders[i]).done(function(data) {
    					console.log(data);
    				})
    			}
    		});
    	}
    */
};
