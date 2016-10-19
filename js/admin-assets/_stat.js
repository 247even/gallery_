'use strict';

var stat = {
    'imagesRemoved': [],
    'imagesAdded': {},
    'imagesAddedKeys': [],
    'imagesModified': [],
    'imagesNotProcessed': [],
    'workingFolder': '',

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
        //getNewImages();
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
        //getNewImages();
        //console.log('allImages buildFolderTable()');
        //buildFolderTable();
        /*
        var imgtd = Object.keys(stat.allImages).length;
        if(stat.newImages.length > 0){
            imgtd = imgtd+"/"+stat.newImages.length;
        }
        $("#tr-"+stat.workingFolder+" .td-img").html(imgtd);
        */
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
            var fo = stat.newFolders[0];
            stat.workingFolder = fo;
            console.log(stat.folderImages);
            $('#folder-modal .modal-body .folder-name').html('"' + fo + '" (' + stat.folderImages[fo][0] + ')');

            $('#folder-modal').attr('data', fo)
                .modal('show');

            /*
            prototype({
            'template' : '#folder-button-template',
            'selectors' : ['folder'],
            'values' : [stat.newFolders[i]],
            'targets' : '#folderButtons'
            });
            */
            //}
        }
        //buildFolderTable();
    },
    get newFolders() {
        return this._newFolders;
    }

};
