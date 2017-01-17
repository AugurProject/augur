import BigNumber from 'bignumber.js';

import { updateTradesInProgress } from 'modules/trade/actions/update-trades-in-progress';
import { placeTrade } from 'modules/trade/actions/place-trade';
import { addClosePositionTradeGroup } from 'modules/my-positions/actions/add-close-position-trade-group';

import { BUY, SELL } from 'modules/trade/constants/types';
import { ZERO } from 'modules/trade/constants/numbers';

import getValue from 'utils/get-value';

export function closePosition(marketID, outcomeID) {
  return (dispatch, getState) => {
    const { accountPositions, orderBooks } = getState();

    const outcomeShares = new BigNumber(getValue(accountPositions, `${marketID}.${outcomeID}`) || 0);

    const bestFillParameters = getBestFillParameters(orderBooks, outcomeShares.toNumber() > 0 ? BUY : SELL, outcomeShares.absoluteValue(), marketID, outcomeID);

    dispatch(updateTradesInProgress(marketID, outcomeID, outcomeShares.toNumber() > 0 ? SELL : BUY, bestFillParameters.amountOfShares.toNumber(), bestFillParameters.bestPrice.toNumber(), null, () => {
      console.log('updateTradesInProgress success, submit trade');

      dispatch(placeTrade(marketID, outcomeID, true, (tradeGroupID) => {
        console.log('tradeGroupID -- ', tradeGroupID);

        dispatch(addClosePositionTradeGroup(marketID, outcomeID, tradeGroupID));
      }));
    }));
  };
}

function getBestFillParameters(orderBooks, side, shares, marketID, outcomeID) {
  let bestPrice = ZERO;
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
    bestPrice = new BigNumber(order.fullPrecisionPrice);

    if (amountOfShares.toNumber() >= shares.toNumber()) {
      return true;
    }

    return false;
  });

  return { amountOfShares, bestPrice };
}
