import {
  Abi,
  Address,
  encodeFunctionData,
  getAbiItem,
  zeroAddress,
  formatEther,
  formatUnits,
  WalletClient,
} from "viem";
import { uploadWithProgress } from "../../utils";
import { getPublicClient, setChain } from "../auth/viem/client";
import { mintWithSignature, registerIpNFT } from "./mintWithSignature";
import { updateTerms } from "./updateTerms";
import { finalizeDelete } from "./finalizeDelete";
import { getOrCreateRoyaltyVault } from "./getOrCreateRoyaltyVault";
import { getTerms } from "./getTerms";
import { ownerOf } from "./ownerOf";
import { balanceOf } from "./balanceOf";
import { tokenURI } from "./tokenURI";
import { dataStatus } from "./dataStatus";
import { isApprovedForAll } from "./isApprovedForAll";
import { transferFrom } from "./transferFrom";
import { safeTransferFrom } from "./safeTransferFrom";
import { approve } from "./approve";
import { setApprovalForAll } from "./setApprovalForAll";
import { buyAccess } from "./buyAccess";
import { hasAccess } from "./hasAccess";
import { subscriptionExpiry } from "./subscriptionExpiry";
import { settlePaymentIntent } from "./settlePaymentIntent";
import { getDataWithIntent } from "./getDataWithIntent";
import { LicenseTerms } from "./utils";
import { approveIfNeeded } from "./approveIfNeeded";
import { Environment, ENVIRONMENTS } from "../../constants";

interface RoyaltyInfo {
  tokenBoundAccount: Address;
  balance: bigint;
  balanceFormatted: string;
}

type CallOptions = {
  value?: bigint;
  gas?: bigint;
  waitForReceipt?: boolean;
  simulate?: boolean;
};

/**
 * The Origin class
 * Handles interactions with Origin protocol.
 */
export class Origin {
  // DataNFT methods
  mintWithSignature!: typeof mintWithSignature;
  registerIpNFT!: typeof registerIpNFT;
  updateTerms!: typeof updateTerms;
  finalizeDelete!: typeof finalizeDelete;
  getOrCreateRoyaltyVault!: typeof getOrCreateRoyaltyVault;
  getTerms!: typeof getTerms;
  ownerOf!: typeof ownerOf;
  balanceOf!: typeof balanceOf;
  tokenURI!: typeof tokenURI;
  dataStatus!: typeof dataStatus;
  isApprovedForAll!: typeof isApprovedForAll;
  transferFrom!: typeof transferFrom;
  safeTransferFrom!: typeof safeTransferFrom;
  approve!: typeof approve;
  setApprovalForAll!: typeof setApprovalForAll;
  // Marketplace methods
  buyAccess!: typeof buyAccess;
  hasAccess!: typeof hasAccess;
  subscriptionExpiry!: typeof subscriptionExpiry;
  settlePaymentIntent!: typeof settlePaymentIntent;
  getDataWithIntent!: typeof getDataWithIntent;

  private jwt?: string;
  environment: Environment;
  private viemClient?: WalletClient;
  baseParentId?: bigint;
  constructor(
    environment?: Environment | string,
    jwt?: string,
    viemClient?: WalletClient,
    baseParentId?: bigint
  ) {
    if (jwt) {
      this.jwt = jwt;
    } else {
      console.warn("JWT not provided. Some features may be unavailable.");
    }
    this.viemClient = viemClient;
    this.environment =
      typeof environment === "string"
        ? ENVIRONMENTS[environment]
        : environment || ENVIRONMENTS["DEVELOPMENT"];
    this.baseParentId = baseParentId;
    // DataNFT methods
    this.mintWithSignature = mintWithSignature.bind(this);
    this.registerIpNFT = registerIpNFT.bind(this);
    this.updateTerms = updateTerms.bind(this);
    this.finalizeDelete = finalizeDelete.bind(this);
    this.getOrCreateRoyaltyVault = getOrCreateRoyaltyVault.bind(this);
    this.getTerms = getTerms.bind(this);
    this.ownerOf = ownerOf.bind(this);
    this.balanceOf = balanceOf.bind(this);
    this.tokenURI = tokenURI.bind(this);
    this.dataStatus = dataStatus.bind(this);
    this.isApprovedForAll = isApprovedForAll.bind(this);
    this.transferFrom = transferFrom.bind(this);
    this.safeTransferFrom = safeTransferFrom.bind(this);
    this.approve = approve.bind(this);
    this.setApprovalForAll = setApprovalForAll.bind(this);
    // Marketplace methods
    this.buyAccess = buyAccess.bind(this);
    this.hasAccess = hasAccess.bind(this);
    this.subscriptionExpiry = subscriptionExpiry.bind(this);
    this.settlePaymentIntent = settlePaymentIntent.bind(this);
    this.getDataWithIntent = getDataWithIntent.bind(this);
  }

