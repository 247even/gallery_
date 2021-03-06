var adminAssets = true;
'use strict';

var stat = {
    'imagesRemoved': [],
    'imagesAdded': {},
    'imagesAddedKeys': [],
    'imagesModified': [],
    'imagesNotProcessed': [],
    'workingFolder': '',
    'existingImages' : {},

    '_options': {},
    set options(val) {
        for (var key in val) {
            this._options[key] = val[key];
        }
        if (this._options !== options) {
            saveStatus(true);
        }
    },
    get options() {
        for (var key in this._options) {

        }
        return this._options;
    },

    '_effect': ['blur', 5],
    set effect(val) {
        this._effect = val;
        blur('#effect-preview-image', stat.effect[1]);
        blur('#effect-fullscreen', stat.effect[1]);
    },
    get effect() {
        return this._effect;
    },

    'sliders': {},
    'workingSlider': 's1',
    '_sliderNumber': 5,
    set sliderNumber(val) {
        this._sliderNumber = val;
        statSaveSlider();
    },
    get sliderNumber() {
        return this._sliderNumber;
    },
    '_sliderInterval': 3,
    set sliderInterval(val) {
        this._sliderInterval = val;
        statSaveSlider();
    },
    get sliderInterval() {
        return this._sliderInterval;
    },
    '_selectedIds': [],
    set selectedIds(val) {
        this._selectedIds = val;
        statSaveSlider();
    },
    get selectedIds() {
        return this._selectedIds;
    },

    '_workingImage': '',
    set workingImage(val) {
        this._workingImage = val;
        //console.log('workingImage: ' + this._workingImage);
    },
    get workingImage() {
        return this._workingImage;
    },

    '_workingSize': '',
    set workingSize(val) {
        this._workingSize = val;
        //console.log('workingSize: ' + this._workingSize);
    },
    get workingSize() {
        return this._workingSize;
    },

    '_folderImages': [],
    set folderImages(val) {
        this._folderImages = val;
        buildFolderTable();
    },
    get folderImages() {
        return this._folderImages;
    },

    '_allImages': {},
    set allImages(val) {
        this._allImages = val || {};
        if (Object.keys(this._allImages).length > 0) {
            getNewImages();
        }
    },
    get allImages() {
        return this._allImages;
    },

    '_newImages': [],
    set newImages(val) {
        this._newImages = val;
        //console.log('stat.newImages: ' + stat.newImages.length);
        //console.log(stat.folderImages);
    },
    get newImages() {
        return this._newImages;
    },

    '_allFolders': [],
    set allFolders(val) {
        this._allFolders = val;
        //console.log('stat.allFolders buildFolderTable:');
        //buildFolderTable();
    },
    get allFolders() {
        return this._allFolders;
    },

    '_newFolders': [],
    set newFolders(val) {
        this._newFolders = val;
        if (stat.newFolders.length > 0) {
            var folder = stat.newFolders[0];
            stat.workingFolder = folder;
            var msg = '"' + folder + '"';
            if (stat.folderImages[folder]) {
                msg = msg + ' (' + stat.folderImages[folder][0] + ')';
            }

            bootbox.confirm({
                size: 'small',
                title: 'New folder found:',
                message: msg,
                buttons: {
                    confirm: {
                        label: 'Add folder',
                        className: 'btn-primary'
                    },
                    cancel: {
                        label: 'Do not...',
                        className: 'btn-default'
                    }
                },
                callback: function(result) {
                    if (result) {
                        // add folder:
                        gJ.folders.push(folder);
                        setFolderSelect();
                        $('#upload-folder-select').val(folder).prop('selected', true);
                        processNewFolder({
                            'folder': folder,
                            'cb': function() {
                                stat.newFolders = arrayWithout(stat.newFolders, stat.workingFolder);
                            }
                        });
                        return;
                    }
                    // ignore folder:
                    ignoreFolder(folder);
                    stat.newFolders = arrayWithout(stat.newFolders, folder);
                }
            });
        }
    },
    get newFolders() {
        return this._newFolders;
    },

    '_ignoreFolders': [],
    set ignoreFolders(val) {
        var tr = $("#foldersTable tr[data='" + val + "']");
        if (this._ignoreFolders.indexOf(val) === -1) {
            this._ignoreFolders.push(val);
            tr.removeClass().addClass('warning');
        } else {
            this._ignoreFolders.splice(this._ignoreFolders.indexOf(val), 1);
            tr.removeClass().addClass('default');
        }
    },
    get ignoreFolders() {
        return this._ignoreFolders;
    },

    '_tagsSelectedIds': [],
    set tagsSelectedIds(val) {
        var index = this._tagsSelectedIds.indexOf(val);
        if (index > -1) {
            this._tagsSelectedIds.splice(index, 1);
        } else {
            this._tagsSelectedIds.push(val);
        }
    },
    get tagsSelectedIds() {
        return this._tagsSelectedIds;
    },

    '_imageTags': {},
    set imageTags(val) {

    },
    get imageTags() {
        return this._imageTags;
    },

    '_tagsEdited': [],
    set tagsEdited(val) {
        this._tagsEdited.push(val);
        this._tagsEdited = this._tagsEdited.unique();
    },
    get tagsEdited() {
        return this._tagsEdited;
    },

    '_allTags': [],
    set allTags(val) {
        this._allTags = [];
        this._allTags = val;
        var stl = stat.allTags.length;
        for (var i = 0; i < stl; i++) {
            prototype({
                'template': '#tag-button-prototype',
                'selectors': ['text'],
                'values': [stat.allTags[i]],
                'targets': '#all-tags'
            });
        }
    },
    get allTags() {
        return this._allTags;
    }
};

function statSaveSlider(im) {
    stat.sliders[stat.workingSlider] = [
        im || stat.selectedIds,
        stat.sliderInterval,
        stat.sliderNumber
    ];
};
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
/* options */

//$('#optionsForm').validator();

function setOptions() {

    $('#gallery-row').find('.gallery-item').removeClass('selected-image').off('click');

    stat.options = options;

    $('#thumb-size-select').val(
        stat.options.thumbSize
    ).on('change', function() {

        removeClasses('div#gallery-row div.gallery-item', stat.options.thumbSizeSizes[stat.options.thumbSize]);
        stat.options = {
            'thumbSize': $(this).val()
        };
        var ntds = stat.options.thumbSizeSizes[stat.options.thumbSize].toString().replace(/,/g, ' ');
        $('div#gallery-row').find('div.gallery-item').addClass(ntds);
        proportion({
            selector: 'section#gallery-section div.gallery-item',
            proportion: stat.options.proportion,
            className: 'pgi',
            styleId: 'prop-gallery-item'
        });

        saveStatus(true);
    });

    $('#thumb-proportion-select').val(
        stat.options.proportion.toString()
    ).on('change', function() {
        stat.options = {
            'proportion': $(this).val().split(',').map(function(n) {
                return parseInt(n);
            })
        };
        proportion({
            selector: 'section#gallery-section div.gallery-item',
            proportion: stat.options.proportion,
            className: 'pgi',
            styleId: 'prop-gallery-item'
        });
        saveStatus(true);
    });


    $('#thumb-fit-select').val(
        stat.options.thumbFit.toString()
    ).on('change', function() {
        stat.options = {
            'thumbFit': $(this).val()
        };
        $('div#gallery-row').find('div.gallery-item div.thumb-div').removeClass('cover-image contain-image').addClass(stat.options.thumbFit + '-image');
        saveStatus(true);
    });

    $('#thumb-padding-input').val(
        stat.options.thumbPadding
    ).on('keydown', function(e) {
        // Allow: backspace, delete, tab, escape, enter
        if ([46, 8, 9, 27, 13].indexOf(e.keyCode) !== -1 ||
            // Allow: Ctrl+A
            (e.keyCode == 65 && e.ctrlKey === true) ||
            // Allow: Ctrl+C
            (e.keyCode == 67 && e.ctrlKey === true) ||
            // Allow: Ctrl+X
            (e.keyCode == 88 && e.ctrlKey === true) ||
            // Allow: home, end, left, right
            (e.keyCode >= 35 && e.keyCode <= 39)) {
            // let it happen, don't do anything
            return;
        }
        // Ensure that it is a number and stop the keypress
        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
            e.preventDefault();
            return false;
        }
    }).on('change input', function() {
        var value = $(this).val() || 0;
        stat.options = {
            'thumbPadding': (!value || value < 1) ? 0 : value
        };
        createStyle({
            id: 'item-padding',
            style: 'div#gallery-row div.gallery-item {padding: ' + stat.options.thumbPadding + 'px}'
        });
        saveStatus(true);
    });

    $('#input-sizes').val(stat.options.sizes.toString()).attr('placeholder', stat.options.sizes.toString()).on('keydown', function(e) {

        var value = $(this).val();
        // prevent comma at start
        if (e.keyCode == 188 && value == '') {
            return false;
        }
        // prevent double commatas
        if (e.keyCode == 188 && value.charAt(value.length - 1) == ',' && value.charAt(value.length - 1) == ',') {
            return false;
        }

        if ([46, 8, 9, 27, 13, 188].indexOf(e.keyCode) !== -1 ||
            // Allow: Ctrl+A
            (e.keyCode == 65 && e.ctrlKey === true) ||
            // Allow: Ctrl+C
            (e.keyCode == 67 && e.ctrlKey === true) ||
            // Allow: Ctrl+X
            (e.keyCode == 88 && e.ctrlKey === true) ||
            // Allow: home, end, left, right
            (e.keyCode >= 35 && e.keyCode <= 39)) {
            // don't do anything
            return;
        }

        // Ensure that it is a number and stop the keypress
        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
            e.preventDefault();
        }

    }).on('change input', function() {
        var value = $(this).val().split(',').unique()
            .filter(function(v) {
                if (parseInt(v)) {
                    return v
                }
            }).map(function(v, k) {
                return parseInt(v);
            }).sort(function(a, b) {
                return a - b;
            });

        stat.options = {
            'sizes': value
        };
        saveStatus(true);
    });

};

$('.admin-header a[aria-controls="options-panel"]').on('shown.bs.tab', function(e) {

    setOptions();

    $('#options-reset').on('click', function() {
        setOptions();
        buildGallery(gJ);
    });

    $('#options-save').on('click', function(e) {
        e.preventDefault();
        //          saveFileAs('var options ='+JSON.stringify(stat.options), 'options2.js').done(function(e){
        saveFileAs(JSON.stringify('var options =' + JSON.stringify(stat.options)), 'options2.js').done(function(e) {
            //console.log(e);
        }).always(function(e) {
            //console.log(e);
        });
    });

});
/* Raw Panel */
$('.admin-header a[aria-controls="raw-panel"]').on('shown.bs.tab', function(e) {

    loader();
		$('#gallery-row').find('.gallery-item').off('click').removeClass('selected-image');
		$('#json-output').text(JSON.stringify(gJ, null, '\t'));

    getAllBackups().done(function(data) {
        $('#loadBackupSelect').html('').append('<option>---</option>');
        var dataLength = data.length;
        for (var i = 0; i < dataLength; i++) {
            var split = data[i].split('.');
            $('#loadBackupSelect').append(
                '<option data-url=' + data[i] + '>' + convertTimestamp(split[1]) + '</option>'
            );
        };

        $('#loadBackupSelect').on('change', function() {
            loader();
            var dataUrl = $(this).find('option:selected').attr('data-url');
            var url = 'gallery/' + dataUrl;

            if (!dataUrl) {
                $('#json-output').text(JSON.stringify(gJ, null, '\t'));
                $('#outputFile').text('Gallery JSON');
                return false;
            }

						loadBackup(url).done(function(data) {
								$('#json-output').text(JSON.stringify(data, null, '\t'));
								$('#outputFile').text(dataUrl);
								$('#loadBuBtn').on('click', function() {
		                buildGallery(data);
		            });
								loader('off');
						});
        });

				loader('off');
    });
});
/* Sliders */

var dis = true;

$('.admin-header a[aria-controls="slider-panel"]').on('shown.bs.tab', function(e) {

    $('#slider-wrapper').on('click', function() {
        $(this).addClass('hidden');
    });

    $('#slider-interval-select').on('change', function() {
        stat.sliderInterval = $(this).val();
    });

    $('#slider-number-select').on('change', function() {
        stat.sliderNumber = $(this).val();
    });

    $('#slider-clear-btn').on('click', function() {
        reset();
    });

    $('#slider-fill-btn').on('click', function() {
        reset();
        for (var i = 0; i < stat.sliderNumber; i++) {
            $('#gallery-row').find('div.gallery-item').eq(i).trigger('click');
        }
    });

    $('#slider-auto-btn').on('click', function() {
        reset();

        if ($(this).attr('aria-pressed') === 'true') {
            $(this).html('auto <span class="glyphicon glyphicon-ban-circle" aria-hidden="true"></span>');
            return true;
        }

        $(this).html('auto <span class="glyphicon glyphicon-ok-circle" aria-hidden="true"></span>');

        var sliderNumber = $('#slider-number-select').val();
        for (var i = 0; i < sliderNumber; i++) {
            $('#gallery-section').find('div.gallery-item').eq(i).trigger('click');
        }
        //console.log(stat.selectedIds);
        stat.selectedIds = 'auto';
        //console.log(stat.selectedIds);
        buttonDisable(false);
    });

    $('#slider-save-btn').on('click', function() {
        //gJ.sliders[0] = selectedIds();
        gJ.sliders = stat.sliders;
        saveStatus(true);
    });


    $('#slider-interval-select').val(stat.sliderInterval).prop('selected', true);
    $('#slider-number-select').val(stat.sliderNumber).prop('selected', true);
    $('#blur-slider').val(stat.effect[1]);
    $('#blur-input').val(stat.effect[1]);
    $('#gallery-row').find('div.selected-image').removeClass('selected-image');
    $('#slider-sortable').html('');
    buttonDisable(dis);
    autoIds();

    if (stat.sliders[stat.workingSlider] && stat.sliders[stat.workingSlider][0] === 'auto') {
        $('#slider-auto-btn').addClass('active').attr('aria-pressed', true);
    } else {
        $('#slider-auto-btn').removeClass('active').attr('aria-pressed', false);
    }

    if ($('#slider-sortable').is(':empty')) {
        prototype({
            'template': '#placeholder-item-prototype',
            'targets': '#slider-sortable'
        });
        prototype({
            'template': '#placeholder-item-prototype',
            'targets': '#slider-sortable'
        });

        proportion({
            selector: 'div#slider-sortable div.placeholder-item',
            proportion: [1, 1],
            className: 'ssp',
            styleId: 'slider-sortable-prop'
        });
    }

    $('#slider-preview-btn').on('click', function() {
        $('#slider-1').attr('id', stat.workingSlider);
        buildSliders(pickFromObject(stat.sliders, [stat.workingSlider]))
        $('#slider-wrapper').removeClass('hidden');
        $('#' + stat.workingSlider).find('.item').respi();
        setTimeout(function() {
            //$('#'+stat.workingSlider).carousel();
        }, stat.sliders[stat.workingSlider][1]);
    });

    sortable('.sortable', {
        placeholderClass: 'col-xs-2 gallery-item sort-placeholder',
        forcePlaceholderSize: true,
        hoverClass: 'is-hovered'
    })

    sortable('.sortable')[0].addEventListener('sortupdate', function(e) {
        $('#slider-auto-btn[aria-pressed="true"]')
            .removeClass('active')
            .attr('aria-pressed', 'false')
            .html('auto <span class="glyphicon glyphicon-ban-circle" aria-hidden="true"></span>');
        selectedIds();
    });

    $('#gallery-row').find('div.gallery-item').off('click').on('click', function(e) {
        e.preventDefault();
        e.stopPropagation();

        $('#slider-auto-btn[aria-pressed="true"]')
            .removeClass('active')
            .attr('aria-pressed', 'false')
            .html('auto <span class="glyphicon glyphicon-ban-circle" aria-hidden="true"></span>');

        $(this).toggleClass('selected-image');

        if ($(this).hasClass('selected-image')) {

            var cl = 'gallery-item col-xs-2 selected-image sortable-item';
            var bgImg = $(this).find('div.thumb-div').css('background-image');
            bgImg = bgImg.replace('url("','').replace('")','');

            prototype({
                'template': '#sortable-item-prototype',
                'selectors': [
                    'data-id',
                    'bg-image'
                ],
                'values': [
                    $(this).attr('data-id'),
                    bgImg
                ],
                'targets': '#slider-sortable'
            });

            var el = document.getElementById('slider-sortable').querySelectorAll('div.gallery-item');
            $(el).removeClass('selected-image');

            $(el).off().on('click', function() {
                $(el).removeClass('selected-image');
                $(this).addClass('selected-image');
                loadBlur($(this).attr('data-id'));
            });

            // set same height for chrome
            if (el.length > 0) {
                proportion({
                    selector: 'div#slider-sortable div.gallery-item',
                    proportion: [1, 1],
                    className: 'ssp',
                    styleId: 'slider-sortable-prop'
                });

                $(el).css('height', Math.round(el[0].offsetHeight));
            }

        } else {
            $('#slider-sortable').find('div.gallery-item[data-id="' + $(this).attr('data-id') + '"]').remove();
        }

        sortable('.sortable');
        $('#slider-sortable').find('div.placeholder-item').remove();

        selectedIds();
        //console.log(stat.sliders);
        var selLength = stat.selectedIds.length;

        if (selLength === 0) {
            dis = true;
            prototype({
                'template': '#placeholder-item-prototype',
                'targets': '#slider-sortable'
            });
            prototype({
                'template': '#placeholder-item-prototype',
                'targets': '#slider-sortable'
            });
            proportion({
                selector: 'div#slider-sortable div.placeholder-item',
                proportion: [1, 1],
                className: 'ssp',
                styleId: 'slider-sortable-prop'
            });
            document.getElementById('effect-preview-image').src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
        }

        if (selLength > 0) {
            loadBlur();
        }

        if (selLength === 1) {
            dis = true;
            prototype({
                'template': '#placeholder-item-prototype',
                'targets': '#slider-sortable'
            });
            proportion({
                selector: 'div#slider-sortable div.placeholder-item',
                proportion: [1, 1],
                className: 'ssp',
                styleId: 'slider-sortable-prop'
            });
        }

        if (selLength >= 2) {
            dis = false;
        }

        buttonDisable(dis)

        if (!dis && gJ.sliders[stat.workingSlider] !== stat.sliders[stat.workingSlider]) {
            //$('#slider-save-btn').prop('disabled', false);
            document.getElementById('slider-save-btn').disabled = false;
            saveStatus(true);
            return false;
        }

        document.getElementById('slider-save-btn').disabled = true;
    });

    $('#blur-slider').rangeslider({
        polyfill: false,
        onInit: function(position, value) {},
        onSlide: function(position, value) {
            document.getElementById('blur-input').value = value;
        },
        onSlideEnd: function(position, value) {
            document.getElementById('blur-input').value = value;
            $('#blur-input').trigger('change');
        }
    });

    $('#blur-input').on('change', function() {
        var bs = $('#blur-slider');
        if (bs.val() != this.value) {
            bs.val(this.value).change();
        }
        stat.effect = ['blur', this.value];
    });

    $('#blur-save-button').click(function(e) {
        gJ.effect = stat.effect;
    });

    function fullScreen(img) {
        var ef = document.getElementById('effect-fullscreen');
        document.getElementById('effect-preview-image').addEventListener('click', function() {
            ef.style.display = 'block';
            ef.style.backgroundImage = 'url(' + img + ')';
        });
        ef.addEventListener('click', function() {
            ef.style.display = 'none';
        });
    };

    function loadBlur(imgId) {

        if (!imgId) {
            var selImg = document.querySelector('#slider-sortable .selected-image');
            if (!selImg) {
                document.getElementById('slider-sortable').querySelector('.gallery-item')
                    .className += ' selected-image';
                selImg = document.querySelector('#slider-sortable .selected-image');
            }
            var imgId = selImg.getAttribute('data-id');
        }

        $('#blurPath').val(imgId);
        var imgSrc_720 = 'gallery/' + gJ.images[imgId].folder + '_720/' + gJ.images[imgId].file;

        $('#blur-image-frame').find('img').attr('src', imgSrc_720).imagesLoaded().always(function() {
            //console.log('blur image');
        }).done(function() {
            blur('#effect-preview-image', stat.effect[1]);
            fullScreen(imgSrc_720);
            blur('#effect-fullscreen', stat.effect[1]);
        });
    };

    function reset() {
        document.getElementById('slider-sortable').innerHTML = '';
        removeClasses('div.gallery-item.selected-image', ['selected-image']);

        prototype({
            'template': '#placeholder-item-prototype',
            'targets': '#slider-sortable'
        });
        prototype({
            'template': '#placeholder-item-prototype',
            'targets': '#slider-sortable'
        });
        proportion({
            selector: 'div#slider-sortable div.placeholder-item',
            proportion: [1, 1],
            className: 'ssp',
            styleId: 'slider-sortable-prop'
        });
        buttonDisable(true);
    };

    function selectedIds() {
        var selected_ids = [];
        var items = document.getElementById('slider-sortable').querySelectorAll('div.gallery-item');
        var len = items.length;
        for (var i = 0; i < len; i++) {
            selected_ids.push(items[i].getAttribute('data-id'));
        }
        stat.selectedIds = selected_ids;
        return selected_ids;
    };

    function buttonDisable(st) {
        document.getElementById('slider-save-btn').disabled = st;
        document.getElementById('slider-clear-btn').disabled = st;
        document.getElementById('slider-preview-btn').disabled = st;
    };

    function autoIds(q) {

        if (!$('#slider-sortable').is(':empty')) {
            $('#slider-sortable').find('div.gallery-item').each(function() {
                $('div#gallery-row').find('div[data-id="' + $(this).attr('data-id') + '"]')
                    .addClass('selected-image');
            });
            return false;
        }

        if (gJ.sliders[0]) {
            var slider1 = gJ.sliders[0];
            var sliderLength = slider1.length;
            if (sliderLength > 1 || slider1 != 'auto') {
                for (var i = 0; i < sliderLength; i++) {
                    $('*[data-id="' + slider1[i] + '"]').addClass('selected-image');
                    document.getElementById('gallery-row').querySelector('div[data-id="' + gJ.sliders[0][i] + '"]').click();
                }
            }
        }
    };

});
// start-panel

$('.admin-header a[aria-controls="start-panel"]').on('shown.bs.tab', function(e) {

    $('#gallery-row').find('.gallery-item').removeClass('selected-image').off('click').on('click', function(e) {
        $('#gallery-lightbox').modal('show');
    });

    $('#admin-panel').find('.scan-button').on('click', function() {
        loader();
        getAllImages();
        loader('off');
    });

});
// <-- end start panel
/* Tags Panel */

var selectedImages_tags;


$('.admin-header a[aria-controls="tags-panel"]').on('shown.bs.tab', function(e) {

    var selectizeInput = $('#input-tags').selectize({
        plugins: ['remove_button'],
        delimiter: ',',
        persist: false,
        createFilter: '^[a-zA-Z0-9_äüö -]+$',
        create: function(input) {
            for (var i = 0, l = stat.tagsSelectedIds.length; i < l; i++) {
                var id = stat.tagsSelectedIds[i];
                var dataTags = stat.imageTags[id];
                //var unionTags = _.union(dataTags, input.split(','));
                var unionTags = dataTags.concat(input.split(',')).unique();
                //console.log(unionTags);
                if (unionTags != dataTags) {
                    stat.imageTags[id] = unionTags;
                    stat.tagsEdited = id;
                }
            }
            return {
                'text': input,
                'value': input
            };
        }
    });
    var selectizeTags = selectizeInput[0].selectize;
    selectizeTags.clear();

    for (var key in gJ.images) {
        stat.imageTags[key] = stat.imageTags[key] || gJ.images[key].tags;
    }

    document.getElementById('all-tags').innerHTML = '';
    stat.allTags = !stat.allTags.length ? gJ.tags : stat.allTags;

    $('#all-tags').find('button').on('click', function() {
        var text = $(this).text();
        for (var key in stat.imageTags) {
            if (stat.imageTags[key] === text || stat.imageTags[key].indexOf(text) > -1) {
                $('#gallery-row').find('div.gallery-item[data-id="' + key + '"]').trigger('click');
            }
        }
    });


    $('#gallery-row').find('div.gallery-item').removeClass('selected-image').off('click').on('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        $(this).toggleClass('selected-image');
        stat.tagsSelectedIds = $(this).attr('data-id');
        selectTags();
    });

    $('#tags-submit-button').on('click', function(e) {
        e.preventDefault();

        var tags = [];

        var editedLength = stat.tagsEdited.length;
        for (var i = 0; i < editedLength; i++) {
            gJ.images[stat.tagsEdited[i]].tags = stat.imageTags[stat.tagsEdited[i]];
        }

        for (var key in gJ.images) {
            tags.push(gJ.images[key].tags);
            //console.log(tags);
        }

        //gJ.tags = _.uniq(_.flattenDeep(tags));
        gJ.tags = tags.unique();
        //console.log(gJ.tags);
        buildGalleryNavigation();
        saveStatus(true);

        //console.log(tagsJSON);
        return false;

        var postdata = $('#tags-form').serialize();
    });

    $('#deleteImagesButton').on('click', function() {
        //console.log('delete clicked');
        deleteSelectedImages();
    });


function selectTags() {

    var selectedImages = stat.tagsSelectedIds;
    var selectedLength = selectedImages.length;
    var selectedTags = [];

    selectizeTags.clear();

    if (selectedLength === 0) {
        //console.log('nothing selected');
        return false;
    }


    var firstTag = stat.imageTags[stat.tagsSelectedIds[0]] || gJ.images[stat.tagsSelectedIds[0]].tags;
    var groupTags = $('#input-tags').attr('value').split(',');

    if (selectedLength === 1) {

        selectedTags = groupTags = firstTag;

    } else if (selectedLength > 1) {

        groupTags = !groupTags[0] ? firstTag : groupTags;
        for (var i = 0; i < selectedLength; i++) {
            var selectedId = stat.tagsSelectedIds[i];
            attrTags = stat.imageTags[selectedId] || gJ.images[selectedId].tags;
            //            selectedTags = _.union(selectedTags, attrTags);
            //            groupTags = _.intersection(groupTags, attrTags);
            selectedTags = selectedTags.concat(attrTags).unique();
            groupTags = arrayIntersection(groupTags, attrTags);
        }

    }

    $('#input-tags').attr('value', groupTags);

    $.each(groupTags, function(i, v) {
        selectizeTags.createItem(v);
    });
    selectizeTags.refreshItems();

    //    return groupTags;
};

});

function deleteSelectedImages() {
    var i = 0;
    var paths = [];

    if (selectedImages.length > 0) {
        selectedImages.each(function() {
            i++;
            var id = $(this).attr('data-id');
            // For testing! >>
            //paths.push(gJ.images[id].path+'/'+gJ.images[id].file);
            for (var sz in gJ.sizes) {
                var size = gJ.sizes[sz];
                paths.push(gJ.images[id].folder + '_' + size + '/' + gJ.images[id].file);
            }
            delete gJ.images[id];
        })

        function deleteImage(path) {
            if (paths.length > 0) {
                $.ajax({
                    type: 'GET',
                    url: 'gallery/removeImage.php',
                    data: 'path=' + path
                }).done(function() {
                    p++;
                    //console.log('done ' + p);
                    deleteFinished();
                }).fail(function() {
                    p++;
                    //console.log('fail ' + p);
                    deleteFinished();
                })
            }
        };

        var p = 0;
        var pl = paths.length;

        function deleteFinished() {
            if (p <= pl) {
                deleteImage(paths[p]);
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

        deleteFinished();
    }
};
/* Upload Panel */
$('.admin-header a[aria-controls="upload-panel"]').on('shown.bs.tab', function(e) {

    var upldrData = {};
    $('#new-folder-name').val('');
    $('#new-folder-btn').prop('disabled', true);
    setFolderSelect();

    function filesToGJ(f) {
        for (i = 0; f.length > i; i++) {

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

            if (stat.allFolders.indexOf(val) !== -1 || gJ.folders.indexOf(val) !== -1 || gJ.ignore.indexOf(val) !== -1) {
                bootbox.alert({
                    size: 'small',
                    message: 'A folder "' + val + '" already exists.',
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
                    message: 'Please choose another name.<br> The phrase "' + checkNameSizes.expression + '" is prohibited.',
                    callback: function(result) {
                        if (result) {

                        }
                    }
                });
                return false;
            }

            createFolder(val).done(function(data) {
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
            //value = _.without(value, '', ' ');
            value = arrayWithout(value, ['',' ']);
            //value = _.uniq(value);
            value = unique(value);
            upldrData.tags = value.toString();
            upldr.options.data = JSON.stringify(upldrData);
        }
    });

    $('#upload-folder-select').on('change', function() {
        upldrData.path = options.galleryPath + $(this).val();
        upldr.options.data = JSON.stringify(upldrData);
    });
    upldrData.path = options.galleryPath + $('#upload-folder-select').val();
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
        //'data' : JSON.stringify(upldrData),
        cbReaderOnload: function(src, fName, fType, fSize, fLastMod) {
            //console.log( getSlug(fName, {'custom' : ['.'] }) );
            prototype({
                'template': '.file-row-prototype',
                'selectors': ['src', 'name', 'type', 'size', 'lastMod'],
                'values': [src, fName, fType, fSize, fLastMod],
                'targets': '#file-table-body'
            });
        },
        cbOnloadend: function(res) {
            console.log(res.target.response);
            processResponse(res.target.response);
            setTimeout(function() {
                upldr.reset();
            }, 3000);
        }
    });
});

function processResponse(res) {
    console.log(res);

    var res = JSON.parse(res);
    var images = res.name;
    var path = res.data.path;
    var folder = path.split('/');
    folder = folder[folder.length - 1];
    var tags = [];
    if (res.data.tags) {
        tags = res.data.tags.split(',');
    }
    tags.push(folder);

    for (var i = 0; i < images.length; i++) {
        var n = Date.now();
        var name = res.name[i];
        var encname = encodeURI(images[i]);
        var id = path + encname;
        var entry = {
            'file': name,
            'folder': path,
            'time': n,
            'tags': tags
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
            'template': '#folder-select-prototype',
            'selectors': ['folder'],
            'values': [folders[i]],
            'targets': '#upload-folder-select'
        });
    }
};
/**
 * bootbox.js [v4.4.0]
 *
 * http://bootboxjs.com/license.txt
 */

