import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import MigrateRepView from "modules/forking/components/migrate-rep/migrate-rep";
import { loadFullMarket } from "modules/markets/actions/load-full-market";
import { MARKET_ID_PARAM_NAME } from "modules/routes/constants/param-names";
import { selectMarket } from "modules/markets/selectors/market";
import parseQuery from "modules/routes/helpers/parse-query";
import getValue from "utils/get-value";
import { getGasPrice } from "modules/auth/selectors/get-gas-price";

import { submitMigrateREP } from "modules/forking/actions/submit-migrate-rep";
import { getForkMigrationTotals } from "modules/forking/actions/get-fork-migration-totals";

const mapStateToProps = state => ({
  isLogged: state.authStatus.isLogged,
  isConnected: state.connection.isConnected,
  universe: state.universe.id,
  marketsData: state.marketsData,
  isMobile: state.appStatus.isMobile,
  accountREP: state.loginAccount.rep,
  currentBlockNumber: state.blockchain.currentBlockNumber,
  gasPrice: getGasPrice(state)
});

const mapDispatchToProps = dispatch => ({
  loadFullMarket: marketId => dispatch(loadFullMarket(marketId)),
  submitMigrateREP: ({
    estimateGas,
    marketId,
    selectedOutcome,
    invalid,
    amount,
    history,
    callback
  }) =>
    dispatch(
      submitMigrateREP({
        estimateGas,
        marketId,
        selectedOutcome,
        invalid,
        amount,
        history,
        callback
      })
    ),
  getForkMigrationTotals: (universe, callback) =>
    dispatch(getForkMigrationTotals(universe, callback))
});

const mergeProps = (sP, dP, oP) => {
  const marketId = parseQuery(oP.location.search)[MARKET_ID_PARAM_NAME];
  const market = selectMarket(marketId);

  return {
    ...oP,
    ...sP,
    marketId,
    isLogged: sP.isLogged,
    isConnected: sP.isConnected && getValue(sP, "universe.id") != null,
    isMarketLoaded: sP.marketsData[marketId] != null,
    market,
    loadFullMarket: () => dP.loadFullMarket(marketId),
    submitMigrateREP: ({
      estimateGas,
      marketId,
      selectedOutcome,
      invalid,
      amount,
      history,
      callback
    }) =>
      dP.submitMigrateREP({
        estimateGas,
        marketId,
        selectedOutcome,
        invalid,
        amount,
        history,
        callback
      }),
    getForkMigrationTotals: callback =>
      dP.getForkMigrationTotals(sP.universe, callback)
  };
};

const MigrateRep = withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps
  )(MigrateRepView)
);

export default MigrateRep;
