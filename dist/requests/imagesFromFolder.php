<?php
function imagesFromFolder($folder) {

	if(!$folder){
		echo "folder missing";
		return false;
	}

	if (!file_exists($folder)) {
		echo "no such folder.<br>";
		return false;
	}

	$path = $folder . '/';
	$images = array();
	$baseFolder = str_replace('../gallery/', '', $folder);
	// search all images in folder
	foreach (glob("".$path."*.{jpg,jpeg,png,gif}", GLOB_BRACE) as $filename) {
			//array_push($images, basename($filename));
			$pi = pathinfo($filename);
			$piName = $pi['filename'];
			$piExt = $pi['extension'];

		 	$imageObject = array("file" => basename($filename), "type" => $piExt, "folder" => $baseFolder, "time" => filemtime($filename), "tags" => [$folder]);
//		 	$newId = str_replace('gallery/', '', $folder.basename($filename));
			$newId = $baseFolder.$piName;
		 	$existingImages[$newId] = $imageObject;
	}
	//$existingImages['images'] = $images;
	return $existingImages;
};

if (isset($_POST['folder'])) {
	echo json_encode(imagesFromFolder($_POST['folder']));
};
?>
