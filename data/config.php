<?php
	header('Content-Type:text/html; charset=utf-8');
	header('content-type:application:json;charset=utf8'); 
	header('Access-Control-Allow-Origin:*'); 
	header('Access-Control-Allow-Headers:x-requested-with,content-type');
	$conn = mysqli_connect("127.0.0.1","root","","easyui");
    $sql = "SET NAMES UTF8";
	mysqli_query($conn,$sql);
?>
