import { Abi, Address, Hex } from "viem";
import { Origin } from ".";
import { IpNFTSource, LicenseTerms } from "./utils";

/**
 * Mints a Data NFT with a signature.
 * @param to The address to mint the NFT to.
 * @param tokenId The ID of the token to mint.
 * @param parents The IDs of the parent NFTs, if applicable.
 * @param isIp Whether the NFT is an IP NFT.
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
  parents: bigint[],
  isIp: boolean,
  hash: Hex,
  uri: string,
  licenseTerms: LicenseTerms,
  deadline: bigint,
  signature: Hex
): Promise<any> {
  return await this.callContractMethod(
    this.environment.DATANFT_CONTRACT_ADDRESS as Address,
    this.environment.IPNFT_ABI as Abi,
    "mintWithSignature",
    [to, tokenId, hash, uri, licenseTerms, deadline, parents, isIp, signature],
    { waitForReceipt: true }
  );
}

/**
 * Registers a Data NFT with the Origin service in order to obtain a signature for minting.
 * @param source The source of the Data NFT (e.g., "spotify", "twitter", "tiktok", or "file").
 * @param deadline The deadline for the registration operation.
 * @param licenseTerms The terms of the license for the NFT.
 * @param metadata The metadata associated with the NFT.
 * @param fileKey The file key(s) if the source is "file".
 * @param parents The IDs of the parent NFTs, if applicable.
 * @return A promise that resolves with the registration data.
 */
export async function registerIpNFT(
  this: Origin,
  source: IpNFTSource,
  deadline: bigint,
  licenseTerms: LicenseTerms,
  metadata: Record<string, unknown>,
  fileKey?: string | string[],
  parents?: bigint[]
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
    metadata,
    parentId: parents ? parents.map((p) => p.toString()) : [],
  };
  if (fileKey !== undefined) {
    body.fileKey = fileKey;
  }

  const res = await fetch(
    `${this.environment.AUTH_HUB_BASE_API}/${this.environment.AUTH_ENDPOINT}/origin/register`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.getJwt()}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }
  );
  const data = await res.json();
  if (data.isError) {
    throw new Error(`Failed to get signature: ${data.message}`);
  }
  if (!res.ok) {
    throw new Error(`Failed to get signature: ${res.statusText}`);
  }
  return data.data;
}
