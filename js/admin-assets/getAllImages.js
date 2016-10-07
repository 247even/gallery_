
function getAllImages() {
	var i = 0;
	var si = 0;

	function getImages() {

		var folder = gJ.folders[i];
		var sourceFolder = folder;
		var allImagesFromServer = [];
		// all IDs from gJ filtered by folder:
		var galleryByFolder = _.pickBy(gJ.images, {
			'path' : folder
		});

		function getImagesFromServer() {
			imagesFromFolder(sourceFolder).done(function(tnData) {
				//console.log(tnData);
				_.extend(allImagesFromServer, tnData);
				getImagesFromServerSync();
			}).fail(function() {
				console.log("getImagesFromServerFail");
				getImagesFromServerSync();
			});
		};

		function getImagesFromServerSync() {
			// si = 0 == base folder, without thumbnails
			if (si == 0) {
				getNewImages();
				getRemovedImages();
			}

			if (si < gJ.sizes.length) {

				sourceFolder = folder + '_' + gJ.sizes[si];
				si++;
				//console.log("new sourceFolder: "+sourceFolder);
				getImagesFromServer();
			} else {
				// we now have all images from the server!
				//console.log(allImagesFromServer);
				checkImages();

				// Done! Next folder...
				i++;
				if (i < gJ.folders.length) {
					si = 0;
					//folder = gJ.folders[i];

					console.log("i: " + i + ", gJ.folders.length: " + gJ.folders.length);
					//getImagesFromServerSync();
					getImages();

				} else {

					if (_.size(imagesRemoved) > 0) {
						$('#allImagesButton').off("click").text("remove " + _.size(imagesRemoved) + " images").on("click", function() {

						})
					} else if (_.size(imagesAdded) > 0) {
						$('#allImagesButton').off("click").text("add " + _.size(imagesAdded) + " images").on("click", function() {
							addNewImages();
						})
					} else if (_.size(imagesNotProcessed) > 0) {
						$('#allImagesButton').off("click").text("process " + _.size(imagesNotProcessed) + " images").on("click", function() {

						})
					}
				}
			}
		};

		getImagesFromServer();
		console.log("getImagesFromServer after");
	};// <-- end function allImages()
};
