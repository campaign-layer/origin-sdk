'use strict';

var constants = require('../../constants.js');
var Marketplace = require('./contracts/Marketplace.json.js');

function subscriptionExpiry(tokenId, user) {
    return this.callContractMethod(constants.MARKETPLACE_CONTRACT_ADDRESS, Marketplace, "subscriptionExpiry", [tokenId, user]);
}

exports.subscriptionExpiry = subscriptionExpiry;
