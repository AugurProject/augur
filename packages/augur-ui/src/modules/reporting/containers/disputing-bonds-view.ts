import { connect } from 'react-redux';
import { DisputingBondsView } from 'modules/reporting/common';
import { getGasPrice } from 'modules/auth/selectors/get-gas-price';
import { AppState } from 'store';

const mapStateToProps = (state: AppState) => {
  return {
    warpSyncHash: state.universe.warpSyncHash,
    userAvailableRep: state.loginAccount.balances && state.loginAccount.balances.rep,
    Gnosis_ENABLED: state.appStatus.gnosisEnabled,
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
