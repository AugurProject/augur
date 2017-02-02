import BigNumber from 'bignumber.js';

import { updateTradesInProgress } from 'modules/trade/actions/update-trades-in-progress';
import { placeTrade } from 'modules/trade/actions/place-trade';
import { addClosePositionTradeGroup } from 'modules/my-positions/actions/add-close-position-trade-group';

import { BUY, SELL } from 'modules/trade/constants/types';
import { CLOSE_DIALOG_FAILED } from 'modules/market/constants/close-dialog-status';
import { ZERO } from 'modules/trade/constants/numbers';

import getValue from 'utils/get-value';

export function closePosition(marketID, outcomeID) {
  return (dispatch, getState) => {
    const { accountPositions, orderBooks } = getState();

    const outcomeShares = new BigNumber(getValue(accountPositions, `${marketID}.${outcomeID}`) || 0);
    const bestFill = getBestFill(orderBooks, outcomeShares.toNumber() > 0 ? BUY : SELL, outcomeShares.absoluteValue(), marketID, outcomeID);

    dispatch(updateTradesInProgress(marketID, outcomeID, outcomeShares.toNumber() > 0 ? SELL : BUY, bestFill.amountOfShares.toNumber(), bestFill.price.toNumber(), null, () => {
      dispatch(placeTrade(marketID, outcomeID, true, (err, tradeGroupID) => {
        if (err) {
          console.error('placeTrade err -- ', err);

          dispatch(addClosePositionTradeGroup(marketID, outcomeID, CLOSE_DIALOG_FAILED));
        } else {
          dispatch(addClosePositionTradeGroup(marketID, outcomeID, tradeGroupID));
        }
      }));
    }));
  };
}

export function getBestFill(orderBooks, side, shares, marketID, outcomeID) {
  let price = ZERO;
  let amountOfShares = ZERO;

  Object.keys((getValue(orderBooks, `${marketID}.${side}`) || {})).reduce((p, orderID) => {
    const orderOutcome = getValue(orderBooks, `${marketID}.${side}.${orderID}`);

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
    amountOfShares = amountOfShares.plus(new BigNumber(order.amount));
    price = new BigNumber(order.fullPrecisionPrice);

    if (amountOfShares.toNumber() >= shares.toNumber()) {
      amountOfShares = shares;
      return true;
    }

    return false;
  });

  return { amountOfShares, price };
}
