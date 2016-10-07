/* Raw Panel */
$('.admin-header a[aria-controls="raw-panel"]').on('shown.bs.tab', function(e) {

	loader();

	getAllBackups().done(function(data) {
		$("#loadBackupSelect").html("").append("<option>---</option>");
		//console.log(data);
		//var data = JSON.parse(data);
		for (var i = 0; i < data.length; i++) {
			var split = data[i].split(".");
			var opt = "<option data-url=" + data[i] + ">" + convertTimestamp(split[1]) + "</option>";
			$("#loadBackupSelect").append(opt);
		};

		$("#loadBackupSelect").on("change", function() {
			loader();
			var dataUrl = $('#loadBackupSelect option:selected').attr("data-url");
			var url = "gallery/" + dataUrl;
			var outputText = "Gallery JSON";
			var outputData = gJ;
			if (!dataUrl) {
				$("#json-output").text(JSON.stringify(outputData, null, '\t'));
				$(".outputFile").text(outputText);
				return false;
			}

			$.getJSON(url, function(data) {
				outputData = data;
				outputText = dataUrl;
			}).always(function() {
				$("#json-output").text(JSON.stringify(outputData, null, '\t'));
				$(".outputFile").text(outputText);
				loader("off");
			});

			$("#loadBuBtn").on("click", function() {
				buildGallery(outputData);
			});
		});

	});

	$(".gallery-row .gallery-item").removeClass("selected-image");

	$("#json-output").text(JSON.stringify(gJ, null, '\t'));
	loader("off");

}); 