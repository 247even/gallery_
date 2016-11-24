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
