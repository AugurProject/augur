import { augur } from 'services/augurjs';
import { BUY } from 'modules/transactions/constants/types';
import { clearTradeInProgress } from 'modules/trade/actions/update-trades-in-progress';
import convertDecimalToFixedPoint from 'utils/convert-decimal-to-fixed-point';
import logError from 'utils/log-error';

export const placeTrade = (marketID, outcomeID, tradeInProgress, doNotCreateOrders, callback = logError, onComplete = logError) => (dispatch, getState) => {
  if (!marketID) return null;
  const { loginAccount, marketsData } = getState();
  const market = marketsData[marketID];
  if (!tradeInProgress || !market || outcomeID == null) {
    console.error(`trade-in-progress not found for market ${marketID} outcome ${outcomeID}`);
    return dispatch(clearTradeInProgress(marketID));
  }
  const normalizedDecimalPrice = augur.trading.normalizePrice({ minPrice: market.minPrice, maxPrice: market.maxPrice, displayPrice: tradeInProgress.limitPrice });
  dispatch(augur.trading.tradeUntilAmountIsZero({
    _signer: loginAccount.privateKey,
    _direction: tradeInProgress.side === BUY ? 0 : 1,
    _market: marketID,
    _outcome: parseInt(outcomeID, 10),
    _amount: tradeInProgress.numShares,
    _price: convertDecimalToFixedPoint(normalizedDecimalPrice, market.numTicks),
    _tradeGroupID: tradeInProgress.tradeGroupID,
    doNotCreateOrders,
    onSent: () => callback(null, tradeInProgress.tradeGroupID),
    onFailed: callback
  }, (err) => {
    if (err) return callback(err);
    onComplete(err);
  }));
  dispatch(clearTradeInProgress(marketID));
};
