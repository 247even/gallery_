!function(){function e(){z.keyboardSupport&&m("keydown",a)}function t(){if(!A&&document.body){A=!0;var t=document.body,o=document.documentElement,n=window.innerHeight,r=t.scrollHeight;if(B=document.compatMode.indexOf("CSS")>=0?o:t,D=t,e(),top!=self)X=!0;else if(r>n&&(t.offsetHeight<=n||o.offsetHeight<=n)){var a=document.createElement("div");a.style.cssText="position:absolute; z-index:-10000; top:0; left:0; right:0; height:"+B.scrollHeight+"px",document.body.appendChild(a);var i;T=function(){i||(i=setTimeout(function(){L||(a.style.height="0",a.style.height=B.scrollHeight+"px",i=null)},500))},setTimeout(T,10),m("resize",T);var l={attributes:!0,childList:!0,characterData:!1};if(M=new V(T),M.observe(t,l),B.offsetHeight<=n){var c=document.createElement("div");c.style.clear="both",t.appendChild(c)}}z.fixedBackground||L||(t.style.backgroundAttachment="scroll",o.style.backgroundAttachment="scroll")}}function o(){M&&M.disconnect(),h(I,r),h("mousedown",i),h("keydown",a),h("resize",T),h("load",t)}function n(e,t,o){if(p(t,o),1!=z.accelerationMax){var n=Date.now(),r=n-R;if(r<z.accelerationDelta){var a=(1+50/r)/2;a>1&&(a=Math.min(a,z.accelerationMax),t*=a,o*=a)}R=Date.now()}if(q.push({x:t,y:o,lastX:0>t?.99:-.99,lastY:0>o?.99:-.99,start:Date.now()}),!P){var i=e===document.body,l=function(n){for(var r=Date.now(),a=0,c=0,u=0;u<q.length;u++){var d=q[u],s=r-d.start,f=s>=z.animationTime,m=f?1:s/z.animationTime;z.pulseAlgorithm&&(m=x(m));var h=d.x*m-d.lastX>>0,w=d.y*m-d.lastY>>0;a+=h,c+=w,d.lastX+=h,d.lastY+=w,f&&(q.splice(u,1),u--)}i?window.scrollBy(a,c):(a&&(e.scrollLeft+=a),c&&(e.scrollTop+=c)),t||o||(q=[]),q.length?_(l,e,1e3/z.frameRate+1):P=!1};_(l,e,0),P=!0}}function r(e){A||t();var o=e.target,r=u(o);if(!r||e.defaultPrevented||e.ctrlKey)return!0;if(w(D,"embed")||w(o,"embed")&&/\.pdf/i.test(o.src)||w(D,"object"))return!0;var a=-e.wheelDeltaX||e.deltaX||0,i=-e.wheelDeltaY||e.deltaY||0;return K&&(e.wheelDeltaX&&b(e.wheelDeltaX,120)&&(a=-120*(e.wheelDeltaX/Math.abs(e.wheelDeltaX))),e.wheelDeltaY&&b(e.wheelDeltaY,120)&&(i=-120*(e.wheelDeltaY/Math.abs(e.wheelDeltaY)))),a||i||(i=-e.wheelDelta||0),1===e.deltaMode&&(a*=40,i*=40),!z.touchpadSupport&&v(i)?!0:(Math.abs(a)>1.2&&(a*=z.stepSize/120),Math.abs(i)>1.2&&(i*=z.stepSize/120),n(r,a,i),e.preventDefault(),void l())}function a(e){var t=e.target,o=e.ctrlKey||e.altKey||e.metaKey||e.shiftKey&&e.keyCode!==N.spacebar;document.contains(D)||(D=document.activeElement);var r=/^(textarea|select|embed|object)$/i,a=/^(button|submit|radio|checkbox|file|color|image)$/i;if(r.test(t.nodeName)||w(t,"input")&&!a.test(t.type)||w(D,"video")||y(e)||t.isContentEditable||e.defaultPrevented||o)return!0;if((w(t,"button")||w(t,"input")&&a.test(t.type))&&e.keyCode===N.spacebar)return!0;var i,c=0,d=0,s=u(D),f=s.clientHeight;switch(s==document.body&&(f=window.innerHeight),e.keyCode){case N.up:d=-z.arrowScroll;break;case N.down:d=z.arrowScroll;break;case N.spacebar:i=e.shiftKey?1:-1,d=-i*f*.9;break;case N.pageup:d=.9*-f;break;case N.pagedown:d=.9*f;break;case N.home:d=-s.scrollTop;break;case N.end:var m=s.scrollHeight-s.scrollTop-f;d=m>0?m+10:0;break;case N.left:c=-z.arrowScroll;break;case N.right:c=z.arrowScroll;break;default:return!0}n(s,c,d),e.preventDefault(),l()}function i(e){D=e.target}function l(){clearTimeout(E),E=setInterval(function(){F={}},1e3)}function c(e,t){for(var o=e.length;o--;)F[j(e[o])]=t;return t}function u(e){var t=[],o=document.body,n=B.scrollHeight;do{var r=F[j(e)];if(r)return c(t,r);if(t.push(e),n===e.scrollHeight){var a=s(B)&&s(o),i=a||f(B);if(X&&d(B)||!X&&i)return c(t,$())}else if(d(e)&&f(e))return c(t,e)}while(e=e.parentElement)}function d(e){return e.clientHeight+10<e.scrollHeight}function s(e){var t=getComputedStyle(e,"").getPropertyValue("overflow-y");return"hidden"!==t}function f(e){var t=getComputedStyle(e,"").getPropertyValue("overflow-y");return"scroll"===t||"auto"===t}function m(e,t){window.addEventListener(e,t,!1)}function h(e,t){window.removeEventListener(e,t,!1)}function w(e,t){return(e.nodeName||"").toLowerCase()===t.toLowerCase()}function p(e,t){e=e>0?1:-1,t=t>0?1:-1,(Y.x!==e||Y.y!==t)&&(Y.x=e,Y.y=t,q=[],R=0)}function v(e){return e?(O.length||(O=[e,e,e]),e=Math.abs(e),O.push(e),O.shift(),clearTimeout(H),H=setTimeout(function(){window.localStorage&&(localStorage.SS_deltaBuffer=O.join(","))},1e3),!g(120)&&!g(100)):void 0}function b(e,t){return Math.floor(e/t)==e/t}function g(e){return b(O[0],e)&&b(O[1],e)&&b(O[2],e)}function y(e){var t=e.target,o=!1;if(-1!=document.URL.indexOf("www.youtube.com/watch"))do if(o=t.classList&&t.classList.contains("html5-video-controls"))break;while(t=t.parentNode);return o}function S(e){var t,o,n;return e*=z.pulseScale,1>e?t=e-(1-Math.exp(-e)):(o=Math.exp(-1),e-=1,n=1-Math.exp(-e),t=o+n*(1-o)),t*z.pulseNormalize}function x(e){return e>=1?1:0>=e?0:(1==z.pulseNormalize&&(z.pulseNormalize/=S(1)),S(e))}function k(e){for(var t in e)C.hasOwnProperty(t)&&(z[t]=e[t])}var D,M,T,E,H,C={frameRate:150,animationTime:400,stepSize:100,pulseAlgorithm:!0,pulseScale:4,pulseNormalize:1,accelerationDelta:50,accelerationMax:3,keyboardSupport:!0,arrowScroll:50,touchpadSupport:!1,fixedBackground:!0,excluded:""},z=C,L=!1,X=!1,Y={x:0,y:0},A=!1,B=document.documentElement,O=[],K=/^Mac/.test(navigator.platform),N={left:37,up:38,right:39,down:40,spacebar:32,pageup:33,pagedown:34,end:35,home:36},q=[],P=!1,R=Date.now(),j=function(){var e=0;return function(t){return t.uniqueID||(t.uniqueID=e++)}}(),F={};window.localStorage&&localStorage.SS_deltaBuffer&&(O=localStorage.SS_deltaBuffer.split(","));var I,_=function(){return window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||function(e,t,o){window.setTimeout(e,o||1e3/60)}}(),V=window.MutationObserver||window.WebKitMutationObserver||window.MozMutationObserver,$=function(){var e;return function(){if(!e){var t=document.createElement("div");t.style.cssText="height:10000px;width:1px;",document.body.appendChild(t);var o=document.body.scrollTop;document.documentElement.scrollTop;window.scrollBy(0,3),e=document.body.scrollTop!=o?document.body:document.documentElement,window.scrollBy(0,-3),document.body.removeChild(t)}return e}}(),U=window.navigator.userAgent,W=/Edge/.test(U),G=/chrome/i.test(U)&&!W,J=/safari/i.test(U)&&!W,Q=/mobile/i.test(U),Z=(G||J)&&!Q;"onwheel"in document.createElement("div")?I="wheel":"onmousewheel"in document.createElement("div")&&(I="mousewheel"),I&&Z&&(m(I,r),m("mousedown",i),m("load",t)),k.destroy=o,window.SmoothScrollOptions&&k(window.SmoothScrollOptions),"function"==typeof define&&define.amd?define(function(){return k}):"object"==typeof exports?module.exports=k:window.SmoothScroll=k}();var assets = true;
// func.js

