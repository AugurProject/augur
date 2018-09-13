import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import MyMarkets from "modules/portfolio/components/markets/markets";
import getUserMarkets from "modules/markets/selectors/user-markets";
import { toggleFavorite } from "modules/markets/actions/update-favorites";
import { loadUserMarkets } from "modules/markets/actions/load-markets";
import {
  loadUnclaimedFees,
  collectMarketCreatorFees
} from "modules/markets/actions/market-creator-fees-management";
import {
  loadMarketsInfo,
  loadMarketsInfoIfNotLoaded
} from "modules/markets/actions/load-markets-info";
import logError from "utils/log-error";
import marketDisputeOutcomes from "modules/reports/selectors/select-market-dispute-outcomes";
import { loadDisputing } from "modules/reports/actions/load-disputing";

const mapStateToProps = state =>
  // getMyMarkets or it's equivalent will need a way of calculating the outstanding returns for a market and attaching it to each market object. Currently I've just added a key/value pair to the market objects im using below.
  ({
    isLogged: state.authStatus.isLogged,
    myMarkets: getUserMarkets(),
    transactionsLoading: state.appStatus.transactionsLoading,
    isMobile: state.appStatus.isMobile,
    pendingLiquidityOrders: state.pendingLiquidityOrders,
    outcomes: marketDisputeOutcomes() || {}
  });

const mapDispatchToProps = dispatch => ({
  loadMarkets: () =>
    dispatch(
      loadUserMarkets((err, marketIds) => {
        if (err) return logError(err);
        // if we have marketIds back, let's load the info so that we can properly display myMarkets.
        dispatch(loadMarketsInfoIfNotLoaded(marketIds));
        dispatch(loadUnclaimedFees(marketIds));
      })
    ),
  collectMarketCreatorFees: (getBalanceOnly, marketId, callback) =>
    dispatch(collectMarketCreatorFees(getBalanceOnly, marketId, callback)),
  loadMarketsInfo: marketIds => dispatch(loadMarketsInfo(marketIds)),
  toggleFavorite: marketId => dispatch(toggleFavorite(marketId)),
  loadMarketsInfoIfNotLoaded: marketIds =>
    dispatch(loadMarketsInfoIfNotLoaded(marketIds)),
  loadDisputingMarkets: () => dispatch(loadDisputing())
});

const MyMarketsContainer = withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(MyMarkets)
);

export default MyMarketsContainer;
