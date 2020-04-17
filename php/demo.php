<?php
/**
 * Copyright 2017 Crocker Multimedia Productions Services, Inc.
 * www.cmmps.com
 * All rights reserved
 */
use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;

$app->get('/demo/shipmentcalc', function (Request $request, Response $response) {
    return $this->view->render($response, "shipmentcalc.html");
});

$app->post('/demo/shipmentcalc', function (Request $request, Response $response) {
    $start = microtime(true);
    $service;
    $context;
    $disableDefaultShippingCost = $request->getQueryParam('disableDefaultShippingCost', "FALSE");
    
    try {
        $service = new DemoService(new CredentialsContext(ApiConstants::DEMO_USER, hash_file('md5', ApiConstants::NHC)),
                                   $disableDefaultShippingCost);

        $formData = ['fromAddress' => ['line1' => $request->getParam('fromStreet1'),
                                       'line2' => $request->getParam('fromStreet2'),
                                       'city' => $request->getParam('fromCity'),
                                       'state' => $request->getParam('fromState'),
                                       'zipcode' => $request->getParam('fromZipcode')],
                     'toAddress' => ['line1' => $request->getParam('toStreet1'),
                                     'line2' => $request->getParam('toStreet2'),
                                     'city' => $request->getParam('toCity'),
                                     'state' => $request->getParam('toState'),
                                     'zipcode' => $request->getParam('toZipcode')],
                     'item1' => ['name' => $request->getParam('item1'),
                                 'vendor' => $request->getParam('vendor1'),
                                 'serviceType' => $request->getParam('service1'),
                                 'weight' => $request->getParam('weight1'),
                                 'box' => $request->getParam('box1'),
                                 'copack' => $request->getParam('copack1'),
                                 'qty' => $request->getParam('qty1')],
                     'item2' => ['name' => $request->getParam('item2'),
                                 'vendor' => $request->getParam('vendor2'),
                                 'serviceType' => $request->getParam('service2'),
                                 'weight' => $request->getParam('weight2'),
                                 'box' => $request->getParam('box2'),
                                 'copack' => $request->getParam('copack2'),
                                 'qty' => $request->getParam('qty2')],
                     'item3' => ['name' => $request->getParam('item3'),
                                 'vendor' => $request->getParam('vendor3'),
                                 'serviceType' => $request->getParam('service3'),
                                 'weight' => $request->getParam('weight3'),
                                 'box' => $request->getParam('box3'),
                                 'copack' => $request->getParam('copack3'),
                                 'qty' => $request->getParam('qty3')],
                     'item4' => ['name' => $request->getParam('item4'),
                                 'vendor' => $request->getParam('vendor4'),
                                 'serviceType' => $request->getParam('service4'),
                                 'weight' => $request->getParam('weight4'),
                                 'box' => $request->getParam('box4'),
                                 'copack' => $request->getParam('copack4'),
                                 'qty' => $request->getParam('qty4')],
                     'item5' => ['name' => $request->getParam('item5'),
                                 'vendor' => $request->getParam('vendor5'),
                                 'serviceType' => $request->getParam('service5'),
                                 'weight' => $request->getParam('weight5'),
                                 'box' => $request->getParam('box5'),
                                 'copack' => $request->getParam('copack5'),
                                 'qty' => $request->getParam('qty5')],
                     'item6' => ['name' => $request->getParam('item6'),
                                 'vendor' => $request->getParam('vendor6'),
                                 'serviceType' => $request->getParam('service6'),
                                 'weight' => $request->getParam('weight6'),
                                 'box' => $request->getParam('box6'),
                                 'copack' => $request->getParam('copack6'),
                                 'qty' => $request->getParam('qty6')]
                     ];

        $context = $service->getShippingCost($formData);

        $r = $response->withStatus($context->getResponseCode());
        if ($context->isError()) {
            return $this->view->render($r, "errorPage.html", ['errorCode'=>$context->getErrorCode(),
                                                              'errorMsg'=>$context->getErrorMsg(),
                                                              'respCode'=>$context->getResponseCode()]);
        }
        else {
            $folderObj = json_decode($context->getJsonData());

            if (json_last_error() != JSON_ERROR_NONE) {
                return $this->view->render($r, "errorPage.html", ['errorCode'=>ApiConstants::INVALID_JSON_CODE,
                                                                  'errorMsg'=>json_last_error_msg(),
                                                                  'respCode'=>ApiConstants::RESP_BAD_REQUEST_CODE]);
            }

            return $this->view->render($r, "folder.html", ['folder'=>$folderObj]);
        }
    }
    catch (Exception $e) {
        Util::logMessage(__CLASS__ . '.' . __FUNCTION__, $e->getCode() . ':' . $e->getMessage(), 'ERROR');
        return $this->view->render($response->withStatus(ApiConstants::RESP_SERVER_ERROR_CODE), 
                                                         "errorPage.html", ['errorCode'=>$e->getCode(),
                                                                            'errorMsg'=>$e->getMessage(),
                                                                            'respCode'=>ApiConstants::RESP_SERVER_ERROR_CODE]);
    }
    finally {
        $service = null;
    }
});

