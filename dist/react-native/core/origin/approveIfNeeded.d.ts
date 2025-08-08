import { Address, WalletClient, PublicClient } from "viem";
type ApproveParams = {
    walletClient: WalletClient;
    publicClient: PublicClient;
    tokenAddress: Address;
    owner: Address;
    spender: Address;
    amount: bigint;
};
/**
 * Approves a spender to spend a specified amount of tokens on behalf of the owner.
 * If the current allowance is less than the specified amount, it will perform the approval.
 * @param {ApproveParams} params - The parameters for the approval.
 */
export declare function approveIfNeeded({ walletClient, publicClient, tokenAddress, owner, spender, amount, }: ApproveParams): Promise<void>;
export {};
