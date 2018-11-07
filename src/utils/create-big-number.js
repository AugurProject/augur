import logError from "utils/log-error";
import { BigNumber } from "bignumber.js";

export const createBigNumber = (value, ...args) => {
  let newBigNumber;
  try {
    const bn = typeof value === "number" ? value.toString() : value;
    newBigNumber = new BigNumber(bn, ...args);
  } catch (e) {
    logError("Error instantiating WrappedBigNumber", e);
  }

  return newBigNumber;
};

// Note this is exported from here.
export { default as BigNumber } from "bignumber.js";
