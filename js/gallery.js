// gallery.js

var gJ; // = ex galleryJSON
var imagesJSON;
var animrunning = false;
var imagesPreLoaded;

function loadJSON() {
   //console.log('loadJSON');

    var req = new XMLHttpRequest();
    req.open('GET', options.JSONurl, true);

    req.onload = function() {
        if (req.status >= 200 && req.status < 400) {
            gJ = JSON.parse(req.responseText);
           //console.log(sortedIdsBy());
            buildGallery();
        } else {
           //console.log('no gallery.json received');
        }
    };

    req.onerror = function() {
       //console.log('connection error');
    };

    req.send();
};

function buildGallery(filter) {

    var filter = filter || 'all';
    options = options || gJ.options;

    buildGalleryItems();

    // do the lightbox stuff
    buildLightbox(true);
    buildGalleryNavigation();
    initGalleryNavigation();

    // fade em in...
    galleryFilter(filter);

    if (gJ.sliders && gJ.sliders.length) {
      buildSliders();
    }

    //preloader();
    initGallery();
};


function buildGalleryItems(filter) {
   //console.log('buildGalleryItems');

    //var initialThumbSize = _.min(options.sizes);
    var initialThumbSize = getMin(options.sizes);

    var i = 0;

    if (options.thumbPadding && options.thumbPadding != 0) {
        createStyle({
            id: 'item-padding',
            style: 'div#gallery-row div.gallery-item {padding: ' + thumbPadding + 'px}'
        });
    }

    // reset
    clearHtml(['.gallery-row']);
    addClasses(document.querySelector('#thumb-prototype .gallery-item'), options.thumbSizeSizes[options.thumbSize]);
    for (var key in gJ.images) {
        var val = gJ.images[key];
        var folder = val.folder;
        var file = val.file;
        var respiPath = 'gallery/' + folder + '_respi/' + file;
        var thumbFilePath = 'gallery/' + folder + '_' + initialThumbSize + '/' + file;

        // check if a filter was passed to this function
        if (filter && filter !== 'all') {
            if (tags.indexOf(filter) === -1) {
                return true
            };
        }

        prototype({
            'template': '#thumb-prototype',
            'selectors': ['respi', 'i', 'key'],
            'values': [respiPath, i, key],
            'targets': '.gallery-row'
        });

        i++;
    };

    // delete thumb prototype
    //var tP = document.getElementById('thumb-prototype');
    //tP.parentNode.removeChild(tP);
};

function buildLightbox(init) {
   //console.log('buildLightbox');

    var itemSelector = init ? '.gallery-item' : '.gallery-item.img-active';
    var items = document.querySelectorAll('#gallery-section '+itemSelector);
    var itemsLength = items.length;
    var $galleryLightbox = $('#gallery-lightbox');

    if (itemsLength === 0) {
     //console.log('no gallery items');
      return false;
    }

    // check if lightbox is present, if not, create it within body element
    if (!$galleryLightbox.length) {
     //console.log('nope');
      document.getElementById('lightbox-prototype').querySelector('div').setAttribute('id','gallery-lightbox');
      prototype({
          'template': '#lightbox-prototype',
          'targets': 'body',
          'cut': true
      });
      $galleryLightbox = $('#gallery-lightbox');
    }

    // reset
    clearHtml(['div#gallery-lightbox div.carousel-inner', 'div#gallery-lightbox .carousel-indicators']);
    for (var i = 0; i < itemsLength; i++) {

        //items[i].getElementsByTagName('a')[0].setAttribute('data-slide-to', i);
        items[i].querySelector('a').setAttribute('data-slide-to', i);

        // Build Carousel:
        var _respi_path = items[i].querySelector('.thumb-div').getAttribute('respi-path');

        prototype({
            'template': '#lightbox-item-prototype',
            'selectors': ['respi-path'],
            'values': [_respi_path],
            'targets': '#gallery-lightbox .carousel-inner'
        });

    }

    var total = items.length;
//    var currentIndex = document.querySelectorAll('.item.active').index + 1;
    var currentIndex = document.querySelectorAll('div#gallery-lightbox div.item.active').index + 1;

     //var $galleryLightbox = $('#gallery-lightbox');
    // This triggers after each slide change
    $galleryLightbox.on('slid.bs.carousel', function() {
        currentIndex = $galleryLightbox.find('.gallery-carousel div.active').index() + 1;
        $galleryLightbox.find('.indicator-text').html(currentIndex + '/' + total);
    });

    $galleryLightbox.on('shown.bs.modal', function(e) {
        $galleryLightbox.find('.gallery-carousel .item').respi();
    });

    $galleryLightbox.find('.carousel-indicators li').removeClass('active').last().addClass('active');;
    $galleryLightbox.find('.carousel-inner .item').removeClass('active').last().addClass('active');

    $galleryLightbox.carousel();
};

