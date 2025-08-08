'use strict';

var constants = require('../../constants.js');
var DataNFT = require('./contracts/DataNFT.json.js');

function contentHash(tokenId) {
    return this.callContractMethod(constants.DATANFT_CONTRACT_ADDRESS, DataNFT, "contentHash", [tokenId]);
}

exports.contentHash = contentHash;
