import { Origin } from ".";
import { Address } from "viem";
export declare function isApprovedForAll(this: Origin, owner: Address, operator: Address): Promise<boolean>;
