import * as Knex from "knex";
import Augur from "augur.js";
import * as _ from "lodash";
import { BigNumber } from "bignumber.js";
import { Address, ErrorCallback, FormattedEventLog, AsyncCallback } from "../../../types";
import { numTicksToTickSize } from "../../../utils/convert-fixed-point-to-decimal";
import { QueryBuilder } from "knex";
import { getCurrentTime } from "../../process-block";
import { ZERO } from "../../../constants";
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

export async function updateProfitLossBuyShares(db: Knex, marketId: Address, account: Address, tokensSpent: BigNumber, outcomes: Array<number>, transactionHash: String): Promise<void> {
  const tokensSpentPerOutcome = tokensSpent.dividedBy(outcomes.length);
  const moneySpentRows: Array<OutcomeMoneySpent> = await db
    .select(["outcome", "moneySpent"])
    .from("profit_loss_timeseries")
    .where({ account, transactionHash, marketId })
    .whereIn("outcome", outcomes)
    .orderBy("timestamp", "DESC");
  for (const moneySpentRow of moneySpentRows) {
    const newMoneySpent = tokensSpentPerOutcome.plus(moneySpentRow.moneySpent || ZERO).toString();
    await db("profit_loss_timeseries")
      .update({ moneySpent: newMoneySpent })
      .where({ account, transactionHash, marketId, outcome: moneySpentRow.outcome });
  }
}

export async function updateProfitLossSellEscrowedShares(db: Knex, marketId: Address, numShares: BigNumber, account: Address, outcomes: Array<number>, tokensReceived: BigNumber, transactionHash: String): Promise<void> {
  const tokensReceivedPerOutcome = tokensReceived.dividedBy(outcomes.length);
  const timestamp = getCurrentTime();

  for (const outcome of outcomes) {
    const updateData: UpdateData = await db
      .first(["account", "numOwned", "moneySpent", "profit", "transactionHash", "outcome", "numEscrowed"])
      .from("profit_loss_timeseries")
      .where({ account, marketId, outcome })
      .orderBy("timestamp", "DESC");

    const sellPrice = tokensReceivedPerOutcome.dividedBy(numShares);
    const numOwned = updateData.numOwned || ZERO;
    const oldMoneySpent = updateData.moneySpent || ZERO;
    const oldProfit = updateData.profit || ZERO;
    const numEscrowed = updateData.numEscrowed || ZERO;
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
    };
    let upsertEntry: QueryBuilder;
    if (updateData.transactionHash != transactionHash) {
      upsertEntry = db.insert(insertData).into("profit_loss_timeseries");
    } else {
      upsertEntry = db("profit_loss_timeseries")
        .update({ moneySpent, profit })
        .where({ account, transactionHash, marketId, outcome: updateData.outcome });
    }
    await upsertEntry;
  }
}

export async function updateProfitLossSellShares(db: Knex, marketId: Address, numShares: BigNumber, account: Address, outcomes: Array<number>, tokensReceived: BigNumber, transactionHash: String): Promise<void> {
  const tokensReceivedPerOutcome = tokensReceived.dividedBy(outcomes.length);
  const timestamp = getCurrentTime();
  const updateDataRows: Array<UpdateData> = await db
    .select(["account", "numOwned", "moneySpent", "profit", "transactionHash", "outcome", "numEscrowed"])
    .from("profit_loss_timeseries")
    .where({ account, marketId, transactionHash })
    .whereIn("outcome", outcomes);

  for (const updateData of updateDataRows) {
    const sellPrice = tokensReceivedPerOutcome.dividedBy(numShares);
    const numOwned = new BigNumber(updateData.numOwned || 0);
    const oldMoneySpent = new BigNumber(updateData.moneySpent || 0);
    const oldProfit = new BigNumber(updateData.profit || 0);
    const numEscrowed = new BigNumber(updateData.numEscrowed || 0);
    const originalNumOwned = numShares.plus(numOwned);
    const totalOwned = originalNumOwned.plus(numEscrowed);
    const profit = oldProfit.plus(numShares.multipliedBy(sellPrice.minus(oldMoneySpent.dividedBy(totalOwned)))).toString();
    const moneySpent = oldMoneySpent.multipliedBy(numOwned.dividedBy(totalOwned)).toString();
    await db("profit_loss_timeseries")
      .update({ moneySpent, profit })
      .where({ account, transactionHash, marketId, outcome: updateData.outcome });
  }
}

