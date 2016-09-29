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
