'use strict';

var constants = require('../../constants.js');
var DataNFT = require('./contracts/DataNFT.json.js');

function ownerOf(tokenId) {
    return this.callContractMethod(constants.DATANFT_CONTRACT_ADDRESS, DataNFT, "ownerOf", [tokenId]);
}

exports.ownerOf = ownerOf;
