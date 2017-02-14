import { augur } from 'services/augurjs';

import { updateHasLoadedMarkets } from 'modules/markets/actions/update-has-loaded-markets';
import { updateMarketsData } from 'modules/markets/actions/update-markets-data';

export function loadMarkets(branchID) {
  const chunkSize = 10;
  return (dispatch) => {
    dispatch(updateHasLoadedMarkets(true));

    augur.loadMarkets(branchID, chunkSize, true, (err, marketsData) => {
      if (err) {
        console.log('ERROR loadMarkets()', err);
        dispatch(updateHasLoadedMarkets(false));
        return;
      }
      if (!marketsData) {
        console.log('WARN loadMarkets()', 'no markets data returned');
        dispatch(updateHasLoadedMarkets(false));
        return;
      }
      if (marketsData.constructor === Object && Object.keys(marketsData).length) {
        dispatch(updateMarketsData(marketsData));
      }
    });
  };
}