// @see https://github.com/makeusabrew/bootbox/issues/180
// @see https://github.com/makeusabrew/bootbox/issues/186
(function (root, factory) {

  "use strict";
  if (typeof define === "function" && define.amd) {
    // AMD. Register as an anonymous module.
    define(["jquery"], factory);
  } else if (typeof exports === "object") {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like environments that support module.exports,
    // like Node.
    module.exports = factory(require("jquery"));
  } else {
    // Browser globals (root is window)
    root.bootbox = factory(root.jQuery);
  }

}(this, function init($, undefined) {

  "use strict";

  // the base DOM structure needed to create a modal
  var templates = {
    dialog:
      "<div class='bootbox modal' tabindex='-1' role='dialog'>" +
        "<div class='modal-dialog'>" +
          "<div class='modal-content'>" +
            "<div class='modal-body'><div class='bootbox-body'></div></div>" +
          "</div>" +
        "</div>" +
      "</div>",
    header:
      "<div class='modal-header'>" +
        "<h4 class='modal-title'></h4>" +
      "</div>",
    footer:
      "<div class='modal-footer'></div>",
    closeButton:
      "<button type='button' class='bootbox-close-button close' data-dismiss='modal' aria-hidden='true'>&times;</button>",
    form:
      "<form class='bootbox-form'></form>",
    inputs: {
      text:
        "<input class='bootbox-input bootbox-input-text form-control' autocomplete=off type=text />",
      textarea:
        "<textarea class='bootbox-input bootbox-input-textarea form-control'></textarea>",
      email:
        "<input class='bootbox-input bootbox-input-email form-control' autocomplete='off' type='email' />",
      select:
        "<select class='bootbox-input bootbox-input-select form-control'></select>",
      checkbox:
        "<div class='checkbox'><label><input class='bootbox-input bootbox-input-checkbox' type='checkbox' /></label></div>",
      date:
        "<input class='bootbox-input bootbox-input-date form-control' autocomplete=off type='date' />",
      time:
        "<input class='bootbox-input bootbox-input-time form-control' autocomplete=off type='time' />",
      number:
        "<input class='bootbox-input bootbox-input-number form-control' autocomplete=off type='number' />",
      password:
        "<input class='bootbox-input bootbox-input-password form-control' autocomplete='off' type='password' />"
    }
  };

  var defaults = {
    // default language
    locale: "en",
    // show backdrop or not. Default to static so user has to interact with dialog
    backdrop: "static",
    // animate the modal in/out
    animate: true,
    // additional class string applied to the top level dialog
    className: null,
    // whether or not to include a close button
    closeButton: true,
    // show the dialog immediately by default
    show: true,
    // dialog container
    container: "body"
  };

  // our public object; augmented after our private API
  var exports = {};

  /**
   * @private
   */
  function _t(key) {
    var locale = locales[defaults.locale];
    return locale ? locale[key] : locales.en[key];
  }

  function processCallback(e, dialog, callback) {
    e.stopPropagation();
    e.preventDefault();

    // by default we assume a callback will get rid of the dialog,
    // although it is given the opportunity to override this

    // so, if the callback can be invoked and it *explicitly returns false*
    // then we'll set a flag to keep the dialog active...
    var preserveDialog = $.isFunction(callback) && callback.call(dialog, e) === false;

    // ... otherwise we'll bin it
    if (!preserveDialog) {
      dialog.modal("hide");
    }
  }

  function getKeyLength(obj) {
    // @TODO defer to Object.keys(x).length if available?
    var k, t = 0;
    for (k in obj) {
      t ++;
    }
    return t;
  }

  function each(collection, iterator) {
    var index = 0;
    $.each(collection, function(key, value) {
      iterator(key, value, index++);
    });
  }

  function sanitize(options) {
    var buttons;
    var total;

    if (typeof options !== "object") {
      throw new Error("Please supply an object of options");
    }

    if (!options.message) {
      throw new Error("Please specify a message");
    }

    // make sure any supplied options take precedence over defaults
    options = $.extend({}, defaults, options);

    if (!options.buttons) {
      options.buttons = {};
    }

    buttons = options.buttons;

    total = getKeyLength(buttons);

    each(buttons, function(key, button, index) {

      if ($.isFunction(button)) {
        // short form, assume value is our callback. Since button
        // isn't an object it isn't a reference either so re-assign it
        button = buttons[key] = {
          callback: button
        };
      }

      // before any further checks make sure by now button is the correct type
      if ($.type(button) !== "object") {
        throw new Error("button with key " + key + " must be an object");
      }

      if (!button.label) {
        // the lack of an explicit label means we'll assume the key is good enough
        button.label = key;
      }

      if (!button.className) {
        if (total <= 2 && index === total-1) {
          // always add a primary to the main option in a two-button dialog
          button.className = "btn-primary";
        } else {
          button.className = "btn-default";
        }
      }
    });

    return options;
  }

  /**
   * map a flexible set of arguments into a single returned object
   * if args.length is already one just return it, otherwise
   * use the properties argument to map the unnamed args to
   * object properties
   * so in the latter case:
   * mapArguments(["foo", $.noop], ["message", "callback"])
   * -> { message: "foo", callback: $.noop }
   */
  function mapArguments(args, properties) {
    var argn = args.length;
    var options = {};

    if (argn < 1 || argn > 2) {
      throw new Error("Invalid argument length");
    }

    if (argn === 2 || typeof args[0] === "string") {
      options[properties[0]] = args[0];
      options[properties[1]] = args[1];
    } else {
      options = args[0];
    }

    return options;
  }

  /**
   * merge a set of default dialog options with user supplied arguments
   */
  function mergeArguments(defaults, args, properties) {
    return $.extend(
      // deep merge
      true,
      // ensure the target is an empty, unreferenced object
      {},
      // the base options object for this type of dialog (often just buttons)
      defaults,
      // args could be an object or array; if it's an array properties will
      // map it to a proper options object
      mapArguments(
        args,
        properties
      )
    );
  }

  /**
   * this entry-level method makes heavy use of composition to take a simple
   * range of inputs and return valid options suitable for passing to bootbox.dialog
   */
  function mergeDialogOptions(className, labels, properties, args) {
    //  build up a base set of dialog properties
    var baseOptions = {
      className: "bootbox-" + className,
      buttons: createLabels.apply(null, labels)
    };

    // ensure the buttons properties generated, *after* merging
    // with user args are still valid against the supplied labels
    return validateButtons(
      // merge the generated base properties with user supplied arguments
      mergeArguments(
        baseOptions,
        args,
        // if args.length > 1, properties specify how each arg maps to an object key
        properties
      ),
      labels
    );
  }

  /**
   * from a given list of arguments return a suitable object of button labels
   * all this does is normalise the given labels and translate them where possible
   * e.g. "ok", "confirm" -> { ok: "OK, cancel: "Annuleren" }
   */
  function createLabels() {
    var buttons = {};

    for (var i = 0, j = arguments.length; i < j; i++) {
      var argument = arguments[i];
      var key = argument.toLowerCase();
      var value = argument.toUpperCase();

      buttons[key] = {
        label: _t(value)
      };
    }

    return buttons;
  }

  function validateButtons(options, buttons) {
    var allowedButtons = {};
    each(buttons, function(key, value) {
      allowedButtons[value] = true;
    });

    each(options.buttons, function(key) {
      if (allowedButtons[key] === undefined) {
        throw new Error("button key " + key + " is not allowed (options are " + buttons.join("\n") + ")");
      }
    });

    return options;
  }

  exports.alert = function() {
    var options;

    options = mergeDialogOptions("alert", ["ok"], ["message", "callback"], arguments);

    if (options.callback && !$.isFunction(options.callback)) {
      throw new Error("alert requires callback property to be a function when provided");
    }

    /**
     * overrides
     */
    options.buttons.ok.callback = options.onEscape = function() {
      if ($.isFunction(options.callback)) {
        return options.callback.call(this);
      }
      return true;
    };

    return exports.dialog(options);
  };

  exports.confirm = function() {
    var options;

    options = mergeDialogOptions("confirm", ["cancel", "confirm"], ["message", "callback"], arguments);

    /**
     * overrides; undo anything the user tried to set they shouldn't have
     */
    options.buttons.cancel.callback = options.onEscape = function() {
      return options.callback.call(this, false);
    };

    options.buttons.confirm.callback = function() {
      return options.callback.call(this, true);
    };

    // confirm specific validation
    if (!$.isFunction(options.callback)) {
      throw new Error("confirm requires a callback");
    }

    return exports.dialog(options);
  };

  exports.prompt = function() {
    var options;
    var defaults;
    var dialog;
    var form;
    var input;
    var shouldShow;
    var inputOptions;

    // we have to create our form first otherwise
    // its value is undefined when gearing up our options
    // @TODO this could be solved by allowing message to
    // be a function instead...
    form = $(templates.form);

    // prompt defaults are more complex than others in that
    // users can override more defaults
    // @TODO I don't like that prompt has to do a lot of heavy
    // lifting which mergeDialogOptions can *almost* support already
    // just because of 'value' and 'inputType' - can we refactor?
    defaults = {
      className: "bootbox-prompt",
      buttons: createLabels("cancel", "confirm"),
      value: "",
      inputType: "text"
    };

    options = validateButtons(
      mergeArguments(defaults, arguments, ["title", "callback"]),
      ["cancel", "confirm"]
    );

    // capture the user's show value; we always set this to false before
    // spawning the dialog to give us a chance to attach some handlers to
    // it, but we need to make sure we respect a preference not to show it
    shouldShow = (options.show === undefined) ? true : options.show;

    /**
     * overrides; undo anything the user tried to set they shouldn't have
     */
    options.message = form;

    options.buttons.cancel.callback = options.onEscape = function() {
      return options.callback.call(this, null);
    };

    options.buttons.confirm.callback = function() {
      var value;

      switch (options.inputType) {
        case "text":
        case "textarea":
        case "email":
        case "select":
        case "date":
        case "time":
        case "number":
        case "password":
          value = input.val();
          break;

        case "checkbox":
          var checkedItems = input.find("input:checked");

          // we assume that checkboxes are always multiple,
          // hence we default to an empty array
          value = [];

          each(checkedItems, function(_, item) {
            value.push($(item).val());
          });
          break;
      }

      return options.callback.call(this, value);
    };

    options.show = false;

    // prompt specific validation
    if (!options.title) {
      throw new Error("prompt requires a title");
    }

    if (!$.isFunction(options.callback)) {
      throw new Error("prompt requires a callback");
    }

    if (!templates.inputs[options.inputType]) {
      throw new Error("invalid prompt type");
    }

    // create the input based on the supplied type
    input = $(templates.inputs[options.inputType]);

    switch (options.inputType) {
      case "text":
      case "textarea":
      case "email":
      case "date":
      case "time":
      case "number":
      case "password":
        input.val(options.value);
        break;

      case "select":
        var groups = {};
        inputOptions = options.inputOptions || [];

        if (!$.isArray(inputOptions)) {
          throw new Error("Please pass an array of input options");
        }

        if (!inputOptions.length) {
          throw new Error("prompt with select requires options");
        }

        each(inputOptions, function(_, option) {

          // assume the element to attach to is the input...
          var elem = input;

          if (option.value === undefined || option.text === undefined) {
            throw new Error("given options in wrong format");
          }

          // ... but override that element if this option sits in a group

          if (option.group) {
            // initialise group if necessary
            if (!groups[option.group]) {
              groups[option.group] = $("<optgroup/>").attr("label", option.group);
            }

            elem = groups[option.group];
          }

          elem.append("<option value='" + option.value + "'>" + option.text + "</option>");
        });

        each(groups, function(_, group) {
          input.append(group);
        });

        // safe to set a select's value as per a normal input
        input.val(options.value);
        break;

      case "checkbox":
        var values   = $.isArray(options.value) ? options.value : [options.value];
        inputOptions = options.inputOptions || [];

        if (!inputOptions.length) {
          throw new Error("prompt with checkbox requires options");
        }

        if (!inputOptions[0].value || !inputOptions[0].text) {
          throw new Error("given options in wrong format");
        }

        // checkboxes have to nest within a containing element, so
        // they break the rules a bit and we end up re-assigning
        // our 'input' element to this container instead
        input = $("<div/>");

        each(inputOptions, function(_, option) {
          var checkbox = $(templates.inputs[options.inputType]);

          checkbox.find("input").attr("value", option.value);
          checkbox.find("label").append(option.text);

          // we've ensured values is an array so we can always iterate over it
          each(values, function(_, value) {
            if (value === option.value) {
              checkbox.find("input").prop("checked", true);
            }
          });

          input.append(checkbox);
        });
        break;
    }

    // @TODO provide an attributes option instead
    // and simply map that as keys: vals
    if (options.placeholder) {
      input.attr("placeholder", options.placeholder);
    }

    if (options.pattern) {
      input.attr("pattern", options.pattern);
    }

    if (options.maxlength) {
      input.attr("maxlength", options.maxlength);
    }

    // now place it in our form
    form.append(input);

    form.on("submit", function(e) {
      e.preventDefault();
      // Fix for SammyJS (or similar JS routing library) hijacking the form post.
      e.stopPropagation();
      // @TODO can we actually click *the* button object instead?
      // e.g. buttons.confirm.click() or similar
      dialog.find(".btn-primary").click();
    });

    dialog = exports.dialog(options);

    // clear the existing handler focusing the submit button...
    dialog.off("shown.bs.modal");

    // ...and replace it with one focusing our input, if possible
    dialog.on("shown.bs.modal", function() {
      // need the closure here since input isn't
      // an object otherwise
      input.focus();
    });

    if (shouldShow === true) {
      dialog.modal("show");
    }

    return dialog;
  };

  exports.dialog = function(options) {
    options = sanitize(options);

    var dialog = $(templates.dialog);
    var innerDialog = dialog.find(".modal-dialog");
    var body = dialog.find(".modal-body");
    var buttons = options.buttons;
    var buttonStr = "";
    var callbacks = {
      onEscape: options.onEscape
    };

    if ($.fn.modal === undefined) {
      throw new Error(
        "$.fn.modal is not defined; please double check you have included " +
        "the Bootstrap JavaScript library. See http://getbootstrap.com/javascript/ " +
        "for more details."
      );
    }

    each(buttons, function(key, button) {

      // @TODO I don't like this string appending to itself; bit dirty. Needs reworking
      // can we just build up button elements instead? slower but neater. Then button
      // can just become a template too
      buttonStr += "<button data-bb-handler='" + key + "' type='button' class='btn " + button.className + "'>" + button.label + "</button>";
      callbacks[key] = button.callback;
    });

    body.find(".bootbox-body").html(options.message);

    if (options.animate === true) {
      dialog.addClass("fade");
    }

    if (options.className) {
      dialog.addClass(options.className);
    }

    if (options.size === "large") {
      innerDialog.addClass("modal-lg");
    } else if (options.size === "small") {
      innerDialog.addClass("modal-sm");
    }

    if (options.title) {
      body.before(templates.header);
    }

    if (options.closeButton) {
      var closeButton = $(templates.closeButton);

      if (options.title) {
        dialog.find(".modal-header").prepend(closeButton);
      } else {
        closeButton.css("margin-top", "-10px").prependTo(body);
      }
    }

    if (options.title) {
      dialog.find(".modal-title").html(options.title);
    }

    if (buttonStr.length) {
      body.after(templates.footer);
      dialog.find(".modal-footer").html(buttonStr);
    }


    /**
     * Bootstrap event listeners; used handle extra
     * setup & teardown required after the underlying
     * modal has performed certain actions
     */

    dialog.on("hidden.bs.modal", function(e) {
      // ensure we don't accidentally intercept hidden events triggered
      // by children of the current dialog. We shouldn't anymore now BS
      // namespaces its events; but still worth doing
      if (e.target === this) {
        dialog.remove();
      }
    });

    /*
    dialog.on("show.bs.modal", function() {
      // sadly this doesn't work; show is called *just* before
      // the backdrop is added so we'd need a setTimeout hack or
      // otherwise... leaving in as would be nice
      if (options.backdrop) {
        dialog.next(".modal-backdrop").addClass("bootbox-backdrop");
      }
    });
    */

    dialog.on("shown.bs.modal", function() {
      dialog.find(".btn-primary:first").focus();
    });

    /**
     * Bootbox event listeners; experimental and may not last
     * just an attempt to decouple some behaviours from their
     * respective triggers
     */

    if (options.backdrop !== "static") {
      // A boolean true/false according to the Bootstrap docs
      // should show a dialog the user can dismiss by clicking on
      // the background.
      // We always only ever pass static/false to the actual
      // $.modal function because with `true` we can't trap
      // this event (the .modal-backdrop swallows it)
      // However, we still want to sort of respect true
      // and invoke the escape mechanism instead
      dialog.on("click.dismiss.bs.modal", function(e) {
        // @NOTE: the target varies in >= 3.3.x releases since the modal backdrop
        // moved *inside* the outer dialog rather than *alongside* it
        if (dialog.children(".modal-backdrop").length) {
          e.currentTarget = dialog.children(".modal-backdrop").get(0);
        }

        if (e.target !== e.currentTarget) {
          return;
        }

        dialog.trigger("escape.close.bb");
      });
    }

    dialog.on("escape.close.bb", function(e) {
      if (callbacks.onEscape) {
        processCallback(e, dialog, callbacks.onEscape);
      }
    });

    /**
     * Standard jQuery event listeners; used to handle user
     * interaction with our dialog
     */

    dialog.on("click", ".modal-footer button", function(e) {
      var callbackKey = $(this).data("bb-handler");

      processCallback(e, dialog, callbacks[callbackKey]);
    });

    dialog.on("click", ".bootbox-close-button", function(e) {
      // onEscape might be falsy but that's fine; the fact is
      // if the user has managed to click the close button we
      // have to close the dialog, callback or not
      processCallback(e, dialog, callbacks.onEscape);
    });

    dialog.on("keyup", function(e) {
      if (e.which === 27) {
        dialog.trigger("escape.close.bb");
      }
    });

    // the remainder of this method simply deals with adding our
    // dialogent to the DOM, augmenting it with Bootstrap's modal
    // functionality and then giving the resulting object back
    // to our caller

    $(options.container).append(dialog);

    dialog.modal({
      backdrop: options.backdrop ? "static": false,
      keyboard: false,
      show: false
    });

    if (options.show) {
      dialog.modal("show");
    }

    // @TODO should we return the raw element here or should
    // we wrap it in an object on which we can expose some neater
    // methods, e.g. var d = bootbox.alert(); d.hide(); instead
    // of d.modal("hide");

   /*
    function BBDialog(elem) {
      this.elem = elem;
    }

    BBDialog.prototype = {
      hide: function() {
        return this.elem.modal("hide");
      },
      show: function() {
        return this.elem.modal("show");
      }
    };
    */

    return dialog;

  };

  exports.setDefaults = function() {
    var values = {};

    if (arguments.length === 2) {
      // allow passing of single key/value...
      values[arguments[0]] = arguments[1];
    } else {
      // ... and as an object too
      values = arguments[0];
    }

    $.extend(defaults, values);
  };

  exports.hideAll = function() {
    $(".bootbox").modal("hide");

    return exports;
  };


  /**
   * standard locales. Please add more according to ISO 639-1 standard. Multiple language variants are
   * unlikely to be required. If this gets too large it can be split out into separate JS files.
   */
  var locales = {
    bg_BG : {
      OK      : "Ок",
      CANCEL  : "Отказ",
      CONFIRM : "Потвърждавам"
    },
    br : {
      OK      : "OK",
      CANCEL  : "Cancelar",
      CONFIRM : "Sim"
    },
    cs : {
      OK      : "OK",
      CANCEL  : "Zrušit",
      CONFIRM : "Potvrdit"
    },
    da : {
      OK      : "OK",
      CANCEL  : "Annuller",
      CONFIRM : "Accepter"
    },
    de : {
      OK      : "OK",
      CANCEL  : "Abbrechen",
      CONFIRM : "Akzeptieren"
    },
    el : {
      OK      : "Εντάξει",
      CANCEL  : "Ακύρωση",
      CONFIRM : "Επιβεβαίωση"
    },
    en : {
      OK      : "OK",
      CANCEL  : "Cancel",
      CONFIRM : "OK"
    },
    es : {
      OK      : "OK",
      CANCEL  : "Cancelar",
      CONFIRM : "Aceptar"
    },
    et : {
      OK      : "OK",
      CANCEL  : "Katkesta",
      CONFIRM : "OK"
    },
    fa : {
      OK      : "قبول",
      CANCEL  : "لغو",
      CONFIRM : "تایید"
    },
    fi : {
      OK      : "OK",
      CANCEL  : "Peruuta",
      CONFIRM : "OK"
    },
    fr : {
      OK      : "OK",
      CANCEL  : "Annuler",
      CONFIRM : "D'accord"
    },
    he : {
      OK      : "אישור",
      CANCEL  : "ביטול",
      CONFIRM : "אישור"
    },
    hu : {
      OK      : "OK",
      CANCEL  : "Mégsem",
      CONFIRM : "Megerősít"
    },
    hr : {
      OK      : "OK",
      CANCEL  : "Odustani",
      CONFIRM : "Potvrdi"
    },
    id : {
      OK      : "OK",
      CANCEL  : "Batal",
      CONFIRM : "OK"
    },
    it : {
      OK      : "OK",
      CANCEL  : "Annulla",
      CONFIRM : "Conferma"
    },
    ja : {
      OK      : "OK",
      CANCEL  : "キャンセル",
      CONFIRM : "確認"
    },
    lt : {
      OK      : "Gerai",
      CANCEL  : "Atšaukti",
      CONFIRM : "Patvirtinti"
    },
    lv : {
      OK      : "Labi",
      CANCEL  : "Atcelt",
      CONFIRM : "Apstiprināt"
    },
    nl : {
      OK      : "OK",
      CANCEL  : "Annuleren",
      CONFIRM : "Accepteren"
    },
    no : {
      OK      : "OK",
      CANCEL  : "Avbryt",
      CONFIRM : "OK"
    },
    pl : {
      OK      : "OK",
      CANCEL  : "Anuluj",
      CONFIRM : "Potwierdź"
    },
    pt : {
      OK      : "OK",
      CANCEL  : "Cancelar",
      CONFIRM : "Confirmar"
    },
    ru : {
      OK      : "OK",
      CANCEL  : "Отмена",
      CONFIRM : "Применить"
    },
    sq : {
      OK : "OK",
      CANCEL : "Anulo",
      CONFIRM : "Prano"
    },
    sv : {
      OK      : "OK",
      CANCEL  : "Avbryt",
      CONFIRM : "OK"
    },
    th : {
      OK      : "ตกลง",
      CANCEL  : "ยกเลิก",
      CONFIRM : "ยืนยัน"
    },
    tr : {
      OK      : "Tamam",
      CANCEL  : "İptal",
      CONFIRM : "Onayla"
    },
    zh_CN : {
      OK      : "OK",
      CANCEL  : "取消",
      CONFIRM : "确认"
    },
    zh_TW : {
      OK      : "OK",
      CANCEL  : "取消",
      CONFIRM : "確認"
    }
  };

  exports.addLocale = function(name, values) {
    $.each(["OK", "CANCEL", "CONFIRM"], function(_, v) {
      if (!values[v]) {
        throw new Error("Please supply a translation for '" + v + "'");
      }
    });

    locales[name] = {
      OK: values.OK,
      CANCEL: values.CANCEL,
      CONFIRM: values.CONFIRM
    };

    return exports;
  };

  exports.removeLocale = function(name) {
    delete locales[name];

    return exports;
  };

  exports.setLocale = function(name) {
    return exports.setDefaults("locale", name);
  };

  exports.init = function(_$) {
    return init(_$ || $);
  };

  return exports;
}));


function checkImageSizes(images, deep, cb) {
    //console.log('checkImageSizes');

    var images = images || gJ.images;
    var imagesLength = images.length;
    // if 'images' is not an array, but an object:
    if (!imagesLength) {
        var imageKeys = Object.keys(images);
        imagesLength = imageKeys.length;
    };
    var sizesLength = gJ.sizes.length;
    // deep true = request image from server
    var deep = deep ? true : false;
    //deep = true;
    var id = 0;
    var sz = 0;

    function checkImage() {
        //console.log('checkImage');
        if (id < imagesLength) {
            var image = images[imageKeys[id]];
            var folder = image.folder;
            //console.log('checkImageSizeFolder: ' + folder);

            if (sz < sizesLength) {
                var sizeId = folder + '_' + gJ.sizes[sz] + image.file;
                var path = '.'+options.galleryPath + folder + '_' + gJ.sizes[sz] + '/' + image.file;
                console.log(path);

                // deep: request each image from server
                if (deep) {
                    fileExists(path)
                        .done(function() {
                            //console.log(path + ' does deep exist');
                        })
                        .fail(function() {
                            //console.log(path + ' does not deep exist');
                            if (stat.imagesNotProcessed.indexOf(imageKeys[id]) === -1) {
                                stat.imagesNotProcessed.push(imageKeys[id]);
                            }
                            //stat.imagesNotProcessed = stat.imagesNotProcessed.unique();
                        })
                        .always(function() {
                            sz++;
                            checkImage();
                        });

                    return false;
                }

                // quick check against all images in stat.allImages:
                if (!stat.allImages[sizeId]) {
                    //console.log(sizeId + ' does not exist');
                    stat.imagesNotProcessed.push(id);
                    stat.imagesNotProcessed = stat.imagesNotProcessed.unique();
                }
                sz++;
                checkImage();

            } else {
                sz = 0;
                id++;
                checkImage();
            }

        } else {
            //console.log("check image done");
            if (cb) {
                cb();
            }
        }
    };

    // initial call:
    checkImage();
};

