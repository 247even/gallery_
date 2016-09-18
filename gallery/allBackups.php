<?php
function allBackups() {
	// find all galeries, aka folders:
	return array_values(glob('gallery.*.{json}', GLOB_BRACE));
};

if (isset($_GET['allBackups']) || isset($_POST['allBackups'])) {
	echo json_encode(allBackups());
};
?>