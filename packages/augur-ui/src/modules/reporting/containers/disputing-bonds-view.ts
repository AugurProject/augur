import { connect } from 'react-redux';
import { DisputingBondsView } from 'modules/reporting/common';
import { getGasPrice } from 'modules/auth/selectors/get-gas-price';
import { AppState } from 'appStore';

const mapStateToProps = (state: AppState) => {

  return {
    warpSyncHash: state.universe.warpSyncHash,
    userAvailableRep: state.loginAccount.balances && state.loginAccount.balances.rep,
    gasPrice: getGasPrice(state),
  };
};

const DisputingBondsViewContainer = connect(
  mapStateToProps
)(DisputingBondsView);

export default DisputingBondsViewContainer;
