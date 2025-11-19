export interface BaseSigner {
  getAddress(): Promise<string>;
  signMessage(message: string): Promise<string>;
  signTypedData?(domain: any, types: any, value: any): Promise<string>;
  getChainId(): Promise<number>;
}

export type SignerType = "viem" | "ethers" | "custom";

export interface SignerAdapter {
  type: SignerType;
  signer: any;
  getAddress(): Promise<string>;
  signMessage(message: string): Promise<string>;
  signTypedData(domain: any, types: any, value: any): Promise<string>;
  getChainId(): Promise<number>;
}
