import { abi, augur } from 'services/augurjs';
import { clearTradeInProgress } from 'modules/trade/actions/update-trades-in-progress';

export const placeTrade = (marketID, outcomeID, tradeInProgress, doNotMakeOrders, cb) => (dispatch, getState) => {
  if (!marketID) return null;
  const { loginAccount, marketsData } = getState();
  const market = marketsData[marketID];
  if (!tradeInProgress || !market || outcomeID == null) {
    console.error(`trade-in-progress not found for market ${marketID} outcome ${outcomeID}`);
    return dispatch(clearTradeInProgress(marketID));
  }
  console.log('trade-in-progress:', tradeInProgress);
  const limitPrice = augur.trading.normalizePrice(market.minValue, market.maxValue, tradeInProgress.limitPrice);
  const tradePayload = {
    _signer: loginAccount.privateKey,
    market: marketID,
    outcome: outcomeID,
    fxpAmount: abi.fix(tradeInProgress.numShares, 'hex'),
    fxpLimitPrice: abi.fix(limitPrice, 'hex'),
    tradeGroupID: tradeInProgress.tradeGroupID,
    onSent: res => console.log('sent:', res),
    onSuccess: (res) => {
      console.log('success:', res);
      if (cb) cb();
    },
    onFailed: (err) => {
      console.error('failed:', err);
      if (cb) cb(err);
    }
  };
  if (doNotMakeOrders) {
    augur.api.Trade.publicTakeBestOrder({ ...tradePayload, type: tradeInProgress.side });
  } else if (tradeInProgress.side === BUY) {
    augur.api.Trade.publicBuy(tradePayload);
  } else if (tradeInProgress.side === SELL) {
    augur.api.Trade.publicSell(tradePayload);
  }
  dispatch(clearTradeInProgress(marketID));
};
