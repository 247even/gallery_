(function($) {
	$.fn.nearest = function(value) {
		var min, res;
		this.each(function(k,v){
			if (v <= value){
				min = v;
			} else {
				res = (value - min < v - value) ? min : v; 
				return false;
			}
		});
		return res;
	};
})(jQuery);

/*
var narray = [2,4,6,8,10,20,50];
console.log($(narray).nearest(13));
/*$(narray).nearest(15);
$(narray).nearest(19);
*/