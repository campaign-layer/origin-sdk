import { Origin } from ".";
import { Abi, Address } from "viem";

/**
 * Returns the number of IPNFTs owned by the given address.
 * @param owner The address to query.
 * @returns The number of IPNFTs owned by the address.
 */
export function balanceOf(this: Origin, owner: Address) {
  return this.callContractMethod(
    this.environment.DATANFT_CONTRACT_ADDRESS as Address,
    this.environment.IPNFT_ABI as Abi,
    "balanceOf",
    [owner]
  );
}