  getJwt() {
    return this.jwt;
  }

  setViemClient(client: WalletClient) {
    this.viemClient = client;
  }

  async #generateURL(file: File) {
    try {
      const uploadRes = await fetch(
        `${this.environment.AUTH_HUB_BASE_API}/${this.environment.AUTH_ENDPOINT}/origin/upload-url`,
        {
          method: "POST",
          body: JSON.stringify({
            name: file.name,
            type: file.type,
          }),
          headers: {
            Authorization: `Bearer ${this.jwt}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!uploadRes.ok) {
        throw new Error(`HTTP ${uploadRes.status}: ${uploadRes.statusText}`);
      }

      const data = await uploadRes.json();

      if (data.isError) {
        throw new Error(data.message || "Failed to generate upload URL");
      }

      return data.data;
    } catch (error) {
      console.error("Failed to generate upload URL:", error);
      throw error;
    }
  }

  async #setOriginStatus(key: string, status: string) {
    try {
      const res = await fetch(
        `${this.environment.AUTH_HUB_BASE_API}/${this.environment.AUTH_ENDPOINT}/origin/update-status`,
        {
          method: "PATCH",
          body: JSON.stringify({
            status,
            fileKey: key,
          }),
          headers: {
            Authorization: `Bearer ${this.jwt}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!res.ok) {
        const errorText = await res.text().catch(() => "Unknown error");
        throw new Error(`HTTP ${res.status}: ${errorText}`);
      }

      return true;
    } catch (error) {
      console.error("Failed to update origin status:", error);
      throw error;
    }
  }

  /**
   * Uploads an image file to IPFS and returns the resulting CID.
   * @private
   * @param image The image file to upload.
   * @returns The CID of the uploaded image or null if no image is provided.
   */
  async #uploadToIPFS(image: File | null): Promise<string | null> {
    if (!image) return null;

    try {
      const presignedResponse = await fetch(
        `${this.environment.AUTH_HUB_BASE_API}/${this.environment.AUTH_ENDPOINT}/origin/upload-url-ipfs`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.jwt}`,
          },
          body: JSON.stringify({
            fileName: image.name,
            fileType: image.type,
          }),
        }
      );

      if (!presignedResponse.ok) {
        const errorText = await presignedResponse
          .text()
          .catch(() => "Unknown error");
        throw new Error(
          `Failed to get presigned URL (HTTP ${presignedResponse.status}): ${errorText}`
        );
      }

      const presignedData = await presignedResponse.json();
      const { isError, data: presignedUrl, message } = presignedData;

      if (isError || !presignedUrl) {
        throw new Error(
          `Failed to get presigned URL: ${
            message || "No URL returned from server"
          }`
        );
      }

      const formData = new FormData();
      formData.append("file", image);

      const uploadResponse = await fetch(presignedUrl, {
        method: "POST",
        body: formData,
      });

      if (!uploadResponse.ok) {
        const errorText = await uploadResponse
          .text()
          .catch(() => uploadResponse.statusText);
        throw new Error(
          `Failed to upload preview image to IPFS (HTTP ${uploadResponse.status}): ${errorText}`
        );
      }

      const ipfsData = await uploadResponse.json();

      if (!ipfsData || !ipfsData.data) {
        throw new Error(
          "Invalid response from IPFS upload: Missing data field"
        );
      }

      return ipfsData.data?.cid;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      console.error("Error uploading preview image to IPFS:", errorMessage);
      throw new Error(
        `Failed to upload preview image to IPFS: ${errorMessage}`
      );
    }
  }

  /** Uploads a file to Origin S3 and returns the upload info.
   * @private
   * @param file The file to upload.
   * @returns The upload info including the file key and URL.
   */
  async #uploadFile(
    file: File,
    options?: { progressCallback?: (percent: number) => void }
  ) {
    let uploadInfo;

    try {
      uploadInfo = await this.#generateURL(file);
    } catch (error) {
      console.error("Failed to generate upload URL:", error);
      throw new Error(
        `Failed to generate upload URL: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }

    if (!uploadInfo) {
      throw new Error("Failed to generate upload URL: No upload info returned");
    }

    try {
      await uploadWithProgress(
        file,
        uploadInfo.url,
        options?.progressCallback || (() => {})
      );
    } catch (error) {
      try {
        await this.#setOriginStatus(uploadInfo.key, "failed");
      } catch (statusError) {
        console.error("Failed to update status to failed:", statusError);
      }

      const errorMessage =
        error instanceof Error ? error.message : String(error);
      throw new Error(`Failed to upload file: ${errorMessage}`);
    }

    try {
      await this.#setOriginStatus(uploadInfo.key, "success");
    } catch (statusError) {
      console.error("Failed to update status to success:", statusError);
    }

    return uploadInfo;
  }

