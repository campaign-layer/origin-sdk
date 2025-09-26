import { Origin } from ".";
import { Abi, Address } from "viem";

/**
 * Calls the getOrCreateRoyaltyVault method on the IPNFT contract.
 * @param tokenOwner The address of the token owner for whom to get or create the royalty vault.
 * @param simulateOnly If true, simulates the transaction without executing it.
 * @returns The address of the royalty vault associated with the specified token owner.
 */
export async function getOrCreateRoyaltyVault(
  this: Origin,
  tokenOwner: Address,
  simulateOnly = false
): Promise<Address> {
  const royaltyVaultTx = await this.callContractMethod(
    this.environment.DATANFT_CONTRACT_ADDRESS as Address,
    this.environment.IPNFT_ABI as Abi,
    "getOrCreateRoyaltyVault",
    [tokenOwner],
    { waitForReceipt: true, simulate: simulateOnly }
  );

  return simulateOnly
    ? royaltyVaultTx
    : (royaltyVaultTx.simulatedResult as Address);
}
