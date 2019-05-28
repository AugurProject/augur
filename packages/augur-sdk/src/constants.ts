import { utils as ethersUtils } from "ethers";
import { BigNumber } from "bignumber.js";

export enum ACCOUNT_TYPES {
U_PORT= "uPort",
LEDGER = "ledger",
PRIVATE_KEY = "privateKey",
UNLOCKED_ETHEREUM_NODE = "unlockedEthereumNode",
META_MASK = "metaMask",
TREZOR = "trezor",
EDGE = "edge",
};

export const ETHER = new ethersUtils.BigNumber(10).pow(18)

export const TRADE_GAS_BUFFER = new BigNumber("100000", 10);

export const MAX_FILLS_PER_TX = new BigNumber("3", 10);

export const MAX_GAS_LIMIT_FOR_TRADE = new BigNumber("3500000", 10);

export const PLACE_ORDER_NO_SHARES = {
2: new BigNumber("547694", 10),
3: new BigNumber("562138", 10),
4: new BigNumber("576582", 10),
5: new BigNumber("591026", 10),
6: new BigNumber("605470", 10),
7: new BigNumber("619914", 10),
8: new BigNumber("634358", 10),
};

export const PLACE_ORDER_WITH_SHARES = {
2: new BigNumber("695034", 10),
3: new BigNumber("794664", 10),
4: new BigNumber("894294", 10),
5: new BigNumber("993924", 10),
6: new BigNumber("1093554", 10),
7: new BigNumber("1193184", 10),
8: new BigNumber("1292814", 10),
};

export const WORST_CASE_FILL = {
2: new BigNumber("933495", 10),
3: new BigNumber("1172245", 10),
4: new BigNumber("1410995", 10),
5: new BigNumber("1649744", 10),
6: new BigNumber("1888494", 10),
7: new BigNumber("2127244", 10),
8: new BigNumber("2365994", 10),
};