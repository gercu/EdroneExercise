<?php

$formData = $_POST['formData'];
$basketData = $_POST['edroneBasket'];
$formArray = array();
$basketArray = json_decode($basketData, true);
parse_str($formData, $formArray);

function order($formArray, $basketArray) {
    $productTitles = "";
    $productImages = "";
    $productUrls = "";
    $productsAmount = count($basketArray);
    $productIds = '';
    $productCounts = '';
    $categoryIds = '';
    $categoryNames = '';

    for ($x = 1; $x <= $productsAmount; $x++) {
	$productIds .= $basketArray[$x - 1]["product_id"];
        $productTitles .= $basketArray[$x - 1]["product_title"];
        $productImages .= $basketArray[$x - 1]["product_image"];
        $productUrls .= $basketArray[$x - 1]["product_url"];
        $productCounts .= $basketArray[$x - 1]["product_count"];
        $categoryIds .= $basketArray[$x - 1]["product_category_id"];
        $categoryNames .= $basketArray[$x - 1]["product_category_name"];
        if ($productsAmount != $x) {            
            $productIds .= '|';
            $productTitles .= '|';
            $productImages .= '|';
            $productUrls .= '|';
            $productCounts .= '|';
            $categoryIds .= '|';
            $categoryNames .= '|';
        }
    }

    $edroneData = 'version=' . '1.0.0' .
            '&app_id=' . '59e76a6c9774f' .
            '&platform=' . 'custom' .
            '&platform_version=' . '1.1.26' .
            '&action_type=' . 'order' .
            '&product_ids=' . $productIds .
            '&product_titles=' . $productTitles .
            '&product_images=' . $productImages .
            '&product_urls=' . $productUrls .
            '&product_category_ids=' . $categoryIds .
            '&product_category_names=' . $categoryNames .
            '&product_counts=' . $productCounts .
            '&order_payment_value=' . 42.42 .
            '&base_payment_value=' . 42.42 .
            '&order_currency=' . 'PLN' .
            '&base_currency=' . 'PLN' .
            '&order_id=' . uniqid() .
            '&email=' . $formArray['email'] .
            '&first_name=' . $formArray['firstName'] .
            '&last_name=' . $formArray['lastName'] .
            '&phone=' . $formArray['phone'] .
            '&city=' . $formArray['city'] .
            '&country=' . $formArray['country'] .
            '&sender_type=' . 'server';
    return $edroneData;
}

function httpPost($url, $params) {
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HEADER, false);
    curl_setopt($ch, CURLOPT_POST, count($params));
    curl_setopt($ch, CURLOPT_POSTFIELDS, $params);
    $output = curl_exec($ch);
    curl_close($ch);
    return $output;
}

httpPost('https://api.edrone.me/trace', order($formArray, $basketArray));

echo $formArray;