  /**
   * Mints a file-based IpNFT.
   * @param file The file to mint.
   * @param metadata The metadata associated with the file.
   * @param license The license terms for the IpNFT.
   * @param parents Optional parent token IDs for lineage tracking.
   * @param options Optional parameters including progress callback, preview image, and use asset as preview flag.
   * @returns The token ID of the minted IpNFT as a string, or null if minting failed.
   */
  async mintFile(
    file: File,
    metadata: Record<string, unknown>,
    license: LicenseTerms,
    parents?: bigint[],
    options?: {
      progressCallback?: (percent: number) => void;
      previewImage?: File | null;
      useAssetAsPreview?: boolean;
    }
  ): Promise<string | null> {
    let account: string | null = null;
    try {
      account = await this.#getCurrentAccount();
    } catch (error) {
      throw new Error("Failed to mint file IP. Wallet not connected.");
    }

    let info;
    try {
      info = await this.#uploadFile(file, options);
      if (!info || !info.key) {
        throw new Error("Failed to upload file or get upload info.");
      }
    } catch (error) {
      throw new Error(
        `File upload failed: ${
          error instanceof Error ? (error as Error).message : String(error)
        }`
      );
    }

    if (file.type) {
      metadata.mimetype = file.type;
    }

    let previewImageIpfsHash: string | null = null;
    if (
      options?.previewImage &&
      options?.previewImage.type.startsWith("image/")
    ) {
      previewImageIpfsHash = await this.#uploadToIPFS(options.previewImage);
    } else if (options?.useAssetAsPreview && file.type.startsWith("image/")) {
      previewImageIpfsHash = await this.#uploadToIPFS(file);
    }

    if (previewImageIpfsHash) {
      metadata.image = `ipfs://${previewImageIpfsHash}`;
    }

    const deadline = BigInt(Date.now() + 600000); // 10 minutes from now
    if (this.baseParentId) {
      if (!parents) {
        parents = [];
      }
      parents.unshift(this.baseParentId);
    }
    let registration;
    try {
      registration = await this.registerIpNFT(
        "file",
        deadline,
        license,
        metadata,
        info.key,
        parents
      );
    } catch (error) {
      await this.#setOriginStatus(info.key, "failed");
      throw new Error(
        `Failed to register IpNFT: ${
          error instanceof Error ? (error as Error).message : String(error)
        }`
      );
    }

    const { tokenId, signerAddress, creatorContentHash, signature, uri } =
      registration;
    if (
      !tokenId ||
      !signerAddress ||
      !creatorContentHash ||
      signature === undefined ||
      !uri
    ) {
      throw new Error(
        "Failed to register IpNFT: Missing required fields in registration response."
      );
    }

    try {
      const mintResult = await this.mintWithSignature(
        account as `0x${string}`,
        tokenId,
        parents || [],
        true,
        creatorContentHash,
        uri,
        license,
        deadline,
        signature
      );
      if (["0x1", "success"].indexOf(mintResult.receipt.status) === -1) {
        await this.#setOriginStatus(info.key, "failed");
        throw new Error(
          `Minting failed with status: ${mintResult.receipt.status}`
        );
      }
    } catch (error) {
      await this.#setOriginStatus(info.key, "failed");
      throw new Error(
        `Minting transaction failed: ${
          error instanceof Error ? (error as Error).message : String(error)
        }`
      );
    }

    return tokenId.toString();
  }

