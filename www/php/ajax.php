<?php
//                PUBLIC DOMAIN by Jean-Marc Lienher
//
//             The authors disclaim copyright to this software.
//

	error_reporting(E_ALL);
	ini_set('display_errors', 'On');


include "wp-admin/php/wp.php";
include "wp-admin/php/session.php";
if (!isset($_SESSION['UserData']["user"])) exit(-1);



$dn = dirname(__FILE__) . "/wp-content/uploads/";

function get_upload_dir()
{
	global $dn;
	return $dn;
}

/*
function gen_folder()
{
	$folder = date("Ym");
	return $folder;
}

function get_folder($folder) {
	if (strlen($folder) < 6) {
		//header('HTTP/1.1 403 Forbidden');
		//exit();
		return "/" . $folder;
	}
	$dst = "/" . substr($folder,0, 4)
		. "/" . substr($folder, 4);
	return $dst;
}
*/

function gen_folder()
{
	global $user;
	$folder = date("YmdHis") . $user;
	return $folder;
}

function get_folder($folder) {
	global $dn, $lang;
	if (strlen($folder) < 14) {
		header('HTTP/1.1 403 Forbidden');
		echo $lang["error #17!"] . "+8";
		exit();
	}
	$dst = "/" . substr($folder,0, 4)
		. "/" . substr($folder, 4, 2)
		. "/" . substr($folder, 6, 2)
		. "/" . substr($folder, 8, 2)
		. "/" . substr($folder, 10, 2)
		. "/" . substr($folder, 12, 2)
		. "/" . substr($folder, 14);
	return $dst;
}


function check_read_permission($dest)
{
	global $user, $dn, $lang;
	$dr = $dest;

	if (strlen($user) >= 4 && wp_str_ends_with($dr, "/" . $user)) {
		return $dr;
	}

	if (has_permission($dest, $user, "write")) {
		return $dr;
	}
	if (has_permission($dest, $user, "read")) {
		return $dr;
	}
	header('HTTP/1.1 403 Forbidden');
	echo $lang["error #17!"] . "+10";
	exit();
}

function has_permission($dest, $user, $type)
{
	if (strlen($user) < 4) {
		return false;
	}

	$na = dirname($dest) . "/." . $type;
	if (!file_exists($na)) {
		return false;
	}	
	$f = fopen($na, "r");
	if ($f) {
		while (!feof($f)) {
			$u = fgets($f);
			if (!strcmp($u, $user)) {
				fclose($f);
				return true;
			}
		}
		fclose($f);
	}
	return false;
}

function check_write_permission($dest)
{
	global $user, $dn, $lang;
	$dr = $dest;
	if (strlen($user) < 4 || !wp_str_ends_with($dr, "/" . $user)) {
		if (!has_permission($dest, $user, "write")) {
			header('HTTP/1.1 403 Forbidden');
			echo $lang["error #17!"] . "+1";
			exit();
		}
	}
	return $dr;
}

if (!isset($_POST["target"]) ||
	!isset($_POST["folder"]) ||
	!isset($_POST["size"]) ||
	!isset($_POST["func"]) ||
	!isset($_POST["seek"])
	) 
{
	exit();
}

function rplce($s)
{
	$r =  str_replace(
		array("..", "=", "/", "\\", "*", "?", " ", "'", "\"",
			"&", ">", "<", "\n", "\r", "\t", "|", ";"), "_", $s);
	if (wp_str_ends_with($r, ".md") ||
		wp_str_ends_with($r, ".jpg") ||
		wp_str_ends_with($r, ".jpeg") ||
		wp_str_ends_with($r, ".JPG"))
	{
		return $r;
	}
	return str_replace(".", "_", $r);
}

$user = get_user();
$folder = rplce($_POST["folder"]);
$target = rplce($_POST["target"]);
$seek = intval($_POST["seek"]);
$size = intval($_POST["size"]);

if (strlen($dn) < 5) {
	header('HTTP/1.1 403 Forbidden');
	echo $lang["current directory name is too short"];
	exit();
}

///////////////////////////////////////////////////////////////////////////////

