<?php
// content and target should be required
function saveFileAs($content, $target, $filename, $extension, $overwrite) {
	
	$enContent = json_encode($content);

	// check if target contains '/'
	if (strpos($target, "/") !== false) {
		if (strpos($target, "/") === 0) {
			// remove '/'
			$target = str_replace('/', '', $target);
		}
	}

	if (strpos($target, ".") !== false) {
		if (strpos($target, ".") === 0) {
			//$target = str_replace('.', '', $file);
			//$target = explode(".", $target);
		}
	} else {
		$target = $target . '/' . $filename . '.' . $extension;
	}

	//mkdir($target);
	touch($target);
	chmod($target, 0777);
	$fp = fopen($target, 'w');
	fwrite($fp, $enContent);
	fclose($fp);
	echo $target.' saved';
}


//////////////////////////////////////////////////////////////////////////////////////

$gContent = false;
$gTarget = false;

if (isset($_GET['content']) || isset($_POST['content'])) {
	$gContent = json_decode($_GET['content']);
}

if (isset($_GET['target']) || isset($_POST['target'])) {
	$gTarget = $_GET['target'];
}

// content & target are required
if ($gContent && $gTarget) {
	saveFileAs($gContent, $gTarget);
}
?>

