import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import MyMarkets from 'modules/portfolio/components/markets/markets';
import { selectAuthorOwnedMarkets } from 'modules/markets/selectors/user-markets';
import { removePendingData } from 'modules/pending-queue/actions/pending-queue-management';
import { CREATE_MARKET } from 'modules/common/constants';
import { collectMarketCreatorFees } from 'modules/markets/actions/market-creator-fees-management';
import { retrySubmitMarket } from 'modules/markets/actions/submit-new-market';
import { AppState } from 'appStore';
import { AppStatus } from 'modules/app/store/app-status';

const mapStateToProps = (state: AppState) => {
  const createdMarkets = selectAuthorOwnedMarkets(state);
  const { universe: { disputeWindow } } = AppStatus.get();
  // getMyMarkets or it's equivalent will need a way of calculating the outstanding returns for a market and attaching it to each market object. Currently I've just added a key/value pair to the market objects im using below.
  return {
    myMarkets: createdMarkets,
    outcomes: {}, // marketDisputeOutcomes() || {},
    disputingWindowEndTime: disputeWindow?.endTime || 0,
  };
};
// TODO confirm with Tom whats up with this, getBalance Only
const mapDispatchToProps = dispatch => ({
  removePendingMarket: id => dispatch(removePendingData(id, CREATE_MARKET)),
  retrySubmitMarket: data => dispatch(retrySubmitMarket(data)),
  collectMarketCreatorFees: (getBalanceOnly, marketId) =>
    dispatch(collectMarketCreatorFees(getBalanceOnly, marketId)),
});

const MyMarketsContainer = withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(MyMarkets)
);

export default MyMarketsContainer;
