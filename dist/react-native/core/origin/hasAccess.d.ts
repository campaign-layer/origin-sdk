import { Origin } from ".";
import { Address } from "viem";
export declare function hasAccess(this: Origin, user: Address, tokenId: bigint): Promise<boolean>;
