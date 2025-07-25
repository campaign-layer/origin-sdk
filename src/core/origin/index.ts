import { Abi, encodeFunctionData, getAbiItem, zeroAddress } from "viem";
import constants from "../../constants";
import { APIError } from "../../errors";
import { uploadWithProgress } from "../../utils";
import { getPublicClient } from "../auth/viem/client";
import { testnet } from "../auth/viem/chains";
import { mintWithSignature, registerIpNFT } from "./mintWithSignature";
import { updateTerms } from "./updateTerms";
import { requestDelete } from "./requestDelete";
import { getTerms } from "./getTerms";
import { ownerOf } from "./ownerOf";
import { balanceOf } from "./balanceOf";
import { contentHash } from "./contentHash";
import { tokenURI } from "./tokenURI";
import { dataStatus } from "./dataStatus";
import { royaltyInfo } from "./royaltyInfo";
import { getApproved } from "./getApproved";
import { isApprovedForAll } from "./isApprovedForAll";
import { transferFrom } from "./transferFrom";
import { safeTransferFrom } from "./safeTransferFrom";
import { approve } from "./approve";
import { setApprovalForAll } from "./setApprovalForAll";
import { buyAccess } from "./buyAccess";
import { renewAccess } from "./renewAccess";
import { hasAccess } from "./hasAccess";
import { subscriptionExpiry } from "./subscriptionExpiry";
import { LicenseTerms } from "./utils";
import { approveIfNeeded } from "./approveIfNeeded";

interface OriginUsageReturnType {
  user: {
    multiplier: number;
    points: number;
    active: boolean;
  };
  teams: Array<any>;
  dataSources: Array<any>;
}

