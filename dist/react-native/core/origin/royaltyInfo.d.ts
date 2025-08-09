import { Origin } from ".";
import { Address } from "viem";
export declare function royaltyInfo(this: Origin, tokenId: bigint, salePrice: bigint): Promise<[Address, bigint]>;
