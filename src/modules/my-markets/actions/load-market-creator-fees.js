import { augur } from 'services/augurjs';
import speedomatic from 'speedomatic';

import { updateMarketCreatorFees } from 'modules/my-markets/actions/update-market-creator-fees';

export function loadMarketCreatorFees(marketID) {
  return (dispatch) => {
    augur.api.CompositeGetters.getMarketCreatorFeesCollected({ market: marketID }, (fees) => {
      if (fees) {
        const marketFees = {};
        marketFees[marketID] = speedomatic.bignum(fees);
        dispatch(updateMarketCreatorFees(marketFees));
      }
    });
  };
}
