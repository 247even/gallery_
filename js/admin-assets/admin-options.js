/* options */

//$('#optionsForm').validator();

$('.admin-header a[aria-controls="options-panel"]').on('shown.bs.tab', function(e) {

    $('#gallery-row').find('.gallery-item').removeClass('selected-image').off('click');

    $('#configReset').click(function() {
        //$('#optionsForm')[0].reset();
				$('#optionsForm').reset();
        buildGallery(gJ);
    });

    $('#thumbSizeSelect').val(
        stat.options.thumbSize
		).on('change', function() {

        removeClasses('div#gallery-row div.gallery-item', stat.options.thumbSizeSizes[stat.options.thumbSize]);

        stat.options = { 'thumbSize' : $(this).val() };
        var ntds = stat.options.thumbSizeSizes[stat.options.thumbSize].toString().replace(/,/g, ' ');
        //var ntds = thumbSizeSizes[value].toString();
        //ntds = ntds.replace(/,/g, ' ');
        $('div#gallery-row').find('div.gallery-item').addClass(ntds);
        proportion({
          selector : 'section#gallery-section div.gallery-item',
          proportion : stat.options.proportion,
          className : 'pgi',
          styleId : 'prop-gallery-item'
        });

        saveStatus(true);
    });

    $('#thumbProportionSelect').val(
				stat.options.proportion.toString()
		).on('change', function() {
        stat.options = {
            'proportion' : $(this).val().split(',').map( function (n) {
                  return parseInt(n);
                })
            };
        proportion({
          selector : 'section#gallery-section div.gallery-item',
          proportion : stat.options.proportion,
          className : 'pgi',
          styleId : 'prop-gallery-item'
        });
        saveStatus(true);
    });


		$('#thumbFitSelect').val(
      stat.options.thumbFit.toString()
		).on('change', function() {
        stat.options = { 'thumbFit' : $(this).val() };
        $('div#gallery-row').find('div.gallery-item .thumb-div').removeClass('cover-image contain-image').addClass(stat.options.thumbFit + '-image');
        saveStatus(true);
    });

		$('#thumbPaddingInput').val(
				stat.options.thumbPadding
  	).on('keydown', function() {
        // Allow: backspace, delete, tab, escape, enter
        if ($.inArray(e.keyCode, [46, 8, 9, 27, 13]) !== -1 ||
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
        var value = $(this).val();
        value = (!value || value < 1) ? 0 : value;
        stat.options = { 'thumbPadding' : value };
				createStyle({id: 'item-padding',style: 'div#gallery-row div.gallery-item {padding: '+ stat.options.thumbPadding + 'px}'});
        saveStatus(true);
    });

    $('#inputSizes').attr('placeholder', stat.options.sizes.toString()).on('keydown', function(e) {
        // Allow: backspace, delete, tab, escape, enter and ,
        if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 188]) !== -1 ||
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
        var value = $(this).val().split(',');
        value = _.sortBy(_.uniq(_.compact(_.map(value, _.parseInt))));
        stat.options = { 'sizes' : value };
        saveStatus(true);
    });

    $('#coverCheckbox').click(function(e) {
        e.stopImmediatePropagation();
        var element = (e.currentTarget.htmlFor !== undefined) ? e.currentTarget.htmlFor : e.currentTarget;
        var checked = element.checked ? false : true;
        element.checked = checked ? false : checked.toString();
        saveStatus(true);
    });

});
