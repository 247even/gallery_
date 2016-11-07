/* Tags Panel */

var selectedImages_tags;

var selectizeInput = $('#input-tags').selectize({
    plugins: ['remove_button'],
    delimiter: ',',
    persist: false,
    createFilter: '^[a-zA-Z0-9_äüö -]+$',
    create: function(inpt) {
        var input = inpt.split(',');
        $('#gallery-row').find('div.selected-image').each(function() {
            var dataTags = $(this).attr('data-tags').split(',');
            unionTags = _.union(dataTags, input);
            if (unionTags != dataTags) {
                $(this).attr('data-tags', unionTags).addClass('edited');
            }
        });
        return {
            'text': input,
            'value': input
        };
    }
});
var selectizeTags = selectizeInput[0].selectize;
selectizeTags.clear();

$('.selectize-input .item').on('click', function() {
    var value = $(this).attr('data-value');
    $('#gallery-row').find('div.gallery-item[data-tags*="'+value+'"]').addClass('selected-image');
});

$('.admin-header a[aria-controls="tags-panel"]').on('shown.bs.tab', function(e) {

    stat.allTags = !stat.allTags.length ? gJ.tags : stat.allTags;

    $('#all-tags').find('button').on('click', function(){
        $('#gallery-row').find('div.gallery-item[data-tags*="'+$(this).text()+'"]').trigger('click');
    });

    $('#gallery-row').find('div.gallery-item').removeClass('selected-image').off('click').on('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        $(this).toggleClass('selected-image');
        selectTags();
    });

    $('#tags-submit-button').click(function(e) {
        e.preventDefault();

        var tags = [];

        $('#gallery-row').find('.edited').each(function() {
            gJ.images[$(this).attr('data-id')].tags = $(this).attr('data-tags').split(',');
        });

        $.each(gJ.images, function(k, v) {
            tags.push(v.tags);
        })

        gJ.tags = _.uniq(_.flattenDeep(tags));
        buildGalleryNavigation();
        saveStatus(true);

        //console.log(tagsJSON);
        return false;

        var postdata = $('#tags-form').serialize();
    });

    $('#deleteImagesButton').on('click', function() {
        console.log('delete clicked');
        deleteSelectedImages();
    });

});

function selectTags() {

    var selectedImages = $('#gallery-row').find('div.selected-image');
    var selectedLength = selectedImages.length;
    var selectedTags = [];

    selectizeTags.clear();

    if (selectedLength === 0) {
      console.log('nothing selected');
      return false;
    }

    var firstTag = selectedImages.first().attr('data-tags').split(',');
    var groupTags = $('#input-tags').attr('value').split(',');

    if (selectedLength === 1) {

        selectedTags = groupTags = firstTag;

    } else if (selectedLength > 1) {

        groupTags = !groupTags[0] ? firstTag : groupTags;
        selectedImages.each(function() {
            attrTags = $(this).attr('data-tags').split(',');
            // all unique selected tags:
            selectedTags = _.union(selectedTags, attrTags);
            groupTags = _.intersection(groupTags, attrTags);
        });

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
                paths.push(gJ.images[id].path + '_' + size + '/' + gJ.images[id].file);
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
                    console.log('done ' + p);
                    deleteFinished();
                }).fail(function() {
                    p++;
                    console.log('fail ' + p);
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
                console.log('finished deleting');

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
