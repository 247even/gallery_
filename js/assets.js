!function(){function e(){z.keyboardSupport&&m("keydown",a)}function t(){if(!A&&document.body){A=!0;var t=document.body,o=document.documentElement,n=window.innerHeight,r=t.scrollHeight;if(B=document.compatMode.indexOf("CSS")>=0?o:t,D=t,e(),top!=self)X=!0;else if(r>n&&(t.offsetHeight<=n||o.offsetHeight<=n)){var a=document.createElement("div");a.style.cssText="position:absolute; z-index:-10000; top:0; left:0; right:0; height:"+B.scrollHeight+"px",document.body.appendChild(a);var i;T=function(){i||(i=setTimeout(function(){L||(a.style.height="0",a.style.height=B.scrollHeight+"px",i=null)},500))},setTimeout(T,10),m("resize",T);var l={attributes:!0,childList:!0,characterData:!1};if(M=new V(T),M.observe(t,l),B.offsetHeight<=n){var c=document.createElement("div");c.style.clear="both",t.appendChild(c)}}z.fixedBackground||L||(t.style.backgroundAttachment="scroll",o.style.backgroundAttachment="scroll")}}function o(){M&&M.disconnect(),h(I,r),h("mousedown",i),h("keydown",a),h("resize",T),h("load",t)}function n(e,t,o){if(p(t,o),1!=z.accelerationMax){var n=Date.now(),r=n-R;if(r<z.accelerationDelta){var a=(1+50/r)/2;a>1&&(a=Math.min(a,z.accelerationMax),t*=a,o*=a)}R=Date.now()}if(q.push({x:t,y:o,lastX:0>t?.99:-.99,lastY:0>o?.99:-.99,start:Date.now()}),!P){var i=e===document.body,l=function(n){for(var r=Date.now(),a=0,c=0,u=0;u<q.length;u++){var d=q[u],s=r-d.start,f=s>=z.animationTime,m=f?1:s/z.animationTime;z.pulseAlgorithm&&(m=x(m));var h=d.x*m-d.lastX>>0,w=d.y*m-d.lastY>>0;a+=h,c+=w,d.lastX+=h,d.lastY+=w,f&&(q.splice(u,1),u--)}i?window.scrollBy(a,c):(a&&(e.scrollLeft+=a),c&&(e.scrollTop+=c)),t||o||(q=[]),q.length?_(l,e,1e3/z.frameRate+1):P=!1};_(l,e,0),P=!0}}function r(e){A||t();var o=e.target,r=u(o);if(!r||e.defaultPrevented||e.ctrlKey)return!0;if(w(D,"embed")||w(o,"embed")&&/\.pdf/i.test(o.src)||w(D,"object"))return!0;var a=-e.wheelDeltaX||e.deltaX||0,i=-e.wheelDeltaY||e.deltaY||0;return K&&(e.wheelDeltaX&&b(e.wheelDeltaX,120)&&(a=-120*(e.wheelDeltaX/Math.abs(e.wheelDeltaX))),e.wheelDeltaY&&b(e.wheelDeltaY,120)&&(i=-120*(e.wheelDeltaY/Math.abs(e.wheelDeltaY)))),a||i||(i=-e.wheelDelta||0),1===e.deltaMode&&(a*=40,i*=40),!z.touchpadSupport&&v(i)?!0:(Math.abs(a)>1.2&&(a*=z.stepSize/120),Math.abs(i)>1.2&&(i*=z.stepSize/120),n(r,a,i),e.preventDefault(),void l())}function a(e){var t=e.target,o=e.ctrlKey||e.altKey||e.metaKey||e.shiftKey&&e.keyCode!==N.spacebar;document.contains(D)||(D=document.activeElement);var r=/^(textarea|select|embed|object)$/i,a=/^(button|submit|radio|checkbox|file|color|image)$/i;if(r.test(t.nodeName)||w(t,"input")&&!a.test(t.type)||w(D,"video")||y(e)||t.isContentEditable||e.defaultPrevented||o)return!0;if((w(t,"button")||w(t,"input")&&a.test(t.type))&&e.keyCode===N.spacebar)return!0;var i,c=0,d=0,s=u(D),f=s.clientHeight;switch(s==document.body&&(f=window.innerHeight),e.keyCode){case N.up:d=-z.arrowScroll;break;case N.down:d=z.arrowScroll;break;case N.spacebar:i=e.shiftKey?1:-1,d=-i*f*.9;break;case N.pageup:d=.9*-f;break;case N.pagedown:d=.9*f;break;case N.home:d=-s.scrollTop;break;case N.end:var m=s.scrollHeight-s.scrollTop-f;d=m>0?m+10:0;break;case N.left:c=-z.arrowScroll;break;case N.right:c=z.arrowScroll;break;default:return!0}n(s,c,d),e.preventDefault(),l()}function i(e){D=e.target}function l(){clearTimeout(E),E=setInterval(function(){F={}},1e3)}function c(e,t){for(var o=e.length;o--;)F[j(e[o])]=t;return t}function u(e){var t=[],o=document.body,n=B.scrollHeight;do{var r=F[j(e)];if(r)return c(t,r);if(t.push(e),n===e.scrollHeight){var a=s(B)&&s(o),i=a||f(B);if(X&&d(B)||!X&&i)return c(t,$())}else if(d(e)&&f(e))return c(t,e)}while(e=e.parentElement)}function d(e){return e.clientHeight+10<e.scrollHeight}function s(e){var t=getComputedStyle(e,"").getPropertyValue("overflow-y");return"hidden"!==t}function f(e){var t=getComputedStyle(e,"").getPropertyValue("overflow-y");return"scroll"===t||"auto"===t}function m(e,t){window.addEventListener(e,t,!1)}function h(e,t){window.removeEventListener(e,t,!1)}function w(e,t){return(e.nodeName||"").toLowerCase()===t.toLowerCase()}function p(e,t){e=e>0?1:-1,t=t>0?1:-1,(Y.x!==e||Y.y!==t)&&(Y.x=e,Y.y=t,q=[],R=0)}function v(e){return e?(O.length||(O=[e,e,e]),e=Math.abs(e),O.push(e),O.shift(),clearTimeout(H),H=setTimeout(function(){window.localStorage&&(localStorage.SS_deltaBuffer=O.join(","))},1e3),!g(120)&&!g(100)):void 0}function b(e,t){return Math.floor(e/t)==e/t}function g(e){return b(O[0],e)&&b(O[1],e)&&b(O[2],e)}function y(e){var t=e.target,o=!1;if(-1!=document.URL.indexOf("www.youtube.com/watch"))do if(o=t.classList&&t.classList.contains("html5-video-controls"))break;while(t=t.parentNode);return o}function S(e){var t,o,n;return e*=z.pulseScale,1>e?t=e-(1-Math.exp(-e)):(o=Math.exp(-1),e-=1,n=1-Math.exp(-e),t=o+n*(1-o)),t*z.pulseNormalize}function x(e){return e>=1?1:0>=e?0:(1==z.pulseNormalize&&(z.pulseNormalize/=S(1)),S(e))}function k(e){for(var t in e)C.hasOwnProperty(t)&&(z[t]=e[t])}var D,M,T,E,H,C={frameRate:150,animationTime:400,stepSize:100,pulseAlgorithm:!0,pulseScale:4,pulseNormalize:1,accelerationDelta:50,accelerationMax:3,keyboardSupport:!0,arrowScroll:50,touchpadSupport:!1,fixedBackground:!0,excluded:""},z=C,L=!1,X=!1,Y={x:0,y:0},A=!1,B=document.documentElement,O=[],K=/^Mac/.test(navigator.platform),N={left:37,up:38,right:39,down:40,spacebar:32,pageup:33,pagedown:34,end:35,home:36},q=[],P=!1,R=Date.now(),j=function(){var e=0;return function(t){return t.uniqueID||(t.uniqueID=e++)}}(),F={};window.localStorage&&localStorage.SS_deltaBuffer&&(O=localStorage.SS_deltaBuffer.split(","));var I,_=function(){return window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||function(e,t,o){window.setTimeout(e,o||1e3/60)}}(),V=window.MutationObserver||window.WebKitMutationObserver||window.MozMutationObserver,$=function(){var e;return function(){if(!e){var t=document.createElement("div");t.style.cssText="height:10000px;width:1px;",document.body.appendChild(t);var o=document.body.scrollTop;document.documentElement.scrollTop;window.scrollBy(0,3),e=document.body.scrollTop!=o?document.body:document.documentElement,window.scrollBy(0,-3),document.body.removeChild(t)}return e}}(),U=window.navigator.userAgent,W=/Edge/.test(U),G=/chrome/i.test(U)&&!W,J=/safari/i.test(U)&&!W,Q=/mobile/i.test(U),Z=(G||J)&&!Q;"onwheel"in document.createElement("div")?I="wheel":"onmousewheel"in document.createElement("div")&&(I="mousewheel"),I&&Z&&(m(I,r),m("mousedown",i),m("load",t)),k.destroy=o,window.SmoothScrollOptions&&k(window.SmoothScrollOptions),"function"==typeof define&&define.amd?define(function(){return k}):"object"==typeof exports?module.exports=k:window.SmoothScroll=k}();var assets = true;
function createStyle(css) {

    if (document.querySelector('head style#' + css.id)) {
        document.head.removeChild(document.getElementById(css.id));
    }

    if (window.jQuery) {
        $(document.head).append('<style id="' + css.id + '" type="text/css">' + css.style + '</style>');
        return false;
    }

    var style = document.createElement('style');
    style.type = 'text/css';
    style.id = css.id;

    if (style.styleSheet) {
        style.styleSheet.cssText = css.style;
    } else {
        style.appendChild(document.createTextNode(css.style));
    }

    document.head.appendChild(style);
};

