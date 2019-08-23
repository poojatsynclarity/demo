<?php
// phpcs:disable
require_once '../constant.php';
require_once INCLUDES_DIR .'/db.class.php';
require_once INCLUDES_DIR .'/helpers.php';

$db = new RFI\DB\DB();

$tblName = 'images';

$image_parts = explode(";base64,", $_POST['imgdata']);

$image_type_aux = explode("image/", $image_parts[0]);

$image_type = $image_type_aux[1];

$filesize =  getBase64ImageSize($_POST['imgdata']);

if ($filesize > FILE_SIZE) {
    print_r( [
        'msg' => 'File size must be less than '.$upload_max.'MB',
        'flag' => 'fail',
    ]);
    return;
}

$extensions = array("jpeg", "jpg", "png", "gif" );

if (!in_array($image_type, $extensions) ) {
    print_r([
        'msg' => 'please choose a JPEG or PNG or GIF file.',
        'flag' => 'fail'
    ]);
    return;
}

if (!file_exists('../uploads')) {
    mkdir('../uploads', 0777);
}

$image_base64 = base64_decode($image_parts[1]);

$filename = uniqid().'_'.time() . '.'.$image_type;
$file = '../uploads/'. $filename;

$arr_data = array(
   'img_name' => $filename,
);

file_put_contents($file, $image_base64);

//Insert image content into database
$insert = $db->insert($tblName, $arr_data);

$response = [
    //($_SERVER);  get server details
    'file' => $_SERVER['HTTP_REFERER'].'uploads/'.$filename,
   'msg' => 'File uploaded succesfully.',
   'flag' => 'Success'
];

print_r(json_encode($response));

/**
 * get the file size
 * @param int $base64Image return the size of image file
 */

function getBase64ImageSize($base64Image)
{
    //return memory size in B, KB, MB
    try {
        $size_in_bytes = (int) (strlen(rtrim($base64Image, '=')) * 3 / 4);
        $size_in_kb    = $size_in_bytes / 1024;
        $size_in_mb    = $size_in_kb / 1024;

        return $size_in_mb;
    } catch (Exception $e) {
        return $e;
    }
}
