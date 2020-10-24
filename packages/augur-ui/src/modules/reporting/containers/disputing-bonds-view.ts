import { connect } from 'react-redux';
import { DisputingBondsView } from 'modules/reporting/common';
import { AppState } from 'appStore';

const mapStateToProps = (state: AppState) => {
  return {
    warpSyncHash: state.universe.warpSyncHash,
    userAvailableRep: state.loginAccount.balances && state.loginAccount.balances.rep,
    gasPrice: state.gasPriceInfo.userDefinedGasPrice || state.gasPriceInfo.average,
    ethToDaiRate: state.appStatus.ethToDaiRate,
    availableEthBalance: state.loginAccount.balances.eth,
  };
};

const DisputingBondsViewContainer = connect(
  mapStateToProps
)(DisputingBondsView);

export default DisputingBondsViewContainer;
