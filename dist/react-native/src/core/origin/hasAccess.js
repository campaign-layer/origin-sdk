'use strict';

var constants = require('../../constants.js');
var Marketplace = require('./contracts/Marketplace.json.js');

function hasAccess(user, tokenId) {
    return this.callContractMethod(constants.MARKETPLACE_CONTRACT_ADDRESS, Marketplace, "hasAccess", [user, tokenId]);
}

exports.hasAccess = hasAccess;
