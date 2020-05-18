import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import MarketsInDispute from 'modules/reporting/components/markets-in-dispute';
import {
  loadCurrentlyDisputingMarkets,
  loadNextWindowDisputingMarkets,
} from 'modules/markets/actions/load-markets';
import { AppState } from 'appStore';
import { AppStatus } from 'modules/app/store/app-status';

const mapStateToProps = (state: AppState) => {
  const {
    loginAccount: { mixedCaseAddress: userAddress },
    isConnected,
  } = AppStatus.get();
  return {
    isConnected,
    userAddress,
  };
};

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
  connect(mapStateToProps, mapDispatchToProps, mergeProps)(MarketsInDispute)
);

export default Reporting;
