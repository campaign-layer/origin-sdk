'use strict';

var constants = require('../../constants.js');
var DataNFT = require('./contracts/DataNFT.json.js');

function isApprovedForAll(owner, operator) {
    return this.callContractMethod(constants.DATANFT_CONTRACT_ADDRESS, DataNFT, "isApprovedForAll", [owner, operator]);
}

exports.isApprovedForAll = isApprovedForAll;
