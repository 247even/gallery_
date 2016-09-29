/* Upload Panel */
$('.admin-header a[aria-controls="upload-panel"]').on('shown.bs.tab', function(e) {

	var upldrData = {};

	function folderSelect() {
		$('#upload-folder-select').html('');
		for (var i = 0; gJ.folders.length > i; i++) {
			var folder = gJ.folders[i];
			prototype({
				'template' : '#folder-select-prototype',
				'selectors' : ['folder'],
				'values' : [folder],
				'targets' : '#upload-folder-select'
			});
		}
	};
	folderSelect();

	function createFolder(path) {
		var data = 'folder=' + path;
		var request = new XMLHttpRequest();
		request.open('POST', './gallery/createFolder.php', true);
		request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
		request.onload = function() {
			if (request.status >= 200 && request.status < 400) {
				var resp = request.responseText;
				gJ.folders.push(path);
				folderSelect();
				console.log(resp);
			} else {
				// We reached our target server, but it returned an error
			}
		};
		request.send(data);
	};

	function filesToGJ(f) {
		for ( i = 0; f.length > i; i++) {

		}
	};

	$('#new-folder-name').on('keypress', function(event) {
		var regex = new RegExp("^[a-zA-Z0-9_-]+$");
		var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
		if (!regex.test(key)) {
			event.preventDefault();
			return false;
		}
	});

	$("#new-folder-btn").on('click', function() {
		var val = $('#new-folder-name').val();
		if (val) {
			val = val.trim();
			if ($.inArray(val, gJ.folders) < 0 || $.inArray(val, gJ.ignore)) {
				console.log('folder already present');
				return false;
			}
			createFolder(val);
		}
	});

	$("#upload-tags").on("change", function() {
		var value = $(this).val();
		if (value && value != ' ') {
			value = value.trim();
			value = value.split(',');
			for (var i = 0; value.length > i; i++) {
				value[i] = value[i].trim();
			}
			value = _.without(value, '', ' ');
			value = _.uniq(value);
			upldrData.tags = value.toString();
			upldr.options.data = JSON.stringify(upldrData);
		}
	});

	ddSelect('onselect', function(val) {
		console.log(val);
	});

	$('#upload-folder-select').on('change', function() {
		upldrData.path = $(this).val();
		upldr.options.data = JSON.stringify(upldrData);
	});
	upldrData.path = $('#upload-folder-select').val();
	upldr.options.data = JSON.stringify(upldrData);
	//$('#upload-folder-select').trigger( "change" );

	/*
	 upldr.options = {
	 'target' : "gallery/fileUpload.php",
	 //'data' : JSON.stringify(upldrData),
	 'cbReaderOnload' : function(src, fName, fType, fSize, fLastMod) {
	 prototype({
	 'template' : '.file-row-prototype',
	 'selectors' : ['src', 'name', 'type', 'size', 'lastMod'],
	 'values' : [src, fName, fType, fSize, fLastMod],
	 'targets' : '#file-table-body'
	 });
	 },
	 'cbOnloadend' : function(res) {
	 console.log(res.target.response);
	 setTimeout(function() {
	 upldr.reset();
	 }, 3000);
	 }
	 };
	 */

	upldr.set({
		'target' : "gallery/fileUpload.php",
		//'data' : JSON.stringify(upldrData),
		'cbReaderOnload' : function(src, fName, fType, fSize, fLastMod) {
			prototype({
				'template' : '.file-row-prototype',
				'selectors' : ['src', 'name', 'type', 'size', 'lastMod'],
				'values' : [src, fName, fType, fSize, fLastMod],
				'targets' : '#file-table-body'
			});
		},
		'cbOnloadend' : function(res) {
			console.log(res.target.response);
			processResponse(res.target.response);
			setTimeout(function() {
				upldr.reset();
			}, 3000);
		}
	});
});

function processResponse(res) {
	var res = JSON.parse(res);
	var images = res.name;
	var path = res.data.path;
	var folder = path.split('/');
	folder = folder[folder.length - 1];
	var tags = res.data.tags;
	tags = tags.split(',');
	tags = tags.push(folder);

	for (var i = 0; i < images.length; i++) {
		var n = Date.now();
		var name = res.name[i];
		var encname = encodeURI(images[i]);
		var id = path + encname;
		var entry = {
			"file" : name,
			"path" : path,
			"time" : n,
			"tags" : tags
		};
		gJ.images[id] = entry;
	};
};