'use strict';

var tslib_es6 = require('../../../node_modules/tslib/tslib.es6.js');
var viem = require('viem');
var chains = require('../auth/viem/chains.js');

/**
 * Approves a spender to spend a specified amount of tokens on behalf of the owner.
 * If the current allowance is less than the specified amount, it will perform the approval.
 * @param {ApproveParams} params - The parameters for the approval.
 */
function approveIfNeeded(_a) {
    return tslib_es6.__awaiter(this, arguments, void 0, function* ({ walletClient, publicClient, tokenAddress, owner, spender, amount, }) {
        const allowance = yield publicClient.readContract({
            address: tokenAddress,
            abi: viem.erc20Abi,
            functionName: "allowance",
            args: [owner, spender],
        });
        if (allowance < amount) {
            yield walletClient.writeContract({
                address: tokenAddress,
                account: owner,
                abi: viem.erc20Abi,
                functionName: "approve",
                args: [spender, amount],
                chain: chains.testnet,
            });
        }
    });
}

exports.approveIfNeeded = approveIfNeeded;
