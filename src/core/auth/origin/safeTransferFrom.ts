import { Origin } from ".";
import constants from "../../../constants";
import abi from "../../origin/contracts/DataNFT.json";
import { Abi, Address, Hex } from "viem";

export function safeTransferFrom(
  this: Origin,
  from: Address,
  to: Address,
  tokenId: bigint,
  data?: Hex
) {
  const args = data ? [from, to, tokenId, data] : [from, to, tokenId];
  return this.callContractMethod(
    constants.DATANFT_CONTRACT_ADDRESS as Address,
    abi as Abi,
    "safeTransferFrom",
    args
  );
}
