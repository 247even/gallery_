
var request = true;

var allFolders = function() {
	return $.post("gallery/allFolders.php", "allFolders", null, 'json');
};

var createFolder = function(path) {
	return $.post("gallery/createFolder.php", 'folder=' + path, null, 'json');
};

var removeFolder = function(f) {
	return $.post("gallery/removeFolder.php", "folder=" + f, null, 'json');
};

var imagesFromFolder = function(f) {
	var data = "folder=" + f + "&ts=" + Date.now();
	return $.post("gallery/imagesFromFolder.php", data, null, 'json').done(function(data){
		stat.allImages = data;
	});
};

var resizeStore = function(folder, file, size, force) {
	var postdata = 'folder=' + folder + '&file=' + file + '&sizes=' + size + '&force=' + force;
	return $.post("gallery/resizeStore.php", postdata, 'json');
};

var removeImage = function(p) {
	return $.post("gallery/removeImage.php", "path=" + p, null, 'json');
};

var getAllBackups = function() {
	return $.post("gallery/allBackups.php", "allBackups=true&t=" + Date.now(), null, 'json');
};

var backup = function() {
	return $.post("gallery/backup.php", "backup=true", null, 'json');
};

var saveFileAs = function(c, t) {
	var data = "content=" + c + "&target=" + t;
	return $.post("gallery/saveFileAs.php", data, null, 'json');
};