/*


createStyle({
    id: 'test',
    style: 'h1 { background: red; }'
});
*/
/**
* Detect Element Resize
*
* https://github.com/sdecima/javascript-detect-element-resize
* Sebastian Decima
*
* version: 0.5.3
**/

(function () {
	var attachEvent = document.attachEvent,
		stylesCreated = false;

	if (!attachEvent) {
		var requestFrame = (function(){
			var raf = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame ||
								function(fn){ return window.setTimeout(fn, 20); };
			return function(fn){ return raf(fn); };
		})();

		var cancelFrame = (function(){
			var cancel = window.cancelAnimationFrame || window.mozCancelAnimationFrame || window.webkitCancelAnimationFrame ||
								   window.clearTimeout;
		  return function(id){ return cancel(id); };
		})();

		function resetTriggers(element){
			var triggers = element.__resizeTriggers__,
				expand = triggers.firstElementChild,
				contract = triggers.lastElementChild,
				expandChild = expand.firstElementChild;
			contract.scrollLeft = contract.scrollWidth;
			contract.scrollTop = contract.scrollHeight;
			expandChild.style.width = expand.offsetWidth + 1 + 'px';
			expandChild.style.height = expand.offsetHeight + 1 + 'px';
			expand.scrollLeft = expand.scrollWidth;
			expand.scrollTop = expand.scrollHeight;
		};

		function checkTriggers(element){
			return element.offsetWidth != element.__resizeLast__.width ||
						 element.offsetHeight != element.__resizeLast__.height;
		}

		function scrollListener(e){
			var element = this;
			resetTriggers(this);
			if (this.__resizeRAF__) cancelFrame(this.__resizeRAF__);
			this.__resizeRAF__ = requestFrame(function(){
				if (checkTriggers(element)) {
					element.__resizeLast__.width = element.offsetWidth;
					element.__resizeLast__.height = element.offsetHeight;
					element.__resizeListeners__.forEach(function(fn){
						fn.call(element, e);
					});
				}
			});
		};

		/* Detect CSS Animations support to detect element display/re-attach */
		var animation = false,
			animationstring = 'animation',
			keyframeprefix = '',
			animationstartevent = 'animationstart',
			domPrefixes = 'Webkit Moz O ms'.split(' '),
			startEvents = 'webkitAnimationStart animationstart oAnimationStart MSAnimationStart'.split(' '),
			pfx  = '';
		{
			var elm = document.createElement('fakeelement');
			if( elm.style.animationName !== undefined ) { animation = true; }

			if( animation === false ) {
				for( var i = 0; i < domPrefixes.length; i++ ) {
					if( elm.style[ domPrefixes[i] + 'AnimationName' ] !== undefined ) {
						pfx = domPrefixes[ i ];
						animationstring = pfx + 'Animation';
						keyframeprefix = '-' + pfx.toLowerCase() + '-';
						animationstartevent = startEvents[ i ];
						animation = true;
						break;
					}
				}
			}
		}

		var animationName = 'resizeanim';
		var animationKeyframes = '@' + keyframeprefix + 'keyframes ' + animationName + ' { from { opacity: 0; } to { opacity: 0; } } ';
		var animationStyle = keyframeprefix + 'animation: 1ms ' + animationName + '; ';
	}

	function createStyles() {
		if (!stylesCreated) {
			//opacity:0 works around a chrome bug https://code.google.com/p/chromium/issues/detail?id=286360
			var css = (animationKeyframes ? animationKeyframes : '') +
					'.resize-triggers { ' + (animationStyle ? animationStyle : '') + 'visibility: hidden; opacity: 0; } ' +
					'.resize-triggers, .resize-triggers > div, .contract-trigger:before { content: \" \"; display: block; position: absolute; top: 0; left: 0; height: 100%; width: 100%; overflow: hidden; } .resize-triggers > div { background: #eee; overflow: auto; } .contract-trigger:before { width: 200%; height: 200%; }',
				head = document.head || document.getElementsByTagName('head')[0],
				style = document.createElement('style');

			style.type = 'text/css';
			if (style.styleSheet) {
				style.styleSheet.cssText = css;
			} else {
				style.appendChild(document.createTextNode(css));
			}

			head.appendChild(style);
			stylesCreated = true;
		}
	}

	window.addResizeListener = function(element, fn){
		if (attachEvent) element.attachEvent('onresize', fn);
		else {
			if (!element.__resizeTriggers__) {
				if (getComputedStyle(element).position == 'static') element.style.position = 'relative';
				createStyles();
				element.__resizeLast__ = {};
				element.__resizeListeners__ = [];
				(element.__resizeTriggers__ = document.createElement('div')).className = 'resize-triggers';
				element.__resizeTriggers__.innerHTML = '<div class="expand-trigger"><div></div></div>' +
																						'<div class="contract-trigger"></div>';
				element.appendChild(element.__resizeTriggers__);
				resetTriggers(element);
				element.addEventListener('scroll', scrollListener, true);

				/* Listen for a css animation to detect element display/re-attach */
				animationstartevent && element.__resizeTriggers__.addEventListener(animationstartevent, function(e) {
					if(e.animationName == animationName)
						resetTriggers(element);
				});
			}
			element.__resizeListeners__.push(fn);
		}
	};

	window.removeResizeListener = function(element, fn){
		if (attachEvent) element.detachEvent('onresize', fn);
		else {
			element.__resizeListeners__.splice(element.__resizeListeners__.indexOf(fn), 1);
			if (!element.__resizeListeners__.length) {
					element.removeEventListener('scroll', scrollListener);
					element.__resizeTriggers__ = !element.removeChild(element.__resizeTriggers__);
			}
		}
	}
})();
// func.js

