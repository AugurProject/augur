import { augur, abi } from 'services/augurjs';

import { updateMarketCreatorFees } from 'modules/my-markets/actions/update-market-creator-fees';

export function loadMarketCreatorFees(marketID) {
  return (dispatch) => {
    augur.api.CompositeGetters.getMarketCreatorFeesCollected({ market: marketID }, (fees) => {
      if (fees) {
        const marketFees = {};
        marketFees[marketID] = abi.bignum(fees);
        dispatch(updateMarketCreatorFees(marketFees));
      }
    });
  };
}
