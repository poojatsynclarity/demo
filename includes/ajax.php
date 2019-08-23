<?php
// phpcs:disable
require_once '../constant.php';

$perpage = $_POST['service'] == 'all' ? 5 : PERPAGE;
$page = $_POST['page'];

$arr_data = array(
    'page'=> $page,
    'per_page'=>$perpage,
);

if (isset($_POST['keyword']) && !empty($_POST['keyword'])) {
    $arr_data['keyword'] = $_POST['keyword'];
}

switch ($_POST['service']) {
    case 'pixabay':
    $arr_result = getpixabayimages($arr_data);
        break;
    case 'pexels':
    $arr_result = getpexelsimages($arr_data);
        break;
    case 'unsplash':
    $arr_result = getunsplashimages($arr_data);
        break;
    default:
    $arr_pixa = getpixabayimages($arr_data);
    $arr_pex = getpexelsimages($arr_data);
    $arr_uns = getunsplashimages($arr_data);
    
    $arr_result = array_merge($arr_pixa, $arr_pex, $arr_uns);
    break;
}

print_r(json_encode($arr_result));

/**
 * get the array of pixabay api call
 * @param array $arr_data pass the pixabay api parameter
 */
function getpixabayimages($arr_data)
{
    require_once INCLUDES_DIR .'/api.php';
    $class = new RFI\API\API();
    $arr_pixabay = json_decode($class->pixabay($arr_data));
    
    $arr_pixa=[];
    if (isset($arr_pixabay->hits) && !empty($arr_pixabay->hits)) {
        foreach ($arr_pixabay->hits as $data) {
            $arr_pixa[] = array(
            'imageurl' => $data->largeImageURL,
            'imageurlsmall' => $data->webformatURL,
            'username' => $data->user,
            'landing' => $data->pageURL,
            'userimage'=> $data->userImageURL,
            'credit' => 'pixabay',
            'userlink' => 'https://pixabay.com/users/'.$data->user.'-'.$data->user_id
            );
        }
    }
    return $arr_pixa;
}

/**
 * get the array of pexels api call
 * @param array $arr_data pass the pexels api parameter
 */

function getpexelsimages($arr_data)
{
    require_once INCLUDES_DIR .'/api.php';
    $class = new RFI\API\API();
    $arr_pexels = json_decode($class->pexels($arr_data));
    $arr_pex=[];
    if (isset($arr_pexels->photos) && !empty($arr_pexels->photos)) {
        foreach ($arr_pexels->photos as $data) {
            $arr_pex[] = array(
                'imageurl' => $data->src->large2x,
                'imageurlsmall' => $data->src->medium,
                'username' => $data->photographer,
                'landing' => $data->url,
                'userimage' => 'https://cdn.pixabay.com/photo/2017/07/18/23/23/user-2517433_960_720.png',
                'credit' => 'pexels',                
                'userlink' =>  $data->photographer_url 
            );
        }
    }
    return $arr_pex;
}

/**
 * get the array of unsplash api call
 * @param array $arr_data pass the unsplash api parameter
 */
function getunsplashimages($arr_data)
{
    require_once INCLUDES_DIR .'/api.php';
    $class = new RFI\API\API();
    $arr_unsplash = json_decode($class->unsplash($arr_data));
    $arr_uns=[];
    if (isset($_POST['keyword']) && !empty($_POST['keyword'])) {
        $arr_unsplash = $arr_unsplash->results;
    }
    $arr_uns=[];
    foreach ($arr_unsplash as $data) {
        $arr_uns[] = array(
            'imageurl' => $data->urls->regular,
            'imageurlsmall' => $data->urls->small,
            'username' => $data->user->username,
            'landing' => $data->links->html,
            'userimage' => $data->user->profile_image->medium,
            'credit' => 'unplash',
            'userlink' => $data->user->links->html
        );
    }
   
    return $arr_uns;
}
