/*
A reviver is a function that prescribes how the value originally produced by JSON.parse is transformed, before being returned.
*/

import { formatEthereumAddress } from "speedomatic";

export const inputsExpectedAsAddress : string[] = [
  "account",
  "category",
  "creator",
  "designatedReporter",
  "marketID",
  "marketIDs",
  "recipient",
  "reporter",
  "reportingWindow",
  "result",
  "sender",
  "token",
  "universe",
];

export function addressFormatReviver (key : any, value : any) {
  const valueIsOfAddressType : boolean = typeof value === "string" || Array.isArray(value);
  const keyIsInWhitelist = inputsExpectedAsAddress.some(x => x === key);
  if (valueIsOfAddressType && keyIsInWhitelist) {
    return formatEthereumAddress(value);
  }

  return value;
};
