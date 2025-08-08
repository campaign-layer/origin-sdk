import { Origin } from ".";
import { Address, Hex } from "viem";
export declare function safeTransferFrom(this: Origin, from: Address, to: Address, tokenId: bigint, data?: Hex): Promise<any>;