  /**
   * Mints a social IpNFT.
   * @param source The social media source (spotify, twitter, tiktok).
   * @param metadata The metadata associated with the social media content.
   * @param license The license terms for the IpNFT.
   * @return The token ID of the minted IpNFT as a string, or null if minting failed.
   */
  async mintSocial(
    source: "spotify" | "twitter" | "tiktok",
    metadata: Record<string, unknown>,
    license: LicenseTerms
  ): Promise<string | null> {
    let account: string | null = null;
    try {
      account = await this.#getCurrentAccount();
    } catch (error) {
      throw new Error("Failed to mint social IP. Wallet not connected.");
    }

    metadata.mimetype = `social/${source}`;

    const deadline = BigInt(Math.floor(Date.now() / 1000) + 600); // 10 minutes from now

    let parents = this.baseParentId ? [this.baseParentId] : [];

    let registration;
    try {
      registration = await this.registerIpNFT(
        source,
        deadline,
        license,
        metadata,
        undefined,
        parents
      );
    } catch (error) {
      throw new Error(
        `Failed to register Social IpNFT: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }

    const { tokenId, signerAddress, creatorContentHash, signature, uri } =
      registration;
    if (
      !tokenId ||
      !signerAddress ||
      !creatorContentHash ||
      signature === undefined ||
      !uri
    ) {
      throw new Error(
        "Failed to register Social IpNFT: Missing required fields in registration response."
      );
    }

    try {
      const mintResult = await this.mintWithSignature(
        account as `0x${string}`,
        tokenId,
        parents,
        true,
        creatorContentHash,
        uri,
        license,
        deadline,
        signature
      );
      if (["0x1", "success"].indexOf(mintResult.receipt.status) === -1) {
        throw new Error(
          `Minting Social IpNFT failed with status: ${mintResult.receipt.status}`
        );
      }
    } catch (error) {
      throw new Error(
        `Minting transaction failed: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }

    return tokenId.toString();
  }

  /**
   * Wait for the transaction receipt.
   * @private
   * @param {string} txHash The transaction hash.
   * @param {Object} [opts] Options for waiting for the receipt.
   * @returns {Promise<any>} A promise that resolves with the transaction receipt.
   * @throws {Error} - Throws an error if the wallet client is not connected.
   */
  async #waitForTxReceipt(
    txHash: `0x${string}`,
    opts: {
      confirmations?: number;
      timeoutMs?: number;
      pollingIntervalMs?: number;
    } = {}
  ): Promise<any> {
    const publicClient = getPublicClient();

    let currentHash = txHash;
    const confirmations = opts.confirmations ?? 1;
    const timeout = opts.timeoutMs ?? 180_000;
    const pollingInterval = opts.pollingIntervalMs ?? 1_500;

    try {
      const receipt = await publicClient.waitForTransactionReceipt({
        hash: currentHash,
        confirmations,
        timeout,
        pollingInterval,
        onReplaced: (replacement) => {
          currentHash = replacement.transaction.hash;
        },
      });
      return receipt;
    } catch (err) {
      // fallback
      const start = Date.now();
      while (Date.now() - start < timeout) {
        try {
          const receipt = await publicClient.getTransactionReceipt({
            hash: currentHash,
          });
          if (receipt && receipt.blockNumber) return receipt;
        } catch {}
        await new Promise((r) => setTimeout(r, pollingInterval));
      }
      throw err;
    }
  }

  /**
   * Ensure the chain ID is correct.
   * @private
   * @param {any} chain The chain object.
   * @returns {Promise<void>} A promise that resolves when the chain ID is ensured.
   * @throws {Error} - Throws an error if the wallet client is not connected.
   */
  async #ensureChainId(chain: any): Promise<void> {
    if (!this.viemClient)
      throw new Error("WalletClient not connected. Could not ensure chain ID.");

