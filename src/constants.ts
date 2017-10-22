import BigNumber from "bignumber.js";

export interface Precision {
  decimals: number;
  limit: string;
  zero: string;
  multiple: string;
}

const ten = new BigNumber(10, 10);
const decimals = new BigNumber(4, 10);
const multiple: BigNumber = ten.toPower(decimals.toNumber());

export const PRECISION: Precision = {
  decimals: decimals.toNumber(),
  limit: ten.dividedBy(multiple).toFixed(),
  zero: new BigNumber(1, 10).dividedBy(multiple).toFixed(),
  multiple: multiple.toFixed(),
};

export const MINIMUM_TRADE_SIZE = "0.01";

export const WEI_PER_ETHER: string = new BigNumber(10, 10).toPower(18).toFixed();
