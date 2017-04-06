import BigNumber from 'bignumber.js';
import { selectAccountPositions } from 'modules/user-open-orders/selectors/positions-plus-asks';
import { updateTradesInProgress } from 'modules/trade/actions/update-trades-in-progress';
import { placeTrade } from 'modules/trade/actions/place-trade';
import { addClosePositionTradeGroup } from 'modules/my-positions/actions/add-close-position-trade-group';
import { clearClosePositionOutcome } from 'modules/my-positions/actions/clear-close-position-outcome';

import { loadBidsAsks } from 'modules/bids-asks/actions/load-bids-asks';

import { BUY, SELL } from 'modules/trade/constants/types';
import { CLOSE_DIALOG_FAILED, CLOSE_DIALOG_NO_ORDERS } from 'modules/market/constants/close-dialog-status';
import { ZERO } from 'modules/trade/constants/numbers';
import { UPDATE_TRADE_COMMIT_LOCK } from 'modules/trade/actions/update-trade-commitment';

import getValue from 'utils/get-value';

export function closePosition(marketID, outcomeID) {
  return (dispatch, getState) => {
    // Lock trading + update close position status
    dispatch({
      type: UPDATE_TRADE_COMMIT_LOCK,
      isLocked: true
    });
    dispatch(addClosePositionTradeGroup(marketID, outcomeID, ''));

    // Load order book + execute trade if possible
    dispatch(loadBidsAsks(marketID, () => {
      const { orderBooks, accountPositions } = getState();
      const orderBook = orderBooks[marketID];

      const outcomeShares = new BigNumber(getValue(accountPositions, `${marketID}.${outcomeID}`) || 0);

      const bestFill = getBestFill(orderBook, outcomeShares.toNumber() > 0 ? BUY : SELL, outcomeShares.absoluteValue(), marketID, outcomeID);

      if (bestFill.amountOfShares.equals(ZERO)) {
        dispatch({
          type: UPDATE_TRADE_COMMIT_LOCK,
          isLocked: false
        });

        dispatch(clearClosePositionOutcome(marketID, outcomeID));
        dispatch(addClosePositionTradeGroup(marketID, outcomeID, CLOSE_DIALOG_NO_ORDERS));
      } else {
        dispatch(updateTradesInProgress(marketID, outcomeID, outcomeShares.toNumber() > 0 ? SELL : BUY, bestFill.amountOfShares.toNumber(), bestFill.price.toNumber(), null, () => {
          const { tradesInProgress } = getState();
          dispatch(placeTrade(marketID, outcomeID, tradesInProgress[marketID], true, (err, tradeGroupID) => {
            if (err) {
              console.error('placeTrade err -- ', err);

              dispatch({
                type: UPDATE_TRADE_COMMIT_LOCK,
                isLocked: false
              });
              dispatch(addClosePositionTradeGroup(marketID, outcomeID, CLOSE_DIALOG_FAILED));
            } else {
              dispatch(addClosePositionTradeGroup(marketID, outcomeID, tradeGroupID));
            }
          }));
        }));
      }
    }));
  };
}

export function getBestFill(orderBook, side, shares, marketID, outcomeID) {
  let price = ZERO;
  let amountOfShares = ZERO;

  Object.keys(orderBook[side] || {}).reduce((p, orderID) => {
    const orderOutcome = getValue(orderBook, `${side}.${orderID}`);

    if (orderOutcome.outcome === outcomeID) {
      p.push(orderOutcome);
    }

    return p;
  }, []).sort((a, b) => {
    const aBN = new BigNumber(a.fullPrecisionPrice);
    const bBN = new BigNumber(b.fullPrecisionPrice);
    if (side === BUY) {
      return bBN-aBN;
    }

    return aBN-bBN;
  }).find((order) => {
    amountOfShares = amountOfShares.plus(new BigNumber(order.fullPrecisionAmount));
    price = new BigNumber(order.fullPrecisionPrice);

    if (amountOfShares.toNumber() >= shares.toNumber()) {
      amountOfShares = shares;
      return true;
    }

    return false;
  });

  return { amountOfShares, price };
}
