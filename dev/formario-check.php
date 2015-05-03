<?php

// try regexp :(
// if(strlen($_POST['code']) == 6 && preg_match('/^[0-9a-zA-Z]*$', $_POST['code']))


if(strlen($_POST['code']) == '6') {
    $sql = sprintf("SELECT *
        FROM savegame
        WHERE code = '%s'", $_POST['code']);
    $res = $db->query($sql);
    if($res->num_rows > 0) {
        $status = 1;
    }
    else {
        $status = -1;
        $error = 'It’s-a-bad-code, wouhou!';
        $error_short = 'Bad code';
    }
}
else {
    $status = 0;
    $error = 'Code must-a-be 6 caracters (digits & letters, caps allowed), wouhou!';
    $error_short = 'Wrong code';
}

// AJAX

if(isset($_POST['ajax'])) {
    $to_ajax['status'] = $status;
    if(isset($error))
        $to_ajax['error'] = $error_short;
    echo json_encode($to_ajax);
}

?>