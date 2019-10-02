/*
A reviver is a function that prescribes how the value originally produced by JSON.parse is transformed, before being returned.
*/

import { formatEthereumAddress } from "@augurproject/utils";
import { getAddress } from "ethers/utils/address";

export interface StringToBoolMap {
  [key: string]: boolean;
}

export const inputsExpectedAsAddress: StringToBoolMap = {
  account: true,
  author: true,
  childUniverse: true,
  creator: true,
  designatedReporter: true,
  disputeCrowdsourcer: true,
  from: true,
  market: true,
  marketCreator: true,
  marketId: true,
  marketIds: true,
  newUniverse: true,
  originalUniverse: true,
  owner: true,
  parentUniverse: true,
  sender: true,
  shareToken: true,
  reporter: true,
  reportingParticipant: true,
  target: true,
  to: true,
  token: true,
  universe: true,
};

function preCleanAddress(address: string) {
  return getAddress(address);
}

export function AddressFormatReviver(key: string, value: any) {
  if (inputsExpectedAsAddress[key]) {
    if (typeof value === "string") {
      return formatEthereumAddress(preCleanAddress(value));
    } else if (Array.isArray(value)) {
      return formatEthereumAddress((value).map((address) => typeof address === "string" ? preCleanAddress(address) : ""));
    }
  }

  return value;
}
