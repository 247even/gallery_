(function($) {
	$.fn.imageCrop = function(vh) {
		this.css("height", this.width());
		//imgSize = {	width: $(this 'img').width(), height: $(this 'img').height() };
		console.log($('img').attr);
		return this;
	}
})(jQuery);

/*
(function($) {
	$.fn.center = function(vh) {
		this.css("position", "absolute");
		this.css("top", ($(window).height() - this.height() ) / 2 + "px");
		//this.css("left", ( $(window).width() - this.width() ) / 2 + "px");
		return this;
	}
})(jQuery);

function imageCrop(){
	$('.image-crop')
	width = this.width();
	height = this.height();
	
		this.css("position", "absolute");
		this.css("top", ($(window).height() - this.height() ) / 2 + "px");
		//this.css("left", ( $(window).width() - this.width() ) / 2 + "px");
}
*/

