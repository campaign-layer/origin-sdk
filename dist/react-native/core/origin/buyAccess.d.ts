import { Origin } from ".";
import { Address } from "viem";
export declare function buyAccess(this: Origin, buyer: Address, tokenId: bigint, periods: number, value?: bigint): Promise<any>;
