import { Origin } from ".";
import { Abi, Address } from "viem";

/**
 * Calls the getOrCreateRoyaltyVault method on the IPNFT contract.
 * @param tokenOwner The address of the token owner for whom to get or create the royalty vault.
 * @returns The address of the royalty vault associated with the specified token owner.
 */
export async function getOrCreateRoyaltyVault(
  this: Origin,
  tokenOwner: Address
): Promise<Address> {
  const royaltyVaultTx = await this.callContractMethod(
    this.environment.DATANFT_CONTRACT_ADDRESS as Address,
    this.environment.IPNFT_ABI as Abi,
    "getOrCreateRoyaltyVault",
    [tokenOwner],
    { waitForReceipt: true, simulate: false }
  );

  console.log("Royalty Vault Tx:", royaltyVaultTx);

  return royaltyVaultTx.simulatedResult as Address;
}
