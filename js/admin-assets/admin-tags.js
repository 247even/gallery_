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
