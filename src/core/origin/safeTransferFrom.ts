import { Origin } from ".";
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
    this.environment.DATANFT_CONTRACT_ADDRESS as Address,
    this.environment.IPNFT_ABI as Abi,
    "safeTransferFrom",
    args
  );
}
