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
	
	
	var ftb = document.getElementById('file-table-body');
	ftb.innerHTML = "";

	for (var i = 0; i < files.length; i++) {
		var f = files[i];
		var fName = f.name;
		var fType = f.type;
		// file size from bytes to KB:
		var fSize = (f.size / 1000).toFixed(2);
		var fLastMod = f.lastModifiedDate.toLocaleDateString();
		
		var reader = new FileReader();
		reader.onload = function(e) {

			var src = e.target.result;
			//var tableRow = '<tr><th>'+imgEl+'</th><th>'+fName+'</th><th>'+fType+'</th><th>'+fSize+' KB</th><th>'+fLastMod+'</th></tr>'; 
			//ftb.insertAdjacentHTML('beforeend', tableRow);
			
			prototype({
				'template' : '.file-row-prototype',
				'selectors' : ['src','name','type','size','lastMod'],
				'values' : [src,fName,fType,fSize,fLastMod],
//				'selectors' : ['name','type','size','lastMod'],
//				'values' : [fName,fType,fSize,fLastMod],
				'targets' : '#file-table-body'
				}
			);		
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
