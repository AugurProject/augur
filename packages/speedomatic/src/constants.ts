import BigNumber from "bignumber.js";

let ONE = new BigNumber(1, 10);
let TWO = new BigNumber(2, 10);

export const FXP_ONE = new BigNumber(10, 10).exponentiatedBy(18);
export const BYTES_32 =  TWO.exponentiatedBy(252);
export const INT256_MIN_VALUE = TWO.exponentiatedBy(255).negated();
export const INT256_MAX_VALUE = TWO.exponentiatedBy(255).minus(ONE);
export const UINT256_MAX_VALUE = TWO.exponentiatedBy(256);
