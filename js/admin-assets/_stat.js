'use strict';

var stat = {
    'imagesRemoved': [],
    'imagesAdded': {},
    'imagesAddedKeys': [],
    'imagesModified': [],
    'imagesNotProcessed': [],
    'options' : {
        'sizes': [280,430,720,1200],
        'thumbSize': 'md',
      	'thumbProportion': '1,1',
      	'thumbFit': 'cover',
      	'thumbPadding': '0'
    },
    'workingFolder': '',
    '_effect' : ['blur', 5],
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
    '_sliderNumber' : 5,
    set sliderNumber(val) {
      this._sliderNumber = val;
    },
    get sliderNumber() {
      return this._sliderNumber;
    },
    '_sliderInterval' : 3,
    set sliderInterval(val) {
      this._sliderInterval = val;
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
            var msg = '"' + folder + '"';
            if (stat.folderImages[folder]){
                msg = msg +' (' + stat.folderImages[folder][0] + ')';
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
                    console.log(result);
                    if (result) {
                      // add folder:
                      gJ.folders.push(folder);
                      setFolderSelect();
                      $('#upload-folder-select').val(folder).prop('selected', true);
                      processNewFolder({
                          'folder': folder,
                          'cb': function() {
                              stat.newFolders = _.without(stat.newFolders, stat.workingFolder);
                          }
                      });
                      return;
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

function statSaveSlider(im) {
    //var images = (im) ? im : selectedIds();
    var images = (im) ? im : stat.selectedIds;
    var pressed = document.getElementById('slider-auto-btn').getAttribute('aria-pressed');

    if (!im && pressed) {
        images = 'auto';
    }

    stat.sliders[stat.workingSlider] = [
        images,
        stat.sliderInterval,
        stat.sliderNumber
    ];
};
