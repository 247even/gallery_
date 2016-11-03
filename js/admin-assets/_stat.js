'use strict';

var stat = {
    'imagesRemoved': [],
    'imagesAdded': {},
    'imagesAddedKeys': [],
    'imagesModified': [],
    'imagesNotProcessed': [],
    'workingFolder': '',
    'workingSlider': 's1',
    'selectedIds': [],
    'sliders': {},
    'effect' : ['blur', 5],

    '_workingImage': '',
    set workingImage(val) {
        this._workingImage = val;
        console.log('workingImage: '+this._workingImage);
    },
    get workingImage() {
        return this._workingImage;
    },

    '_workingSize': '',
    set workingSize(val) {
        this._workingSize = val;
        console.log('workingSize: '+this._workingSize);
    },
    get workingSize() {
        return this._workingSize;
    },

    '_folderImages': [],
    set folderImages(val) {
        this._folderImages = val;
        console.log('folderImages buildFolderTable()');
        buildFolderTable();
    },
    get folderImages() {
        return this._folderImages;
    },

    '_allImages': {},
    set allImages(val) {
        this._allImages = {};
        if (val) {
            this._allImages = val;
        }
    },
    get allImages() {
        return this._allImages;
    },

    '_newImages': [],
    set newImages(val) {
        this._newImages = val;
        console.log('stat.newImages: '+stat.newImages.length);
        console.log(stat.folderImages);
        $('#folder-modal .modal-body .status-div').html(stat.newImages.length);
        if(stat.newImages.length > 0){

        }
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
            console.log(stat.folderImages);

            var msg = '"' + folder + '" (' + stat.folderImages[folder][0] + ')';

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
                    console.log(result);
                    if (result) {
                      // add folder:
                      processNewFolder({
                          'folder': folder,
                          'cb': function() {
                              stat.newFolders = _.without(stat.newFolders, stat.workingFolder);
                          }
                      });

                      return false;
                    }

                    // ignore folder:
                    ignoreFolder(folder);
                    stat.newFolders = _.without(stat.newFolders, folder);
                }
            });
        }
    },
    get newFolders() {
        return this._newFolders;
    }

};