export async function updateProfitLossChangeShareBalance(db: Knex, augur: Augur, token: Address, numShares: BigNumber, account: Address, transactionHash: String): Promise<void> {
  // Don't record FillOrder
  if (account == augur.contracts.addresses[augur.rpc.getNetworkID()].FillOrder) return;
  const timestamp = getCurrentTime();
  const shareData: ShareData = await db
    .first(["marketId", "outcome"])
    .from("tokens")
    .where({ contractAddress: token });
  const marketId = shareData.marketId;
  const outcome = shareData.outcome;
  // Don't record market transfers
  if (account == marketId) return;

  const updateData: UpdateData | undefined = await db
    .first(["account", "numOwned", "moneySpent", "profit", "transactionHash", "outcome", "numEscrowed"])
    .from("profit_loss_timeseries")
    .where({ account, marketId, outcome })
    .orderBy("timestamp", "DESC");
  const marketData: MarketData = await db
    .first(["numTicks", "minPrice", "maxPrice"])
    .from("markets")
    .where({ marketId });
  const minPrice = marketData.minPrice;
  const maxPrice = marketData.maxPrice;
  const numTicks = marketData.numTicks;
  const tickSize = numTicksToTickSize(numTicks, minPrice, maxPrice);
  const numOwned = numShares
    .dividedBy(tickSize)
    .dividedBy(10 ** 18)
    .toString();
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
  };
  if (!updateData) {
    // No entries for this user for this outcome
    upsertEntry = db.insert(insertData).into("profit_loss_timeseries");
  } else if (updateData.transactionHash == transactionHash) {
    // Previous entry was from the same transaction. Just update the balance for it
    upsertEntry = db
      .from("profit_loss_timeseries")
      .where({ account, transactionHash: transactionHash, marketId, outcome })
      .update({ numOwned });
  } else {
    // New tx for this account and outcome. Make a new row with previous row's data
    if (updateData.moneySpent) insertData.moneySpent = updateData.moneySpent.toString();
    if (updateData.profit) insertData.profit = updateData.profit.toString();
    if (updateData.numEscrowed) insertData.numEscrowed = updateData.numEscrowed.toString();
    upsertEntry = db.insert(insertData).into("profit_loss_timeseries");
  }
  await upsertEntry;
}

// We only need to call this for the share balance update since the tx hash of the removed block will be shared between the price updates and the share balance update
export async function updateProfitLossRemoveRow(db: Knex, transactionHash: String): Promise<void> {
  // if this tx was rollbacked simply delete any rows correlated with it
  await db("profit_loss_timeseries")
    .delete()
    .where({ transactionHash });
}

export async function updateProfitLossNumEscrowed(db: Knex, marketId: Address, numEscrowedDelta: BigNumber, account: Address, outcomes: Array<number>, transactionHash: String): Promise<void> {
  const numEscrowedRows: Array<OutcomeNumEscrowed> = await db
    .select(["outcome", "numEscrowed"])
    .from("profit_loss_timeseries")
    .where({ account, transactionHash, marketId })
    .whereIn("outcome", outcomes)
    .orderBy("timestamp", "DESC");
  for (const numEscrowedRow of numEscrowedRows) {
    const newNumEscrowed = new BigNumber(numEscrowedDelta).plus(numEscrowedRow.numEscrowed || 0).toString();
    await db("profit_loss_timeseries")
      .update({ numEscrowed: newNumEscrowed })
      .where({ account, transactionHash, marketId, outcome: numEscrowedRow.outcome });
  }
}
