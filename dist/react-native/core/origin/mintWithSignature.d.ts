import { Address, Hex } from "viem";
import { Origin } from ".";
import { IpNFTSource, LicenseTerms } from "./utils";
/**
 * Mints a Data NFT with a signature.
 * @param to The address to mint the NFT to.
 * @param tokenId The ID of the token to mint.
 * @param parentId The ID of the parent NFT, if applicable.
 * @param hash The hash of the data associated with the NFT.
 * @param uri The URI of the NFT metadata.
 * @param licenseTerms The terms of the license for the NFT.
 * @param deadline The deadline for the minting operation.
 * @param signature The signature for the minting operation.
 * @returns A promise that resolves when the minting is complete.
 */
export declare function mintWithSignature(this: Origin, to: Address, tokenId: bigint, parentId: bigint, hash: Hex, uri: string, licenseTerms: LicenseTerms, deadline: bigint, signature: Hex): Promise<any>;
/**
 * Registers a Data NFT with the Origin service in order to obtain a signature for minting.
 * @param source The source of the Data NFT (e.g., "spotify", "twitter", "tiktok", or "file").
 * @param deadline The deadline for the registration operation.
 * @param fileKey Optional file key for file uploads.
 * @return A promise that resolves with the registration data.
 */
export declare function registerIpNFT(this: Origin, source: IpNFTSource, deadline: bigint, licenseTerms: LicenseTerms, metadata: Record<string, unknown>, fileKey?: string | string[], parentId?: bigint): Promise<any>;
