<?php

function allFiles() {
	$files;
	$path = "";
	$filter = "*";

	if (isset($_GET['path'])) {
		$path = '../'.$_GET['path'];
	};

	//$filter = 'gallery.*.{json}';
	if (isset($_GET['filter'])) {
		$filter = $_GET['filter'];
	};

	$pf = $path . $filter;
	$paths = glob($pf, GLOB_BRACE);
	$names = array();

	foreach($paths as $file){
		 array_push($names, basename($file));
	}
	$response['names'] = $names;
	$response['paths'] = $paths;
	return $response;
};

echo json_encode(allFiles());
?>
