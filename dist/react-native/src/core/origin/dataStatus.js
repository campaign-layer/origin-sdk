'use strict';

var constants = require('../../constants.js');
var DataNFT = require('./contracts/DataNFT.json.js');

function dataStatus(tokenId) {
    return this.callContractMethod(constants.DATANFT_CONTRACT_ADDRESS, DataNFT, "dataStatus", [tokenId]);
}

exports.dataStatus = dataStatus;
