'use strict';

var constants = require('../../constants.js');
var DataNFT = require('./contracts/DataNFT.json.js');

function approve(to, tokenId) {
    return this.callContractMethod(constants.DATANFT_CONTRACT_ADDRESS, DataNFT, "approve", [to, tokenId]);
}

exports.approve = approve;