type CallOptions = {
  value?: bigint;
  gas?: bigint;
  waitForReceipt?: boolean;
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
  requestDelete!: typeof requestDelete;
  getTerms!: typeof getTerms;
  ownerOf!: typeof ownerOf;
  balanceOf!: typeof balanceOf;
  contentHash!: typeof contentHash;
  tokenURI!: typeof tokenURI;
  dataStatus!: typeof dataStatus;
  royaltyInfo!: typeof royaltyInfo;
  getApproved!: typeof getApproved;
  isApprovedForAll!: typeof isApprovedForAll;
  transferFrom!: typeof transferFrom;
  safeTransferFrom!: typeof safeTransferFrom;
  approve!: typeof approve;
  setApprovalForAll!: typeof setApprovalForAll;
  // Marketplace methods
  buyAccess!: typeof buyAccess;
  renewAccess!: typeof renewAccess;
  hasAccess!: typeof hasAccess;
  subscriptionExpiry!: typeof subscriptionExpiry;

  private jwt: string;
  private viemClient?: any;
  constructor(jwt: string, viemClient?: any) {
    this.jwt = jwt;
    this.viemClient = viemClient;
    // DataNFT methods
    this.mintWithSignature = mintWithSignature.bind(this);
    this.registerIpNFT = registerIpNFT.bind(this);
    this.updateTerms = updateTerms.bind(this);
    this.requestDelete = requestDelete.bind(this);
    this.getTerms = getTerms.bind(this);
    this.ownerOf = ownerOf.bind(this);
    this.balanceOf = balanceOf.bind(this);
    this.contentHash = contentHash.bind(this);
    this.tokenURI = tokenURI.bind(this);
    this.dataStatus = dataStatus.bind(this);
    this.royaltyInfo = royaltyInfo.bind(this);
    this.getApproved = getApproved.bind(this);
    this.isApprovedForAll = isApprovedForAll.bind(this);
    this.transferFrom = transferFrom.bind(this);
    this.safeTransferFrom = safeTransferFrom.bind(this);
    this.approve = approve.bind(this);
    this.setApprovalForAll = setApprovalForAll.bind(this);
    // Marketplace methods
    this.buyAccess = buyAccess.bind(this);
    this.renewAccess = renewAccess.bind(this);
    this.hasAccess = hasAccess.bind(this);
    this.subscriptionExpiry = subscriptionExpiry.bind(this);
  }

  getJwt() {
    return this.jwt;
  }

  setViemClient(client: any) {
    this.viemClient = client;
  }

  #generateURL = async (file: File) => {
    const uploadRes = await fetch(
      `${constants.AUTH_HUB_BASE_API}/auth/origin/upload-url`,
      {
        method: "POST",
        body: JSON.stringify({
          name: file.name,
          type: file.type,
        }),
        headers: {
          Authorization: `Bearer ${this.jwt}`,
        },
      }
    );
    const data = await uploadRes.json();
    return data.isError ? data.message : data.data;
  };

  #setOriginStatus = async (key: string, status: string) => {
    const res = await fetch(
      `${constants.AUTH_HUB_BASE_API}/auth/origin/update-status`,
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
      console.error("Failed to update origin status");
      return;
    }
  };

  uploadFile = async (
    file: File,
    options?: { progressCallback?: (percent: number) => void }
  ) => {
    const uploadInfo = await this.#generateURL(file);
    if (!uploadInfo) {
      console.error("Failed to generate upload URL");
      return;
    }
    try {
      await uploadWithProgress(
        file,
        uploadInfo.url,
        options?.progressCallback || (() => {})
      );
    } catch (error) {
      await this.#setOriginStatus(uploadInfo.key, "failed");
      throw new Error("Failed to upload file: " + error);
    }
    await this.#setOriginStatus(uploadInfo.key, "success");
    return uploadInfo;
  };

  mintFile = async (
    file: File,
    metadata: Record<string, unknown>,
    license: LicenseTerms,
    parentId?: bigint,
    options?: {
      progressCallback?: (percent: number) => void;
    }
  ): Promise<string | null> => {
    if (!this.viemClient) {
      throw new Error("WalletClient not connected.");
    }
    const info = await this.uploadFile(file, options);
    if (!info || !info.key) {
      throw new Error("Failed to upload file or get upload info.");
    }
    const deadline = BigInt(Math.floor(Date.now() / 1000) + 600); // 10 minutes from now
    const registration = await this.registerIpNFT(
      "file",
      deadline,
      license,
      metadata,
      info.key,
      parentId
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

    const [account] = await this.viemClient.request({
      method: "eth_requestAccounts",
      params: [],
    });

    const mintResult = await this.mintWithSignature(
      account,
      tokenId,
      parentId || BigInt(0),
      creatorContentHash,
      uri,
      license,
      deadline,
      signature
    );

    if (mintResult.status !== "0x1") {
      throw new Error(`Minting failed with status: ${mintResult.status}`);
    }

    return tokenId.toString();
  };

  mintSocial = async (
    source: "spotify" | "twitter" | "tiktok",
    license: LicenseTerms
  ): Promise<string | null> => {
    if (!this.viemClient) {
      throw new Error("WalletClient not connected.");
    }

    const deadline = BigInt(Math.floor(Date.now() / 1000) + 600); // 10 minutes from now
    const metadata = {
      name: `${source} IpNFT`,
      description: `This is a ${source} IpNFT`,
    };
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

    const [account] = await this.viemClient.request({
      method: "eth_requestAccounts",
      params: [],
    });

    const mintResult = await this.mintWithSignature(
      account,
      tokenId,
      BigInt(0), // parentId is not applicable for social IpNFTs
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
  };

  getOriginUploads = async () => {
    const res = await fetch(
      `${constants.AUTH_HUB_BASE_API}/auth/origin/files`,
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
  };

  /**
   * Get the user's Origin stats (multiplier, consent, usage, etc.).
   * @returns {Promise<OriginUsageReturnType>} A promise that resolves with the user's Origin stats.
   */

  async getOriginUsage(): Promise<OriginUsageReturnType> {
    const data = await fetch(
      `${constants.AUTH_HUB_BASE_API}/auth/origin/usage`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${this.jwt}`,
          // "x-client-id": this.clientId,
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
      `${constants.AUTH_HUB_BASE_API}/auth/origin/status`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${this.jwt}`,
          // "x-client-id": this.clientId,
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
   * Set the user's Origin multiplier.
   * @param {number} multiplier The user's Origin multiplier.
   * @returns {Promise<void>}
   * @throws {Error|APIError} - Throws an error if the user is not authenticated. Also throws an error if the multiplier is not provided.
   */

  async setOriginMultiplier(multiplier: number): Promise<void> {
    if (multiplier === undefined) {
      throw new APIError("Multiplier is required");
    }
    const data = await fetch(
      `${constants.AUTH_HUB_BASE_API}/auth/origin/multiplier`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${this.jwt}`,
          // "x-client-id": this.clientId,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          multiplier,
        }),
      }
    ).then((res) => res.json());

    if (!data.isError) {
      return;
    } else {
      throw new APIError(data.message || "Failed to set Origin multiplier");
    }
  }

  /**
   * Wait for the transaction receipt.
   * @private
   * @param {string} txHash The transaction hash.
   * @returns {Promise<any>} A promise that resolves with the transaction receipt.
   * @throws {Error} - Throws an error if the wallet client is not connected.
   */
  async #waitForTxReceipt(txHash: `0x${string}`): Promise<any> {
    if (!this.viemClient) throw new Error("WalletClient not connected.");

    while (true) {
      const receipt = await this.viemClient.request({
        method: "eth_getTransactionReceipt",
        params: [txHash],
      });

      if (receipt && receipt.blockNumber) {
        return receipt;
      }

      await new Promise((res) => setTimeout(res, 1000));
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

    let currentChainId = await this.viemClient.request({
      method: "eth_chainId",
      params: [],
    });
    if (typeof currentChainId === "string") {
      currentChainId = parseInt(currentChainId, 16);
    }

    if (currentChainId !== chain.id) {
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

    if (!isView && !this.viemClient) {
      throw new Error("WalletClient not connected.");
    }

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
    } else {
      const [account] = await this.viemClient.request({
        method: "eth_requestAccounts",
        params: [],
      });

      const data = encodeFunctionData({
        abi,
        functionName: methodName,
        args: params,
      });

      await this.#ensureChainId(testnet);
      try {
        const txHash = await this.viemClient.sendTransaction({
          to: contractAddress as `0x${string}`,
          data,
          account,
          value: options.value,
          gas: options.gas,
        });

        if (typeof txHash !== "string") {
          throw new Error("Transaction failed to send.");
        }

        if (!options.waitForReceipt) {
          return txHash;
        }

        const receipt = await this.#waitForTxReceipt.call(
          this,
          txHash as `0x${string}`
        );
        return receipt;
      } catch (error) {
        console.error("Transaction failed:", error);
        throw new Error("Transaction failed: " + error);
      }
    }
  }

  /**
   * Buy access to an asset by first checking its price via getTerms, then calling buyAccess.
   * @param {bigint} tokenId The token ID of the asset.
   * @param {number} periods The number of periods to buy access for.
   * @returns {Promise<any>} The result of the buyAccess call.
   */
  async buyAccessSmart(tokenId: bigint, periods: number): Promise<any> {
    if (!this.viemClient) {
      throw new Error("WalletClient not connected.");
    }
    const terms = await this.getTerms(tokenId);
    if (!terms) throw new Error("Failed to fetch terms for asset");

    const { price, paymentToken } = terms;
    if (price === undefined || paymentToken === undefined) {
      throw new Error("Terms missing price or paymentToken");
    }
    const addr = await this.viemClient.getAddress();

    const totalCost = price * BigInt(periods);
    const isNative = paymentToken === zeroAddress;
    if (isNative) {
      return this.buyAccess(addr, tokenId, periods, totalCost);
    }

    await approveIfNeeded({
      walletClient: this.viemClient,
      publicClient: getPublicClient(),
      tokenAddress: paymentToken,
      owner: addr,
      spender: constants.MARKETPLACE_CONTRACT_ADDRESS as `0x${string}`,
      amount: totalCost,
    });

    return this.buyAccess(addr, tokenId, periods);
  }

  async getData(tokenId: bigint): Promise<any> {
    const response = await fetch(
      `${constants.AUTH_HUB_BASE_API}/auth/origin/data/${tokenId}`,
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
}
