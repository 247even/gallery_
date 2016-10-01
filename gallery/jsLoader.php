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
$o["skipmin"] = true;

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
$response['outfiles'] = array();

foreach ($files as $file) {

	$pathParts = pathinfo($file);
	$fileDir = $pathParts['dirname'];
	$baseName = $pathParts['basename'];
	$fileExtension = $pathParts['extension'];
	$fileName = $pathParts['filename'];
	
	if($o['skipmin']){
		if (strpos($fileName, '.min') !== false) {
			continue;
		}
	}

	array_push($fileNames, $baseName);
	$outFile = $baseName;

	if ($o['minify'] || $o['concat']) {

		$fileContent = file_get_contents($file);

		if ($o['minify']) {
			$fileContent = \JShrink\Minifier::minify($fileContent);
			$outFile = $fileName . '.min.' . $fileExtension;
		}

		if ($o['concat']) {
			$concatContent = $concatContent . $fileContent;
			$fileContent = $concatContent;
		} else {
			file_put_contents($outpath . $outFile, $fileContent);
			array_push($response['outfiles'], $outFile);
		}
		
	}
}

if ($o['concat']) {
	$pathName = basename($o['path']);
	$outFile = $pathName . '.' . $fileExtension;
	if ($o['minify']) {
		$outFile = $pathName . '.min.' . $fileExtension;
	}
	//file_put_contents($outpath . $outExt, $fileContent);
	file_put_contents($o["root"] . $o["outpath"] . $outFile, $fileContent);

	array_push($response['outfiles'], $outFile);
}

//$response['paths'] = $files;
$response['names'] = $fileNames;

echo json_encode($response);
?>