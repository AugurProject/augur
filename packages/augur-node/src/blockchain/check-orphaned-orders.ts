import Augur, { ApiFunction } from "augur.js";
import * as Knex from "knex";
import { PendingOrphanedOrderData, OrderState } from "../types";
import { logger } from "../utils/logger";

export async function checkOrphanedOrders(db: Knex, augur: Augur) {
  const pendingOrders: Array<PendingOrphanedOrderData> = await db.select().from("pending_orphan_checks");
  let orderBooksToCheck = pendingOrders.length;
  if (orderBooksToCheck < 1) return;
  logger.info(`Need to check ${orderBooksToCheck} orderbooks for orphans`);
  for (const pendingOrderData of pendingOrders) {
    await checkOrphanedOrdersForOrderBookSide(db, augur, pendingOrderData);
    orderBooksToCheck--;
    logger.info(`Need to check ${orderBooksToCheck} orderbooks for orphans`);
  }
}

async function checkOrphanedOrdersForOrderBookSide(db: Knex, augur: Augur, pendingOrderData: PendingOrphanedOrderData) {
  let orderIds: Array<string> = [];
  try {
    orderIds = await getOrphanedOrderIds(db, augur, pendingOrderData);
  } catch { // In the case of some broken order books this will never succeed
    logger.warn(`Orphaned Orders check for market: ${pendingOrderData.marketId} failed.`);
  }
  await db.transaction(async (trx: Knex.Transaction) => {
    if (orderIds.length > 0) await trx.from("orders").whereNotIn("orderId", orderIds).where(pendingOrderData).update({ orphaned: true });
    await trx.from("pending_orphan_checks").where(pendingOrderData).del();
  });
}

async function getOrphanedOrderIds(db: Knex, augur: Augur, orderData: PendingOrphanedOrderData): Promise<Array<string>> {
  const queryData = {
    marketId: orderData.marketId,
    outcome: orderData.outcome,
    orderType: orderData.orderType,
    orderState: OrderState.OPEN,
    orphaned: 0,
  };

  const results: { numOrders: number } = await db.first(db.raw("count(*) as numOrders")).from("orders").where(queryData);

  if (results.numOrders < 1) return [];

  const requestData = {
    _type: orderData.orderType === "buy" ? 0 : 1,
    _market: orderData.marketId,
    _outcome: orderData.outcome,
  };
  // Use the function that will return the least amount of data assuming we're close to the right number of orders currently. Failure is expected when syncing and will correct later
  let getExistingOrders: ApiFunction;
  if (results.numOrders >= 500) {
    getExistingOrders = augur.api.OrdersFinder.getExistingOrders1000;
  } else if (results.numOrders >= 200) {
    getExistingOrders = augur.api.OrdersFinder.getExistingOrders500;
  } else if (results.numOrders >= 100) {
    getExistingOrders = augur.api.OrdersFinder.getExistingOrders200;
  } else if (results.numOrders >= 50) {
    getExistingOrders = augur.api.OrdersFinder.getExistingOrders100;
  } else {
    getExistingOrders = augur.api.OrdersFinder.getExistingOrders50;
  }

  return await getExistingOrders(requestData);
}
