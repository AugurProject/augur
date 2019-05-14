import {BigNumber} from "ethers/utils";

export enum ACCOUNT_TYPES {
U_PORT= "uPort",
LEDGER = "ledger",
PRIVATE_KEY = "privateKey",
UNLOCKED_ETHEREUM_NODE = "unlockedEthereumNode",
META_MASK = "metaMask",
TREZOR = "trezor",
EDGE = "edge",
};

export const ETHER = new BigNumber(10).pow(18)
