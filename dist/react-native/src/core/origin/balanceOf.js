'use strict';

var constants = require('../../constants.js');
var DataNFT = require('./contracts/DataNFT.json.js');

function balanceOf(owner) {
    return this.callContractMethod(constants.DATANFT_CONTRACT_ADDRESS, DataNFT, "balanceOf", [owner]);
}

exports.balanceOf = balanceOf;
