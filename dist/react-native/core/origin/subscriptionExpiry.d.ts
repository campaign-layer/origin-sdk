import { Origin } from ".";
import { Address } from "viem";
export declare function subscriptionExpiry(this: Origin, tokenId: bigint, user: Address): Promise<bigint>;
