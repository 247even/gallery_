var _resizeStore = function(folder, file, sizes, force) {
	
	if (!folder) {
		console.log("no folder!")
		return false;
	}
	if (!file) {
		console.log("no file!")
		return false;
	}
	if (!sizes) {
		//var sizes = gJ.sizes.join();
		var sizes = gJ.sizes;
	}
	if (!force) {
		var force = false;
	}

	var done;
	this.done = function(cb) {
		done = cb;
	};
	
	var i = 0;
	send();

	function send() {
		console.log("i: " + i);
		console.log(sizes.length);
		if (i < sizes.length) {
			var postData = 'folder=' + folder + '&file=' + file + '&sizes=' + sizes[i] + '&force=' + force;
			$.ajax({
				//dataType : "json",
				url : "gallery/resizeStore.php",
				type : "GET",
				data : postData
			}).done(function(data) {
				i++;
				send();
			}).always(function(data) {
				//console.log(data);
			}).fail(function(data) {
				//console.log(data);
			});
		} else {
			done();
		}
	};

	/*
	 var postData = 'folder=' + folder + '&file=' + file + '&sizes=' + sizes + '&force=' + force;

	 return $.ajax({
	 //dataType : "json",
	 url : "gallery/resizeStore.php",
	 type : "GET",
	 data : postData
	 }).always(function(data) {
	 //console.log(data);
	 }).fail(function(data) {
	 //console.log(data);
	 });
	 */
};
