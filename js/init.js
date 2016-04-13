function init() {
	
!function(factory){"function"==typeof define&&define.amd?define(["jquery"],factory):"object"==typeof exports?module.exports=factory(require("jquery")):factory(jQuery)}(function($){var dispatch=$.event.dispatch||$.event.handle,special=$.event.special,uid1="D"+ +new Date,uid2="D"+(+new Date+1);special.scrollstart={setup:function(data){var timer,_data=$.extend({latency:special.scrollstop.latency},data),handler=function(evt){var _self=this,_args=arguments;timer?clearTimeout(timer):(evt.type="scrollstart",dispatch.apply(_self,_args)),timer=setTimeout(function(){timer=null},_data.latency)};$(this).bind("scroll",handler).data(uid1,handler)},teardown:function(){$(this).unbind("scroll",$(this).data(uid1))}},special.scrollstop={latency:250,setup:function(data){var timer,_data=$.extend({latency:special.scrollstop.latency},data),handler=function(evt){var _self=this,_args=arguments;timer&&clearTimeout(timer),timer=setTimeout(function(){timer=null,evt.type="scrollstop",dispatch.apply(_self,_args)},_data.latency)};$(this).bind("scroll",handler).data(uid2,handler)},teardown:function(){$(this).unbind("scroll",$(this).data(uid2))}}});

	$.extend($.easing, {
		easeInOutCubic : function(x, t, b, c, d) {
			if ((t /= d / 2) < 1)
				return c / 2 * t * t * t + b;
			return c / 2 * ((t -= 2) * t * t + 2) + b;
		}
	});

	$.fn.outerFind = function(selector) {
		return this.find(selector).addBack(selector);
	};

	(function($, sr) {
		// smartresize
		jQuery.fn[sr] = function(fn) {
			return fn ? this.bind('resize', debounce(fn)) : this.trigger(sr);
		};

	})(jQuery, 'smartresize');

	(function() {

		var scrollbarWidth = 0, originalMargin, touchHandler = function(event) {
			event.preventDefault();
		};

		function getScrollbarWidth() {
			if (scrollbarWidth)
				return scrollbarWidth;
			var scrollDiv = document.createElement('div');
			$.each({
				top : '-9999px',
				width : '50px',
				height : '50px',
				overflow : 'scroll',
				position : 'absolute'
			}, function(property, value) {
				scrollDiv.style[property] = value;
			});
			$('body').append(scrollDiv);
			scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
			$('body')[0].removeChild(scrollDiv);
			return scrollbarWidth;
		}

	})();

	$.isMobile = function(type) {
		var reg = [];
		var any = {
			blackberry : 'BlackBerry',
			android : 'Android',
			windows : 'IEMobile',
			opera : 'Opera Mini',
			ios : 'iPhone|iPad|iPod'
		};
		type = 'undefined' == $.type(type) ? '*' : type.toLowerCase();
		if ('*' == type)
			reg = $.map(any, function(v) {
				return v;
			});
		else if ( type in any)
			reg.push(any[type]);
		return !!(reg.length && navigator.userAgent.match(new RegExp(reg.join('|'), 'i')));
	};

	var isSupportViewportUnits = ( function() {
			// modernizr implementation
			var $elem = $('<div style="height: 50vh; position: absolute; top: -1000px; left: -1000px;">').appendTo('body');
			var elem = $elem[0];
			var height = parseInt(window.innerHeight / 2, 10);
			var compStyle = parseInt((window.getComputedStyle ? getComputedStyle(elem, null) : elem.currentStyle)['height'], 10);
			$elem.remove();
			return compStyle == height;
		}());



		$('html').addClass($.isMobile() ? 'mobile' : 'desktop');

		// .navbar--sticky
		$(window).scroll(function() {
			$('.navbar--sticky').each(function() {
				var method = $(window).scrollTop() > 10 ? 'addClass' : 'removeClass';
				$(this)[method]('navbar--stuck')
				.not('.navbar--open')[method]('navbar--short');
			});
		});

		// .hamburger
		$(document).on('add.cards change.cards', function(event) {
			$(event.target).outerFind('.hamburger:not(.added)').each(function() {
				$(this).addClass('added').click(function() {
					$(this).toggleClass('hamburger--open').parents('.navbar').toggleClass('navbar--open').removeClass('navbar--short');
				}).parents('.navbar').find('a:not(.hamburger)').click(function() {
					$('.hamburger--open').click();
				});
			});
		});
		$(window).smartresize(function() {
			if ($(window).width() > 991)
				$('.navbar--auto-collapse .hamburger--open').click();
		}).keydown(function(event) {
			if (27 == event.which)// ESC
				$('.hamburger--open').click();
		});

		if ($.isMobile() && navigator.userAgent.match(/Chrome/i)) {// simple fix for Chrome's scrolling
			(function(width, height) {
				var deviceSize = [width, width];
				deviceSize[height > width ? 0 : 1] = height;
				$(window).smartresize(function() {
					var windowHeight = $(window).height();
					if ($.inArray(windowHeight, deviceSize) < 0)
						windowHeight = deviceSize[$(window).width() > windowHeight ? 1 : 0];
					$('.section--full-height').css('height', windowHeight + 'px');
				});
			})($(window).width(), $(window).height());
		} else if (!isSupportViewportUnits) {// fallback for .section--full-height
			$(window).smartresize(function() {
				$('.section--full-height').css('height', $(window).height() + 'px');
			});
			$(document).on('add.cards', function(event) {
				if ($('html').hasClass('site-loaded') && $(event.target).outerFind('.section--full-height').length)
					$(window).resize();
			});
		}

		// .section--16by9 (16 by 9 blocks autoheight)
		function calculate16by9() {
			$(this).css('height', $(this).parent().width() * 9 / 16);
		}


		$(window).smartresize(function() {
			$('.section--16by9').each(calculate16by9);
		});
		$(document).on('add.cards change.cards', function(event) {
			var enabled = $(event.target).outerFind('.section--16by9');
			if (enabled.length) {
				enabled.attr('data-16by9', 'true').each(calculate16by9);
			} else {
				$(event.target).outerFind('[data-16by9]').css('height', '').removeAttr('data-16by9');
			}
		});

		// .fixed-top
		var fixedTopTimeout, scrollTimeout, prevScrollTop = 0, fixedTop = null, isDesktop = !$.isMobile();
		$(window).scroll(function() {
			if (scrollTimeout)
				clearTimeout(scrollTimeout);
			var scrollTop = $(window).scrollTop();
			var scrollUp = scrollTop <= prevScrollTop || isDesktop;
			prevScrollTop = scrollTop;
			if (fixedTop) {
				var fixed = scrollTop > fixedTop.breakPoint;
				if (scrollUp) {
					if (fixed != fixedTop.fixed) {
						if (isDesktop) {
							fixedTop.fixed = fixed;
							$(fixedTop.elm).toggleClass('is-fixed');
						} else {
							scrollTimeout = setTimeout(function() {
								fixedTop.fixed = fixed;
								$(fixedTop.elm).toggleClass('is-fixed');
							}, 40);
						}
					}
				} else {
					fixedTop.fixed = false;
					$(fixedTop.elm).removeClass('is-fixed');
				}
			}
		});
		$(document).on('add.cards delete.cards', function(event) {
			if (fixedTopTimeout)
				clearTimeout(fixedTopTimeout);
			fixedTopTimeout = setTimeout(function() {
				if (fixedTop) {
					fixedTop.fixed = false;
					$(fixedTop.elm).removeClass('is-fixed');
				}
				$('.fixed-top:first').each(function() {
					fixedTop = {
						breakPoint : $(this).offset().top + $(this).height() * 3,
						fixed : false,
						elm : this
					};
					$(window).scroll();
				});
			}, 650);
		});

		// embedded videos
		$(window).smartresize(function() {
			$('.embedded-video').each(function() {
				$(this).height($(this).width() * parseInt($(this).attr('height') || 315) / parseInt($(this).attr('width') || 560));
			});
		});
		$(document).on('add.cards', function(event) {
			if ($('html').hasClass('site-loaded') && $(event.target).outerFind('iframe').length)
				$(window).resize();
		});

		$(document).on('add.cards', function(event) {
			$(event.target).outerFind('[data-bg-video]').each(function() {
				var result, videoURL = $(this).data('bg-video'), patterns = [/\?v=([^&]+)/, /(?:embed|\.be)\/([-a-z0-9_]+)/i, /^([-a-z0-9_]+)$/i];
				for (var i = 0; i < patterns.length; i++) {
					if ( result = patterns[i].exec(videoURL)) {
						var previewURL = 'http' + ('https:' == location.protocol ? 's' : '') + ':';
						previewURL += '//img.youtube.com/vi/' + result[1] + '/maxresdefault.jpg';

						var $img = $('<div class="background-video-preview">').hide().css({
							backgroundSize : 'cover',
							backgroundPosition : 'center'
						})
						$('.container:eq(0)', this).before($img);

						$('<img>').on('load', function() {
							if (120 == (this.naturalWidth || this.width)) {
								// selection of preview in the best quality
								var file = this.src.split('/').pop();
								switch (file) {
								case 'maxresdefault.jpg':
									this.src = this.src.replace(file, 'sddefault.jpg');
									break;
								case 'sddefault.jpg':
									this.src = this.src.replace(file, 'hqdefault.jpg');
									break;
								}
							} else {
								$img.css('background-image', 'url("' + this.src + '")').show();
							}
						}).attr('src', previewURL)

						if ($.fn.YTPlayer && !$.isMobile()) {
							var params = eval('(' + ($(this).data('bg-video-params') || '{}') + ')');
							$('.container:eq(0)', this).before('<div class="background-video"></div>').prev().YTPlayer($.extend({
								videoURL : result[1],
								containment : 'self',
								showControls : false,
								mute : true
							}, params));
						}
						break;
					}
				}
			});
		});

		// init
		$('body > *:not(style, script)').trigger('add.cards');
		$('html').addClass('site-loaded');
		$(window).resize().scroll();

		// smooth scroll
		if (!$('html').hasClass('is-builder')) {
			$(document).click(function(e) {
				try {
					var target = e.target;
					do {
						if (target.hash) {
							var useBody = /#bottom|#top/g.test(target.hash);
							$( useBody ? 'body' : target.hash).each(function() {
								e.preventDefault();
								// in css sticky navbar has height 64px
								var stickyMenuHeight = $('.navbar--sticky').length ? 64 : 0;
								var goTo = target.hash == '#bottom' ? ($(this).height() - $(window).height()) : ($(this).offset().top - stickyMenuHeight);
								$('html, body').stop().animate({
									scrollTop : goTo
								}, 800, 'easeInOutCubic');
							});
							break;
						}
					} while (target = target.parentNode);
				} catch (e) {
					// throw e;
				}
			});
		}
};