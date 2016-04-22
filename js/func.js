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
}

var waitForFinalEvent = (function() {
	var timers = {};
	return function(callback, ms, uniqueId) {
		if (!uniqueId) {
			uniqueId = "Don't call this twice without a uniqueId";
		}
		if (timers[uniqueId]) {
			clearTimeout(timers[uniqueId]);
		}
		timers[uniqueId] = setTimeout(callback, ms);
	};
})();

// jquery proportion
(function($) {
	$.fn.proportion = function(a,b) {
		var a = !a ? 1 : a;
		var b = !b ? 1 : b;
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

// background blur >> https://github.com/msurguy/background-blur
! function(t) {
	"use strict";
	function e(e) {
		return this.each(function() {
			var i = t(this),
			    n = i.data("plugin.backgroundBlur"),
			    o = t.extend({}, r.DEFAULTS, i.data(), "object" == typeof e && e);
			n || i.data("plugin.backgroundBlur", n = new r(this, o)), "fadeIn" === e ? n.fadeIn() : "fadeOut" === e ? n.fadeOut() : "string" == typeof e && n.generateBlurredImage(e)
		})
	}

	var i = function() {
		for (var t,
		    e = 3,
		    i = document.createElement("div"),
		    n = i.getElementsByTagName("i"); i.innerHTML = "<!--[if gt IE " + ++e + "]><i></i><![endif]-->", n[0]; );
		return e > 4 ? e : t
	}(),
	    n = function() {
		return "_" + Math.random().toString(36).substr(2, 9)
	},
	    o = {
		svgns : "http://www.w3.org/2000/svg",
		xlink : "http://www.w3.org/1999/xlink",
		createElement : function(t, e) {
			var i = document.createElementNS(o.svgns, t);
			return e && o.setAttr(i, e), i
		},
		setAttr : function(t, e) {
			for (var i in e)"href" === i ? t.setAttributeNS(o.xlink, i, e[i]) : t.setAttribute(i, e[i]);
			return t
		}
	},
	    r = function(e, i) {
		this.internalID = n(), this.$element = t(e), this.$width = this.$element.width(), this.$height = this.$element.height(), this.element =
		e, this.options = t.extend({}, r.DEFAULTS, i), this.$overlayEl = this.createOverlay(), this.$blurredImage = {}, this.useVelocity = this.detectVelocity(), this.attachListeners(), this.generateBlurredImage(this.options.imageURL)
	};
	r.VERSION = "0.0.1", r.DEFAULTS = {
		imageURL : "",
		blurAmount : 10,
		imageClass : "",
		overlayClass : "",
		duration : !1,
		opacity : 1
	}, r.prototype.detectVelocity = function() {
		return !!window.jQuery.Velocity
	}, r.prototype.attachListeners = function() {
		this.$element.on("ui.blur.loaded", t.proxy(this.fadeIn, this)), this.$element.on("ui.blur.unload", t.proxy(this.fadeOut, this))
	}, r.prototype.fadeIn = function() {
		this.options.duration && this.options.duration > 0 && (this.useVelocity ? this.$blurredImage.velocity({
			opacity : this.options.opacity
		}, {
			duration : this.options.duration
		}) : this.$blurredImage.animate({
			opacity : this.options.opacity
		}, {
			duration : this.options.duration
		}))
	}, r.prototype.fadeOut = function() {
		this.options.duration && this.options.duration > 0 ? this.useVelocity ? this.$blurredImage.velocity({
			opacity : 0
		}, {
			duration : this.options.duration
		}) : this.$blurredImage.animate({
			opacity : 0
		}, {
			duration : this.options.duration
		}) : this.$blurredImage.css({
			opacity : 0
		})
	}, r.prototype.generateBlurredImage = function(t) {
		var e = this.$blurredImage;
		this.internalID = n(), e.length > 0 && (this.options.duration && this.options.duration > 0 ? this.useVelocity ? e.first().velocity({
			opacity : 0
		}, {
			duration : this.options.duration,
			complete : function() {
				e.remove()
			}
		}) : e.first().animate({
			opacity : 0
		}, {
			duration : this.options.duration,
			complete : function() {
				e.remove()
			}
		}) : e.remove()), this.$blurredImage = i ? this.createIMG(t, this.$width, this.$height) : this.createSVG(t, this.$width, this.$height)
	}, r.prototype.createOverlay = function() {
		return this.options.overlayClass && "" !== this.options.overlayClass ? t("<div></div>").prependTo(this.$element).addClass(this.options.overlayClass) : !1
	}, r.prototype.createSVG = function(e, i, n) {
		var r = this,
		    s = o.createElement("svg", {
			xmlns : o.svgns,
			version : "1.1",
			width : i,
			height : n,
			id : "blurred" + this.internalID,
			"class" : this.options.imageClass,
			viewBox : "0 0 " + i + " " + n,
			preserveAspectRatio : "none"
		}),
		    a = "blur" + this.internalID,
		    u = o.createElement("filter", {
			id : a
		}),
		    l = o.createElement("feGaussianBlur", {
			"in" : "SourceGraphic",
			stdDeviation : this.options.blurAmount
		}),
		    h = o.createElement("image", {
			x : 0,
			y : 0,
			width : i,
			height : n,
			externalResourcesRequired : "true",
			href : e,
			style : "filter:url(#" + a + ")",
			preserveAspectRatio : "none"
		});
		h.addEventListener("load", function() {
			r.$element.trigger("ui.blur.loaded")
		}, !0), h.addEventListener("SVGLoad", function() {
			r.$element.trigger("ui.blur.loaded")
		}, !0), u.appendChild(l), s.appendChild(u), s.appendChild(h);
		var d = t(s);
		return r.options.duration && r.options.duration > 0 && (d.css({
			opacity : 0
		}), window.setTimeout(function() {
			"0" === d.css("opacity") && d.css({
				opacity : 1
			})
		}, this.options.duration + 100)), this.element.insertBefore(s, this.element.firstChild), d
	}, r.prototype.createIMG = function(t, e, i) {
		var n = this,
		    o = this.prependImage(t),
		    r = 2 * this.options.blurAmount > 100 ? 100 : 2 * this.options.blurAmount;
		return o.css({
			filter : "progid:DXImageTransform.Microsoft.Blur(pixelradius=" + r + ") ",
			top : 2.5 * -this.options.blurAmount,
			left : 2.5 * -this.options.blurAmount,
			width : e + 2.5 * this.options.blurAmount,
			height : i + 2.5 * this.options.blurAmount
		}).attr("id", "blurred" + this.internalID), o.load(function() {
			n.$element.trigger("ui.blur.loaded")
		}), this.options.duration && this.options.duration > 0 && window.setTimeout(function() {
			"0" === o.css("opacity") && o.css({
				opacity : 1
			})
		}, this.options.duration + 100), o
	}, r.prototype.prependImage = function(e) {
		var i,
		    n = t('<img src="' + e + '" />');
		return i = this.$overlayEl ? n.insertBefore(this.$overlayEl).attr("id", this.internalID).addClass(this.options.imageClass) : n.prependTo(this.$element).attr("id", this.internalID).addClass(this.options.imageClass)
	};
	var s = t.fn.backgroundBlur;
	t.fn.backgroundBlur = e, t.fn.backgroundBlur.Constructor =
	r, t.fn.backgroundBlur.noConflict = function() {
		return t.fn.backgroundBlur = s, this
	}
}(jQuery);
