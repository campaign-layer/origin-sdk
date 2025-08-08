'use strict';

var constants = require('../../constants.js');
var DataNFT = require('./contracts/DataNFT.json.js');

function setApprovalForAll(operator, approved) {
    return this.callContractMethod(constants.DATANFT_CONTRACT_ADDRESS, DataNFT, "setApprovalForAll", [operator, approved]);
}

exports.setApprovalForAll = setApprovalForAll;
