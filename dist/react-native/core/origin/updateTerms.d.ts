import { Origin } from ".";
import { Address } from "viem";
import { LicenseTerms } from "./utils";
export declare function updateTerms(this: Origin, tokenId: bigint, royaltyReceiver: Address, newTerms: LicenseTerms): Promise<any>;
