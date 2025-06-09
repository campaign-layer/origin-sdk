import { Address } from "viem";

export type LicenseTerms = {
  price: bigint;
  duration: number;
  royaltyBps: number;
  paymentToken: Address;
};

export enum DataStatus {
  ACTIVE = 0,
  PENDING_DELETE = 1,
  DELETED = 2,
}