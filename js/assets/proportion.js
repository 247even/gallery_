// jquery proportion
(function($) {
    $.fn.proportion = function(a, b) {
        var a = !a ? 0 : a;
        var b = !b ? 0 : b;
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
        'proportion': !d.proportion ? [0, 0] : d.proportion,
        'className': !d.className ? 'prop_' + prop.proportion.toString : d.className,
        'styleId': !d.styleId ? className : d.styleId,
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
        var width = eli.style.width ? eli.style.width : eli.offsetWidth;
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
