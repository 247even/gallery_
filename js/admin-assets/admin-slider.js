/* Sliders */

var dis = true;

$('.admin-header a[aria-controls="slider-panel"]').on('shown.bs.tab', function(e) {

    buttonDisable(dis);

    if (stat.sliders[stat.workingSlider] && stat.sliders[stat.workingSlider][0] == 'auto') {
        $('button#slider-auto-btn').addClass('active').attr('aria-pressed', true);
    } else {
        $('button#slider-auto-btn').removeClass('active').attr('aria-pressed', false);
    }

    if (!$('#slider-sortable').find('div.sortable-item').length) {
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
            document.getElementById('blur-input').value = value;
            $('#blur-input').trigger('change');
        }
    });

    $('#blur-input').on('change', function() {
        var bsval = document.getElementById('blur-slider').value;
        if (bsval != this.value) {
            $('#blur-slider').val(this.value).change();
        }
        stat.effect = ['blur', this.value];
    });

    $('#blur-save-button').click(function(e) {
        gJ.effect = stat.effect;
    });

    $('div.gallery-row div.selected-image').removeClass('selected-image');
    //	$('.sortable').sortable('destroy');
    document.getElementById('slider-sortable').innerHtml = '';
    autoIds();

    $('#slider-clear-btn').on('click', function(e) {
        e.preventDefault();
        reset();
    });

    $('#slider-fill-btn').on('click', function(e) {
        e.preventDefault();
        reset();
//        var sliderNumber = $('#slider-number-select').val();
        //for (var i = 0; i < sliderNumber; i++) {
        for (var i = 0; i < stat.sliderNumber; i++) {
            $('#gallery-row').find('div.gallery-item').eq(i).trigger('click');
        }
    });

    $('button#slider-auto-btn').on('click', function(e) {
        //e.preventDefault();
        reset();

        if ($(this).attr('aria-pressed') === 'true') {
            $(this).html('auto <span class="glyphicon glyphicon-ban-circle" aria-hidden="true"></span>');
            return true;
        }

        $(this).html('auto <span class="glyphicon glyphicon-ok-circle" aria-hidden="true"></span>');

        var sliderNumber = $('select#slider-number-select').val();
        for (var i = 0; i < sliderNumber; i++) {
            $('section#gallery-section').find('div.gallery-item').eq(i).trigger('click');
        }

        stat.selectedIds = 'auto';
        //statSaveSlider('auto');
        buttonDisable(false);
    });

    $('button#slider-save-btn').on('click', function(e) {
        e.preventDefault();
        //gJ.sliders[0] = selectedIds();
        gJ.sliders[0] = stat.selectedIds;
        saveStatus(true);
    });

    $('button#slider-preview-btn').on('click', function(e) {
        e.preventDefault();
        $('#slider-1').attr('id', stat.workingSlider);
        buildSliders(_.pick(stat.sliders, [stat.workingSlider]));
        $('#slider-wrapper').removeClass('hidden');
        $('#' + stat.workingSlider).find('.item').respi();
        setTimeout(function() {
            //$('#'+stat.workingSlider).carousel();
        }, stat.sliders[stat.workingSlider][1]);
    });

    $('div#slider-wrapper').on('click', function() {
        $(this).addClass('hidden');
    });

    sortable('.sortable', {
        placeholderClass: 'col-xs-2 gallery-item sort-placeholder',
        forcePlaceholderSize: true,
        hoverClass: 'is-hovered'
    })

    sortable('.sortable')[0].addEventListener('sortupdate', function(e) {
        selectedIds();
        //statSaveSlider();
        //saveStatus(true);
    });

    $('#slider-interval-select').on('change', function() {
        stat.sliderInterval = $(this).val();
        //statSaveSlider();
    });

    $('#slider-number-select').on('change', function() {
        stat.sliderNumber = $(this).val();
        //statSaveSlider();
    });

    $('div#gallery-row').find('div.gallery-item').off('click').on('click', function(e) {

        e.preventDefault();
        e.stopPropagation();

        $(this).toggleClass('selected-image');

        if ($(this).hasClass('selected-image')) {

            var cl = 'thumbSize gallery-item col-xs-2 selected-image sortable-item';
            var id = $(this).attr('data-id');
            var src = $(this).find('div.thumb-div').attr('data-src');

            prototype({
      				'template' : '#sortable-item-prototype',
      				'selectors' : ['data-id', 'bg-image'],
      				'values' : [id, src],
      				'targets' : '#slider-sortable'
      			});

            var el = document.getElementById('slider-sortable').querySelectorAll('div.gallery-item');
            $(el).removeClass('selected-image');

            $(el).off().on('click', function(){
                $(el).removeClass('selected-image');
                $(this).addClass('selected-image');
                loadBlur($(this).attr('data-id'));
            });

            // set same height for chrome
            if (el.length > 0) {
                proportion(el, 1, 1);
                $(el).css('height', Math.round(el[0].offsetHeight));
            }

        } else {
            var data_id = $(this).attr('data-id');
            $('div#slider-sortable').find('div.gallery-item[data-id="' + data_id + '"]').remove();
        }

        sortable('.sortable');

        $('#slider-sortable').find('div.placeholder-item').remove();

        selectedIds();
        var selLength = stat.selectedIds.length;

        if (selLength === 0) {
            dis = true;
            prototype({
                'template': '#placeholder-item-prototype',
                'targets': '#slider-sortable'
            });
            prototype({
                'template': '#placeholder-item-prototype',
                'targets': '#slider-sortable'
            });
            proportion('#slider-sortable .placeholder-item', 1, 1);
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
        }

        if (selLength >= 2) {
            //statSaveSlider();
            dis = false;
        }

        buttonDisable(dis)
        //$('#slider-save-btn').prop('disabled', true);
        document.getElementById('slider-save-btn').disabled = true;

        if (!dis && gJ.sliders[stat.workingSlider] !== stat.sliders[stat.workingSlider]) {
            //$('#slider-save-btn').prop('disabled', false);
            document.getElementById('slider-save-btn').disabled = false;
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

function loadBlur(imgId) {

    if (!imgId) {
        var selImg = document.querySelector('#slider-sortable .selected-image');
        if (!selImg) {
            var selItem = document.querySelector('#slider-sortable .gallery-item');
            selItem.className += ' selected-image';
            selImg = document.querySelector('#slider-sortable .selected-image');
        }
        var imgId = selImg.getAttribute('data-id');
    }

    $('#blurPath').val(imgId);
    var imgSrc_720 = 'gallery/'+ gJ.images[imgId].path +'_720/'+ gJ.images[imgId].file;

    $('#blur-image-frame').find('img').attr('src', imgSrc_720).imagesLoaded().always(function() {
        //console.log('blur image');
    }).done(function() {
        blur('#effect-preview-image', stat.effect[1]);
        fullScreen(imgSrc_720);
        blur('#effect-fullscreen', stat.effect[1]);
    });
};

function reset() {
    document.getElementById('slider-sortable').innerHTML = '';
    removeClasses('div.gallery-item.selected-image', ['selected-image']);

    prototype({
        'template': '#placeholder-item-prototype',
        'targets': '#slider-sortable'
    });
    prototype({
        'template': '#placeholder-item-prototype',
        'targets': '#slider-sortable'
    });

    proportion('#slider-sortable .placeholder-item', 1, 1);
    buttonDisable(true);
};

function selectedIds() {
    var selected_ids = [];
//    var items = document.querySelectorAll('#slider-sortable .gallery-item');
    var items = document.getElementById('slider-sortable').querySelectorAll('.gallery-item');

    for (var i = 0, len = items.length; i < len; i++) {
        selected_ids.push(items[i].getAttribute('data-id'));
    }
    stat.selectedIds = selected_ids;
    console.log(stat.selectedIds);
    return selected_ids;
};

function buttonDisable(st) {
    document.getElementById('slider-save-btn').disabled = st;
    document.getElementById('slider-clear-btn').disabled = st;
    document.getElementById('slider-preview-btn').disabled = st;
};

function autoIds(q) {

    if (!$('#slider-sortable').is(':empty')) {
        $('#slider-sortable').find('div.gallery-item').each(function() {
            var did = $(this).attr('data-id');
            $('div.gallery-row [data-id="' + did + '"]').addClass('selected-image');
        });
        return false;
    }

    var slider1 = gJ.sliders[0];
    var sliderLength = slider1.length;
    if (sliderLength > 1 || slider1 != 'auto') {
        for (var i = 0; i < sliderLength; i++) {
            $('*[data-id="' + slider1[i] + '"]').addClass('selected-image');
            document.getElementById('gallery-row').querySelector('div[data-id="' + gJ.sliders[0][i] + '"]').click();
        }
    }

    return false;

    var a = sliderNumber;
    if (q) {
        a = q;
    }
    var ids = [];
    $('div.gallery div.gallery-item').each(function(k, v) {
        if (k < a) {
            ids.push($(this).attr('data-id'));
        }
    });
};
