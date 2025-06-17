import { Abi, Address, Hex } from "viem";
import abi from "./contracts/DataNFT.json";
import { Origin } from ".";
import constants from "../../constants";
import { IpNFTSource, LicenseTerms } from "./utils";

/**
 * Mints a Data NFT with a signature.
 * @param to The address to mint the NFT to.
 * @param tokenId The ID of the token to mint.
 * @param hash The hash of the data associated with the NFT.
 * @param uri The URI of the NFT metadata.
 * @param licenseTerms The terms of the license for the NFT.
 * @param deadline The deadline for the minting operation.
 * @param signature The signature for the minting operation.
 * @returns A promise that resolves when the minting is complete.
 */
export async function mintWithSignature(
  this: Origin,
  to: Address,
  tokenId: bigint,
  hash: Hex,
  uri: string,
  licenseTerms: LicenseTerms,
  deadline: bigint,
  signature: Hex
): Promise<any> {
  return await this.callContractMethod(
    constants.DATANFT_CONTRACT_ADDRESS as Address,
    abi as Abi,
    "mintWithSignature",
    [to, tokenId, hash, uri, licenseTerms, deadline, signature],
    { waitForReceipt: true }
  );
}

/**
 * Registers a Data NFT with the Origin service in order to obtain a signature for minting.
 * @param source The source of the Data NFT (e.g., "spotify", "twitter", "tiktok", or "file").
 * @param deadline The deadline for the registration operation.
 * @param fileKey Optional file key for file uploads.
 * @return A promise that resolves with the registration data.
 */
export async function registerIpNFT(
  this: Origin,
  source: IpNFTSource,
  deadline: bigint,
  licenseTerms: LicenseTerms,
  fileKey?: string | string[]
): Promise<any> {
  const body: Record<string, unknown> = {
    source,
    deadline: Number(deadline),
    licenseTerms: {
      price: licenseTerms.price.toString(),
      duration: licenseTerms.duration,
      royaltyBps: licenseTerms.royaltyBps,
      paymentToken: licenseTerms.paymentToken,
    },
  };
  if (fileKey !== undefined) {
    body.fileKey = fileKey;
  }

  const res = await fetch(
    `${constants.AUTH_HUB_BASE_API}/auth/origin/register`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.getJwt()}`,
      },
      body: JSON.stringify(body),
    }
  );
  if (!res.ok) {
    throw new Error(`Failed to get signature: ${res.statusText}`);
  }
  const data = await res.json();
  if (data.isError) {
    throw new Error(`Failed to get signature: ${data.message}`);
  }
  return data.data;
}
