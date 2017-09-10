import BigNumber from 'bignumber.js';
import { augur } from 'services/augurjs';
import { updateMarketCreatorFees } from 'modules/my-markets/actions/update-market-creator-fees';

export function loadMarketCreatorFees(marketID) {
  return (dispatch) => {
    augur.api.CompositeGetters.getMarketCreatorFeesCollected({ _market: marketID }, (err, fees) => {
      if (fees) {
        const marketFees = {};
        marketFees[marketID] = new BigNumber(fees, 16);
        dispatch(updateMarketCreatorFees(marketFees));
      }
    });
  };
}