function buildGalleryNavigation(tags) {
   //console.log('buildGalleryNavigation');

    var tags = tags || gJ.tags;

    // build filter buttons
    document.getElementById('filter-select').innerHTML = '<option value="all" data-filter="all">----</option>';
    var tlen = tags.length;
    for (var i = 0; i < tlen; i++) {
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
            $('footer.gallery-footer .btn').removeClass('active');
            galleryFilter($(this).addClass('active').val());
            $('#filter-select').selectpicker('refresh');
        }
    });
};

function buildSliders(slider) {
   //console.log('buildSliders');

    var sliders = slider || gJ.sliders;
    if (!sliders) { return false; }
    var sliderKeys = Object.keys(sliders);

    if (!sliderKeys || sliderKeys.length === 0) {
       //console.log('no sliders');
        return false;
    }

    for (var key in sliders) {

        var slidersLength = sliders[key][0].length;
        if (slidersLength === 0) {
           //console.log('no images');
            return false;
        }
        if (sliders[key][0] === 'auto') {
            var number = sliders[key][2] < 2 ? 3 : sliders[key][2];
            //sliders[key][0] = _.take(sortedIdsBy('time'), number);
            sliders[key][0] = sortedIdsBy('time').slice(0,number);
            slidersLength = sliders[key][0].length;
        }

        clearHtml(['#' + key + ' .carousel-inner', '#' + key + ' .carousel-indicators']);

        for (var i = 0; i < slidersLength; i++) {

            var image = sliders[key][0][i];
            var gJimage = gJ.images[image];
            var respiPath = 'gallery/' + gJimage.folder + '_respi/' + gJimage.file;

            // add thumb & image to preloader:
            if (imagesLoader) {
                //imagesLoader.addImage(thumb);
                imagesLoader.addImage(image);
            }

            prototype({
                'template': '#slider-item-prototype',
                'selectors': ['respi-path'],
                'values': [respiPath],
                'targets': '#' + key + ' .carousel-inner'
            });

            var indicator = '<li class=\"box-shadow--2dp\" data-app-prevent-settings=\"\" data-target=\"#' + key + '\" data-slide-to=\"' + i + '\"></li>';

            var $key = $('#' + key);
            $key.find('.carousel-indicators').append(indicator)
                .find('li').removeClass('active').first().addClass('active');
            $key.find('.item').removeClass('active').first().addClass('active');

        }

        var int = 2000;
        if (sliders[key][1] && sliders[key][1] != 0) {
            int = sliders[key][1] * 1000;
        }

        $key.carousel({
            interval: int
        });

    }
};

