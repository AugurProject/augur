import { augur } from '../../../services/augurjs';
import { updateTradeCommitment, updateTradeCommitLock } from '../../trade/actions/update-trade-commitment';
import { clearTradeInProgress } from '../../trade/actions/update-trades-in-progress';

export const placeTrade = (marketID, outcomeID, trades, doNotMakeOrders, cb) => (dispatch, getState) => {
  if (!marketID) return null;
  const { loginAccount, marketsData } = getState();
  const market = marketsData[marketID];

  if (!trades || !market || outcomeID == null) {
    console.error(`trade-in-progress not found for ${marketID} ${outcomeID}`);
    return dispatch(clearTradeInProgress(marketID));
  }
  const tradeGroupID = augur.trading.group.executeTradingActions(
    { _signer: loginAccount.privateKey },
    market,
    outcomeID,
    loginAccount.address,
    () => getState().orderBooks,
    doNotMakeOrders,
    trades,
    data => dispatch(updateTradeCommitment(data)),
    isLocked => dispatch(updateTradeCommitLock(isLocked)),
    (err, tradeGroupID) => {
      if (err) console.error('place trade:', err, marketID, tradeGroupID);
      cb && cb(err, tradeGroupID);
    }
  );
  dispatch(clearTradeInProgress(marketID));
  cb && cb(null, tradeGroupID);
};
