var _resizeStoreSizes = function(folder, file, sizes, force) {

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
		if (i < sizes.length) {

			stat.workingSize = sizes[i];

			resizeStore(folder, file, sizes[i], false).done(function(){
					i++;
					send();
				}
			).fail(function(){
					console.log("resizeStore fail");
			});

/*
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
	*/

		} else {
			done();
		}
	};
};
