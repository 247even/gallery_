/* Sliders */

var dis = true;

$('#slider-wrapper').on('click', function() {
    $(this).addClass('hidden');
});

$('#slider-interval-select').on('change', function() {
    stat.sliderInterval = $(this).val();
});

$('#slider-number-select').on('change', function() {
    stat.sliderNumber = $(this).val();
});

$('#slider-clear-btn').on('click', function() {
    reset();
});

$('#slider-fill-btn').on('click', function() {
    reset();
    for (var i = 0; i < stat.sliderNumber; i++) {
        $('#gallery-row').find('div.gallery-item').eq(i).trigger('click');
    }
});

$('#slider-auto-btn').on('click', function() {
    reset();

    if ($(this).attr('aria-pressed') === 'true') {
        $(this).html('auto <span class="glyphicon glyphicon-ban-circle" aria-hidden="true"></span>');
        return true;
    }

    $(this).html('auto <span class="glyphicon glyphicon-ok-circle" aria-hidden="true"></span>');

    var sliderNumber = $('#slider-number-select').val();
    for (var i = 0; i < sliderNumber; i++) {
        $('#gallery-section').find('div.gallery-item').eq(i).trigger('click');
    }
   //console.log(stat.selectedIds);
    stat.selectedIds = 'auto';
   //console.log(stat.selectedIds);
    buttonDisable(false);
});

$('#slider-save-btn').on('click', function() {
    //gJ.sliders[0] = selectedIds();
    gJ.sliders = stat.sliders;
    saveStatus(true);
});

