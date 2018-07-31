import { Augur } from "augur.js";
import { Address } from "../../../types";

export function isLegacyReputationToken(augur: Augur, token: Address) {
  return token === augur.contracts.addresses[augur.rpc.getNetworkID()].LegacyReputationToken;
}
