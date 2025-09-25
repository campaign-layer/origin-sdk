import { Origin } from ".";
import { Abi, Address } from "viem";
import { LicenseTerms } from "./utils";

/**
 * Updates the license terms of a specified IPNFT.
 * @param tokenId The ID of the IPNFT to update.
 * @param newTerms The new license terms to set.
 * @returns A promise that resolves when the transaction is complete.
 */
export function updateTerms(
  this: Origin,
  tokenId: bigint,
  newTerms: LicenseTerms
) {
  return this.callContractMethod(
    this.environment.DATANFT_CONTRACT_ADDRESS as Address,
    this.environment.IPNFT_ABI as Abi,
    "updateTerms",
    [tokenId, newTerms],
    { waitForReceipt: true }
  );
}
