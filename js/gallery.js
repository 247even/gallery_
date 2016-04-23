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

function buildGalleryItems(filter){

/*
	var imagesJSON = data.images;
	var folders = data.folders;
	var sizes = data.sizes;
	var tags = data.tags;
*/
	var initialThumbSize = _.min(galleryJSON.sizes);
	var i = 0;
	

	var thumbDisplaySizes = {
		"xs" : "col-xs-1",
		"sm" : "col-xs-2",
		"md" : "col-xs-3",
		"lg" : "col-xs-4",
		"xl" : "col-xs-6",
		"xxl" : "col-xs-12"
	};	
	
	// reset
	$('.gallery-row').html("");
	$('#thumb-prototype').remove();
	
	if($('#thumb-prototype')){
		
	}
	
	var gallery_item_div = '<div class="'+ thumbDisplaySizes[galleryJSON.thumbDisplay] +' gallery-item cover-image img-hidden">'
						//+ '<div class="thumb-div cover-image b-lazy">'
						+ '<a href="#lb-arbeiten" data-slide-to="i" data-toggle="modal">'
						+ '<img alt="" src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7">'
						+ '<span class="glyphicon glyphicon-zoom-in"> </span>'
						+ '</a>'
						//+ '</div>'
						+ '</div>';
	
	$('body').append('<div id="thumb-prototype" style="display:none"> </div>');
	$('#thumb-prototype').append(gallery_item_div);

	$.each(galleryJSON.images, function(key, val) {
		var folder = val.path;
		var file = val.file;
		var respiPath = 'gallery/' + folder + '_respi/' + file;
		var thumbFilePath = 'gallery/' + folder + '_' + initialThumbSize +'/' + file;

		// check if a filter was passed to this function
		if (filter && filter != "all") {
			console.log("filter: " + filter);
			if ($.inArray(filter, tags) == -1) {
				return true
			};
		}

		$("#thumb-prototype .gallery-item").attr('data-id', key).attr('data-time', val.time).attr('respi-path', respiPath).attr('data-tags', val.tags);
		//$("#thumb-prototype .thumb-div").attr('data-src', thumbFilePath);
		$("#thumb-prototype a").attr('data-slide-to', i);
		//$("#thumb-prototype img").attr('data-original', thumbFilePath);
			
		$("#thumb-prototype .gallery-item").clone().appendTo(".gallery-row");			
		
		i++;
	});	
	
}

function buildGallery(data, filter) {
/*	
	var imagesJSON = data.images;
	var folders = data.folders;
	var sizes = data.sizes;
	var tags = data.tags;
	var initialThumbSize = _.min(sizes);

	
	var i = 0;
*/
	$('body').attr("respi-sizes", galleryJSON.sizes);

	// reset
	$('.carousel-inner').html("");
	$('.carousel-indicators').html("");
	
	buildGalleryItems();

	// do the lightbox stuff
	buildLightbox(true);

	buildGalleryNavigation();
	initGalleryNavigation();
	
	// fade em in...
	galleryFilter("all");
	console.log("Filter");
	
	$(".gallery-item").respi(galleryJSON.sizes);

	//preloader();
	//console.log("preloader");
	
	initGallery();
};

function buildLightbox(init) {
	
	console.log("buildLightbox startet");
	
	var items;

	// reset
	$('.gallery .carousel-inner').html("");
	$('.gallery .carousel-indicators').html("");

	// init 'true' to fetch all images, else only active
	if (init) {
		items = $(".gallery .gallery-item");
	} else {
		items = $(".gallery .gallery-item").filter('.img-active');
	}
	

	$.each(items, function(i) {
		$(this).find("a").attr("data-slide-to",i);
		// Build Carousel
		var inner = '<div class=\"item\" respi-path="'+$(this).attr("respi-path")+'" style=\"background-image:url('+ $(this).attr("data-path") + ');\"><img alt=\"\" src=\"images/FFF-0.png\"></div>';
		$('.gallery .carousel-inner').append(inner);
	})
	

	var total = $(items).length;
	var currentIndex = $('.item.active').index() + 1;
	$('.slidetext').html(currentIndex + '/'  + total);
	
	// This triggers after each slide change
	$('.gallery .lightbox').on('slid.bs.carousel', function () {
		currentIndex = $('.gallery-carousel div.active').index() + 1;
		console.log("current: "+currentIndex);
 		// Now display this wherever you want
		var text = currentIndex + ' / ' + total;
		$('.indicator-text').html(text);
	});
	
	$('.gallery .lightbox').on('shown.bs.modal', function (e) {
		$(".gallery-carousel .item").respi();
	});	

	$('.gallery .carousel-indicators li').removeClass('active');
	$('.gallery .carousel-indicators li:last').addClass('active');
	$('.gallery .carousel-inner .item').removeClass('active');
	$('.gallery .carousel-inner .item:last').addClass('active');
	
	$('.gallery .lightbox').carousel();
};

