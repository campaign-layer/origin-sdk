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
import { APIError } from "../../errors";
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
import { LicenseTerms } from "./utils";
import { approveIfNeeded } from "./approveIfNeeded";
import { Environment } from "../../constants";

interface OriginUsageReturnType {
  user: {
    multiplier: number;
    points: number;
    active: boolean;
  };
  teams: Array<any>;
  dataSources: Array<any>;
}

interface RoyaltyInfo {
  royaltyVault: Address;
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
 * Handles the upload of files to Origin, as well as querying the user's stats
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

  private jwt: string;
  environment: Environment;
  private viemClient?: WalletClient;
  constructor(
    jwt: string,
    environment: Environment,
    viemClient?: WalletClient
  ) {
    this.jwt = jwt;
    this.viemClient = viemClient;
    this.environment = environment;
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

  async uploadFile(
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

  async mintFile(
    file: File,
    metadata: Record<string, unknown>,
    license: LicenseTerms,
    parents?: bigint[],
    options?: {
      progressCallback?: (percent: number) => void;
    }
  ): Promise<string | null> {
    if (!this.viemClient) {
      throw new Error("WalletClient not connected.");
    }
    const info = await this.uploadFile(file, options);
    if (!info || !info.key) {
      throw new Error("Failed to upload file or get upload info.");
    }
    const deadline = BigInt(Date.now() + 600000); // 10 minutes from now
    const registration = await this.registerIpNFT(
      "file",
      deadline,
      license,
      metadata,
      info.key,
      parents
    );
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

    const accounts = (await this.viemClient.request({
      method: "eth_requestAccounts",
      params: [] as any,
    })) as string[];
    const account = accounts[0];

    const mintResult = await this.mintWithSignature(
      account as `0x${string}`,
      tokenId,
      parents || [],
      creatorContentHash,
      uri,
      license,
      deadline,
      signature
    );

    if (mintResult.status !== "0x1") {
      console.error("Minting failed:", mintResult);
      throw new Error(`Minting failed with status: ${mintResult.status}`);
    }

    return tokenId.toString();
  }

  async mintSocial(
    source: "spotify" | "twitter" | "tiktok",
    metadata: Record<string, unknown>,
    license: LicenseTerms
  ): Promise<string | null> {
    if (!this.viemClient) {
      throw new Error("WalletClient not connected.");
    }

    const deadline = BigInt(Math.floor(Date.now() / 1000) + 600); // 10 minutes from now
    const registration = await this.registerIpNFT(
      source,
      deadline,
      license,
      metadata
    );

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

    const accounts = (await this.viemClient.request({
      method: "eth_requestAccounts",
      params: [] as any,
    })) as string[];
    const account = accounts[0];

    const mintResult = await this.mintWithSignature(
      account as `0x${string}`,
      tokenId,
      [],
      creatorContentHash,
      uri,
      license,
      deadline,
      signature
    );

    if (mintResult.status !== "0x1") {
      throw new Error(
        `Minting Social IpNFT failed with status: ${mintResult.status}`
      );
    }

    return tokenId.toString();
  }

  async getOriginUploads(): Promise<any[] | null> {
    const res = await fetch(
      `${this.environment.AUTH_HUB_BASE_API}/${this.environment.AUTH_ENDPOINT}/origin/files`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${this.jwt}`,
        },
      }
    );
    if (!res.ok) {
      console.error("Failed to get origin uploads");
      return null;
    }
    const data = await res.json();
    return data.data;
  }

  /**
   * Get the user's Origin stats (multiplier, consent, usage, etc.).
   * @returns {Promise<OriginUsageReturnType>} A promise that resolves with the user's Origin stats.
   */

  async getOriginUsage(): Promise<OriginUsageReturnType> {
    const data = await fetch(
      `${this.environment.AUTH_HUB_BASE_API}/${this.environment.AUTH_ENDPOINT}/origin/usage`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${this.jwt}`,
          "Content-Type": "application/json",
        },
      }
    ).then((res) => res.json());

    if (!data.isError && data.data.user) {
      return data;
    } else {
      throw new APIError(data.message || "Failed to fetch Origin usage");
    }
  }