    let currentChainId = (await this.viemClient.request({
      method: "eth_chainId",
      params: [] as any,
    })) as string | number;
    if (typeof currentChainId === "string") {
      currentChainId = parseInt(currentChainId, 16);
    }

    if (currentChainId !== chain.id) {
      setChain(chain);
      try {
        await this.viemClient.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: "0x" + BigInt(chain.id).toString(16) }],
        });
      } catch (switchError: any) {
        // Unrecognized chain
        if (switchError.code === 4902) {
          await this.viemClient.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: "0x" + BigInt(chain.id).toString(16),
                chainName: chain.name,
                rpcUrls: chain.rpcUrls.default.http,
                nativeCurrency: chain.nativeCurrency,
              },
            ],
          });

          await this.viemClient.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: "0x" + BigInt(chain.id).toString(16) }],
          });
        } else {
          throw switchError;
        }
      }
    }
  }

  /**
   * Get the current account address.
   * @private
   * @returns {Promise<string>} A promise that resolves with the current account address.
   * @throws {Error} - Throws an error if the wallet client is not connected or no accounts are found.
   */
  async #getCurrentAccount(): Promise<string> {
    if (!this.viemClient) {
      throw new Error("WalletClient not connected. Please connect a wallet.");
    }

    // If account is already set on the client, return it directly
    if (this.viemClient.account) {
      return this.viemClient.account.address;
    }

    // Otherwise request accounts (browser wallet flow)
    const accounts = await this.viemClient.request({
      method: "eth_requestAccounts",
      params: [] as any,
    });
    if (!accounts || accounts.length === 0) {
      throw new Error("No accounts found in connected wallet.");
    }
    return accounts[0];
  }

  /**
   * Call a contract method.
   * @param {string} contractAddress The contract address.
   * @param {Abi} abi The contract ABI.
   * @param {string} methodName The method name.
   * @param {any[]} params The method parameters.
   * @param {CallOptions} [options] The call options.
   * @returns {Promise<any>} A promise that resolves with the result of the contract call or transaction hash.
   * @throws {Error} - Throws an error if the wallet client is not connected and the method is not a view function.
   */
  async callContractMethod(
    contractAddress: string,
    abi: Abi,
    methodName: string,
    params: any[],
    options: CallOptions = {}
  ): Promise<any> {
    let account: string | null = null;
    try {
      account = await this.#getCurrentAccount();
    } catch (error) {
      throw new Error("Failed to call contract method. Wallet not connected.");
    }

    const abiItem = getAbiItem({ abi, name: methodName });

    const isView =
      abiItem &&
      "stateMutability" in abiItem &&
      (abiItem.stateMutability === "view" ||
        abiItem.stateMutability === "pure");

    if (isView) {
      const publicClient = getPublicClient();
      const result =
        (await publicClient.readContract({
          address: contractAddress as `0x${string}`,
          abi,
          functionName: methodName,
          args: params,
        })) || null;
      return result;
    }

    await this.#ensureChainId(this.environment.CHAIN);

    const publicClient = getPublicClient();

    // simulate
    const { result: simulatedResult, request } =
      await publicClient.simulateContract({
        account: account as `0x${string}`,
        address: contractAddress as `0x${string}`,
        abi,
        functionName: methodName,
        args: params,
        value: options.value,
      });

    if (options.simulate) {
      return simulatedResult;
    }

    try {
      const txHash = await this.viemClient?.writeContract(request);

      if (typeof txHash !== "string") {
        throw new Error("Transaction failed to send.");
      }

      if (!options.waitForReceipt) {
        return { txHash, simulatedResult };
      }

      const receipt = await this.#waitForTxReceipt.call(
        this,
        txHash as `0x${string}`
      );

      return { txHash, receipt, simulatedResult };
    } catch (error) {
      console.error("Transaction failed:", error);
      throw new Error("Transaction failed: " + error);
    }
  }

  /**
   * Buy access to an asset by first checking its price via getTerms, then calling buyAccess.
   * @param {bigint} tokenId The token ID of the asset.
   * @returns {Promise<any>} The result of the buyAccess call.
   */
  async buyAccessSmart(tokenId: bigint): Promise<any> {
    let account: string | null = null;
    try {
      account = await this.#getCurrentAccount();
    } catch (error) {
      throw new Error("Failed to buy access. Wallet not connected.");
    }

    const terms = await this.getTerms(tokenId);
    if (!terms) throw new Error("Failed to fetch terms for asset");

    const { price, paymentToken, duration } = terms;
    if (
      price === undefined ||
      paymentToken === undefined ||
      duration === undefined
    ) {
      throw new Error("Terms missing price, paymentToken, or duration");
    }

    const totalCost = price;
    const isNative = paymentToken === zeroAddress;
    if (isNative) {
      return this.buyAccess(
        account as `0x${string}`,
        tokenId,
        totalCost,
        duration,
        paymentToken,
        totalCost
      );
    }

    await approveIfNeeded({
      walletClient: this.viemClient as WalletClient,
      publicClient: getPublicClient(),
      tokenAddress: paymentToken,
      owner: account as `0x${string}`,
      spender: this.environment.MARKETPLACE_CONTRACT_ADDRESS as `0x${string}`,
      amount: totalCost,
    });

    return this.buyAccess(
      account as `0x${string}`,
      tokenId,
      totalCost,
      duration,
      paymentToken
    );
  }

  /**
   * Fetch the underlying data associated with a specific token ID.
   * @param {bigint} tokenId - The token ID to fetch data for.
   * @returns {Promise<any>} A promise that resolves with the fetched data.
   * @throws {Error} Throws an error if the data cannot be fetched.
   */
  async getData(tokenId: bigint): Promise<any> {
    const response = await fetch(
      `${this.environment.AUTH_HUB_BASE_API}/${this.environment.AUTH_ENDPOINT}/origin/data/${tokenId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${this.jwt}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }
    return response.json();
  }

  /**
   * Get the Token Bound Account (TBA) address for a specific token ID.
   * @param {bigint} tokenId - The token ID to get the TBA address for.
   * @returns {Promise<Address>} A promise that resolves with the TBA address.
   * @throws {Error} Throws an error if the TBA address cannot be retrieved.
   * @example
   * ```typescript
   * const tbaAddress = await origin.getTokenBoundAccount(1n);
   * console.log(`TBA Address: ${tbaAddress}`);
   * ```
   */
  async getTokenBoundAccount(tokenId: bigint): Promise<Address> {
    try {
      const tbaAddress = await this.callContractMethod(
        this.environment.DATANFT_CONTRACT_ADDRESS,
        this.environment.IPNFT_ABI as Abi,
        "getAccount",
        [tokenId],
        { simulate: true }
      );
      return tbaAddress as Address;
    } catch (error) {
      throw new Error(
        `Failed to get Token Bound Account for token ${tokenId}: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  /**
   * Get royalty information for a token ID, including the token bound account address and its balance.
   * @param {bigint} tokenId - The token ID to check royalties for.
   * @param {Address} [token] - Optional token address to check royalties for. If not provided, checks for native token.
   * @returns {Promise<RoyaltyInfo>} A promise that resolves with the token bound account address and balance information.
   * @throws {Error} Throws an error if the token bound account cannot be retrieved.
   * @example
   * ```typescript
   * // Get royalties for a specific token
   * const royalties = await origin.getRoyalties(1n);
   *
   * // Get ERC20 token royalties for a specific token
   * const royalties = await origin.getRoyalties(1n, "0x1234...");
   * ```
   */
  async getRoyalties(tokenId: bigint, token?: Address): Promise<RoyaltyInfo> {
    try {
      const tokenBoundAccount = await this.getTokenBoundAccount(tokenId);
      const publicClient = getPublicClient();

      let balance: bigint;
      let balanceFormatted: string;

      if (!token || token === zeroAddress) {
        balance = await publicClient.getBalance({
          address: tokenBoundAccount,
        });
        balanceFormatted = formatEther(balance);
      } else {
        // erc20 (wrapped camp)
        const erc20Abi = [
          {
            inputs: [{ name: "owner", type: "address" }],
            name: "balanceOf",
            outputs: [{ name: "", type: "uint256" }],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [],
            name: "decimals",
            outputs: [{ name: "", type: "uint8" }],
            stateMutability: "view",
            type: "function",
          },
        ] as Abi;

        balance = await this.callContractMethod(token, erc20Abi, "balanceOf", [
          tokenBoundAccount,
        ]);

        const decimals = await this.callContractMethod(
          token,
          erc20Abi,
          "decimals",
          []
        );

        balanceFormatted = formatUnits(balance, decimals);
      }

      return {
        tokenBoundAccount,
        balance,
        balanceFormatted,
      };
    } catch (error) {
      throw new Error(
        `Failed to retrieve royalties for token ${tokenId}: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
  /**
   * Claim royalties from a token's Token Bound Account (TBA).
   * @param {bigint} tokenId - The token ID to claim royalties from.
   * @param {Address} [recipient] - Optional recipient address. If not provided, uses the connected wallet.
   * @param {Address} [token] - Optional token address to claim royalties in. If not provided, claims in native token.
   * @returns {Promise<any>} A promise that resolves when the claim transaction is confirmed.
   * @throws {Error} Throws an error if no wallet is connected and no recipient address is provided.
   * @example
   * ```typescript
   * // Claim native token royalties for token #1 to connected wallet
   * await origin.claimRoyalties(1n);
   *
   * // Claim ERC20 token royalties to a specific address
   * await origin.claimRoyalties(1n, "0xRecipient...", "0xToken...");
   * ```
   */
  async claimRoyalties(
    tokenId: bigint,
    recipient?: Address,
    token?: Address
  ): Promise<any> {
    const recipientAddress = await this.#resolveWalletAddress(recipient);
    const tokenBoundAccount = await this.getTokenBoundAccount(tokenId);

    // Get the balance to transfer
    const royaltyInfo = await this.getRoyalties(tokenId, token);
    const balance = royaltyInfo.balance;

    if (balance === BigInt(0)) {
      throw new Error("No royalties available to claim");
    }

    let to: Address;
    let value: bigint;
    let data: `0x${string}`;

    if (!token || token === zeroAddress) {
      // Native token transfer
      to = recipientAddress;
      value = balance;
      data = "0x";
    } else {
      // ERC20 token transfer
      to = token;
      value = BigInt(0);
      // Encode ERC20 transfer call: transfer(address to, uint256 amount)
      data = encodeFunctionData({
        abi: [
          {
            inputs: [
              { name: "to", type: "address" },
              { name: "amount", type: "uint256" },
            ],
            name: "transfer",
            outputs: [{ name: "", type: "bool" }],
            stateMutability: "nonpayable",
            type: "function",
          },
        ],
        functionName: "transfer",
        args: [recipientAddress, balance],
      });
    }

    // Call execute on the TBA
    return this.callContractMethod(
      tokenBoundAccount,
      this.environment.TBA_ABI as Abi,
      "execute",
      [to, value, data, 0], // operation: 0 = CALL
      { waitForReceipt: true, value: BigInt(0) }
    );
  }

  /**
   * Resolve wallet address from owner parameter or connected wallet.
   * @private
   * @param {Address} [owner] - Optional wallet address.
   * @returns {Promise<Address>} The resolved wallet address.
   * @throws {Error} Throws an error if no wallet address can be resolved.
   */
  async #resolveWalletAddress(owner?: Address): Promise<Address> {
    if (owner) {
      return owner;
    }

    if (!this.viemClient) {
      throw new Error(
        "No wallet address provided and no wallet client connected. Please provide an owner address or connect a wallet."
      );
    }

    try {
      const accounts = await this.viemClient.request({
        method: "eth_requestAccounts",
        params: [] as any,
      });

      if (!accounts || accounts.length === 0) {
        throw new Error("No accounts found in connected wallet.");
      }

      return accounts[0] as Address;
    } catch (error) {
      throw new Error(
        `Failed to get wallet address: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
}

export { createLicenseTerms, LicenseTerms, DataStatus } from "./utils";
export { X402Response } from "./settlePaymentIntent";
