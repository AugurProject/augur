import BigNumber from 'bignumber.js';
import { augur, abi, constants } from 'services/augurjs';
import { BUY, SELL } from 'modules/trade/constants/types';
import { TWO } from 'modules/trade/constants/numbers';
import { SCALAR } from 'modules/markets/constants/market-types';

import { selectAggregateOrderBook, selectTopBid, selectTopAsk } from 'modules/bids-asks/helpers/select-order-book';
import { selectMarket } from 'modules/market/selectors/market';

export const UPDATE_TRADE_IN_PROGRESS = 'UPDATE_TRADE_IN_PROGRESS';
export const CLEAR_TRADE_IN_PROGRESS = 'CLEAR_TRADE_IN_PROGRESS';

// Updates user's trade. Only defined (i.e. !== null) parameters are updated
export function updateTradesInProgress(marketID, outcomeID, side, numShares, limitPrice, maxCost, cb) {
  return (dispatch, getState) => {
    const { tradesInProgress, marketsData, loginAccount, orderBooks, orderCancellation } = getState();
    const outcomeTradeInProgress = (tradesInProgress && tradesInProgress[marketID] && tradesInProgress[marketID][outcomeID]) || {};
    const market = marketsData[marketID];
    // if nothing changed, exit
    if (!market || (outcomeTradeInProgress.numShares === numShares && outcomeTradeInProgress.limitPrice === limitPrice && outcomeTradeInProgress.side === side && outcomeTradeInProgress.totalCost === maxCost)) {
      return;
    }

    // if new side not provided, use old side
    const cleanSide = side || outcomeTradeInProgress.side;

    if ((numShares === '' || parseFloat(numShares) === 0) && limitPrice === null) { // numShares cleared
      return dispatch({
        type: UPDATE_TRADE_IN_PROGRESS,
        data: {
          marketID,
          outcomeID,
          details: {
            side: cleanSide,
            numShares: '',
            limitPrice: outcomeTradeInProgress.limitPrice
          }
        }
      });
    }

    if ((limitPrice === '' || (parseFloat(limitPrice) === 0 && market.type !== SCALAR)) && numShares === null) { // limitPrice cleared
      return dispatch({
        type: UPDATE_TRADE_IN_PROGRESS,
        data: {
          marketID,
          outcomeID,
          details: {
            side: cleanSide,
            limitPrice: '',
            numShares: outcomeTradeInProgress.numShares,
          }
        }
      });
    }

    // find top order to default limit price to
    const marketOrderBook = selectAggregateOrderBook(outcomeID, orderBooks[marketID], orderCancellation);
    const defaultPrice = market.type === SCALAR ?
      abi.bignum(market.maxValue)
        .plus(abi.bignum(market.minValue))
        .dividedBy(TWO)
        .toFixed() :
      '0.5';
    const topOrderPrice = cleanSide === BUY ?
      ((selectTopAsk(marketOrderBook, true) || {}).price || {}).formattedValue || defaultPrice :
      ((selectTopBid(marketOrderBook, true) || {}).price || {}).formattedValue || defaultPrice;

    const bignumShares = abi.bignum(numShares);
    const bignumLimit = abi.bignum(limitPrice);
    // clean num shares
    const cleanNumShares = numShares && bignumShares.toFixed() === '0' ? '0' : (numShares && bignumShares.abs().toFixed()) || outcomeTradeInProgress.numShares || '0';

    // if current trade order limitPrice is equal to the best price, make sure it's equal to that; otherwise, use what the user has entered
    let cleanLimitPrice;
    const topAskPrice = ((selectTopAsk(marketOrderBook, true) || {}).price || {}).formattedValue || defaultPrice;
    const topBidPrice = ((selectTopBid(marketOrderBook, true) || {}).price || {}).formattedValue || defaultPrice;

    if (limitPrice && bignumLimit.toFixed() === '0') {
      cleanLimitPrice = '0';
    } else if (limitPrice && bignumLimit.toFixed()) {
      cleanLimitPrice = bignumLimit.toFixed();
    } else if (cleanSide === BUY && outcomeTradeInProgress.limitPrice === topBidPrice) {
      cleanLimitPrice = topAskPrice;
    } else if (cleanSide === SELL && outcomeTradeInProgress.limitPrice === topAskPrice) {
      cleanLimitPrice = topBidPrice;
    } else {
      cleanLimitPrice = outcomeTradeInProgress.limitPrice;
    }

    if (cleanNumShares && !cleanLimitPrice && (market.type === SCALAR || cleanLimitPrice !== '0')) {
      cleanLimitPrice = topOrderPrice;
    }

    // if this isn't a scalar market, limitPrice must be positive.
    if (market.type !== SCALAR && limitPrice) {
      cleanLimitPrice = bignumLimit.abs().toFixed() || outcomeTradeInProgress.limitPrice || topOrderPrice;
    }

    const newTradeDetails = {
      side: cleanSide,
      numShares: cleanNumShares === '0' ? undefined : cleanNumShares,
      limitPrice: cleanLimitPrice,
      totalFee: 0,
      totalCost: 0
    };

    // trade actions
    if (newTradeDetails.side && newTradeDetails.numShares && loginAccount.address) {
      const market = selectMarket(marketID);
      augur.api.Markets.getParticipantSharesPurchased({
        market: marketID,
        trader: loginAccount.address,
        outcome: outcomeID
      }, (sharesPurchased) => {
        if (!sharesPurchased || sharesPurchased.error) {
          console.error('getParticipantSharesPurchased:', sharesPurchased);
          return dispatch({
            type: UPDATE_TRADE_IN_PROGRESS,
            data: { marketID, outcomeID, details: newTradeDetails }
          });
        }
        const position = abi.bignum(sharesPurchased).round(constants.PRECISION.decimals, BigNumber.ROUND_DOWN);
        // type, orderShares, orderLimitPrice, takerFee, makerFee, userAddress, userPositionShares, outcomeID, range, marketOrderBook, scalarMinMax
        const tradingActions = augur.trading.simulation.getTradingActions({
          type: newTradeDetails.side,
          orderShares: newTradeDetails.numShares,
          orderLimitPrice: newTradeDetails.limitPrice,
          takerFee: (market && market.takerFee) || 0,
          makerFee: (market && market.makerFee) || 0,
          userAddress: loginAccount.address,
          userPositionShares: position && position.toFixed(),
          outcomeID,
          range: market.cumulativeScale,
          marketOrderBook: (orderBooks && orderBooks[marketID]) || {},
          scalarMinMax: (market.type === SCALAR) ? {
            minValue: market.minValue,
            maxValue: market.maxValue
          } : null
        });
        console.log('trading actions:', JSON.stringify(tradingActions, null, 2));
        dispatch({
          type: UPDATE_TRADE_IN_PROGRESS,
          data: { marketID, outcomeID, details: tradingActions }
        });
        cb && cb(tradingActions);
      });
    } else {
      dispatch({
        type: UPDATE_TRADE_IN_PROGRESS,
        data: { marketID, outcomeID, details: newTradeDetails }
      });
      cb && cb();
    }
  };
}

export function clearTradeInProgress(marketID) {
  return { type: CLEAR_TRADE_IN_PROGRESS, marketID };
}
