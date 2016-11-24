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
    console.log(arr);
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
        return data.replace('gallery/', '');
    }

    return data.map(function(value) {
        return value.replace('gallery/', '');
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

$('.admin-header a[aria-controls="slider-panel"]').on('shown.bs.tab', function(e) {

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
          selector : 'div#slider-sortable div.placeholder-item',
          proportion : [1,1],
          className : 'ssp',
          styleId : 'slider-sortable-prop'
        });
    }

    $('#slider-preview-btn').on('click', function() {
        $('#slider-1').attr('id', stat.workingSlider);
       //console.log(_.pick(stat.sliders, [stat.workingSlider]));
        buildSliders(_.pick(stat.sliders, [stat.workingSlider]));
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
            .attr('aria-pressed','false')
            .html('auto <span class="glyphicon glyphicon-ban-circle" aria-hidden="true"></span>');
        selectedIds();
    });

    $('#gallery-row').find('div.gallery-item').off('click').on('click', function(e) {
        e.preventDefault();
        e.stopPropagation();

        $('#slider-auto-btn[aria-pressed="true"]')
            .removeClass('active')
            .attr('aria-pressed','false')
            .html('auto <span class="glyphicon glyphicon-ban-circle" aria-hidden="true"></span>');

        $(this).toggleClass('selected-image');

        if ($(this).hasClass('selected-image')) {

            var cl = 'gallery-item col-xs-2 selected-image sortable-item';

            prototype({
                'template': '#sortable-item-prototype',
                'selectors': [
                    'data-id',
                    'bg-image'
                ],
                'values': [
                    $(this).attr('data-id'),
                    $(this).find('div.thumb-div').attr('data-src')
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
                  selector : 'div#slider-sortable div.gallery-item',
                  proportion : [1,1],
                  className : 'ssp',
                  styleId : 'slider-sortable-prop'
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
              selector : 'div#slider-sortable div.placeholder-item',
              proportion : [1,1],
              className : 'ssp',
              styleId : 'slider-sortable-prop'
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
              selector : 'div#slider-sortable div.placeholder-item',
              proportion : [1,1],
              className : 'ssp',
              styleId : 'slider-sortable-prop'
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
      selector : 'div#slider-sortable div.placeholder-item',
      proportion : [1,1],
      className : 'ssp',
      styleId : 'slider-sortable-prop'
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


$('.admin-header a[aria-controls="tags-panel"]').on('shown.bs.tab', function(e) {

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
            value = _.without(value, '', ' ');
            value = _.uniq(value);
            upldrData.tags = value.toString();
            upldr.options.data = JSON.stringify(upldrData);
        }
    });

    $('#upload-folder-select').on('change', function() {
        upldrData.path = options.galleryPath + $(this).val();
        upldr.options.data = JSON.stringify(upldrData);
    });
    upldrData.path = $('#upload-folder-select').val();
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
        'target': 'fileUpload.php',
        //'data' : JSON.stringify(upldrData),
        'cbReaderOnload': function(src, fName, fType, fSize, fLastMod) {
            //console.log( getSlug(fName, {'custom' : ['.'] }) );
            prototype({
                'template': '.file-row-prototype',
                'selectors': ['src', 'name', 'type', 'size', 'lastMod'],
                'values': [src, fName, fType, fSize, fLastMod],
                'targets': '#file-table-body'
            });
        },
        'cbOnloadend': function(res) {
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


function checkImageSizes(images, deep, cb) {
    console.log('checkImageSizes');

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
                var path = 'gallery/' + folder + '_' + gJ.sizes[sz] + '/' + image.file;

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
                    stat.newImages = _.without(stat.newImages, key);
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
        stat.newFolders = _.without(stat.newFolders, folder);

    }).fail(function(){
        stat.newFolders = _.without(stat.newFolders, folder);
       //console.log("images from folder error");
    });
    // <-- end images from folder function

    fnf++;

};

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
 * speakingurl
 * @version v10.0.0
 * @link http://pid.github.io/speakingurl/
 * @license BSD
 * @author Sascha Droste
 */!function(e,a){"use strict";var n=function(e,a){var n,t,u,l,s,r,m,c,h,d,g,k,f,y,p,A="-",b=[";","?",":","@","&","=","+","$",",","/"],z=[";","?",":","@","&","=","+","$",","],E=[".","!","~","*","'","(",")"],j="",S="",O=!0,v={},w={"À":"A","Á":"A","Â":"A","Ã":"A","Ä":"Ae","Å":"A","Æ":"AE","Ç":"C","È":"E","É":"E","Ê":"E","Ë":"E","Ì":"I","Í":"I","Î":"I","Ï":"I","Ð":"D","Ñ":"N","Ò":"O","Ó":"O","Ô":"O","Õ":"O","Ö":"Oe","Ő":"O","Ø":"O","Ù":"U","Ú":"U","Û":"U","Ü":"Ue","Ű":"U","Ý":"Y","Þ":"TH","ß":"ss","à":"a","á":"a","â":"a","ã":"a","ä":"ae","å":"a","æ":"ae","ç":"c","è":"e","é":"e","ê":"e","ë":"e","ì":"i","í":"i","î":"i","ï":"i","ð":"d","ñ":"n","ò":"o","ó":"o","ô":"o","õ":"o","ö":"oe","ő":"o","ø":"o","ù":"u","ú":"u","û":"u","ü":"ue","ű":"u","ý":"y","þ":"th","ÿ":"y","ẞ":"SS","ا":"a","أ":"a","إ":"i","آ":"aa","ؤ":"u","ئ":"e","ء":"a","ب":"b","ت":"t","ث":"th","ج":"j","ح":"h","خ":"kh","د":"d","ذ":"th","ر":"r","ز":"z","س":"s","ش":"sh","ص":"s","ض":"dh","ط":"t","ظ":"z","ع":"a","غ":"gh","ف":"f","ق":"q","ك":"k","ل":"l","م":"m","ن":"n","ه":"h","و":"w","ي":"y","ى":"a","ة":"h","ﻻ":"la","ﻷ":"laa","ﻹ":"lai","ﻵ":"laa","َ":"a","ً":"an","ِ":"e","ٍ":"en","ُ":"u","ٌ":"on","ْ":"","٠":"0","١":"1","٢":"2","٣":"3","٤":"4","٥":"5","٦":"6","٧":"7","٨":"8","٩":"9","က":"k","ခ":"kh","ဂ":"g","ဃ":"ga","င":"ng","စ":"s","ဆ":"sa","ဇ":"z","စျ":"za","ည":"ny","ဋ":"t","ဌ":"ta","ဍ":"d","ဎ":"da","ဏ":"na","တ":"t","ထ":"ta","ဒ":"d","ဓ":"da","န":"n","ပ":"p","ဖ":"pa","ဗ":"b","ဘ":"ba","မ":"m","ယ":"y","ရ":"ya","လ":"l","ဝ":"w","သ":"th","ဟ":"h","ဠ":"la","အ":"a","ြ":"y","ျ":"ya","ွ":"w","ြွ":"yw","ျွ":"ywa","ှ":"h","ဧ":"e","၏":"-e","ဣ":"i","ဤ":"-i","ဉ":"u","ဦ":"-u","ဩ":"aw","သြော":"aw","ဪ":"aw","၀":"0","၁":"1","၂":"2","၃":"3","၄":"4","၅":"5","၆":"6","၇":"7","၈":"8","၉":"9","္":"","့":"","း":"","č":"c","ď":"d","ě":"e","ň":"n","ř":"r","š":"s","ť":"t","ů":"u","ž":"z","Č":"C","Ď":"D","Ě":"E","Ň":"N","Ř":"R","Š":"S","Ť":"T","Ů":"U","Ž":"Z","ހ":"h","ށ":"sh","ނ":"n","ރ":"r","ބ":"b","ޅ":"lh","ކ":"k","އ":"a","ވ":"v","މ":"m","ފ":"f","ދ":"dh","ތ":"th","ލ":"l","ގ":"g","ޏ":"gn","ސ":"s","ޑ":"d","ޒ":"z","ޓ":"t","ޔ":"y","ޕ":"p","ޖ":"j","ޗ":"ch","ޘ":"tt","ޙ":"hh","ޚ":"kh","ޛ":"th","ޜ":"z","ޝ":"sh","ޞ":"s","ޟ":"d","ޠ":"t","ޡ":"z","ޢ":"a","ޣ":"gh","ޤ":"q","ޥ":"w","ަ":"a","ާ":"aa","ި":"i","ީ":"ee","ު":"u","ޫ":"oo","ެ":"e","ޭ":"ey","ޮ":"o","ޯ":"oa","ް":"","α":"a","β":"v","γ":"g","δ":"d","ε":"e","ζ":"z","η":"i","θ":"th","ι":"i","κ":"k","λ":"l","μ":"m","ν":"n","ξ":"ks","ο":"o","π":"p","ρ":"r","σ":"s","τ":"t","υ":"y","φ":"f","χ":"x","ψ":"ps","ω":"o","ά":"a","έ":"e","ί":"i","ό":"o","ύ":"y","ή":"i","ώ":"o","ς":"s","ϊ":"i","ΰ":"y","ϋ":"y","ΐ":"i","Α":"A","Β":"B","Γ":"G","Δ":"D","Ε":"E","Ζ":"Z","Η":"I","Θ":"TH","Ι":"I","Κ":"K","Λ":"L","Μ":"M","Ν":"N","Ξ":"KS","Ο":"O","Π":"P","Ρ":"R","Σ":"S","Τ":"T","Υ":"Y","Φ":"F","Χ":"X","Ψ":"PS","Ω":"W","Ά":"A","Έ":"E","Ί":"I","Ό":"O","Ύ":"Y","Ή":"I","Ώ":"O","Ϊ":"I","Ϋ":"Y","ā":"a","ē":"e","ģ":"g","ī":"i","ķ":"k","ļ":"l","ņ":"n","ū":"u","Ā":"A","Ē":"E","Ģ":"G","Ī":"I","Ķ":"k","Ļ":"L","Ņ":"N","Ū":"U","Ќ":"Kj","ќ":"kj","Љ":"Lj","љ":"lj","Њ":"Nj","њ":"nj","Тс":"Ts","тс":"ts","ą":"a","ć":"c","ę":"e","ł":"l","ń":"n","ś":"s","ź":"z","ż":"z","Ą":"A","Ć":"C","Ę":"E","Ł":"L","Ń":"N","Ś":"S","Ź":"Z","Ż":"Z","Є":"Ye","І":"I","Ї":"Yi","Ґ":"G","є":"ye","і":"i","ї":"yi","ґ":"g","ă":"a","Ă":"A","ș":"s","Ș":"S","ț":"t","Ț":"T","ţ":"t","Ţ":"T","а":"a","б":"b","в":"v","г":"g","д":"d","е":"e","ё":"yo","ж":"zh","з":"z","и":"i","й":"i","к":"k","л":"l","м":"m","н":"n","о":"o","п":"p","р":"r","с":"s","т":"t","у":"u","ф":"f","х":"kh","ц":"c","ч":"ch","ш":"sh","щ":"sh","ъ":"","ы":"y","ь":"","э":"e","ю":"yu","я":"ya","А":"A","Б":"B","В":"V","Г":"G","Д":"D","Е":"E","Ё":"Yo","Ж":"Zh","З":"Z","И":"I","Й":"I","К":"K","Л":"L","М":"M","Н":"N","О":"O","П":"P","Р":"R","С":"S","Т":"T","У":"U","Ф":"F","Х":"Kh","Ц":"C","Ч":"Ch","Ш":"Sh","Щ":"Sh","Ъ":"","Ы":"Y","Ь":"","Э":"E","Ю":"Yu","Я":"Ya","ђ":"dj","ј":"j","ћ":"c","џ":"dz","Ђ":"Dj","Ј":"j","Ћ":"C","Џ":"Dz","ľ":"l","ĺ":"l","ŕ":"r","Ľ":"L","Ĺ":"L","Ŕ":"R","ş":"s","Ş":"S","ı":"i","İ":"I","ğ":"g","Ğ":"G","ả":"a","Ả":"A","ẳ":"a","Ẳ":"A","ẩ":"a","Ẩ":"A","đ":"d","Đ":"D","ẹ":"e","Ẹ":"E","ẽ":"e","Ẽ":"E","ẻ":"e","Ẻ":"E","ế":"e","Ế":"E","ề":"e","Ề":"E","ệ":"e","Ệ":"E","ễ":"e","Ễ":"E","ể":"e","Ể":"E","ọ":"o","Ọ":"o","ố":"o","Ố":"O","ồ":"o","Ồ":"O","ổ":"o","Ổ":"O","ộ":"o","Ộ":"O","ỗ":"o","Ỗ":"O","ơ":"o","Ơ":"O","ớ":"o","Ớ":"O","ờ":"o","Ờ":"O","ợ":"o","Ợ":"O","ỡ":"o","Ỡ":"O","Ở":"o","ở":"o","ị":"i","Ị":"I","ĩ":"i","Ĩ":"I","ỉ":"i","Ỉ":"i","ủ":"u","Ủ":"U","ụ":"u","Ụ":"U","ũ":"u","Ũ":"U","ư":"u","Ư":"U","ứ":"u","Ứ":"U","ừ":"u","Ừ":"U","ự":"u","Ự":"U","ữ":"u","Ữ":"U","ử":"u","Ử":"ư","ỷ":"y","Ỷ":"y","ỳ":"y","Ỳ":"Y","ỵ":"y","Ỵ":"Y","ỹ":"y","Ỹ":"Y","ạ":"a","Ạ":"A","ấ":"a","Ấ":"A","ầ":"a","Ầ":"A","ậ":"a","Ậ":"A","ẫ":"a","Ẫ":"A","ắ":"a","Ắ":"A","ằ":"a","Ằ":"A","ặ":"a","Ặ":"A","ẵ":"a","Ẵ":"A","“":'"',"”":'"',"‘":"'","’":"'","∂":"d","ƒ":"f","™":"(TM)","©":"(C)","œ":"oe","Œ":"OE","®":"(R)","†":"+","℠":"(SM)","…":"...","˚":"o","º":"o","ª":"a","•":"*","၊":",","။":".",$:"USD","€":"EUR","₢":"BRN","₣":"FRF","£":"GBP","₤":"ITL","₦":"NGN","₧":"ESP","₩":"KRW","₪":"ILS","₫":"VND","₭":"LAK","₮":"MNT","₯":"GRD","₱":"ARS","₲":"PYG","₳":"ARA","₴":"UAH","₵":"GHS","¢":"cent","¥":"CNY","元":"CNY","円":"YEN","﷼":"IRR","₠":"EWE","฿":"THB","₨":"INR","₹":"INR","₰":"PF"},U=["်","ް"],C={"ာ":"a","ါ":"a","ေ":"e","ဲ":"e","ိ":"i","ီ":"i","ို":"o","ု":"u","ူ":"u","ေါင်":"aung","ော":"aw","ော်":"aw","ေါ":"aw","ေါ်":"aw","်":"်","က်":"et","ိုက်":"aik","ောက်":"auk","င်":"in","ိုင်":"aing","ောင်":"aung","စ်":"it","ည်":"i","တ်":"at","ိတ်":"eik","ုတ်":"ok","ွတ်":"ut","ေတ်":"it","ဒ်":"d","ိုဒ်":"ok","ုဒ်":"ait","န်":"an","ာန်":"an","ိန်":"ein","ုန်":"on","ွန်":"un","ပ်":"at","ိပ်":"eik","ုပ်":"ok","ွပ်":"ut","န်ုပ်":"nub","မ်":"an","ိမ်":"ein","ုမ်":"on","ွမ်":"un","ယ်":"e","ိုလ်":"ol","ဉ်":"in","ံ":"an","ိံ":"ein","ုံ":"on","ައް":"ah","ަށް":"ah"},I={en:{},az:{"ç":"c","ə":"e","ğ":"g","ı":"i","ö":"o","ş":"s","ü":"u","Ç":"C","Ə":"E","Ğ":"G","İ":"I","Ö":"O","Ş":"S","Ü":"U"},cs:{"č":"c","ď":"d","ě":"e","ň":"n","ř":"r","š":"s","ť":"t","ů":"u","ž":"z","Č":"C","Ď":"D","Ě":"E","Ň":"N","Ř":"R","Š":"S","Ť":"T","Ů":"U","Ž":"Z"},fi:{"ä":"a","Ä":"A","ö":"o","Ö":"O"},hu:{"ä":"a","Ä":"A","ö":"o","Ö":"O","ü":"u","Ü":"U","ű":"u","Ű":"U"},lt:{"ą":"a","č":"c","ę":"e","ė":"e","į":"i","š":"s","ų":"u","ū":"u","ž":"z","Ą":"A","Č":"C","Ę":"E","Ė":"E","Į":"I","Š":"S","Ų":"U","Ū":"U"},lv:{"ā":"a","č":"c","ē":"e","ģ":"g","ī":"i","ķ":"k","ļ":"l","ņ":"n","š":"s","ū":"u","ž":"z","Ā":"A","Č":"C","Ē":"E","Ģ":"G","Ī":"i","Ķ":"k","Ļ":"L","Ņ":"N","Š":"S","Ū":"u","Ž":"Z"},pl:{"ą":"a","ć":"c","ę":"e","ł":"l","ń":"n","ó":"o","ś":"s","ź":"z","ż":"z","Ą":"A","Ć":"C","Ę":"e","Ł":"L","Ń":"N","Ó":"O","Ś":"S","Ź":"Z","Ż":"Z"},sk:{"ä":"a","Ä":"A"},sr:{"љ":"lj","њ":"nj","Љ":"Lj","Њ":"Nj","đ":"dj","Đ":"Dj"},tr:{"Ü":"U","Ö":"O","ü":"u","ö":"o"}},N={ar:{"∆":"delta","∞":"la-nihaya","♥":"hob","&":"wa","|":"aw","<":"aqal-men",">":"akbar-men","∑":"majmou","¤":"omla"},az:{},ca:{"∆":"delta","∞":"infinit","♥":"amor","&":"i","|":"o","<":"menys que",">":"mes que","∑":"suma dels","¤":"moneda"},cz:{"∆":"delta","∞":"nekonecno","♥":"laska","&":"a","|":"nebo","<":"mene jako",">":"vice jako","∑":"soucet","¤":"mena"},de:{"∆":"delta","∞":"unendlich","♥":"Liebe","&":"und","|":"oder","<":"kleiner als",">":"groesser als","∑":"Summe von","¤":"Waehrung"},dv:{"∆":"delta","∞":"kolunulaa","♥":"loabi","&":"aai","|":"noonee","<":"ah vure kuda",">":"ah vure bodu","∑":"jumula","¤":"faisaa"},en:{"∆":"delta","∞":"infinity","♥":"love","&":"and","|":"or","<":"less than",">":"greater than","∑":"sum","¤":"currency"},es:{"∆":"delta","∞":"infinito","♥":"amor","&":"y","|":"u","<":"menos que",">":"mas que","∑":"suma de los","¤":"moneda"},fr:{"∆":"delta","∞":"infiniment","♥":"Amour","&":"et","|":"ou","<":"moins que",">":"superieure a","∑":"somme des","¤":"monnaie"},gr:{},hu:{"∆":"delta","∞":"vegtelen","♥":"szerelem","&":"es","|":"vagy","<":"kisebb mint",">":"nagyobb mint","∑":"szumma","¤":"penznem"},it:{"∆":"delta","∞":"infinito","♥":"amore","&":"e","|":"o","<":"minore di",">":"maggiore di","∑":"somma","¤":"moneta"},lt:{},lv:{"∆":"delta","∞":"bezgaliba","♥":"milestiba","&":"un","|":"vai","<":"mazak neka",">":"lielaks neka","∑":"summa","¤":"valuta"},my:{"∆":"kwahkhyaet","∞":"asaonasme","♥":"akhyait","&":"nhin","|":"tho","<":"ngethaw",">":"kyithaw","∑":"paungld","¤":"ngwekye"},mk:{},nl:{"∆":"delta","∞":"oneindig","♥":"liefde","&":"en","|":"of","<":"kleiner dan",">":"groter dan","∑":"som","¤":"valuta"},pl:{"∆":"delta","∞":"nieskonczonosc","♥":"milosc","&":"i","|":"lub","<":"mniejsze niz",">":"wieksze niz","∑":"suma","¤":"waluta"},pt:{"∆":"delta","∞":"infinito","♥":"amor","&":"e","|":"ou","<":"menor que",">":"maior que","∑":"soma","¤":"moeda"},ro:{"∆":"delta","∞":"infinit","♥":"dragoste","&":"si","|":"sau","<":"mai mic ca",">":"mai mare ca","∑":"suma","¤":"valuta"},ru:{"∆":"delta","∞":"beskonechno","♥":"lubov","&":"i","|":"ili","<":"menshe",">":"bolshe","∑":"summa","¤":"valjuta"},sk:{"∆":"delta","∞":"nekonecno","♥":"laska","&":"a","|":"alebo","<":"menej ako",">":"viac ako","∑":"sucet","¤":"mena"},sr:{},tr:{"∆":"delta","∞":"sonsuzluk","♥":"ask","&":"ve","|":"veya","<":"kucuktur",">":"buyuktur","∑":"toplam","¤":"para birimi"},uk:{"∆":"delta","∞":"bezkinechnist","♥":"lubov","&":"i","|":"abo","<":"menshe",">":"bilshe","∑":"suma","¤":"valjuta"},vn:{"∆":"delta","∞":"vo cuc","♥":"yeu","&":"va","|":"hoac","<":"nho hon",">":"lon hon","∑":"tong","¤":"tien te"}};if("string"!=typeof e)return"";if("string"==typeof a&&(A=a),m=N.en,c=I.en,"object"==typeof a){n=a.maintainCase||!1,v=a.custom&&"object"==typeof a.custom?a.custom:v,u=+a.truncate>1&&a.truncate||!1,l=a.uric||!1,s=a.uricNoSlash||!1,r=a.mark||!1,O=a.symbols!==!1&&a.lang!==!1,A=a.separator||A,l&&(p+=b.join("")),s&&(p+=z.join("")),r&&(p+=E.join("")),m=a.lang&&N[a.lang]&&O?N[a.lang]:O?N.en:{},c=a.lang&&I[a.lang]?I[a.lang]:a.lang===!1||a.lang===!0?{}:I.en,a.titleCase&&"number"==typeof a.titleCase.length&&Array.prototype.toString.call(a.titleCase)?(a.titleCase.forEach(function(e){v[e+""]=e+""}),t=!0):t=!!a.titleCase,a.custom&&"number"==typeof a.custom.length&&Array.prototype.toString.call(a.custom)&&a.custom.forEach(function(e){v[e+""]=e+""}),Object.keys(v).forEach(function(a){var n;n=a.length>1?new RegExp("\\b"+o(a)+"\\b","gi"):new RegExp(o(a),"gi"),e=e.replace(n,v[a])});for(g in v)p+=g}for(p+=A,p=o(p),e=e.replace(/(^\s+|\s+$)/g,""),f=!1,y=!1,d=0,k=e.length;d<k;d++)g=e[d],i(g,v)?f=!1:c[g]?(g=f&&c[g].match(/[A-Za-z0-9]/)?" "+c[g]:c[g],f=!1):g in w?(d+1<k&&U.indexOf(e[d+1])>=0?(S+=g,g=""):y===!0?(g=C[S]+w[g],S=""):g=f&&w[g].match(/[A-Za-z0-9]/)?" "+w[g]:w[g],f=!1,y=!1):g in C?(S+=g,g="",d===k-1&&(g=C[S]),y=!0):!m[g]||l&&b.join("").indexOf(g)!==-1||s&&z.join("").indexOf(g)!==-1?(y===!0?(g=C[S]+g,S="",y=!1):f&&(/[A-Za-z0-9]/.test(g)||j.substr(-1).match(/A-Za-z0-9]/))&&(g=" "+g),f=!1):(g=f||j.substr(-1).match(/[A-Za-z0-9]/)?A+m[g]:m[g],g+=void 0!==e[d+1]&&e[d+1].match(/[A-Za-z0-9]/)?A:"",f=!0),j+=g.replace(new RegExp("[^\\w\\s"+p+"_-]","g"),A);return t&&(j=j.replace(/(\w)(\S*)/g,function(e,a,n){var t=a.toUpperCase()+(null!==n?n:"");return Object.keys(v).indexOf(t.toLowerCase())<0?t:t.toLowerCase()})),j=j.replace(/\s+/g,A).replace(new RegExp("\\"+A+"+","g"),A).replace(new RegExp("(^\\"+A+"+|\\"+A+"+$)","g"),""),u&&j.length>u&&(h=j.charAt(u)===A,j=j.slice(0,u),h||(j=j.slice(0,j.lastIndexOf(A)))),n||t||(j=j.toLowerCase()),j},t=function(e){return function(a){return n(a,e)}},o=function(e){return e.replace(/[-\\^$*+?.()|[\]{}\/]/g,"\\$&")},i=function(e,a){for(var n in a)if(a[n]===e)return!0};if("undefined"!=typeof module&&module.exports)module.exports=n,module.exports.createSlug=t;else if("undefined"!=typeof define&&define.amd)define([],function(){return n});else try{if(e.getSlug||e.createSlug)throw"speakingurl: globals exists /(getSlug|createSlug)/";e.getSlug=n,e.createSlug=t}catch(e){}}(this);'use strict';

var _upldr = function() {

    this.options = {
        'target': "fileUpload.php",
        'typeMatch': 'image.*',
        'slug': true,
        'cbReaderOnload': function() {
            //console.log("cbReaderOnload");
        },
        'cbReset': function() {
            document.getElementById('file-table-body').innerHTML = "";
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
        ftb.innerHTML = "";

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
       //console.log("reset");
        files = [];
        form.reset();
        progressBar.style.width = 0;
        progressBar.innerHTML = "";
        submitBtn.innerHTML = submitBtnInitText;
        submitBtn.disabled = true;
        resetBtn.disabled = true;
        if (options.cbReset) {
            options.cbReset();
        }
        //document.getElementById('file-table-body').innerHTML = "";
    };

    function progress(e) {
        if (e.lengthComputable) {
            percLoaded = Math.round(e.loaded / e.total * 100) + "%";
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

        request.upload.addEventListener("progress", progress, false);
        request.open("POST", options.target, true);
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
