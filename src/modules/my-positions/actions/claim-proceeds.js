import async from 'async';
import { augur } from '../../../services/augurjs';
import { updateAssets } from '../../auth/actions/update-assets';
import { loadAccountTrades } from '../../my-positions/actions/load-account-trades';
import { loadMarketsInfo } from '../../markets/actions/load-markets-info';
import { cancelOpenOrdersInClosedMarkets } from '../../user-open-orders/actions/cancel-open-orders-in-closed-markets';
import selectWinningPositions from '../../my-positions/selectors/winning-positions';

export const claimProceeds = () => (dispatch, getState) => {
  const { branch, loginAccount } = getState();
  if (loginAccount.address) {
    const winningPositions = selectWinningPositions();
    console.log('closed markets with winning shares:', winningPositions);
    if (winningPositions.length) {
      augur.claimMarketsProceeds(branch.id, winningPositions, (err, claimedMarkets) => {
        if (err) console.error('claimMarketsProceeds failed:', err);
        dispatch(updateAssets());
        async.each(claimedMarkets, (marketID, nextMarket) => (
          dispatch(loadMarketsInfo([marketID], () => (
            dispatch(loadAccountTrades(marketID, null, () => nextMarket()))
          )))
        ), err => err && console.error(err));
      });
    }
    dispatch(cancelOpenOrdersInClosedMarkets());
  }
};
