<?php

function checkFolders($jsonFolders, $existingFolders) {

	$ck = 0;

	if (!$jsonFolders) {
		echo "Error: No jsonFolders!<br>";
		return false;
	}
	if (!$existingFolders) {
		echo "Error: No existingFolders!<br>";
		return false;
	}

	$newFolders = array_diff($existingFolders, $jsonFolders);
	$oldFolders = array_diff($jsonFolders, $existingFolders);
	
	if (!empty($newFolders)) {
		foreach ($newFolders as $key => $value) {
			$targetpath = $value . '_280/';
			mkdir($targetpath);
			processImages(imagesFromFolder($newFolder), $value);
			$ck = 1;
		}
	}

	if (!empty($oldFolders)) {
		foreach ($oldFolders as $key => $value) {
			echo "Removed folder found: '" . $value . "'.<br>";
			if (!file_exists($value)) {
				// this folder is not present anymore
				$tf = $value . "_280";
				if (file_exists($tf)) {
					echo "lonesome thumbs-Folder found: " . $tf . " <br>";
					array_map('unlink', glob("$tf/*.*"));
					if (rmdir($tf)) {
						echo "...and removed.<br>";
					}
				}
			}
		}
		$ck = 1;
	}

	if ($ck == 1) {
		saveJSON(buildExistingGallery());
		start();
	}
}
?>