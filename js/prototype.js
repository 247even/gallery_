function prototype(data) {

	// template element to search in for placeholders:
	var templates;
	if (data.template) {
		templates = document.querySelectorAll(data.template);
	} else {
		templates = document.querySelectorAll('body');
	}

	var selectors = data.selectors;
	var values = data.values;

	var targets;
	if (data.targets) {
		targets = document.querySelectorAll(data.targets);
	}

	for ( i = 0; i < templates.length; i++) {
		var ct = templates[i].innerHTML;

		for ( i = 0; i < selectors.length; i++) {
			var selector = '{{' + selectors[i] + '}}';
			//ct = ct.replace(selector, values[i]);
			console.log(ct);
			ct = ct.split(selector).join(values[i])
		}

	}

	if (targets) {
		for ( i = 0; i < targets.length; i++) {
			targets[i].insertAdjacentHTML('beforeend', ct);
		}
	} else {
		templates[i].innerHTML = ct;
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

