import { Origin } from ".";
import { Abi, Address } from "viem";

/**
 * Checks if an operator is approved to manage all assets of a given owner.
 * @param owner The address of the asset owner.
 * @param operator The address of the operator to check.
 * @return A promise that resolves to a boolean indicating if the operator is approved for all assets of the owner.
 */
export function isApprovedForAll(
  this: Origin,
  owner: Address,
  operator: Address
): Promise<boolean> {
  return this.callContractMethod(
    this.environment.DATANFT_CONTRACT_ADDRESS as Address,
    this.environment.IPNFT_ABI as Abi,
    "isApprovedForAll",
    [owner, operator]
  );
}
