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