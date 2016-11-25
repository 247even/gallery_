<?php
// content and target should be required
function saveFileAs($content, $target, $filename, $extension, $overwrite) {

//	$enContent = json_encode($content);
	$enContent = $content;

	//mkdir($target);
	$target = '../'.$target;
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

if (isset($_POST['content'])) {
	$gContent = json_decode($_POST['content']);
}

if (isset($_POST['target'])) {
	$gTarget = $_POST['target'];
}

// content & target are required
if ($gContent && $gTarget) {
	saveFileAs($gContent, $gTarget);
}
?>
