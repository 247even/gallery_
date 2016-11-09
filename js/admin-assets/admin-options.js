/* options */

//$('#optionsForm').validator();

$('.admin-header a[aria-controls="options-panel"]').on('shown.bs.tab', function(e) {

    $('#gallery-row').find('.gallery-item').removeClass('selected-image').off('click');

    $('#configReset').click(function() {
        //$('#optionsForm')[0].reset();
				$('#optionsForm').reset();
        buildGallery(gJ);
    });

    // pre-/re-set thumbSize
		/*
    var thumbSize = !gJ.options.thumbSize ? stat.options.thumbSize : gJ.options.thumbSize;
    $('#thumbSizeSelect').val(thumbSize);
		*/

    $('#thumbSizeSelect').val(
				!gJ.options || !gJ.options.thumbSize ? stat.options.thumbSize : gJ.options.thumbSize
		);

    $('#thumbSizeSelect').on('change', function() {
        var value = $(this).val();
        var proportion = !gJ.options.thumbProportion ? stat.options.thumbProportion.split(',') : gJ.options.thumbProportion.split(',');
        var thumbSize = !gJ.options.thumbSize ? stat.options.thumbSize : gJ.options.thumbSize;

        removeClasses('.gallery-item', thumbSizeSizes[thumbSize]);

        //gJ.options.thumbSize = value;
				stat.options.thumbSize = value;

        var ntds = thumbSizeSizes[value].toString();
        ntds = ntds.replace(/,/g, ' ');
        $('div#gallery-row').find('div.gallery-item').addClass(ntds).proportion(proportion[0], proportion[1]);

        saveStatus(true);
    });

    // pre-/re-set Proportion
		/*
    var thumbProp = !gJ.options.proportion ? stat.options.proportion : gJ.options.proportion;
    $('#thumProportionSelect').val(thumbProp);
*/
    $('#thumProportionSelect').val(
				!gJ.options || !gJ.options.proportion ? stat.options.proportion : gJ.options.proportion
		);

    $('#thumbProportionSelect').on('change', function() {
        var value = $(this).val();
        //gJ.options.thumbProportion = value;
				stat.options.thumbProportion = value;
        value = value.split(',');
        $('div#gallery-row').find('div.gallery-item').proportion(value[0], value[1]);
        saveStatus(true);
    });

    // pre-/re-set thumbFit
		/*
    var thumbFit = !gJ.options.thumbFit ? stat.options.thumbFit : gJ.options.thumbFit;
    $('#thumbFitSelect').val(thumbFit);
		*/

		$('#thumbFitSelect').val(
				!gJ.options || !gJ.options.thumbFit ? stat.options.thumbFit : gJ.options.thumbFit
		);

    $('#thumbFitSelect').on('change', function() {
        var value = $(this).val();
        //gJ.options.thumbFit = value;
				stat.options.thumbFit = value;
        $('div#gallery-row').find('div.gallery-item .thumb-div').removeClass('cover-image contain-image').addClass(value + '-image');
        saveStatus(true);
    });

    // pre-/re-set thumbFit
    /*var thumbPadding = !gJ.options.thumbPadding ? stat.options.thumbPadding : gJ.options.thumbPadding;
    $('#thumbPaddingInput').val(thumbPadding);
		*/

		$('#thumbPaddingInput').val(
				!gJ.options || !gJ.options.thumbPadding ? stat.options.thumbPadding : gJ.options.thumbPadding
  	);

    $('#thumbPaddingInput').keydown(function() {
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
    });

    $('#thumbPaddingInput').on('change input', function() {
        var value = $(this).val();
        value = (!value || value < 1) ? 0 : value;
        stat.options.thumbPadding = value;
				createStyle({id: 'item-padding',style: 'div#gallery-row div.gallery-item {padding: '+ value + 'px}'});
        saveStatus(true);
    });

    $('#inputSizes').attr('placeholder', gJ.sizes).keydown(function(e) {
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
    });

    $('#inputSizes').on('change input', function() {
        var value = $(this).val().split(',');
        stat.options.sizes = _.sortBy(_.uniq(_.compact(_.map(value, _.parseInt))));
        saveStatus(true);
    });

    $('#coverCheckbox').click(function(e) {
        e.stopImmediatePropagation();
        var element = (e.currentTarget.htmlFor !== undefined) ? e.currentTarget.htmlFor : e.currentTarget;
        var checked = (element.checked) ? false : true;
        element.checked = (checked) ? false : checked.toString();
        saveStatus(true);
    });

});
