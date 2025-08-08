'use strict';

var constants = require('../../constants.js');
var DataNFT = require('./contracts/DataNFT.json.js');

function transferFrom(from, to, tokenId) {
    return this.callContractMethod(constants.DATANFT_CONTRACT_ADDRESS, DataNFT, "transferFrom", [from, to, tokenId]);
}

exports.transferFrom = transferFrom;
