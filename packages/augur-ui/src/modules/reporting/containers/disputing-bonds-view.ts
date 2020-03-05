import { connect } from 'react-redux';
import { DisputingBondsView } from 'modules/reporting/common';
import { getGasPrice } from 'modules/auth/selectors/get-gas-price';

const mapStateToProps = state => {
  return {
    userAvailableRep: state.loginAccount.balances && state.loginAccount.balances.rep,
    GSN_ENABLED: state.appStatus.gsnEnabled,
    ethToDaiRate: state.appStatus.ethToDaiRate,
    gasPrice: getGasPrice(state),
  };
};

const mapDispatchToProps = dispatch => ({
});

const DisputingBondsViewContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(DisputingBondsView);

export default DisputingBondsViewContainer;
