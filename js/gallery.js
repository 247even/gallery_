// gallery.js

var gJ; // = ex galleryJSON
var imagesJSON;
var animrunning = false;
var galleryPath = "./gallery/";
var JSONurl = "gallery/gallery.json";
var imagesPreLoaded;

function loadJSON() {

    console.log('loadJSON');

    var req = new XMLHttpRequest();
    req.open('GET', 'gallery/gallery.json', true);

    req.onload = function() {
        if (req.status >= 200 && req.status < 400) {
            buildGallery(JSON.parse(req.responseText));
        } else {
            console.log('no gallery.json received');
        }
    };

    req.onerror = function() {
        console.log('connection error');
    };

    req.send();
};

function buildGallery(data, filter) {
    gJ = data;

    document.body.setAttribute('respi-sizes', gJ.sizes);

    buildGalleryItems();

    // do the lightbox stuff
    //buildLightbox(true);

    buildGalleryNavigation();
    initGalleryNavigation();

    // fade em in...
    galleryFilter('all');

    buildSliders();

    //preloader();

    initGallery();
};


function buildGalleryItems(filter) {

    var initialThumbSize = _.min(gJ.sizes);
    var i = 0;

    thumbDisplaySizes = {
        'xs': ['col-xs-1'],
        'sm': ['col-xs-2', 'col-sm-1'],
        'md': ['col-xs-3', 'col-sm-2', 'col-md-1'],
        'lg': ['col-xs-4', 'col-sm-3', 'col-md-2', 'col-lg-1'],
        'xl': ['col-xs-5', 'col-sm-4', 'col-md-3', 'col-lg-2'],
        'xxl': ['col-xs-6', 'col-sm-5', 'col-md-4', 'col-lg-3']
    };

    var thumbSize = !gJ.thumbDisplay ? thumbDisplaySizes['md'] : thumbDisplaySizes[gJ.thumbDisplay];
    var thumbPadding = !gJ.thumbPadding ? 0 : gJ.thumbPadding;
    thumbPadding = thumbPadding != 0 ? 'style="padding:' + parseInt(thumbPadding) + 'px"' : '';

    // reset
    clearHtml(['.gallery-row']);

    var tpgi = document.querySelector('#thumb-prototype .gallery-item');
    addClasses(tpgi, thumbSize);

    for (var key in gJ.images) {

        var val = gJ.images[key];
        var folder = val.path;
        var file = val.file;
        var respiPath = 'gallery/' + folder + '_respi/' + file;
        var thumbFilePath = 'gallery/' + folder + '_' + initialThumbSize + '/' + file;

        // check if a filter was passed to this function
        if (filter && filter != 'all') {
            //console.log('filter: ' + filter);
            if (tags.indexOf(filter) == -1) {
                return true
            };
        }

        /*
        document.querySelector('#thumb-prototype .thumb-div').setAttribute('respi-path', respiPath);
        document.querySelector('#thumb-prototype a').setAttribute('data-slide-to', i);

        tpgi.setAttribute('data-id', key);
        tpgi.setAttribute('data-time', val.time);
        tpgi.setAttribute('data-tags', val.tags);
        document.getElementById('gallery-row').appendChild( tpgi.cloneNode(true) );
        */

        prototype({
            'template': '#thumb-prototype',
            'selectors': ['respi', 'i', 'key', 'time', 'tags'],
            'values': [respiPath, i, key, val.time, val.tags],
            'targets': '.gallery-row'
        });

        i++;
    };

    //var tP = document.getElementById('thumb-prototype');
    //tP.parentNode.removeChild(tP);
};

function buildLightbox(init) {

    var items = document.querySelectorAll('.gallery .gallery-item.img-active');
    // if init = 'true', fetch all images, else only active
    if (init) {
        items = document.querySelectorAll('.gallery .gallery-item');
    }
    var itemsLength = items.length;

    prototype({
        'template': '#lightbox-prototype',
        'targets': 'body',
        'cut': true
    });

    // reset
    clearHtml(['.carousel-inner', '.carousel-indicators']);

    for (var i = 0; i < itemsLength; i++) {

        items[i].getElementsByTagName('a')[0].setAttribute('data-slide-to', i);

        // Build Carousel:
        var _respi_path = items[i].getElementsByClassName('thumb-div')[0].getAttribute('respi-path');

        prototype({
            'template': '#lightbox-item-prototype',
            'selectors': ['respi-path'],
            'values': [_respi_path],
            'targets': '#gallery-lightbox .carousel-inner'
        });

    }

    var total = items.length;
    var currentIndex = document.querySelectorAll('.item.active').index + 1;

    // This triggers after each slide change
    $('.gallery-lightbox').on('slid.bs.carousel', function() {
        currentIndex = $('.gallery-carousel div.active').index() + 1;
        $('.indicator-text').html(currentIndex + '/' + total);
    });

    $('.gallery-lightbox').on('shown.bs.modal', function(e) {
        $('.gallery-lightbox .gallery-carousel .item').respi();
    });

    $('.gallery-lightbox .carousel-indicators li').removeClass('active').last().addClass('active');;
    $('.gallery-lightbox .carousel-inner .item').removeClass('active').last().addClass('active');

    $('.gallery-lightbox').carousel();
};

