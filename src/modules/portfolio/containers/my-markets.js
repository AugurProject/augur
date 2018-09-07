import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import MyMarkets from "modules/portfolio/components/markets/markets";
import getUserMarkets from "modules/markets/selectors/user-markets";
import { toggleFavorite } from "modules/markets/actions/update-favorites";
import { loadUserMarkets } from "modules/markets/actions/load-markets";
import { loadUnclaimedFees } from "modules/markets/actions/load-unclaimed-fees";
import { loadMarketsInfo } from "modules/markets/actions/load-markets-info";
import { collectMarketCreatorFees } from "modules/markets/actions/collect-market-creator-fees";
import { loadMarketsInfoIfNotLoaded } from "modules/markets/actions/load-markets-info-if-not-loaded";
import logError from "utils/log-error";

const mapStateToProps = state =>
  // getMyMarkets or it's equivalent will need a way of calculating the outstanding returns for a market and attaching it to each market object. Currently I've just added a key/value pair to the market objects im using below.
  ({
    isLogged: state.isLogged,
    myMarkets: getUserMarkets(),
    transactionsLoading: state.transactionsLoading,
    isMobile: state.isMobile,
    pendingLiquidityOrders: state.pendingLiquidityOrders,
    hasAllTransactionsLoaded:
      state.transactionsOldestLoadedBlock ===
      state.loginAccount.registerBlockNumber // FIXME
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
    dispatch(loadMarketsInfoIfNotLoaded(marketIds))
});

const MyMarketsContainer = withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(MyMarkets)
);

export default MyMarketsContainer;
