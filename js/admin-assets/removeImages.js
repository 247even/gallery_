
function removeImages() {
    var l = imagesRemoved.length;
    var folders = [];
    var i = 0;

    if (l > 0) {
        var id = imagesRemoved[i];

        for (var sz in gJ.sizes) {
            var size = gJ.sizes[sz];
            var file = gJ.images[sz].file;
            var folder = gJ.images[sz].folder;
            var gid = folder + '_' + size + file;

            // check if this file's thumbnail is on the server
            if (allImagesFromServer[gid]) {
                folders.push(gJ.images[id].folder + '_' + size + '/' + gJ.images[id].file);
            }
        }
    }

    function removeImageSync() {
        if (i < folders.length) {
            removeImage(folders[i])
                .done(function() {
                    i++;
                    delete gJ.images[key];
                    delete imagesRemoved[key];
                    //console.log('done ' + i);
                    removeImageSync();
                })
                .fail(function() {
                    i++;
                    //console.log('fail ' + i);
                    removeImageSync();
                });
        } else {
            //console.log('finished deleting');
            // save JSON:
            $('#deleteImagesButton').off('click').text('save').on('click', function() {
                /*
                 backup().done(function(data){
                 var content = JSON.stringify(gJ);
                 var target = 'gallery.json';
                 saveFileAs(content, target);
                 });
                 */

                saveJSON();
            });
        }
    };

    var p = 0;
    var pl = folders.length;
    removeImageSync();
};
