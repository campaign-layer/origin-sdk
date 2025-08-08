'use strict';

var constants = require('../../constants.js');
var DataNFT = require('./contracts/DataNFT.json.js');

function requestDelete(tokenId) {
    return this.callContractMethod(constants.DATANFT_CONTRACT_ADDRESS, DataNFT, "finalizeDelete", [tokenId]);
}

exports.requestDelete = requestDelete;
