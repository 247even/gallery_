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

	/* options */

	//$('#optionsForm').validator();

	$('.admin-header a[aria-controls="options-panel"]').on('shown.bs.tab', function(e) {

		$('#configReset').click(function() {
			$('#optionsForm')[0].reset();
			buildGallery(gJ);
		});

		// pre-/re-set thumbSize
		var thumbSize = !gJ.thumbDisplay ? "md" : gJ.thumbDisplay;
		$("#thumbDisplaySelect").val(thumbSize);

		$("#thumbDisplaySelect").on("change", function() {
			var value = $(this).val();

			var proportion = gJ.thumbProportion;
			proportion = !proportion ? [1, 1] : proportion.split(',');

			/*
			 var tpgi = document.querySelector('.gallery-item');
			 addClasses(tpgi, thumbSize);
			 */

			var thumbSize = !gJ.thumbDisplay ? "md" : gJ.thumbDisplay;

			//str.split(",").join("")

			var tds = thumbDisplaySizes[thumbSize]
			removeClasses(".gallery-item", tds);

			gJ.thumbDisplay = value;

			ntds = thumbDisplaySizes[value].toString();
			ntds = ntds.replace(/,/g, " ");
			console.log(ntds);
			$('.gallery-item').addClass(ntds).proportion(proportion[0], proportion[1]);

			saveStatus(true);
		});

		// pre-/re-set Proportion
		var thumbProp = !gJ.proportion ? "1,1" : gJ.proportion;
		$("#thumProportionSelect").val(thumbProp);

		$("#thumbProportionSelect").on("change", function() {
			var value = $(this).val();
			gJ.thumbProportion = value;
			value = value.split(',');
			$(".gallery-item").proportion(value[0], value[1]);
			saveStatus(true);
		});

		// pre-/re-set thumbFit
		var thumbFit = !gJ.thumbFit ? "cover" : gJ.thumbFit;
		$("#thumbFitSelect").val(thumbFit);

		$("#thumbFitSelect").on("change", function() {
			var value = $(this).val();
			gJ.thumbFit = value;
			$(".gallery-item .thumb-div").removeClass('cover-image contain-image').addClass(value + '-image');
			saveStatus(true);
		});

		// pre-/re-set thumbFit
		var thumbPadding = !gJ.thumbPadding ? 0 : gJ.thumbPadding;
		$("#thumbPaddingInput").val(thumbPadding);

		$("#thumbPaddingInput").keydown(function() {
			// Allow: backspace, delete, tab, escape, enter
			if ($.inArray(e.keyCode, [46, 8, 9, 27, 13]) !== -1 ||
			// Allow: Ctrl+A
			(e.keyCode == 65 && e.ctrlKey === true) ||
			// Allow: Ctrl+C
			(e.keyCode == 67 && e.ctrlKey === true) ||
			// Allow: Ctrl+X
			(e.keyCode == 88 && e.ctrlKey === true) ||
			// Allow: home, end, left, right
			(e.keyCode >= 35 && e.keyCode <= 39)) {
				// let it happen, don't do anything
				return;
			}
			// Ensure that it is a number and stop the keypress
			if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
				e.preventDefault();
			}
		});

		$("#thumbPaddingInput").on("change input", function() {
			var value = $(this).val();
			value = (!value || value < 1) ? 0 : value;
			gJ.thumbPadding = value;
			$(".gallery-item").css("padding", value + "px");
			saveStatus(true);
		});

		$("#inputSizes").attr('placeholder', gJ.sizes).keydown(function(e) {
			// Allow: backspace, delete, tab, escape, enter and ,
			if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 188]) !== -1 ||
			// Allow: Ctrl+A
			(e.keyCode == 65 && e.ctrlKey === true) ||
			// Allow: Ctrl+C
			(e.keyCode == 67 && e.ctrlKey === true) ||
			// Allow: Ctrl+X
			(e.keyCode == 88 && e.ctrlKey === true) ||
			// Allow: home, end, left, right
			(e.keyCode >= 35 && e.keyCode <= 39)) {
				// let it happen, don't do anything
				return;
			}
			// Ensure that it is a number and stop the keypress
			if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
				e.preventDefault();
			}
		});

		$("#inputSizes").on("change input", function() {
			var value = $(this).val().split(',');
			value = _.sortBy(_.uniq(_.compact(_.map(value, _.parseInt))));
			gJ.sizes = value;
			saveStatus(true);
		});

		$("#coverCheckbox").click(function(e) {
			e.stopImmediatePropagation();
			var element = (e.currentTarget.htmlFor !== undefined) ? e.currentTarget.htmlFor : e.currentTarget;
			var checked = (element.checked) ? false : true;
			element.checked = (checked) ? false : checked.toString();
			saveStatus(true);
		});

	});

	/* Tags Panel */

	$('.admin-header a[aria-controls="tags-panel"]').on('shown.bs.tab', function(e) {
		var selectedImages;

		function selectTags() {

			selectedImages = $(".gallery-row .selected-image");

			var firstTag = selectedImages.first().attr('data-tags');
			firstTag = _.split(firstTag, ',');

			var groupTags = $("#input-tags").attr("value").split(',');
			var interTags;
			var firstTags;
			var selectedTags = [];
			var i = 0;

			if (selectedImages.length == 1) {

				selectedTags = groupTags = interTags = firstTag;

			} else if (selectedImages.length > 1) {

				if (!groupTags[0]) {
					groupTags = firstTag;
				}

				selectedImages.each(function() {
					i++;
					attrTags = $(this).attr('data-tags');
					attrTags = attrTags.split(',');

					// all unique selected tags:
					selectedTags = _.union(selectedTags, attrTags);
					groupTags = _.intersection(groupTags, attrTags);

				});

			} else {
				console.log("nothing selected");
				selectedTags = [];
				groupTags = [];
			}

			$("#input-tags").attr("value", groupTags);

			var selectizeTags = $("#input-tags")[0].selectize;
			selectizeTags.clear();
			$.each(groupTags, function(i, v) {
				selectizeTags.createItem(v);
			})
			selectizeTags.refreshItems()

			$(".selectize-input .item").on("click", function() {
				var value = $(this).attr("data-value");

				$($(".gallery-row .gallery-item")).each(function(k) {
					var tags = $(this).attr("data-tags");
					if (tags.includes(value)) {
						$(this).addClass('selected-image');
					}
				});
			});

			return groupTags;
		};

		$('#input-tags').selectize({
			plugins : ['remove_button'],
			delimiter : ',',
			create : function(input) {
				//console.log("create: " + input);
				input = input.split(',');
				selectedImages.each(function() {
					var dataTags = $(this).attr('data-tags');
					dataTags = dataTags.split(',');
					unionTags = _.union(dataTags, input);
					if (unionTags != dataTags) {
						$(this).attr('data-tags', unionTags).addClass('edited');
					}
				});

				return {
					"text" : input,
					"value" : input
				};
			}
		});

		$(".gallery-row .gallery-item").removeClass("selected-image").off("click").on("click", function(e) {
			e.preventDefault();
			e.stopPropagation();

			$(this).toggleClass("selected-image");

			selectTags();

			return false;
		});

		selectTags();

		$("#tagsSubmit").click(function(e) {
			e.preventDefault();

			var tags = [];

			$(".gallery-row .edited").each(function() {
				var this_id = $(this).attr("data-id");
				var this_tags = $(this).attr("data-tags");
				this_tags = this_tags.split(',');
				gJ.images[this_id].tags = this_tags;
			});

			$.each(gJ.images, function(k, v) {
				tags.push(v.tags);
			})
			tags = _.uniq(_.flattenDeep(tags));
			gJ.tags = tags;
			buildGalleryNavigation();

			saveStatus(true);

			//console.log(tagsJSON);
			return false;

			var postdata = $("#tags-form").serialize();

			// ?????
			/*
			 console.log(postdata);
			 $.ajax({
			 type : "GET",
			 url : "gallery/save.php",
			 data : postdata,
			 success : function(data) {
			 console.log(data);

			 }
			 })
			 */
		});

		function deleteSelectedImages() {
			var i = 0;
			var paths = [];

			if (selectedImages.length > 0) {
				selectedImages.each(function() {
					i++;
					var id = $(this).attr('data-id');
					// For testing! >>
					//paths.push(gJ.images[id].path+'/'+gJ.images[id].file);
					for (var sz in gJ.sizes) {
						var size = gJ.sizes[sz];
						paths.push(gJ.images[id].path + '_' + size + '/' + gJ.images[id].file);
					}
					delete gJ.images[id];
				})
				function deleteImage(path) {
					if (paths.length > 0) {
						$.ajax({
							type : "GET",
							url : "gallery/removeImage.php",
							data : "path=" + path
						}).done(function() {
							p++;
							console.log("done " + p);
							deleteFinished();
						}).fail(function() {
							p++;
							console.log("fail " + p);
							deleteFinished();
						})
					}
				};

				var p = 0;
				var pl = paths.length;

				function deleteFinished() {
					if (p <= pl) {
						deleteImage(paths[p]);
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

				deleteFinished();
			}
		};

		$("#deleteImagesButton").on("click", function() {
			console.log("delete clicked");
			deleteSelectedImages();
		});

	});

	/* Sliders */

	$('.admin-header a[aria-controls="slider-panel"]').on('shown.bs.tab', function(e) {

		var blurIntensity = 5;

		document.getElementById('blur-slider').value = blurIntensity;
		document.getElementById('blur-input').value = blurIntensity;

		function fullScreen(img) {
			var ef = document.getElementById("effect-fullscreen");
			document.getElementById("effect-preview-image").addEventListener("click", function() {
				ef.style.display = 'block';
				ef.style.backgroundImage = 'url(' + img + ')';
			});
			ef.addEventListener("click", function() {
				ef.style.display = 'none';
			});
		};

		function loadBlur() {

			var imgSrc = document.querySelector("#sliderSortable .selected-image .thumb-div").getAttribute("respi-path");
			$("#blurPath").val(imgSrc);
			var imgSrcSplit = imgSrc.split("/");
			var imgSrc_720 = imgSrc.replace("_respi", "_720");
			var imgSrc_720_blur = imgSrc_720.replace("gallery", "gallery/blur");

			//document.querySelector("#blur-status").innerHTML = "Static blur image not found.";

			$("#blurImageFrame img").attr('src', imgSrc_720).imagesLoaded().always(function() {
				console.log("blur image not loaded");
			}).done(function() {
				blur('#effect-preview-image', blurIntensity);
				fullScreen(imgSrc_720);
				blur('#effect-fullscreen', blurIntensity);
			});

			/*
			 $("#blurImageFrame img").attr('src', imgSrc_720_blur + '?ts=' + Date.now()).imagesLoaded().always(function(instance) {
			 //console.log('blur image request');
			 }).done(function(instance) {
			 document.querySelector("#blur-status").innerHTML = "Static blur image found.";
			 fullScreen(imgSrc_720_blur);
			 //console.log("blur image loaded");
			 }).fail(function() {
			 console.log('image failure');
			 document.querySelector("#blur-status").innerHTML = "Static blur image not found.";

			 $("#blurImageFrame img").attr('src', imgSrc_720).imagesLoaded().always(function() {
			 console.log("blur image not loaded");
			 }).done(function() {
			 blur('#effect-preview-image', blurIntensity);
			 fullScreen(imgSrc_720);
			 blur('#effect-fullscreen', blurIntensity);
			 });

			 });
			 */

		};

		$("#blur-slider").rangeslider({
			polyfill : false,
			onInit : function(position, value) {
				//document.getElementById("blur-input").value = value;
			},
			onSlide : function(position, value) {
				document.getElementById("blur-input").value = value;
			},
			onSlideEnd : function(position, value) {
				blurIntensity = value;
				document.getElementById("blur-input").value = value;
				blur('#effect-preview-image', value);
				blur('#effect-fullscreen', value);
			}
		});

		$("#blur-input").on("change", function() {
			var bsval = document.getElementById("blur-slider").value;
			if (bsval != this.val) {
				$("#blur-slider").val(this.value).change();
			}
		});

		$("#blur-submit").click(function(e) {
			e.preventDefault();
			var postdata = $("#blur-form").serialize();
			console.log(postdata);
			$.ajax({
				type : "GET",
				url : "gallery/blur.php",
				data : postdata,
				success : function(data) {
					console.log(data);
					if (data == "done") {
						loadBlur();
					}
				}
			})
		});

		$(".gallery-row .selected-image").removeClass("selected-image");
		//	$('.sortable').sortable('destroy');
		document.getElementById('sliderSortable').innerHtml = "";

		var nS = document.getElementById("sliderNumber");
		var sliderNumber = nS.options[nS.selectedIndex].text;
		nS.addEventListener("change", function() {
			sliderNumber = nS.options[nS.selectedIndex].text;
			//console.log(nS.options[nS.selectedIndex].text);
		});

		function selectedIds() {
			var selected_ids = [];
			var items = document.querySelectorAll("#sliderSortable .gallery-item");
			for (var i = 0, len = items.length; i < len; i++) {
				selected_ids.push(items[i].getAttribute("data-id"));
			}
			return selected_ids;
		};

		function autoIds(q) {

			if (!$("#sliderSortable").is(':empty')) {
				$("#sliderSortable .gallery-item").each(function() {
					var did = $(this).attr('data-id');
					console.log(did);
					//$('[data-id="'+did+'"]').addClass("selected-image");

					$('.gallery-row [data-id="' + did + '"]').addClass("selected-image");
				});
				return false;
			}

			var slider1 = gJ.sliders[0];
			if (slider1.length > 1 || slider1 != "auto") {
				/*
				 for (var i = 0, len = slider1.length; i < len; i++) {
				 $('*[data-id="'+slider1[i]+'"]').addClass("selected-image");
				 }
				 */

				for (var i = 0, len = slider1.length; i < len; i++) {
					console.log(slider1[i]);
					$('*[data-id="' + slider1[i] + '"]').addClass("selected-image");
					document.querySelector('.gallery-row div[data-id="' + gJ.sliders[0][i] + '"]').click();
				}
			}

			return false;

			var a = sliderNumber;
			if (q) {
				a = q;
			}
			var ids = [];
			$(".gallery .gallery-item").each(function(k, v) {
				if (k < a) {
					ids.push($(this).attr('data-id'));
				}
			});
		};
		autoIds();

		/*
		 sortable('.sortable',{
		 placeholderClass: 'col-xs-3 gallery-item sort-placeholder',
		 forcePlaceholderSize: true
		 //hoverClass: 'sort-placeholder'
		 });

		 sortable('.sortable')[0].addEventListener('sortupdate', function(e) {
		 console.log(e);
		 gJ.sliders["slider1"] = selectedIds();
		 saveStatus(true);
		 });
		 */

		function reset() {
			removeClasses(".gallery-item", ["selected-image"]);
			//$(".gallery-item").removeClass("selected-image");
			clearHtml(["#sliderSortable"]);
			//$("#sliderSortable").html("");
		};

		$("#sliderClear").on("click", function(e) {
			reset();
		});

		$("#sliderAuto").on("click", function(e) {

			reset();

			var sliderNumber = nS.options[nS.selectedIndex].text;
			$(".gallery .gallery-item").each(function(k, v) {
				if (k < sliderNumber) {
					$(this).trigger('click');
				}
			});

			gJ.sliders[0] = [];

		});

		/*
		 $(".gallery-row .gallery-item").removeClass("selected-image").off("click").on("click", function(e) {
		 e.preventDefault();
		 e.stopPropagation();
		 $(".gallery-item").removeClass("selected-image");
		 $(this).addClass("selected-image");

		 loadBlur();
		 });
		 */

		sortable('.sortable', {
			placeholderClass : 'col-xs-2 gallery-item sort-placeholder',
			forcePlaceholderSize : true,
			hoverClass : 'is-hovered'
		})

		sortable('.sortable')[0].addEventListener('sortupdate', function(e) {
			gJ.sliders[0] = selectedIds();
			saveStatus(true);
		});

		$(".gallery-row .gallery-item").off("click").on("click", function(e) {

			e.preventDefault();
			e.stopPropagation();

			$(this).toggleClass("selected-image");

			if ($(this).hasClass("selected-image")) {

				$("#sliderSortable .gallery-item").removeClass("selected-image");

				var cl = 'thumbSize gallery-item col-xs-2 selected-image sortable-item'
				$(this).clone().off().removeClass().addClass(cl).appendTo("#sliderSortable").on("click", function() {
					$("#sliderSortable .gallery-item").removeClass("selected-image");
					$(this).addClass("selected-image");
					loadBlur();
				});

			} else {
				var data_id = $(this).attr("data-id");
				$("#sliderSortable div[data-id='" + data_id + "']").remove();
			}

			$("#sliderSortable .gallery-item a").remove();

			// set same height for chrome
			var el = document.querySelector("#sliderSortable .gallery-item");
			proportion([el], 1, 1);
			$("#sliderSortable .gallery-item").css('height', Math.round(el.offsetHeight));

			sortable('.sortable');

			loadBlur();

			var selected_ids = selectedIds();
			var prop = (selected_ids.length >= 2) ? false : true;
			$("#sliderSubmit").prop("disabled", prop);

			gJ.sliders[0] = selected_ids;
			saveStatus(true);

		});

		/*
		 $('.sortable').sortable('.sortable',{
		 placeholderClass: 'col-xs-3 gallery-item sort-placeholder',
		 forcePlaceholderSize: true,
		 hoverClass: 'is-hovered'
		 }).unbind('sortupdate').bind('sortupdate', function(e, ui) {
		 gJ.sliders["slider1"] = selectedIds();
		 saveStatus(true);
		 });

		 $("#sliderSubmit").on("click", function(e) {
		 e.preventDefault();
		 console.log(selectedIds());
		 gJ.sliders["slider1"] = selectedIds();
		 saveStatus(true);
		 });
		 */

	});

	/* Upload Panel */
	$('.admin-header a[aria-controls="upload-panel"]').on('shown.bs.tab', function(e) {

		var upldrData = {};

		function folderSelect() {
			$('#upload-folder-select').html('');
			for (var i = 0; gJ.folders.length > i; i++) {
				var folder = gJ.folders[i];
				prototype({
					'template' : '#folder-select-prototype',
					'selectors' : ['folder'],
					'values' : [folder],
					'targets' : '#upload-folder-select'
				});
			}
		};
		folderSelect();

		function createFolder(path) {
			var data = 'folder=' + path;
			var request = new XMLHttpRequest();
			request.open('POST', './gallery/createFolder.php', true);
			request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
			request.onload = function() {
				if (request.status >= 200 && request.status < 400) {
					var resp = request.responseText;
					gJ.folders.push(path);
					folderSelect();
					console.log(resp);
				} else {
					// We reached our target server, but it returned an error
				}
			};
			request.send(data);
		};

		function filesToGJ(f) {
			for ( i = 0; f.length > i; i++) {

			}
		};

		$('#new-folder-name').on('keypress', function (event) {
		    var regex = new RegExp("^[a-zA-Z0-9_-]+$");
		    var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
		    if (!regex.test(key)) {
		       event.preventDefault();
		       return false;
		    }
		});

		$("#new-folder-btn").on('click', function() {
			var val = $('#new-folder-name').val();
			if (val) {
				val = val.trim();
				if($.inArray(val, gJ.folders) < 0 || $.inArray(val, gJ.ignore)){
					console.log('folder already present');
					return false;
				}
				createFolder(val);
			}
		});

		$("#upload-tags").on("change", function() {
			var value = $(this).val();
			if (value && value != ' ') {
				value = value.trim();
				value = value.split(',');
				for (var i = 0; value.length > i; i++) {
					value[i] = value[i].trim();
				}
				value = _.without(value, '', ' ');
				value = _.uniq(value);
				upldrData.tags = value.toString();
				upldr.options.data = JSON.stringify(upldrData);
			}
		});

		ddSelect('onselect', function(val) {
			console.log(val);
		});

		$('#upload-folder-select').on('change', function() {
			upldrData.path = $(this).val();
			upldr.options.data = JSON.stringify(upldrData);
		});
		upldrData.path = $('#upload-folder-select').val();
		upldr.options.data = JSON.stringify(upldrData);
		//$('#upload-folder-select').trigger( "change" );

		/*
		 upldr.options = {
		 'target' : "gallery/fileUpload.php",
		 //'data' : JSON.stringify(upldrData),
		 'cbReaderOnload' : function(src, fName, fType, fSize, fLastMod) {
		 prototype({
		 'template' : '.file-row-prototype',
		 'selectors' : ['src', 'name', 'type', 'size', 'lastMod'],
		 'values' : [src, fName, fType, fSize, fLastMod],
		 'targets' : '#file-table-body'
		 });
		 },
		 'cbOnloadend' : function(res) {
		 console.log(res.target.response);
		 setTimeout(function() {
		 upldr.reset();
		 }, 3000);
		 }
		 };
		 */

		upldr.set({
			'target' : "gallery/fileUpload.php",
			//'data' : JSON.stringify(upldrData),
			'cbReaderOnload' : function(src, fName, fType, fSize, fLastMod) {
				prototype({
					'template' : '.file-row-prototype',
					'selectors' : ['src', 'name', 'type', 'size', 'lastMod'],
					'values' : [src, fName, fType, fSize, fLastMod],
					'targets' : '#file-table-body'
				});
			},
			'cbOnloadend' : function(res) {
				console.log(res.target.response);
				processResponse(res.target.response);
				setTimeout(function() {
					upldr.reset();
				}, 3000);
			}
		});
	});

	function processResponse(res) {
		var res = JSON.parse(res);
		var images = res.name;
		var path = res.data.path;
		var folder = path.split('/');
		folder = folder[folder.length-1];
		var tags = res.data.tags;
		tags = tags.split(',');
		tags = tags.push(folder);

		for (var i = 0; i < images.length; i++) {
			var n = Date.now();
			var name = res.name[i];
			var encname = encodeURI(images[i]);
			var id = path + encname;
			var entry = {
				"file": name,
				"path": path,
				"time": n,
				"tags": tags
			};
			gJ.images[id] = entry;
		};
	};

	/* Raw Panel */
	$('.admin-header a[aria-controls="raw-panel"]').on('shown.bs.tab', function(e) {

		loader();

		getAllBackups().done(function(data) {
			$("#loadBackupSelect").html("").append("<option>---</option>");
			var data = JSON.parse(data);
			for (var i = 0; i < data.length; i++) {
				var split = data[i].split(".");
				var opt = "<option data-url=" + data[i] + ">" + convertTimestamp(split[1]) + "</option>";
				$("#loadBackupSelect").append(opt);
			};

			$("#loadBackupSelect").on("change", function() {
				loader();
				var dataUrl = $('#loadBackupSelect option:selected').attr("data-url");
				var url = "gallery/" + dataUrl;
				var outputText = "Gallery JSON";
				var outputData = gJ;
				if (!dataUrl) {
					$("#json-output").text(JSON.stringify(outputData, null, '\t'));
					$(".outputFile").text(outputText);
					return false;
				}

				$.getJSON(url, function(data) {
					outputData = data;
					outputText = dataUrl;
				}).always(function() {
					$("#json-output").text(JSON.stringify(outputData, null, '\t'));
					$(".outputFile").text(outputText);
					loader("off");
				});

				$("#loadBuBtn").on("click", function() {
					buildGallery(outputData);
				});
			});

		});

		$(".gallery-row .gallery-item").removeClass("selected-image");

		$("#json-output").text(JSON.stringify(gJ, null, '\t'));
		loader("off");

	});

	$('.admin-header a[aria-controls="start-panel"').trigger("click");
};

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

