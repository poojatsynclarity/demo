<?php
//require_once '../constant.php';
require_once INCLUDES_DIR .'/db.class.php';



        $files = glob('uploads/*.png'); //get all file names
        foreach($files as $file){
            if(is_file($file))
            unlink($file); //delete file
        }

        //$db = new DB;
        $where = array();
        $db->delete("images",$where);

?>