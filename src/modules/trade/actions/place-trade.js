import async from 'async';
import { augur, abi } from '../../../services/augurjs';
import { updateTradeCommitment, updateTradeCommitLock } from '../../trade/actions/update-trade-commitment';
import { clearTradeInProgress } from '../../trade/actions/update-trades-in-progress';

export const placeTrade = (marketID, outcomeID) => (dispatch, getState) => {
  if (!marketID) return null;
  const { loginAccount, marketsData, orderBooks, tradesInProgress } = getState();
  const market = marketsData[marketID];
  if (!tradesInProgress[marketID] || !market || outcomeID == null) {
    console.error(`trade-in-progress not found for ${marketID} ${outcomeID}`);
    return dispatch(clearTradeInProgress(marketID));
  }
  async.eachSeries(tradesInProgress[marketID], (tradeInProgress, nextTradeInProgress) => {
    if (!tradeInProgress.limitPrice || !tradeInProgress.numShares || !tradeInProgress.totalCost) {
      return nextTradeInProgress();
    }
    console.log('tradeInProgress:', tradeInProgress);
    const tradeGroupID = augur.placeTrade(
      market,
      outcomeID,
      tradeInProgress.side,
      tradeInProgress.numShares,
      tradeInProgress.limitPrice,
      tradeInProgress.tradingFeesEth,
      loginAccount.address,
      abi.bignum(tradeInProgress.totalCost).abs().toFixed(),
      orderBooks,
      data => dispatch(updateTradeCommitment(data)),
      isLocked => dispatch(updateTradeCommitLock(isLocked)),
      nextTradeInProgress
    );
    console.log('tradeGroupID:', tradeGroupID);
  }, (err) => {
    if (err) console.error('place trade:', err);
    dispatch(clearTradeInProgress(marketID));
  });
};
