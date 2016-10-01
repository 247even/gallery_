function adminInit() {
	console.log("adminInit");

	var imagesRemoved = [];
	var imagesAdded = {};
	var imagesAddedKeys = [];
	var imagesModified = [];
	var imagesNotProcessed = [];

	$('.admin-header a[aria-controls="start-panel"]').on('shown.bs.tab', function(e) {

		loader("off");

		$('#allFoldersButton').on("click", function() {
			loader();
			listAllFolders();
		});

		$('#allImagesButton').on("click", function() {
			loader();
			getAllImages();
		});

		var i = 0;
		var si = 0;

		function getAllImages() {

			var folder = gJ.folders[i];
			var sourceFolder = folder;
			var allImagesFromServer = [];
			// all IDs from gJ filtered by folder:
			var galleryByFolder = _.pickBy(gJ.images, {
				'path' : folder
			});

			function getAllImagesFromServer() {
				imagesFromFolder("folder=" + sourceFolder).done(function(tnData) {
					//console.log(tnData);
					console.log("getAllImagesFromServer done si: " + si);
					_.extend(allImagesFromServer, tnData);
					getAllImagesFromServerSync();
				}).fail(function() {
					console.log("getAllImagesFromServerFail");
					getAllImagesFromServerSync();
				});
			};

			function getAllImagesFromServerSync() {
				// si = 0 == base folder, without thimbnails
				if (si == 0) {
					getNewImages();
					getRemovedImages();
				}

				if (si < gJ.sizes.length) {

					sourceFolder = folder + '_' + gJ.sizes[si];
					si++;
					//console.log("new sourceFolder: "+sourceFolder);
					getAllImagesFromServer();
				} else {
					// we now have all images from the server!
					//console.log(allImagesFromServer);
					//console.log("done!");
					checkImages();

					// Done! Next folder...
					i++;
					if (i < gJ.folders.length) {
						si = 0;
						//folder = gJ.folders[i];

						console.log("i: " + i + ", gJ.folders.length: " + gJ.folders.length);
						//getAllImagesFromServerSync();
						getAllImages();

					} else {

						//			$('#allImagesButton').off("click").text("add " + _.size(imagesAdded) + " new images").on("click", function() {

						//			});

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

			function getNewImages() {
				var ct = $("#imageStatus").html();
				$("#imageStatus").html(ct + '<br> 0 new images found in "' + folder + '".<br>');

				for (var key in allImagesFromServer) {
					if (!gJ.images[key]) {
						// this image is not in gJ, must be new
						imagesAdded[key] = allImagesFromServer[key];
						//imagesAdded.push(allImagesFromServer[key]);
						// bad:
						//imagesAdded = _.uniq(imagesAdded);

						$("#imageStatus").html("").html(_.size(imagesAdded) + ' new image/s found in "' + folder + '".<br>');
					}
				}

				imagesAddedKeys = Object.keys(imagesAdded);
			};

			function getRemovedImages() {

				var statusCt = $("#imageStatus").html();
				$("#imageStatus").html("").html(statusCt + '0 images removed from "' + folder + '".<br>');

				for (var key in galleryByFolder) {

					if (!allImagesFromServer[key]) {
						// this image is not present anymore
						imagesRemoved.push(kk);
						$("#imageStatus").html("").html(statusCt + ' ' + imagesRemoved.length + ' image/s removed from "' + folder + '".<br>');
					}

				}
			};

			function checkImages() {

				console.log(si);

				var statusCt = $("#imageStatus").html();
				$("#imageStatus").html("").html(statusCt + '0 images unprocessed from "' + folder + '".<br>');

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

				loader("off");
			};

			getAllImagesFromServer();
			console.log("getAllImagesFromServer after");

		};// end function allImages

		function removeImage(path) {
			return $.ajax({
				type : "GET",
				url : "gallery/removeImage.php",
				data : "path=" + path
			})
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

		var ani = 0;
		function addNewImages() {

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
					addNewImages()
				});
			} else {
				console.log("all images added");
				buildGallery(gJ);
				saveStatus(true);
			}

		};

		function processImages() {

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

		};// end function processImages

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

			} else {
				console.log("resizeStoreSync else");
			}
		};

		function listAllFolders() {
			allFolders().done(function(data) {
				$("#allFoldersResult").html("");
				//var data = data.sort();
				var subFolders = _.filter(data, function(v, k) {
					for (var i = 0, len = gJ.sizes.length; i < len; i++) {
						if (v.indexOf(gJ.sizes[i]) > -1) {
							console.log(gJ.sizes[i] + ' ' + v);
							return v;
						}
					}
				});

				var folders = _.difference(data, subFolders);
				var newFolders = _.difference(_.difference(folders, gJ.folders), gJ.ignore);
				var oldFolders = _.intersection(data, gJ.folders);
				console.log(newFolders);
				console.log(oldFolders);

				$("#foldersTable tbody").html('');
				for (var i = 0, len = folders.length; i < len; i++) {
					// set table row style for new, known or ignored folders:
					var fclass = "warning";
					if (_.indexOf(gJ.ignore, folders[i]) == -1) {
						fclass = "default";
					}
					if (_.indexOf(newFolders, folders[i]) > -1) {
						fclass = "danger";
					}

					$("#foldersTable tbody").append('<tr id="tr_' + folders[i] + '" data="' + folders[i] + '" class="' + fclass + '" ><td>' + folders[i] + '</td>' + '<td class="td_ign"><button type="button" class="btn btn-default btn-xs btn_ign"><span class="glyphicon glyphicon-ban-circle"></span></button></td>' + '<td class="td_del"><button type="button" class="btn btn-default btn-xs btn_del"><span class="glyphicon glyphicon-remove-circle"></span></button></td>/tr>');

				};

				// the row ignore button stuff:
				$("#foldersTable .btn_ign").on("click", function() {
					var dataFolder = $(this).closest("tr").attr("data");
					if (_.indexOf(gJ.ignore, dataFolder) == -1) {
						gJ.ignore.push(dataFolder);
						$(this).closest("tr").removeClass("success").addClass("warning");
					} else {
						gJ.ignore = _.without(gJ.ignore, dataFolder);
						$(this).closest("tr").removeClass("warning").addClass("success");
					}
				});

				// the row delete button stuff:
				$("#foldersTable .btn_del").on("click", function() {
					var dataFolder = $(this).closest("tr").attr("data");
					removeFolder(dataFolder).done(function(data) {
						console.log("folder removed");
						$("#tr_" + dataFolder).remove();
					});
				});

				if (newFolders.length > 0) {
					$('#processStatus').html(newFolders.length + ' new folder(s) found.');
					$('#allFoldersButton').off("click").text('look for Images in "' + newFolders[0] + '"').on("click", function() {
						processFirstNewFolder();
					});
				}

				loader("off");

			});
		};

		var fnf = 0;

		function processFirstNewFolder() {
			if (newFolders.length > 0) {

				// read images from first new folder:
				var postData = "folder=" + newFolders[0];
				imagesFromFolder(postData).done(function(imagesFromFolderData) {

					$('#processStatus').html(Object.keys(imagesFromFolderData).length + ' image/s found in "' + newFolders[0] + '".');

					$('#allFoldersButton').off("click").text("process Images").on("click", function() {
						folder = newFolders[0];

						// the resizeStore function
						var length = Object.keys(imagesFromFolderData).length;
						var keys = _.keys(imagesFromFolderData);
						var i = 0;

						function resizeStoreSync() {

							if (i < length) {
								var key = keys[i];
								var val = imagesFromFolderData[key];
								var folder = val.path;
								var file = val.file;
								console.log(val);

								resizeStore(folder, file).done(function(data) {
									i++;

									// add images to gJ
									gJ.images[key] = imagesFromFolderData[key];

									console.log(data);
									resizeStoreSync();
								});

								// add folder to known folders
								if (_.indexOf(gJ.folders, folder) < 0) {
									gJ.folders.push(folder);
								}
								$("#tr_" + folder).removeClass("danger");

							} else {

								if (newFolders.length > 0) {
									$('#processStatus').html(newFolders.length + ' new folder(s).');
									$('#allFoldersButton').off("click").text('look for Images in "' + newFolders[0] + '"').on("click", function() {
										processFirstNewFolder();
									});
								}

							}

						};// end resizeStoreSync

						resizeStoreSync();

						// ...and remove from newFolders
						newFolders = _.without(newFolders, folder);
						console.log(newFolders);

					});
					// end all folder button "process images"

				});
				// end images from folder function

				console.log(fnf);
				fnf++;

			} else {

				$('#allFoldersButton').off("click").text("go on").on("click", function() {
					for (var i = 0, len = newFolders.length; i < len; i++) {
						var postData = "folder=" + newFolders[i];
						imagesFromFolder(postData).done(function(data) {
							console.log(data);
						})
					}
				});
			}

		};// end process first new folder

		function allFolders() {
			return $.ajax({
				dataType : "json",
				url : "gallery/allFolders.php",
				type : "POST",
				data : "allFolders"
			}).done(function(data) {
				//callback(data);
				console.log(data);
			});
		};

		function removeFolder(folders) {
			return $.ajax({
				//dataType : "json",
				url : "gallery/removeFolder.php",
				type : "GET",
				data : "folder=" + folders
			});
		};

		function imagesFromFolder(postData) {
			var postData = postData + "&ts=" + Date.now();
			//console.log(postData);
			return $.ajax({
				dataType : "json",
				url : "gallery/imagesFromFolder.php",
				type : "POST",
				data : postData
			}).done(function(data) {
				//console.log(data);
			}).fail(function() {
				console.log("imagesFromFolder fail");
			});
		};

	});
	// <-- end start panel

	$('.admin-header a[aria-controls="start-panel"').trigger("click");
};

