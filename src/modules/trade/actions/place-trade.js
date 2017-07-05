import { abi, augur } from 'services/augurjs';
import { BUY, SELL } from 'modules/trade/constants/types';
import { clearTradeInProgress } from 'modules/trade/actions/update-trades-in-progress';
import noop from 'utils/noop';
import logError from 'utils/log-error';

export const placeTrade = (marketID, outcomeID, tradeInProgress, doNotMakeOrders, callback = logError) => (dispatch, getState) => {
  if (!marketID) return null;
  const { loginAccount, marketsData } = getState();
  const market = marketsData[marketID];
  if (!tradeInProgress || !market || outcomeID == null) {
    console.error(`trade-in-progress not found for market ${marketID} outcome ${outcomeID}`);
    return dispatch(clearTradeInProgress(marketID));
  }
  const limitPrice = augur.trading.normalizePrice(market.minValue, market.maxValue, tradeInProgress.limitPrice);
  const tradePayload = {
    _signer: loginAccount.privateKey,
    market: marketID,
    outcome: outcomeID,
    fxpAmount: abi.fix(tradeInProgress.numShares, 'hex'),
    fxpPrice: abi.fix(limitPrice, 'hex'),
    tradeGroupID: tradeInProgress.tradeGroupID,
    onSent: noop,
    onSuccess: () => callback(null),
    onFailed: callback
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
