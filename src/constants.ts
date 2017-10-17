import BigNumber from "bignumber.js";

export interface Precision {
  decimals: number;
  limit: string;
  zero: string;
  multiple: string;
}

const ten: BigNumber = new BigNumber(10, 10);
const decimals: BigNumber = new BigNumber(4, 10);
const multiple: BigNumber = ten.toPower(decimals.toNumber());

export const PRECISION: Precision = {
  decimals: decimals.toNumber(),
  limit: ten.dividedBy(multiple).toFixed(),
  zero: new BigNumber(1, 10).dividedBy(multiple).toFixed(),
  multiple: multiple.toFixed()
};

export const MINIMUM_TRADE_SIZE: string = "0.01";
