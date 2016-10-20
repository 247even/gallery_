// func.js

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
    for (var e = 0; e < el.length; e++) {
        for (var i = 0; i < classes.length; i++) {
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
    for (var i = 0, j = classes.length; i < j; i++) {
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
    for (var i = 0; i < el.length; i++) {
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
    $.fn.proportion = function(a, b) {
        var a = !a ? 0 : a;
        var b = !b ? 0 : b;
        $(this).css('height', $(this).outerWidth() * b / a);
        return this;
    }
})(jQuery);

function proportion(el, a, b) {
    var a = !a ? 0 : a;
    var b = !b ? 0 : b;
    for (i = 0; i < el.length; i++) {
        el[i].style.height = el[i].offsetWidth * b / a + 'px';
    }
};


(function($) {
    $.fn.center = function(vh) {
        this.css("position", "absolute")
            .css("top", ($(window).height() - this.height()) / 2 + "px");
        //this.css("left", ( $(window).width() - this.width() ) / 2 + "px");
        return this;
    }
})(jQuery);
