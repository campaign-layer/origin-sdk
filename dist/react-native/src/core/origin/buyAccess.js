'use strict';

var constants = require('../../constants.js');
var Marketplace = require('./contracts/Marketplace.json.js');

function buyAccess(buyer, tokenId, periods, value // only for native token payments
) {
    return this.callContractMethod(constants.MARKETPLACE_CONTRACT_ADDRESS, Marketplace, "buyAccess", [buyer, tokenId, periods], { waitForReceipt: true, value });
}

exports.buyAccess = buyAccess;
