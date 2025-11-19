import type { WalletClient } from "viem";
import { SignerAdapter, SignerType } from "./types";

/**
 * Adapter for viem WalletClient
 */
export class ViemSignerAdapter implements SignerAdapter {
  type: SignerType = "viem";
  signer: WalletClient;

  constructor(signer: WalletClient) {
    this.signer = signer;
  }

  async getAddress(): Promise<string> {
    if (this.signer.account) {
      return this.signer.account.address;
    }
    const accounts = await this.signer.request({
      method: "eth_requestAccounts",
      params: [] as any,
    });
    if (!accounts || accounts.length === 0) {
      throw new Error("No accounts found in viem wallet client");
    }
    return accounts[0];
  }

  async signMessage(message: string): Promise<string> {
    const address = await this.getAddress();
    return await this.signer.signMessage({
      account: address as `0x${string}`,
      message,
    });
  }

  async signTypedData(domain: any, types: any, value: any): Promise<string> {
    throw new Error("Viem WalletClient does not support signTypedData");
  }

  async getChainId(): Promise<number> {
    return this.signer.chain?.id || 1;
  }
}

/**
 * Adapter for ethers Signer (v5 and v6)
 */
export class EthersSignerAdapter implements SignerAdapter {
  type: SignerType = "ethers";
  signer: any;

  constructor(signer: any) {
    this.signer = signer;
  }

  async getAddress(): Promise<string> {
    // Works for both ethers v5 and v6
    if (typeof this.signer.getAddress === "function") {
      return await this.signer.getAddress();
    }
    if (this.signer.address) {
      return this.signer.address;
    }
    throw new Error("Unable to get address from ethers signer");
  }

  async signMessage(message: string): Promise<string> {
    if (typeof this.signer.signMessage !== "function") {
      throw new Error("Signer does not support signMessage");
    }
    return await this.signer.signMessage(message);
  }

  async signTypedData(domain: any, types: any, value: any): Promise<string> {
    if (typeof this.signer._signTypedData === "function") {
      return await this.signer._signTypedData(domain, types, value);
    }
    if (typeof this.signer.signTypedData !== "function") {
      throw new Error(
        "Signer does not support signTypedData or _signTypedData"
      );
    }
    return await this.signer.signTypedData(domain, types, value);
  }

  async getChainId(): Promise<number> {
    // Try ethers v6 first
    if (
      this.signer.provider &&
      typeof this.signer.provider.getNetwork === "function"
    ) {
      const network = await this.signer.provider.getNetwork();
      // ethers v6 returns bigint, v5 returns number
      return typeof network.chainId === "bigint"
        ? Number(network.chainId)
        : network.chainId;
    }
    // Fallback for ethers v5
    if (typeof this.signer.getChainId === "function") {
      return await this.signer.getChainId();
    }
    // Default to mainnet if we can't determine
    return 484;
  }
}

/**
 * Adapter for custom signer implementations
 */
export class CustomSignerAdapter implements SignerAdapter {
  type: SignerType = "custom";
  signer: any;

  constructor(signer: any) {
    this.signer = signer;
  }

  async getAddress(): Promise<string> {
    if (typeof this.signer.getAddress === "function") {
      return await this.signer.getAddress();
    }
    if (this.signer.address) {
      return this.signer.address;
    }
    throw new Error(
      "Custom signer must implement getAddress() or have address property"
    );
  }

  async signMessage(message: string): Promise<string> {
    if (typeof this.signer.signMessage !== "function") {
      throw new Error("Custom signer must implement signMessage()");
    }
    return await this.signer.signMessage(message);
  }

  async signTypedData(domain: any, types: any, value: any): Promise<string> {
    if (typeof this.signer.signTypedData !== "function") {
      throw new Error("Custom signer must implement signTypedData()");
    }
    return await this.signer.signTypedData(domain, types, value);
  }

  async getChainId(): Promise<number> {
    if (typeof this.signer.getChainId === "function") {
      const chainId = await this.signer.getChainId();
      return typeof chainId === "bigint" ? Number(chainId) : chainId;
    }
    if (this.signer.chainId !== undefined) {
      return typeof this.signer.chainId === "bigint"
        ? Number(this.signer.chainId)
        : this.signer.chainId;
    }
    // Default to mainnet
    return 484;
  }
}

/**
 * Factory function to create appropriate adapter based on signer type
 */
export function createSignerAdapter(signer: any): SignerAdapter {
  // Check for viem WalletClient
  if (
    signer.transport &&
    signer.chain &&
    typeof signer.signMessage === "function"
  ) {
    return new ViemSignerAdapter(signer);
  }

  // Check for ethers signer (v5 or v6)
  if (
    signer._isSigner ||
    (signer.provider && typeof signer.signMessage === "function")
  ) {
    return new EthersSignerAdapter(signer);
  }

  // Try custom adapter
  return new CustomSignerAdapter(signer);
}
