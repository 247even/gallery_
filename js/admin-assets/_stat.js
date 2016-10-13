"use strict";

var stat = {
    'imagesRemoved': [],
    'imagesAdded': {},
    'imagesAddedKeys': [],
    'imagesModified': [],
    'imagesNotProcessed': [],
    'workingFolder': '',

    '_folderImages': [],
    set folderImages(val) {
        this._folderImages = val;
        console.log("folderImages buildFolderTable()");
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
        getNewImages();
        //console.log("allImages buildFolderTable()");
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
        $('#processStatus').html(this._newImages.length + ' image/s found in "' + stat.newFolders[0] + '".');
    },
    get newImages() {
        return this._newImages;
    },

    '_allFolders': [],
    set allFolders(val) {
        this._allFolders = val;
        console.log("stat.allFolders buildFolderTable:");
        //buildFolderTable();
    },
    get allFolders() {
        return this._allFolders;
    },

    '_newFolders': [],
    set newFolders(val) {
        this._newFolders = val;
        if (stat.newFolders.length > 0) {
            $('#processStatus').html(stat.newFolders.length + ' new folder(s) found.');
            $('#allFoldersButton').text('add folder "' + stat.newFolders[0] + '"');

            //for (var i = 0; stat.newFolders.length > i; i++) {
            $('#folder-modal .modal-body').html('"' + stat.newFolders[0] + '"');
            $('#folder-modal').attr('data', stat.newFolders[0])
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

function getNewImages() {

    var match = [];
    stat.newImages = [];

    for (var key in stat.allImages) {
        if (!gJ.images[key]) {
            // this image is not in gJ, must be new
            match[key] = stat.allImages[key];
        }
    }

    if (Object.keys(match) > 0) {
        // we have new images
        stat.newImages = Object.keys(match);
    } else {
        console.log("no new images");
    }
};


function getRemovedImages() {

    // all IDs from gJ filtered by folder:
    var galleryByFolder = _.pickBy(gJ.images, {
        'path': stat.workingFolder
    });

    for (var key in galleryByFolder) {
        if (!stat.imagesFromFolder[key]) {
            // this image is not present anymore
            stat.imagesRemoved.push(kk);
        }
    }
};
