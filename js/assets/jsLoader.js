jsLoader = function(od) {
	var options = {
		// path to jsLoader.php
		//'url' = 'jsLoader.php',
		'url' : 'gallery/jsLoader.php',
		'path' : '',
		'filter' :  '*.{js,json,js.gz,json.gz}',
		'concat' : false,
		'minify' : false,
		'gzip' : false,
		'cache' : false,
		'srcpath' : ''
	};
	
	this.set = function(od){
		if(od){
			for (var key in od) {
	  			options[key] = od[key];
			}
		}
	};
	
	if(od){
		this.set(od);
	}
	
	request = new XMLHttpRequest();
	request.onloadend = function(e) {
		var response = JSON.parse(e.target.responseText);
		console.log(response);
		
		for ( i = 0; response.names.length > i; i++) {
			var script = document.createElement("script");
			script.type = "text/javascript";
			script.src = options.srcpath+response.names[i];
			document.body.appendChild(script);
		}
	};
	//var url = options.url+"?path="+path+"&filter="+filter;
	var jurl = options.url+'?options='+JSON.stringify(options);
	request.open("GET", jurl , true);
	request.send();
	
};