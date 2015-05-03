<?php

// db settings + connection
define('DB_SERVER', 'localhost');
define('DB_NAME', 'formario');
define('DB_USER', 'root');
define('DB_PASS', '');

$db = new mysqli(DB_SERVER, DB_USER, DB_PASS, DB_NAME);
if ($db->connect_errno) {
    echo '<strong>Erreur “'.$db->connect_error.'” : échec de la connexion à la base de données.</strong>';
    exit;
}
$db->set_charset('utf8');

// includes & requires
require_once('functions.php');

?>