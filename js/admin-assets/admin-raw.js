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
