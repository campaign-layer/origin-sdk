import { Origin } from ".";
import { Address } from "viem";
export declare function getApproved(this: Origin, tokenId: bigint): Promise<Address>;
