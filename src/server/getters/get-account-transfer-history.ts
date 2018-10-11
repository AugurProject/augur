import * as Knex from "knex";
import { Address, Bytes32, SortLimitParams } from "../../types";
import { queryModifierParams } from "./database";
import { formatBigNumberAsFixed } from "../../utils/format-big-number-as-fixed";
import * as t from "io-ts";

export const AccountTransferHistoryParamsSpecific = t.type({
  account: t.string,
  token: t.union([t.string, t.null, t.undefined]),
  isInternalTransfer: t.union([t.boolean, t.null, t.undefined]),
  earliestCreationTime: t.union([t.number, t.null, t.undefined]),
  latestCreationTime: t.union([t.number, t.null, t.undefined]),
});

export const AccountTransferHistoryParams = t.intersection([
  AccountTransferHistoryParamsSpecific,
  SortLimitParams,
]);

export interface TransferRow<BigNumberType> {
  transactionHash: Bytes32;
  logIndex: number;
  blockNumber: number;
  blockHash: string;
  timestamp: number;
  sender: Address;
  recipient: Address;
  token: Address;
  value: BigNumberType;
  symbol: string|null;
  outcome: number|null;
  marketId: Address|null;
  isTrade: number;
}
export async function getAccountTransferHistory(db: Knex, augur: {}, params: t.TypeOf<typeof AccountTransferHistoryParams>): Promise<Array<TransferRow<string>>> {
  const query = db("transfers").select([
    "transfers.transactionHash",
    "transfers.logIndex",
    "transfers.blockNumber as creationBlockNumber",
    "transfers.sender",
    "transfers.recipient",
    "transfers.token",
    "transfers.value",
    "blocks.timestamp as creationTime",
    "blocks.blockHash",
    "tokens.symbol",
    "tokens.outcome",
    "tokens.marketId",
    db.raw("CASE WHEN transfers.transactionHash IN (SELECT DISTINCT transactionHash FROM trades UNION SELECT DISTINCT transactionHash FROM orders) THEN 1 ELSE 0 END as isInternalTransfer"),
  ]).where((db: Knex): Knex.QueryBuilder => db.where("sender", params.account).orWhere("recipient", params.account));
  query.join("blocks", "blocks.blockNumber", "transfers.blockNumber");
  query.join("tokens", "tokens.contractAddress", "transfers.token");
  if (params.isInternalTransfer != null) query.where("isInternalTransfer", params.isInternalTransfer);
  if (params.token != null) query.andWhere("token", params.token);
  if (params.earliestCreationTime != null) query.where("creationTime", ">=", params.earliestCreationTime);
  if (params.latestCreationTime != null) query.where("creationTime", "<=", params.latestCreationTime);
  const results = await queryModifierParams<TransferRow<BigNumber>>(db, query, "transfers.blockNumber", "desc", params);
  return results.map((result) => formatBigNumberAsFixed<TransferRow<BigNumber>, TransferRow<string>>(result));
}
