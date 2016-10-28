var ddSelect = function(evt, cb) {

	$('.bs-dd-select li').on('click', function(e) {
		e.preventDefault();
		$(this).parent().find('li').removeClass('bs-dd-selected hidden');
		$(this).addClass('bs-dd-selected hidden');
	});

	$('.bs-dd-select').on('hidden.bs.dropdown', function(e) {
		var sel = $(this).find('.bs-dd-selected');
		if (sel.length > 0) {
			var val = sel.attr('data-value');
			var caret = ' <span class="caret"></span>';
			var txt = sel.find('a').html();
			$(this).find('button').html(txt + caret);
		}

		if (evt === 'onselect' && cb) {
			cb(val);
		}
	});
};

/*
ddSelect('onselect', function(val) {
	console.log(val);
});
*/
