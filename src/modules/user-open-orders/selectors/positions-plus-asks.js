import BigNumber from 'bignumber.js';
import { createBigCacheSelector } from 'utils/big-cache-selector';
import store from 'src/store';
import { selectLoginAccountAddress, selectAccountPositionsState, selectOrderBooksState } from 'src/select-state';
import { ZERO } from 'modules/trade/constants/numbers';
import { isOrderOfUser } from 'modules/bids-asks/helpers/is-order-of-user';

import getValue from 'utils/get-value';

export default function () {
  return selectPositionsPlusAsks(store.getState());
}

/**
 * @param {String} account
 * @param {Object} positions
 * @param {Object} orderBooks
 * @return {Object} Total number of shares in positions and open ask orders.
 */
export const selectPositionsPlusAsks = createBigCacheSelector(10)(
  selectLoginAccountAddress,
  selectAccountPositionsState,
  selectOrderBooksState,
  (address, positions, orderBooks) => {
    if (!positions) return null;
    const adjustedMarkets = Object.keys(positions);
    const numAdjustedMarkets = adjustedMarkets.length;
    const positionsPlusAsks = {};
    let marketID;
    for (let i = 0; i < numAdjustedMarkets; ++i) {
      marketID = adjustedMarkets[i];

      // NOTE --  This conditional is here to accomodate the scenario where
      //          a user has positions within a market + no orders.
      //          The order book is not loaded due to lazy load
      const asks = getValue(orderBooks, `${marketID}.sell`);
      if (asks && Object.keys(asks).length) {
        positionsPlusAsks[marketID] = selectMarketPositionPlusAsks(address, positions[marketID], asks);
      } else {
        positionsPlusAsks[marketID] = positions[marketID];
      }
    }

    return positionsPlusAsks;
  }
);

/**
 * @param {String} marketID
 * @param {String} account
 * @param {Object} position
 * @param {Object} asks
 * @return {Object} Total number of shares in positions and open ask orders.
 */
export const selectMarketPositionPlusAsks = (account, position, asks) => {
  const positionPlusAsks = {};
  if (asks) {
    const adjustedOutcomes = Object.keys(position);
    const numAdjustedOutcomes = adjustedOutcomes.length;
    for (let j = 0; j < numAdjustedOutcomes; ++j) {
      positionPlusAsks[adjustedOutcomes[j]] = new BigNumber(position[adjustedOutcomes[j]], 10).plus(getOpenAskShares(account, adjustedOutcomes[j], asks)).toFixed();
    }
  }
  return positionPlusAsks;
};

/**
 * @param {String} outcomeID
 * @param {String} account
 * @param {Object} askOrders
 * @return {BigNumber} Total number of shares in open ask orders.
 */
export function getOpenAskShares(account, outcomeID, askOrders) {
  if (!account || !askOrders) return ZERO;
  let order;
  let askShares = ZERO;
  const orderIDs = Object.keys(askOrders);
  const numOrders = orderIDs.length;
  for (let i = 0; i < numOrders; ++i) {
    order = askOrders[orderIDs[i]];
    if (isOrderOfUser(order, account) && order.outcome === outcomeID) {
      askShares = askShares.plus(new BigNumber(order.amount, 10));
    }
  }
  return askShares;
}
