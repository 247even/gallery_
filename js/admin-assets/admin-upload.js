/* Upload Panel */
$('.admin-header a[aria-controls="upload-panel"]').on('shown.bs.tab', function(e) {

	var upldrData = {};
	$('#new-folder-name').val('');
	$('#new-folder-btn').prop('disabled', true);
	setFolderSelect();

	function filesToGJ(f) {
			for ( i = 0; f.length > i; i++) {

			}
	};

	$('#new-folder-name').on('keyup', function(event) {
			var valLength = $(this).val().trim().length;

			if (valLength === 0) {
					$('#new-folder-btn').prop('disabled', true);
					return false;
			}

			if (valLength > 1 && event.keyCode != 8) {
				var regex = new RegExp('^[a-zA-Z0-9_äüö -]+$');
				var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
				if (!regex.test(key)) {
					event.preventDefault();
					console.log('test');
				}
			}

			if (valLength < 1) {
				$('#new-folder-btn').prop('disabled', true);
			} else {
				$('#new-folder-btn').prop('disabled', false);
			}
	});

	$('#new-folder-btn').on('click', function() {
		var val = $('#new-folder-name').val();
		if (val) {
			val = val.trim();

			if ( stat.allFolders.indexOf(val) !== -1 || gJ.folders.indexOf(val) !== -1 || gJ.ignore.indexOf(val) !== -1 ) {
				bootbox.alert({
            size: 'small',
            message: 'A folder "'+val+'" already exists.',
            callback: function(result) {
                if (result) {

                }
            }
        });
				return false;
			}

			var checkNameSizes = checkIrregularFilename(val);
			if (checkNameSizes.error) {
				bootbox.alert({
            size: 'small',
            message: 'Please choose another name.<br> The phrase "'+checkNameSizes.expression+'" is prohibited.',
            callback: function(result) {
                if (result) {

                }
            }
        });
				return false;
			}

			createFolder(val).done(function(data){
				stat.newFolders = [withoutGalleryBase(data.dir)];
				$('#new-folder-name').val('');
			});
		}
	});

	$('#upload-tags').on('change', function() {
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

	$('#upload-folder-select').on('change', function() {
		upldrData.folder = $(this).val();
		upldr.options.data = JSON.stringify(upldrData);
	});
	upldrData.folder = $('#upload-folder-select').val();
	upldr.options.data = JSON.stringify(upldrData);
	//$('#upload-folder-select').trigger( 'change' );

	/*
	 upldr.options = {
	 'target' : 'gallery/fileUpload.php',
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
		'target' : 'gallery/fileUpload.php',
		//'data' : JSON.stringify(upldrData),
		'cbReaderOnload' : function(src, fName, fType, fSize, fLastMod) {
				//console.log( getSlug(fName, {'custom' : ['.'] }) );
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
	var path = res.data.folder;
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
			'file' : name,
			'folder' : path,
			'time' : n,
			'tags' : tags
		};
		gJ.images[id] = entry;
	};
};

function setFolderSelect(fo) {
	$('#upload-folder-select').html('');
	var folders = fo ? fo : gJ.folders;
	var foldersLength = folders.length;
	for (var i = 0; foldersLength > i; i++) {
		prototype({
			'template' : '#folder-select-prototype',
			'selectors' : ['folder'],
			'values' : [folders[i]],
			'targets' : '#upload-folder-select'
		});
	}
};
