import * as Knex from "knex";
import { Address, Bytes32 } from "../../types";
import { queryModifier } from "./database";
import { formatBigNumberAsFixed } from "../../utils/format-big-number-as-fixed";

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
}

export function getAccountTransferHistory(db: Knex, account: Address, token: Address|null|undefined, earliestCreationTime: number|null, latestCreationTime: number|null, sortBy: string|null|undefined, isSortDescending: boolean|null|undefined, limit: number|null|undefined, offset: number|null|undefined, callback: (err: Error|null, transferHistory?: Array<TransferRow<string>>) => void): void {
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
  ]).where((db: Knex): Knex.QueryBuilder => db.where("sender", account).orWhere("recipient", account));
  query.join("blocks", "blocks.blockNumber", "transfers.blockNumber" );
  query.join("tokens", "tokens.contractAddress", "transfers.token");
  if (token != null) query.andWhere({ token });
  if (earliestCreationTime != null) query.where("creationTime", ">=", earliestCreationTime);
  if (latestCreationTime != null) query.where("creationTime", "<=", latestCreationTime);
  queryModifier(db, query, "transfers.blockNumber", "desc", sortBy, isSortDescending, limit, offset, (error: Error|null, results: Array<TransferRow<BigNumber>>) => {
    if (error) return callback(error);

    callback(null, results.map((result) => formatBigNumberAsFixed<TransferRow<BigNumber>, TransferRow<string>>(result)));
  });
}
