// admin-func.js

Array.prototype.unique = function() {
    var u = [];
    var l = this.length;
    for (var i = 0; i < l; i++) {
        if (u.indexOf(this[i]) == -1) {
            u.push(this[i]);
        }
    }
    return u;
};

function unique(arr) {
    var u = [];
    return arr.filter(function(v) {
        if (u.indexOf(v) == -1) {
            u.push(v);
            return v;
        }
    });
};

function checkIrregularFilename(file) {
    var response = {};
    response.error = false;
    response.expression = [];
    var osl = options.sizes.length;
    for (var i = 0; i < osl; i++) {
        if (file.indexOf('_' + options.sizes[i]) !== -1) {
            response.error = true;
            response.expression.push('_' + options.sizes[i]);
        }
    }
    return response;
};

function pickFromObject(obj, pick) {
    var ret = {};
    var objKeys = Object.keys(obj);
    var pL = pick.length;

    for (var i = 0; i < pL; i++) {
        if (obj[pick[i]]) {
            ret[pick[i]] = obj[pick[i]];
        }
    }
    console.log(ret);
    return ret;
};

function arrayIntersection(arr1, arr2) {
    // all values from arr1 which are in arr2
    var inter1 = arr1.filter(function(value) {
        if (arr2.indexOf(value) > -1) {
            return value;
        }
    });

    // all values from arr2 which are in arr1
    var inter2 = arr2.filter(function(value) {
        if (inter1.indexOf(value) > -1) {
            return value;
        }
    });

    return inter1.concat(inter2).unique();
};

function arrayWithout(arr1, arr2) {
    /*
      if (typeof arr2 === 'string') {
        var arr2 = [arr2];
      }
    */
    // all values from arr1 which are not in arr2
    return arr1.filter(function(value) {
        if (arr2.indexOf(value) === -1) {
            return value;
        }
    });
};

function arrayDiff(arr1, arr2, concat) {
    var concat = concat || false;
    var diff = {};

    // all values from arr1 which are not in arr2
    diff.arr1 = arr1.filter(function(value) {
        if (arr2.indexOf(value) === -1) {
            return value;
        }
    });

    if (!concat) {
        return diff.arr1;
    }

    // all values from arr2 which are not in arr1
    diff.arr2 = arr2.filter(function(value) {
        if (arr1.indexOf(value) === -1) {
            return value;
        }
    });

    diff.concat = diff.arr1.concat(diff.arr2);

    return diff;
};

/*
var arr1 = [1,2,3,4];
var arr2 = [4,6,1,4];
console.log(arrayDiff(arr1,arr2));
console.log(arrayDiff(arr1,arr2,true).arr2);
console.log(arrayDiff(arr1,arr2,true).concat);
*/

function withoutGalleryBase(data) {
    if (typeof data === 'string') {
        if (data.indexOf('/') !== -1) {
            value = data.split('/');
            var vl = value.length;
            return value[vl-1];
        }
        return false;
        //return data.replace('../gallery/', '');
    }

    return data.map(function(value) {
        if (value.indexOf('/') !== -1) {
            value = value.split('/');
            var vl = value.length;
            return value[vl-1];
        }
        //return value.replace('../'+options.galleryPath, '');
    });
};

function ignoreFolder(f) {
    var tr = $("#foldersTable tr[data='" + f + "']");
    if (stat.ignoreFolders.indexOf(f) == -1) {
        stat.ignoreFolders.push(f);
        tr.removeClass().addClass('warning');
    } else {
        stat.ignoreFolders.splice(stat.ignoreFolders.indexOf(f), 1);
        tr.removeClass().addClass('default');
    }
    //console.log(stat.ignoreFolders);
};

function addNewImages() {
    var ani = 0;

    function addImages() {

        var length = imagesAddedKeys.length;

        if (length <= 0) {
            return false;
        }

        if (ani < length) {
            var key = imagesAddedKeys[ani];
            var file = imagesAdded[key].file;
            var folder = imagesAdded[key].folder;

            resizeStore(folder, file).done(function() {
                gJ.images[key] = imagesAdded[key];
                ani++;
                addImages();
            });
        } else {
            //console.log('all images added');
            buildGallery(gJ);
            saveStatus(true);
        }
    };
};

function getNewImages(images) {

    if (!images) {
        var images = stat.allImages;
    }

    var match = [];
    stat.newImages = [];

    for (var key in images) {
        if (!gJ.images[key]) {
            // this image is not in gJ, must be new
            //match[key] = images[key];
            match.push(key);
        }
    }

    if (match.length > 0) {
        // we have new images
        //console.log('we have ' + match.length + ' new images');
    } else {
        //console.log('no new images');
    }
    stat.newImages = match;
    return match;


    /*
        var matchKeys = Object.keys(match);
        if (matchKeys.length > 0) {
            // we have new images
            console.log('we have '+matchKeys.length+' new images');
            stat.newImages = matchKeys;
            return matchKeys;
        }
        return false;
        */
};

function gjFilteredByFolder(fo) {
    var folder = fo || stat.workingFolder;
    var result = {};
    var keys = Object.keys(gJ.images);
    var klength = keys.length;

    for (var i = 0; klength > i; i++) {
        var image = gJ.images[keys[i]];
        if (image.folder === folder) {
            result[keys[i]] = image;
        }
    }

    return result;
};

function deleteFolderRelations(folder, cb) {
    var folders = [folder];
    var sizesLength = options.sizes.length;
    var i = 0;

    //check if folder is in 'ignore' and remove it
    var ignoreKey = gJ.ignore.indexOf(folder);
    if (ignoreKey > -1) {
        gJ.ignore.splice(ignoreKey, 1);
    } else {
        // remove images from galleryJSON:
        var imageKeys = Object.keys(gJ.images);
        var imagesLength = imageKeys.length;
        for (var j = 0; j < imagesLength; j++) {
            if (gJ.images[imageKeys[j]].folder == folder) {
                delete gJ.images[imageKeys[j]];
            }
        }
        /*
        _.omitBy(gJ.images, {
            'folder': folder
        });
        */
    }

    for (var l = 0; l < sizesLength; l++) {
        folders.push(folder + '_' + options.sizes[l]);
    }

    function deleteFolder() {
        if (i < folders.length) {
            removeFolder(folders[i])
                .done(function(e) {

                })
                .always(function(e) {
                    i++
                    deleteFolder();
                });
        } else {
            //console.log('deleteFolder done');
            if (cb) {
                cb();
            }
        }
    }

    deleteFolder();
};

function getRemovedImages(folder) {
    var galleryByFolder = gjFilteredByFolder(folder);
    for (var key in galleryByFolder) {
        if (!stat.imagesFromFolder[key]) {
            // this image is not present anymore
            stat.imagesRemoved.push(kk);
        }
    }
};

var saving = false;

function saveJSON() {
    //saveStatus(false);
    saving = true;
    $('#saveButton').prop('disabled', true).text('saving');
    backup().done(function() {
        var content = JSON.stringify(gJ);
        var target = 'gallery.json';
        saveFileAs(content, target).done(function() {
            //saveStatus(true);
            $('#saveButton').prop('disabled', false).text('Save');
            saving = false;
        });
    });
};

function saveStatus(state) {
    var st = state ? false : true;
    if (saving) {
        st = true
    }
    $('#saveButton').prop('disabled', st);
};