function getAllImages(data) {
    // deep = if true, include thumbnail folders;
    var i = 0;
    var si = 0;
    var deep = data && data.deep ? data.deep : false
    var tmpFolderImages = [];
//    var allImagesFromServer = {};
    var sourceFolder = stat.allFolders[0];

    function getImages() {

        var folder = stat.allFolders[i];
        stat.workingFolder = folder;

        imagesFromFolder(sourceFolder).done(function(data) {
            var ol = 0;
            if (data) {
                ol = Object.keys(data).length;
                for (var key in data) {
                    stat.existingImages[key] = data[key];
                }
            }
            tmpFolderImages[folder] = [ol, 0, 0];
        }).fail(function() {
            //console.log('imagesFromFolder fail');
        }).always(function() {
            // si = 0 == base folder, without thumbnails
            if (si === 0) {
                // getNewImages();
                // getRemovedImages();
            }

            // deep === true => check thumbnail-folders
            if (deep && si < options.sizes.length) {
                sourceFolder = folder + '_' + options.sizes[si];
                si++;
                getImages();
            } else {
                // we now have all images from this folder
                //checkImageSizes();

                // Done! Next folder...
                i++;
                if (i < stat.allFolders.length) {
                    si = 0;
                    sourceFolder = stat.allFolders[i];
                    getImages();
                } else {
                    stat.folderImages = tmpFolderImages;
                    if (data && data.cb) {
                        data.cb();
                    }
                }
            }
        });
    };

    getImages();
};
;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.sortable = factory();
  }
}(this, function() {
/*
 * HTML5 Sortable library
 * https://github.com/voidberg/html5sortable
 *
 * Original code copyright 2012 Ali Farhadi.
 * This version is mantained by Alexandru Badiu <andu@ctrlz.ro> & Lukas Oppermann <lukas@vea.re>
 * jQuery-independent implementation by Nazar Mokrynskyi <nazar@mokrynskyi.com>
 *
 * Released under the MIT license.
 */
'use strict';
/*
 * variables global to the plugin
 */
var dragging;
var draggingHeight;
var placeholders = [];
var sortables = [];
/**
 * Get or set data on element
 * @param {Element} element
 * @param {string} key
 * @param {*} value
 * @return {*}
 */
var _data = function(element, key, value) {
  if (value === undefined) {
    return element && element.h5s && element.h5s.data && element.h5s.data[key];
  } else {
    element.h5s = element.h5s || {};
    element.h5s.data = element.h5s.data || {};
    element.h5s.data[key] = value;
  }
};
/**
 * Remove data from element
 * @param {Element} element
 */
var _removeData = function(element) {
  if (element.h5s) {
    delete element.h5s.data;
  }
};
/**
 * Cross-browser shortcut for actual `Element.matches` method,
 * which has vendor prefix in older browsers
 */
var matches;
switch (true) {
  case 'matches' in window.Element.prototype:
    matches = 'matches';
    break;
  case 'mozMatchesSelector' in window.Element.prototype:
    matches = 'mozMatchesSelector';
    break;
  case 'msMatchesSelector' in window.Element.prototype:
    matches = 'msMatchesSelector';
    break;
  case 'webkitMatchesSelector' in window.Element.prototype:
    matches = 'webkitMatchesSelector';
    break;
}
/**
 * Filter only wanted nodes
 * @param {Array|NodeList} nodes
 * @param {Array/string} wanted
 * @returns {Array}
 */
var _filter = function(nodes, wanted) {
  if (!wanted) {
    return Array.prototype.slice.call(nodes);
  }
  var result = [];
  for (var i = 0; i < nodes.length; ++i) {
    if (typeof wanted === 'string' && nodes[i][matches](wanted)) {
      result.push(nodes[i]);
    }
    if (wanted.indexOf(nodes[i]) !== -1) {
      result.push(nodes[i]);
    }
  }
  return result;
};
/**
 * @param {Array|Element} element
 * @param {Array|string} event
 * @param {Function} callback
 */
var _on = function(element, event, callback) {
  if (element instanceof Array) {
    for (var i = 0; i < element.length; ++i) {
      _on(element[i], event, callback);
    }
    return;
  }
  element.addEventListener(event, callback);
  element.h5s = element.h5s || {};
  element.h5s.events = element.h5s.events || {};
  element.h5s.events[event] = callback;
};
/**
 * @param {Array|Element} element
 * @param {Array|string} event
 */
var _off = function(element, event) {
  if (element instanceof Array) {
    for (var i = 0; i < element.length; ++i) {
      _off(element[i], event);
    }
    return;
  }
  if (element.h5s && element.h5s.events && element.h5s.events[event]) {
    element.removeEventListener(event, element.h5s.events[event]);
    delete element.h5s.events[event];
  }
};
/**
 * @param {Array|Element} element
 * @param {string} attribute
 * @param {*} value
 */
var _attr = function(element, attribute, value) {
  if (element instanceof Array) {
    for (var i = 0; i < element.length; ++i) {
      _attr(element[i], attribute, value);
    }
    return;
  }
  element.setAttribute(attribute, value);
};
/**
 * @param {Array|Element} element
 * @param {string} attribute
 */
var _removeAttr = function(element, attribute) {
  if (element instanceof Array) {
    for (var i = 0; i < element.length; ++i) {
      _removeAttr(element[i], attribute);
    }
    return;
  }
  element.removeAttribute(attribute);
};
/**
 * @param {Element} element
 * @returns {{left: *, top: *}}
 */
var _offset = function(element) {
  var rect = element.getClientRects()[0];
  return {
    left: rect.left + window.scrollX,
    top: rect.top + window.scrollY
  };
};
/*
 * remove event handlers from items
 * @param {Array|NodeList} items
 */
var _removeItemEvents = function(items) {
  _off(items, 'dragstart');
  _off(items, 'dragend');
  _off(items, 'selectstart');
  _off(items, 'dragover');
  _off(items, 'dragenter');
  _off(items, 'drop');
};
/*
 * Remove event handlers from sortable
 * @param {Element} sortable a single sortable
 */
var _removeSortableEvents = function(sortable) {
  _off(sortable, 'dragover');
  _off(sortable, 'dragenter');
  _off(sortable, 'drop');
};
/*
 * Attach ghost to dataTransfer object
 * @param {Event} original event
 * @param {object} ghost-object with item, x and y coordinates
 */
var _attachGhost = function(event, ghost) {
  // this needs to be set for HTML5 drag & drop to work
  event.dataTransfer.effectAllowed = 'move';
  event.dataTransfer.setData('text', '');

  // check if setDragImage method is available
  if (event.dataTransfer.setDragImage) {
    event.dataTransfer.setDragImage(ghost.draggedItem, ghost.x, ghost.y);
  }
};
/**
 * _addGhostPos clones the dragged item and adds it as a Ghost item
 * @param {Event} event - the event fired when dragstart is triggered
 * @param {object} ghost - .draggedItem = Element
 */
var _addGhostPos = function(event, ghost) {
  if (!ghost.x) {
    ghost.x = parseInt(event.pageX - _offset(ghost.draggedItem).left);
  }
  if (!ghost.y) {
    ghost.y = parseInt(event.pageY - _offset(ghost.draggedItem).top);
  }
  return ghost;
};
/**
 * _makeGhost decides which way to make a ghost and passes it to attachGhost
 * @param {Element} draggedItem - the item that the user drags
 */
var _makeGhost = function(draggedItem) {
  return {
    draggedItem: draggedItem
  };
};
/**
 * _getGhost constructs ghost and attaches it to dataTransfer
 * @param {Event} event - the original drag event object
 * @param {Element} draggedItem - the item that the user drags
 */
// TODO: could draggedItem be replaced by event.target in all instances
var _getGhost = function(event, draggedItem) {
  // add ghost item & draggedItem to ghost object
  var ghost = _makeGhost(draggedItem);
  // attach ghost position
  ghost = _addGhostPos(event, ghost);
  // attach ghost to dataTransfer
  _attachGhost(event, ghost);
};
/*
 * Remove data from sortable
 * @param {Element} sortable a single sortable
 */
var _removeSortableData = function(sortable) {
  _removeData(sortable);
  _removeAttr(sortable, 'aria-dropeffect');
};
/*
 * Remove data from items
 * @param {Array|Element} items
 */
var _removeItemData = function(items) {
  _removeAttr(items, 'aria-grabbed');
  _removeAttr(items, 'draggable');
  _removeAttr(items, 'role');
};
/*
 * Check if two lists are connected
 * @param {Element} curList
 * @param {Element} destList
 */
var _listsConnected = function(curList, destList) {
  if (curList === destList) {
    return true;
  }
  if (_data(curList, 'connectWith') !== undefined) {
    return _data(curList, 'connectWith') === _data(destList, 'connectWith');
  }
  return false;
};
var _getHandles = function(items, handle) {
  var result = [];
  var handles;
  if (!handle) {
    return items;
  }
  for (var i = 0; i < items.length; ++i) {
    handles = items[i].querySelectorAll(handle);
    result = result.concat(Array.prototype.slice.call(handles));
  }
  return result;
};
/*
 * Destroy the sortable
 * @param {Element} sortableElement a single sortable
 */
var _destroySortable = function(sortableElement) {
  var opts = _data(sortableElement, 'opts') || {};
  var items = _filter(sortableElement.children, opts.items);
  var handles = _getHandles(items, opts.handle);
  // remove event handlers & data from sortable
  _removeSortableEvents(sortableElement);
  _removeSortableData(sortableElement);
  // remove event handlers & data from items
  _off(handles, 'mousedown');
  _removeItemEvents(items);
  _removeItemData(items);
};
/*
 * Enable the sortable
 * @param {Element} sortableElement a single sortable
 */
var _enableSortable = function(sortableElement) {
  var opts = _data(sortableElement, 'opts');
  var items = _filter(sortableElement.children, opts.items);
  var handles = _getHandles(items, opts.handle);
  _attr(sortableElement, 'aria-dropeffect', 'move');
  _attr(handles, 'draggable', 'true');
  // IE FIX for ghost
  // can be disabled as it has the side effect that other events
  // (e.g. click) will be ignored
  var spanEl = (document || window.document).createElement('span');
  if (typeof spanEl.dragDrop === 'function' && !opts.disableIEFix) {
    _on(handles, 'mousedown', function() {
      if (items.indexOf(this) !== -1) {
        this.dragDrop();
      } else {
        var parent = this.parentElement;
        while (items.indexOf(parent) === -1) {
          parent = parent.parentElement;
        }
        parent.dragDrop();
      }
    });
  }
};
/*
 * Disable the sortable
 * @param {Element} sortableElement a single sortable
 */
var _disableSortable = function(sortableElement) {
  var opts = _data(sortableElement, 'opts');
  var items = _filter(sortableElement.children, opts.items);
  var handles = _getHandles(items, opts.handle);
  _attr(sortableElement, 'aria-dropeffect', 'none');
  _attr(handles, 'draggable', 'false');
  _off(handles, 'mousedown');
};
/*
 * Reload the sortable
 * @param {Element} sortableElement a single sortable
 * @description events need to be removed to not be double bound
 */
var _reloadSortable = function(sortableElement) {
  var opts = _data(sortableElement, 'opts');
  var items = _filter(sortableElement.children, opts.items);
  var handles = _getHandles(items, opts.handle);
  // remove event handlers from items
  _removeItemEvents(items);
  _off(handles, 'mousedown');
  // remove event handlers from sortable
  _removeSortableEvents(sortableElement);
};
/**
 * Get position of the element relatively to its sibling elements
 * @param {Element} element
 * @returns {number}
 */
var _index = function(element) {
  if (!element.parentElement) {
    return 0;
  }
  return Array.prototype.indexOf.call(element.parentElement.children, element);
};
/**
 * Whether element is in DOM
 * @param {Element} element
 * @returns {boolean}
 */
var _attached = function(element) {
  return !!element.parentNode;
};
/**
 * Convert HTML string into DOM element
 * @param {Element|string} html
 * @returns {Element}
 */
var _html2element = function(html) {
  if (typeof html !== 'string') {
    return html;
  }
  var div = document.createElement('div');
  div.innerHTML	= html;
  return div.firstChild;
};
/**
 * Insert before target
 * @param {Element} target
 * @param {Element} element
 */
var _before = function(target, element) {
  target.parentElement.insertBefore(
    element,
    target
  );
};
/**
 * Insert after target
 * @param {Element} target
 * @param {Element} element
 */
var _after = function(target, element) {
  target.parentElement.insertBefore(
    element,
    target.nextElementSibling
  );
};
/**
 * Detach element from DOM
 * @param {Element} element
 */
var _detach = function(element) {
  if (element.parentNode) {
    element.parentNode.removeChild(element);
  }
};
/**
 * Make native event that can be dispatched afterwards
 * @param {string} name
 * @param {object} detail
 * @returns {CustomEvent}
 */
var _makeEvent = function(name, detail) {
  var e = document.createEvent('Event');
  if (detail) {
    e.detail = detail;
  }
  e.initEvent(name, false, true);
  return e;
};
/**
 * @param {Element} sortableElement
 * @param {CustomEvent} event
 */
var _dispatchEventOnConnected = function(sortableElement, event) {
  sortables.forEach(function(target) {
    if (_listsConnected(sortableElement, target)) {
      target.dispatchEvent(event);
    }
  });
};
/*
 * Public sortable object
 * @param {Array|NodeList} sortableElements
 * @param {object|string} options|method
 */
var sortable = function(sortableElements, options) {

  var method = String(options);

  options = (function(options) {
    var result = {
      connectWith: false,
      placeholder: null,
      // dragImage can be null or a Element
      dragImage: null,
      disableIEFix: false,
      placeholderClass: 'sortable-placeholder',
      draggingClass: 'sortable-dragging',
      hoverClass: false
    };
    for (var option in options) {
      result[option] = options[option];
    }
    return result;
  })(options);

  if (typeof sortableElements === 'string') {
    sortableElements = document.querySelectorAll(sortableElements);
  }

  if (sortableElements instanceof window.Element) {
    sortableElements = [sortableElements];
  }

  sortableElements = Array.prototype.slice.call(sortableElements);

  /* TODO: maxstatements should be 25, fix and remove line below */
  /*jshint maxstatements:false */
  sortableElements.forEach(function(sortableElement) {

    if (/enable|disable|destroy/.test(method)) {
      sortable[method](sortableElement);
      return;
    }

    // get options & set options on sortable
    options = _data(sortableElement, 'opts') || options;
    _data(sortableElement, 'opts', options);
    // reset sortable
    _reloadSortable(sortableElement);
    // initialize
    var items = _filter(sortableElement.children, options.items);
    var index;
    var startParent;
    var placeholder = options.placeholder;
    if (!placeholder) {
      placeholder = document.createElement(
        /^ul|ol$/i.test(sortableElement.tagName) ? 'li' : 'div'
      );
    }
    placeholder = _html2element(placeholder);
    placeholder.classList.add.apply(
      placeholder.classList,
      options.placeholderClass.split(' ')
    );

    // setup sortable ids
    if (!sortableElement.getAttribute('data-sortable-id')) {
      var id = sortables.length;
      sortables[id] = sortableElement;
      _attr(sortableElement, 'data-sortable-id', id);
      _attr(items, 'data-item-sortable-id', id);
    }

    _data(sortableElement, 'items', options.items);
    placeholders.push(placeholder);
    if (options.connectWith) {
      _data(sortableElement, 'connectWith', options.connectWith);
    }

    _enableSortable(sortableElement);
    _attr(items, 'role', 'option');
    _attr(items, 'aria-grabbed', 'false');

    // Mouse over class
    if (options.hoverClass) {
      var hoverClass = 'sortable-over';
      if (typeof options.hoverClass === 'string') {
        hoverClass = options.hoverClass;
      }

      _on(items, 'mouseenter', function() {
        this.classList.add(hoverClass);
      });
      _on(items, 'mouseleave', function() {
        this.classList.remove(hoverClass);
      });
    }

    // Handle drag events on draggable items
    _on(items, 'dragstart', function(e) {
      e.stopImmediatePropagation();

      if (options.dragImage) {
        _attachGhost(e, {
          draggedItem: options.dragImage,
          x: 0,
          y: 0
        });
        console.log('WARNING: dragImage option is deprecated' +
        ' and will be removed in the future!');
      } else {
        // add transparent clone or other ghost to cursor
        _getGhost(e, this);
      }
      // cache selsection & add attr for dragging
      this.classList.add(options.draggingClass);
      dragging = this;
      _attr(dragging, 'aria-grabbed', 'true');
      // grab values
      index = _index(dragging);
      draggingHeight = parseInt(window.getComputedStyle(dragging).height);
      startParent = this.parentElement;
      // dispatch sortstart event on each element in group
      _dispatchEventOnConnected(sortableElement, _makeEvent('sortstart', {
        item: dragging,
        placeholder: placeholder,
        startparent: startParent
      }));
    });
    // Handle drag events on draggable items
    _on(items, 'dragend', function() {
      var newParent;
      if (!dragging) {
        return;
      }
      // remove dragging attributes and show item
      dragging.classList.remove(options.draggingClass);
      _attr(dragging, 'aria-grabbed', 'false');
      dragging.style.display = dragging.oldDisplay;
      delete dragging.oldDisplay;

      placeholders.forEach(_detach);
      newParent = this.parentElement;
      _dispatchEventOnConnected(sortableElement, _makeEvent('sortstop', {
        item: dragging,
        startparent: startParent
      }));
      if (index !== _index(dragging) || startParent !== newParent) {
        _dispatchEventOnConnected(sortableElement, _makeEvent('sortupdate', {
          item: dragging,
          index: _filter(newParent.children, _data(newParent, 'items'))
            .indexOf(dragging),
          oldindex: items.indexOf(dragging),
          elementIndex: _index(dragging),
          oldElementIndex: index,
          startparent: startParent,
          endparent: newParent
        }));
      }
      dragging = null;
      draggingHeight = null;
    });
    // Handle drop event on sortable & placeholder
    // TODO: REMOVE placeholder?????
    _on([sortableElement, placeholder], 'drop', function(e) {
      var visiblePlaceholder;
      if (!_listsConnected(sortableElement, dragging.parentElement)) {
        return;
      }

      e.preventDefault();
      e.stopPropagation();
      visiblePlaceholder = placeholders.filter(_attached)[0];
      _after(visiblePlaceholder, dragging);
      dragging.dispatchEvent(_makeEvent('dragend'));
    });

    // Handle dragover and dragenter events on draggable items
    var onDragOverEnter = function(e) {
      if (!_listsConnected(sortableElement, dragging.parentElement)) {
        return;
      }

      e.preventDefault();
      e.stopPropagation();
      e.dataTransfer.dropEffect = 'move';
      if (items.indexOf(this) !== -1) {
        var thisHeight = parseInt(window.getComputedStyle(this).height);
        var placeholderIndex = _index(placeholder);
        var thisIndex = _index(this);
        if (options.forcePlaceholderSize) {
          placeholder.style.height = draggingHeight + 'px';
        }

        // Check if `this` is bigger than the draggable. If it is, we have to define a dead zone to prevent flickering
        if (thisHeight > draggingHeight) {
          // Dead zone?
          var deadZone = thisHeight - draggingHeight;
          var offsetTop = _offset(this).top;
          if (placeholderIndex < thisIndex &&
              e.pageY < offsetTop + deadZone) {
            return;
          }
          if (placeholderIndex > thisIndex &&
              e.pageY > offsetTop + thisHeight - deadZone) {
            return;
          }
        }

        if (dragging.oldDisplay === undefined) {
          dragging.oldDisplay = dragging.style.display;
        }
        dragging.style.display = 'none';
        if (placeholderIndex < thisIndex) {
          _after(this, placeholder);
        } else {
          _before(this, placeholder);
        }
        // Intentionally violated chaining, it is more complex otherwise
        placeholders
          .filter(function(element) {return element !== placeholder;})
          .forEach(_detach);
      } else {
        if (placeholders.indexOf(this) === -1 &&
            !_filter(this.children, options.items).length) {
          placeholders.forEach(_detach);
          this.appendChild(placeholder);
        }
      }
    };
    _on(items.concat(sortableElement), 'dragover', onDragOverEnter);
    _on(items.concat(sortableElement), 'dragenter', onDragOverEnter);
  });

  return sortableElements;
};

sortable.destroy = function(sortableElement) {
  _destroySortable(sortableElement);
};

sortable.enable = function(sortableElement) {
  _enableSortable(sortableElement);
};

sortable.disable = function(sortableElement) {
  _disableSortable(sortableElement);
};


return sortable;
}));

var loggedin = function() {
    var loginCookie = document.cookie.split('=')[1];
    return (loginCookie) ? true : false;
};

function checkLoggedin() {
    if (!loggedin) {

    }
};

function requestLogin(postdata) {
    var request = new XMLHttpRequest();
    request.open('POST', 'login.php', true);
    request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

    request.onload = function(data) {
        if (request.status >= 200 && request.status < 400) {
            loggedin = data;
           //console.log(data);
            if (loggedin) {
                // tba
            }
        } else {
           //console.log("nope");
        }
    };

    request.onerror = function() {
       //console.log("connection error");
    };

    request.send(postdata);
};

//console.log(checkLoggedin());

/*
document.getElementById('inputRememberme').onclick = function(e) {
	e.stopImmediatePropagation();
	var element = (e.currentTarget.htmlFor !== undefined) ? e.currentTarget.htmlFor : e.currentTarget;
	var checked = (element.checked) ? false : true;
	element.checked = (checked) ? false : checked.toString();
};
*/

function initLogin() {
    // Attach a submit handler to the form
    document.getElementById('loginSubmit').onclick = function(e) {

       //console.log("submit");
        // Stop form from submitting normally
        e.preventDefault();

        var username = document.getElementById('inputUsername').value;
        var password = document.getElementById('inputPassword').value;
        var rememberme = 'off';
        if (document.getElementById('inputRememberme').checked) {
            rememberme = 'on';
        }

        var postdata = "username=" + username + "&password=" + password + "&rememberme=" + rememberme;
        //username=&password=&rememberme=on&depth=5
       //console.log("postdata: " + postdata);

        // Send the data using post
        requestLogin(postdata)

        /*
        $.ajax({
            type: "POST",
            url: "login.php",
            data: postdata,
            success: function(data) {
                console.log("data: " + data);
            }
        })
        */
    };
}

function processImages() {

    loader();

    $('#allImagesButton').off('click').text('resize ' + imagesAdded.length + ' image/s').on('click', function() {

        window.ri = 0;
        var data = imagesFromFolderData;
        var keys = imagesAdded;
        var length = 0;
        if (keys) {
            var length = keys.length;
        }
        resizeStoreSync(data, keys, length, folder);

    });

    processImages();
    //loader('off');

};

function resizeStoreSync(data, keys, length, folder) {

    if (window.ri < length) {
        var key = keys[window.ri];
        var val = data[key];
        var folder = val.folder;
        var file = val.file;

        resizeStore(folder, file).done(function(resizeData) {
            window.ri++;

            // add images to gJ
            gJ.images[key] = data[key];

            resizeStoreSync();
        });
    }
};
function processNewFolders(cb) {

    loader();

    if (stat.newFolders.length === 0) {
        return false;
    }

    processNewFolder({
        'folder': stat.newFolders[0],
        'cb': function() {
            if (stat.newFolders.length > 0) {
                // if there are new folders left, do it again...
                processNewFolders();

            } else {

                if (cb) {
                    cb();
                }
            }
        }
    });
};

function processNewFolder(d) {
   //console.log("processNewFolder()");

    var folder = d ? d.folder : stat.workingFolder;

    // read images from folder:
    imagesFromFolder(folder).done(function(imagesFromFolderData) {
        // error:
        var er = false;

        if (imagesFromFolderData) {
            var keys = Object.keys(imagesFromFolderData);
            var kLength = keys.length;
        } else {
            // somethings wrong with the response, so error = true
            er = true;
        }

        if (er || kLength < 1) {
           //console.log("no images");
            stat.newImages = [];
						// callback:
            if (d.cb) {
                d.cb();
            }
            //stat.newFolders = _.without(stat.newFolders, folder);
            return false;
        }

        stat.newImages = keys;

        var i = 0;

        function resizeStoreSync() {

            if (i < kLength) {
                //var key = keys[i];
                var key = stat.newImages[0];
                var val = imagesFromFolderData[key];
                var folder = val.folder;
                var file = val.file;

                stat.workingImage = file;

                var resizeStoreSizes = new _resizeStoreSizes(folder, file);
                resizeStoreSizes.done(function() {
                    // add images to gJ
                    //stat.newImages = _.without(stat.newImages, key);
                    stat.newImages = arrayWithout(stat.newImages, [key])
                    gJ.images[key] = imagesFromFolderData[key];
                    i++;
                    resizeStoreSync();
                });

                // add folder to known folders
                if (gJ.folders.indexOf(folder) === -1) {
                    gJ.folders.push(folder);
                }

            } else {
                // all files from folder processed
                if (d.cb) {
                    d.cb();
                }
            }
        }; // <-- end resizeStoreSync

        resizeStoreSync();

        // ...and remove from stat.newFolders
        //stat.newFolders = _.without(stat.newFolders, folder);
        stat.newFolders = arrayWithout(stat.newFolders, [folder]);

    }).fail(function(){
        //stat.newFolders = _.without(stat.newFolders, folder);
        stat.newFolders = arrayWithout(stat.newFolders, [folder]);
       //console.log("images from folder error");
    });
    // <-- end images from folder function

    fnf++;

};
/*! rangeslider.js - v2.2.1 | (c) 2016 @andreruffert | MIT license | https://github.com/andreruffert/rangeslider.js */
(function(factory) {
    'use strict';

    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['jquery'], factory);
    } else if (typeof exports === 'object') {
        // CommonJS
        module.exports = factory(require('jquery'));
    } else {
        // Browser globals
        factory(jQuery);
    }
}(function($) {
    'use strict';

    // Polyfill Number.isNaN(value)
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isNaN
    Number.isNaN = Number.isNaN || function(value) {
        return typeof value === 'number' && value !== value;
    };

    /**
     * Range feature detection
     * @return {Boolean}
     */
    function supportsRange() {
        var input = document.createElement('input');
        input.setAttribute('type', 'range');
        return input.type !== 'text';
    }

    var pluginName = 'rangeslider',
        pluginIdentifier = 0,
        hasInputRangeSupport = supportsRange(),
        defaults = {
            polyfill: true,
            orientation: 'horizontal',
            rangeClass: 'rangeslider',
            disabledClass: 'rangeslider--disabled',
            horizontalClass: 'rangeslider--horizontal',
            verticalClass: 'rangeslider--vertical',
            fillClass: 'rangeslider__fill',
            handleClass: 'rangeslider__handle',
            startEvent: ['mousedown', 'touchstart', 'pointerdown'],
            moveEvent: ['mousemove', 'touchmove', 'pointermove'],
            endEvent: ['mouseup', 'touchend', 'pointerup']
        },
        constants = {
            orientation: {
                horizontal: {
                    dimension: 'width',
                    direction: 'left',
                    directionStyle: 'left',
                    coordinate: 'x'
                },
                vertical: {
                    dimension: 'height',
                    direction: 'top',
                    directionStyle: 'bottom',
                    coordinate: 'y'
                }
            }
        };

    /**
     * Delays a function for the given number of milliseconds, and then calls
     * it with the arguments supplied.
     *
     * @param  {Function} fn   [description]
     * @param  {Number}   wait [description]
     * @return {Function}
     */
    function delay(fn, wait) {
        var args = Array.prototype.slice.call(arguments, 2);
        return setTimeout(function(){ return fn.apply(null, args); }, wait);
    }

    /**
     * Returns a debounced function that will make sure the given
     * function is not triggered too much.
     *
     * @param  {Function} fn Function to debounce.
     * @param  {Number}   debounceDuration OPTIONAL. The amount of time in milliseconds for which we will debounce the function. (defaults to 100ms)
     * @return {Function}
     */
    function debounce(fn, debounceDuration) {
        debounceDuration = debounceDuration || 100;
        return function() {
            if (!fn.debouncing) {
                var args = Array.prototype.slice.apply(arguments);
                fn.lastReturnVal = fn.apply(window, args);
                fn.debouncing = true;
            }
            clearTimeout(fn.debounceTimeout);
            fn.debounceTimeout = setTimeout(function(){
                fn.debouncing = false;
            }, debounceDuration);
            return fn.lastReturnVal;
        };
    }

    /**
     * Check if a `element` is visible in the DOM
     *
     * @param  {Element}  element
     * @return {Boolean}
     */
    function isHidden(element) {
        return (
            element && (
                element.offsetWidth === 0 ||
                element.offsetHeight === 0 ||
                // Also Consider native `<details>` elements.
                element.open === false
            )
        );
    }

    /**
     * Get hidden parentNodes of an `element`
     *
     * @param  {Element} element
     * @return {[type]}
     */
    function getHiddenParentNodes(element) {
        var parents = [],
            node    = element.parentNode;

        while (isHidden(node)) {
            parents.push(node);
            node = node.parentNode;
        }
        return parents;
    }

    /**
     * Returns dimensions for an element even if it is not visible in the DOM.
     *
     * @param  {Element} element
     * @param  {String}  key     (e.g. offsetWidth …)
     * @return {Number}
     */
    function getDimension(element, key) {
        var hiddenParentNodes       = getHiddenParentNodes(element),
            hiddenParentNodesLength = hiddenParentNodes.length,
            inlineStyle             = [],
            dimension               = element[key];

        // Used for native `<details>` elements
        function toggleOpenProperty(element) {
            if (typeof element.open !== 'undefined') {
                element.open = (element.open) ? false : true;
            }
        }

        if (hiddenParentNodesLength) {
            for (var i = 0; i < hiddenParentNodesLength; i++) {

                // Cache style attribute to restore it later.
                inlineStyle[i] = hiddenParentNodes[i].style.cssText;

                // visually hide
                if (hiddenParentNodes[i].style.setProperty) {
                    hiddenParentNodes[i].style.setProperty('display', 'block', 'important');
                } else {
                    hiddenParentNodes[i].style.cssText += ';display: block !important';
                }
                hiddenParentNodes[i].style.height = '0';
                hiddenParentNodes[i].style.overflow = 'hidden';
                hiddenParentNodes[i].style.visibility = 'hidden';
                toggleOpenProperty(hiddenParentNodes[i]);
            }

            // Update dimension
            dimension = element[key];

            for (var j = 0; j < hiddenParentNodesLength; j++) {

                // Restore the style attribute
                hiddenParentNodes[j].style.cssText = inlineStyle[j];
                toggleOpenProperty(hiddenParentNodes[j]);
            }
        }
        return dimension;
    }

    /**
     * Returns the parsed float or the default if it failed.
     *
     * @param  {String}  str
     * @param  {Number}  defaultValue
     * @return {Number}
     */
    function tryParseFloat(str, defaultValue) {
        var value = parseFloat(str);
        return Number.isNaN(value) ? defaultValue : value;
    }

    /**
     * Capitalize the first letter of string
     *
     * @param  {String} str
     * @return {String}
     */
    function ucfirst(str) {
        return str.charAt(0).toUpperCase() + str.substr(1);
    }

    /**
     * Plugin
     * @param {String} element
     * @param {Object} options
     */
    function Plugin(element, options) {
        this.$window            = $(window);
        this.$document          = $(document);
        this.$element           = $(element);
        this.options            = $.extend( {}, defaults, options );
        this.polyfill           = this.options.polyfill;
        this.orientation        = this.$element[0].getAttribute('data-orientation') || this.options.orientation;
        this.onInit             = this.options.onInit;
        this.onSlide            = this.options.onSlide;
        this.onSlideEnd         = this.options.onSlideEnd;
        this.DIMENSION          = constants.orientation[this.orientation].dimension;
        this.DIRECTION          = constants.orientation[this.orientation].direction;
        this.DIRECTION_STYLE    = constants.orientation[this.orientation].directionStyle;
        this.COORDINATE         = constants.orientation[this.orientation].coordinate;

        // Plugin should only be used as a polyfill
        if (this.polyfill) {
            // Input range support?
            if (hasInputRangeSupport) { return false; }
        }

        this.identifier = 'js-' + pluginName + '-' +(pluginIdentifier++);
        this.startEvent = this.options.startEvent.join('.' + this.identifier + ' ') + '.' + this.identifier;
        this.moveEvent  = this.options.moveEvent.join('.' + this.identifier + ' ') + '.' + this.identifier;
        this.endEvent   = this.options.endEvent.join('.' + this.identifier + ' ') + '.' + this.identifier;
        this.toFixed    = (this.step + '').replace('.', '').length - 1;
        this.$fill      = $('<div class="' + this.options.fillClass + '" />');
        this.$handle    = $('<div class="' + this.options.handleClass + '" />');
        this.$range     = $('<div class="' + this.options.rangeClass + ' ' + this.options[this.orientation + 'Class'] + '" id="' + this.identifier + '" />').insertAfter(this.$element).prepend(this.$fill, this.$handle);

        // visually hide the input
        this.$element.css({
            'position': 'absolute',
            'width': '1px',
            'height': '1px',
            'overflow': 'hidden',
            'opacity': '0'
        });

        // Store context
        this.handleDown = $.proxy(this.handleDown, this);
        this.handleMove = $.proxy(this.handleMove, this);
        this.handleEnd  = $.proxy(this.handleEnd, this);

        this.init();

        // Attach Events
        var _this = this;
        this.$window.on('resize.' + this.identifier, debounce(function() {
            // Simulate resizeEnd event.
            delay(function() { _this.update(false, false); }, 300);
        }, 20));

        this.$document.on(this.startEvent, '#' + this.identifier + ':not(.' + this.options.disabledClass + ')', this.handleDown);

        // Listen to programmatic value changes
        this.$element.on('change.' + this.identifier, function(e, data) {
            if (data && data.origin === _this.identifier) {
                return;
            }

            var value = e.target.value,
                pos = _this.getPositionFromValue(value);
            _this.setPosition(pos);
        });
    }

    Plugin.prototype.init = function() {
        this.update(true, false);

        if (this.onInit && typeof this.onInit === 'function') {
            this.onInit();
        }
    };

    Plugin.prototype.update = function(updateAttributes, triggerSlide) {
        updateAttributes = updateAttributes || false;

        if (updateAttributes) {
            this.min    = tryParseFloat(this.$element[0].getAttribute('min'), 0);
            this.max    = tryParseFloat(this.$element[0].getAttribute('max'), 100);
            this.value  = tryParseFloat(this.$element[0].value, Math.round(this.min + (this.max-this.min)/2));
            this.step   = tryParseFloat(this.$element[0].getAttribute('step'), 1);
        }

        this.handleDimension    = getDimension(this.$handle[0], 'offset' + ucfirst(this.DIMENSION));
        this.rangeDimension     = getDimension(this.$range[0], 'offset' + ucfirst(this.DIMENSION));
        this.maxHandlePos       = this.rangeDimension - this.handleDimension;
        this.grabPos            = this.handleDimension / 2;
        this.position           = this.getPositionFromValue(this.value);

        // Consider disabled state
        if (this.$element[0].disabled) {
            this.$range.addClass(this.options.disabledClass);
        } else {
            this.$range.removeClass(this.options.disabledClass);
        }

        this.setPosition(this.position, triggerSlide);
    };

    Plugin.prototype.handleDown = function(e) {
        this.$document.on(this.moveEvent, this.handleMove);
        this.$document.on(this.endEvent, this.handleEnd);

        // If we click on the handle don't set the new position
        if ((' ' + e.target.className + ' ').replace(/[\n\t]/g, ' ').indexOf(this.options.handleClass) > -1) {
            return;
        }

        var pos         = this.getRelativePosition(e),
            rangePos    = this.$range[0].getBoundingClientRect()[this.DIRECTION],
            handlePos   = this.getPositionFromNode(this.$handle[0]) - rangePos,
            setPos      = (this.orientation === 'vertical') ? (this.maxHandlePos - (pos - this.grabPos)) : (pos - this.grabPos);

        this.setPosition(setPos);

        if (pos >= handlePos && pos < handlePos + this.handleDimension) {
            this.grabPos = pos - handlePos;
        }
    };

    Plugin.prototype.handleMove = function(e) {
        e.preventDefault();
        var pos = this.getRelativePosition(e);
        var setPos = (this.orientation === 'vertical') ? (this.maxHandlePos - (pos - this.grabPos)) : (pos - this.grabPos);
        this.setPosition(setPos);
    };

    Plugin.prototype.handleEnd = function(e) {
        e.preventDefault();
        this.$document.off(this.moveEvent, this.handleMove);
        this.$document.off(this.endEvent, this.handleEnd);

        // Ok we're done fire the change event
        this.$element.trigger('change', { origin: this.identifier });

        if (this.onSlideEnd && typeof this.onSlideEnd === 'function') {
            this.onSlideEnd(this.position, this.value);
        }
    };

    Plugin.prototype.cap = function(pos, min, max) {
        if (pos < min) { return min; }
        if (pos > max) { return max; }
        return pos;
    };

    Plugin.prototype.setPosition = function(pos, triggerSlide) {
        var value, newPos;

        if (triggerSlide === undefined) {
            triggerSlide = true;
        }

        // Snapping steps
        value = this.getValueFromPosition(this.cap(pos, 0, this.maxHandlePos));
        newPos = this.getPositionFromValue(value);

        // Update ui
        this.$fill[0].style[this.DIMENSION] = (newPos + this.grabPos) + 'px';
        this.$handle[0].style[this.DIRECTION_STYLE] = newPos + 'px';
        this.setValue(value);

        // Update globals
        this.position = newPos;
        this.value = value;

        if (triggerSlide && this.onSlide && typeof this.onSlide === 'function') {
            this.onSlide(newPos, value);
        }
    };

    // Returns element position relative to the parent
    Plugin.prototype.getPositionFromNode = function(node) {
        var i = 0;
        while (node !== null) {
            i += node.offsetLeft;
            node = node.offsetParent;
        }
        return i;
    };

    Plugin.prototype.getRelativePosition = function(e) {
        // Get the offset DIRECTION relative to the viewport
        var ucCoordinate = ucfirst(this.COORDINATE),
            rangePos = this.$range[0].getBoundingClientRect()[this.DIRECTION],
            pageCoordinate = 0;

        if (typeof e['page' + ucCoordinate] !== 'undefined') {
            pageCoordinate = e['page' + ucCoordinate];
        }
        // IE8 support :)
        else if (typeof e.originalEvent['client' + ucCoordinate] !== 'undefined') {
            pageCoordinate = e.originalEvent['client' + ucCoordinate];
        }
        else if (e.originalEvent.touches && e.originalEvent.touches[0] && typeof e.originalEvent.touches[0]['page' + ucCoordinate] !== 'undefined') {
            pageCoordinate = e.originalEvent.touches[0]['page' + ucCoordinate];
        }
        else if(e.currentPoint && typeof e.currentPoint[this.COORDINATE] !== 'undefined') {
            pageCoordinate = e.currentPoint[this.COORDINATE];
        }

        return pageCoordinate - rangePos;
    };

    Plugin.prototype.getPositionFromValue = function(value) {
        var percentage, pos;
        percentage = (value - this.min)/(this.max - this.min);
        pos = (!Number.isNaN(percentage)) ? percentage * this.maxHandlePos : 0;
        return pos;
    };

    Plugin.prototype.getValueFromPosition = function(pos) {
        var percentage, value;
        percentage = ((pos) / (this.maxHandlePos || 1));
        value = this.step * Math.round(percentage * (this.max - this.min) / this.step) + this.min;
        return Number((value).toFixed(this.toFixed));
    };

    Plugin.prototype.setValue = function(value) {
        if (value === this.value && this.$element[0].value !== '') {
            return;
        }

        // Set the new value and fire the `input` event
        this.$element
            .val(value)
            .trigger('input', { origin: this.identifier });
    };

    Plugin.prototype.destroy = function() {
        this.$document.off('.' + this.identifier);
        this.$window.off('.' + this.identifier);

        this.$element
            .off('.' + this.identifier)
            .removeAttr('style')
            .removeData('plugin_' + pluginName);

        // Remove the generated markup
        if (this.$range && this.$range.length) {
            this.$range[0].parentNode.removeChild(this.$range[0]);
        }
    };

    // A really lightweight plugin wrapper around the constructor,
    // preventing against multiple instantiations
    $.fn[pluginName] = function(options) {
        var args = Array.prototype.slice.call(arguments, 1);

        return this.each(function() {
            var $this = $(this),
                data  = $this.data('plugin_' + pluginName);

            // Create a new instance.
            if (!data) {
                $this.data('plugin_' + pluginName, (data = new Plugin(this, options)));
            }

            // Make it possible to access methods from public.
            // e.g `$element.rangeslider('method');`
            if (typeof options === 'string') {
                data[options].apply(data, args);
            }
        });
    };

    return 'rangeslider.js is available in jQuery context e.g $(selector).rangeslider(options);';

}));

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
var _resizeStoreSizes = function(folder, file, sizes, force) {

    if (!folder || !file) {
       //console.log("no folder or file!")
        return false;
    }

    var sizes = sizes || options.sizes;
    var force = force || false;

    var done;
    this.done = function(cb) {
        done = cb;
    };

    var i = 0;
    send();

    function send() {
        if (i < sizes.length) {

            stat.workingSize = sizes[i];

            resizeStore(folder, file, sizes[i], false).done(function() {
                i++;
                send();
            }).fail(function() {
               //console.log("resizeStore fail");
            });

        } else {
            done();
        }
    };
};
/**
 * sifter.js
 * Copyright (c) 2013 Brian Reavis & contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this
 * file except in compliance with the License. You may obtain a copy of the License at:
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF
 * ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 *
 * @author Brian Reavis <brian@thirdroute.com>
 */

