(function($) {
	$.fn.respi = function(arr) {
		var res;

		function nearest(el, arr){
			var arr = arr || $('body').attr("respi-sizes");
			//var arr = !arr ? $('body').attr("respi-sizes") : arr;
			arr = typeof arr != 'array' ? arr.split(',') : arr;
			var w = el.width();
			var h = el.height();
			var frame = (h >= w) ? h : w;
			var min = arr[0];

			$.each(arr, function(k, value) {
				var value = parseInt(value);
				if (value <= frame) {
					min = res = value;
					//res = min;
				} else {
					res = (frame - min < value - frame) ? min : value;
					return false;
				}
			});
			return res;
		}

		this.each(function() {
			var _respi_el = !$(this).attr("respi-path") ? $(this).find("[respi-path]") : $(this);
			var _respi = _respi_el.attr("respi-path").replace("_respi", "_"+nearest($(this), arr));
			if (_respi_el.attr("data-src")){
				_respi_el.attr("data-src", _respi);
			} else {
				_respi_el.css('background-image', 'url(' + _respi + ')');
			}
		})

		return this;
	};
})(jQuery);

//console.log($(".proportion").respi([256,320,480,720]));
