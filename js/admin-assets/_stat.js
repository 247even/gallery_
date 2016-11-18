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
        this._tagsEdited = this._tagsEdited.push(val).unique();
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
