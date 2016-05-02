function adminInit() {
	console.log("adminInit");

	$('.admin-header a[aria-controls="start-panel"]').on('shown.bs.tab', function(e) {


		$('#allFoldersButton').click(function() {
			allFolders().done(function(data) {
				$("#allFoldersResult").html("");
				//var data = data.sort();
				var subFolders = _.filter(data, function(v, k) {
					for (var i = 0,
					    len = galleryJSON.sizes.length; i < len; i++) {
						if (v.indexOf(galleryJSON.sizes[i]) > -1) {
							console.log(galleryJSON.sizes[i] + ' ' + v);
							return v;
						}
					}
				});
				var folders = _.difference(data, subFolders);
				var newFolders = _.difference(folders, galleryJSON.folders);
				var oldFolders = _.intersection(data, galleryJSON.folders);
				console.log(newFolders);
				console.log(oldFolders);

				for(var i=0, len=newFolders.length; i < len; i++){
					$("#foldersTable tbody").append('<tr class="success"><td>'+ newFolders[i] +'</td>'
					+'<td class="td_ign"><button type="button" class="btn btn-default btn-xs"><span class="glyphicon glyphicon-ban-circle"></span></button></td>'
					+'<td class="td_del"><button type="button" class="btn btn-default btn-xs"><span class="glyphicon glyphicon-remove-circle"></span></button></td>/tr>');
				}
				
				if (newFolders){
					$('#allFoldersButton').off("click").text("go on").on("click", function() {
						for(var i=0, len=newFolders.length; i < len; i++){
							var postData = "folder="+newFolders[i];
							imagesFromFolder(postData).done(function(data){
								console.log(data);
							})
						}
					});
				}
			});

		});

		function allFolders() {
			return $.ajax({
				dataType : "json",
				url : "gallery/allFolders.php",
				type : "POST",
				data : "allFolders"
			})
			.done(function(data) {
				//callback(data);
				console.log(data);
			});
		}
		
		function imagesFromFolder(postData) {
			return $.ajax({
				dataType : "json",
				url : "gallery/imagesFromFolder.php",
				type : "POST",
				data : postData
			})
			.always(function(data){
				console.log(data);
			})
			.done(function(data) {
				//callback(data);
				console.log(data);
			});
		}		

		/*
		 .then(
		 function(data){
		 console.log("then: "+data)
		 }
		 );
		 */
		function existingGallery() {

		};

	});

	/* options */

	//$('#optionsForm').validator();

	$('.admin-header a[aria-controls="options-panel"]').on('shown.bs.tab', function(e) {

		$('#configreset').click(function() {
			$('#optionsForm')[0].reset();
		});

		// pre-/re-set thumbSize
		var thumbSize = !galleryJSON.thumbDisplay ? "md" : galleryJSON.thumbDisplay;
		$("#thumbDisplaySelect").val(thumbSize);

		$("#thumbDisplaySelect").on("change", function() {
			var value = $(this).val();
			var proportion = galleryJSON.thumbProportion;
			proportion = !proportion ? [1, 1] : proportion.split(',');

			$('.gallery-item').removeClass(thumbDisplaySizes[galleryJSON.thumbDisplay]).addClass(thumbDisplaySizes[value]).proportion(proportion[0], proportion[1]);
			galleryJSON.thumbDisplay = value;
		});

		// pre-/re-set Proportion
		var thumbProp = !galleryJSON.proportion ? "1,1" : galleryJSON.proportion;
		$("#thumProportionSelect").val(thumbProp);

		$("#thumbProportionSelect").on("change", function() {
			var value = $(this).val();
			galleryJSON.thumbProportion = value;
			value = value.split(',');
			$(".gallery-item").proportion(value[0], value[1]);
		});

		// pre-/re-set thumbFit
		var thumbFit = !galleryJSON.thumbFit ? "cover" : galleryJSON.thumbFit;
		$("#thumbFitSelect").val(thumbFit);

		$("#thumbFitSelect").on("change", function() {
			var value = $(this).val();
			galleryJSON.thumbFit = value;
			$(".gallery-item .thumb-div").removeClass('cover-image contain-image').addClass(value + '-image');
		});

		// pre-/re-set thumbFit
		var thumbPadding = !galleryJSON.thumbPadding ? 0 : galleryJSON.thumbPadding;
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
			galleryJSON.thumbPadding = value;
			$(".gallery-item").css("padding", value + "px");
		});

		$("#inputSizes").attr('placeholder', galleryJSON.sizes).keydown(function(e) {
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
			galleryJSON.sizes = value;
		});

		$("#coverCheckbox").click(function(e) {
			e.stopImmediatePropagation();
			var element = (e.currentTarget.htmlFor !== undefined) ? e.currentTarget.htmlFor : e.currentTarget;
			var checked = (element.checked) ? false : true;
			element.checked = (checked) ? false : checked.toString();
		});

	});

	/* Tags */

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
				galleryJSON.images[this_id].tags = this_tags;
			});

			$.each(galleryJSON.images, function(k, v) {
				tags.push(v.tags);
			})
			tags = _.uniq(_.flattenDeep(tags));
			galleryJSON.tags = tags;
			buildGalleryNavigation();

			//console.log(tagsJSON);
			return false;

			var postdata = $("#tags-form").serialize();
			console.log(postdata);
			$.ajax({
				type : "GET",
				url : "gallery/save.php",
				data : postdata,
				success : function(data) {
					console.log(data);

				}
			})
		});
	});

	/* Effect */

	$('.admin-header a[aria-controls="effect-panel"]').on('shown.bs.tab', function(e) {

		var vague = $('#blurImageFrame img').Vague({
			intensity : 3,
			forceSVGUrl : false
		});

		function loadBlur() {

			var imgSrc = document.querySelector(".selected-image .thumb-div").getAttribute("respi-path");
			$("#blurPath").val(imgSrc);
			var imgSrcSplit = imgSrc.split("/");
			var imgSrc_720 = imgSrc.replace("_respi", "_720");
			var imgSrc_720_blur = imgSrc_720.replace("gallery", "gallery/blur");

			$("#blurImageFrame img").attr('src', imgSrc_720_blur + '?ts=' + $.now()).imagesLoaded().always(function(instance) {
				//console.log('blur image request');
			}).done(function(instance) {
				//console.log("blur image loaded");
			}).fail(function() {
				console.log('image failure');
				$("#blurImageFrame img").attr('src', imgSrc_720).imagesLoaded().always(function() {
					console.log("blur image not loaded");
				}).done(function() {
					console.log("vague blur");
					vague.blur();
				});
			});
		}


		$(".gallery-row .gallery-item").removeClass("selected-image").off("click").on("click", function(e) {
			e.preventDefault();
			e.stopPropagation();
			$(".gallery-item").removeClass("selected-image");
			$(this).addClass("selected-image");

			loadBlur();

			return false;
		});

		$("#blurSlider").rangeslider({
			polyfill : false,
			// Callback function
			onInit : function(position, value) {
				$("#blurSliderOutput").html(value);
				$("#blurInput").val(value);
			},
			// Callback function
			onSlide : function(position, value) {
				//console.log('onSlide');
				//console.log('position: ' + position, 'value: ' + value);
				$("#blurSliderOutput").html(value);
			},
			// Callback function
			onSlideEnd : function(position, value) {
				//console.log('onSlideEnd');
				//console.log('position: ' + position, 'value: ' + value);
				$("#blurSliderOutput").html(value);
				$("#blurInput").val(value);
				vagueIntensity = Math.round((value / 10) * 1.5);

				var vague = $('#blurImageFrame img').Vague({
					intensity : vagueIntensity,
					forceSVGUrl : false
				});
				vague.blur();
			}
		});

		$("#blurInput").val($("#blurSliderOutput").val());
		$("#blurInput").on("change", function() {
			value = this.value;
			$("#blurSlider").val(value).change();
			$(this).val($("#blurSliderOutput").val());
		});

		$("#blurSubmit").click(function(e) {
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
	});

	/* Sliders */

	$('.admin-header a[aria-controls="slider-panel"]').on('shown.bs.tab', function(e) {

		$('.sortable').sortable('destroy');
		document.getElementById('sliderSortable').innerHtml = "";
		$('#sliderSortable').html('');

		function selectedIds() {
			var selected_ids = [];
			var items = document.querySelectorAll("#sliderSortable .gallery-item");
			for (var i = 0,
			    len = items.length; i < len; i++) {
				selected_ids.push(items[i].getAttribute("data-id"));
			}
			return selected_ids;
		}


		$(".gallery-row .gallery-item").removeClass("selected-image").off("click").on("click", function(e) {

			e.preventDefault();
			e.stopPropagation();

			$(this).toggleClass("selected-image");

			if ($(this).hasClass("selected-image")) {
				$(this).clone().addClass("sortable-item").appendTo("#sliderSortable");
			} else {
				var data_id = $(this).attr("data-id");
				$("#sliderSortable div[data-id='" + data_id + "']").remove();
			}
			$('.sortable').sortable('reload');

			var selected_ids = selectedIds();
			var prop = (selected_ids.length >= 2) ? false : true;
			$("#sliderSubmit").prop("disabled", prop);

			//galleryJSON.sliders["slider1"] = selected_ids;
		});

		$('.sortable').sortable().unbind('sortupdate').bind('sortupdate', function(e, ui) {
			galleryJSON.sliders["slider1"] = selectedIds();
		});

		for (var i = 0,
		    len = galleryJSON.sliders.slider1.length; i < len; i++) {
			document.querySelector('.gallery-row div[data-id="' + galleryJSON.sliders.slider1[i] + '"]').click();
		};

		$("#sliderSubmit").on("click", function(e) {
			e.preventDefault();
			console.log(selectedIds());
			galleryJSON.sliders["slider1"] = selectedIds();
		});

	})
	/* Raw */
	$('.admin-header a[aria-controls="raw-panel"]').on('shown.bs.tab', function(e) {
		$(".gallery-row .gallery-item").removeClass("selected-image");

		$("#json-output").text(JSON.stringify(galleryJSON, null, '\t'));
	});

	$('.admin-header a[aria-controls="start-panel"').trigger("click");
};
