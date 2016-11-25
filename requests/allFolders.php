<?php
function allFolders() {
	// find all galeries, aka folders:
	return array_values(array_filter(glob('../gallery/*'), 'is_dir'));
};

if (isset($_POST['allFolders'])) {
	echo json_encode(allFolders());
};
?>
