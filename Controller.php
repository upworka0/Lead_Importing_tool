<?php
	require_once('utils.php');

	if ($_SERVER['REQUEST_METHOD'] != 'POST') errorMessage('POST method only allowed')

	$file = saveFile();
	echo json_encode(array("status" => "success", "file" => $file, "data" => getContentFile($file)));
?>