(function(root, factory) {
	if (typeof define === 'function' && define.amd) {
		define('sifter', factory);
	} else if (typeof exports === 'object') {
		module.exports = factory();
	} else {
		root.Sifter = factory();
	}
}(this, function() {

	/**
	 * Textually searches arrays and hashes of objects
	 * by property (or multiple properties). Designed
	 * specifically for autocomplete.
	 *
	 * @constructor
	 * @param {array|object} items
	 * @param {object} items
	 */
	var Sifter = function(items, settings) {
		this.items = items;
		this.settings = settings || {diacritics: true};
	};

	/**
	 * Splits a search string into an array of individual
	 * regexps to be used to match results.
	 *
	 * @param {string} query
	 * @returns {array}
	 */
	Sifter.prototype.tokenize = function(query) {
		query = trim(String(query || '').toLowerCase());
		if (!query || !query.length) return [];

		var i, n, regex, letter;
		var tokens = [];
		var words = query.split(/ +/);

		for (i = 0, n = words.length; i < n; i++) {
			regex = escape_regex(words[i]);
			if (this.settings.diacritics) {
				for (letter in DIACRITICS) {
					if (DIACRITICS.hasOwnProperty(letter)) {
						regex = regex.replace(new RegExp(letter, 'g'), DIACRITICS[letter]);
					}
				}
			}
			tokens.push({
				string : words[i],
				regex  : new RegExp(regex, 'i')
			});
		}

		return tokens;
	};

	/**
	 * Iterates over arrays and hashes.
	 *
	 * ```
	 * this.iterator(this.items, function(item, id) {
	 *    // invoked for each item
	 * });
	 * ```
	 *
	 * @param {array|object} object
	 */
	Sifter.prototype.iterator = function(object, callback) {
		var iterator;
		if (is_array(object)) {
			iterator = Array.prototype.forEach || function(callback) {
				for (var i = 0, n = this.length; i < n; i++) {
					callback(this[i], i, this);
				}
			};
		} else {
			iterator = function(callback) {
				for (var key in this) {
					if (this.hasOwnProperty(key)) {
						callback(this[key], key, this);
					}
				}
			};
		}

		iterator.apply(object, [callback]);
	};

	/**
	 * Returns a function to be used to score individual results.
	 *
	 * Good matches will have a higher score than poor matches.
	 * If an item is not a match, 0 will be returned by the function.
	 *
	 * @param {object|string} search
	 * @param {object} options (optional)
	 * @returns {function}
	 */
	Sifter.prototype.getScoreFunction = function(search, options) {
		var self, fields, tokens, token_count, nesting;

		self        = this;
		search      = self.prepareSearch(search, options);
		tokens      = search.tokens;
		fields      = search.options.fields;
		token_count = tokens.length;
		nesting     = search.options.nesting;

		/**
		 * Calculates how close of a match the
		 * given value is against a search token.
		 *
		 * @param {mixed} value
		 * @param {object} token
		 * @return {number}
		 */
		var scoreValue = function(value, token) {
			var score, pos;

			if (!value) return 0;
			value = String(value || '');
			pos = value.search(token.regex);
			if (pos === -1) return 0;
			score = token.string.length / value.length;
			if (pos === 0) score += 0.5;
			return score;
		};

		/**
		 * Calculates the score of an object
		 * against the search query.
		 *
		 * @param {object} token
		 * @param {object} data
		 * @return {number}
		 */
		var scoreObject = (function() {
			var field_count = fields.length;
			if (!field_count) {
				return function() { return 0; };
			}
			if (field_count === 1) {
				return function(token, data) {
					return scoreValue(getattr(data, fields[0], nesting), token);
				};
			}
			return function(token, data) {
				for (var i = 0, sum = 0; i < field_count; i++) {
					sum += scoreValue(getattr(data, fields[i], nesting), token);
				}
				return sum / field_count;
			};
		})();

		if (!token_count) {
			return function() { return 0; };
		}
		if (token_count === 1) {
			return function(data) {
				return scoreObject(tokens[0], data);
			};
		}

		if (search.options.conjunction === 'and') {
			return function(data) {
				var score;
				for (var i = 0, sum = 0; i < token_count; i++) {
					score = scoreObject(tokens[i], data);
					if (score <= 0) return 0;
					sum += score;
				}
				return sum / token_count;
			};
		} else {
			return function(data) {
				for (var i = 0, sum = 0; i < token_count; i++) {
					sum += scoreObject(tokens[i], data);
				}
				return sum / token_count;
			};
		}
	};

	/**
	 * Returns a function that can be used to compare two
	 * results, for sorting purposes. If no sorting should
	 * be performed, `null` will be returned.
	 *
	 * @param {string|object} search
	 * @param {object} options
	 * @return function(a,b)
	 */
	Sifter.prototype.getSortFunction = function(search, options) {
		var i, n, self, field, fields, fields_count, multiplier, multipliers, get_field, implicit_score, sort;

		self   = this;
		search = self.prepareSearch(search, options);
		sort   = (!search.query && options.sort_empty) || options.sort;

		/**
		 * Fetches the specified sort field value
		 * from a search result item.
		 *
		 * @param  {string} name
		 * @param  {object} result
		 * @return {mixed}
		 */
		get_field = function(name, result) {
			if (name === '$score') return result.score;
			return getattr(self.items[result.id], name, options.nesting);
		};

		// parse options
		fields = [];
		if (sort) {
			for (i = 0, n = sort.length; i < n; i++) {
				if (search.query || sort[i].field !== '$score') {
					fields.push(sort[i]);
				}
			}
		}

		// the "$score" field is implied to be the primary
		// sort field, unless it's manually specified
		if (search.query) {
			implicit_score = true;
			for (i = 0, n = fields.length; i < n; i++) {
				if (fields[i].field === '$score') {
					implicit_score = false;
					break;
				}
			}
			if (implicit_score) {
				fields.unshift({field: '$score', direction: 'desc'});
			}
		} else {
			for (i = 0, n = fields.length; i < n; i++) {
				if (fields[i].field === '$score') {
					fields.splice(i, 1);
					break;
				}
			}
		}

		multipliers = [];
		for (i = 0, n = fields.length; i < n; i++) {
			multipliers.push(fields[i].direction === 'desc' ? -1 : 1);
		}

		// build function
		fields_count = fields.length;
		if (!fields_count) {
			return null;
		} else if (fields_count === 1) {
			field = fields[0].field;
			multiplier = multipliers[0];
			return function(a, b) {
				return multiplier * cmp(
					get_field(field, a),
					get_field(field, b)
				);
			};
		} else {
			return function(a, b) {
				var i, result, a_value, b_value, field;
				for (i = 0; i < fields_count; i++) {
					field = fields[i].field;
					result = multipliers[i] * cmp(
						get_field(field, a),
						get_field(field, b)
					);
					if (result) return result;
				}
				return 0;
			};
		}
	};

	/**
	 * Parses a search query and returns an object
	 * with tokens and fields ready to be populated
	 * with results.
	 *
	 * @param {string} query
	 * @param {object} options
	 * @returns {object}
	 */
	Sifter.prototype.prepareSearch = function(query, options) {
		if (typeof query === 'object') return query;

		options = extend({}, options);

		var option_fields     = options.fields;
		var option_sort       = options.sort;
		var option_sort_empty = options.sort_empty;

		if (option_fields && !is_array(option_fields)) options.fields = [option_fields];
		if (option_sort && !is_array(option_sort)) options.sort = [option_sort];
		if (option_sort_empty && !is_array(option_sort_empty)) options.sort_empty = [option_sort_empty];

		return {
			options : options,
			query   : String(query || '').toLowerCase(),
			tokens  : this.tokenize(query),
			total   : 0,
			items   : []
		};
	};

	/**
	 * Searches through all items and returns a sorted array of matches.
	 *
	 * The `options` parameter can contain:
	 *
	 *   - fields {string|array}
	 *   - sort {array}
	 *   - score {function}
	 *   - filter {bool}
	 *   - limit {integer}
	 *
	 * Returns an object containing:
	 *
	 *   - options {object}
	 *   - query {string}
	 *   - tokens {array}
	 *   - total {int}
	 *   - items {array}
	 *
	 * @param {string} query
	 * @param {object} options
	 * @returns {object}
	 */
	Sifter.prototype.search = function(query, options) {
		var self = this, value, score, search, calculateScore;
		var fn_sort;
		var fn_score;

		search  = this.prepareSearch(query, options);
		options = search.options;
		query   = search.query;

		// generate result scoring function
		fn_score = options.score || self.getScoreFunction(search);

		// perform search and sort
		if (query.length) {
			self.iterator(self.items, function(item, id) {
				score = fn_score(item);
				if (options.filter === false || score > 0) {
					search.items.push({'score': score, 'id': id});
				}
			});
		} else {
			self.iterator(self.items, function(item, id) {
				search.items.push({'score': 1, 'id': id});
			});
		}

		fn_sort = self.getSortFunction(search, options);
		if (fn_sort) search.items.sort(fn_sort);

		// apply limits
		search.total = search.items.length;
		if (typeof options.limit === 'number') {
			search.items = search.items.slice(0, options.limit);
		}

		return search;
	};

	// utilities
	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

	var cmp = function(a, b) {
		if (typeof a === 'number' && typeof b === 'number') {
			return a > b ? 1 : (a < b ? -1 : 0);
		}
		a = asciifold(String(a || ''));
		b = asciifold(String(b || ''));
		if (a > b) return 1;
		if (b > a) return -1;
		return 0;
	};

	var extend = function(a, b) {
		var i, n, k, object;
		for (i = 1, n = arguments.length; i < n; i++) {
			object = arguments[i];
			if (!object) continue;
			for (k in object) {
				if (object.hasOwnProperty(k)) {
					a[k] = object[k];
				}
			}
		}
		return a;
	};

	/**
	 * A property getter resolving dot-notation
	 * @param  {Object}  obj     The root object to fetch property on
	 * @param  {String}  name    The optionally dotted property name to fetch
	 * @param  {Boolean} nesting Handle nesting or not
	 * @return {Object}          The resolved property value
	 */
	var getattr = function(obj, name, nesting) {
	    if (!obj || !name) return;
	    if (!nesting) return obj[name];
	    var names = name.split(".");
	    while(names.length && (obj = obj[names.shift()]));
	    return obj;
	};

	var trim = function(str) {
		return (str + '').replace(/^\s+|\s+$|/g, '');
	};

	var escape_regex = function(str) {
		return (str + '').replace(/([.?*+^$[\]\\(){}|-])/g, '\\$1');
	};

	var is_array = Array.isArray || (typeof $ !== 'undefined' && $.isArray) || function(object) {
		return Object.prototype.toString.call(object) === '[object Array]';
	};

	var DIACRITICS = {
		'a': '[aḀḁĂăÂâǍǎȺⱥȦȧẠạÄäÀàÁáĀāÃãÅåąĄÃąĄ]',
		'b': '[b␢βΒB฿𐌁ᛒ]',
		'c': '[cĆćĈĉČčĊċC̄c̄ÇçḈḉȻȼƇƈɕᴄＣｃ]',
		'd': '[dĎďḊḋḐḑḌḍḒḓḎḏĐđD̦d̦ƉɖƊɗƋƌᵭᶁᶑȡᴅＤｄð]',
		'e': '[eÉéÈèÊêḘḙĚěĔĕẼẽḚḛẺẻĖėËëĒēȨȩĘęᶒɆɇȄȅẾếỀềỄễỂểḜḝḖḗḔḕȆȇẸẹỆệⱸᴇＥｅɘǝƏƐε]',
		'f': '[fƑƒḞḟ]',
		'g': '[gɢ₲ǤǥĜĝĞğĢģƓɠĠġ]',
		'h': '[hĤĥĦħḨḩẖẖḤḥḢḣɦʰǶƕ]',
		'i': '[iÍíÌìĬĭÎîǏǐÏïḮḯĨĩĮįĪīỈỉȈȉȊȋỊịḬḭƗɨɨ̆ᵻᶖİiIıɪＩｉ]',
		'j': '[jȷĴĵɈɉʝɟʲ]',
		'k': '[kƘƙꝀꝁḰḱǨǩḲḳḴḵκϰ₭]',
		'l': '[lŁłĽľĻļĹĺḶḷḸḹḼḽḺḻĿŀȽƚⱠⱡⱢɫɬᶅɭȴʟＬｌ]',
		'n': '[nŃńǸǹŇňÑñṄṅŅņṆṇṊṋṈṉN̈n̈ƝɲȠƞᵰᶇɳȵɴＮｎŊŋ]',
		'o': '[oØøÖöÓóÒòÔôǑǒŐőŎŏȮȯỌọƟɵƠơỎỏŌōÕõǪǫȌȍՕօ]',
		'p': '[pṔṕṖṗⱣᵽƤƥᵱ]',
		'q': '[qꝖꝗʠɊɋꝘꝙq̃]',
		'r': '[rŔŕɌɍŘřŖŗṘṙȐȑȒȓṚṛⱤɽ]',
		's': '[sŚśṠṡṢṣꞨꞩŜŝŠšŞşȘșS̈s̈]',
		't': '[tŤťṪṫŢţṬṭƮʈȚțṰṱṮṯƬƭ]',
		'u': '[uŬŭɄʉỤụÜüÚúÙùÛûǓǔŰűŬŭƯưỦủŪūŨũŲųȔȕ∪]',
		'v': '[vṼṽṾṿƲʋꝞꝟⱱʋ]',
		'w': '[wẂẃẀẁŴŵẄẅẆẇẈẉ]',
		'x': '[xẌẍẊẋχ]',
		'y': '[yÝýỲỳŶŷŸÿỸỹẎẏỴỵɎɏƳƴ]',
		'z': '[zŹźẐẑŽžŻżẒẓẔẕƵƶ]'
	};

	var asciifold = (function() {
		var i, n, k, chunk;
		var foreignletters = '';
		var lookup = {};
		for (k in DIACRITICS) {
			if (DIACRITICS.hasOwnProperty(k)) {
				chunk = DIACRITICS[k].substring(2, DIACRITICS[k].length - 1);
				foreignletters += chunk;
				for (i = 0, n = chunk.length; i < n; i++) {
					lookup[chunk.charAt(i)] = k;
				}
			}
		}
		var regexp = new RegExp('[' +  foreignletters + ']', 'g');
		return function(str) {
			return str.replace(regexp, function(foreignletter) {
				return lookup[foreignletter];
			}).toLowerCase();
		};
	})();


	// export
	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

	return Sifter;
}));



/**
 * microplugin.js
 * Copyright (c) 2013 Brian Reavis & contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this
 * file except in compliance with the License. You may obtain a copy of the License at:
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF
 * ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 *
 * @author Brian Reavis <brian@thirdroute.com>
 */

(function(root, factory) {
	if (typeof define === 'function' && define.amd) {
		define('microplugin', factory);
	} else if (typeof exports === 'object') {
		module.exports = factory();
	} else {
		root.MicroPlugin = factory();
	}
}(this, function() {
	var MicroPlugin = {};

	MicroPlugin.mixin = function(Interface) {
		Interface.plugins = {};

		/**
		 * Initializes the listed plugins (with options).
		 * Acceptable formats:
		 *
		 * List (without options):
		 *   ['a', 'b', 'c']
		 *
		 * List (with options):
		 *   [{'name': 'a', options: {}}, {'name': 'b', options: {}}]
		 *
		 * Hash (with options):
		 *   {'a': { ... }, 'b': { ... }, 'c': { ... }}
		 *
		 * @param {mixed} plugins
		 */
		Interface.prototype.initializePlugins = function(plugins) {
			var i, n, key;
			var self  = this;
			var queue = [];

			self.plugins = {
				names     : [],
				settings  : {},
				requested : {},
				loaded    : {}
			};

			if (utils.isArray(plugins)) {
				for (i = 0, n = plugins.length; i < n; i++) {
					if (typeof plugins[i] === 'string') {
						queue.push(plugins[i]);
					} else {
						self.plugins.settings[plugins[i].name] = plugins[i].options;
						queue.push(plugins[i].name);
					}
				}
			} else if (plugins) {
				for (key in plugins) {
					if (plugins.hasOwnProperty(key)) {
						self.plugins.settings[key] = plugins[key];
						queue.push(key);
					}
				}
			}

			while (queue.length) {
				self.require(queue.shift());
			}
		};

		Interface.prototype.loadPlugin = function(name) {
			var self    = this;
			var plugins = self.plugins;
			var plugin  = Interface.plugins[name];

			if (!Interface.plugins.hasOwnProperty(name)) {
				throw new Error('Unable to find "' +  name + '" plugin');
			}

			plugins.requested[name] = true;
			plugins.loaded[name] = plugin.fn.apply(self, [self.plugins.settings[name] || {}]);
			plugins.names.push(name);
		};

		/**
		 * Initializes a plugin.
		 *
		 * @param {string} name
		 */
		Interface.prototype.require = function(name) {
			var self = this;
			var plugins = self.plugins;

			if (!self.plugins.loaded.hasOwnProperty(name)) {
				if (plugins.requested[name]) {
					throw new Error('Plugin has circular dependency ("' + name + '")');
				}
				self.loadPlugin(name);
			}

			return plugins.loaded[name];
		};

		/**
		 * Registers a plugin.
		 *
		 * @param {string} name
		 * @param {function} fn
		 */
		Interface.define = function(name, fn) {
			Interface.plugins[name] = {
				'name' : name,
				'fn'   : fn
			};
		};
	};

	var utils = {
		isArray: Array.isArray || function(vArg) {
			return Object.prototype.toString.call(vArg) === '[object Array]';
		}
	};

	return MicroPlugin;
}));

/**
 * selectize.js (v0.12.4)
 * Copyright (c) 2013–2015 Brian Reavis & contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this
 * file except in compliance with the License. You may obtain a copy of the License at:
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF
 * ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 *
 * @author Brian Reavis <brian@thirdroute.com>
 */

/*jshint curly:false */
/*jshint browser:true */