  /**
   * Set the user's consent for Origin usage.
   * @param {boolean} consent The user's consent.
   * @returns {Promise<void>}
   * @throws {Error|APIError} - Throws an error if the user is not authenticated. Also throws an error if the consent is not provided.
   */

  async setOriginConsent(consent: boolean): Promise<void> {
    if (consent === undefined) {
      throw new APIError("Consent is required");
    }
    const data = await fetch(
      `${this.environment.AUTH_HUB_BASE_API}/${this.environment.AUTH_ENDPOINT}/origin/status`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${this.jwt}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          active: consent,
        }),
      }
    ).then((res) => res.json());

    if (!data.isError) {
      return;
    } else {
      throw new APIError(data.message || "Failed to set Origin consent");
    }
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
    // return;
    if (!this.viemClient) throw new Error("WalletClient not connected.");

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

    if (!this.viemClient) {
      throw new Error("WalletClient not connected.");
    }

    const [account] = (await this.viemClient.request({
      method: "eth_requestAccounts",
      params: [] as any,
    })) as [`0x${string}`];

    await this.#ensureChainId(this.environment.CHAIN);

    const publicClient = getPublicClient();

    // simulate
    const { result: simulatedResult, request } =
      await publicClient.simulateContract({
        account,
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
      const txHash = await this.viemClient.writeContract(request);

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
    if (!this.viemClient) {
      throw new Error("WalletClient not connected.");
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
    const accounts = (await this.viemClient.request({
      method: "eth_requestAccounts",
      params: [] as any,
    })) as string[];
    const account = accounts[0];

    const totalCost = price;
    const isNative = paymentToken === zeroAddress;
    if (isNative) {
      // return this.buyAccess(account, tokenId, periods, totalCost);
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
      walletClient: this.viemClient,
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
   * Get royalty information for a wallet address, including the royalty vault address and its balance.
   * @param {Address} [owner] - Optional wallet address to check royalties for. If not provided, uses the connected wallet.
   * @returns {Promise<RoyaltyInfo>} A promise that resolves with the royalty vault address and balance information.
   * @throws {Error} Throws an error if no wallet is connected and no owner address is provided.
   * @example
   * ```typescript
   * // Get royalties for connected wallet
   * const royalties = await origin.getRoyalties();
   *
   * // Get royalties for specific address
   * const royalties = await origin.getRoyalties("0x1234...");
   * ```
   */
  async getRoyalties(token?: Address, owner?: Address): Promise<RoyaltyInfo> {
    const walletAddress = await this.#resolveWalletAddress(owner);

    try {
      const royaltyVaultAddress = await this.getOrCreateRoyaltyVault(
        walletAddress
      );
      console.log("Royalty Vault Address:", royaltyVaultAddress);
      const publicClient = getPublicClient();

      let balance: bigint;
      let balanceFormatted: string;

      if (!token || token === zeroAddress) {
        balance = await publicClient.getBalance({
          address: royaltyVaultAddress,
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
          royaltyVaultAddress,
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
        royaltyVault: royaltyVaultAddress,
        balance,
        balanceFormatted,
      };
    } catch (error) {
      throw new Error(
        `Failed to retrieve royalties for address ${walletAddress}: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
  /**
   * Claim royalties from the royalty vault.
   * @param {Address} [token] - Optional token address to claim royalties in. If not provided, claims in native token.
   * @param {Address} [owner] - Optional wallet address to claim royalties for. If not provided, uses the connected wallet.
   * @returns {Promise<any>} A promise that resolves when the claim transaction is confirmed.
   * @throws {Error} Throws an error if no wallet is connected and no owner address is provided.
   */
  async claimRoyalties(token?: Address, owner?: Address): Promise<any> {
    const walletAddress = await this.#resolveWalletAddress(owner);
    const royaltyVaultAddress = await this.getOrCreateRoyaltyVault(
      walletAddress,
      true
    );
    return this.callContractMethod(
      royaltyVaultAddress,
      this.environment.ROYALTY_VAULT_ABI as Abi,
      "claimRoyalties",
      [token ?? zeroAddress],
      { waitForReceipt: true }
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
