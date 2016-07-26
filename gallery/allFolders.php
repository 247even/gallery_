<?php
function allFolders() {
	// find all galeries, aka folders:
	return array_values(array_filter(glob('*'), 'is_dir'));
};

if (isset($_GET['allFolders']) || isset($_POST['allFolders'])) {
	echo json_encode(allFolders());
};
?>