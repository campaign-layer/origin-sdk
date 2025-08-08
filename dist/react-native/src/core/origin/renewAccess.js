'use strict';

var constants = require('../../constants.js');
var Marketplace = require('./contracts/Marketplace.json.js');

function renewAccess(tokenId, buyer, periods, value) {
    return this.callContractMethod(constants.MARKETPLACE_CONTRACT_ADDRESS, Marketplace, "renewAccess", [tokenId, buyer, periods], value !== undefined ? { value } : undefined);
}

exports.renewAccess = renewAccess;