function buildGalleryNavigation(tags){
	if(!tags){
		var tags = galleryJSON.tags;
	}
	// unique tags:
	var utags = _.union(tags);

	// build filter buttons
	$('#filter-select').html('');
	$('#filter-select').append('<option value="all" data-filter="all">----</option>');
	$.each(utags, function(key, val) {
		$('#filter-select').append('<option value=\"' + val + '\" data-filter=\"' + val + '\">' + val + '</option>');
	});
	$('#filter-select').selectpicker('refresh');	
};

function initGalleryNavigation(){
	
	$('#filter-select').on('change', function() {
		console.log("animrunning: "+animrunning);
		$('#filter-select').selectpicker('refresh');

		if(!animrunning){
			$('.gallery-footer .btn').removeClass('active');
			$(this).addClass('active');
			console.log($(this).val());
			galleryFilter($(this).val());
			$('#filter-select').selectpicker('refresh');		
		}
	});
	
};

function buildIndexCarousel(image, i) {
	$('#slider-1 .carousel-inner').html("");
	$('#slider-1 .carousel-indicators').html("");

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
	
	console.log("gallery filter started");
	
	var fi = 0;
	var cb;
	var inItems = [];
	var outItems = [];

	// prevent double animation
	if(animrunning){
		return false;
	}
	
	if (fil == "all") {
		inItems = $(".gallery-row .gallery-item").not('.img-active');
	} else {
		$($(".gallery-row .gallery-item")).each(function(k) {
			var tags = $(this).attr("data-tags");
			if (tags.includes(fil)) {
				if (!$(this).hasClass('img-active')) {
					inItems.push($(this));
				}
			} else {
				if (!$(this).hasClass('img-inactive')) {
					if($(this).hasClass('inViewport')){
						outItems.push($(this));
					} else {
						$(this).removeAttr('style').addClass('img-inactive').removeClass('img-hidden img-active');	
					}
				}
			}
		});
	}
	
	var inViewportLength = $('.gallery-row .inViewport').length;
	if (inViewportLength < 30){inViewportLength = 30};
	var inLength = inItems.length;
	var outLength = outItems.length;
	

	$.each(outItems, function(i) {
		// animate those, which are visible
			animrunning = true;
			$(this).removeAttr('style').velocity('transition.fadeOut', {
				delay : 100 * fi,
				duration : 250 ,
				complete : function() {
					$(this).removeClass('img-active').addClass('img-hidden');
					if (i + 1 >= outLength) {
						
						$.each(outItems, function(j) {
							$(this).velocity('transition.fadeOut', {
								duration: 250, 
								complete: function() {
									$(this).removeAttr('style').addClass('img-inactive').removeClass('img-hidden');
									animrunning = false;
										if (typeof portfolioLoad !== 'undefined') {
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
	
	$( ".gallery" ).scrollTop( 0 );
	
	$.each(inItems, function(k) {
		//animrunning = true;
		/*$(this).velocity('transition.flipXIn', {
			delay : (1000 / inViewportLength) * fi,
			duration : (1000 / inViewportLength),
			complete : function() {
				*/
				$(this).addClass('img-active').removeClass('img-inactive').removeClass('img-hidden');
				
				if (typeof portfolioLoad !== 'undefined') {
					portfolioLoad.update();
				}

				//buildLightbox();
			/*	if (k + 1 >= inLength) {
					buildLightbox();
					animrunning = false;
					console.log(k);
				}
			}
		});*/
		fi++;
	})

	
	if (typeof portfolioLoad !== 'undefined') {
		portfolioLoad.update();
	}
	
	$('.gallery').css('height','90%').css('height','100%');
	
	buildLightbox();
	
};

function initGallery(){
	console.log("initGallery");
	
		// background zoom function
		$('.gallery .zoom').on('click', function(e){
			//e.preventDefault();
			$('.gallery-carousel .item').toggleClass('bg-cover');
		});
		
		/*
		// lazyload
		var portfolioLoad = new LazyLoad({
		    threshold: 600,
		    container: document.getElementById('arbeiten'),
		    elements_selector: ".img-active .lazy",
		    skip_invisible : false,
		    throttle: 60,
		    data_src: "original",
		    data_srcset: "srcset",
		    show_while_loading: false,
		    callback_set: function() { }
		});
		*/	
		
		$(window).on('load resize', debounce(
			function(){
				$(".gallery-item").proportion().respi(galleryJSON.sizes);
				$(".gallery .gallery-carousel .item").respi(galleryJSON.sizes);
			}, 500, false)
		);
		
		//bLazy
		var bLazy = new Blazy({
			container: '.gallery', // Default is window
	        success: function(element){
				console.log('bLazy finish');
	        }
	   });

	// load admin-functions, if available
	if(adminInit){
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


