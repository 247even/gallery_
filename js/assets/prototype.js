function prototype(data) {

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

    if (selectors) {
        for (i = 0; i < selectors.length; i++) {
            var selector = '{{' + selectors[i] + '}}';
            ct = ct.replace(selector, values[i]);
            ct = ct.split(selector).join(values[i]);
        }
    }
    //}

    if (targets) {
        for (i = 0; i < targets.length; i++) {
            targets[i].insertAdjacentHTML('beforeend', ct);
        }
    } else {
        template.innerHTML = ct;
    }

		if (data.cut) {
				template.innerHTML = '';
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