//requires var animrunning = false;
function galleryFilter(fil) {
   //console.log('galleryFilter');

    var fi = 0;
    var cb;
    var inItems = [];
    var outItems = [];

    // prevent double animation
    //???
    var animrunning = false;
    if (animrunning) {
        return false;
    }

    var items = $('#gallery-section').find('div.gallery-item');

    if (!fil || fil === 'all') {
        items.not('.img-active').addClass('img-active').removeClass('img-inactive img-hidden');
        return false;
    }

    for (var key in gJ.images) {
        if (gJ.images[key].tags.indexOf(fil) !== -1) {
            items.not('.img-active').filter('[data-id="' + key + '"]').addClass('img-active').removeClass('img-inactive img-hidden');
            continue;
        }
        items.filter('.img-active[data-id="' + key + '"]').addClass('img-inactive img-hidden').removeClass('img-active');
    }

    return false;

    $('#gallery-section').find('div.gallery-item').each(function() {
        if ($(this).attr('data-tags').not('.img-active').includes(fil)) {
            inItems.push($(this));
            return;
        }
        if (!$(this).hasClass('img-inactive')) {
            if ($(this).hasClass('inViewport')) {
                outItems.push($(this));
            } else {
                $(this).addClass('img-inactive').removeClass('img-hidden img-active');
            }
        }
    });


    /*
        var inViewportLength = $('div#gallery-row').find('.inViewport').length;
        var inViewportLength = (inViewportLength < 20) ? 20 : inViewportLength;
    */
    $(outItems).each(function(i) {
        animrunning = true;
        $(this).velocity('transition.fadeOut', {
            delay: 100 * fi,
            duration: 250,
            complete: function() {
                $(this).removeClass('img-active').addClass('img-hidden');
                if (i + 1 >= outItems.length) {
                    $(outItems).each(function(j) {
                        $(this).velocity('transition.fadeOut', {
                            duration: 250,
                            complete: function() {
                                $(this).addClass('img-inactive').removeClass('img-hidden');
                                animrunning = false;
                                if (typeof portfolioLoad !== 'undefined') {
                                    portfolioLoad.update();
                                }
                                $('#gallery-section').trigger('resize');
                            }
                        });
                    });
                }
            }
        });
        fi++;
    });

    $('#gallery-section').scrollTop(0);

    inItems.addClass('img-active').removeClass('img-inactive img-hidden');

    if (typeof portfolioLoad !== 'undefined') {
        portfolioLoad.update();
    }

    // ???:
    //$('#gallery-section').css('height', '90%').css('height', '100%');

    buildLightbox();

};

function initGallery() {
   //console.log('initGallery');

    // background zoom function
    var zel = document.querySelectorAll('div#gallery-lightbox .zoom');
    var zelLength = zel.length;
    for (var i = 0; i < zelLength; i++) {
        zel[i].addEventListener('click', function(e) {
            //e.preventDefault();
            var el = document.querySelectorAll('div#gallery-lightbox div.gallery-carousel div.item');
            var elLength = el.length;
            for (var j = 0; j < elLength; j++) {
                if (el[i].classList) {
                    el[i].classList.toggle('bg-cover');
                } else {
                    var classes = el[j].className.split(' ');
                    var existingIndex = classes.indexOf('bg-cover');
                    if (existingIndex >= 0)
                        classes.splice(existingIndex, 1);
                    else
                        classes.push('bg-cover');
                    el[j].className = classes.join(' ');
                }
            }
        });
    };

    $('#gallery-lightbox').carousel();

    proportion({
      selector : 'section#gallery-section div.gallery-item',
      proportion : options.proportion,
      className : 'pgi',
      styleId : 'prop-gallery-item'
    });

    $('section#gallery-section').find('div.gallery-item div.thumb-div').respi();
    $('div#gallery-lightbox').find('div.item').respi();

    $('section#gallery-section').find('div.gallery-item')
        .on('click', function(e) {
            $('#gallery-lightbox').modal('show');
        })
        .onScreen({
            container: '#gallery-section',
            direction: 'vertical',
            doIn: function(e) {
                // Do something to the matched elements as they come in
                var el = $(this).find('div.thumb-div');
                //el.css('background-image', "url(" + el.attr("data-src") + ")");

            },
            doOut: function() {
                // Do something to the matched elements as they get off scren
               //console.log('doout');
            },
            tolerance: 0,
            throttle: 50,
            toggleClass: 'onscreen',
            lazyAttr: null,
            lazyPlaceholder: 'someImage.jpg',
            debug: false
        });

    // load admin-functions, if available
    try {
        return jsCheckLoaded('adminAssets', function() {
            adminInit();
        });
    } catch (err) {
        //console.log(err);
    }

};

$(function() {

    document.body.setAttribute('respi-sizes', options.sizes.toString());

    // wait for js to be loaded
    return jsCheckLoaded('assets', function() {
        loadJSON();
    });

});
