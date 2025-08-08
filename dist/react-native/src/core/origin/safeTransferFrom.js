'use strict';

var constants = require('../../constants.js');
var DataNFT = require('./contracts/DataNFT.json.js');

function safeTransferFrom(from, to, tokenId, data) {
    const args = data ? [from, to, tokenId, data] : [from, to, tokenId];
    return this.callContractMethod(constants.DATANFT_CONTRACT_ADDRESS, DataNFT, "safeTransferFrom", args);
}

exports.safeTransferFrom = safeTransferFrom;
