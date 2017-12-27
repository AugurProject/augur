/*
A reviver is a function that prescribes how the value originally produced by JSON.parse is transformed, before being returned.
*/

import { formatEthereumAddress } from "speedomatic";

const inputsExpectedAsAddress : string[] = [
  "account",
  "author",
  "creator",
  "filler",
  "designatedReporter",
  "marketCreator",
  "marketID",
  "orderCreator",
  "owner",
  "reportingWindow",
  "shareToken",
  "stakeToken",
  "token",
  "universe",
];

export function addressFormatReviver (key : any, value : any) {
  console.log('key', key);
  if (inputsExpectedAsAddress.some(x => x === key)) {
    return formatEthereumAddress(value);
  }

  return value;
};
