import { Origin } from ".";
import constants from "../../constants";
import abi from "./contracts/DataNFT.json";
import { Abi, Address } from "viem";
import { LicenseTerms } from "./utils";

export function updateTerms(
  this: Origin,
  tokenId: bigint,
  royaltyReceiver: Address,
  newTerms: LicenseTerms
) {
  return this.callContractMethod(
    constants.DATANFT_CONTRACT_ADDRESS as Address,
    abi as Abi,
    "updateTerms",
    [tokenId, royaltyReceiver, newTerms],
    { waitForReceipt: true }
  );
}
