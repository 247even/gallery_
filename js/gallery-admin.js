function adminInit() {
	console.log("adminInit");

	$(".gallery-item").on("click", function(e) {
		e.preventDefault();
		e.stopPropagation();

		$(this).toggleClass("selected-image");

		//var selectedImages = [];
		//selectedTags.push($(this).attr('data-tags'));
		//selectedImages.push($(this).attr('data-id'));

		selectTags();

		return false;
	});

	function selectTags() {

		var groupTags = $("#input-tags").attr("value").split(',');
		var interTags;
		var firstTags;
		var selectedTags = [];
		var selTags = [];
		var i = 0;

		if ($(".selected-image").length == 1) {

			firstTag = $(".selected-image:first").attr('data-tags').split(',');
			selectedTags = groupTags = interTags = [firstTag];

		} else if ($(".selected-image").length > 1) {

			if (!groupTags[0]) {
				console.log('groupTags is empty, ' + i);
				groupTags = [$(".selected-image:first").attr('data-tags').split(',')];
			}

			$(".selected-image").each(function() {
				i++;
				attrTags = $(this).attr('data-tags');
				attrTags = attrTags.split(',');
				selTags.push(attrTags);

				$.each(attrTags, function(ke, va) {
					if (selectedTags.indexOf(va) == -1) {
						selectedTags.push(va);
					}
				})
				interTags = _.intersection(attrTags, groupTags);
				groupTags = _.intersection(selectedTags, groupTags);

			});

			interSelTags = _.intersection(JSON.stringify(selTags));
			console.log("selTags: " + JSON.stringify(selTags));
			console.log("interSelTags: " + interSelTags);

		} else {
			console.log("nothing selected");
			selectedTags = [];
			groupedTags = [];
		}

		console.log("selectedtags: " + selectedTags);
		console.log("grouptags: " + groupTags);
		console.log("interTags: " + interTags);

		$("#input-tags").attr("value", groupTags.join());
		var selectizeTags = $("#input-tags")[0].selectize;
		selectizeTags.clear();
		$.each(interTags, function(i, v) {
			//console.log(v);
			selectizeTags.createItem(v);
		})
		selectizeTags.refreshItems()

		$('#input-tags').selectize({
			plugins : ['remove_button'],
			delimiter : ',',
			create : function(input) {
				return {
					value : input,
					text : input
				}
			}
		});

		//console.log(tags);
	}

	$(function() {
		$('#input-tags').selectize({
			plugins : ['remove_button'],
			delimiter : ',',
			create : function(input) {
				return {
					value : input,
					text : input
				}
			}
		});

	});

	function loadBlur() {

		var imgSrc = $(".selected-image").attr("data-path");
		$("#blurPath").val(imgSrc);
		var imgSrcSplit = imgSrc.split("/");
		var imgSrc_720 = imgSrcSplit[0] + "/blur/" + imgSrcSplit[1] + "_720/" + imgSrcSplit[2];
				
		var blurImage = imgSrc_720+'?ts='+$.now();
		$("#blurImageFrame img").attr('src', blurImage).imagesLoaded().always(function(instance) {
			//console.log('blur image request');
		}).done(function(instance) {
			//console.log("blur image loaded");
		}).fail(function() {
			//console.log('image failure');
			$(this).html('<img src=\"data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7\"/>	No blur image.');
		});
	}

	/////// navigation /////////////////////
	
	/* Effect */

	$('a[aria-controls="effect-panel"]').on('shown.bs.tab', function(e) {
		$(".gallery-item").off("click");
		$(".gallery-item").on("click", function(e) {
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
		
		$("#blurSubmit").click(function(e){
			e.preventDefault();
			var postdata = $("#blur-form").serialize();
			console.log(postdata);
			$.ajax({
				type : "GET",
				url : "gallery/blur.php",
				data : postdata,
				success : function(data) {
					console.log(data);
					if (data == "done"){
						loadBlur();
					}
				}
			})
		});
	});
	
	
	/* Slides */ 
	
	$('a[aria-controls="slides-panel"]').on('shown.bs.tab', function(e) {
		
	})	
	
};
