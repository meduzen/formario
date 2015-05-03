<?php
require_once('cfg.php');

// check code valdity
if(isset($_POST['code']))
    include('formario-check.php');
    // formario-check.php returns:
        // $status: 1 = ok, 0 = no
        // $error: an error message

// display includes
if(!isset($_POST['ajax'])) {
    if(isset($status))
        if($status == 1) {
            header('location: ./?demo=1');
            exit;
        }
    include('header.php');
    include('formario.php');
    include('footer.php');
}
?>