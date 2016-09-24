var files = [];

function handleFileSelect(evt) {

	evt.stopPropagation();
	evt.preventDefault();

	var evtFiles;
	if (evt.target.files) {
		evtFiles = evt.target.files;
	} else if (evt.dataTransfer.files) {
		evtFiles = evt.dataTransfer.files;
	} else {
		return false;
	}

	for (var i = 0; i < evtFiles.length; i++) {
		// Only process image files:
		if (evtFiles[i].type.match('image.*')) {
			files.push(evtFiles[i]);
		}
	}
	
	
	var fo = document.getElementById('file-output');
	var ft = document.getElementById("file-thumbs");
	fo.innerHTML = "";
	ft.innerHTML = "";

	for (var i = 0; i < files.length; i++) {
		var f = files[i];
		var fName = f.name;
		var fType = f.type;
		// file size from bytes to KB:
		var fSize = (f.size / 1000).toFixed(2);
		var fLastMod = f.lastModifiedDate.toLocaleDateString();
		
		var outEl = '<li><strong>'+fName+'</strong> ('+fType+') - '+fSize+' KB, last modified: '+fLastMod+'</li>';
		fo.insertAdjacentHTML('beforeend', outEl);

		var reader = new FileReader();
		reader.onload = function(e) {
			var imgEl = '<img class="thumb" src="'+e.target.result+'" title="'+f.name+'"/>'
			ft.insertAdjacentHTML('beforeend', imgEl);
		};
		reader.readAsDataURL(f);
	}
	
};

function handleDragOver(evt) {
	evt.stopPropagation();
	evt.preventDefault();
	evt.dataTransfer.dropEffect = 'copy';
};


document.getElementById('input-file').addEventListener('change', handleFileSelect, false);

// Setup the dnd listeners.
var dropZone = document.getElementById('drop-zone');
dropZone.addEventListener('dragover', handleDragOver, false);
dropZone.addEventListener('drop', handleFileSelect, false);