jsLoader({
	// path to jsLoader.php
	//'url' : 'jsLoader.php',
	'url' : 'gallery/jsLoader.php',
	'path' : '../js/admin-assets/',
	'outpath' : '/js/',
	'filter' : '*.{js,json}',
	'srcpath' : 'js/',
	'concat' : true,
	'minify' : true,
	'gzip' : true,
	'cache' : true
});

function getAllBackups() {

	return $.ajax({
		type : "GET",
		url : "gallery/allBackups.php",
		data : "allBackups=true&t=" + Date.now()
	}).done(function(data) {
		//console.log(data);
	})
};

function backup() {

	return $.ajax({
		type : "GET",
		url : "gallery/backup.php",
		data : "backup=true"
	}).done(function(data) {
		//console.log(data);
	})
};

function saveFileAs(content, target) {

	var postdata = "content=" + content + "&target=" + target;

	$.ajax({
		type : "GET",
		url : "gallery/saveFileAs.php",
		data : postdata
	}).done(function(data) {
		console.log(data);
	})
};

function resizeStore(folder, file, sizes, force) {
	if (!folder) {
		console.log("no folder!")
		return false;
	}
	if (!file) {
		console.log("no file!")
		return false;
	}
	if (!sizes) {
		var sizes = gJ.sizes.join();
	}
	if (!force) {
		var force = false;
	}
	var postData = 'folder=' + folder + '&file=' + file + '&sizes=' + sizes + '&force=' + force;
	console.log(postData);
	return $.ajax({
		//dataType : "json",
		url : "gallery/resizeStore.php",
		type : "GET",
		data : postData
	}).always(function(data) {
		//console.log(data);
	}).fail(function(data) {
		console.log("fail!");
		//console.log(data);
	})
};

function saveFileAs(content, target) {

	var postdata = "content=" + content + "&target=" + target;

	return $.ajax({
		type : "GET",
		url : "gallery/saveFileAs.php",
		data : postdata
	}).done(function(data) {
		console.log(data);
	})
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