function sortedIdsBy(prop, ord) {
    var property = prop || 'time';
    var order = ord || 'asc';
    var imagesByProp = _.orderBy(gJ.images, [property], [order]);
    //var imagesByProp = _.sortBy(gJ.images, [property]);
    var imagesByPropLength = imagesByProp.length;
    var idsByProp = imagesByProp.map(function(el) {
        for (var key in gJ.images) {
            if (gJ.images[key] === el) {
                return key;
                break;
            }
        }
    });
    return idsByProp;
};

Array.prototype.unique = function() {
    var u = [];
    var l = this.length;
    for (var i = 0; i < l; i++) {
        if (u.indexOf(this[i]) == -1) {
            u.push(this[i]);
        }
    }
    return u;
};

function blur(el, val) {
    var els = document.querySelector(el).style;
    els.filter = 'blur(' + val + 'px)';
    els.webkitFilter = 'blur(' + val + 'px)';
    els.mozFilter = 'blur(' + val + 'px)';
    els.oFilter = 'blur(' + val + 'px)';
    els.msFilter = 'blur(' + val + 'px)';
    els.filter = 'progid: DXImageTransform.Microsoft.Blur(PixelRadius=' + val + ')';
};

function removeClasses(el, classes) {
    var el = document.querySelectorAll(el);
    var elLength = el.length;
    for (var e = 0; e < elLength; e++) {
        var cLength = classes.length;
        for (var i = 0; i < cLength; i++) {
            if (el[e].classList) {
                el[e].classList.remove(classes[i]);
            } else {
                el[e].classes[i] = el[e].classes[i].replace(new RegExp('(^|\\b)' +
                    classes[i].split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
            }
        }
    }
};

function addClasses(el, classes) {
    var j = classes.length;
    for (var i = 0; i < j; i++) {
        el.classList ? el.classList.add(classes[i]) : el.className += ' ' + classes[i];
    };
};

function convertTimestamp(timestamp) {
    var d = new Date(timestamp * 1000), // Convert the passed timestamp to milliseconds
        yyyy = d.getFullYear(),
        mm = ('0' + (d.getMonth() + 1)).slice(-2), // Months are zero based. Add leading 0.
        dd = ('0' + d.getDate()).slice(-2), // Add leading 0.
        hh = d.getHours(),
        h = hh,
        min = ('0' + d.getMinutes()).slice(-2), // Add leading 0.
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
function clearHtml(el) {
    if (el) {
        var ell = el.length;
        for (var i = 0; i < ell; i++) {
            var qs = document.querySelectorAll(el[i]);
            var qsl = qs.length;
            if (qsl > 0) {
              for (var j=0; j < qsl; j++) {
                qs.innerHTML = "";
              }
            }
        }
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


(function($) {
    $.fn.center = function(vh) {
        this.css("position", "absolute")
            .css("top", ($(window).height() - this.height()) / 2 + "px");
        //this.css("left", ( $(window).width() - this.width() ) / 2 + "px");
        return this;
    }
})(jQuery);
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
*/// jquery proportion
(function($) {
    $.fn.proportion = function(a, b) {
        var a, b;
        if (a) {
          if (typeof a === 'array') {
              a = a[0];
              b = a[1]
          } else {
              a = a || 0;
              b = b || 0;
          }
        }
        $(this).css('height', $(this).outerWidth() * b / a);
        return this;
    }
})(jQuery);

var proportion_ = {};

function proportion(d) {
    // {element : xxx, proportion : [1,1], className : 'string', styleId : 'string', resize : true, inline : false}
    //    var el = typeof d.selector === 'string' ? document.querySelectorAll(d.selector) : d.selector;
    var el = document.querySelectorAll(d.selector);
    var ell = el.length;
    if (ell === 0) {
        console.log('ERROR: no elements');
        return false;
    }

    var prop = {
        'selector': d.selector,
        'proportion': d.proportion || [1, 1],
        'className': d.className || 'prop_' + prop.proportion.toString,
        'styleId': d.styleId || className,
        'inline' : typeof d.inline === true ? true : false,
        'resize': typeof d.resize === false ? false : true
    }

    for (i = 0; i < ell; i++) {

        if (!prop.inline && i === 0) {
            setHeight();
        }

        if (prop.inline) {
            el[i].style.height = height;
        }

        if (el[i].classList) {
            el[i].classList.add(prop.className);
        } else {
            el[i].className += ' ' + prop.className;
        }
    }

    function setHeight(wprop) {
        if (wprop) { prop = wprop };
        console.log(prop);
        var eli = el ? el[i] : document.querySelector(prop.selector);
        var width = eli.style.width || eli.offsetWidth;
        //console.log(width);
        console.log(prop.proportion);
        var height = width * (prop.proportion[1] / prop.proportion[0]) + 'px';

        if (createStyle && !prop.inline) {
            var classStyle = '.'+prop.className + ' { height: ' + height + '; }';
            var classNameElement = document.getElementById(prop.className);
            if (classNameElement) {
                var cel = classNameElement.innerHTML;
                if (cel == classStyle) {
                    console.log('style exists');
                    return false;
                }
                document.head.removeChild(classNameElement);
            }

            createStyle({
                id: prop.styleId,
                style: classStyle
            });
            return false;
        }

    };

    if (prop.resize) {
        proportion_[prop.styleId] = prop;
        console.log(proportion_);
        window.addEventListener('resize', debounce(
            function(e) {
              setHeight(proportion_[prop.styleId]);
            }, 120, false));
    }
};
function prototype(data) {

    // template element to search in for placeholders:
    var template;
    if (data.template) {
        template = document.querySelector(data.template);
    } else {
        template = document.querySelector('body');
    }

    var selectors;
    if (data.selectors) {
      selectors = data.selectors;
    };

    var values;
    if (data.values) {
      values = data.values;
    }

    var targets;
    if (data.targets) {
        targets = document.querySelectorAll(data.targets);
    }

    //for ( i = 0; i < templates.length; i++) {
    var ct = template.innerHTML;

    if (selectors) {
        var sLength = selectors.length;
        for (i = 0; i < sLength; i++) {
            var selector = '{{' + selectors[i] + '}}';
            ct = ct.replace(selector, values[i]);
            ct = ct.split(selector).join(values[i]);
        }
    }
    //}

    if (targets) {
        var tLength = targets.length;
        for (i = 0; i < tLength; i++) {
            targets[i].insertAdjacentHTML('beforeend', ct);
        }
    } else {
        template.innerHTML = ct;
    }

    if (data.cut) {
      console.log('template:');
        console.log(template);
        //template.innerHTML = '';
        template.parentNode.removeChild(template);
    }
};


// use like...
/*
prototype({
	'template' : '.file-row-prototype',
	'selectors' : ['src', 'name', 'type', 'size', 'lastMod'],
	'values' : [src, fName, fType, fSize, fLastMod],
	'targets' : '#file-table-body'
});
*/
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
