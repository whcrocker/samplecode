<?php
/**
 * Copyright 2017 Crocker Multimedia Productions Services, Inc.
 * www.cmmps.com
 * All rights reserved
 */    
class DemoService extends BaseService {
    public function __construct($credentialsContext) {
        parent::__construct($credentialsContext);
    }

    /**
     * The form data will contain a shipToAddress, shipFromAddress, and a list of items.  Each
     * item will contain a name, weight, box object, coPackable, vendor, serviceType, 
     * defaultShippingCosts object, description (optional)
     */
    public function getShippingCost($formData) {
        $start = microtime(true);

        if ($formData == null) {
            return new ServiceContext(ApiConstants::INVALID_PARAM_CODE, ApiConstants::INVALID_PARAM_MSG,
                                        ApiConstants::RESP_BAD_REQUEST_CODE, (microtime(true) - $start), null);
        }

        $resultMsg = ApiConstants::ERROR_MSG;
        try {
            // make sure the user has access to the desired service before too much work is done
            $service = new ShipmentCalcService($this->getCredentialsContext());

            $resultMsg = ApiConstants::SUCCESS_MSG;
            return $service->getShippingCost(self::buildJsonStr($formData));
        }
        catch (Exception $e) {
            Util::logException(__CLASS__ . '.' .__FUNCTION__, $e);
            return new ServiceContext($e->getCode(), $e->getMessage(),
                                        ApiConstants::RESP_SERVER_ERROR_CODE, (microtime(true) - $start), null);
        }
        finally {
            Util::logMessage((__CLASS__ . '.' . __FUNCTION__), ' Elapsed Time (' . $resultMsg . ') : ' . round((microtime(true) - $start), 4) . ' seconds', 'INFO');
        }
    }

    private static function buildJsonStr($formData) {
        $jsonStr = '';

        if (!empty($formData)) {
            // check for the minimum address values
            if (!empty($formData['fromAddress']['line1']) && !empty($formData['fromAddress']['city']) &&
                !empty($formData['fromAddress']['state']) && !empty($formData['fromAddress']['zipcode']) &&
                !empty($formData['toAddress']['line1']) && !empty($formData['toAddress']['city']) &&
                !empty($formData['toAddress']['state']) && !empty($formData['toAddress']['zipcode'])) {

                // build up the json string from the form data
                $jsonStr .= '{';
                $jsonStr .= '"shipToAddress" : ' . self::buildAddressJsonStr($formData['toAddress']) . ',';
                $jsonStr .= '"shipFromAddress" : ' . self::buildAddressJsonStr($formData['fromAddress']) . ',';
                $jsonStr .= '"items" : [';

                $items = self::processItem(array(), self::buildItemJsonStr($formData['item1']));
                $items = self::processItem($items, self::buildItemJsonStr($formData['item2']));
                $items = self::processItem($items, self::buildItemJsonStr($formData['item3']));
                $items = self::processItem($items, self::buildItemJsonStr($formData['item4']));
                $items = self::processItem($items, self::buildItemJsonStr($formData['item5']));
                $items = self::processItem($items, self::buildItemJsonStr($formData['item6']));
                
                $sep = '';
                foreach($items as $itemJsonStr) {
                    $jsonStr .= $sep . $itemJsonStr;
                    $sep = ', ';
                }

                $jsonStr .= ']';
                $jsonStr .= '}';
            }
        }

        return $jsonStr;
    }

    private static function processItem($items, $itemJson) {
        if (!empty($itemJson)) {
            array_push($items, $itemJson);
        }

        return $items;
    }

    private static function buildAddressJsonStr($formAddress) {
        $jsonStr = '';

        if (!empty($formAddress)) {
            $jsonStr .= '{"street1" : "' . $formAddress['line1'] . '",';
            $jsonStr .= ' "street2" : "' . $formAddress['line2'] . '",';
            $jsonStr .= ' "city" : "' . $formAddress['city'] . '",';
            $jsonStr .= ' "state" : "' . $formAddress['state'] . '",';
            $jsonStr .= ' "zipcode" : "' . $formAddress['zipcode'] . '"}';
        }

        return $jsonStr;
    }

    private static function buildItemJsonStr($formItem) {
        $jsonStr = '';

        if (!empty($formItem)) {
            $qty = $formItem['qty'];

            // do not include items that are 0 - repeat structure for each qty value
            if ($qty > 0) {
                $sep = '';
                for($i = 1; $i <= $qty; $i++) {
                    $jsonStr .= $sep . '{"name" : "' . $formItem['name'] . ($i > 1 ? ('-' . $i) : '') . '",';
                    $jsonStr .= ' "description" : "Description for item ' . $formItem['name'] . '.",';
                    $jsonStr .= ' "weight" : ' . $formItem['weight'] . ',';
                    $jsonStr .= ' "coPackable" : "' . $formItem['copack'] . '",';
                    $jsonStr .= ' "vendor" : "' . strtoupper($formItem['vendor']) . '",';
                    $jsonStr .= ' "serviceType" : "' . strtoupper($formItem['serviceType']) . '",';
                    $jsonStr .= ' "box" : ' . self::buildBoxJsonStr($formItem['box']) . ',';
                    $jsonStr .= ' "defaultShippingCosts" : ' . self::buildDefShippingCostsJsonStr() . '}';
                    $sep = ', ';
                }
            }
        }
        
        return $jsonStr;
    }

    private static function buildBoxJsonStr($formBox) {
        $jsonStr = '';

        if (!empty($formBox)) {
            list($height, $width, $lengthWeight) = explode("x", $formBox);
            list($length, $maxWeight) = explode("-", $lengthWeight);

            $jsonStr .= '{"height" : ' . $height . ',';
            $jsonStr .= ' "width" : ' . $width . ',';
            $jsonStr .= ' "length" : ' . $length . ',';
            $jsonStr .= ' "weightUnits" : "' . UnitOfWeight::LBS . '",';
            $jsonStr .= ' "dimensionUnits" : "' . UnitOfDimension::IN . '",';
            $jsonStr .= ' "maxWeight" : ' . $maxWeight . '}';
        }

        return $jsonStr;
    }

    private static function getRandomFloat($minValue, $maxValue) {
        return round(($minValue + mt_rand() / mt_getrandmax() * ($maxValue - $minValue)), 2);
    }

    private static function buildDefShippingCostsJsonStr() {
        $jsonStr = '';
        $cost = self::getRandomFloat(3.45, 19.27);

        $jsonStr .= '{"east" : ' . $cost . ',';
        $jsonStr .= ' "midwest" : ' . ($cost + 7.32) . ',';
        $jsonStr .= ' "west" : ' . ($cost + 13.82) . ',';
        $jsonStr .= ' "nonContiguous" : ' . ($cost + 52.12) . '}';

        return $jsonStr;
    }
}
