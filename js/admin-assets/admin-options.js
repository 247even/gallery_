/* options */

//$('#optionsForm').validator();

$('.admin-header a[aria-controls="options-panel"]').on('shown.bs.tab', function(e) {

	$('#configReset').click(function() {
		$('#optionsForm')[0].reset();
		buildGallery(gJ);
	});

	// pre-/re-set thumbSize
	var thumbSize = !gJ.thumbDisplay ? "md" : gJ.thumbDisplay;
	$("#thumbDisplaySelect").val(thumbSize);

	$("#thumbDisplaySelect").on("change", function() {
		var value = $(this).val();

		var proportion = gJ.thumbProportion;
		proportion = !proportion ? [1, 1] : proportion.split(',');

		/*
		 var tpgi = document.querySelector('.gallery-item');
		 addClasses(tpgi, thumbSize);
		 */

		var thumbSize = !gJ.thumbDisplay ? "md" : gJ.thumbDisplay;

		//str.split(",").join("")

		var tds = thumbDisplaySizes[thumbSize]
		removeClasses(".gallery-item", tds);

		gJ.thumbDisplay = value;

		ntds = thumbDisplaySizes[value].toString();
		ntds = ntds.replace(/,/g, " ");
		console.log(ntds);
		$('.gallery-item').addClass(ntds).proportion(proportion[0], proportion[1]);

		saveStatus(true);
	});

	// pre-/re-set Proportion
	var thumbProp = !gJ.proportion ? "1,1" : gJ.proportion;
	$("#thumProportionSelect").val(thumbProp);

	$("#thumbProportionSelect").on("change", function() {
		var value = $(this).val();
		gJ.thumbProportion = value;
		value = value.split(',');
		$(".gallery-item").proportion(value[0], value[1]);
		saveStatus(true);
	});

	// pre-/re-set thumbFit
	var thumbFit = !gJ.thumbFit ? "cover" : gJ.thumbFit;
	$("#thumbFitSelect").val(thumbFit);

	$("#thumbFitSelect").on("change", function() {
		var value = $(this).val();
		gJ.thumbFit = value;
		$(".gallery-item .thumb-div").removeClass('cover-image contain-image').addClass(value + '-image');
		saveStatus(true);
	});

	// pre-/re-set thumbFit
	var thumbPadding = !gJ.thumbPadding ? 0 : gJ.thumbPadding;
	$("#thumbPaddingInput").val(thumbPadding);

	$("#thumbPaddingInput").keydown(function() {
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

	$("#thumbPaddingInput").on("change input", function() {
		var value = $(this).val();
		value = (!value || value < 1) ? 0 : value;
		gJ.thumbPadding = value;
		$(".gallery-item").css("padding", value + "px");
		saveStatus(true);
	});

	$("#inputSizes").attr('placeholder', gJ.sizes).keydown(function(e) {
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

	$("#inputSizes").on("change input", function() {
		var value = $(this).val().split(',');
		value = _.sortBy(_.uniq(_.compact(_.map(value, _.parseInt))));
		gJ.sizes = value;
		saveStatus(true);
	});

	$("#coverCheckbox").click(function(e) {
		e.stopImmediatePropagation();
		var element = (e.currentTarget.htmlFor !== undefined) ? e.currentTarget.htmlFor : e.currentTarget;
		var checked = (element.checked) ? false : true;
		element.checked = (checked) ? false : checked.toString();
		saveStatus(true);
	});

}); 