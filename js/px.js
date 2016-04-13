// Create the loader and queue images. Images will not
// begin downloading until we tell the loader to start.
var imagesLoader = new PxLoader();

$('img').each(function(k) {
	var pxImage = new PxLoaderImage($(this).attr('src'));
	imagesLoader.add(pxImage);
})
// log the name of every resource as its loaded
imagesLoader.addProgressListener(function(e) {
	//console.log(e.resource.getName());
});

// the callback function receives an event object:
var sampleEvent = {

	// the updated resource
	resource : {}, // the resource parameter provided to loader.add()

	// status for the updated resource
	loaded : true,
	error : false,
	timeout : false,

	// stats for all resources that match the listener's tags
	completedCount : 42,
	totalCount : 100
};

// callback that will be run once images are ready
imagesLoader.addCompletionListener(function(e) {
	imagesPreLoaded = true;
	//preloader(true);
});

var blurredImageLoaded = null;

function introBlur(image) {
	
	var exists = false;
	var imgSrc = image;
	console.log(imgSrc);
	console.log("image: " + image);
	var imgSrcSplit = imgSrc.split("/");
	var imgSrc_720 = imgSrcSplit[0] + "/blur/" + imgSrcSplit[1] + "_720/" + imgSrcSplit[2];
	var imgSrc_1200 = imgSrcSplit[0] + "/blur/" + imgSrcSplit[1] + "_1200/" + imgSrcSplit[2];
	var blurImage = imgSrc_720;
	//var blurImage = image.replace('gallery','gallery/blur');
	console.log("blurImage: " + blurImage);

	/*
	 $('#intro .modal-backdrop').backgroundBlur({
	 imageURL : imgSrc,
	 blurAmount : 20,
	 imageClass : 'bg-blur',
	 duration: 1000,
	 endOpacity : 1
	 });

	 return false;
	 */

	$('#blurPreloader').attr('src', blurImage).imagesLoaded().always(function(instance) {
		//console.log('blur image request');
	}).done(function(instance) {
		//console.log('image successfully loaded');
		$('#intro .modal-backdrop').css('background-image', 'url(' + blurImage + ')').velocity({
			opacity : 1
		}, {
			duration : 1000
		});
		blurredImageLoaded = true;
		$(this).remove();
		// prevent memory leaks
		console.log("blur image loaded");
	}).fail(function() {
		console.log('image failure');

		//bluur.config('gallery/blur.php');

		//$('#intro .blur').each(function(){
		var depth = 120;
		var to_blur = imgSrc;
		var placement = $('#intro .blur').data('target');
		var alt = "";
		bluur.image(to_blur, depth, function(response) {
			console.log(response);
			response = "gallery/" + response;
			$('#intro .modal-backdrop').css('background-image', 'url(' + response + ')').velocity({
				opacity : 1
			}, {
				duration : 1000,
				complete : function() {
					blurredImageLoaded = true;
				}
			});
		});
		//});
	}).progress(function(instance, image) {
		var result = image.isLoaded ? 'loaded' : 'broken';
		//console.log( 'image is ' + result + ' for ' + image.img.src );
	});
};

function intro() {
	// place intro stuff here
	var introTimer = setInterval(function() {
		if (imagesPreLoaded && blurredImageLoaded) {
			preloader(true);
			clearInterval(introTimer);
		}
	}, 1000);

};

// requires global var imagesPreLoaded;
function preloader(loaded_) {

	if (loaded_) {
		$('#intro .typed').addClass('hidden');
		$("#intro .typed2").removeClass('hidden');
		$("#intro .typed2").typed({
			strings : ["cad-artist.de"],
			stringsElement : null,
			typeSpeed : 50,
			startDelay : 0,
			backSpeed : 10,
			backDelay : 1500,
			loop : false,
			loopCount : false,
			showCursor : false,
			cursorChar : "",
			attr : null,
			contentType : 'text',
			callback : function() {
				$('.introwrapper').animateCSS("pulse", {
					duration : 100
				});
			},
			preStringTyped : function() {
			},
			onStringTyped : function() {
			},
			resetCallback : function() {
			}
		});

		$('#intro .typed').typed('reset').removeData('typed').remove();

		setTimeout(function() {

			$('#main').removeClass('hidden');
			//$('.page').addClass('page-inactive').first().addClass('page-active').removeClass('page-inactive');
			$('.introwrapper').velocity({
				opacity : 0
			}, {
				duration : 500,
			});
			$('#intro').velocity('fadeOut', {
				duration : 1500,
				easing : "swing",
				complete : function() {
					$('#intro .typed2').typed('reset').removeData('typed2').remove();
					$('#intro').remove();
					$('#intro-style').remove();
					$('#main').removeClass('height100');
					//$('#main').removeClass('page-inactive hidden height100');
					$('#intro').addClass('page-inactive').removeAttr('style').css('display', 'none');
					//$('#logobox').velocity({top: "50px", duration: 3000, easing: "linear"});
					pageFunction('page1');
				},
				begin : function() {
					$('#logobox').velocity('transition.slideDownInPage', {
						duration : 600,
						easing : "swing",
						display : 'block'
					});
					$('.mbr-navbar__item').each(function(i) {
						$(this).velocity('transition.slideDownInPage', {
							duration : 600,
							easing : "swing",
							display : 'block',
							delay : 200 * i,
							complete : function() {
								$(this).removeAttr('style');
							}
						});
					});
				}
			})

		}, 2000);

		// init carousels
		//$('.carousel').carousel();

		return false;
	}

	imagesLoader.start();
	//imagesLoader.log();
}

