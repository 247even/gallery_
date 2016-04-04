function loadJSON() {
	$.ajax({
		dataType : "json",
		url : "gallery/gallery.json",
		success : function(data) {
			buildGallery(data);
		}
	});
};

function buildGallery(data, filter) {	
	imagesJSON = data.images;
	folders = data.folders;
	sizes = data.sizes;
	
	var initialThumbSize = _.min(sizes);
	
	var i = 0;
	//var folders = [];

	// reset
	$('.carousel-inner').html("");
	$('.gallery-row').html("");
	$('.carousel-indicators').html("");

	// fetch first and start blurfunction
	/*
	imagesJSON = _.orderBy(imagesJSON, ['time', 'file'],['desc', 'asc']);
	firstImage = _.head(imagesJSON);
	firstImage = 'gallery/'+firstImage.path+'/'+firstImage.file;
	introBlur(firstImage);
	*/

	$.each(imagesJSON, function(key, val) {
		galname = val.tags[0];
		folder = val.path;
		/*
		 deprecated?
		if (folders.indexOf(folder) == -1) {
			folders.push(folder);
		};
		*/
		file = val.file;
		filePath = 'gallery/' + folder + '/' + file;
		thumbFilePath = 'gallery/' + folder + '_' + initialThumbSize +'/' + file;
		time = val.time;
		tags = val.tags;
		tagsString = tags.toString().replace(',', ' ');

		// check if a filter was passed to this function
		if (filter && filter != "all") {
			console.log("filter: " + filter);
			if ($.inArray(filter, tags) == -1) {
				return true
			};
		}

		// Build thumbnails gallery
		/*
		galitem = '<div class=\"col-lg-2 col-md-3 col-sm-4 col-xs-6 gallery-item img-hidden\" data-time=\"' + time
				+ '\" data-path=\"' + filePath + '\" data-tags=\"'+ tagsString
				+ '\"> <a href=\"#lb-arbeiten\" data-slide-to=\"' + i 
				+ '\" data-toggle=\"modal\"> <img alt=\"\" class="lazy" data-original="' + thumbFilePath + '\" src=\"images/FFF-0.png\">'
				+ '<span class=\"icon glyphicon glyphicon-zoom-in\"></span></a></div>';
		*/
		
		$("#thumb-prototype .gallery-item").attr('data-time', time).attr('data-path', filePath).attr('data-tags', tagsString);
		$("#thumb-prototype .thumb-div").attr('data-src', thumbFilePath);
		$("#thumb-prototype a").attr('data-slide-to', i);
		$("#thumb-prototype img").attr('data-original', thumbFilePath);
			
		$("#thumb-prototype .gallery-item").clone().appendTo(".gallery-row");

		// do the lightbox stuff
		//buildLightbox(i, tagsString, filePath);				
		
		i++;
	});

	// sort it
	//$("#arbeiten .gallery-item").sortit(["data-time"], true);
	//console.log("sortit");

	// choose first ten images for index-carousel
	//buildIndexCarousel();
	//console.log("buildIndexCarousel");

	// do the lightbox stuff
	buildLightbox(true);
	console.log("buildLightbox");
	//fitLightbox();

	// build filter buttons
	$.each(folders, function(key, val) {
		$('#filter-select').append('<option value=\"' + val + '\" data-filter=\"' + val + '\">' + val + '</option>');
		//$('.gallery-footer ul').append('<li class=\"navbar__item\"><a class=\"buttons__btn btn btn-sm btn-default ifx-button\" data-filter=\"' + val + '\">' + val + '</a></li>');
	});
	$('#filter-select').selectpicker('refresh');
	initGalleryNavigation();
	console.log("initGalNav");
	
	// fade em in...
	galleryFilter("all");
	console.log("Filter");
	//preloader();
	//console.log("preloader");
	
	initGallery();
};

function buildLightbox(init) {
	
	console.log("buildLightbox startet");

	// reset
	$('#arbeiten .carousel-inner').html("");
	$('#arbeiten .carousel-indicators').html("");

	// init 'true' to fetch all images, else only active
	if (init) {
		items = $("#arbeiten .gallery-item");
	} else {
		items = $("#arbeiten .gallery-item").filter('.img-active');
	}
	

	$.each(items, function(i) {
		filePath = $(this).attr("data-path");
		$(this).find("a").attr("data-slide-to",i);

		// Build Carousel
		cinner = '<div class=\"item\" style=\"background-image:url('+ filePath + ');\"><img alt=\"\" src=\"images/FFF-0.png\"></div>';
		$('#arbeiten .carousel-inner').append(cinner);
		
		/*
		//Build slide navigation
		liitem = '<li data-app-prevent-settings=\"\" data-target=\"#lb-arbeiten\" data-slide-to=\"' + i + '\"></li>';
		$('#arbeiten .carousel-indicators').append(liitem);
		*/
		
	})
	

	var total = $(items).length;
	var currentIndex = $('.item.active').index() + 1;
	$('.slidetext').html(currentIndex + '/'  + total);
	
	// This triggers after each slide change
	$('#lb-arbeiten').on('slid.bs.carousel', function () {
		currentIndex = $('.gallery-carousel div.active').index() + 1;
		console.log("current: "+currentIndex);
 		// Now display this wherever you want
		var text = currentIndex + ' / ' + total;
		$('.indicator-text').html(text);
	});

	$('#arbeiten .carousel-indicators li').removeClass('active');
	$('#arbeiten .carousel-indicators li:last').addClass('active');
	$('#arbeiten .carousel-inner .item').removeClass('active');
	$('#arbeiten .carousel-inner .item:last').addClass('active');
	
	$('#lb-arbeiten').carousel();
};

function initGalleryNavigation() {
	
	//$('[data-filter]').on('change', function() {
	$('#filter-select').on('change', function() {
		console.log("animrunning: "+animrunning);
		$('#filter-select').selectpicker('refresh');
		
		/*
		if($(this).hasClass('active')){
			console.log()
			return false;
		}
		*/
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

	$("#arbeiten .gallery-item").each(function(k, v) {
		
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
		inItems = $("#arbeiten .gallery-item").not('.img-active');
	} else {
		$($("#arbeiten .gallery-item")).each(function(k) {
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
	
	var inViewportLength = $('#arbeiten .inViewport').length;
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
									$('#arbeiten').trigger('resize');
								}
							});
						});
						//buildLightbox();
						//$("img.lazy").trigger("lload");
					}
				}
			});
			fi++
	})
	
	$( "#arbeiten" ).scrollTop( 0 );
	
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
	
	$('#arbeiten').css('height','90%').css('height','100%');
	
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
		
		$(".squareit").squareit();
		
		//bLazy
		var bLazy = new Blazy({
			container: '#arbeiten', // Default is window
	        success: function(element){
				console.log('bLazy finish');
	        }
	   });		
	
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

(function($) {
	$.fn.squareit = function(a,b) {
		var a = !a ? 1 : a;
		var b = !b ? 1 : b;
		console.log(a+' '+b);
		$(this).css('height', $(this).width() * b / a);
		return this;
	}
})(jQuery);
