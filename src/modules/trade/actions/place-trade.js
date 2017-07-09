import { abi, augur, constants } from 'services/augurjs';
import { BUY, SELL } from 'modules/trade/constants/types';
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
  dispatch(tradeUntilAmountIsZero({
    _signer: loginAccount.privateKey,
    direction: tradeInProgress.side === BUY ? 1 : 2,
    market: marketID,
    outcome: outcomeID,
    fxpAmount: abi.fix(tradeInProgress.numShares, 'hex'),
    fxpPrice: abi.fix(limitPrice, 'hex'),
    tradeGroupID: tradeInProgress.tradeGroupID,
    onSent: () => callback(null, tradeInProgress.tradeGroupID),
    onFailed: callback
  }, doNotMakeOrders, (err) => {
    if (err) return callback(err);
    onComplete(err);
  }));
  dispatch(clearTradeInProgress(marketID));
};

export const tradeUntilAmountIsZero = (tradePayload, doNotMakeOrders, callback = logError) => (dispatch, getState) => {
  if (abi.unfix(tradePayload.fxpAmount).lte(constants.PRECISION.zero)) {
    return callback(null);
  }
  const payload = {
    ...tradePayload,
    onSuccess: (res) => {
      augur.trading.getTradeAmountRemaining({
        transactionHash: res.hash,
        tradeAmountRemainingEventSignature: getState().eventsAPI.TradeAmountRemaining.signature
      }, (err, fxpTradeAmountRemaining) => {
        if (err) return callback(err);
        dispatch(tradeUntilAmountIsZero({
          ...tradePayload,
          fxpAmount: fxpTradeAmountRemaining,
          onSent: noop
        }, doNotMakeOrders, callback));
      });
    }
  };
  if (doNotMakeOrders) {
    augur.api.Trade.publicTakeBestOrder(payload);
  } else {
    augur.api.Trade.publicTrade(payload);
  }
};
