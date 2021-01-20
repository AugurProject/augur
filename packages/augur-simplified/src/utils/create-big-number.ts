import logError from "./log-error";
import { BigNumber } from "bignumber.js";

  export const createBigNumber = (value, ...args): BigNumber => {
  let newBigNumber;
  try {
    let useValue = value;
    if (typeof value === "object" && Object.keys(value).indexOf("_hex") > -1) {
      useValue = value._hex;
    }
    newBigNumber = new BigNumber(`${useValue}`, ...args);
  } catch (e) {
    logError("Error instantiating WrappedBigNumber", e);
  }

    return newBigNumber;
};

  // Note this is exported from here.
export { default as BigNumber } from "bignumber.js";
