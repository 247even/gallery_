var galleryJSON;
function loadJSON() {
	$.ajax({
		dataType : "json",
		url : "gallery/gallery.json",
		success : function(data) {
			galleryJSON = data;
			buildGallery(galleryJSON);
		}
	});
};

function buildGalleryItems(filter) {

	/*
	 var imagesJSON = data.images;
	 var folders = data.folders;
	 var sizes = data.sizes;
	 var tags = data.tags;
	 */
	var initialThumbSize = _.min(galleryJSON.sizes);
	var i = 0;

	thumbDisplaySizes = {
		"xs" : "col-xs-1",
		"sm" : "col-xs-2",
		"md" : "col-xs-3",
		"lg" : "col-xs-4",
		"xl" : "col-xs-6",
		"xxl" : "col-xs-12"
	};

	var thumbSize = !galleryJSON.thumbDisplay ? thumbDisplaySizes["md"] : thumbDisplaySizes[galleryJSON.thumbDisplay];
	var thumbPadding = !galleryJSON.thumbPadding ? 0 : galleryJSON.thumbPadding;
	thumbPadding = thumbPadding != 0 ? 'style="padding:' + parseInt(thumbPadding) + 'px"' : '';

	// reset
	document.getElementById('gallery-row').innerHTML = "";
	$('#thumb-prototype').remove();

	//$('body').append(
	document.body.insertAdjacentHTML('beforeend',
		'<div id="thumb-prototype" style="display:none">'
		+ '<div class="' + thumbSize + ' gallery-item img-hidden" ' + thumbPadding + '>'
		+ '<div class="thumb-div cover-image" data-src="xxx">'
		+ '<a href="#lb-arbeiten" data-slide-to="i" data-toggle="modal">'
		+ '<img alt="" src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7">'
		+ '<span class="glyphicon glyphicon-zoom-in"> </span>'
		+ '</a>' + '</div>' + '</div></div>'
	);	

	
	for( var key in galleryJSON.images){
		
		var val = galleryJSON.images[key];
		var folder = val.path;
		var file = val.file;
		var respiPath = 'gallery/' + folder + '_respi/' + file;
		var thumbFilePath = 'gallery/' + folder + '_' + initialThumbSize + '/' + file;

		// check if a filter was passed to this function
		if (filter && filter != "all") {
			//console.log("filter: " + filter);
			if ($.inArray(filter, tags) == -1) {
				return true
			};
		}

		document.querySelector("#thumb-prototype .thumb-div").setAttribute('respi-path', respiPath);
		document.querySelector("#thumb-prototype a").setAttribute('data-slide-to', i);

		$("#thumb-prototype .gallery-item").attr({"data-id": key, "data-time": val.time,"data-tags": val.tags})
		.clone().appendTo("#gallery-row");

		i++;
	};	

}

function buildGallery(data, filter) {


	document.body.setAttribute("respi-sizes", galleryJSON.sizes);

	buildGalleryItems();

	// do the lightbox stuff
	buildLightbox(true);

	buildGalleryNavigation();
	initGalleryNavigation();

	// fade em in...
	galleryFilter("all");
	//console.log("Filter");

	//preloader();
	//console.log("preloader");

	initGallery();
};

function buildLightbox(init) {

	//console.log("buildLightbox startet");

	var items;

	// reset
	clearHtml(['.carousel-inner','.carousel-indicators']);

	// init 'true' to fetch all images, else only active
	if (init) {
		//items = $(".gallery .gallery-item");
		items = document.querySelectorAll(".gallery .gallery-item");
	} else {
		items = $(".gallery .gallery-item").filter('.img-active');
	}
	
	for(var i=0, len=items.length; i < len; i++){

		items[i].getElementsByTagName('a')[0].setAttribute("data-slide-to", i);
		// Build Carousel
		var _respi_path = items[i].getElementsByClassName('thumb-div')[0].getAttribute("respi-path");
		document.querySelector('.gallery .carousel-inner').insertAdjacentHTML('beforeend',
			'<div class=\"item\" respi-path="' + _respi_path + '" style=\"background-image:;\"><img alt=\"\" src=\"images/FFF-0.png\"></div>'
		);
	}
	//)

	var total = items.length;
	var currentIndex = $('.item.active').index() + 1;

	// This triggers after each slide change
	$('.gallery .lightbox').on('slid.bs.carousel', function() {
		currentIndex = $('.gallery-carousel div.active').index() + 1;
		// Now display this wherever you want
		document.getElementById('indicator-text').innerHTML = currentIndex + '/' + total;
	});

	$('.gallery .lightbox').on('shown.bs.modal', function(e) {
		$(".gallery-carousel .item").respi();
	});

	$('.gallery .carousel-indicators li').removeClass('active').last().addClass('active');;
	$('.gallery .carousel-inner .item').removeClass('active').last().addClass('active');

	$('.gallery .lightbox').carousel();
};

function buildGalleryNavigation(tags) {
	if (!tags) {
		var tags = galleryJSON.tags;
	}

	// build filter buttons
	document.getElementById('filter-select').innerHTML = '<option value="all" data-filter="all">----</option>';
	
	for(var i=0, len=tags.length; i < len; i++){
		var uval = tags[i];
		document.getElementById('filter-select').insertAdjacentHTML('beforeend',
				'<option value=\"' + uval + '\" data-filter=\"' + uval + '\">' + uval + '</option>'
		);		
	}
	
	$('#filter-select').selectpicker('refresh');
};

