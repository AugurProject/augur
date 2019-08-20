import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import MyMarkets from "modules/portfolio/components/markets/markets";
import { selectAuthorOwnedMarkets } from "modules/markets/selectors/user-markets";
import { removePendingData } from 'modules/pending-queue/actions/pending-queue-management';
import { CREATE_MARKET } from 'modules/common/constants';
import { collectMarketCreatorFees } from "modules/markets/actions/market-creator-fees-management";
import { createMarketRetry } from "modules/contracts/actions/contractCalls";

const mapStateToProps = (state) => {
  const createdMarkets = selectAuthorOwnedMarkets(state);

  // getMyMarkets or it's equivalent will need a way of calculating the outstanding returns for a market and attaching it to each market object. Currently I've just added a key/value pair to the market objects im using below.
  return {
    isLogged: state.authStatus.isLogged,
    myMarkets: createdMarkets,
    outcomes: {}, // marketDisputeOutcomes() || {},
    currentAugurTimestamp: state.blockchain.currentAugurTimestamp,
    reportingWindowStatsEndTime: state.reportingWindowStats.endTime,
  };
};
// TOJDO confirm with TOm whats up with this, getBalance Only
const mapDispatchToProps = (dispatch) => ({
  removePendingMarket: (id) => dispatch(removePendingData(id, CREATE_MARKET)),
  createMarketRetry: (data) => dispatch(createMarketRetry(data)),
  collectMarketCreatorFees: (getBalanceOnly, marketId, callback) =>
    dispatch(collectMarketCreatorFees(getBalanceOnly, marketId, callback)),
});

const MyMarketsContainer = withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(MyMarkets),
);

export default MyMarketsContainer;
