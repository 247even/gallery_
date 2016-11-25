// requests
var request = true;

var allFolders = function() {
    return $.post('./requests/allFolders.php', 'allFolders', null, 'json');
};

var createFolder = function(folder) {
    return $.post('./requests/createFolder.php', 'folder=gallery/' + folder, null, 'json');
};

var removeFolder = function(folder) {
    return $.post('./requests/removeFolder.php', 'folder=gallery/' + folder, null);
};

var imagesFromFolder = function(f) {
    var postdata = 'folder=../gallery/' + f + '&ts=' + Date.now();
    return $.post('./requests/imagesFromFolder.php', postdata, null, 'json').done(function(data) {
        stat.allImages = data;
    });
};

var resizeStore = function(folder, file, size, force) {
    var postdata = 'folder=gallery/' + folder + '&file=' + file + '&sizes=' + size + '&force=' + force;
    return $.post('./requests/resizeStore.php', postdata, 'json');
};

var removeImage = function(folder) {
    return $.post('./requests/removeImage.php', 'path=gallery/' + folder, null, 'json');
};

var getAllBackups = function() {
    return $.post('./requests/allBackups.php', 'allBackups=true&t=' + Date.now(), null, 'json');
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