function buildGalleryNavigation(tags) {
    if (!tags) {
        var tags = gJ.tags;
    }

    // build filter buttons
    document.getElementById('filter-select').innerHTML = '<option value="all" data-filter="all">----</option>';

    for (var i = 0, len = tags.length; i < len; i++) {
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

function buildSliders(slider) {

    var sliders = (slider) ? slider : gJ.sliders;
    if (!sliders) { return false; }

    var sliderKeys = Object.keys(sliders);

    if (!sliderKeys || sliderKeys.length === 0) {
        console.log('no sliders');
        return false;
    }

    console.log(sliders);

    for (var key in sliders) {

          var slidersLength = sliders[key][0].length;
          if (slidersLength === 0) {
              console.log('no images');
              return false;
          }
          if (sliders[key][0] === 'auto') {

          }

          console.log('clear: #'+ key);
          clearHtml(['#'+ key +' .carousel-inner', '#'+ key +' .carousel-indicators']);
//          clearHtml(['#''slider-1 .carousel-inner', '#slider-1 .carousel-indicators']);

          for (var i = 0; i < slidersLength; i++) {

              var image = sliders[key][0][i];
              var gJimage = gJ.images[image];
              var respiPath = 'gallery/' + gJimage.path + '_respi/' + gJimage.file;

              // add thumb & image to preloader:
              if (imagesLoader) {
                //imagesLoader.addImage(thumb);
                imagesLoader.addImage(image);
              }

              prototype({
                  'template': '#slider-item-prototype',
                  'selectors': ['respi-path'],
                  'values': [respiPath],
                  'targets': '#'+ key +' .carousel-inner'
              });

              var indicator = '<li class=\"box-shadow--2dp\" data-app-prevent-settings=\"\" data-target=\"#'+ key +'\" data-slide-to=\"' + i + '\"></li>';
              $('#'+ key +' .carousel-indicators').append(indicator);
              $('#'+ key +' .carousel-indicators li').removeClass('active');
              $('#'+ key +' .carousel-indicators li:first').addClass('active');
              $('#'+ key +' .item').removeClass('active');
              $('#'+ key +' .item:first').addClass('active');
          }

          var int = 2000;
          if (sliders[key][1] && sliders[key][1] != 0) {
              int = sliders[key][1] * 1000;
          }

          $('#'+key).carousel({
            interval: int
          });

    }
};

//requires var animrunning = false;
function galleryFilter(fil) {

    var fi = 0;
    var cb;
    var inItems = [];
    var outItems = [];

    // prevent double animation
    var animrunning = false;
    if (animrunning) {
        return false;
    }

    var filteredIds = _.keys(_.pickBy(gJ.images, {
        'tags': [fil]
    }));

    if (!fil || fil == 'all') {
        inItems = $('.gallery .gallery-item').not('.img-active');
    } else {
        $('.gallery .gallery-item').each(function(k) {
            var tags = $(this).attr('data-tags');
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
            delay: 100 * fi,
            duration: 250,
            complete: function() {
                $(this).removeClass('img-active').addClass('img-hidden');
                if (i + 1 >= outLength) {

                    $.each(outItems, function(j) {
                        $(this).velocity('transition.fadeOut', {
                            duration: 250,
                            complete: function() {
                                $(this).addClass('img-inactive').removeClass('img-hidden');
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

    $('.gallery').scrollTop(0);

    $.each(inItems, function(k) {

        $(this).addClass('img-active').removeClass('img-inactive').removeClass('img-hidden');

        if (typeof portfolioLoad !== 'undefined') {
            portfolioLoad.update();
        }

        fi++;
    })

    if (typeof portfolioLoad !== 'undefined') {
        portfolioLoad.update();
    }

    $('.gallery').css('height', '90%').css('height', '100%');

    buildLightbox();

};

function loadImage(el) {
    el.css('background-image', "url(" + el.attr("data-src") + ")");
};

function initGallery() {
    console.log('initGallery');

    // background zoom function
    var zel = document.querySelectorAll('.gallery-lightbox .zoom');
    var zelLength = zel.length;
    for (var i = 0; i < zelLength; i++) {
        zel[i].addEventListener('click', function(e) {
            //e.preventDefault();
            var el = document.querySelectorAll('.gallery-lightbox .gallery-carousel .item');
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

    proportion(document.querySelectorAll('.gallery .gallery-item'), gJ.proportion);
    $('.gallery .gallery-item').respi(gJ.sizes);
    $('.gallery-carousel .item').respi();

    window.addEventListener('resize', debounce(
        function(e) {
            proportion(document.querySelectorAll('.gallery .gallery-item'), gJ.proportion);
            proportion(document.querySelectorAll('.gallery-lightbox .gallery-carousel .item'), gJ.proportion);
            $('.gallery .gallery-item').respi(gJ.sizes);
            $('.gallery-lightbox .gallery-carousel .item').respi();
            console.log('resize');
        }, 500, false
    ));

    $('.gallery .gallery-item')
        .on('click', function(e) {
            $('#gallery-lightbox').modal('show');
        })
        .onScreen({
            container: '#gallery-section',
            direction: 'vertical',
            doIn: function(e) {
                // Do something to the matched elements as they come in
                loadImage($(this).find('.thumb-div'));
            },
            doOut: function() {
                // Do something to the matched elements as they get off scren
                console.log('doout');
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
            console.log('admin init');
        });
    } catch (err) {
        //console.log(err);
    }

};

$(function() {
    // wait for js to be loaded
    return jsCheckLoaded('assets', function() {
        loadJSON();
    });
    /*
    if (typeof adminAssets == 'undefined' || !adminAssets) {
    		setTimeout(function() {
    				adminInit();
    		}, 1000);
    		return false;
    }
    */
    console.log('after js check load');
    //loadJSON();
});