switch ($_POST["func"]) {
case "mkfolder":
	$folder = gen_folder();
	$d = $dn . "/" . get_folder($folder);
	if (file_exists($d)) {
		header('HTTP/1.1 403 Forbidden');
		echo $lang["error #17!"] . "+3";
		exit();
	}
	mkdir($d, 0777, true);
	{
		include "lib/mkfolder.php";
		mkfolder($d, $folder, $_SESSION['UserData']["user"]);
	}
	header('HTTP/1.1 200 OK');
	header("Content-type: text/plain");
	echo $folder;
	exit();

case "write":
	if (strlen($target) < 1) {
		header('HTTP/1.1 403 Forbidden');
		echo $lang["error #17!"] . "+11";
		exit();
	}
	$out = "";
	$v = $_FILES["files"];
	$dst = $dn . "/" . get_folder($folder);
	check_write_permission($dst);
	$dst = $dst . "/" . $target;
	$dr = dirname($dst);
	if (!is_dir($dr)) {
		mkdir($dr, 0777, true);
	}
	$fp = fopen($dst, "cb");
	if (!$fp) {
		header('HTTP/1.1 403 Forbidden');
		echo $lang["error #17!"] . "+4";
		exit();
	}
	fseek($fp, 0);
	if ($size >= 0) {
		ftruncate($fp, $size);
	}
	if ($seek >= 0) {
		fseek($fp, $seek);
	}
	$fis = filesize($v['tmp_name'][0]);
	if ($fis > 0) {
		$da = file_get_contents($v['tmp_name'][0]);
		fwrite($fp, $da, $fis);
	}
	fclose($fp);	
	header('HTTP/1.1 200 OK');
	header("Content-type: text/plain");
	echo $folder . "/" . $target;
        exit();	

case "filesize":	
	$dst = $dn . "/" . get_folder($folder);
	check_read_permission($dst);
	$dst = $dst . "/" . $target;
	$se = filesize($dst);
	if ($se == false) {
		header('HTTP/1.1 404 Not Found');
		exit();
	}
	header('HTTP/1.1 200 OK');
	header("Content-type: text/plain");
	echo $se;
	exit(); 

case "read":
	if (strlen($target) < 1) {
		header('HTTP/1.1 403 Forbidden');
		echo $lang["error #17!"] . "+12";
		exit();
	}
	$dst = $dn . "/" . get_folder($folder);
	check_read_permission($dst);
	$dst = $dst . "/" . $target;
	$fp = fopen($dst, "rb");
	if (!$fp) {
		header('HTTP/1.1 404 Not Found');
		//header('HTTP/1.1 403 Forbidden');
		exit();
	}
	if ($seek > 0) {
		fseek($fp, $seek);
	}
	if ($size < 1) {
		$size = filesize($dst);
	}	
	header('HTTP/1.1 200 OK');
	header("Content-type: text/plain");
	if ($size > 0) {
		print(fread($fp, $size));
	}
	fclose($fp);
	exit();

case "unlink":
	$dst = $dn . "/" . get_folder($folder);
	check_write_permission($dst);
	$dst = $dst . "/" . $target;
	if (!is_dir($dst) && unlink($dst)) {
		header('HTTP/1.1 200 OK');
		header("Content-type: text/plain");
		echo $folder . "/" . $target;
	} else {
		header('HTTP/1.1 403 Forbidden');
		echo $lang["error #17!"] . "+5";
	}
        exit();

case "mkdir":
	$dst = $dn . "/" . get_folder($folder);
	check_write_permission($dst);
	$dst = $dst . "/" . $target;
	if (file_exists($dst)) {
		header('HTTP/1.1 404 Not Found');
		exit();
	}
	if (mkdir($dst, 0777, true)) {
		header('HTTP/1.1 200 OK');
		header("Content-type: text/plain");
		echo $folder . "/" . $target;
	} else {
		header('HTTP/1.1 403 Forbidden');
		echo $lang["error #17!"] . "+6";
	}
        exit();	

case "rmdir":
	$dst = $dn . "/" . get_folder($folder);
	check_write_permission($dst);
	$dst = $dst . "/" . $target;
	if (rmdir($dst)) {
		header('HTTP/1.1 200 OK');
		header("Content-type: text/plain");
		echo $folder . "/" . $target;
	} else {
		header('HTTP/1.1 403 Forbidden');
		echo $lang["error #17!"] . "+7";
	}
        exit();	

case "scandir":
        $dst = $dn . "/" . get_folder($folder);
	check_read_permission($dst);
	$dst = $dst . "/" . $target;
        $lst = scandir($dst);
	if (!$lst) {
		header('HTTP/1.1 404 Not Found');
		exit();
	}
        header('HTTP/1.1 200 OK');
        header("Content-type: text/plain");
	foreach ($lst as $f) {
		if (is_dir($dst . "/" . $f)) {
			if (!($f == "." || $f == "..")) {
				echo $f . "/\n";
			}
		} else {
                	echo $f . "\n";
		}
        }
        exit();
case "login":
	if (strlen($_POST["target"]) > 0) {
		if ($_POST["target"] == "../") {
			header("Location: ../");
		} else {
			header("Location: .");
		}
	} else {
        	header('HTTP/1.1 200 OK');
        	header("Content-type: text/plain");
		echo "ok";
	}
	exit();
case "publish":
        $dst = $dn . "/" . get_folder($folder);
	check_write_permission($dst);
	$dst = $dst . "/" . $target;
	{
		include "lib/publish.php";
		publish($dst, $folder, $target, $_SESSION['UserData']["user"]);
	}
	header('HTTP/1.1 404 Not Found');
	exit(-1);
default:
	header('HTTP/1.1 404 Not Found');
	exit(-1);
}
?>