$app->get('/demo/vendor', function (Request $request, Response $response) {
    return $this->view->render($response, "vendor.html");
});

$app->post('/demo/vendor', function (Request $request, Response $response) {
    $start = microtime(true);
    $service;
    $context;
    $disableDefaultShippingCost = $request->getQueryParam('disableDefaultShippingCost', "FALSE");
    
    try {
        $service = new DemoService(new CredentialsContext(ApiConstants::DEMO_USER, hash_file('md5', ApiConstants::NHC)),
                                   $disableDefaultShippingCost);

        // for simplicity, use the same structure as shipmentcalc
        $formData = ['fromAddress' => ['line1' => $request->getParam('fromStreet1'),
                                       'line2' => $request->getParam('fromStreet2'),
                                       'city' => $request->getParam('fromCity'),
                                       'state' => $request->getParam('fromState'),
                                       'zipcode' => $request->getParam('fromZipcode')],
                     'toAddress' => ['line1' => $request->getParam('toStreet1'),
                                     'line2' => $request->getParam('toStreet2'),
                                     'city' => $request->getParam('toCity'),
                                     'state' => $request->getParam('toState'),
                                     'zipcode' => $request->getParam('toZipcode')],
                     'item1' => ['name' => $request->getParam('item1'),
                                 'vendor' => $request->getParam('vendor'),
                                 'serviceType' => $request->getParam('service'),
                                 'weight' => $request->getParam('weight1'),
                                 'box' => $request->getParam('box1'),
                                 'copack' => $request->getParam('copack1'),
                                 'qty' => $request->getParam('qty1')],
                     'item2' => ['name' => $request->getParam('item2'),
                                 'vendor' => $request->getParam('vendor'),
                                 'serviceType' => $request->getParam('service'),
                                 'weight' => $request->getParam('weight2'),
                                 'box' => $request->getParam('box2'),
                                 'copack' => $request->getParam('copack2'),
                                 'qty' => $request->getParam('qty2')],
                     'item3' => ['name' => $request->getParam('item3'),
                                 'vendor' => $request->getParam('vendor'),
                                 'serviceType' => $request->getParam('service'),
                                 'weight' => $request->getParam('weight3'),
                                 'box' => $request->getParam('box3'),
                                 'copack' => $request->getParam('copack3'),
                                 'qty' => $request->getParam('qty3')],
                     'item4' => ['name' => $request->getParam('item4'),
                                 'vendor' => $request->getParam('vendor'),
                                 'serviceType' => $request->getParam('service'),
                                 'weight' => $request->getParam('weight4'),
                                 'box' => $request->getParam('box4'),
                                 'copack' => $request->getParam('copack4'),
                                 'qty' => $request->getParam('qty4')],
                     'item5' => ['name' => $request->getParam('item5'),
                                 'vendor' => $request->getParam('vendor'),
                                 'serviceType' => $request->getParam('service'),
                                 'weight' => $request->getParam('weight5'),
                                 'box' => $request->getParam('box5'),
                                 'copack' => $request->getParam('copack5'),
                                 'qty' => $request->getParam('qty5')],
                     'item6' => ['name' => $request->getParam('item6'),
                                 'vendor' => $request->getParam('vendor'),
                                 'serviceType' => $request->getParam('service'),
                                 'weight' => $request->getParam('weight6'),
                                 'box' => $request->getParam('box6'),
                                 'copack' => $request->getParam('copack6'),
                                 'qty' => $request->getParam('qty6')]
                     ];

        $context = $service->getShippingCost($formData);

        $r = $response->withStatus($context->getResponseCode());
        if ($context->isError()) {
            return $this->view->render($r, "errorPage.html", ['errorCode'=>$context->getErrorCode(),
                                                              'errorMsg'=>$context->getErrorMsg(),
                                                              'respCode'=>$context->getResponseCode()]);
        }
        else {
            // this will return a folder but there should only be one manifest
            $folderObj = json_decode($context->getJsonData());
            $manifest = reset($folderObj->manifests);
                        
            if (json_last_error() != JSON_ERROR_NONE) {
                return $this->view->render($r, "errorPage.html", ['errorCode'=>ApiConstants::INVALID_JSON_CODE,
                                                                  'errorMsg'=>json_last_error_msg(),
                                                                  'respCode'=>ApiConstants::RESP_BAD_REQUEST_CODE]);
            }

            return $this->view->render($r, "manifest.html", ['manifest'=>$manifest]);
        }
    }
    catch (Exception $e) {
        Util::logMessage(__CLASS__ . '.' . __FUNCTION__, $e->getCode() . ':' . $e->getMessage(), 'ERROR');
        return $this->view->render($response->withStatus(ApiConstants::RESP_SERVER_ERROR_CODE), 
                                                         "errorPage.html", ['errorCode'=>$e->getCode(),
                                                                            'errorMsg'=>$e->getMessage(),
                                                                            'respCode'=>ApiConstants::RESP_SERVER_ERROR_CODE]);
    }
    finally {
        $service = null;
    }
});
