import { AccountList } from "./ganache";

export const _1_ETH = 1000000000000000000;
export const _100_ETH = _1_ETH * 100;
export const _10000_ETH = _1_ETH * 10000;

export const ACCOUNTS: AccountList = [
  {
    secretKey: "0xa429eeb001c683cf3d8faf4b26d82dbf973fb45b04daad26e1363efd2fd43913",
    publicKey: "0x8fFf40Efec989Fc938bBA8b19584dA08ead986eE",
    balance: _10000_ETH,
  },
  {
    secretKey: "0xfae42052f82bed612a724fec3632f325f377120592c75bb78adfcceae6470c5a",
    publicKey: "0x913dA4198E6bE1D5f5E4a40D0667f70C0B5430Eb",
    balance: _10000_ETH,
  },
];
