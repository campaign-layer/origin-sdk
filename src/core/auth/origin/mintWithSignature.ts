import { Abi, Address, Hex } from "viem";
import abi from "../../origin/contracts/DataNFT.json";
import { Origin } from ".";
import constants from "../../../constants";
import { LicenseTerms } from "./types";

export function mintWithSignature(
  this: Origin,
  to: Address,
  tokenId: bigint,
  hash: Hex,
  uri: string,
  licenseTerms: LicenseTerms,
  deadline: bigint,
  signature: { v: number; r: Hex; s: Hex }
) {
  return this.callContractMethod(
    constants.DATANFT_CONTRACT_ADDRESS as Address,
    abi as Abi,
    "mintWithSignature",
    [
      to,
      tokenId,
      hash,
      uri,
      licenseTerms,
      deadline,
      signature.v,
      signature.r,
      signature.s,
    ]
  );
}
