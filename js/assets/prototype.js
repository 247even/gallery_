function prototype(data) {
    "use strict";

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
        var sL = selectors.length;
        for (i = 0; i < sL; i++) {
            var selector = '{{' + selectors[i] + '}}';
            ct = ct.replace(selector, values[i]);
            ct = ct.split(selector).join(values[i]);
        }
    }
    //}

    if (targets) {
        var tL = targets.length;
        for (i = 0; i < tL; i++) {
            //targets[i].innerHTML += ct;
            targets[i].insertAdjacentHTML('beforeend', ct);
        }
    } else {
        template.innerHTML = ct;
    }

    if (data.cut) {
     //console.log('template:');
       //console.log(template);
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
