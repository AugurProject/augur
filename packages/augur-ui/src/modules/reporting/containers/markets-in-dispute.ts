import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import MarketsInDispute from 'modules/reporting/components/markets-in-dispute';
import { loadCurrentlyDisputingMarkets } from 'modules/markets/actions/load-markets';
import { disputingMarkets } from 'modules/markets/selectors/select-disputing-markets';

const mapStateToProps = state => {
  const markets = disputingMarkets(state);

  return {
    isConnected: state.connection.isConnected,
    address: state.loginAccount.mixedCaseAddress,
    markets,
  };
};

const mapDispatchToProps = dispatch => ({
  loadCurrentlyDisputingMarkets: (params, cb) =>
    dispatch(loadCurrentlyDisputingMarkets(params, cb)),
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
