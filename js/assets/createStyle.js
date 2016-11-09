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