function initGalleryNavigation() {

	$('#filter-select').on('change', function() {
		//console.log("animrunning: " + animrunning);
		$('#filter-select').selectpicker('refresh');

		if (!animrunning) {
			$('.gallery-footer .btn').removeClass('active');
			galleryFilter($(this).addClass('active').val());
			$('#filter-select').selectpicker('refresh');
		}
	});

};

function buildIndexCarousel(image, i) {
	
	clearHtml(['#slider-1 .carousel-inner', '#slider-1 .carousel-indicators']);

	$(".gallery .gallery-item").each(function(k, v) {

		if (k < 10) {
			image = $(this).attr('data-path');
			thumb = $(this).find("img").attr('data-original');

			// add thumb to preloader
			imagesLoader.addImage(thumb);
			// add to preloader
			imagesLoader.addImage(image);

			indicator = '<li class=\"box-shadow--2dp\" data-app-prevent-settings=\"\" data-target=\"#slider-1\" data-slide-to=\"' + k + '\"></li>';
			item = '<div class=\"box section section--relative section--fixed-size section--bg-adapted item dark center section--full-height\"' + 'style=\"background-image: url(' + image + ');\">' + '<div class=\"box__magnet box__magnet--sm-padding after-navbar\"><div class=\"container\">' + '<div class=\"row\"> <div class=\"col-sm-8 col-sm-offset-2\"><div class=\"hero\"></div></div></div></div></div></div>';

			$('#slider-1 .carousel-inner').append(item);
			$('#slider-1 .carousel-indicators').append(indicator);
			$('#slider-1 .carousel-indicators li').removeClass('active');
			$('#slider-1 .carousel-indicators li:first').addClass('active');
			$('#slider-1 .box').removeClass('active');
			$('#slider-1 .box:first').addClass('active');
		}
	})
};

//requires var animrunning = false;
function galleryFilter(fil) {

	//console.log("gallery filter started");

	var fi = 0;
	var cb;
	var inItems = [];
	var outItems = [];

	// prevent double animation
	if (animrunning) {
		return false;
	}

	var filteredIds = _.keys(_.pickBy(galleryJSON.images, {
		'tags' : [fil]
	}));

	if (!fil || fil == "all") {
		inItems = $(".gallery .gallery-item").not('.img-active');
	} else {
		$(".gallery .gallery-item").each(function(k) {
			var tags = $(this).attr("data-tags");
			if (tags.includes(fil)) {
				if (!$(this).hasClass('img-active')) {
					inItems.push($(this));
				}
			} else {
				if (!$(this).hasClass('img-inactive')) {
					if ($(this).hasClass('inViewport')) {
						outItems.push($(this));
					} else {
						$(this).addClass('img-inactive').removeClass('img-hidden img-active');
					}
				}
			}
		});
	}

	var inViewportLength = $('.gallery-row .inViewport').length;
	if (inViewportLength < 20) {
		inViewportLength = 20
	};
	var inLength = inItems.length;
	var outLength = outItems.length;

	//console.log(outItems);

	$.each(outItems, function(i) {
		// animate those, which are visible
		animrunning = true;
		$(this).velocity('transition.fadeOut', {
			delay : 100 * fi,
			duration : 250,
			complete : function() {
				$(this).removeClass('img-active').addClass('img-hidden');
				if (i + 1 >= outLength) {

					$.each(outItems, function(j) {
						$(this).velocity('transition.fadeOut', {
							duration : 250,
							complete : function() {
								$(this).addClass('img-inactive').removeClass('img-hidden');
								animrunning = false;
								if ( typeof portfolioLoad !== 'undefined') {
									portfolioLoad.update();
								}
								$('.gallery').trigger('resize');
							}
						});
					});
				}
			}
		});
		fi++
	})

	$(".gallery").scrollTop(0);

	$.each(inItems, function(k) {

		$(this).addClass('img-active').removeClass('img-inactive').removeClass('img-hidden');

		if ( typeof portfolioLoad !== 'undefined') {
			portfolioLoad.update();
		}

		fi++;
	})
	if ( typeof portfolioLoad !== 'undefined') {
		portfolioLoad.update();
	}

	$('.gallery').css('height', '90%').css('height', '100%');

	buildLightbox();

};

function loadImage(el){
	el.css("background-image", "url(" + el.attr("data-src") + ")" );
};

function initGallery() {
	console.log("initGallery");

	// background zoom function
	$('.gallery .zoom').on('click', function(e) {
		//e.preventDefault();
		$('.gallery-carousel .item').toggleClass('bg-cover');
	});
	
	// 
	$(".gallery .gallery-item").proportion(galleryJSON.proportion).respi(galleryJSON.sizes);

	$(window).on('resize', debounce(function(e) {
		console.log(e);
		$(".gallery .gallery-item").proportion(galleryJSON.proportion).respi(galleryJSON.sizes);
		$(".gallery .gallery-carousel .item").respi(galleryJSON.sizes);
	}, 500, false));

	$('.gallery .gallery-item').onScreen({
		container : '#arbeiten',
		direction : 'vertical',
		doIn : function(e) {
			// Do something to the matched elements as they come in
			loadImage($(this).find('.thumb-div'));
		},
		doOut : function() {
			// Do something to the matched elements as they get off scren
			console.log("doout");
		},
		tolerance : 0,
		throttle : 50,
		toggleClass : 'onscreen',
		lazyAttr : null,
		lazyPlaceholder : 'someImage.jpg',
		debug : false
	});

	// load admin-functions, if available
	if (adminInit) {
		adminInit();
	}

	/*
	 $('.img-active').each(function(i){
	 if( i <= 24 ){
	 var dor = $(this).find('img').attr('data-original');
	 //console.log(dor);
	 $(this).find('img').attr('src', dor);
	 }
	 });
	 */

};

