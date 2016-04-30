// clear html elements
function clearHtml(elements){
	for(var i=0, len=elements.length; i < len; i++){
		document.querySelector(elements[i]).innerHtml = "";
	}
}

// debounce function, for executing funcs when event stops
var debounce = function(func, threshold, execAsap) {
	var timeout;

	return function debounced() {
		var obj = this,
		    args =
		    arguments;
		function delayed() {
			if (!execAsap)
				func.apply(obj, args);
			timeout = null;
		};

		if (timeout)
			clearTimeout(timeout);
		else if (execAsap)
			func.apply(obj, args);

		timeout = setTimeout(delayed, threshold || 100);
	};
};

// jquery proportion
(function($) {
	$.fn.proportion = function(a,b) {
		var a = !a ? 1 : a;
		var b = !b ? 1 : b;
		//console.log("a: "+a+" b: "+b);
		$(this).css('height', $(this).outerWidth() * b / a);
		return this;
	}
})(jQuery);

(function($) {
	$.fn.center = function(vh) {
		this.css("position", "absolute")
			.css("top", ($(window).height() - this.height() ) / 2 + "px");
		//this.css("left", ( $(window).width() - this.width() ) / 2 + "px");
		return this;
	}
})(jQuery);
