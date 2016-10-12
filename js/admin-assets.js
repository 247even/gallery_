"use strict";

var stat = {
    'imagesRemoved': [],
    'imagesAdded': {},
    'imagesAddedKeys': [],
    'imagesModified': [],
    'imagesNotProcessed': [],
    'workingFolder': '',

    'folderImages' : [],

    '_allImages': {},
    set allImages(val) {
        this._allImages = {};
        if(val){
            this._allImages = val;
        }
        getNewImages();
        var imgtd = Object.keys(stat.allImages).length;
        if(stat.newImages.length > 0){
            imgtd = imgtd+"/"+stat.newImages.length;
        }
        $("#tr-"+stat.workingFolder+" .td-img").html(imgtd);
    },
    get allImages() {
        return this._allImages;
    },

    '_newImages': [],
    set newImages(val) {
        this._newImages = val;
        $('#processStatus').html(this._newImages.length + ' image/s found in "' + stat.newFolders[0] + '".');
    },
    get newImages() {
        return this._newImages;
    },

    '_allFolders': [],
    set allFolders(val) {
        this._allFolders = val;
        buildFolderTable();
    },
    get allFolders() {
        return this._allFolders;
    },

    '_newFolders': [],
    set newFolders(val) {
        this._newFolders = val;
        if (stat.newFolders.length > 0) {
            $('#processStatus').html(stat.newFolders.length + ' new folder(s) found.');
            $('#allFoldersButton').text('add folder "' + stat.newFolders[0] + '"');

            //for (var i = 0; stat.newFolders.length > i; i++) {
            $('#folder-modal .modal-body').html('"' + stat.newFolders[0] + '"');
            $('#folder-modal').attr('data', stat.newFolders[0])
                .modal('show');

            /*
            prototype({
            'template' : '#folder-button-template',
            'selectors' : ['folder'],
            'values' : [stat.newFolders[i]],
            'targets' : '#folderButtons'
            });
            */
            //}
        }
        //buildFolderTable();
    },
    get newFolders() {
        return this._newFolders;
    }

};

function getNewImages() {

    var match = [];
    stat.newImages = [];

    for (var key in stat.allImages) {
        if (!gJ.images[key]) {
            // this image is not in gJ, must be new
            match[key] = stat.allImages[key];
        }
    }

    if (Object.keys(match) > 0) {
        // we have new images
        stat.newImages = Object.keys(match);
    } else {
        console.log("no new images");
    }
};


function getRemovedImages() {

  // all IDs from gJ filtered by folder:
  var galleryByFolder = _.pickBy(gJ.images, {
      'path': stat.workingFolder
  });

    for (var key in galleryByFolder) {
        if (!stat.imagesFromFolder[key]) {
            // this image is not present anymore
            stat.imagesRemoved.push(kk);
        }
    }
};
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
		//console.log(data);
		//var data = JSON.parse(data);
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
		e.preventDefault();
		reset();
	});

	$("#sliderAuto").on("click", function(e) {
		e.preventDefault();
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

	function filesToGJ(f) {
		for ( i = 0; f.length > i; i++) {

		}
	};

	$('#new-folder-name').on('keypress', function(event) {
		var regex = new RegExp("^[a-zA-Z0-9_-äüö ]+$");
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
			
			if ( _.indexOf( gJ.folders, val ) != -1 && _.indexOf( gJ.ignore, val ) != -1 ) {
				console.log('folder already present');
				return false;
			}
			
			createFolder(val).done(function(data){
				console.log(data.dir);
			});
			
			/*
			
			createFolder(val).done(function(){
				console.log('cfdone');
				var resp = request.responseText;
				gJ.folders.push(val);
				folderSelect();
				$('#new-folder-name').val('');
				console.log(resp);			
			});
			*/
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
				//console.log( getSlug(fName, {'custom' : ['.'] }) );
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

function getAllImages(folders, d) {
		// deep = if true, include thumbnail folders;

    var i = 0;
    var si = 0;
		var deep = d ? d : false;

    function getImages() {
				//var folder = gJ.folders[i];
				var folder = folders[i];
				stat.workingFolder = folder;
        var sourceFolder = folder;
        var allImagesFromServer = [];

        function getImagesFromServer() {
            imagesFromFolder(sourceFolder).done(function(data) {
								var ol = 0;
								if(data){
									ol = Object.keys(data).length;
									_.extend(allImagesFromServer, data);
								}

								//if (!gJ.folders[folder] && !gJ.ignore[folder]) {
									stat.folderImages[folder] = [ol , 0, 0];
								//}

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
                // we now have all images from the server!
                //checkImages();

                // Done! Next folder...
                i++;

                //if (i < gJ.folders.length) {
								if (i < folders.length) {
                    si = 0;
                    //folder = gJ.folders[i];

                    console.log("i: " + i + ", gJ.folders.length: " + gJ.folders.length);
                    //getImagesFromServerSync();
                    getImages();

                } else {
									console.log(stat.folderImages);
										/*
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
										*/
                }
            }
        };

        getImagesFromServer();
        console.log("getImagesFromServer done");
    }; // <-- end function getImages()

		getImages();

}; // <-- end function getAllImages()
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

var request = true;

var allFolders = function() {
	return $.post("gallery/allFolders.php", "allFolders", null, 'json');
};

var createFolder = function(path) {
	return $.post("gallery/createFolder.php", 'folder=' + path, null, 'json');
};

var removeFolder = function(f) {
	return $.post("gallery/removeFolder.php", "folder=" + f, null, 'json');
};

var imagesFromFolder = function(f) {
	var data = "folder=" + f + "&ts=" + Date.now();
	return $.post("gallery/imagesFromFolder.php", data, null, 'json').done(function(data){
		stat.allImages = data;
	});
};

var removeImage = function(p) {
	return $.post("gallery/removeImage.php", "path=" + p, null, 'json');
};

var getAllBackups = function() {
	return $.post("gallery/allBackups.php", "allBackups=true&t=" + Date.now(), null, 'json');
};

var backup = function() {
	return $.post("gallery/backup.php", "backup=true", null, 'json');
};

var saveFileAs = function(c, t) {
	var data = "content=" + c + "&target=" + t;
	return $.post("gallery/saveFileAs.php", data, null, 'json');
};
var _resizeStore = function(folder, file, sizes, force) {
	
	if (!folder) {
		console.log("no folder!")
		return false;
	}
	if (!file) {
		console.log("no file!")
		return false;
	}
	if (!sizes) {
		//var sizes = gJ.sizes.join();
		var sizes = gJ.sizes;
	}
	if (!force) {
		var force = false;
	}

	var done;
	this.done = function(cb) {
		done = cb;
	};
	
	var i = 0;
	send();

	function send() {
		if (i < sizes.length) {
			var postData = 'folder=' + folder + '&file=' + file + '&sizes=' + sizes[i] + '&force=' + force;
			$.ajax({
				//dataType : "json",
				url : "gallery/resizeStore.php",
				type : "GET",
				data : postData
			}).done(function(data) {
				i++;
				send();
			}).always(function(data) {
				//console.log(data);
			}).fail(function(data) {
				//console.log(data);
			});
		} else {
			done();
		}
	};
};
