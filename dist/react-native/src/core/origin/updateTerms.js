'use strict';

var constants = require('../../constants.js');
var DataNFT = require('./contracts/DataNFT.json.js');

function updateTerms(tokenId, royaltyReceiver, newTerms) {
    return this.callContractMethod(constants.DATANFT_CONTRACT_ADDRESS, DataNFT, "updateTerms", [tokenId, royaltyReceiver, newTerms], { waitForReceipt: true });
}

exports.updateTerms = updateTerms;
