<?php
// phpcs:disable
require_once '../constant.php';
require_once INCLUDES_DIR .'/db.class.php';

$db = new RFI\DB\DB();
$tblName = 'images';

//select image content from database
$userData = $db->getRows($tblName, array('order_by'=>'id DESC'));

print_r(json_encode($userData));
