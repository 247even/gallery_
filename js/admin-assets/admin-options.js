/* options */

//$('#optionsForm').validator();

function setOptions() {

    $('#gallery-row').find('.gallery-item').removeClass('selected-image').off('click');

    stat.options = options;

    $('#thumbSizeSelect').val(
        stat.options.thumbSize
    ).on('change', function() {

        removeClasses('div#gallery-row div.gallery-item', stat.options.thumbSizeSizes[stat.options.thumbSize]);
        stat.options = {
            'thumbSize': $(this).val()
        };
        var ntds = stat.options.thumbSizeSizes[stat.options.thumbSize].toString().replace(/,/g, ' ');
        $('div#gallery-row').find('div.gallery-item').addClass(ntds);
        proportion({
            selector: 'section#gallery-section div.gallery-item',
            proportion: stat.options.proportion,
            className: 'pgi',
            styleId: 'prop-gallery-item'
        });

        saveStatus(true);
    });

    $('#thumbProportionSelect').val(
        stat.options.proportion.toString()
    ).on('change', function() {
        stat.options = {
            'proportion': $(this).val().split(',').map(function(n) {
                return parseInt(n);
            })
        };
        proportion({
            selector: 'section#gallery-section div.gallery-item',
            proportion: stat.options.proportion,
            className: 'pgi',
            styleId: 'prop-gallery-item'
        });
        saveStatus(true);
    });


    $('#thumbFitSelect').val(
        stat.options.thumbFit.toString()
    ).on('change', function() {
        stat.options = {
            'thumbFit': $(this).val()
        };
        $('div#gallery-row').find('div.gallery-item .thumb-div').removeClass('cover-image contain-image').addClass(stat.options.thumbFit + '-image');
        saveStatus(true);
    });

    $('#thumbPaddingInput').val(
        stat.options.thumbPadding
    ).on('keydown', function() {
        // Allow: backspace, delete, tab, escape, enter
        if ([46, 8, 9, 27, 13].indexOf(e.keyCode) !== -1 ||
            // Allow: Ctrl+A
            (e.keyCode == 65 && e.ctrlKey === true) ||
            // Allow: Ctrl+C
            (e.keyCode == 67 && e.ctrlKey === true) ||
            // Allow: Ctrl+X
            (e.keyCode == 88 && e.ctrlKey === true) ||
            // Allow: home, end, left, right
            (e.keyCode >= 35 && e.keyCode <= 39)) {
            // let it happen, don't do anything
            return;
        }
        // Ensure that it is a number and stop the keypress
        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
            e.preventDefault();
        }
    }).on('change input', function() {
        var value = $(this).val() || 0;
        stat.options = {
            'thumbPadding': (!value || value < 1) ? 0 : value
        };
        createStyle({
            id: 'item-padding',
            style: 'div#gallery-row div.gallery-item {padding: ' + stat.options.thumbPadding + 'px}'
        });
        saveStatus(true);
    });

    $('#inputSizes').attr('placeholder', stat.options.sizes.toString()).on('keydown', function(e) {
        if ([46, 8, 9, 27, 13, 188].indexOf(e.keyCode) !== -1 ||
            // Allow: Ctrl+A
            (e.keyCode == 65 && e.ctrlKey === true) ||
            // Allow: Ctrl+C
            (e.keyCode == 67 && e.ctrlKey === true) ||
            // Allow: Ctrl+X
            (e.keyCode == 88 && e.ctrlKey === true) ||
            // Allow: home, end, left, right
            (e.keyCode >= 35 && e.keyCode <= 39)) {
            // don't do anything
            return;
        }
        // Ensure that it is a number and stop the keypress
        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
            e.preventDefault();
        }
    }).on('change input', function() {
        var value = $(this).val().split(',');
        stat.options = {
            'sizes': _.sortBy(_.uniq(_.compact(_.map(value, _.parseInt))))
        };
        saveStatus(true);
    });

};

$('.admin-header a[aria-controls="options-panel"]').on('shown.bs.tab', function(e) {

    setOptions();

    $('#configReset').click(function() {
        setOptions();
        buildGallery(gJ);
    });

});
