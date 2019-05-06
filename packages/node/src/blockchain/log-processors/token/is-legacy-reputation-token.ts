import { Address, Augur } from "../../../types";
import { Addresses } from "@augurproject/artifacts";

export function isLegacyReputationToken(augur: Augur, token: Address) {
  return Addresses[augur.networkId].LegacyReputationToken;
}
