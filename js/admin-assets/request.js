// request
var request = true;

var allFolders = function() {
    return $.post('allFolders.php', 'allFolders', null, 'json');
};

var createFolder = function(folder) {
    return $.post('createFolder.php', 'folder=gallery/' + folder, null, 'json');
};

var removeFolder = function(folder) {
    return $.post('removeFolder.php', 'folder=gallery/' + folder, null);
};

var imagesFromFolder = function(f) {
    var postdata = 'folder=gallery/' + f + '&ts=' + Date.now();
    return $.post('imagesFromFolder.php', postdata, null, 'json').done(function(data) {
        stat.allImages = data;
    });
};

var resizeStore = function(folder, file, size, force) {
    var postdata = 'folder=gallery/' + folder + '&file=' + file + '&sizes=' + size + '&force=' + force;
    return $.post('resizeStore.php', postdata, 'json');
};

var removeImage = function(folder) {
    return $.post('removeImage.php', 'path=gallery/' + folder, null, 'json');
};

var getAllBackups = function() {
    return $.post('allBackups.php', 'allBackups=true&t=' + Date.now(), null, 'json');
};

var backup = function() {
    return $.post(options.scriptBase + 'backup.php', 'backup=true', null, 'json');
};

var loadBackup = function(url) {
    return $.getJSON(url);
};

var fileExists = function(file) {
    return $.ajax({url: file, type: 'HEAD', async: true});
};

var saveFileAs = function(c, t) {
    return $.post(options.scriptBase + 'saveFileAs.php', 'content=' + c + '&target=' + t);
};
