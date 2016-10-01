<?php

require 'Minifier.php';

//$o = array("path" => "", "filter" => '*.{js,json}', "outpath" => '', "concat" => false, "minify" => false, "gzip" => false, "cache" => false);

$o["path"] = "";
$o["filter"] = '*.{js,json}';
$o["root"] = dirname(__DIR__);
$o["outpath"] = '/js/';
$o["concat"] = false;
$o["minify"] = false;
$o["gzip"] = false;
$o["cache"] = false;

$outpath = $o["root"] . $o["outpath"];

if (isset($_GET['options'])) {
	$data = json_decode($_GET['options'], true);
	//$o = array_merge($o, $data);

	foreach ($data as $key => $value) {
		$o[$key] = $value;
	}
}

$concatContent = "";
$pf = $o['path'] . $o['filter'];
$files = glob($pf, GLOB_BRACE);
$fileNames = array();
$outFiles = array();

foreach ($files as $file) {

	$pathParts = pathinfo($file);
	$fileDir = $pathParts['dirname'];
	$baseName = $pathParts['basename'];
	$fileExtension = $pathParts['extension'];
	$fileName = $pathParts['filename'];

	array_push($fileNames, $baseName);

	$fileContent = file_get_contents($file);

	if ($o['minify']) {
		$fileContent = \JShrink\Minifier::minify($fileContent);
	}

	if ($o['concat']) {
		$concatContent = $concatContent . $fileContent;
		$fileContent = $concatContent;
	} else {
		$outFile = $fileName . '.min.' . $fileExtension;
		file_put_contents($outpath . $outFile, $fileContent);
		array_push($outFiles, $outFile);
		$response['outfiles'] = $outFiles;
	}

}

if ($o['concat']) {
	$pathName = basename($o['path']);
	$outFile = $pathName . $fileExtension;
	if ($o['minify']) {
		$outFile = $pathName . '.min.' . $fileExtension;
	}

	file_put_contents($outpath . $outExt, $fileContent);
	array_push($outFiles, $outFile);
	$response['outfiles'] = $outFiles;
}

$response['paths'] = $files;
$response['names'] = $fileNames;

echo json_encode($response);
?>