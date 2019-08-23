<?php

namespace RFI\API;

use GuzzleHttp\Client;
 
class API
{
    public function __construct()
    {
        require_once '../constant.php';
        require_once VENDOR_DIR . '/autoload.php';
        require_once INCLUDES_DIR .'/helpers.php';
    }
    /**
     * Get image from pixabay API
     * @param array $arr_post return the keyword and page
     */
    public function pixabay($arr_post)
    {
        $client = $this->buildClient(PIXABAY_BASE_URL);

        try {
            $arr_query = array (
                'key' => PIXABAY_APP_KEY,
                'page' => $arr_post['page'],
                'per_page' => $arr_post['per_page'],
            );
           
            if (isset($arr_post['keyword']) && !empty($arr_post['keyword'])) {
                $arr_query['search_term'] = $arr_post['keyword'];
            }

            $response = $client->request('GET', 'api', [
                'query' => $arr_query
            ]);

            $code = $response->getStatusCode();
        
            if ($code == 200) {
                return $response->getBody()->getContents();
            }
        } catch (GuzzleException $e) {
        }
    }
    /**
     * Get image from pexels API
     * @param array $arr_post return the keyword and page
     */
    public function pexels($arr_post)
    {
        $client = $this->buildClient(PEXELS_BASE_URL);
        
        try {
            $arr_query = array (
                    'page' => $arr_post['page'],
                    'per_page' => $arr_post['per_page'],
            );

            if (isset($arr_post['keyword']) && !empty($arr_post['keyword'])) {
                    $arr_query['query'] = $arr_post['keyword'];
                    $endpoint = 'v1/search';
            } else {
                    $endpoint = 'v1/popular';
            }

            $response = $client->request('GET', $endpoint, [
                'headers' => [
                    'Authorization' => PEXELS_API_KEY,
                    'Content-Type' => 'application/json'
                ],
                    'query' => $arr_query
                ]);
            $code = $response->getStatusCode();

            if ($code == 200) {
                return $response->getBody()->getContents();
            }
        } catch (GuzzleException $e) {
        }
    }
    /**
     * Get image from unsplash API
     * @param array $arr_post return the keyword and page
     */
    public function unsplash($arr_post)
    {
        $client = $this->buildClient(UNSPLASH_BASE_URL);

        try {
            $arr_query = array (
                    'client_id' => UNSPLASH_CLIENT_ID,
                    'page' => $arr_post['page'],
                    'per_page' => $arr_post['per_page'],
                );

            if (isset($arr_post['keyword']) && !empty($arr_post['keyword'])) {
                $arr_query['query'] = $arr_post['keyword'];
                $endpoint = 'search/photos';
            } else {
                $endpoint = 'photos';
            }

            $response = $client->request('GET', $endpoint, [
                'query' => $arr_query
            ]);
            
            $code = $response->getStatusCode();
        
            if ($code == 200) {
                return $response->getBody()->getContents();
            }
        } catch (GuzzleException $e) {
        }
    }
    /**
     * create instance of client
     * @param string $url api url
     */
    public function buildClient($url = '')
    {
        return $client = new Client([
            'base_uri' => $url,
        ]);
    }
}
