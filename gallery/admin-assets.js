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

}); /* Raw Panel */
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

}); /* Sliders */

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

}); /* Upload Panel */
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

	$('#new-folder-name').on('keypress', function(event) {
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
			if ($.inArray(val, gJ.folders) < 0 || $.inArray(val, gJ.ignore)) {
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
	console.log( getSlug("knösel popl's.jpg'") );

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
	folder = folder[folder.length - 1];
	var tags = res.data.tags;
	tags = tags.split(',');
	tags = tags.push(folder);

	for (var i = 0; i < images.length; i++) {
		var n = Date.now();
		var name = res.name[i];
		var encname = encodeURI(images[i]);
		var id = path + encname;
		var entry = {
			"file" : name,
			"path" : path,
			"time" : n,
			"tags" : tags
		};
		gJ.images[id] = entry;
	};
};