$('.admin-header a[aria-controls="slider-panel"]').on('shown.bs.tab', function(e) {

    $('#slider-interval-select').val(stat.sliderInterval).prop('selected', true);
    $('#slider-number-select').val(stat.sliderNumber).prop('selected', true);
    $('#blur-slider').val(stat.effect[1]);
    $('#blur-input').val(stat.effect[1]);
    $('#gallery-row').find('div.selected-image').removeClass('selected-image');
    $('#slider-sortable').html('');
    buttonDisable(dis);
    autoIds();

    if (stat.sliders[stat.workingSlider] && stat.sliders[stat.workingSlider][0] === 'auto') {
        $('#slider-auto-btn').addClass('active').attr('aria-pressed', true);
    } else {
        $('#slider-auto-btn').removeClass('active').attr('aria-pressed', false);
    }

    if ($('#slider-sortable').is(':empty')) {
        prototype({
            'template': '#placeholder-item-prototype',
            'targets': '#slider-sortable'
        });
        prototype({
            'template': '#placeholder-item-prototype',
            'targets': '#slider-sortable'
        });

        proportion({
          selector : 'div#slider-sortable div.placeholder-item',
          proportion : [1,1],
          className : 'ssp',
          styleId : 'slider-sortable-prop'
        });
    }

    $('#slider-preview-btn').on('click', function() {
        $('#slider-1').attr('id', stat.workingSlider);
       //console.log(_.pick(stat.sliders, [stat.workingSlider]));
        //buildSliders(_.pick(stat.sliders, [stat.workingSlider]));
        buildSliders(pickFromObject(stat.sliders, [stat.workingSlider]))
        $('#slider-wrapper').removeClass('hidden');
        $('#' + stat.workingSlider).find('.item').respi();
        setTimeout(function() {
            //$('#'+stat.workingSlider).carousel();
        }, stat.sliders[stat.workingSlider][1]);
    });

    sortable('.sortable', {
        placeholderClass: 'col-xs-2 gallery-item sort-placeholder',
        forcePlaceholderSize: true,
        hoverClass: 'is-hovered'
    })

    sortable('.sortable')[0].addEventListener('sortupdate', function(e) {
        $('#slider-auto-btn[aria-pressed="true"]')
            .removeClass('active')
            .attr('aria-pressed','false')
            .html('auto <span class="glyphicon glyphicon-ban-circle" aria-hidden="true"></span>');
        selectedIds();
    });

    $('#gallery-row').find('div.gallery-item').off('click').on('click', function(e) {
        e.preventDefault();
        e.stopPropagation();

        $('#slider-auto-btn[aria-pressed="true"]')
            .removeClass('active')
            .attr('aria-pressed','false')
            .html('auto <span class="glyphicon glyphicon-ban-circle" aria-hidden="true"></span>');

        $(this).toggleClass('selected-image');

        if ($(this).hasClass('selected-image')) {

            var cl = 'gallery-item col-xs-2 selected-image sortable-item';

            prototype({
                'template': '#sortable-item-prototype',
                'selectors': [
                    'data-id',
                    'bg-image'
                ],
                'values': [
                    $(this).attr('data-id'),
                    $(this).find('div.thumb-div').attr('data-src')
                ],
                'targets': '#slider-sortable'
            });

            var el = document.getElementById('slider-sortable').querySelectorAll('div.gallery-item');
            $(el).removeClass('selected-image');

            $(el).off().on('click', function() {
                $(el).removeClass('selected-image');
                $(this).addClass('selected-image');
                loadBlur($(this).attr('data-id'));
            });

            // set same height for chrome
            if (el.length > 0) {
                proportion({
                  selector : 'div#slider-sortable div.gallery-item',
                  proportion : [1,1],
                  className : 'ssp',
                  styleId : 'slider-sortable-prop'
                });

                $(el).css('height', Math.round(el[0].offsetHeight));
            }

        } else {
            $('#slider-sortable').find('div.gallery-item[data-id="' + $(this).attr('data-id') + '"]').remove();
        }

        sortable('.sortable');
        $('#slider-sortable').find('div.placeholder-item').remove();

        selectedIds();
       //console.log(stat.sliders);
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
            proportion({
              selector : 'div#slider-sortable div.placeholder-item',
              proportion : [1,1],
              className : 'ssp',
              styleId : 'slider-sortable-prop'
            });
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
            proportion({
              selector : 'div#slider-sortable div.placeholder-item',
              proportion : [1,1],
              className : 'ssp',
              styleId : 'slider-sortable-prop'
            });
        }

        if (selLength >= 2) {
            dis = false;
        }

        buttonDisable(dis)

        if (!dis && gJ.sliders[stat.workingSlider] !== stat.sliders[stat.workingSlider]) {
            //$('#slider-save-btn').prop('disabled', false);
            document.getElementById('slider-save-btn').disabled = false;
            saveStatus(true);
            return false;
        }

        document.getElementById('slider-save-btn').disabled = true;
    });

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
        var bs = $('#blur-slider');
        if (bs.val() != this.value) {
            bs.val(this.value).change();
        }
        stat.effect = ['blur', this.value];
    });

    $('#blur-save-button').click(function(e) {
        gJ.effect = stat.effect;
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
            document.getElementById('slider-sortable').querySelector('.gallery-item')
                .className += ' selected-image';
            selImg = document.querySelector('#slider-sortable .selected-image');
        }
        var imgId = selImg.getAttribute('data-id');
    }

    $('#blurPath').val(imgId);
    var imgSrc_720 = 'gallery/' + gJ.images[imgId].folder + '_720/' + gJ.images[imgId].file;

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
    proportion({
      selector : 'div#slider-sortable div.placeholder-item',
      proportion : [1,1],
      className : 'ssp',
      styleId : 'slider-sortable-prop'
    });
    buttonDisable(true);
};

function selectedIds() {
    var selected_ids = [];
    var items = document.getElementById('slider-sortable').querySelectorAll('div.gallery-item');
    var len = items.length;
    for (var i = 0; i < len; i++) {
        selected_ids.push(items[i].getAttribute('data-id'));
    }
    stat.selectedIds = selected_ids;
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
            $('div#gallery-row').find('div[data-id="' + $(this).attr('data-id') + '"]')
                .addClass('selected-image');
        });
        return false;
    }

    if (gJ.sliders[0]) {
        var slider1 = gJ.sliders[0];
        var sliderLength = slider1.length;
        if (sliderLength > 1 || slider1 != 'auto') {
            for (var i = 0; i < sliderLength; i++) {
                $('*[data-id="' + slider1[i] + '"]').addClass('selected-image');
                document.getElementById('gallery-row').querySelector('div[data-id="' + gJ.sliders[0][i] + '"]').click();
            }
        }
    }
};
