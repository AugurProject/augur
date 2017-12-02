import { each } from "async";
import * as Knex from "knex";
import { Address, MarketsContractAddressRow } from "../../types";
import { queryModifier, getMarketsWithReportingState } from "./database";

export function getBetterWorseOrders(db: Knex, marketID: Address, outcome: number, amount: string, normalizedPrice: string|number, callback: (err?: Error|null, result?: any) => void): void {
  if (marketID == null || outcome == null || normalizedPrice == null) return callback(new Error("Must provide marketID, outcome, and normalizedPrice"));
  callback(null, {immediateFill: true,
    betterOrderID: 0,
    worseOrderID: 0,
    });
}
