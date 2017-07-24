import { augur } from 'services/augurjs';
import { updateHasLoadedMarkets } from 'modules/markets/actions/update-has-loaded-markets';
import { updateMarketsData } from 'modules/markets/actions/update-markets-data';
import isObject from 'utils/is-object';

export const loadMarkets = branchID => (dispatch, getState) => {
  console.log('loadMarkets -- ', branchID);
  dispatch(updateHasLoadedMarkets(true));
  augur.markets.loadMarkets({
    branchID,
    chunkSize: 10,
    isDesc: true,
    loadZeroVolumeMarkets: getState().env.loadZeroVolumeMarkets
  }, (err, marketsData) => {
    if (err) {
      console.log('ERROR loadMarkets()', err);
      dispatch(updateHasLoadedMarkets(false));
    } else if (marketsData == null) {
      console.log('WARN loadMarkets()', 'no markets data returned');
      dispatch(updateHasLoadedMarkets(false));
    } else if (isObject(marketsData) && Object.keys(marketsData).length) {
      dispatch(updateMarketsData(marketsData));
    }
  });
};
