/* Sliders */

var dis = true;

$('.admin-header a[aria-controls="slider-panel"]').on('shown.bs.tab', function(e) {

    $('#slider-clear-btn').prop('disabled', dis);
    $('#slider-preview-btn').prop('disabled', dis);
    $('#slider-save-btn').prop('disabled', dis);
    $('#slider-auto-btn').prop('disabled', false);

    if (stat.sliders[stat.workingSlider] && stat.sliders[stat.workingSlider][0] == 'auto') {
        $('#slider-auto-btn').prop('disabled', true);
    }

    if (!$('#slider-sortable .sortable-item').length) {
        for (var i = 0; i < 2; i++) {
            prototype({
                'template': '#placeholder-item-prototype',
                'targets': '#slider-sortable'
            });
        }

        proportion('#slider-sortable .placeholder-item', 1, 1);
    }

    document.getElementById('blur-slider').value = stat.effect[1];
    document.getElementById('blur-input').value = stat.effect[1];

    $('#blur-slider').rangeslider({
        polyfill: false,
        onInit: function(position, value) {},
        onSlide: function(position, value) {
            document.getElementById('blur-input').value = value;
        },
        onSlideEnd: function(position, value) {
            stat.effect[1] = value;
            document.getElementById('blur-input').value = value;
            blur('#effect-preview-image', value);
            blur('#effect-fullscreen', value);
        }
    });

    $('#blur-input').on('change', function() {
        var bsval = document.getElementById('blur-slider').value;
        if (bsval != this.val) {
            $('#blur-slider').val(this.value).change();
        }
    });

    $('#blur-save-button').click(function(e) {
        e.preventDefault();
        gJ.effect = stat.effect;
    });

    $('.gallery-row .selected-image').removeClass('selected-image');
    //	$('.sortable').sortable('destroy');
    document.getElementById('slider-sortable').innerHtml = '';

    function autoIds(q) {

        if (!$('#slider-sortable').is(':empty')) {
            $('#slider-sortable .gallery-item').each(function() {
                var did = $(this).attr('data-id');
                console.log(did);
                //$('[data-id="'+did+'"]').addClass("selected-image");

                $('.gallery-row [data-id="' + did + '"]').addClass('selected-image');
            });
            return false;
        }

        var slider1 = gJ.sliders[0];
        if (slider1.length > 1 || slider1 != 'auto') {
            /*
             for (var i = 0, len = slider1.length; i < len; i++) {
             $('*[data-id="'+slider1[i]+'"]').addClass("selected-image");
             }
             */

            for (var i = 0, len = slider1.length; i < len; i++) {
                console.log(slider1[i]);
                $('*[data-id="' + slider1[i] + '"]').addClass('selected-image');
                document.querySelector('.gallery-row div[data-id="' + gJ.sliders[0][i] + '"]').click();
            }
        }

        return false;

        var a = sliderNumber;
        if (q) {
            a = q;
        }
        var ids = [];
        $('.gallery .gallery-item').each(function(k, v) {
            if (k < a) {
                ids.push($(this).attr('data-id'));
            }
        });
    };
    autoIds();

    function reset() {
        clearHtml(['#slider-sortable']);
        removeClasses('.gallery-item', ['selected-image']);

        for (var i = 0; i < 2; i++) {
            prototype({
                'template': '#placeholder-item-prototype',
                'targets': '#slider-sortable'
            });
        }

        //var phel = document.querySelectorAll('#slider-sortable .placeholder-item');
        //proportion(phel, 1, 1);
        proportion('#slider-sortable .placeholder-item', 1, 1);

        $('#slider-save-btn').prop('disabled', true);
        $('#slider-clear-btn').prop('disabled', true);
        $('#slider-preview-btn').prop('disabled', true);
    };

    $('#slider-clear-btn').on('click', function(e) {
        e.preventDefault();
        reset();
    });

    $('#slider-fill-btn').on('click', function(e) {
        e.preventDefault();
        reset();
        var sliderNumber = $('#slider-number-select').val();
        for (var i = 0; i < sliderNumber; i++) {
            $('.gallery .gallery-item').eq(i).trigger('click');
        }
    });

    $('#slider-auto-btn').on('click', function(e) {
        e.preventDefault();

        $(this).toggleClass('btn-default btn-danger');

        if ($(this).hasClass('btn-default')) {
            reset();
            return false;
        }

        var sliderNumber = $('#slider-number-select').val();
        for (var i = 0; i < sliderNumber; i++) {
            $('.gallery .gallery-item').eq(i).trigger('click');
        }

        statSaveSlider('auto');
        console.log(stat.sliders);

        $('#slider-clear-btn').prop('disabled', false);
        $('#slider-preview-btn').prop('disabled', false);
        $('#slider-save-btn').prop('disabled', false);
    });

    $('#slider-save-btn').on('click', function(e) {
        e.preventDefault();
        gJ.sliders[0] = selectedIds();
        saveStatus(true);
    });

    $('#slider-preview-btn').on('click', function(e) {
        e.preventDefault();
        $('#slider-1').attr('id', stat.workingSlider);
        buildSliders(_.pick(stat.sliders, [stat.workingSlider]));
        $('#slider-wrapper').removeClass('hidden');
        $('#' + stat.workingSlider + ' .item').respi();
        setTimeout(function() {
            //$('#'+stat.workingSlider).carousel();
        }, stat.sliders[stat.workingSlider][1]);
    });

    $('#slider-wrapper').on('click', function() {
        $(this).addClass('hidden');
    });

    sortable('.sortable', {
        placeholderClass: 'col-xs-2 gallery-item sort-placeholder',
        forcePlaceholderSize: true,
        hoverClass: 'is-hovered'
    })

    sortable('.sortable')[0].addEventListener('sortupdate', function(e) {
        statSaveSlider();
        saveStatus(true);
    });

    $('#slider-interval-select').on('change', function() {
        statSaveSlider();
    });

    $('#slider-number-select').on('change', function() {
        statSaveSlider();
    });

    $('.gallery-row .gallery-item').off('click').on('click', function(e) {

        e.preventDefault();
        e.stopPropagation();

        $(this).toggleClass('selected-image');

        if ($(this).hasClass('selected-image')) {

            $('#slider-sortable .gallery-item').removeClass('selected-image');
            var cl = 'thumbSize gallery-item col-xs-2 selected-image sortable-item'
            $(this).clone().off().removeClass().addClass(cl).appendTo('#slider-sortable').on('click', function() {
                $('#slider-sortable .gallery-item').removeClass('selected-image');
                $(this).addClass('selected-image');
                loadBlur();
            });

            $('#slider-sortable .gallery-item a').remove();

            // set same height for chrome
            var el = document.querySelectorAll('#slider-sortable .gallery-item');
            if (el.length > 0) {
                proportion(el, 1, 1);
                $('#slider-sortable .gallery-item').css('height', Math.round(el[0].offsetHeight));
            }

        } else {
            var data_id = $(this).attr('data-id');
            $("#slider-sortable div[data-id='" + data_id + "']").remove();
        }

        sortable('.sortable');

        var selected_ids = selectedIds();
        var selLength = selected_ids.length;

        $('#slider-sortable .placeholder-item').remove();

        if (selLength === 0) {
            dis = true;
            for (var i = 0; i < 2; i++) {
                prototype({
                    'template': '#placeholder-item-prototype',
                    'targets': '#slider-sortable'
                });
            }
            proportion('#slider-sortable .placeholder-item', 1, 1);
            //$('#slider-sortable .placeholder-item').proportion(1,1);
            document.getElementById('effect-preview-image').src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
        }

        if (selLength > 0) {
            loadBlur();
        }

        if (selLength === 1) {
            dis = true;
            prototype({
                'template': '#placeholder-item-prototype',
                'targets': '#slider-sortable'
            });
            proportion('#slider-sortable .placeholder-item', 1, 1);
            //$('#slider-sortable .placeholder-item').proportion(1,1);
        }

        if (selLength >= 2) {
            statSaveSlider();
            /*
            stat.sliders[ stat.workingSlider ] = [
              selectedIds(),
              $('#slider-interval-select').val()
            ];
            */
            dis = false;
        }

        $('#slider-clear-btn').prop('disabled', dis);
        $('#slider-preview-btn').prop('disabled', dis);
        $('#slider-save-btn').prop('disabled', true);

        if (!dis && gJ.sliders[stat.workingSlider] !== stat.sliders[stat.workingSlider]) {
            $('#slider-save-btn').prop('disabled', false);
            saveStatus(true);
        }

    });

});

