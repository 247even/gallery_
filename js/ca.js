function pageFunction(t) {

	if (t == "page1") {

		history.pushState( { 
			target: "page1" 
		}, null, "/start");
		
		$('.control-wrapper').each(function() {
			$(this).center().fadeIn();
		});
		
		// init carousel
		setTimeout(function(){ $('#slider-1').carousel(); }, 2000);
		return false;
	}

	if (t == "page2") {

		history.pushState( { 
			target: "page2" 
		}, null, "/leistungen");

		$('.mbr-navbar').removeClass('mbr-navbar--transparent');
		
		// https://github.com/verlok/lazyload
		var leistungenLoad = new LazyLoad({
		    threshold: 400,
		    container: document.getElementById('leistungen-wrapper'),
		    elements_selector: ".lazy",
		    throttle: 60,
		    data_src: "original",
		    data_srcset: "srcset",
		    show_while_loading: false,
		    callback_set: function() { /* ... */ }
		});	
		
		return false;
	}

	if (t == "page3") {

		history.pushState( { 
			target: "page3" 
		}, null, "/portfolio");		
		
		$('.mbr-navbar').removeClass('mbr-navbar--transparent');
		$('#lb-arbeiten').carousel();
		
		// background zoom function
		$('.mbr-gallery .zoom').on('click', function(e){
			//e.preventDefault();
			$('.gallery-carousel .item').toggleClass('bg-cover');
		});
		
		// logo on top position
	    $('#lb-arbeiten').on('show.bs.modal', function () {
			$('#logobox2').clonePosition('#logobox');
		}).on('shown.bs.modal', function () {
			
		}).on('hidden.bs.modal', function () {
	
		});
		
		// https://github.com/verlok/lazyload
		var portfolioLoad = new LazyLoad({
		    threshold: 600,
		    container: document.getElementById('arbeiten'),
		    elements_selector: ".img-active .lazy",
		    skip_invisible : false,
		    throttle: 60,
		    data_src: "original",
		    data_srcset: "srcset",
		    show_while_loading: false,
		    callback_set: function() { /* ... */ }
		});		
		return false;
	}

	if (t == "page4") {

		history.pushState( { 
			target: "page4" 
		}, null, "/kontakt");

		$('.mbr-navbar').removeClass('mbr-navbar--transparent');
		$('#slider-1').carousel('pause');
		return false;
	}

}

function navigation() {

	$('#lb-arbeiten').on('show.bs.modal', function(e) {
		console.log(e.relatedTarget);
	});
	// clickoutside for navbars
	$(document).click(function(event) {
		event.preventDefault();
		var clickover = $(event.target);
		var $navbar = $(".navbar-collapse");
		var _opened = $navbar.hasClass("in");
		if (_opened === true && !clickover.hasClass("navbar-toggle")) {
			$navbar.collapse('hide');
		}
	});

	// start
	$('.p1').on('click', function(e) {
		e.preventDefault();
		
		target = "page1";
		pageTransition(target);
		$('.mbr-navbar').addClass('mbr-navbar--transparent');
	});

	// leistungen
	$('.p2').on('click', function(e) {
		
		e.preventDefault();
		$('#slider-1').carousel('pause');
		target = "page2";
		pageTransition(target);
	});

	// portfolio / arbeiten
	$('.p3').on('click', function(e) {
		e.preventDefault();
		$('#slider-1').carousel('pause');
		target = "page3";
		$('#logobox2').clonePosition('#logobox');
		pageTransition(target);
	});

	// kontakt
	$('.p4').on('click', function(e) {
		//e.preventDefault();
		//$('.mbr-navbar').removeClass('mbr-navbar--transparent');
		$('#slider-1').carousel('pause');
		target = "page4";
		pageTransition(target);
	}).one( "click", function(e) {
		//evt.preventDefault();
		var mapssrc = $("#gmap").attr('maps-data-src');
		$("#gmap").attr("src", mapssrc);
		console.log("gmap set");
	});;
};

	function pageTransition(tgt) {

		pgFunc = tgt;
		target = '#' + tgt;

		// check if active or animating
		if ($(target).hasClass('page-active') || $(target).hasClass('page-animate')) {
			return false;
		}

		$('.page-active').removeAttr('style').css('z-index', 7).addClass('page-last').removeClass('page-active page-animate');

		$("html, body").velocity("scroll", {
			duration : 500,
			easing : "easeInOut",
			complete : function() {
				$(target).addClass('page-animate').css('z-index', 8).css('opacity', 1).velocity("transition.slideUpPageIn", {
					duration : 1000,
					complete : function() {
						$(this).addClass('page-active').removeAttr('style').removeClass('page-inactive page-animate');
						$('.page-last').removeAttr('style').addClass('page-inactive').removeClass('page-last');
						pageFunction(pgFunc);
					}
				});
			}
		});
	}

var imagesPreLoaded;
var blurredImageloaded = null;
var imagesJSON;
var animrunning = false;
var galleryPath = "./gallery/";
var JSONurl = "gallery/gallery.json";

$(function() {
	
	bluur.config('gallery/blur.php');
	
	intro();
	loadJSON();
	navigation();
	init();
	
	window.onpopstate = function(event) {
		$('.modal').modal('hide');
		pageTransition(event.state.target);
		console.log("location: " + document.location + ", state: " + JSON.stringify(event.state));
	};

	$('.selectpicker').selectpicker({
	  style: 'btn-danger'
	});
	
	$('#fb-link').on('click', function(){
		window.open(this.href, '_blank', ''); 
		return false;
	});

	// init stuff
	// mobile 
	if($('html').hasClass('mobile')){
		// carousel navigation arrows	
		$('.carousel-control, .control-wrapper').addClass('hidden');
		$('#filter-select').attr('data-mobile',"true");
		
	}

	$('#ext_menu-19 .mbr-navbar__column').on('click', function(e){
		e.preventDefault();
		console.log('click');
		$('#ext_menu-19 .mbr-navbar__hamburger').trigger('click');
	});
	
	$('#logobox2').clonePosition('#logobox');

	
	$(window).resize(function () {
	    waitForFinalEvent(function(){
			$('#logobox2').clonePosition('#logobox');
	    }, 500, "clonePosition");
	});

	$(window).on('load resize', (function() {
		$('.control-wrapper').each(function() {
			$(this).center();
		});
	}));
	
	$(window).on('mousemove', debounce(
		function(){
			//console.log("boing")
		}, 500, false)
	);
	
	//$(window).on('resize load', function(e){console.log(e)});
	//$(window).on('resize load', function(){$('#logobox2').clonePosition('#logobox');});
	//$('#logobox2').clonePosition('#logobox');
	

/*
	var timeout;
	function fitLBtimeout() {
		clearTimeout(timeout);
		timeout = setTimeout(fitLightbox, 50);
	}

	//$(document).on('add.cards change.cards', fitLightbox);
	$(window).on('resize load', fitLBtimeout);
	$(window).on('show.bs.modal', fitLBtimeout);
	$(window).on('slid.bs.carousel', fitLBtimeout);
*/
});

