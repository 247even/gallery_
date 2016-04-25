(function($) {
	$.fn.respi = function(arr) {
		var res;
		
		function nearest(el,arr){

			if(!arr){
				arr = $('body').attr("respi-sizes").split(',');
			}
			
			var width = el.width();
			var height = el.height();
			var frame = (height >= width) ? height : width;

			var min = arr[0];
			    
			$.each(arr, function(k, value) {
				var value = parseInt(value);
				if (value <= frame) {
					min = value;
					res = min;
				} else {
					res = (frame - min < value - frame) ? min : value;
					return false;
				}
			});
			return res;			
		}
		
		this.each(function() {
			_respi = $(this).find("[respi-path]").attr("respi-path").replace("_respi", "_"+nearest($(this), arr));
			$(this).find("[respi-path]").css('background-image', 'url(' + _respi + ')');
		})

		return res;
	};
})(jQuery);

//console.log($(".proportion").respi([256,320,480,720]));

