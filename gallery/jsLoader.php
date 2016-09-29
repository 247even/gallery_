<?php

$options = array("path" => "", "filter" => '*.{js,json,js.gz,json.gz,html}', "concat" => false, "minify" => false, "gzip" => false, "cache" => false);

if (isset($_GET['options'])) {
	$data = json_decode($_GET['options'], true);
	$options = array_merge($options, $data);
}

/*
foreach ($pd as $key => $value) {
	$data[key] = $value;
}
 */


$pf = $options['path'] . $options['filter'];
$paths = glob($pf, GLOB_BRACE);
$names = array();

foreach ($paths as $file) {
	array_push($names, basename($file));
}
$response['names'] = $names;
$response['paths'] = $paths;

echo json_encode($response);
?>