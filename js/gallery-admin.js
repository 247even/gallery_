function adminInit() {
	console.log("adminInit");
	var selectedImages = ".gallery-row .selected-image";

	/* Tags */

	$('a[aria-controls="tags-panel"]').on('shown.bs.tab', function(e) {

		function selectTags() {
			
			var firstTag = $(selectedImages+":first").attr('data-tags');
			if(firstTag){
				// firstTag.split(',');
				firstTag = _.split(firstTag, ',');
			}
			var groupTags = $("#input-tags").attr("value").split(',');
			var interTags;
			var firstTags;
			var selectedTags = [];
			var i = 0;

			if ($(selectedImages).length == 1) {
				
				selectedTags = groupTags = interTags = firstTag;

			} else if ($(selectedImages).length > 1) {

				if (!groupTags[0]) {
					console.log('groupTags is empty, ' + i);
					groupTags = firstTag;
				}

				$(selectedImages).each(function() {
					i++;
					attrTags = $(this).attr('data-tags');
					attrTags = attrTags.split(',');

					// all unique selected tags:
					selectedTags = _.union(selectedTags,attrTags);
					groupTags = _.intersection(groupTags, attrTags);

				});

			} else {
				console.log("nothing selected");
				selectedTags = [];
				groupTags = [];
			}

			console.log("selectedtags: " + selectedTags);
			console.log("grouptags: " + groupTags);

			$("#input-tags").attr("value", groupTags);
			
			var selectizeTags = $("#input-tags")[0].selectize;
			selectizeTags.clear();
			$.each(groupTags, function(i, v) {
				selectizeTags.createItem(v);
			})
			selectizeTags.refreshItems()
			
			return groupTags;
		}

		
		$('#input-tags').selectize({
			plugins : ['remove_button'],
			delimiter : ',',
			create : function(input) {
				console.log("create: "+input);
				input = input.split(',');
				$(selectedImages).each(function(){
					var dataTags = $(this).attr('data-tags');
					dataTags = dataTags.split(',');
					unionTags = _.union(dataTags, input);
					if (unionTags != dataTags) {
						$(this).attr('data-tags',unionTags).addClass('edited');
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

			var selected_ids = [];
			$.each($(".gallery-row .gallery-item"), function() {
				selected_ids.push($(this).attr("data-id"));
			});

			console.log(tagsJSON);
			return false;
			
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

	/* Effect */

	$('a[aria-controls="effect-panel"]').on('shown.bs.tab', function(e) {

		function loadBlur() {

			var imgSrc = $(".selected-image").attr("data-path");
			$("#blurPath").val(imgSrc);
			var imgSrcSplit = imgSrc.split("/");
			var imgSrc_720 = imgSrcSplit[0] + "/blur/" + imgSrcSplit[1] + "_720/" + imgSrcSplit[2];

			var blurImage = imgSrc_720 + '?ts=' + $.now();
			$("#blurImageFrame img").attr('src', blurImage).imagesLoaded().always(function(instance) {
				//console.log('blur image request');
			}).done(function(instance) {
				//console.log("blur image loaded");
			}).fail(function() {
				//console.log('image failure');
				$(this).html('<img src=\"data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7\"/>	No blur image.');
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
		//e.target // newly activated tab
		//e.relatedTarget // previous active tab
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

	/* Slides */

	$('a[aria-controls="slider-panel"]').on('shown.bs.tab', function(e) {

		$('.sortable').sortable({
			// options
		});

		function selectedIds() {
			var selected_ids = [];
			$.each($("#sliderSortable .gallery-item"), function() {
				selected_ids.push($(this).attr("data-id"));
			})
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

			if (selectedIds().length >= 2) {
				$("#sliderSubmit").prop("disabled", false);
			} else {
				$("#sliderSubmit").prop("disabled", true);
			}

			return false;
		});

		$.each(selectedIds(), function(k, v) {
			$(".gallery-row div[data-id='" + v + "']").addClass("selected-image");
		});

		$("#sliderSubmit").on("click", function(e) {
			e.preventDefault();
			console.log(selectedIds());
		});

	})
};
