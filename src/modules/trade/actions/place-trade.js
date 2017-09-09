import speedomatic from 'speedomatic';
import { augur, constants } from 'services/augurjs';
import { BUY } from 'modules/transactions/constants/types';
import { clearTradeInProgress } from 'modules/trade/actions/update-trades-in-progress';
import noop from 'utils/noop';
import logError from 'utils/log-error';

export const placeTrade = (marketID, outcomeID, tradeInProgress, doNotMakeOrders, callback = logError, onComplete = logError) => (dispatch, getState) => {
  if (!marketID) return null;
  const { loginAccount, marketsData } = getState();
  const market = marketsData[marketID];
  if (!tradeInProgress || !market || outcomeID == null) {
    console.error(`trade-in-progress not found for market ${marketID} outcome ${outcomeID}`);
    return dispatch(clearTradeInProgress(marketID));
  }
  const limitPrice = augur.trading.normalizePrice(market.minValue, market.maxValue, tradeInProgress.limitPrice);
  dispatch(augur.trading.tradeUntilAmountIsZero({
    _signer: loginAccount.privateKey,
    _direction: tradeInProgress.side === BUY ? 1 : 2,
    _market: marketID,
    _outcome: outcomeID,
    _fxpAmount: speedomatic.fix(tradeInProgress.numShares, 'hex'),
    _fxpPrice: speedomatic.fix(limitPrice, 'hex'),
    _tradeGroupID: tradeInProgress.tradeGroupID,
    doNotMakeOrders,
    onSent: () => callback(null, tradeInProgress.tradeGroupID),
    onFailed: callback
  }, (err) => {
    if (err) return callback(err);
    onComplete(err);
  }));
  dispatch(clearTradeInProgress(marketID));
};