function blur(el,val){
	var els = document.querySelector(el).style;
	els.filter = 'blur('+val+'px)';
	els.webkitFilter = 'blur('+val+'px)';
	els.mozFilter = 'blur('+val+'px)';
	els.oFilter = 'blur('+val+'px)';
	els.msFilter = 'blur('+val+'px)';
	els.filter = 'progid: DXImageTransform.Microsoft.Blur(PixelRadius='+val+')';
};

function removeClasses(el, classes){
	var el = document.querySelectorAll(el);
	for(var e=0; e<el.length; e++){
		for(var i=0; i<classes.length; i++){
			if (el[e].classList){
		  		el[e].classList.remove(classes[i]);
			} else {
		  		el[e].classes[i] = el[e].classes[i].replace(new RegExp('(^|\\b)'
		  		+ classes[i].split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
		  	}
		 }
	}
};

function addClasses(el, classes){
	for(var i=0,j=classes.length; i<j; i++){
		el.classList ? el.classList.add(classes[i]) : el.className += ' '+classes[i];
	};
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
function clearHtml(el){
	for(var i=0; i < el.length; i++){
		document.querySelector(el[i]).innerHTML = "";
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
		var a = !a ? 0 : a;
		var b = !b ? 0 : b;
		$(this).css('height', $(this).outerWidth() * b / a);
		return this;
	}
})(jQuery);

function proportion(el,a,b) {
		var a = !a ? 0 : a;
		var b = !b ? 0 : b;
		for (i = 0; i < el.length; i++) {
			el[i].style.height = el[i].offsetWidth * b / a+'px';
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
*/function prototype(data) {

	// template element to search in for placeholders:
	var template;
	if (data.template) {
		template = document.querySelector(data.template);
	} else {
		template = document.querySelector('body');
	}

	var selectors = data.selectors;
	var values = data.values;

	var targets;
	if (data.targets) {
		targets = document.querySelectorAll(data.targets);
	}

	//for ( i = 0; i < templates.length; i++) {
	var ct = template.innerHTML;

	for ( i = 0; i < selectors.length; i++) {
		var selector = '{{' + selectors[i] + '}}';
		ct = ct.replace(selector, values[i]);
		ct = ct.split(selector).join(values[i]);
	}

	//}

	if (targets) {
		for ( i = 0; i < targets.length; i++) {
			targets[i].insertAdjacentHTML('beforeend', ct);
		}
	} else {
		template.innerHTML = ct;
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
		
		function nearest(el,arr){
			
			var arr = !arr ? $('body').attr("respi-sizes").split(',') : arr;
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

var _upldr = function() {

    this.options = {
        'target': "gallery/fileUpload.php",
        'typeMatch': 'image.*',
        'slug': true,
        'cbReaderOnload': function() {
            //console.log("cbReaderOnload");
        },
        'cbReset': function() {
            document.getElementById('file-table-body').innerHTML = "";
        }
    };
    var options = this.options;

    this.set = function(data) {
        if (data) {
            for (var key in data) {
                options[key] = data[key];
            }
        }
    }

    var files = [];
    var request;
    var form = document.getElementById('upldr-form');
    var inputFile = document.getElementById('upldr-input-file');
    var progressBar = document.getElementById('upldr-progress-bar');
    var submitBtn = document.getElementById('upldr-submit-btn');
    var resetBtn = document.getElementById('upldr-reset-btn');
    var abortBtn = document.getElementById('upldr-abort-btn');
    submitBtn.disabled = true;
    resetBtn.disabled = true;
    abortBtn.disabled = true;

    var submitBtnInitText = submitBtn.innerHTML;

    var dropZone = document.querySelectorAll('.upldr-dropzone');
    if (dropZone.length < 1) {
        dropZone = document.body;
    }

    function fileSelect(evt) {

        evt.stopPropagation();
        evt.preventDefault();

        var evtFiles;
        if (evt.target.files) {
            evtFiles = evt.target.files;
        } else if (evt.dataTransfer.files) {
            evtFiles = evt.dataTransfer.files;
        } else {
            return false;
        }

        for (var i = 0; i < evtFiles.length; i++) {
            // Only process image files:
            if (evtFiles[i].type.match(options.typeMatch)) {
                files.push(evtFiles[i]);
            }
        }

        if (files.length < 1) {
            return false;
        }
        submitBtn.disabled = false;
        resetBtn.disabled = false;

        var ftb = document.getElementById('file-table-body');
        ftb.innerHTML = "";

        for (var i = 0; i < files.length; i++) {
            var reader = new FileReader();

            var f = files[i];
            reader.name = f.name;
            if (options.slug && getSlug) {
                var str = f.name.split('.');
                str[0] = getSlug(str[0]);
                reader.name = str.join('.');
            }

            reader.type = f.type;
            // file size from bytes to KB:
            reader.size = (f.size / 1000).toFixed(2);
            //var fLastMod = f.lastModified;
            reader.lastMod = f.lastModifiedDate.toLocaleDateString();

            reader.onload = function(e) {
                var src = e.target.result;
                options.cbReaderOnload(src, this.name, this.type, this.size, this.lastMod);
            };
            reader.readAsDataURL(f);
        }

    };

    function fileDragOver(evt) {
        evt.stopPropagation();
        evt.preventDefault();
        evt.dataTransfer.dropEffect = 'copy';
    };

    function abort() {
        if (request) {
            request.abort();
        }
    };

    this.reset = function() {
        console.log("reset");
        files = [];
        form.reset();
        progressBar.style.width = 0;
        progressBar.innerHTML = "";
        submitBtn.innerHTML = submitBtnInitText;
        submitBtn.disabled = true;
        resetBtn.disabled = true;
        if (options.cbReset) {
            options.cbReset();
        }
        //document.getElementById('file-table-body').innerHTML = "";
    };

    function progress(e) {
        if (e.lengthComputable) {
            percLoaded = Math.round(e.loaded / e.total * 100) + "%";
            progressBar.style.width = percLoaded;
            progressBar.innerHTML = percLoaded;
            submitBtn.textContent = percLoaded;
        }
    };

    function upload(e) {
        e.preventDefault();

        submitBtn.disabled = true;
        resetBtn.disabled = true;

        if (!files || files.length === 0) {
            console.log('no files to upload');
            return false;
        }

        var formdata = new FormData();
        for (var i = 0; i < files.length; i++) {
            var f = files[i];
            if (f.type.match(options.typeMatch)) {
                formdata.append('files[]', f);
            }
        }

        if (options.data) {
            formdata.append('data', options.data);
        }

        request = new XMLHttpRequest();
        request.onreadystatechange = function() {
            //if (request.readyState == 4) {
            try {
                var resp = JSON.parse(request.response);
            } catch (e) {
                /*
                var resp = {
                	status : 'error',
                	data : 'Unknown error occurred: [' + request.responseText + ']'
                };
                */
            }
            //console.log(resp.status + ': ' + resp.data);
            //}
        };

        request.onloadend = function(e) {
            //console.log(e.target.response);
            if (options.cbOnloadend) {
                options.cbOnloadend(e);
            }
        };

        request.upload.addEventListener("progress", progress, false);
        request.open("POST", options.target, true);
        request.send(formdata);
    };


    form.onsubmit = upload;
    abortBtn.onclick = abort
    resetBtn.onclick = this.reset;
    inputFile.onchange = fileSelect;
    //inputFile.addEventListener('change', fileSelect, false);

    dropZone.addEventListener('dragover', fileDragOver, false);
    dropZone.addEventListener('drop', fileSelect, false);

};

var upldr = new _upldr;
