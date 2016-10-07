function processNewFolders(cb) {

		loader();
		if (stat.newFolders.length <= 0) {
			return false;
		}	
		
		processNewFolder({
			'folder' : stat.newFolders[0],
			'cb' : function() {
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
	//stat.newFolders[0]
	
		var folder = d.folder;

	//if (stat.newFolders.length > 0) {

		// read images from first new folder:
		imagesFromFolder(folder).done(function(imagesFromFolderData) {

			//$('#allFoldersButton').off("click").text("process Images").on("click", function() {

			//folder = stat.newFolders[0];

			var keys = _.keys(imagesFromFolderData);
			//var keys = Object.keys(imagesFromFolderData);

			var i = 0;

			function resizeStoreSync() {

				if (i < keys.length) {
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
					});

					// add folder to known folders
					if (_.indexOf(gJ.folders, folder) < 0) {
						gJ.folders.push(folder);
					}
					//$("#tr_" + folder).removeClass("danger");

				} else {
					// all files from folder processed

					if (d.cb) {
						d.cb();
					}
				}
			};// <-- end resizeStoreSync

			resizeStoreSync();

			// ...and remove from stat.newFolders
			stat.newFolders = _.without(stat.newFolders, folder);

			//});
			// <-- end all folder button "process images"

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