(function(root, factory) {
	if (typeof define === 'function' && define.amd) {
		define('selectize', ['jquery','sifter','microplugin'], factory);
	} else if (typeof exports === 'object') {
		module.exports = factory(require('jquery'), require('sifter'), require('microplugin'));
	} else {
		root.Selectize = factory(root.jQuery, root.Sifter, root.MicroPlugin);
	}
}(this, function($, Sifter, MicroPlugin) {
	'use strict';

	var highlight = function($element, pattern) {
		if (typeof pattern === 'string' && !pattern.length) return;
		var regex = (typeof pattern === 'string') ? new RegExp(pattern, 'i') : pattern;
	
		var highlight = function(node) {
			var skip = 0;
			if (node.nodeType === 3) {
				var pos = node.data.search(regex);
				if (pos >= 0 && node.data.length > 0) {
					var match = node.data.match(regex);
					var spannode = document.createElement('span');
					spannode.className = 'highlight';
					var middlebit = node.splitText(pos);
					var endbit = middlebit.splitText(match[0].length);
					var middleclone = middlebit.cloneNode(true);
					spannode.appendChild(middleclone);
					middlebit.parentNode.replaceChild(spannode, middlebit);
					skip = 1;
				}
			} else if (node.nodeType === 1 && node.childNodes && !/(script|style)/i.test(node.tagName)) {
				for (var i = 0; i < node.childNodes.length; ++i) {
					i += highlight(node.childNodes[i]);
				}
			}
			return skip;
		};
	
		return $element.each(function() {
			highlight(this);
		});
	};
	
	/**
	 * removeHighlight fn copied from highlight v5 and
	 * edited to remove with() and pass js strict mode
	 */
	$.fn.removeHighlight = function() {
		return this.find("span.highlight").each(function() {
			this.parentNode.firstChild.nodeName;
			var parent = this.parentNode;
			parent.replaceChild(this.firstChild, this);
			parent.normalize();
		}).end();
	};
	
	
	var MicroEvent = function() {};
	MicroEvent.prototype = {
		on: function(event, fct){
			this._events = this._events || {};
			this._events[event] = this._events[event] || [];
			this._events[event].push(fct);
		},
		off: function(event, fct){
			var n = arguments.length;
			if (n === 0) return delete this._events;
			if (n === 1) return delete this._events[event];
	
			this._events = this._events || {};
			if (event in this._events === false) return;
			this._events[event].splice(this._events[event].indexOf(fct), 1);
		},
		trigger: function(event /* , args... */){
			this._events = this._events || {};
			if (event in this._events === false) return;
			for (var i = 0; i < this._events[event].length; i++){
				this._events[event][i].apply(this, Array.prototype.slice.call(arguments, 1));
			}
		}
	};
	
	/**
	 * Mixin will delegate all MicroEvent.js function in the destination object.
	 *
	 * - MicroEvent.mixin(Foobar) will make Foobar able to use MicroEvent
	 *
	 * @param {object} the object which will support MicroEvent
	 */
	MicroEvent.mixin = function(destObject){
		var props = ['on', 'off', 'trigger'];
		for (var i = 0; i < props.length; i++){
			destObject.prototype[props[i]] = MicroEvent.prototype[props[i]];
		}
	};
	
	var IS_MAC        = /Mac/.test(navigator.userAgent);
	
	var KEY_A         = 65;
	var KEY_COMMA     = 188;
	var KEY_RETURN    = 13;
	var KEY_ESC       = 27;
	var KEY_LEFT      = 37;
	var KEY_UP        = 38;
	var KEY_P         = 80;
	var KEY_RIGHT     = 39;
	var KEY_DOWN      = 40;
	var KEY_N         = 78;
	var KEY_BACKSPACE = 8;
	var KEY_DELETE    = 46;
	var KEY_SHIFT     = 16;
	var KEY_CMD       = IS_MAC ? 91 : 17;
	var KEY_CTRL      = IS_MAC ? 18 : 17;
	var KEY_TAB       = 9;
	
	var TAG_SELECT    = 1;
	var TAG_INPUT     = 2;
	
	// for now, android support in general is too spotty to support validity
	var SUPPORTS_VALIDITY_API = !/android/i.test(window.navigator.userAgent) && !!document.createElement('input').validity;
	
	
	var isset = function(object) {
		return typeof object !== 'undefined';
	};
	
	/**
	 * Converts a scalar to its best string representation
	 * for hash keys and HTML attribute values.
	 *
	 * Transformations:
	 *   'str'     -> 'str'
	 *   null      -> ''
	 *   undefined -> ''
	 *   true      -> '1'
	 *   false     -> '0'
	 *   0         -> '0'
	 *   1         -> '1'
	 *
	 * @param {string} value
	 * @returns {string|null}
	 */
	var hash_key = function(value) {
		if (typeof value === 'undefined' || value === null) return null;
		if (typeof value === 'boolean') return value ? '1' : '0';
		return value + '';
	};
	
	/**
	 * Escapes a string for use within HTML.
	 *
	 * @param {string} str
	 * @returns {string}
	 */
	var escape_html = function(str) {
		return (str + '')
			.replace(/&/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;')
			.replace(/"/g, '&quot;');
	};
	
	/**
	 * Escapes "$" characters in replacement strings.
	 *
	 * @param {string} str
	 * @returns {string}
	 */
	var escape_replace = function(str) {
		return (str + '').replace(/\$/g, '$$$$');
	};
	
	var hook = {};
	
	/**
	 * Wraps `method` on `self` so that `fn`
	 * is invoked before the original method.
	 *
	 * @param {object} self
	 * @param {string} method
	 * @param {function} fn
	 */
	hook.before = function(self, method, fn) {
		var original = self[method];
		self[method] = function() {
			fn.apply(self, arguments);
			return original.apply(self, arguments);
		};
	};
	
	/**
	 * Wraps `method` on `self` so that `fn`
	 * is invoked after the original method.
	 *
	 * @param {object} self
	 * @param {string} method
	 * @param {function} fn
	 */
	hook.after = function(self, method, fn) {
		var original = self[method];
		self[method] = function() {
			var result = original.apply(self, arguments);
			fn.apply(self, arguments);
			return result;
		};
	};
	
	/**
	 * Wraps `fn` so that it can only be invoked once.
	 *
	 * @param {function} fn
	 * @returns {function}
	 */
	var once = function(fn) {
		var called = false;
		return function() {
			if (called) return;
			called = true;
			fn.apply(this, arguments);
		};
	};
	
	/**
	 * Wraps `fn` so that it can only be called once
	 * every `delay` milliseconds (invoked on the falling edge).
	 *
	 * @param {function} fn
	 * @param {int} delay
	 * @returns {function}
	 */
	var debounce = function(fn, delay) {
		var timeout;
		return function() {
			var self = this;
			var args = arguments;
			window.clearTimeout(timeout);
			timeout = window.setTimeout(function() {
				fn.apply(self, args);
			}, delay);
		};
	};
	
	/**
	 * Debounce all fired events types listed in `types`
	 * while executing the provided `fn`.
	 *
	 * @param {object} self
	 * @param {array} types
	 * @param {function} fn
	 */
	var debounce_events = function(self, types, fn) {
		var type;
		var trigger = self.trigger;
		var event_args = {};
	
		// override trigger method
		self.trigger = function() {
			var type = arguments[0];
			if (types.indexOf(type) !== -1) {
				event_args[type] = arguments;
			} else {
				return trigger.apply(self, arguments);
			}
		};
	
		// invoke provided function
		fn.apply(self, []);
		self.trigger = trigger;
	
		// trigger queued events
		for (type in event_args) {
			if (event_args.hasOwnProperty(type)) {
				trigger.apply(self, event_args[type]);
			}
		}
	};
	
	/**
	 * A workaround for http://bugs.jquery.com/ticket/6696
	 *
	 * @param {object} $parent - Parent element to listen on.
	 * @param {string} event - Event name.
	 * @param {string} selector - Descendant selector to filter by.
	 * @param {function} fn - Event handler.
	 */
	var watchChildEvent = function($parent, event, selector, fn) {
		$parent.on(event, selector, function(e) {
			var child = e.target;
			while (child && child.parentNode !== $parent[0]) {
				child = child.parentNode;
			}
			e.currentTarget = child;
			return fn.apply(this, [e]);
		});
	};
	
	/**
	 * Determines the current selection within a text input control.
	 * Returns an object containing:
	 *   - start
	 *   - length
	 *
	 * @param {object} input
	 * @returns {object}
	 */
	var getSelection = function(input) {
		var result = {};
		if ('selectionStart' in input) {
			result.start = input.selectionStart;
			result.length = input.selectionEnd - result.start;
		} else if (document.selection) {
			input.focus();
			var sel = document.selection.createRange();
			var selLen = document.selection.createRange().text.length;
			sel.moveStart('character', -input.value.length);
			result.start = sel.text.length - selLen;
			result.length = selLen;
		}
		return result;
	};
	
	/**
	 * Copies CSS properties from one element to another.
	 *
	 * @param {object} $from
	 * @param {object} $to
	 * @param {array} properties
	 */
	var transferStyles = function($from, $to, properties) {
		var i, n, styles = {};
		if (properties) {
			for (i = 0, n = properties.length; i < n; i++) {
				styles[properties[i]] = $from.css(properties[i]);
			}
		} else {
			styles = $from.css();
		}
		$to.css(styles);
	};
	
	/**
	 * Measures the width of a string within a
	 * parent element (in pixels).
	 *
	 * @param {string} str
	 * @param {object} $parent
	 * @returns {int}
	 */
	var measureString = function(str, $parent) {
		if (!str) {
			return 0;
		}
	
		var $test = $('<test>').css({
			position: 'absolute',
			top: -99999,
			left: -99999,
			width: 'auto',
			padding: 0,
			whiteSpace: 'pre'
		}).text(str).appendTo('body');
	
		transferStyles($parent, $test, [
			'letterSpacing',
			'fontSize',
			'fontFamily',
			'fontWeight',
			'textTransform'
		]);
	
		var width = $test.width();
		$test.remove();
	
		return width;
	};
	
	/**
	 * Sets up an input to grow horizontally as the user
	 * types. If the value is changed manually, you can
	 * trigger the "update" handler to resize:
	 *
	 * $input.trigger('update');
	 *
	 * @param {object} $input
	 */
	var autoGrow = function($input) {
		var currentWidth = null;
	
		var update = function(e, options) {
			var value, keyCode, printable, placeholder, width;
			var shift, character, selection;
			e = e || window.event || {};
			options = options || {};
	
			if (e.metaKey || e.altKey) return;
			if (!options.force && $input.data('grow') === false) return;
	
			value = $input.val();
			if (e.type && e.type.toLowerCase() === 'keydown') {
				keyCode = e.keyCode;
				printable = (
					(keyCode >= 97 && keyCode <= 122) || // a-z
					(keyCode >= 65 && keyCode <= 90)  || // A-Z
					(keyCode >= 48 && keyCode <= 57)  || // 0-9
					keyCode === 32 // space
				);
	
				if (keyCode === KEY_DELETE || keyCode === KEY_BACKSPACE) {
					selection = getSelection($input[0]);
					if (selection.length) {
						value = value.substring(0, selection.start) + value.substring(selection.start + selection.length);
					} else if (keyCode === KEY_BACKSPACE && selection.start) {
						value = value.substring(0, selection.start - 1) + value.substring(selection.start + 1);
					} else if (keyCode === KEY_DELETE && typeof selection.start !== 'undefined') {
						value = value.substring(0, selection.start) + value.substring(selection.start + 1);
					}
				} else if (printable) {
					shift = e.shiftKey;
					character = String.fromCharCode(e.keyCode);
					if (shift) character = character.toUpperCase();
					else character = character.toLowerCase();
					value += character;
				}
			}
	
			placeholder = $input.attr('placeholder');
			if (!value && placeholder) {
				value = placeholder;
			}
	
			width = measureString(value, $input) + 4;
			if (width !== currentWidth) {
				currentWidth = width;
				$input.width(width);
				$input.triggerHandler('resize');
			}
		};
	
		$input.on('keydown keyup update blur', update);
		update();
	};
	
	var domToString = function(d) {
		var tmp = document.createElement('div');
	
		tmp.appendChild(d.cloneNode(true));
	
		return tmp.innerHTML;
	};
	
	var logError = function(message, options){
		if(!options) options = {};
		var component = "Selectize";
	
		console.error(component + ": " + message)
	
		if(options.explanation){
			// console.group is undefined in <IE11
			if(console.group) console.group();
			console.error(options.explanation);
			if(console.group) console.groupEnd();
		}
	}
	
	
	var Selectize = function($input, settings) {
		var key, i, n, dir, input, self = this;
		input = $input[0];
		input.selectize = self;
	
		// detect rtl environment
		var computedStyle = window.getComputedStyle && window.getComputedStyle(input, null);
		dir = computedStyle ? computedStyle.getPropertyValue('direction') : input.currentStyle && input.currentStyle.direction;
		dir = dir || $input.parents('[dir]:first').attr('dir') || '';
	
		// setup default state
		$.extend(self, {
			order            : 0,
			settings         : settings,
			$input           : $input,
			tabIndex         : $input.attr('tabindex') || '',
			tagType          : input.tagName.toLowerCase() === 'select' ? TAG_SELECT : TAG_INPUT,
			rtl              : /rtl/i.test(dir),
	
			eventNS          : '.selectize' + (++Selectize.count),
			highlightedValue : null,
			isOpen           : false,
			isDisabled       : false,
			isRequired       : $input.is('[required]'),
			isInvalid        : false,
			isLocked         : false,
			isFocused        : false,
			isInputHidden    : false,
			isSetup          : false,
			isShiftDown      : false,
			isCmdDown        : false,
			isCtrlDown       : false,
			ignoreFocus      : false,
			ignoreBlur       : false,
			ignoreHover      : false,
			hasOptions       : false,
			currentResults   : null,
			lastValue        : '',
			caretPos         : 0,
			loading          : 0,
			loadedSearches   : {},
	
			$activeOption    : null,
			$activeItems     : [],
	
			optgroups        : {},
			options          : {},
			userOptions      : {},
			items            : [],
			renderCache      : {},
			onSearchChange   : settings.loadThrottle === null ? self.onSearchChange : debounce(self.onSearchChange, settings.loadThrottle)
		});
	
		// search system
		self.sifter = new Sifter(this.options, {diacritics: settings.diacritics});
	
		// build options table
		if (self.settings.options) {
			for (i = 0, n = self.settings.options.length; i < n; i++) {
				self.registerOption(self.settings.options[i]);
			}
			delete self.settings.options;
		}
	
		// build optgroup table
		if (self.settings.optgroups) {
			for (i = 0, n = self.settings.optgroups.length; i < n; i++) {
				self.registerOptionGroup(self.settings.optgroups[i]);
			}
			delete self.settings.optgroups;
		}
	
		// option-dependent defaults
		self.settings.mode = self.settings.mode || (self.settings.maxItems === 1 ? 'single' : 'multi');
		if (typeof self.settings.hideSelected !== 'boolean') {
			self.settings.hideSelected = self.settings.mode === 'multi';
		}
	
		self.initializePlugins(self.settings.plugins);
		self.setupCallbacks();
		self.setupTemplates();
		self.setup();
	};
	
	// mixins
	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	
	MicroEvent.mixin(Selectize);
	
	if(typeof MicroPlugin !== "undefined"){
		MicroPlugin.mixin(Selectize);
	}else{
		logError("Dependency MicroPlugin is missing",
			{explanation:
				"Make sure you either: (1) are using the \"standalone\" "+
				"version of Selectize, or (2) require MicroPlugin before you "+
				"load Selectize."}
		);
	}
	
	
	// methods
	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	
	$.extend(Selectize.prototype, {
	
		/**
		 * Creates all elements and sets up event bindings.
		 */
		setup: function() {
			var self      = this;
			var settings  = self.settings;
			var eventNS   = self.eventNS;
			var $window   = $(window);
			var $document = $(document);
			var $input    = self.$input;
	
			var $wrapper;
			var $control;
			var $control_input;
			var $dropdown;
			var $dropdown_content;
			var $dropdown_parent;
			var inputMode;
			var timeout_blur;
			var timeout_focus;
			var classes;
			var classes_plugins;
			var inputId;
	
			inputMode         = self.settings.mode;
			classes           = $input.attr('class') || '';
	
			$wrapper          = $('<div>').addClass(settings.wrapperClass).addClass(classes).addClass(inputMode);
			$control          = $('<div>').addClass(settings.inputClass).addClass('items').appendTo($wrapper);
			$control_input    = $('<input type="text" autocomplete="off" />').appendTo($control).attr('tabindex', $input.is(':disabled') ? '-1' : self.tabIndex);
			$dropdown_parent  = $(settings.dropdownParent || $wrapper);
			$dropdown         = $('<div>').addClass(settings.dropdownClass).addClass(inputMode).hide().appendTo($dropdown_parent);
			$dropdown_content = $('<div>').addClass(settings.dropdownContentClass).appendTo($dropdown);
	
			if(inputId = $input.attr('id')) {
				$control_input.attr('id', inputId + '-selectized');
				$("label[for='"+inputId+"']").attr('for', inputId + '-selectized');
			}
	
			if(self.settings.copyClassesToDropdown) {
				$dropdown.addClass(classes);
			}
	
			$wrapper.css({
				width: $input[0].style.width
			});
	
			if (self.plugins.names.length) {
				classes_plugins = 'plugin-' + self.plugins.names.join(' plugin-');
				$wrapper.addClass(classes_plugins);
				$dropdown.addClass(classes_plugins);
			}
	
			if ((settings.maxItems === null || settings.maxItems > 1) && self.tagType === TAG_SELECT) {
				$input.attr('multiple', 'multiple');
			}
	
			if (self.settings.placeholder) {
				$control_input.attr('placeholder', settings.placeholder);
			}
	
			// if splitOn was not passed in, construct it from the delimiter to allow pasting universally
			if (!self.settings.splitOn && self.settings.delimiter) {
				var delimiterEscaped = self.settings.delimiter.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
				self.settings.splitOn = new RegExp('\\s*' + delimiterEscaped + '+\\s*');
			}
	
			if ($input.attr('autocorrect')) {
				$control_input.attr('autocorrect', $input.attr('autocorrect'));
			}
	
			if ($input.attr('autocapitalize')) {
				$control_input.attr('autocapitalize', $input.attr('autocapitalize'));
			}
	
			self.$wrapper          = $wrapper;
			self.$control          = $control;
			self.$control_input    = $control_input;
			self.$dropdown         = $dropdown;
			self.$dropdown_content = $dropdown_content;
	
			$dropdown.on('mouseenter', '[data-selectable]', function() { return self.onOptionHover.apply(self, arguments); });
			$dropdown.on('mousedown click', '[data-selectable]', function() { return self.onOptionSelect.apply(self, arguments); });
			watchChildEvent($control, 'mousedown', '*:not(input)', function() { return self.onItemSelect.apply(self, arguments); });
			autoGrow($control_input);
	
			$control.on({
				mousedown : function() { return self.onMouseDown.apply(self, arguments); },
				click     : function() { return self.onClick.apply(self, arguments); }
			});
	
			$control_input.on({
				mousedown : function(e) { e.stopPropagation(); },
				keydown   : function() { return self.onKeyDown.apply(self, arguments); },
				keyup     : function() { return self.onKeyUp.apply(self, arguments); },
				keypress  : function() { return self.onKeyPress.apply(self, arguments); },
				resize    : function() { self.positionDropdown.apply(self, []); },
				blur      : function() { return self.onBlur.apply(self, arguments); },
				focus     : function() { self.ignoreBlur = false; return self.onFocus.apply(self, arguments); },
				paste     : function() { return self.onPaste.apply(self, arguments); }
			});
	
			$document.on('keydown' + eventNS, function(e) {
				self.isCmdDown = e[IS_MAC ? 'metaKey' : 'ctrlKey'];
				self.isCtrlDown = e[IS_MAC ? 'altKey' : 'ctrlKey'];
				self.isShiftDown = e.shiftKey;
			});
	
			$document.on('keyup' + eventNS, function(e) {
				if (e.keyCode === KEY_CTRL) self.isCtrlDown = false;
				if (e.keyCode === KEY_SHIFT) self.isShiftDown = false;
				if (e.keyCode === KEY_CMD) self.isCmdDown = false;
			});
	
			$document.on('mousedown' + eventNS, function(e) {
				if (self.isFocused) {
					// prevent events on the dropdown scrollbar from causing the control to blur
					if (e.target === self.$dropdown[0] || e.target.parentNode === self.$dropdown[0]) {
						return false;
					}
					// blur on click outside
					if (!self.$control.has(e.target).length && e.target !== self.$control[0]) {
						self.blur(e.target);
					}
				}
			});
	
			$window.on(['scroll' + eventNS, 'resize' + eventNS].join(' '), function() {
				if (self.isOpen) {
					self.positionDropdown.apply(self, arguments);
				}
			});
			$window.on('mousemove' + eventNS, function() {
				self.ignoreHover = false;
			});
	
			// store original children and tab index so that they can be
			// restored when the destroy() method is called.
			this.revertSettings = {
				$children : $input.children().detach(),
				tabindex  : $input.attr('tabindex')
			};
	
			$input.attr('tabindex', -1).hide().after(self.$wrapper);
	
			if ($.isArray(settings.items)) {
				self.setValue(settings.items);
				delete settings.items;
			}
	
			// feature detect for the validation API
			if (SUPPORTS_VALIDITY_API) {
				$input.on('invalid' + eventNS, function(e) {
					e.preventDefault();
					self.isInvalid = true;
					self.refreshState();
				});
			}
	
			self.updateOriginalInput();
			self.refreshItems();
			self.refreshState();
			self.updatePlaceholder();
			self.isSetup = true;
	
			if ($input.is(':disabled')) {
				self.disable();
			}
	
			self.on('change', this.onChange);
	
			$input.data('selectize', self);
			$input.addClass('selectized');
			self.trigger('initialize');
	
			// preload options
			if (settings.preload === true) {
				self.onSearchChange('');
			}
	
		},
	
		/**
		 * Sets up default rendering functions.
		 */
		setupTemplates: function() {
			var self = this;
			var field_label = self.settings.labelField;
			var field_optgroup = self.settings.optgroupLabelField;
	
			var templates = {
				'optgroup': function(data) {
					return '<div class="optgroup">' + data.html + '</div>';
				},
				'optgroup_header': function(data, escape) {
					return '<div class="optgroup-header">' + escape(data[field_optgroup]) + '</div>';
				},
				'option': function(data, escape) {
					return '<div class="option">' + escape(data[field_label]) + '</div>';
				},
				'item': function(data, escape) {
					return '<div class="item">' + escape(data[field_label]) + '</div>';
				},
				'option_create': function(data, escape) {
					return '<div class="create">Add <strong>' + escape(data.input) + '</strong>&hellip;</div>';
				}
			};
	
			self.settings.render = $.extend({}, templates, self.settings.render);
		},
	
		/**
		 * Maps fired events to callbacks provided
		 * in the settings used when creating the control.
		 */
		setupCallbacks: function() {
			var key, fn, callbacks = {
				'initialize'      : 'onInitialize',
				'change'          : 'onChange',
				'item_add'        : 'onItemAdd',
				'item_remove'     : 'onItemRemove',
				'clear'           : 'onClear',
				'option_add'      : 'onOptionAdd',
				'option_remove'   : 'onOptionRemove',
				'option_clear'    : 'onOptionClear',
				'optgroup_add'    : 'onOptionGroupAdd',
				'optgroup_remove' : 'onOptionGroupRemove',
				'optgroup_clear'  : 'onOptionGroupClear',
				'dropdown_open'   : 'onDropdownOpen',
				'dropdown_close'  : 'onDropdownClose',
				'type'            : 'onType',
				'load'            : 'onLoad',
				'focus'           : 'onFocus',
				'blur'            : 'onBlur'
			};
	
			for (key in callbacks) {
				if (callbacks.hasOwnProperty(key)) {
					fn = this.settings[callbacks[key]];
					if (fn) this.on(key, fn);
				}
			}
		},
	
		/**
		 * Triggered when the main control element
		 * has a click event.
		 *
		 * @param {object} e
		 * @return {boolean}
		 */
		onClick: function(e) {
			var self = this;
	
			// necessary for mobile webkit devices (manual focus triggering
			// is ignored unless invoked within a click event)
			if (!self.isFocused) {
				self.focus();
				e.preventDefault();
			}
		},
	
		/**
		 * Triggered when the main control element
		 * has a mouse down event.
		 *
		 * @param {object} e
		 * @return {boolean}
		 */
		onMouseDown: function(e) {
			var self = this;
			var defaultPrevented = e.isDefaultPrevented();
			var $target = $(e.target);
	
			if (self.isFocused) {
				// retain focus by preventing native handling. if the
				// event target is the input it should not be modified.
				// otherwise, text selection within the input won't work.
				if (e.target !== self.$control_input[0]) {
					if (self.settings.mode === 'single') {
						// toggle dropdown
						self.isOpen ? self.close() : self.open();
					} else if (!defaultPrevented) {
						self.setActiveItem(null);
					}
					return false;
				}
			} else {
				// give control focus
				if (!defaultPrevented) {
					window.setTimeout(function() {
						self.focus();
					}, 0);
				}
			}
		},
	
		/**
		 * Triggered when the value of the control has been changed.
		 * This should propagate the event to the original DOM
		 * input / select element.
		 */
		onChange: function() {
			this.$input.trigger('change');
		},
	
		/**
		 * Triggered on <input> paste.
		 *
		 * @param {object} e
		 * @returns {boolean}
		 */
		onPaste: function(e) {
			var self = this;
	
			if (self.isFull() || self.isInputHidden || self.isLocked) {
				e.preventDefault();
				return;
			}
	
			// If a regex or string is included, this will split the pasted
			// input and create Items for each separate value
			if (self.settings.splitOn) {
	
				// Wait for pasted text to be recognized in value
				setTimeout(function() {
					var pastedText = self.$control_input.val();
					if(!pastedText.match(self.settings.splitOn)){ return }
	
					var splitInput = $.trim(pastedText).split(self.settings.splitOn);
					for (var i = 0, n = splitInput.length; i < n; i++) {
						self.createItem(splitInput[i]);
					}
				}, 0);
			}
		},
	
		/**
		 * Triggered on <input> keypress.
		 *
		 * @param {object} e
		 * @returns {boolean}
		 */
		onKeyPress: function(e) {
			if (this.isLocked) return e && e.preventDefault();
			var character = String.fromCharCode(e.keyCode || e.which);
			if (this.settings.create && this.settings.mode === 'multi' && character === this.settings.delimiter) {
				this.createItem();
				e.preventDefault();
				return false;
			}
		},
	
		/**
		 * Triggered on <input> keydown.
		 *
		 * @param {object} e
		 * @returns {boolean}
		 */
		onKeyDown: function(e) {
			var isInput = e.target === this.$control_input[0];
			var self = this;
	
			if (self.isLocked) {
				if (e.keyCode !== KEY_TAB) {
					e.preventDefault();
				}
				return;
			}
	
			switch (e.keyCode) {
				case KEY_A:
					if (self.isCmdDown) {
						self.selectAll();
						return;
					}
					break;
				case KEY_ESC:
					if (self.isOpen) {
						e.preventDefault();
						e.stopPropagation();
						self.close();
					}
					return;
				case KEY_N:
					if (!e.ctrlKey || e.altKey) break;
				case KEY_DOWN:
					if (!self.isOpen && self.hasOptions) {
						self.open();
					} else if (self.$activeOption) {
						self.ignoreHover = true;
						var $next = self.getAdjacentOption(self.$activeOption, 1);
						if ($next.length) self.setActiveOption($next, true, true);
					}
					e.preventDefault();
					return;
				case KEY_P:
					if (!e.ctrlKey || e.altKey) break;
				case KEY_UP:
					if (self.$activeOption) {
						self.ignoreHover = true;
						var $prev = self.getAdjacentOption(self.$activeOption, -1);
						if ($prev.length) self.setActiveOption($prev, true, true);
					}
					e.preventDefault();
					return;
				case KEY_RETURN:
					if (self.isOpen && self.$activeOption) {
						self.onOptionSelect({currentTarget: self.$activeOption});
						e.preventDefault();
					}
					return;
				case KEY_LEFT:
					self.advanceSelection(-1, e);
					return;
				case KEY_RIGHT:
					self.advanceSelection(1, e);
					return;
				case KEY_TAB:
					if (self.settings.selectOnTab && self.isOpen && self.$activeOption) {
						self.onOptionSelect({currentTarget: self.$activeOption});
	
						// Default behaviour is to jump to the next field, we only want this
						// if the current field doesn't accept any more entries
						if (!self.isFull()) {
							e.preventDefault();
						}
					}
					if (self.settings.create && self.createItem()) {
						e.preventDefault();
					}
					return;
				case KEY_BACKSPACE:
				case KEY_DELETE:
					self.deleteSelection(e);
					return;
			}
	
			if ((self.isFull() || self.isInputHidden) && !(IS_MAC ? e.metaKey : e.ctrlKey)) {
				e.preventDefault();
				return;
			}
		},
	
		/**
		 * Triggered on <input> keyup.
		 *
		 * @param {object} e
		 * @returns {boolean}
		 */
		onKeyUp: function(e) {
			var self = this;
	
			if (self.isLocked) return e && e.preventDefault();
			var value = self.$control_input.val() || '';
			if (self.lastValue !== value) {
				self.lastValue = value;
				self.onSearchChange(value);
				self.refreshOptions();
				self.trigger('type', value);
			}
		},
	
		/**
		 * Invokes the user-provide option provider / loader.
		 *
		 * Note: this function is debounced in the Selectize
		 * constructor (by `settings.loadThrottle` milliseconds)
		 *
		 * @param {string} value
		 */
		onSearchChange: function(value) {
			var self = this;
			var fn = self.settings.load;
			if (!fn) return;
			if (self.loadedSearches.hasOwnProperty(value)) return;
			self.loadedSearches[value] = true;
			self.load(function(callback) {
				fn.apply(self, [value, callback]);
			});
		},
	
		/**
		 * Triggered on <input> focus.
		 *
		 * @param {object} e (optional)
		 * @returns {boolean}
		 */
		onFocus: function(e) {
			var self = this;
			var wasFocused = self.isFocused;
	
			if (self.isDisabled) {
				self.blur();
				e && e.preventDefault();
				return false;
			}
	
			if (self.ignoreFocus) return;
			self.isFocused = true;
			if (self.settings.preload === 'focus') self.onSearchChange('');
	
			if (!wasFocused) self.trigger('focus');
	
			if (!self.$activeItems.length) {
				self.showInput();
				self.setActiveItem(null);
				self.refreshOptions(!!self.settings.openOnFocus);
			}
	
			self.refreshState();
		},
	
		/**
		 * Triggered on <input> blur.
		 *
		 * @param {object} e
		 * @param {Element} dest
		 */
		onBlur: function(e, dest) {
			var self = this;
			if (!self.isFocused) return;
			self.isFocused = false;
	
			if (self.ignoreFocus) {
				return;
			} else if (!self.ignoreBlur && document.activeElement === self.$dropdown_content[0]) {
				// necessary to prevent IE closing the dropdown when the scrollbar is clicked
				self.ignoreBlur = true;
				self.onFocus(e);
				return;
			}
	
			var deactivate = function() {
				self.close();
				self.setTextboxValue('');
				self.setActiveItem(null);
				self.setActiveOption(null);
				self.setCaret(self.items.length);
				self.refreshState();
	
				// IE11 bug: element still marked as active
				dest && dest.focus && dest.focus();
	
				self.ignoreFocus = false;
				self.trigger('blur');
			};
	
			self.ignoreFocus = true;
			if (self.settings.create && self.settings.createOnBlur) {
				self.createItem(null, false, deactivate);
			} else {
				deactivate();
			}
		},
	
		/**
		 * Triggered when the user rolls over
		 * an option in the autocomplete dropdown menu.
		 *
		 * @param {object} e
		 * @returns {boolean}
		 */
		onOptionHover: function(e) {
			if (this.ignoreHover) return;
			this.setActiveOption(e.currentTarget, false);
		},
	
		/**
		 * Triggered when the user clicks on an option
		 * in the autocomplete dropdown menu.
		 *
		 * @param {object} e
		 * @returns {boolean}
		 */
		onOptionSelect: function(e) {
			var value, $target, $option, self = this;
	
			if (e.preventDefault) {
				e.preventDefault();
				e.stopPropagation();
			}
	
			$target = $(e.currentTarget);
			if ($target.hasClass('create')) {
				self.createItem(null, function() {
					if (self.settings.closeAfterSelect) {
						self.close();
					}
				});
			} else {
				value = $target.attr('data-value');
				if (typeof value !== 'undefined') {
					self.lastQuery = null;
					self.setTextboxValue('');
					self.addItem(value);
					if (self.settings.closeAfterSelect) {
						self.close();
					} else if (!self.settings.hideSelected && e.type && /mouse/.test(e.type)) {
						self.setActiveOption(self.getOption(value));
					}
				}
			}
		},
	
		/**
		 * Triggered when the user clicks on an item
		 * that has been selected.
		 *
		 * @param {object} e
		 * @returns {boolean}
		 */
		onItemSelect: function(e) {
			var self = this;
	
			if (self.isLocked) return;
			if (self.settings.mode === 'multi') {
				e.preventDefault();
				self.setActiveItem(e.currentTarget, e);
			}
		},
	
		/**
		 * Invokes the provided method that provides
		 * results to a callback---which are then added
		 * as options to the control.
		 *
		 * @param {function} fn
		 */
		load: function(fn) {
			var self = this;
			var $wrapper = self.$wrapper.addClass(self.settings.loadingClass);
	
			self.loading++;
			fn.apply(self, [function(results) {
				self.loading = Math.max(self.loading - 1, 0);
				if (results && results.length) {
					self.addOption(results);
					self.refreshOptions(self.isFocused && !self.isInputHidden);
				}
				if (!self.loading) {
					$wrapper.removeClass(self.settings.loadingClass);
				}
				self.trigger('load', results);
			}]);
		},
	
		/**
		 * Sets the input field of the control to the specified value.
		 *
		 * @param {string} value
		 */
		setTextboxValue: function(value) {
			var $input = this.$control_input;
			var changed = $input.val() !== value;
			if (changed) {
				$input.val(value).triggerHandler('update');
				this.lastValue = value;
			}
		},
	
		/**
		 * Returns the value of the control. If multiple items
		 * can be selected (e.g. <select multiple>), this returns
		 * an array. If only one item can be selected, this
		 * returns a string.
		 *
		 * @returns {mixed}
		 */
		getValue: function() {
			if (this.tagType === TAG_SELECT && this.$input.attr('multiple')) {
				return this.items;
			} else {
				return this.items.join(this.settings.delimiter);
			}
		},
	
		/**
		 * Resets the selected items to the given value.
		 *
		 * @param {mixed} value
		 */
		setValue: function(value, silent) {
			var events = silent ? [] : ['change'];
	
			debounce_events(this, events, function() {
				this.clear(silent);
				this.addItems(value, silent);
			});
		},
	
		/**
		 * Sets the selected item.
		 *
		 * @param {object} $item
		 * @param {object} e (optional)
		 */
		setActiveItem: function($item, e) {
			var self = this;
			var eventName;
			var i, idx, begin, end, item, swap;
			var $last;
	
			if (self.settings.mode === 'single') return;
			$item = $($item);
	
			// clear the active selection
			if (!$item.length) {
				$(self.$activeItems).removeClass('active');
				self.$activeItems = [];
				if (self.isFocused) {
					self.showInput();
				}
				return;
			}
	
			// modify selection
			eventName = e && e.type.toLowerCase();
	
			if (eventName === 'mousedown' && self.isShiftDown && self.$activeItems.length) {
				$last = self.$control.children('.active:last');
				begin = Array.prototype.indexOf.apply(self.$control[0].childNodes, [$last[0]]);
				end   = Array.prototype.indexOf.apply(self.$control[0].childNodes, [$item[0]]);
				if (begin > end) {
					swap  = begin;
					begin = end;
					end   = swap;
				}
				for (i = begin; i <= end; i++) {
					item = self.$control[0].childNodes[i];
					if (self.$activeItems.indexOf(item) === -1) {
						$(item).addClass('active');
						self.$activeItems.push(item);
					}
				}
				e.preventDefault();
			} else if ((eventName === 'mousedown' && self.isCtrlDown) || (eventName === 'keydown' && this.isShiftDown)) {
				if ($item.hasClass('active')) {
					idx = self.$activeItems.indexOf($item[0]);
					self.$activeItems.splice(idx, 1);
					$item.removeClass('active');
				} else {
					self.$activeItems.push($item.addClass('active')[0]);
				}
			} else {
				$(self.$activeItems).removeClass('active');
				self.$activeItems = [$item.addClass('active')[0]];
			}
	
			// ensure control has focus
			self.hideInput();
			if (!this.isFocused) {
				self.focus();
			}
		},
	
		/**
		 * Sets the selected item in the dropdown menu
		 * of available options.
		 *
		 * @param {object} $object
		 * @param {boolean} scroll
		 * @param {boolean} animate
		 */
		setActiveOption: function($option, scroll, animate) {
			var height_menu, height_item, y;
			var scroll_top, scroll_bottom;
			var self = this;
	
			if (self.$activeOption) self.$activeOption.removeClass('active');
			self.$activeOption = null;
	
			$option = $($option);
			if (!$option.length) return;
	
			self.$activeOption = $option.addClass('active');
	
			if (scroll || !isset(scroll)) {
	
				height_menu   = self.$dropdown_content.height();
				height_item   = self.$activeOption.outerHeight(true);
				scroll        = self.$dropdown_content.scrollTop() || 0;
				y             = self.$activeOption.offset().top - self.$dropdown_content.offset().top + scroll;
				scroll_top    = y;
				scroll_bottom = y - height_menu + height_item;
	
				if (y + height_item > height_menu + scroll) {
					self.$dropdown_content.stop().animate({scrollTop: scroll_bottom}, animate ? self.settings.scrollDuration : 0);
				} else if (y < scroll) {
					self.$dropdown_content.stop().animate({scrollTop: scroll_top}, animate ? self.settings.scrollDuration : 0);
				}
	
			}
		},
	
		/**
		 * Selects all items (CTRL + A).
		 */
		selectAll: function() {
			var self = this;
			if (self.settings.mode === 'single') return;
	
			self.$activeItems = Array.prototype.slice.apply(self.$control.children(':not(input)').addClass('active'));
			if (self.$activeItems.length) {
				self.hideInput();
				self.close();
			}
			self.focus();
		},
	
		/**
		 * Hides the input element out of view, while
		 * retaining its focus.
		 */
		hideInput: function() {
			var self = this;
	
			self.setTextboxValue('');
			self.$control_input.css({opacity: 0, position: 'absolute', left: self.rtl ? 10000 : -10000});
			self.isInputHidden = true;
		},
	
		/**
		 * Restores input visibility.
		 */
		showInput: function() {
			this.$control_input.css({opacity: 1, position: 'relative', left: 0});
			this.isInputHidden = false;
		},
	
		/**
		 * Gives the control focus.
		 */
		focus: function() {
			var self = this;
			if (self.isDisabled) return;
	
			self.ignoreFocus = true;
			self.$control_input[0].focus();
			window.setTimeout(function() {
				self.ignoreFocus = false;
				self.onFocus();
			}, 0);
		},
	
		/**
		 * Forces the control out of focus.
		 *
		 * @param {Element} dest
		 */
		blur: function(dest) {
			this.$control_input[0].blur();
			this.onBlur(null, dest);
		},
	
		/**
		 * Returns a function that scores an object
		 * to show how good of a match it is to the
		 * provided query.
		 *
		 * @param {string} query
		 * @param {object} options
		 * @return {function}
		 */
		getScoreFunction: function(query) {
			return this.sifter.getScoreFunction(query, this.getSearchOptions());
		},
	
		/**
		 * Returns search options for sifter (the system
		 * for scoring and sorting results).
		 *
		 * @see https://github.com/brianreavis/sifter.js
		 * @return {object}
		 */
		getSearchOptions: function() {
			var settings = this.settings;
			var sort = settings.sortField;
			if (typeof sort === 'string') {
				sort = [{field: sort}];
			}
	
			return {
				fields      : settings.searchField,
				conjunction : settings.searchConjunction,
				sort        : sort
			};
		},
	
		/**
		 * Searches through available options and returns
		 * a sorted array of matches.
		 *
		 * Returns an object containing:
		 *
		 *   - query {string}
		 *   - tokens {array}
		 *   - total {int}
		 *   - items {array}
		 *
		 * @param {string} query
		 * @returns {object}
		 */
		search: function(query) {
			var i, value, score, result, calculateScore;
			var self     = this;
			var settings = self.settings;
			var options  = this.getSearchOptions();
	
			// validate user-provided result scoring function
			if (settings.score) {
				calculateScore = self.settings.score.apply(this, [query]);
				if (typeof calculateScore !== 'function') {
					throw new Error('Selectize "score" setting must be a function that returns a function');
				}
			}
	
			// perform search
			if (query !== self.lastQuery) {
				self.lastQuery = query;
				result = self.sifter.search(query, $.extend(options, {score: calculateScore}));
				self.currentResults = result;
			} else {
				result = $.extend(true, {}, self.currentResults);
			}
	
			// filter out selected items
			if (settings.hideSelected) {
				for (i = result.items.length - 1; i >= 0; i--) {
					if (self.items.indexOf(hash_key(result.items[i].id)) !== -1) {
						result.items.splice(i, 1);
					}
				}
			}
	
			return result;
		},
	
		/**
		 * Refreshes the list of available options shown
		 * in the autocomplete dropdown menu.
		 *
		 * @param {boolean} triggerDropdown
		 */
		refreshOptions: function(triggerDropdown) {
			var i, j, k, n, groups, groups_order, option, option_html, optgroup, optgroups, html, html_children, has_create_option;
			var $active, $active_before, $create;
	
			if (typeof triggerDropdown === 'undefined') {
				triggerDropdown = true;
			}
	
			var self              = this;
			var query             = $.trim(self.$control_input.val());
			var results           = self.search(query);
			var $dropdown_content = self.$dropdown_content;
			var active_before     = self.$activeOption && hash_key(self.$activeOption.attr('data-value'));
	
			// build markup
			n = results.items.length;
			if (typeof self.settings.maxOptions === 'number') {
				n = Math.min(n, self.settings.maxOptions);
			}
	
			// render and group available options individually
			groups = {};
			groups_order = [];
	
			for (i = 0; i < n; i++) {
				option      = self.options[results.items[i].id];
				option_html = self.render('option', option);
				optgroup    = option[self.settings.optgroupField] || '';
				optgroups   = $.isArray(optgroup) ? optgroup : [optgroup];
	
				for (j = 0, k = optgroups && optgroups.length; j < k; j++) {
					optgroup = optgroups[j];
					if (!self.optgroups.hasOwnProperty(optgroup)) {
						optgroup = '';
					}
					if (!groups.hasOwnProperty(optgroup)) {
						groups[optgroup] = document.createDocumentFragment();
						groups_order.push(optgroup);
					}
					groups[optgroup].appendChild(option_html);
				}
			}
	
			// sort optgroups
			if (this.settings.lockOptgroupOrder) {
				groups_order.sort(function(a, b) {
					var a_order = self.optgroups[a].$order || 0;
					var b_order = self.optgroups[b].$order || 0;
					return a_order - b_order;
				});
			}
	
			// render optgroup headers & join groups
			html = document.createDocumentFragment();
			for (i = 0, n = groups_order.length; i < n; i++) {
				optgroup = groups_order[i];
				if (self.optgroups.hasOwnProperty(optgroup) && groups[optgroup].childNodes.length) {
					// render the optgroup header and options within it,
					// then pass it to the wrapper template
					html_children = document.createDocumentFragment();
					html_children.appendChild(self.render('optgroup_header', self.optgroups[optgroup]));
					html_children.appendChild(groups[optgroup]);
	
					html.appendChild(self.render('optgroup', $.extend({}, self.optgroups[optgroup], {
						html: domToString(html_children),
						dom:  html_children
					})));
				} else {
					html.appendChild(groups[optgroup]);
				}
			}
	
			$dropdown_content.html(html);
	
			// highlight matching terms inline
			if (self.settings.highlight && results.query.length && results.tokens.length) {
				$dropdown_content.removeHighlight();
				for (i = 0, n = results.tokens.length; i < n; i++) {
					highlight($dropdown_content, results.tokens[i].regex);
				}
			}
	
			// add "selected" class to selected options
			if (!self.settings.hideSelected) {
				for (i = 0, n = self.items.length; i < n; i++) {
					self.getOption(self.items[i]).addClass('selected');
				}
			}
	
			// add create option
			has_create_option = self.canCreate(query);
			if (has_create_option) {
				$dropdown_content.prepend(self.render('option_create', {input: query}));
				$create = $($dropdown_content[0].childNodes[0]);
			}
	
			// activate
			self.hasOptions = results.items.length > 0 || has_create_option;
			if (self.hasOptions) {
				if (results.items.length > 0) {
					$active_before = active_before && self.getOption(active_before);
					if ($active_before && $active_before.length) {
						$active = $active_before;
					} else if (self.settings.mode === 'single' && self.items.length) {
						$active = self.getOption(self.items[0]);
					}
					if (!$active || !$active.length) {
						if ($create && !self.settings.addPrecedence) {
							$active = self.getAdjacentOption($create, 1);
						} else {
							$active = $dropdown_content.find('[data-selectable]:first');
						}
					}
				} else {
					$active = $create;
				}
				self.setActiveOption($active);
				if (triggerDropdown && !self.isOpen) { self.open(); }
			} else {
				self.setActiveOption(null);
				if (triggerDropdown && self.isOpen) { self.close(); }
			}
		},
	
		/**
		 * Adds an available option. If it already exists,
		 * nothing will happen. Note: this does not refresh
		 * the options list dropdown (use `refreshOptions`
		 * for that).
		 *
		 * Usage:
		 *
		 *   this.addOption(data)
		 *
		 * @param {object|array} data
		 */
		addOption: function(data) {
			var i, n, value, self = this;
	
			if ($.isArray(data)) {
				for (i = 0, n = data.length; i < n; i++) {
					self.addOption(data[i]);
				}
				return;
			}
	
			if (value = self.registerOption(data)) {
				self.userOptions[value] = true;
				self.lastQuery = null;
				self.trigger('option_add', value, data);
			}
		},
	
		/**
		 * Registers an option to the pool of options.
		 *
		 * @param {object} data
		 * @return {boolean|string}
		 */
		registerOption: function(data) {
			var key = hash_key(data[this.settings.valueField]);
			if (typeof key === 'undefined' || key === null || this.options.hasOwnProperty(key)) return false;
			data.$order = data.$order || ++this.order;
			this.options[key] = data;
			return key;
		},
	
		/**
		 * Registers an option group to the pool of option groups.
		 *
		 * @param {object} data
		 * @return {boolean|string}
		 */
		registerOptionGroup: function(data) {
			var key = hash_key(data[this.settings.optgroupValueField]);
			if (!key) return false;
	
			data.$order = data.$order || ++this.order;
			this.optgroups[key] = data;
			return key;
		},
	
		/**
		 * Registers a new optgroup for options
		 * to be bucketed into.
		 *
		 * @param {string} id
		 * @param {object} data
		 */
		addOptionGroup: function(id, data) {
			data[this.settings.optgroupValueField] = id;
			if (id = this.registerOptionGroup(data)) {
				this.trigger('optgroup_add', id, data);
			}
		},
	
		/**
		 * Removes an existing option group.
		 *
		 * @param {string} id
		 */
		removeOptionGroup: function(id) {
			if (this.optgroups.hasOwnProperty(id)) {
				delete this.optgroups[id];
				this.renderCache = {};
				this.trigger('optgroup_remove', id);
			}
		},
	
		/**
		 * Clears all existing option groups.
		 */
		clearOptionGroups: function() {
			this.optgroups = {};
			this.renderCache = {};
			this.trigger('optgroup_clear');
		},
	
		/**
		 * Updates an option available for selection. If
		 * it is visible in the selected items or options
		 * dropdown, it will be re-rendered automatically.
		 *
		 * @param {string} value
		 * @param {object} data
		 */
		updateOption: function(value, data) {
			var self = this;
			var $item, $item_new;
			var value_new, index_item, cache_items, cache_options, order_old;
	
			value     = hash_key(value);
			value_new = hash_key(data[self.settings.valueField]);
	
			// sanity checks
			if (value === null) return;
			if (!self.options.hasOwnProperty(value)) return;
			if (typeof value_new !== 'string') throw new Error('Value must be set in option data');
	
			order_old = self.options[value].$order;
	
			// update references
			if (value_new !== value) {
				delete self.options[value];
				index_item = self.items.indexOf(value);
				if (index_item !== -1) {
					self.items.splice(index_item, 1, value_new);
				}
			}
			data.$order = data.$order || order_old;
			self.options[value_new] = data;
	
			// invalidate render cache
			cache_items = self.renderCache['item'];
			cache_options = self.renderCache['option'];
	
			if (cache_items) {
				delete cache_items[value];
				delete cache_items[value_new];
			}
			if (cache_options) {
				delete cache_options[value];
				delete cache_options[value_new];
			}
	
			// update the item if it's selected
			if (self.items.indexOf(value_new) !== -1) {
				$item = self.getItem(value);
				$item_new = $(self.render('item', data));
				if ($item.hasClass('active')) $item_new.addClass('active');
				$item.replaceWith($item_new);
			}
	
			// invalidate last query because we might have updated the sortField
			self.lastQuery = null;
	
			// update dropdown contents
			if (self.isOpen) {
				self.refreshOptions(false);
			}
		},
	
		/**
		 * Removes a single option.
		 *
		 * @param {string} value
		 * @param {boolean} silent
		 */
		removeOption: function(value, silent) {
			var self = this;
			value = hash_key(value);
	
			var cache_items = self.renderCache['item'];
			var cache_options = self.renderCache['option'];
			if (cache_items) delete cache_items[value];
			if (cache_options) delete cache_options[value];
	
			delete self.userOptions[value];
			delete self.options[value];
			self.lastQuery = null;
			self.trigger('option_remove', value);
			self.removeItem(value, silent);
		},
	
		/**
		 * Clears all options.
		 */
		clearOptions: function() {
			var self = this;
	
			self.loadedSearches = {};
			self.userOptions = {};
			self.renderCache = {};
			self.options = self.sifter.items = {};
			self.lastQuery = null;
			self.trigger('option_clear');
			self.clear();
		},
	
		/**
		 * Returns the jQuery element of the option
		 * matching the given value.
		 *
		 * @param {string} value
		 * @returns {object}
		 */
		getOption: function(value) {
			return this.getElementWithValue(value, this.$dropdown_content.find('[data-selectable]'));
		},
	
		/**
		 * Returns the jQuery element of the next or
		 * previous selectable option.
		 *
		 * @param {object} $option
		 * @param {int} direction  can be 1 for next or -1 for previous
		 * @return {object}
		 */
		getAdjacentOption: function($option, direction) {
			var $options = this.$dropdown.find('[data-selectable]');
			var index    = $options.index($option) + direction;
	
			return index >= 0 && index < $options.length ? $options.eq(index) : $();
		},
	
		/**
		 * Finds the first element with a "data-value" attribute
		 * that matches the given value.
		 *
		 * @param {mixed} value
		 * @param {object} $els
		 * @return {object}
		 */
		getElementWithValue: function(value, $els) {
			value = hash_key(value);
	
			if (typeof value !== 'undefined' && value !== null) {
				for (var i = 0, n = $els.length; i < n; i++) {
					if ($els[i].getAttribute('data-value') === value) {
						return $($els[i]);
					}
				}
			}
	
			return $();
		},
	
		/**
		 * Returns the jQuery element of the item
		 * matching the given value.
		 *
		 * @param {string} value
		 * @returns {object}
		 */
		getItem: function(value) {
			return this.getElementWithValue(value, this.$control.children());
		},
	
		/**
		 * "Selects" multiple items at once. Adds them to the list
		 * at the current caret position.
		 *
		 * @param {string} value
		 * @param {boolean} silent
		 */
		addItems: function(values, silent) {
			var items = $.isArray(values) ? values : [values];
			for (var i = 0, n = items.length; i < n; i++) {
				this.isPending = (i < n - 1);
				this.addItem(items[i], silent);
			}
		},
	
		/**
		 * "Selects" an item. Adds it to the list
		 * at the current caret position.
		 *
		 * @param {string} value
		 * @param {boolean} silent
		 */
		addItem: function(value, silent) {
			var events = silent ? [] : ['change'];
	
			debounce_events(this, events, function() {
				var $item, $option, $options;
				var self = this;
				var inputMode = self.settings.mode;
				var i, active, value_next, wasFull;
				value = hash_key(value);
	
				if (self.items.indexOf(value) !== -1) {
					if (inputMode === 'single') self.close();
					return;
				}
	
				if (!self.options.hasOwnProperty(value)) return;
				if (inputMode === 'single') self.clear(silent);
				if (inputMode === 'multi' && self.isFull()) return;
	
				$item = $(self.render('item', self.options[value]));
				wasFull = self.isFull();
				self.items.splice(self.caretPos, 0, value);
				self.insertAtCaret($item);
				if (!self.isPending || (!wasFull && self.isFull())) {
					self.refreshState();
				}
	
				if (self.isSetup) {
					$options = self.$dropdown_content.find('[data-selectable]');
	
					// update menu / remove the option (if this is not one item being added as part of series)
					if (!self.isPending) {
						$option = self.getOption(value);
						value_next = self.getAdjacentOption($option, 1).attr('data-value');
						self.refreshOptions(self.isFocused && inputMode !== 'single');
						if (value_next) {
							self.setActiveOption(self.getOption(value_next));
						}
					}
	
					// hide the menu if the maximum number of items have been selected or no options are left
					if (!$options.length || self.isFull()) {
						self.close();
					} else {
						self.positionDropdown();
					}
	
					self.updatePlaceholder();
					self.trigger('item_add', value, $item);
					self.updateOriginalInput({silent: silent});
				}
			});
		},
	
		/**
		 * Removes the selected item matching
		 * the provided value.
		 *
		 * @param {string} value
		 */
		removeItem: function(value, silent) {
			var self = this;
			var $item, i, idx;
	
			$item = (value instanceof $) ? value : self.getItem(value);
			value = hash_key($item.attr('data-value'));
			i = self.items.indexOf(value);
	
			if (i !== -1) {
				$item.remove();
				if ($item.hasClass('active')) {
					idx = self.$activeItems.indexOf($item[0]);
					self.$activeItems.splice(idx, 1);
				}
	
				self.items.splice(i, 1);
				self.lastQuery = null;
				if (!self.settings.persist && self.userOptions.hasOwnProperty(value)) {
					self.removeOption(value, silent);
				}
	
				if (i < self.caretPos) {
					self.setCaret(self.caretPos - 1);
				}
	
				self.refreshState();
				self.updatePlaceholder();
				self.updateOriginalInput({silent: silent});
				self.positionDropdown();
				self.trigger('item_remove', value, $item);
			}
		},
	
		/**
		 * Invokes the `create` method provided in the
		 * selectize options that should provide the data
		 * for the new item, given the user input.
		 *
		 * Once this completes, it will be added
		 * to the item list.
		 *
		 * @param {string} value
		 * @param {boolean} [triggerDropdown]
		 * @param {function} [callback]
		 * @return {boolean}
		 */
		createItem: function(input, triggerDropdown) {
			var self  = this;
			var caret = self.caretPos;
			input = input || $.trim(self.$control_input.val() || '');
	
			var callback = arguments[arguments.length - 1];
			if (typeof callback !== 'function') callback = function() {};
	
			if (typeof triggerDropdown !== 'boolean') {
				triggerDropdown = true;
			}
	
			if (!self.canCreate(input)) {
				callback();
				return false;
			}
	
			self.lock();
	
			var setup = (typeof self.settings.create === 'function') ? this.settings.create : function(input) {
				var data = {};
				data[self.settings.labelField] = input;
				data[self.settings.valueField] = input;
				return data;
			};
	
			var create = once(function(data) {
				self.unlock();
	
				if (!data || typeof data !== 'object') return callback();
				var value = hash_key(data[self.settings.valueField]);
				if (typeof value !== 'string') return callback();
	
				self.setTextboxValue('');
				self.addOption(data);
				self.setCaret(caret);
				self.addItem(value);
				self.refreshOptions(triggerDropdown && self.settings.mode !== 'single');
				callback(data);
			});
	
			var output = setup.apply(this, [input, create]);
			if (typeof output !== 'undefined') {
				create(output);
			}
	
			return true;
		},
	
		/**
		 * Re-renders the selected item lists.
		 */
		refreshItems: function() {
			this.lastQuery = null;
	
			if (this.isSetup) {
				this.addItem(this.items);
			}
	
			this.refreshState();
			this.updateOriginalInput();
		},
	
		/**
		 * Updates all state-dependent attributes
		 * and CSS classes.
		 */
		refreshState: function() {
			this.refreshValidityState();
			this.refreshClasses();
		},
	
		/**
		 * Update the `required` attribute of both input and control input.
		 *
		 * The `required` property needs to be activated on the control input
		 * for the error to be displayed at the right place. `required` also
		 * needs to be temporarily deactivated on the input since the input is
		 * hidden and can't show errors.
		 */
		refreshValidityState: function() {
			if (!this.isRequired) return false;
	
			var invalid = !this.items.length;
	
			this.isInvalid = invalid;
			this.$control_input.prop('required', invalid);
			this.$input.prop('required', !invalid);
		},
	
		/**
		 * Updates all state-dependent CSS classes.
		 */
		refreshClasses: function() {
			var self     = this;
			var isFull   = self.isFull();
			var isLocked = self.isLocked;
	
			self.$wrapper
				.toggleClass('rtl', self.rtl);
	
			self.$control
				.toggleClass('focus', self.isFocused)
				.toggleClass('disabled', self.isDisabled)
				.toggleClass('required', self.isRequired)
				.toggleClass('invalid', self.isInvalid)
				.toggleClass('locked', isLocked)
				.toggleClass('full', isFull).toggleClass('not-full', !isFull)
				.toggleClass('input-active', self.isFocused && !self.isInputHidden)
				.toggleClass('dropdown-active', self.isOpen)
				.toggleClass('has-options', !$.isEmptyObject(self.options))
				.toggleClass('has-items', self.items.length > 0);
	
			self.$control_input.data('grow', !isFull && !isLocked);
		},
	
		/**
		 * Determines whether or not more items can be added
		 * to the control without exceeding the user-defined maximum.
		 *
		 * @returns {boolean}
		 */
		isFull: function() {
			return this.settings.maxItems !== null && this.items.length >= this.settings.maxItems;
		},
	
		/**
		 * Refreshes the original <select> or <input>
		 * element to reflect the current state.
		 */
		updateOriginalInput: function(opts) {
			var i, n, options, label, self = this;
			opts = opts || {};
	
			if (self.tagType === TAG_SELECT) {
				options = [];
				for (i = 0, n = self.items.length; i < n; i++) {
					label = self.options[self.items[i]][self.settings.labelField] || '';
					options.push('<option value="' + escape_html(self.items[i]) + '" selected="selected">' + escape_html(label) + '</option>');
				}
				if (!options.length && !this.$input.attr('multiple')) {
					options.push('<option value="" selected="selected"></option>');
				}
				self.$input.html(options.join(''));
			} else {
				self.$input.val(self.getValue());
				self.$input.attr('value',self.$input.val());
			}
	
			if (self.isSetup) {
				if (!opts.silent) {
					self.trigger('change', self.$input.val());
				}
			}
		},
	
		/**
		 * Shows/hide the input placeholder depending
		 * on if there items in the list already.
		 */
		updatePlaceholder: function() {
			if (!this.settings.placeholder) return;
			var $input = this.$control_input;
	
			if (this.items.length) {
				$input.removeAttr('placeholder');
			} else {
				$input.attr('placeholder', this.settings.placeholder);
			}
			$input.triggerHandler('update', {force: true});
		},
	
		/**
		 * Shows the autocomplete dropdown containing
		 * the available options.
		 */
		open: function() {
			var self = this;
	
			if (self.isLocked || self.isOpen || (self.settings.mode === 'multi' && self.isFull())) return;
			self.focus();
			self.isOpen = true;
			self.refreshState();
			self.$dropdown.css({visibility: 'hidden', display: 'block'});
			self.positionDropdown();
			self.$dropdown.css({visibility: 'visible'});
			self.trigger('dropdown_open', self.$dropdown);
		},
	
		/**
		 * Closes the autocomplete dropdown menu.
		 */
		close: function() {
			var self = this;
			var trigger = self.isOpen;
	
			if (self.settings.mode === 'single' && self.items.length) {
				self.hideInput();
				self.$control_input.blur(); // close keyboard on iOS
			}
	
			self.isOpen = false;
			self.$dropdown.hide();
			self.setActiveOption(null);
			self.refreshState();
	
			if (trigger) self.trigger('dropdown_close', self.$dropdown);
		},
	
		/**
		 * Calculates and applies the appropriate
		 * position of the dropdown.
		 */
		positionDropdown: function() {
			var $control = this.$control;
			var offset = this.settings.dropdownParent === 'body' ? $control.offset() : $control.position();
			offset.top += $control.outerHeight(true);
	
			this.$dropdown.css({
				width : $control.outerWidth(),
				top   : offset.top,
				left  : offset.left
			});
		},
	
		/**
		 * Resets / clears all selected items
		 * from the control.
		 *
		 * @param {boolean} silent
		 */
		clear: function(silent) {
			var self = this;
	
			if (!self.items.length) return;
			self.$control.children(':not(input)').remove();
			self.items = [];
			self.lastQuery = null;
			self.setCaret(0);
			self.setActiveItem(null);
			self.updatePlaceholder();
			self.updateOriginalInput({silent: silent});
			self.refreshState();
			self.showInput();
			self.trigger('clear');
		},
	
		/**
		 * A helper method for inserting an element
		 * at the current caret position.
		 *
		 * @param {object} $el
		 */
		insertAtCaret: function($el) {
			var caret = Math.min(this.caretPos, this.items.length);
			if (caret === 0) {
				this.$control.prepend($el);
			} else {
				$(this.$control[0].childNodes[caret]).before($el);
			}
			this.setCaret(caret + 1);
		},
	
		/**
		 * Removes the current selected item(s).
		 *
		 * @param {object} e (optional)
		 * @returns {boolean}
		 */
		deleteSelection: function(e) {
			var i, n, direction, selection, values, caret, option_select, $option_select, $tail;
			var self = this;
	
			direction = (e && e.keyCode === KEY_BACKSPACE) ? -1 : 1;
			selection = getSelection(self.$control_input[0]);
	
			if (self.$activeOption && !self.settings.hideSelected) {
				option_select = self.getAdjacentOption(self.$activeOption, -1).attr('data-value');
			}
	
			// determine items that will be removed
			values = [];
	
			if (self.$activeItems.length) {
				$tail = self.$control.children('.active:' + (direction > 0 ? 'last' : 'first'));
				caret = self.$control.children(':not(input)').index($tail);
				if (direction > 0) { caret++; }
	
				for (i = 0, n = self.$activeItems.length; i < n; i++) {
					values.push($(self.$activeItems[i]).attr('data-value'));
				}
				if (e) {
					e.preventDefault();
					e.stopPropagation();
				}
			} else if ((self.isFocused || self.settings.mode === 'single') && self.items.length) {
				if (direction < 0 && selection.start === 0 && selection.length === 0) {
					values.push(self.items[self.caretPos - 1]);
				} else if (direction > 0 && selection.start === self.$control_input.val().length) {
					values.push(self.items[self.caretPos]);
				}
			}
	
			// allow the callback to abort
			if (!values.length || (typeof self.settings.onDelete === 'function' && self.settings.onDelete.apply(self, [values]) === false)) {
				return false;
			}
	
			// perform removal
			if (typeof caret !== 'undefined') {
				self.setCaret(caret);
			}
			while (values.length) {
				self.removeItem(values.pop());
			}
	
			self.showInput();
			self.positionDropdown();
			self.refreshOptions(true);
	
			// select previous option
			if (option_select) {
				$option_select = self.getOption(option_select);
				if ($option_select.length) {
					self.setActiveOption($option_select);
				}
			}
	
			return true;
		},
	
		/**
		 * Selects the previous / next item (depending
		 * on the `direction` argument).
		 *
		 * > 0 - right
		 * < 0 - left
		 *
		 * @param {int} direction
		 * @param {object} e (optional)
		 */
		advanceSelection: function(direction, e) {
			var tail, selection, idx, valueLength, cursorAtEdge, $tail;
			var self = this;
	
			if (direction === 0) return;
			if (self.rtl) direction *= -1;
	
			tail = direction > 0 ? 'last' : 'first';
			selection = getSelection(self.$control_input[0]);
	
			if (self.isFocused && !self.isInputHidden) {
				valueLength = self.$control_input.val().length;
				cursorAtEdge = direction < 0
					? selection.start === 0 && selection.length === 0
					: selection.start === valueLength;
	
				if (cursorAtEdge && !valueLength) {
					self.advanceCaret(direction, e);
				}
			} else {
				$tail = self.$control.children('.active:' + tail);
				if ($tail.length) {
					idx = self.$control.children(':not(input)').index($tail);
					self.setActiveItem(null);
					self.setCaret(direction > 0 ? idx + 1 : idx);
				}
			}
		},
	
		/**
		 * Moves the caret left / right.
		 *
		 * @param {int} direction
		 * @param {object} e (optional)
		 */
		advanceCaret: function(direction, e) {
			var self = this, fn, $adj;
	
			if (direction === 0) return;
	
			fn = direction > 0 ? 'next' : 'prev';
			if (self.isShiftDown) {
				$adj = self.$control_input[fn]();
				if ($adj.length) {
					self.hideInput();
					self.setActiveItem($adj);
					e && e.preventDefault();
				}
			} else {
				self.setCaret(self.caretPos + direction);
			}
		},
	
		/**
		 * Moves the caret to the specified index.
		 *
		 * @param {int} i
		 */
		setCaret: function(i) {
			var self = this;
	
			if (self.settings.mode === 'single') {
				i = self.items.length;
			} else {
				i = Math.max(0, Math.min(self.items.length, i));
			}
	
			if(!self.isPending) {
				// the input must be moved by leaving it in place and moving the
				// siblings, due to the fact that focus cannot be restored once lost
				// on mobile webkit devices
				var j, n, fn, $children, $child;
				$children = self.$control.children(':not(input)');
				for (j = 0, n = $children.length; j < n; j++) {
					$child = $($children[j]).detach();
					if (j <  i) {
						self.$control_input.before($child);
					} else {
						self.$control.append($child);
					}
				}
			}
	
			self.caretPos = i;
		},
	
		/**
		 * Disables user input on the control. Used while
		 * items are being asynchronously created.
		 */
		lock: function() {
			this.close();
			this.isLocked = true;
			this.refreshState();
		},
	
		/**
		 * Re-enables user input on the control.
		 */
		unlock: function() {
			this.isLocked = false;
			this.refreshState();
		},
	
		/**
		 * Disables user input on the control completely.
		 * While disabled, it cannot receive focus.
		 */
		disable: function() {
			var self = this;
			self.$input.prop('disabled', true);
			self.$control_input.prop('disabled', true).prop('tabindex', -1);
			self.isDisabled = true;
			self.lock();
		},
	
		/**
		 * Enables the control so that it can respond
		 * to focus and user input.
		 */
		enable: function() {
			var self = this;
			self.$input.prop('disabled', false);
			self.$control_input.prop('disabled', false).prop('tabindex', self.tabIndex);
			self.isDisabled = false;
			self.unlock();
		},
	
		/**
		 * Completely destroys the control and
		 * unbinds all event listeners so that it can
		 * be garbage collected.
		 */
		destroy: function() {
			var self = this;
			var eventNS = self.eventNS;
			var revertSettings = self.revertSettings;
	
			self.trigger('destroy');
			self.off();
			self.$wrapper.remove();
			self.$dropdown.remove();
	
			self.$input
				.html('')
				.append(revertSettings.$children)
				.removeAttr('tabindex')
				.removeClass('selectized')
				.attr({tabindex: revertSettings.tabindex})
				.show();
	
			self.$control_input.removeData('grow');
			self.$input.removeData('selectize');
	
			$(window).off(eventNS);
			$(document).off(eventNS);
			$(document.body).off(eventNS);
	
			delete self.$input[0].selectize;
		},
	
		/**
		 * A helper method for rendering "item" and
		 * "option" templates, given the data.
		 *
		 * @param {string} templateName
		 * @param {object} data
		 * @returns {string}
		 */
		render: function(templateName, data) {
			var value, id, label;
			var html = '';
			var cache = false;
			var self = this;
			var regex_tag = /^[\t \r\n]*<([a-z][a-z0-9\-_]*(?:\:[a-z][a-z0-9\-_]*)?)/i;
	
			if (templateName === 'option' || templateName === 'item') {
				value = hash_key(data[self.settings.valueField]);
				cache = !!value;
			}
	
			// pull markup from cache if it exists
			if (cache) {
				if (!isset(self.renderCache[templateName])) {
					self.renderCache[templateName] = {};
				}
				if (self.renderCache[templateName].hasOwnProperty(value)) {
					return self.renderCache[templateName][value];
				}
			}
	
			// render markup
			html = $(self.settings.render[templateName].apply(this, [data, escape_html]));
	
			// add mandatory attributes
			if (templateName === 'option' || templateName === 'option_create') {
				html.attr('data-selectable', '');
			}
			else if (templateName === 'optgroup') {
				id = data[self.settings.optgroupValueField] || '';
				html.attr('data-group', id);
			}
			if (templateName === 'option' || templateName === 'item') {
				html.attr('data-value', value || '');
			}
	
			// update cache
			if (cache) {
				self.renderCache[templateName][value] = html[0];
			}
	
			return html[0];
		},
	
		/**
		 * Clears the render cache for a template. If
		 * no template is given, clears all render
		 * caches.
		 *
		 * @param {string} templateName
		 */
		clearCache: function(templateName) {
			var self = this;
			if (typeof templateName === 'undefined') {
				self.renderCache = {};
			} else {
				delete self.renderCache[templateName];
			}
		},
	
		/**
		 * Determines whether or not to display the
		 * create item prompt, given a user input.
		 *
		 * @param {string} input
		 * @return {boolean}
		 */
		canCreate: function(input) {
			var self = this;
			if (!self.settings.create) return false;
			var filter = self.settings.createFilter;
			return input.length
				&& (typeof filter !== 'function' || filter.apply(self, [input]))
				&& (typeof filter !== 'string' || new RegExp(filter).test(input))
				&& (!(filter instanceof RegExp) || filter.test(input));
		}
	
	});
	
	
	Selectize.count = 0;
	Selectize.defaults = {
		options: [],
		optgroups: [],
	
		plugins: [],
		delimiter: ',',
		splitOn: null, // regexp or string for splitting up values from a paste command
		persist: true,
		diacritics: true,
		create: false,
		createOnBlur: false,
		createFilter: null,
		highlight: true,
		openOnFocus: true,
		maxOptions: 1000,
		maxItems: null,
		hideSelected: null,
		addPrecedence: false,
		selectOnTab: false,
		preload: false,
		allowEmptyOption: false,
		closeAfterSelect: false,
	
		scrollDuration: 60,
		loadThrottle: 300,
		loadingClass: 'loading',
	
		dataAttr: 'data-data',
		optgroupField: 'optgroup',
		valueField: 'value',
		labelField: 'text',
		optgroupLabelField: 'label',
		optgroupValueField: 'value',
		lockOptgroupOrder: false,
	
		sortField: '$order',
		searchField: ['text'],
		searchConjunction: 'and',
	
		mode: null,
		wrapperClass: 'selectize-control',
		inputClass: 'selectize-input',
		dropdownClass: 'selectize-dropdown',
		dropdownContentClass: 'selectize-dropdown-content',
	
		dropdownParent: null,
	
		copyClassesToDropdown: true,
	
		/*
		load                 : null, // function(query, callback) { ... }
		score                : null, // function(search) { ... }
		onInitialize         : null, // function() { ... }
		onChange             : null, // function(value) { ... }
		onItemAdd            : null, // function(value, $item) { ... }
		onItemRemove         : null, // function(value) { ... }
		onClear              : null, // function() { ... }
		onOptionAdd          : null, // function(value, data) { ... }
		onOptionRemove       : null, // function(value) { ... }
		onOptionClear        : null, // function() { ... }
		onOptionGroupAdd     : null, // function(id, data) { ... }
		onOptionGroupRemove  : null, // function(id) { ... }
		onOptionGroupClear   : null, // function() { ... }
		onDropdownOpen       : null, // function($dropdown) { ... }
		onDropdownClose      : null, // function($dropdown) { ... }
		onType               : null, // function(str) { ... }
		onDelete             : null, // function(values) { ... }
		*/
	
		render: {
			/*
			item: null,
			optgroup: null,
			optgroup_header: null,
			option: null,
			option_create: null
			*/
		}
	};
	
	
	$.fn.selectize = function(settings_user) {
		var defaults             = $.fn.selectize.defaults;
		var settings             = $.extend({}, defaults, settings_user);
		var attr_data            = settings.dataAttr;
		var field_label          = settings.labelField;
		var field_value          = settings.valueField;
		var field_optgroup       = settings.optgroupField;
		var field_optgroup_label = settings.optgroupLabelField;
		var field_optgroup_value = settings.optgroupValueField;
	
		/**
		 * Initializes selectize from a <input type="text"> element.
		 *
		 * @param {object} $input
		 * @param {object} settings_element
		 */
		var init_textbox = function($input, settings_element) {
			var i, n, values, option;
	
			var data_raw = $input.attr(attr_data);
	
			if (!data_raw) {
				var value = $.trim($input.val() || '');
				if (!settings.allowEmptyOption && !value.length) return;
				values = value.split(settings.delimiter);
				for (i = 0, n = values.length; i < n; i++) {
					option = {};
					option[field_label] = values[i];
					option[field_value] = values[i];
					settings_element.options.push(option);
				}
				settings_element.items = values;
			} else {
				settings_element.options = JSON.parse(data_raw);
				for (i = 0, n = settings_element.options.length; i < n; i++) {
					settings_element.items.push(settings_element.options[i][field_value]);
				}
			}
		};
	
		/**
		 * Initializes selectize from a <select> element.
		 *
		 * @param {object} $input
		 * @param {object} settings_element
		 */
		var init_select = function($input, settings_element) {
			var i, n, tagName, $children, order = 0;
			var options = settings_element.options;
			var optionsMap = {};
	
			var readData = function($el) {
				var data = attr_data && $el.attr(attr_data);
				if (typeof data === 'string' && data.length) {
					return JSON.parse(data);
				}
				return null;
			};
	
			var addOption = function($option, group) {
				$option = $($option);
	
				var value = hash_key($option.val());
				if (!value && !settings.allowEmptyOption) return;
	
				// if the option already exists, it's probably been
				// duplicated in another optgroup. in this case, push
				// the current group to the "optgroup" property on the
				// existing option so that it's rendered in both places.
				if (optionsMap.hasOwnProperty(value)) {
					if (group) {
						var arr = optionsMap[value][field_optgroup];
						if (!arr) {
							optionsMap[value][field_optgroup] = group;
						} else if (!$.isArray(arr)) {
							optionsMap[value][field_optgroup] = [arr, group];
						} else {
							arr.push(group);
						}
					}
					return;
				}
	
				var option             = readData($option) || {};
				option[field_label]    = option[field_label] || $option.text();
				option[field_value]    = option[field_value] || value;
				option[field_optgroup] = option[field_optgroup] || group;
	
				optionsMap[value] = option;
				options.push(option);
	
				if ($option.is(':selected')) {
					settings_element.items.push(value);
				}
			};
	
			var addGroup = function($optgroup) {
				var i, n, id, optgroup, $options;
	
				$optgroup = $($optgroup);
				id = $optgroup.attr('label');
	
				if (id) {
					optgroup = readData($optgroup) || {};
					optgroup[field_optgroup_label] = id;
					optgroup[field_optgroup_value] = id;
					settings_element.optgroups.push(optgroup);
				}
	
				$options = $('option', $optgroup);
				for (i = 0, n = $options.length; i < n; i++) {
					addOption($options[i], id);
				}
			};
	
			settings_element.maxItems = $input.attr('multiple') ? null : 1;
	
			$children = $input.children();
			for (i = 0, n = $children.length; i < n; i++) {
				tagName = $children[i].tagName.toLowerCase();
				if (tagName === 'optgroup') {
					addGroup($children[i]);
				} else if (tagName === 'option') {
					addOption($children[i]);
				}
			}
		};
	
		return this.each(function() {
			if (this.selectize) return;
	
			var instance;
			var $input = $(this);
			var tag_name = this.tagName.toLowerCase();
			var placeholder = $input.attr('placeholder') || $input.attr('data-placeholder');
			if (!placeholder && !settings.allowEmptyOption) {
				placeholder = $input.children('option[value=""]').text();
			}
	
			var settings_element = {
				'placeholder' : placeholder,
				'options'     : [],
				'optgroups'   : [],
				'items'       : []
			};
	
			if (tag_name === 'select') {
				init_select($input, settings_element);
			} else {
				init_textbox($input, settings_element);
			}
	
			instance = new Selectize($input, $.extend(true, {}, defaults, settings_element, settings_user));
		});
	};
	
	$.fn.selectize.defaults = Selectize.defaults;
	$.fn.selectize.support = {
		validity: SUPPORTS_VALIDITY_API
	};
	
	
	Selectize.define('drag_drop', function(options) {
		if (!$.fn.sortable) throw new Error('The "drag_drop" plugin requires jQuery UI "sortable".');
		if (this.settings.mode !== 'multi') return;
		var self = this;
	
		self.lock = (function() {
			var original = self.lock;
			return function() {
				var sortable = self.$control.data('sortable');
				if (sortable) sortable.disable();
				return original.apply(self, arguments);
			};
		})();
	
		self.unlock = (function() {
			var original = self.unlock;
			return function() {
				var sortable = self.$control.data('sortable');
				if (sortable) sortable.enable();
				return original.apply(self, arguments);
			};
		})();
	
		self.setup = (function() {
			var original = self.setup;
			return function() {
				original.apply(this, arguments);
	
				var $control = self.$control.sortable({
					items: '[data-value]',
					forcePlaceholderSize: true,
					disabled: self.isLocked,
					start: function(e, ui) {
						ui.placeholder.css('width', ui.helper.css('width'));
						$control.css({overflow: 'visible'});
					},
					stop: function() {
						$control.css({overflow: 'hidden'});
						var active = self.$activeItems ? self.$activeItems.slice() : null;
						var values = [];
						$control.children('[data-value]').each(function() {
							values.push($(this).attr('data-value'));
						});
						self.setValue(values);
						self.setActiveItem(active);
					}
				});
			};
		})();
	
	});
	
	Selectize.define('dropdown_header', function(options) {
		var self = this;
	
		options = $.extend({
			title         : 'Untitled',
			headerClass   : 'selectize-dropdown-header',
			titleRowClass : 'selectize-dropdown-header-title',
			labelClass    : 'selectize-dropdown-header-label',
			closeClass    : 'selectize-dropdown-header-close',
	
			html: function(data) {
				return (
					'<div class="' + data.headerClass + '">' +
						'<div class="' + data.titleRowClass + '">' +
							'<span class="' + data.labelClass + '">' + data.title + '</span>' +
							'<a href="javascript:void(0)" class="' + data.closeClass + '">&times;</a>' +
						'</div>' +
					'</div>'
				);
			}
		}, options);
	
		self.setup = (function() {
			var original = self.setup;
			return function() {
				original.apply(self, arguments);
				self.$dropdown_header = $(options.html(options));
				self.$dropdown.prepend(self.$dropdown_header);
			};
		})();
	
	});
	
	Selectize.define('optgroup_columns', function(options) {
		var self = this;
	
		options = $.extend({
			equalizeWidth  : true,
			equalizeHeight : true
		}, options);
	
		this.getAdjacentOption = function($option, direction) {
			var $options = $option.closest('[data-group]').find('[data-selectable]');
			var index    = $options.index($option) + direction;
	
			return index >= 0 && index < $options.length ? $options.eq(index) : $();
		};
	
		this.onKeyDown = (function() {
			var original = self.onKeyDown;
			return function(e) {
				var index, $option, $options, $optgroup;
	
				if (this.isOpen && (e.keyCode === KEY_LEFT || e.keyCode === KEY_RIGHT)) {
					self.ignoreHover = true;
					$optgroup = this.$activeOption.closest('[data-group]');
					index = $optgroup.find('[data-selectable]').index(this.$activeOption);
	
					if(e.keyCode === KEY_LEFT) {
						$optgroup = $optgroup.prev('[data-group]');
					} else {
						$optgroup = $optgroup.next('[data-group]');
					}
	
					$options = $optgroup.find('[data-selectable]');
					$option  = $options.eq(Math.min($options.length - 1, index));
					if ($option.length) {
						this.setActiveOption($option);
					}
					return;
				}
	
				return original.apply(this, arguments);
			};
		})();
	
		var getScrollbarWidth = function() {
			var div;
			var width = getScrollbarWidth.width;
			var doc = document;
	
			if (typeof width === 'undefined') {
				div = doc.createElement('div');
				div.innerHTML = '<div style="width:50px;height:50px;position:absolute;left:-50px;top:-50px;overflow:auto;"><div style="width:1px;height:100px;"></div></div>';
				div = div.firstChild;
				doc.body.appendChild(div);
				width = getScrollbarWidth.width = div.offsetWidth - div.clientWidth;
				doc.body.removeChild(div);
			}
			return width;
		};
	
		var equalizeSizes = function() {
			var i, n, height_max, width, width_last, width_parent, $optgroups;
	
			$optgroups = $('[data-group]', self.$dropdown_content);
			n = $optgroups.length;
			if (!n || !self.$dropdown_content.width()) return;
	
			if (options.equalizeHeight) {
				height_max = 0;
				for (i = 0; i < n; i++) {
					height_max = Math.max(height_max, $optgroups.eq(i).height());
				}
				$optgroups.css({height: height_max});
			}
	
			if (options.equalizeWidth) {
				width_parent = self.$dropdown_content.innerWidth() - getScrollbarWidth();
				width = Math.round(width_parent / n);
				$optgroups.css({width: width});
				if (n > 1) {
					width_last = width_parent - width * (n - 1);
					$optgroups.eq(n - 1).css({width: width_last});
				}
			}
		};
	
		if (options.equalizeHeight || options.equalizeWidth) {
			hook.after(this, 'positionDropdown', equalizeSizes);
			hook.after(this, 'refreshOptions', equalizeSizes);
		}
	
	
	});
	
	Selectize.define('remove_button', function(options) {
		options = $.extend({
				label     : '&times;',
				title     : 'Remove',
				className : 'remove',
				append    : true
			}, options);
	
			var singleClose = function(thisRef, options) {
	
				options.className = 'remove-single';
	
				var self = thisRef;
				var html = '<a href="javascript:void(0)" class="' + options.className + '" tabindex="-1" title="' + escape_html(options.title) + '">' + options.label + '</a>';
	
				/**
				 * Appends an element as a child (with raw HTML).
				 *
				 * @param {string} html_container
				 * @param {string} html_element
				 * @return {string}
				 */
				var append = function(html_container, html_element) {
					return html_container + html_element;
				};
	
				thisRef.setup = (function() {
					var original = self.setup;
					return function() {
						// override the item rendering method to add the button to each
						if (options.append) {
							var id = $(self.$input.context).attr('id');
							var selectizer = $('#'+id);
	
							var render_item = self.settings.render.item;
							self.settings.render.item = function(data) {
								return append(render_item.apply(thisRef, arguments), html);
							};
						}
	
						original.apply(thisRef, arguments);
	
						// add event listener
						thisRef.$control.on('click', '.' + options.className, function(e) {
							e.preventDefault();
							if (self.isLocked) return;
	
							self.clear();
						});
	
					};
				})();
			};
	
			var multiClose = function(thisRef, options) {
	
				var self = thisRef;
				var html = '<a href="javascript:void(0)" class="' + options.className + '" tabindex="-1" title="' + escape_html(options.title) + '">' + options.label + '</a>';
	
				/**
				 * Appends an element as a child (with raw HTML).
				 *
				 * @param {string} html_container
				 * @param {string} html_element
				 * @return {string}
				 */
				var append = function(html_container, html_element) {
					var pos = html_container.search(/(<\/[^>]+>\s*)$/);
					return html_container.substring(0, pos) + html_element + html_container.substring(pos);
				};
	
				thisRef.setup = (function() {
					var original = self.setup;
					return function() {
						// override the item rendering method to add the button to each
						if (options.append) {
							var render_item = self.settings.render.item;
							self.settings.render.item = function(data) {
								return append(render_item.apply(thisRef, arguments), html);
							};
						}
	
						original.apply(thisRef, arguments);
	
						// add event listener
						thisRef.$control.on('click', '.' + options.className, function(e) {
							e.preventDefault();
							if (self.isLocked) return;
	
							var $item = $(e.currentTarget).parent();
							self.setActiveItem($item);
							if (self.deleteSelection()) {
								self.setCaret(self.items.length);
							}
						});
	
					};
				})();
			};
	
			if (this.settings.mode === 'single') {
				singleClose(this, options);
				return;
			} else {
				multiClose(this, options);
			}
	});
	
	
	Selectize.define('restore_on_backspace', function(options) {
		var self = this;
	
		options.text = options.text || function(option) {
			return option[this.settings.labelField];
		};
	
		this.onKeyDown = (function() {
			var original = self.onKeyDown;
			return function(e) {
				var index, option;
				if (e.keyCode === KEY_BACKSPACE && this.$control_input.val() === '' && !this.$activeItems.length) {
					index = this.caretPos - 1;
					if (index >= 0 && index < this.items.length) {
						option = this.options[this.items[index]];
						if (this.deleteSelection(e)) {
							this.setTextboxValue(options.text.apply(this, [option]));
							this.refreshOptions(true);
						}
						e.preventDefault();
						return;
					}
				}
				return original.apply(this, arguments);
			};
		})();
	});
	

	return Selectize;
}));(function (root, undefined) {
    'use strict';

    /**
     * getSlug
     * @param  {string} input input string
     * @param  {object|string} opts config object or separator string/char
     * @api    public
     * @return {string}  sluggified string
     */
    var getSlug = function getSlug(input, opts) {

        var separator = '-';
        var uricChars = [';', '?', ':', '@', '&', '=', '+', '$', ',', '/'];
        var uricNoSlashChars = [';', '?', ':', '@', '&', '=', '+', '$', ','];
        var markChars = ['.', '!', '~', '*', '\'', '(', ')'];
        var result = '';
        var diatricString = '';
        var convertSymbols = true;
        var customReplacements = {};
        var maintainCase;
        var titleCase;
        var truncate;
        var uricFlag;
        var uricNoSlashFlag;
        var markFlag;
        var symbol;
        var langChar;
        var lucky;
        var i;
        var ch;
        var l;
        var lastCharWasSymbol;
        var lastCharWasDiatric;
        var allowedChars;

        /**
         * charMap
         * @type {Object}
         */
        var charMap = {

            // latin
            'À': 'A',
            'Á': 'A',
            'Â': 'A',
            'Ã': 'A',
            'Ä': 'Ae',
            'Å': 'A',
            'Æ': 'AE',
            'Ç': 'C',
            'È': 'E',
            'É': 'E',
            'Ê': 'E',
            'Ë': 'E',
            'Ì': 'I',
            'Í': 'I',
            'Î': 'I',
            'Ï': 'I',
            'Ð': 'D',
            'Ñ': 'N',
            'Ò': 'O',
            'Ó': 'O',
            'Ô': 'O',
            'Õ': 'O',
            'Ö': 'Oe',
            'Ő': 'O',
            'Ø': 'O',
            'Ù': 'U',
            'Ú': 'U',
            'Û': 'U',
            'Ü': 'Ue',
            'Ű': 'U',
            'Ý': 'Y',
            'Þ': 'TH',
            'ß': 'ss',
            'à': 'a',
            'á': 'a',
            'â': 'a',
            'ã': 'a',
            'ä': 'ae',
            'å': 'a',
            'æ': 'ae',
            'ç': 'c',
            'è': 'e',
            'é': 'e',
            'ê': 'e',
            'ë': 'e',
            'ì': 'i',
            'í': 'i',
            'î': 'i',
            'ï': 'i',
            'ð': 'd',
            'ñ': 'n',
            'ò': 'o',
            'ó': 'o',
            'ô': 'o',
            'õ': 'o',
            'ö': 'oe',
            'ő': 'o',
            'ø': 'o',
            'ù': 'u',
            'ú': 'u',
            'û': 'u',
            'ü': 'ue',
            'ű': 'u',
            'ý': 'y',
            'þ': 'th',
            'ÿ': 'y',
            'ẞ': 'SS',

            // language specific

            // Arabic
            'ا': 'a',
            'أ': 'a',
            'إ': 'i',
            'آ': 'aa',
            'ؤ': 'u',
            'ئ': 'e',
            'ء': 'a',
            'ب': 'b',
            'ت': 't',
            'ث': 'th',
            'ج': 'j',
            'ح': 'h',
            'خ': 'kh',
            'د': 'd',
            'ذ': 'th',
            'ر': 'r',
            'ز': 'z',
            'س': 's',
            'ش': 'sh',
            'ص': 's',
            'ض': 'dh',
            'ط': 't',
            'ظ': 'z',
            'ع': 'a',
            'غ': 'gh',
            'ف': 'f',
            'ق': 'q',
            'ك': 'k',
            'ل': 'l',
            'م': 'm',
            'ن': 'n',
            'ه': 'h',
            'و': 'w',
            'ي': 'y',
            'ى': 'a',
            'ة': 'h',
            'ﻻ': 'la',
            'ﻷ': 'laa',
            'ﻹ': 'lai',
            'ﻵ': 'laa',

            // Persian additional characters than Arabic
            'گ': 'g',
            'چ': 'ch',
            'پ': 'p',
            'ژ': 'zh',
            'ک': 'k',
            'ی': 'y',

            // Arabic diactrics
            'َ': 'a',
            'ً': 'an',
            'ِ': 'e',
            'ٍ': 'en',
            'ُ': 'u',
            'ٌ': 'on',
            'ْ': '',

            // Arabic numbers
            '٠': '0',
            '١': '1',
            '٢': '2',
            '٣': '3',
            '٤': '4',
            '٥': '5',
            '٦': '6',
            '٧': '7',
            '٨': '8',
            '٩': '9',

            // Persian numbers
            '۰': '0',
            '۱': '1',
            '۲': '2',
            '۳': '3',
            '۴': '4',
            '۵': '5',
            '۶': '6',
            '۷': '7',
            '۸': '8',
            '۹': '9',

            // Burmese consonants
            'က': 'k',
            'ခ': 'kh',
            'ဂ': 'g',
            'ဃ': 'ga',
            'င': 'ng',
            'စ': 's',
            'ဆ': 'sa',
            'ဇ': 'z',
            'စျ': 'za',
            'ည': 'ny',
            'ဋ': 't',
            'ဌ': 'ta',
            'ဍ': 'd',
            'ဎ': 'da',
            'ဏ': 'na',
            'တ': 't',
            'ထ': 'ta',
            'ဒ': 'd',
            'ဓ': 'da',
            'န': 'n',
            'ပ': 'p',
            'ဖ': 'pa',
            'ဗ': 'b',
            'ဘ': 'ba',
            'မ': 'm',
            'ယ': 'y',
            'ရ': 'ya',
            'လ': 'l',
            'ဝ': 'w',
            'သ': 'th',
            'ဟ': 'h',
            'ဠ': 'la',
            'အ': 'a',
            // consonant character combos
            'ြ': 'y',
            'ျ': 'ya',
            'ွ': 'w',
            'ြွ': 'yw',
            'ျွ': 'ywa',
            'ှ': 'h',
            // independent vowels
            'ဧ': 'e',
            '၏': '-e',
            'ဣ': 'i',
            'ဤ': '-i',
            'ဉ': 'u',
            'ဦ': '-u',
            'ဩ': 'aw',
            'သြော': 'aw',
            'ဪ': 'aw',
            // numbers
            '၀': '0',
            '၁': '1',
            '၂': '2',
            '၃': '3',
            '၄': '4',
            '၅': '5',
            '၆': '6',
            '၇': '7',
            '၈': '8',
            '၉': '9',
            // virama and tone marks which are silent in transliteration
            '္': '',
            '့': '',
            'း': '',

            // Czech
            'č': 'c',
            'ď': 'd',
            'ě': 'e',
            'ň': 'n',
            'ř': 'r',
            'š': 's',
            'ť': 't',
            'ů': 'u',
            'ž': 'z',
            'Č': 'C',
            'Ď': 'D',
            'Ě': 'E',
            'Ň': 'N',
            'Ř': 'R',
            'Š': 'S',
            'Ť': 'T',
            'Ů': 'U',
            'Ž': 'Z',

            // Dhivehi
            'ހ': 'h',
            'ށ': 'sh',
            'ނ': 'n',
            'ރ': 'r',
            'ބ': 'b',
            'ޅ': 'lh',
            'ކ': 'k',
            'އ': 'a',
            'ވ': 'v',
            'މ': 'm',
            'ފ': 'f',
            'ދ': 'dh',
            'ތ': 'th',
            'ލ': 'l',
            'ގ': 'g',
            'ޏ': 'gn',
            'ސ': 's',
            'ޑ': 'd',
            'ޒ': 'z',
            'ޓ': 't',
            'ޔ': 'y',
            'ޕ': 'p',
            'ޖ': 'j',
            'ޗ': 'ch',
            'ޘ': 'tt',
            'ޙ': 'hh',
            'ޚ': 'kh',
            'ޛ': 'th',
            'ޜ': 'z',
            'ޝ': 'sh',
            'ޞ': 's',
            'ޟ': 'd',
            'ޠ': 't',
            'ޡ': 'z',
            'ޢ': 'a',
            'ޣ': 'gh',
            'ޤ': 'q',
            'ޥ': 'w',
            'ަ': 'a',
            'ާ': 'aa',
            'ި': 'i',
            'ީ': 'ee',
            'ު': 'u',
            'ޫ': 'oo',
            'ެ': 'e',
            'ޭ': 'ey',
            'ޮ': 'o',
            'ޯ': 'oa',
            'ް': '',

            // Greek
            'α': 'a',
            'β': 'v',
            'γ': 'g',
            'δ': 'd',
            'ε': 'e',
            'ζ': 'z',
            'η': 'i',
            'θ': 'th',
            'ι': 'i',
            'κ': 'k',
            'λ': 'l',
            'μ': 'm',
            'ν': 'n',
            'ξ': 'ks',
            'ο': 'o',
            'π': 'p',
            'ρ': 'r',
            'σ': 's',
            'τ': 't',
            'υ': 'y',
            'φ': 'f',
            'χ': 'x',
            'ψ': 'ps',
            'ω': 'o',
            'ά': 'a',
            'έ': 'e',
            'ί': 'i',
            'ό': 'o',
            'ύ': 'y',
            'ή': 'i',
            'ώ': 'o',
            'ς': 's',
            'ϊ': 'i',
            'ΰ': 'y',
            'ϋ': 'y',
            'ΐ': 'i',
            'Α': 'A',
            'Β': 'B',
            'Γ': 'G',
            'Δ': 'D',
            'Ε': 'E',
            'Ζ': 'Z',
            'Η': 'I',
            'Θ': 'TH',
            'Ι': 'I',
            'Κ': 'K',
            'Λ': 'L',
            'Μ': 'M',
            'Ν': 'N',
            'Ξ': 'KS',
            'Ο': 'O',
            'Π': 'P',
            'Ρ': 'R',
            'Σ': 'S',
            'Τ': 'T',
            'Υ': 'Y',
            'Φ': 'F',
            'Χ': 'X',
            'Ψ': 'PS',
            'Ω': 'W',
            'Ά': 'A',
            'Έ': 'E',
            'Ί': 'I',
            'Ό': 'O',
            'Ύ': 'Y',
            'Ή': 'I',
            'Ώ': 'O',
            'Ϊ': 'I',
            'Ϋ': 'Y',

            // Latvian
            'ā': 'a',
            // 'č': 'c', // duplicate
            'ē': 'e',
            'ģ': 'g',
            'ī': 'i',
            'ķ': 'k',
            'ļ': 'l',
            'ņ': 'n',
            // 'š': 's', // duplicate
            'ū': 'u',
            // 'ž': 'z', // duplicate
            'Ā': 'A',
            // 'Č': 'C', // duplicate
            'Ē': 'E',
            'Ģ': 'G',
            'Ī': 'I',
            'Ķ': 'k',
            'Ļ': 'L',
            'Ņ': 'N',
            // 'Š': 'S', // duplicate
            'Ū': 'U',
            // 'Ž': 'Z', // duplicate

            // Macedonian
            'Ќ': 'Kj',
            'ќ': 'kj',
            'Љ': 'Lj',
            'љ': 'lj',
            'Њ': 'Nj',
            'њ': 'nj',
            'Тс': 'Ts',
            'тс': 'ts',

            // Polish
            'ą': 'a',
            'ć': 'c',
            'ę': 'e',
            'ł': 'l',
            'ń': 'n',
            // 'ó': 'o', // duplicate
            'ś': 's',
            'ź': 'z',
            'ż': 'z',
            'Ą': 'A',
            'Ć': 'C',
            'Ę': 'E',
            'Ł': 'L',
            'Ń': 'N',
            'Ś': 'S',
            'Ź': 'Z',
            'Ż': 'Z',

            // Ukranian
            'Є': 'Ye',
            'І': 'I',
            'Ї': 'Yi',
            'Ґ': 'G',
            'є': 'ye',
            'і': 'i',
            'ї': 'yi',
            'ґ': 'g',

            // Romanian
            'ă': 'a',
            'Ă': 'A',
            'ș': 's',
            'Ș': 'S',
            // 'ş': 's', // duplicate
            // 'Ş': 'S', // duplicate
            'ț': 't',
            'Ț': 'T',
            'ţ': 't',
            'Ţ': 'T',

            // Russian https://en.wikipedia.org/wiki/Romanization_of_Russian
            // ICAO

            'а': 'a',
            'б': 'b',
            'в': 'v',
            'г': 'g',
            'д': 'd',
            'е': 'e',
            'ё': 'yo',
            'ж': 'zh',
            'з': 'z',
            'и': 'i',
            'й': 'i',
            'к': 'k',
            'л': 'l',
            'м': 'm',
            'н': 'n',
            'о': 'o',
            'п': 'p',
            'р': 'r',
            'с': 's',
            'т': 't',
            'у': 'u',
            'ф': 'f',
            'х': 'kh',
            'ц': 'c',
            'ч': 'ch',
            'ш': 'sh',
            'щ': 'sh',
            'ъ': '',
            'ы': 'y',
            'ь': '',
            'э': 'e',
            'ю': 'yu',
            'я': 'ya',
            'А': 'A',
            'Б': 'B',
            'В': 'V',
            'Г': 'G',
            'Д': 'D',
            'Е': 'E',
            'Ё': 'Yo',
            'Ж': 'Zh',
            'З': 'Z',
            'И': 'I',
            'Й': 'I',
            'К': 'K',
            'Л': 'L',
            'М': 'M',
            'Н': 'N',
            'О': 'O',
            'П': 'P',
            'Р': 'R',
            'С': 'S',
            'Т': 'T',
            'У': 'U',
            'Ф': 'F',
            'Х': 'Kh',
            'Ц': 'C',
            'Ч': 'Ch',
            'Ш': 'Sh',
            'Щ': 'Sh',
            'Ъ': '',
            'Ы': 'Y',
            'Ь': '',
            'Э': 'E',
            'Ю': 'Yu',
            'Я': 'Ya',

            // Serbian
            'ђ': 'dj',
            'ј': 'j',
            // 'љ': 'lj',  // duplicate
            // 'њ': 'nj', // duplicate
            'ћ': 'c',
            'џ': 'dz',
            'Ђ': 'Dj',
            'Ј': 'j',
            // 'Љ': 'Lj', // duplicate
            // 'Њ': 'Nj', // duplicate
            'Ћ': 'C',
            'Џ': 'Dz',

            // Slovak
            'ľ': 'l',
            'ĺ': 'l',
            'ŕ': 'r',
            'Ľ': 'L',
            'Ĺ': 'L',
            'Ŕ': 'R',

            // Turkish
            'ş': 's',
            'Ş': 'S',
            'ı': 'i',
            'İ': 'I',
            // 'ç': 'c', // duplicate
            // 'Ç': 'C', // duplicate
            // 'ü': 'u', // duplicate, see langCharMap
            // 'Ü': 'U', // duplicate, see langCharMap
            // 'ö': 'o', // duplicate, see langCharMap
            // 'Ö': 'O', // duplicate, see langCharMap
            'ğ': 'g',
            'Ğ': 'G',

            // Vietnamese
            'ả': 'a',
            'Ả': 'A',
            'ẳ': 'a',
            'Ẳ': 'A',
            'ẩ': 'a',
            'Ẩ': 'A',
            'đ': 'd',
            'Đ': 'D',
            'ẹ': 'e',
            'Ẹ': 'E',
            'ẽ': 'e',
            'Ẽ': 'E',
            'ẻ': 'e',
            'Ẻ': 'E',
            'ế': 'e',
            'Ế': 'E',
            'ề': 'e',
            'Ề': 'E',
            'ệ': 'e',
            'Ệ': 'E',
            'ễ': 'e',
            'Ễ': 'E',
            'ể': 'e',
            'Ể': 'E',
            'ọ': 'o',
            'Ọ': 'o',
            'ố': 'o',
            'Ố': 'O',
            'ồ': 'o',
            'Ồ': 'O',
            'ổ': 'o',
            'Ổ': 'O',
            'ộ': 'o',
            'Ộ': 'O',
            'ỗ': 'o',
            'Ỗ': 'O',
            'ơ': 'o',
            'Ơ': 'O',
            'ớ': 'o',
            'Ớ': 'O',
            'ờ': 'o',
            'Ờ': 'O',
            'ợ': 'o',
            'Ợ': 'O',
            'ỡ': 'o',
            'Ỡ': 'O',
            'Ở': 'o',
            'ở': 'o',
            'ị': 'i',
            'Ị': 'I',
            'ĩ': 'i',
            'Ĩ': 'I',
            'ỉ': 'i',
            'Ỉ': 'i',
            'ủ': 'u',
            'Ủ': 'U',
            'ụ': 'u',
            'Ụ': 'U',
            'ũ': 'u',
            'Ũ': 'U',
            'ư': 'u',
            'Ư': 'U',
            'ứ': 'u',
            'Ứ': 'U',
            'ừ': 'u',
            'Ừ': 'U',
            'ự': 'u',
            'Ự': 'U',
            'ữ': 'u',
            'Ữ': 'U',
            'ử': 'u',
            'Ử': 'ư',
            'ỷ': 'y',
            'Ỷ': 'y',
            'ỳ': 'y',
            'Ỳ': 'Y',
            'ỵ': 'y',
            'Ỵ': 'Y',
            'ỹ': 'y',
            'Ỹ': 'Y',
            'ạ': 'a',
            'Ạ': 'A',
            'ấ': 'a',
            'Ấ': 'A',
            'ầ': 'a',
            'Ầ': 'A',
            'ậ': 'a',
            'Ậ': 'A',
            'ẫ': 'a',
            'Ẫ': 'A',
            // 'ă': 'a', // duplicate
            // 'Ă': 'A', // duplicate
            'ắ': 'a',
            'Ắ': 'A',
            'ằ': 'a',
            'Ằ': 'A',
            'ặ': 'a',
            'Ặ': 'A',
            'ẵ': 'a',
            'Ẵ': 'A',

            // symbols
            '“': '"',
            '”': '"',
            '‘': '\'',
            '’': '\'',
            '∂': 'd',
            'ƒ': 'f',
            '™': '(TM)',
            '©': '(C)',
            'œ': 'oe',
            'Œ': 'OE',
            '®': '(R)',
            '†': '+',
            '℠': '(SM)',
            '…': '...',
            '˚': 'o',
            'º': 'o',
            'ª': 'a',
            '•': '*',
            '၊': ',',
            '။': '.',

            // currency
            '$': 'USD',
            '€': 'EUR',
            '₢': 'BRN',
            '₣': 'FRF',
            '£': 'GBP',
            '₤': 'ITL',
            '₦': 'NGN',
            '₧': 'ESP',
            '₩': 'KRW',
            '₪': 'ILS',
            '₫': 'VND',
            '₭': 'LAK',
            '₮': 'MNT',
            '₯': 'GRD',
            '₱': 'ARS',
            '₲': 'PYG',
            '₳': 'ARA',
            '₴': 'UAH',
            '₵': 'GHS',
            '¢': 'cent',
            '¥': 'CNY',
            '元': 'CNY',
            '円': 'YEN',
            '﷼': 'IRR',
            '₠': 'EWE',
            '฿': 'THB',
            '₨': 'INR',
            '₹': 'INR',
            '₰': 'PF'

        };

        /**
         * special look ahead character array
         * These characters form with consonants to become 'single'/consonant combo
         * @type [Array]
         */
        var lookAheadCharArray = [
            // burmese
            '်',

            // Dhivehi
            'ް'
        ];

        /**
         * diatricMap for languages where transliteration changes entirely as more diatrics are added
         * @type {Object}
         */
        var diatricMap = {
            // Burmese
            // dependent vowels
            'ာ': 'a',
            'ါ': 'a',
            'ေ': 'e',
            'ဲ': 'e',
            'ိ': 'i',
            'ီ': 'i',
            'ို': 'o',
            'ု': 'u',
            'ူ': 'u',
            'ေါင်': 'aung',
            'ော': 'aw',
            'ော်': 'aw',
            'ေါ': 'aw',
            'ေါ်': 'aw',
            '်': '်', // this is special case but the character will be converted to latin in the code
            'က်': 'et',
            'ိုက်': 'aik',
            'ောက်': 'auk',
            'င်': 'in',
            'ိုင်': 'aing',
            'ောင်': 'aung',
            'စ်': 'it',
            'ည်': 'i',
            'တ်': 'at',
            'ိတ်': 'eik',
            'ုတ်': 'ok',
            'ွတ်': 'ut',
            'ေတ်': 'it',
            'ဒ်': 'd',
            'ိုဒ်': 'ok',
            'ုဒ်': 'ait',
            'န်': 'an',
            'ာန်': 'an',
            'ိန်': 'ein',
            'ုန်': 'on',
            'ွန်': 'un',
            'ပ်': 'at',
            'ိပ်': 'eik',
            'ုပ်': 'ok',
            'ွပ်': 'ut',
            'န်ုပ်': 'nub',
            'မ်': 'an',
            'ိမ်': 'ein',
            'ုမ်': 'on',
            'ွမ်': 'un',
            'ယ်': 'e',
            'ိုလ်': 'ol',
            'ဉ်': 'in',
            'ံ': 'an',
            'ိံ': 'ein',
            'ုံ': 'on',

            // Dhivehi
            'ައް': 'ah',
            'ަށް': 'ah',
        };

        /**
         * langCharMap language specific characters translations
         * @type   {Object}
         */
        var langCharMap = {

            'en': {}, // default language

            'az': { // Azerbaijani
                'ç': 'c',
                'ə': 'e',
                'ğ': 'g',
                'ı': 'i',
                'ö': 'o',
                'ş': 's',
                'ü': 'u',
                'Ç': 'C',
                'Ə': 'E',
                'Ğ': 'G',
                'İ': 'I',
                'Ö': 'O',
                'Ş': 'S',
                'Ü': 'U'
            },

            'cs': { // Czech
                'č': 'c',
                'ď': 'd',
                'ě': 'e',
                'ň': 'n',
                'ř': 'r',
                'š': 's',
                'ť': 't',
                'ů': 'u',
                'ž': 'z',
                'Č': 'C',
                'Ď': 'D',
                'Ě': 'E',
                'Ň': 'N',
                'Ř': 'R',
                'Š': 'S',
                'Ť': 'T',
                'Ů': 'U',
                'Ž': 'Z'
            },

            'fi': { // Finnish
                // 'å': 'a', duplicate see charMap/latin
                // 'Å': 'A', duplicate see charMap/latin
                'ä': 'a', // ok
                'Ä': 'A', // ok
                'ö': 'o', // ok
                'Ö': 'O' // ok
            },

            'hu': { // Hungarian
                'ä': 'a', // ok
                'Ä': 'A', // ok
                // 'á': 'a', duplicate see charMap/latin
                // 'Á': 'A', duplicate see charMap/latin
                'ö': 'o', // ok
                'Ö': 'O', // ok
                // 'ő': 'o', duplicate see charMap/latin
                // 'Ő': 'O', duplicate see charMap/latin
                'ü': 'u',
                'Ü': 'U',
                'ű': 'u',
                'Ű': 'U'
            },

            'lt': { // Lithuanian
                'ą': 'a',
                'č': 'c',
                'ę': 'e',
                'ė': 'e',
                'į': 'i',
                'š': 's',
                'ų': 'u',
                'ū': 'u',
                'ž': 'z',
                'Ą': 'A',
                'Č': 'C',
                'Ę': 'E',
                'Ė': 'E',
                'Į': 'I',
                'Š': 'S',
                'Ų': 'U',
                'Ū': 'U'
            },

            'lv': { // Latvian
                'ā': 'a',
                'č': 'c',
                'ē': 'e',
                'ģ': 'g',
                'ī': 'i',
                'ķ': 'k',
                'ļ': 'l',
                'ņ': 'n',
                'š': 's',
                'ū': 'u',
                'ž': 'z',
                'Ā': 'A',
                'Č': 'C',
                'Ē': 'E',
                'Ģ': 'G',
                'Ī': 'i',
                'Ķ': 'k',
                'Ļ': 'L',
                'Ņ': 'N',
                'Š': 'S',
                'Ū': 'u',
                'Ž': 'Z'
            },

            'pl': { // Polish
                'ą': 'a',
                'ć': 'c',
                'ę': 'e',
                'ł': 'l',
                'ń': 'n',
                'ó': 'o',
                'ś': 's',
                'ź': 'z',
                'ż': 'z',
                'Ą': 'A',
                'Ć': 'C',
                'Ę': 'e',
                'Ł': 'L',
                'Ń': 'N',
                'Ó': 'O',
                'Ś': 'S',
                'Ź': 'Z',
                'Ż': 'Z'
            },

            'sk': { // Slovak
                'ä': 'a',
                'Ä': 'A'
            },

            'sr': { // Serbian
                'љ': 'lj',
                'њ': 'nj',
                'Љ': 'Lj',
                'Њ': 'Nj',
                'đ': 'dj',
                'Đ': 'Dj'
            },

            'tr': { // Turkish
                'Ü': 'U',
                'Ö': 'O',
                'ü': 'u',
                'ö': 'o'
            }
        };

        /**
         * symbolMap language specific symbol translations
         * translations must be transliterated already
         * @type   {Object}
         */
        var symbolMap = {

            'ar': {
                '∆': 'delta',
                '∞': 'la-nihaya',
                '♥': 'hob',
                '&': 'wa',
                '|': 'aw',
                '<': 'aqal-men',
                '>': 'akbar-men',
                '∑': 'majmou',
                '¤': 'omla'
            },

            'az': {},

            'ca': {
                '∆': 'delta',
                '∞': 'infinit',
                '♥': 'amor',
                '&': 'i',
                '|': 'o',
                '<': 'menys que',
                '>': 'mes que',
                '∑': 'suma dels',
                '¤': 'moneda'
            },

            'cz': {
                '∆': 'delta',
                '∞': 'nekonecno',
                '♥': 'laska',
                '&': 'a',
                '|': 'nebo',
                '<': 'mene jako',
                '>': 'vice jako',
                '∑': 'soucet',
                '¤': 'mena'
            },

            'de': {
                '∆': 'delta',
                '∞': 'unendlich',
                '♥': 'Liebe',
                '&': 'und',
                '|': 'oder',
                '<': 'kleiner als',
                '>': 'groesser als',
                '∑': 'Summe von',
                '¤': 'Waehrung'
            },

            'dv': {
                '∆': 'delta',
                '∞': 'kolunulaa',
                '♥': 'loabi',
                '&': 'aai',
                '|': 'noonee',
                '<': 'ah vure kuda',
                '>': 'ah vure bodu',
                '∑': 'jumula',
                '¤': 'faisaa'
            },

            'en': {
                '∆': 'delta',
                '∞': 'infinity',
                '♥': 'love',
                '&': 'and',
                '|': 'or',
                '<': 'less than',
                '>': 'greater than',
                '∑': 'sum',
                '¤': 'currency'
            },

            'es': {
                '∆': 'delta',
                '∞': 'infinito',
                '♥': 'amor',
                '&': 'y',
                '|': 'u',
                '<': 'menos que',
                '>': 'mas que',
                '∑': 'suma de los',
                '¤': 'moneda'
            },

            'fa': {
                '∆': 'delta',
                '∞': 'bi-nahayat',
                '♥': 'eshgh',
                '&': 'va',
                '|': 'ya',
                '<': 'kamtar-az',
                '>': 'bishtar-az',
                '∑': 'majmooe',
                '¤': 'vahed'
            },

            'fr': {
                '∆': 'delta',
                '∞': 'infiniment',
                '♥': 'Amour',
                '&': 'et',
                '|': 'ou',
                '<': 'moins que',
                '>': 'superieure a',
                '∑': 'somme des',
                '¤': 'monnaie'
            },

            'gr': {},

            'hu': {
                '∆': 'delta',
                '∞': 'vegtelen',
                '♥': 'szerelem',
                '&': 'es',
                '|': 'vagy',
                '<': 'kisebb mint',
                '>': 'nagyobb mint',
                '∑': 'szumma',
                '¤': 'penznem'
            },

            'it': {
                '∆': 'delta',
                '∞': 'infinito',
                '♥': 'amore',
                '&': 'e',
                '|': 'o',
                '<': 'minore di',
                '>': 'maggiore di',
                '∑': 'somma',
                '¤': 'moneta'
            },

            'lt': {},

            'lv': {
                '∆': 'delta',
                '∞': 'bezgaliba',
                '♥': 'milestiba',
                '&': 'un',
                '|': 'vai',
                '<': 'mazak neka',
                '>': 'lielaks neka',
                '∑': 'summa',
                '¤': 'valuta'
            },

            'my': {
                '∆': 'kwahkhyaet',
                '∞': 'asaonasme',
                '♥': 'akhyait',
                '&': 'nhin',
                '|': 'tho',
                '<': 'ngethaw',
                '>': 'kyithaw',
                '∑': 'paungld',
                '¤': 'ngwekye'
            },

            'mk': {},

            'nl': {
                '∆': 'delta',
                '∞': 'oneindig',
                '♥': 'liefde',
                '&': 'en',
                '|': 'of',
                '<': 'kleiner dan',
                '>': 'groter dan',
                '∑': 'som',
                '¤': 'valuta'
            },

            'pl': {
                '∆': 'delta',
                '∞': 'nieskonczonosc',
                '♥': 'milosc',
                '&': 'i',
                '|': 'lub',
                '<': 'mniejsze niz',
                '>': 'wieksze niz',
                '∑': 'suma',
                '¤': 'waluta'
            },

            'pt': {
                '∆': 'delta',
                '∞': 'infinito',
                '♥': 'amor',
                '&': 'e',
                '|': 'ou',
                '<': 'menor que',
                '>': 'maior que',
                '∑': 'soma',
                '¤': 'moeda'
            },

            'ro': {
                '∆': 'delta',
                '∞': 'infinit',
                '♥': 'dragoste',
                '&': 'si',
                '|': 'sau',
                '<': 'mai mic ca',
                '>': 'mai mare ca',
                '∑': 'suma',
                '¤': 'valuta'
            },

            'ru': {
                '∆': 'delta',
                '∞': 'beskonechno',
                '♥': 'lubov',
                '&': 'i',
                '|': 'ili',
                '<': 'menshe',
                '>': 'bolshe',
                '∑': 'summa',
                '¤': 'valjuta'
            },

            'sk': {
                '∆': 'delta',
                '∞': 'nekonecno',
                '♥': 'laska',
                '&': 'a',
                '|': 'alebo',
                '<': 'menej ako',
                '>': 'viac ako',
                '∑': 'sucet',
                '¤': 'mena'
            },

            'sr': {},

            'tr': {
                '∆': 'delta',
                '∞': 'sonsuzluk',
                '♥': 'ask',
                '&': 've',
                '|': 'veya',
                '<': 'kucuktur',
                '>': 'buyuktur',
                '∑': 'toplam',
                '¤': 'para birimi'
            },

            'uk': {
                '∆': 'delta',
                '∞': 'bezkinechnist',
                '♥': 'lubov',
                '&': 'i',
                '|': 'abo',
                '<': 'menshe',
                '>': 'bilshe',
                '∑': 'suma',
                '¤': 'valjuta'
            },

            'vn': {
                '∆': 'delta',
                '∞': 'vo cuc',
                '♥': 'yeu',
                '&': 'va',
                '|': 'hoac',
                '<': 'nho hon',
                '>': 'lon hon',
                '∑': 'tong',
                '¤': 'tien te'
            }
        };

        if (typeof input !== 'string') {
            return '';
        }

        if (typeof opts === 'string') {
            separator = opts;
        }

        symbol = symbolMap.en;
        langChar = langCharMap.en;

        if (typeof opts === 'object') {

            maintainCase = opts.maintainCase || false;
            customReplacements = (opts.custom && typeof opts.custom === 'object') ? opts.custom : customReplacements;
            truncate = (+opts.truncate > 1 && opts.truncate) || false;
            uricFlag = opts.uric || false;
            uricNoSlashFlag = opts.uricNoSlash || false;
            markFlag = opts.mark || false;
            convertSymbols = (opts.symbols === false || opts.lang === false) ? false : true;
            separator = opts.separator || separator;

            if (uricFlag) {
                allowedChars += uricChars.join('');
            }

            if (uricNoSlashFlag) {
                allowedChars += uricNoSlashChars.join('');
            }

            if (markFlag) {
                allowedChars += markChars.join('');
            }

            symbol = (opts.lang && symbolMap[opts.lang] && convertSymbols) ?
                symbolMap[opts.lang] : (convertSymbols ? symbolMap.en : {});

            langChar = (opts.lang && langCharMap[opts.lang]) ?
                langCharMap[opts.lang] :
                opts.lang === false || opts.lang === true ? {} : langCharMap.en;

            // if titleCase config is an Array, rewrite to object format
            if (opts.titleCase && typeof opts.titleCase.length === "number" && Array.prototype.toString.call(opts.titleCase)) {

                opts.titleCase.forEach(function (v) {
                    customReplacements[v + ""] = v + "";
                });

                titleCase = true;
            } else {
                titleCase = !!opts.titleCase;
            }

            // if custom config is an Array, rewrite to object format
            if (opts.custom && typeof opts.custom.length === "number" && Array.prototype.toString.call(opts.custom)) {

                opts.custom.forEach(function (v) {
                    customReplacements[v + ""] = v + "";
                });
            }

            // custom replacements
            Object.keys(customReplacements).forEach(function (v) {

                var r;

                if (v.length > 1) {
                    r = new RegExp('\\b' + escapeChars(v) + '\\b', 'gi');
                } else {
                    r = new RegExp(escapeChars(v), 'gi');
                }

                input = input.replace(r, customReplacements[v]);
            });

            // add all custom replacement to allowed charlist
            for (ch in customReplacements) {
                allowedChars += ch;
            }

        }

        allowedChars += separator;

        // escape all necessary chars
        allowedChars = escapeChars(allowedChars);

        // trim whitespaces
        input = input.replace(/(^\s+|\s+$)/g, '');

        lastCharWasSymbol = false;
        lastCharWasDiatric = false;

        for (i = 0, l = input.length; i < l; i++) {

            ch = input[i];

            if (isReplacedCustomChar(ch, customReplacements)) {
                // don't convert a already converted char
                lastCharWasSymbol = false;
            } else if (langChar[ch]) {
                // process language specific diactrics chars conversion
                ch = lastCharWasSymbol && langChar[ch].match(/[A-Za-z0-9]/) ? ' ' + langChar[ch] : langChar[ch];

                lastCharWasSymbol = false;
            } else if (ch in charMap) {
                // the transliteration changes entirely when some special characters are added
                if (i + 1 < l && lookAheadCharArray.indexOf(input[i + 1]) >= 0) {
                    diatricString += ch;
                    ch = '';
                } else if (lastCharWasDiatric === true) {
                    ch = diatricMap[diatricString] + charMap[ch];
                    diatricString = '';
                } else {
                    // process diactrics chars
                    ch = lastCharWasSymbol && charMap[ch].match(/[A-Za-z0-9]/) ? ' ' + charMap[ch] : charMap[ch];
                }

                lastCharWasSymbol = false;
                lastCharWasDiatric = false;
            } else
            if (ch in diatricMap) {
                diatricString += ch;
                ch = '';
                // end of string, put the whole meaningful word
                if (i === l - 1) {
                    ch = diatricMap[diatricString];
                }
                lastCharWasDiatric = true;
            } else if (
                // process symbol chars
                symbol[ch] && !(uricFlag && uricChars.join('')
                    .indexOf(ch) !== -1) && !(uricNoSlashFlag && uricNoSlashChars.join('')
                    //.indexOf(ch) !== -1) && !(markFlag && markChars.join('')
                    .indexOf(ch) !== -1)) {

                ch = lastCharWasSymbol || result.substr(-1).match(/[A-Za-z0-9]/) ? separator + symbol[ch] : symbol[ch];
                ch += input[i + 1] !== void 0 && input[i + 1].match(/[A-Za-z0-9]/) ? separator : '';

                lastCharWasSymbol = true;
            } else {
                if (lastCharWasDiatric === true) {
                    ch = diatricMap[diatricString] + ch;
                    diatricString = '';
                    lastCharWasDiatric = false;
                } else if (lastCharWasSymbol && (/[A-Za-z0-9]/.test(ch) || result.substr(-1).match(/A-Za-z0-9]/))) {
                    // process latin chars
                    ch = ' ' + ch;
                }
                lastCharWasSymbol = false;
            }

            // add allowed chars
            result += ch.replace(new RegExp('[^\\w\\s' + allowedChars + '_-]', 'g'), separator);
        }

        if (titleCase) {
            result = result.replace(/(\w)(\S*)/g, function (_, i, r) {
                var j = i.toUpperCase() + (r !== null ? r : "");
                return (Object.keys(customReplacements).indexOf(j.toLowerCase()) < 0) ? j : j.toLowerCase();
            });
        }

        // eliminate duplicate separators
        // add separator
        // trim separators from start and end
        result = result.replace(/\s+/g, separator)
            .replace(new RegExp('\\' + separator + '+', 'g'), separator)
            .replace(new RegExp('(^\\' + separator + '+|\\' + separator + '+$)', 'g'), '');

        if (truncate && result.length > truncate) {

            lucky = result.charAt(truncate) === separator;
            result = result.slice(0, truncate);

            if (!lucky) {
                result = result.slice(0, result.lastIndexOf(separator));
            }
        }

        if (!maintainCase && !titleCase) {
            result = result.toLowerCase();
        }

        return result;
    };

    /**
     * createSlug curried(opts)(input)
     * @param   {object|string} opts config object or input string
     * @return  {Function} function getSlugWithConfig()
     **/
    var createSlug = function createSlug(opts) {

        /**
         * getSlugWithConfig
         * @param   {string} input string
         * @return  {string} slug string
         */
        return function getSlugWithConfig(input) {
            return getSlug(input, opts);
        };
    };

    /**
     * escape Chars
     * @param   {string} input string
     */
    var escapeChars = function escapeChars(input) {

        return input.replace(/[-\\^$*+?.()|[\]{}\/]/g, '\\$&');
    };

    /**
     * check if the char is an already converted char from custom list
     * @param   {char} ch character to check
     * @param   {object} customReplacements custom translation map
     */
    var isReplacedCustomChar = function (ch, customReplacements) {

        for (var c in customReplacements) {
            if (customReplacements[c] === ch) {
                return true;
            }
        }
    };

    if (typeof module !== 'undefined' && module.exports) {

        // export functions for use in Node
        module.exports = getSlug;
        module.exports.createSlug = createSlug;

    } else if (typeof define !== 'undefined' && define.amd) {

        // export function for use in AMD
        define([], function () {
            return getSlug;
        });

    } else {

        // don't overwrite global if exists
        try {
            if (root.getSlug || root.createSlug) {
                throw 'speakingurl: globals exists /(getSlug|createSlug)/';
            } else {
                root.getSlug = getSlug;
                root.createSlug = createSlug;
            }
        } catch (e) {}

    }
})(this);'use strict';

var _upldr = function() {

    this.options = {
        target: 'upldr.php',
        //uploadBase: '',
        typeMatch: 'image.*',
        slug: true,
        cbReaderOnload: function() {
            //console.log('cbReaderOnload');
        },
        cbReset: function() {
            document.getElementById('file-table-body').innerHTML = '';
        }
    };
    var options = this.options;

    this.set = function(data) {
        if (data) {
            for (var key in data) {
                options[key] = data[key];
            }
        }
    }

    var files = [];
    var request;
    var form = document.getElementById('upldr-form');
    var inputFile = document.getElementById('upldr-input-file');
    var progressBar = document.getElementById('upldr-progress-bar');
    var submitBtn = document.getElementById('upldr-submit-btn');
    var resetBtn = document.getElementById('upldr-reset-btn');
    var abortBtn = document.getElementById('upldr-abort-btn');
    submitBtn.disabled = true;
    resetBtn.disabled = true;
    abortBtn.disabled = true;

    var submitBtnInitText = submitBtn.innerHTML;

    var dropZone = document.querySelectorAll('.upldr-dropzone');
    if (dropZone.length < 1) {
        dropZone = document.body;
    }

    function fileSelect(evt) {

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
            if (evtFiles[i].type.match(options.typeMatch)) {
                files.push(evtFiles[i]);
            }
        }

        if (files.length < 1) {
            return false;
        }
        submitBtn.disabled = false;
        resetBtn.disabled = false;

        var ftb = document.getElementById('file-table-body');
        ftb.innerHTML = '';

        for (var i = 0; i < files.length; i++) {
            var reader = new FileReader();

            var f = files[i];
            reader.name = f.name;
            if (options.slug && getSlug) {
                var str = f.name.split('.');
                str[0] = getSlug(str[0]);
                reader.name = str.join('.');
            }

            reader.type = f.type;
            // file size from bytes to KB:
            reader.size = (f.size / 1000).toFixed(2);
            //var fLastMod = f.lastModified;
            reader.lastMod = f.lastModifiedDate.toLocaleDateString();

            reader.onload = function(e) {
                var src = e.target.result;
                options.cbReaderOnload(src, this.name, this.type, this.size, this.lastMod);
            };
            reader.readAsDataURL(f);
        }

    };

    function fileDragOver(evt) {
        evt.stopPropagation();
        evt.preventDefault();
        evt.dataTransfer.dropEffect = 'copy';
    };

    function abort() {
        if (request) {
            request.abort();
        }
    };

    this.reset = function() {
       //console.log('reset');
        files = [];
        form.reset();
        progressBar.style.width = 0;
        progressBar.innerHTML = '';
        submitBtn.innerHTML = submitBtnInitText;
        submitBtn.disabled = true;
        resetBtn.disabled = true;
        if (options.cbReset) {
            options.cbReset();
        }
        //document.getElementById('file-table-body').innerHTML = '';
    };

    function progress(e) {
        if (e.lengthComputable) {
            percLoaded = Math.round(e.loaded / e.total * 100) + '%';
            progressBar.style.width = percLoaded;
            progressBar.innerHTML = percLoaded;
            submitBtn.textContent = percLoaded;
        }
    };

    function upload(e) {
        e.preventDefault();

        submitBtn.disabled = true;
        resetBtn.disabled = true;

        if (!files || files.length === 0) {
           //console.log('no files to upload');
            return false;
        }

        var formdata = new FormData();
        for (var i = 0; i < files.length; i++) {
            var f = files[i];
            if (f.type.match(options.typeMatch)) {
                formdata.append('files[]', f);
            }
        }

        if (options.data) {
            formdata.append('data', options.data);
        }

        request = new XMLHttpRequest();
        request.onreadystatechange = function() {
            //if (request.readyState == 4) {
            try {
                var resp = JSON.parse(request.response);
            } catch (e) {
                /*
                var resp = {
                	status : 'error',
                	data : 'Unknown error occurred: [' + request.responseText + ']'
                };
                */
            }
            //console.log(resp.status + ': ' + resp.data);
            //}
        };

        request.onloadend = function(e) {
            //console.log(e.target.response);
            if (options.cbOnloadend) {
                options.cbOnloadend(e);
            }
        };

        request.upload.addEventListener('progress', progress, false);
        request.open('POST', options.target, true);
        request.send(formdata);
    };


    form.onsubmit = upload;
    abortBtn.onclick = abort
    resetBtn.onclick = this.reset;
    inputFile.onchange = fileSelect;
    //inputFile.addEventListener('change', fileSelect, false);

    dropZone.addEventListener('dragover', fileDragOver, false);
    dropZone.addEventListener('drop', fileSelect, false);

};

var upldr = new _upldr;
