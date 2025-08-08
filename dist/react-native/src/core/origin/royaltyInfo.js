'use strict';

var tslib_es6 = require('../../../node_modules/tslib/tslib.es6.js');
var constants = require('../../constants.js');
var DataNFT = require('./contracts/DataNFT.json.js');

function royaltyInfo(tokenId, salePrice) {
    return tslib_es6.__awaiter(this, void 0, void 0, function* () {
        return this.callContractMethod(constants.DATANFT_CONTRACT_ADDRESS, DataNFT, "royaltyInfo", [tokenId, salePrice]);
    });
}

exports.royaltyInfo = royaltyInfo;
