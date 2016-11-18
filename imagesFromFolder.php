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
	// search all images in folder
	foreach (glob("".$path."*.{jpg,jpeg,png,gif}", GLOB_BRACE) as $filename) {
		array_push($images, basename($filename));

		 $imageObject = array("file" => basename($filename), "path" => $folder, "time" => filemtime($filename), "tags" => [$folder]);
		 $newId = str_replace('gallery/', '', $folder.basename($filename));
		 $existingImages[$newId] = $imageObject;

	}
	return $existingImages;
	//echo json_encode($images) . "<br>";
	//return $images;
};

if (isset($_GET['folder']) || isset($_POST['folder'])) {
	//echo $_POST['folder'];
	echo json_encode(imagesFromFolder($_POST['folder']));
};
?>
