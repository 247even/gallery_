function loader(s){
	var stat = '';
	if(s){
		stat = 'none';
	}
	if(!document.getElementsByClassName('loader')[0]){
		document.body.insertAdjacentHTML('afterBegin', '<div class="loader"><div class="loader-spinner loader03"></div></div>');		
	}
	document.getElementsByClassName('loader')[0].style.display = stat;
};

function convertTimestamp(timestamp) {
  var d = new Date(timestamp * 1000),	// Convert the passed timestamp to milliseconds
		yyyy = d.getFullYear(),
		mm = ('0' + (d.getMonth() + 1)).slice(-2),	// Months are zero based. Add leading 0.
		dd = ('0' + d.getDate()).slice(-2),			// Add leading 0.
		hh = d.getHours(),
		h = hh,
		min = ('0' + d.getMinutes()).slice(-2),		// Add leading 0.
		ampm = 'AM',
		time;
			
	if (hh > 12) {
		h = hh - 12;
		ampm = 'PM';
	} else if (hh === 12) {
		h = 12;
		ampm = 'PM';
	} else if (hh == 0) {
		h = 12;
	}
	
	// ie: 2013-02-18, 8:35 AM	
	time = yyyy + '-' + mm + '-' + dd + ', ' + h + ':' + min + ' ' + ampm;

	// ie: 2013-02-18, 20:35
	time2 = yyyy + '-' + mm + '-' + dd + ', ' + hh + ':' + min;
		
	return time2;
}

// clear html elements
function clearHtml(elements){
	for(var i=0, len=elements.length; i < len; i++){
		document.querySelector(elements[i]).innerHtml = "";
	}
};

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
		$(this).css('height', $(this).outerWidth() * b / a);
		return this;
	}
})(jQuery);

function proportion(el,a,b) {
		var a = !a ? 1 : a;
		var b = !b ? 1 : b;
		for (i = 0; i < el.length; i++) {
			el[i].style.height = el[i].offsetWidth * b / a;
		}	
};


(function($) {
	$.fn.center = function(vh) {
		this.css("position", "absolute")
			.css("top", ($(window).height() - this.height() ) / 2 + "px");
		//this.css("left", ( $(window).width() - this.width() ) / 2 + "px");
		return this;
	}
})(jQuery);
