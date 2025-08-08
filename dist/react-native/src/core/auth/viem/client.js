'use strict';

var viem = require('viem');
var chains = require('./chains.js');
require('viem/accounts');

// @ts-ignore
let publicClient = null;
const getPublicClient = () => {
    if (!publicClient) {
        publicClient = viem.createPublicClient({
            chain: chains.testnet,
            transport: viem.http(),
        });
    }
    return publicClient;
};

exports.getPublicClient = getPublicClient;
