import * as Knex from "knex";
import Augur from "augur.js";
import * as _ from "lodash";
import { BigNumber } from "bignumber.js";
import { Address, ErrorCallback, FormattedEventLog, AsyncCallback } from "../../../types";
import { numTicksToTickSize } from "../../../utils/convert-fixed-point-to-decimal";
import { QueryBuilder } from "knex";
import { getCurrentTime } from "../../process-block";
import { series } from "async";


interface UpdateData {
  account: Address;
  numOwned: BigNumber;
  moneySpent: BigNumber;
  profit: BigNumber;
  transactionHash: String;
  outcome: BigNumber;
  numEscrowed: BigNumber;
}

interface OutcomeMoneySpent {
  moneySpent: BigNumber;
  outcome: BigNumber;
}

interface OutcomeNumEscrowed {
  numEscrowed: BigNumber;
  outcome: BigNumber;
}

interface ShareData {
  marketId: Address;
  outcome: BigNumber;
}

interface MarketData {
  numTicks: BigNumber;
  maxPrice: BigNumber;
  minPrice: BigNumber;
}

export function updateProfitLossBuyShares(db: Knex, marketId: Address, account: Address, tokensSpent: BigNumber, outcomes: Array<number>, transactionHash: String, callback: ErrorCallback): void {
  const tokensSpentPerOutcome = tokensSpent.dividedBy(outcomes.length);
  db.select(["outcome", "moneySpent"]).from("profit_loss_timeseries").where({ account, transactionHash, marketId }).whereIn("outcome", outcomes).orderBy("timestamp", "DESC").asCallback((err: Error|null, moneySpentRows: Array<OutcomeMoneySpent>): void => {
    if (err) return callback(err);
    const buyUpdates = _.map(moneySpentRows, (moneySpentRow: OutcomeMoneySpent) => {
      const newMoneySpent = tokensSpentPerOutcome.plus(moneySpentRow.moneySpent || 0).toString();
      return (next: AsyncCallback) => db("profit_loss_timeseries").update({ moneySpent: newMoneySpent }).where({ account, transactionHash, marketId, outcome: moneySpentRow.outcome }).asCallback(next)
    });
    return series(buyUpdates, callback);
  });
}

export function updateProfitLossSellEscrowedShares(db: Knex, marketId: Address, numShares: BigNumber, account: Address, outcomes: Array<number>, tokensReceived: BigNumber, transactionHash: String, callback: ErrorCallback): void {
  const tokensReceivedPerOutcome = tokensReceived.dividedBy(outcomes.length);
  const timestamp = getCurrentTime();
  const sellUpdates = _.map(outcomes, (outcome: number) => {
    return (next: AsyncCallback) => db.first([
      "account",
      "numOwned",
      "moneySpent",
      "profit",
      "transactionHash",
      "outcome",
      "numEscrowed"])
      .from("profit_loss_timeseries")
      .where({ account, marketId, outcome })
      .orderBy("timestamp", "DESC")
      .asCallback((err: Error|null, updateData: UpdateData): QueryBuilder => {
        const sellPrice = tokensReceivedPerOutcome.dividedBy(numShares);
        const numOwned = new BigNumber(updateData.numOwned || 0);
        const oldMoneySpent = new BigNumber(updateData.moneySpent || 0);
        const oldProfit = new BigNumber(updateData.profit || 0);
        const numEscrowed = new BigNumber(updateData.numEscrowed || 0);
        const originalNumOwned = numShares.plus(numOwned);
        const totalOwned = originalNumOwned.plus(numEscrowed);
        const profit = oldProfit.plus(numShares.multipliedBy(sellPrice.minus(oldMoneySpent.dividedBy(totalOwned)))).toString();
        const moneySpent = oldMoneySpent.multipliedBy(numOwned.dividedBy(totalOwned)).toString();
        const newNumEscrowed = numEscrowed.minus(numShares).toString();
        const insertData = {
          marketId,
          account,
          outcome: updateData.outcome,
          transactionHash,
          timestamp,
          numOwned: updateData.numOwned,
          numEscrowed: newNumEscrowed,
          moneySpent,
          profit,
        }
        let upsertEntry: QueryBuilder;
        if (updateData.transactionHash != transactionHash) {
          upsertEntry = db.insert(insertData).into("profit_loss_timeseries");
        } else {
          upsertEntry = db("profit_loss_timeseries").update({ moneySpent, profit }).where({ account, transactionHash, marketId, outcome: updateData.outcome });
        }
        return upsertEntry.asCallback(next);
      });
  });
  return series(sellUpdates, callback);
};

