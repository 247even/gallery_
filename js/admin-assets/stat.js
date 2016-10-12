var stat = {
    'imagesRemoved': [],
    'imagesAdded': {},
    'imagesAddedKeys': [],
    'imagesModified': [],
    'imagesNotProcessed': [],

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
        buildFolderTable(stat.allFolders);
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
        buildFolderTable(stat.allFolders);
    },
    get newFolders() {
        return this._newFolders;
    }

};
