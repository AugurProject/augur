import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import MarketsInDispute from 'modules/reporting/components/markets-in-dispute';
import {
  loadCurrentlyDisputingMarkets,
  loadNextWindowDisputingMarkets,
} from 'modules/markets/actions/load-markets';
import { disputingMarkets } from 'modules/markets/selectors/select-reporting-markets';
import { AppState } from 'appStore';

const mapStateToProps = (state: AppState) => ({
  disputingMarketsMeta: state.reportingListState,
  isConnected: state.connection.isConnected,
  userAddress: state.loginAccount.mixedCaseAddress,
  markets: disputingMarkets(state),
});

const mapDispatchToProps = dispatch => ({
  loadCurrentlyDisputingMarkets: (params, cb) =>
    dispatch(loadCurrentlyDisputingMarkets(params, cb)),
  loadNextWindowDisputingMarkets: (params, cb) =>
    dispatch(loadNextWindowDisputingMarkets(params, cb)),
});

const mergeProps = (sP, dP, oP) => {
  return {
    ...oP,
    ...sP,
    ...dP,
  };
};

const Reporting = withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps
  )(MarketsInDispute)
);

export default Reporting;
