var ddSelect = function(evt,cb){
	
	var val;

	
	$('.bs-dd-select li').on('click', function(){
		$(this).parent().find('li').removeClass('bs-dd-selected hidden');
		$(this).addClass('bs-dd-selected hidden');
	});
	
	$('.bs-dd-select').on('hidden.bs.dropdown', function(e) {
		var sel = $(this).find('.bs-dd-selected');
		val = sel.attr('data-value');
		var caret = ' <span class="caret"></span>';
		var txt = sel.find('a').html();
		$(this).find('button').html(txt+caret);
		if(cb){
			//cb(val);
		}
		if(evt == 'onselect' && cb){
			cb(val);
		}
	});	
};

$(function() {
	//ddSelect();
});

