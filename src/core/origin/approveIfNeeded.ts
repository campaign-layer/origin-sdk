import { erc20Abi } from "viem";
import { Address, WalletClient, PublicClient } from "viem";
import { testnet } from "../auth/viem/chains";

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
export async function approveIfNeeded({
  walletClient,
  publicClient,
  tokenAddress,
  owner,
  spender,
  amount,
}: ApproveParams) {
  const allowance: bigint = await publicClient.readContract({
    address: tokenAddress,
    abi: erc20Abi,
    functionName: "allowance",
    args: [owner, spender],
  });

  if (allowance < amount) {
    await walletClient.writeContract({
      address: tokenAddress,
      account: owner,
      abi: erc20Abi,
      functionName: "approve",
      args: [spender, amount],
      chain: testnet,
    });
  }
}
