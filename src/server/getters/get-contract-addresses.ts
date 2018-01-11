import Augur from "augur.js";
import { each } from "async";
import * as Knex from "knex";
import { Address, MarketsContractAddressRow } from "../../types";
import { queryModifier, getMarketsWithReportingState } from "./database";

// Returning marketIDs should likely be more generalized, since it is a single line change for most getters (awaiting reporting, by user, etc)
export function getContractAddresses(augur: Augur, callback: (err?: Error|null, result?: any) => void): void {
  callback(null, {
    version: augur.version,
    addresses: augur.contracts.addresses[augur.rpc.getNetworkID()],
  });
}
