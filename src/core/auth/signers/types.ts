export interface BaseSigner {
  getAddress(): Promise<string>;
  signMessage(message: string): Promise<string>;
  getChainId(): Promise<number>;
}

export type SignerType = "viem" | "ethers" | "custom";

export interface SignerAdapter {
  type: SignerType;
  signer: any;
  getAddress(): Promise<string>;
  signMessage(message: string): Promise<string>;
  getChainId(): Promise<number>;
}