export function updateProfitLossSellShares(db: Knex, marketId: Address, numShares: BigNumber, account: Address, outcomes: Array<number>, tokensReceived: BigNumber, transactionHash: String, callback: ErrorCallback): void {
  const tokensReceivedPerOutcome = tokensReceived.dividedBy(outcomes.length);
  const timestamp = getCurrentTime();
  db.select([
    "account",
    "numOwned",
    "moneySpent",
    "profit",
    "transactionHash",
    "outcome",
    "numEscrowed"])
    .from("profit_loss_timeseries")
    .where({ account, marketId, transactionHash })
    .whereIn("outcome", outcomes)
    .asCallback((err: Error|null, updateDataRows: Array<UpdateData>): void => {
    if (err) return callback(err);
    const sellUpdates = _.map(updateDataRows, (updateData: UpdateData) => {
      const sellPrice = tokensReceivedPerOutcome.dividedBy(numShares);
      const numOwned = new BigNumber(updateData.numOwned || 0);
      const oldMoneySpent = new BigNumber(updateData.moneySpent || 0);
      const oldProfit = new BigNumber(updateData.profit || 0);
      const numEscrowed = new BigNumber(updateData.numEscrowed || 0);
      const originalNumOwned = numShares.plus(numOwned);
      const totalOwned = originalNumOwned.plus(numEscrowed);
      const profit = oldProfit.plus(numShares.multipliedBy(sellPrice.minus(oldMoneySpent.dividedBy(totalOwned)))).toString();
      const moneySpent = oldMoneySpent.multipliedBy(numOwned.dividedBy(totalOwned)).toString();
      return (next: AsyncCallback) => db("profit_loss_timeseries").update({ moneySpent, profit }).where({ account, transactionHash, marketId, outcome: updateData.outcome }).asCallback(next);
    });
    return series(sellUpdates, callback);
  });
}

export function updateProfitLossChangeShareBalance(db: Knex, augur: Augur, token: Address, numShares: BigNumber, account: Address, transactionHash: String, callback: ErrorCallback): void {
  // Don't record FillOrder
  if (account == augur.contracts.addresses[augur.rpc.getNetworkID()].FillOrder) return callback(null);
  const timestamp = getCurrentTime();
  db.first(["marketId", "outcome"]).from("tokens").where({ contractAddress: token }).asCallback((err: Error|null, shareData: ShareData): void => {
    if (err) return callback(err);
    const marketId = shareData.marketId;
    const outcome = shareData.outcome;
    // Don't record market transfers
    if (account == marketId) return callback(null);
    db.first(["account", "numOwned", "moneySpent", "profit", "transactionHash", "outcome", "numEscrowed"]).from("profit_loss_timeseries").where({ account, marketId, outcome }).orderBy("timestamp", "DESC").asCallback((err: Error|null, updateData?: UpdateData): void => {
      if (err) return callback(err);
      db.first(["numTicks", "minPrice", "maxPrice"]).from("markets").where({ marketId }).asCallback((err: Error, marketData: MarketData) => {
        if (err) return callback(err);
        const minPrice = marketData.minPrice;
        const maxPrice = marketData.maxPrice;
        const numTicks = marketData.numTicks;
        const tickSize = numTicksToTickSize(numTicks, minPrice, maxPrice);
        const numOwned = numShares.dividedBy(tickSize).dividedBy(10**18).toString();
        let upsertEntry: QueryBuilder;
        const insertData = {
          marketId,
          account,
          outcome,
          transactionHash,
          timestamp,
          numOwned,
          numEscrowed: "0",
          moneySpent: "0",
          profit: "0",
        }
        if (!updateData) {
          // No entries for this user for this outcome
          upsertEntry = db.insert(insertData).into("profit_loss_timeseries");
        } else if (updateData.transactionHash == transactionHash) {
          // Previous entry was from the same transaction. Just update the balance for it
          upsertEntry = db.from("profit_loss_timeseries").where({ account, transactionHash: transactionHash, marketId, outcome }).update({ numOwned });
        } else {
          // New tx for this account and outcome. Make a new row with previous row's data
          if (updateData.moneySpent) insertData.moneySpent = updateData.moneySpent.toString();
          if (updateData.profit) insertData.profit = updateData.profit.toString();
          if (updateData.numEscrowed) insertData.numEscrowed = updateData.numEscrowed.toString();
          upsertEntry = db.insert(insertData).into("profit_loss_timeseries");
        }
        upsertEntry.asCallback(callback);
      });
    });
  });
}

// We only need to call this for the share balance update since the tx hash of the removed block will be shared between the price updates and the share balance update
export function updateProfitLossRemoveRow(db: Knex, transactionHash: String, callback: ErrorCallback): void {
  // if this tx was rollbacked simply delete any rows correlated with it
  db("profit_loss_timeseries").delete().where({ transactionHash }).asCallback(callback);
}

export function updateProfitLossNumEscrowed(db: Knex,  marketId: Address, numEscrowedDelta: BigNumber, account: Address, outcomes: Array<number>, transactionHash: String, callback: ErrorCallback): void {
  db.select(["outcome", "numEscrowed"]).from("profit_loss_timeseries").where({ account, transactionHash, marketId }).whereIn("outcome", outcomes).orderBy("timestamp", "DESC").asCallback((err: Error|null, numEscrowedRows: Array<OutcomeNumEscrowed>): void => {
    if (err) return callback(err);
    const escrowedUpdates = _.map(numEscrowedRows, (numEscrowedRow: OutcomeNumEscrowed) => {
      const newNumEscrowed = new BigNumber(numEscrowedDelta).plus(numEscrowedRow.numEscrowed || 0).toString();
      return (next: AsyncCallback) => db("profit_loss_timeseries").update({ numEscrowed: newNumEscrowed }).where({ account, transactionHash, marketId, outcome: numEscrowedRow.outcome }).asCallback(next)
    });
    return series(escrowedUpdates, callback);
  });
}