function fullScreen(img) {
    var ef = document.getElementById('effect-fullscreen');
    document.getElementById('effect-preview-image').addEventListener('click', function() {
        ef.style.display = 'block';
        ef.style.backgroundImage = 'url(' + img + ')';
    });
    ef.addEventListener('click', function() {
        ef.style.display = 'none';
    });
};

function loadBlur() {

    var selImg = document.querySelector('#slider-sortable .selected-image .thumb-div');

    if (!selImg) {
        console.log(selImg);
        var selItem = document.querySelector('#slider-sortable .gallery-item');
        selItem.className += ' selected-image';
        selImg = document.querySelector('#slider-sortable .selected-image .thumb-div');
    }

    var imgSrc = selImg.getAttribute('respi-path');
    $('#blurPath').val(imgSrc);
    var imgSrcSplit = imgSrc.split('/');
    var imgSrc_720 = imgSrc.replace('_respi', '_720');
    var imgSrc_720_blur = imgSrc_720.replace('gallery', 'gallery/blur');

    //document.querySelector("#blur-status").innerHTML = "Static blur image not found.";

    $('#blur-image-frame img').attr('src', imgSrc_720).imagesLoaded().always(function() {
        //console.log('blur image');
    }).done(function() {
        blur('#effect-preview-image', stat.effect[1]);
        fullScreen(imgSrc_720);
        blur('#effect-fullscreen', stat.effect[1]);
    });
};

function selectedIds() {
    var selected_ids = [];
    var items = document.querySelectorAll('#slider-sortable .gallery-item');
    for (var i = 0, len = items.length; i < len; i++) {
        selected_ids.push(items[i].getAttribute('data-id'));
    }
    return selected_ids;
};

function statSaveSlider(im) {
    var images = (im) ? im : selectedIds();

    if (!im && $('#slider-auto-btn').hasClass('btn-danger')) {
        images = 'auto';
    }

    stat.sliders[stat.workingSlider] = [
        images,
        $('#slider-interval-select').val(),
        $('#slider-number-select').val()
    ];
};
