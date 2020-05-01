import { connect } from 'react-redux';
import { DisputingBondsView } from 'modules/reporting/common';
import getGasPrice from 'modules/auth/selectors/get-gas-price';
import { AppState } from 'appStore';
import { GSN_WALLET_SEEN, MODAL_INITIALIZE_ACCOUNT } from 'modules/common/constants';
import { isGSNUnavailable } from 'modules/app/selectors/is-gsn-unavailable';
import getValueFromlocalStorage from 'utils/get-local-storage-value';
import { AppStatusState, AppStatusActions } from 'modules/app/store/app-status';

const mapStateToProps = (state: AppState) => {
  const gsnWalletInfoSeen = getValueFromlocalStorage(GSN_WALLET_SEEN);
  const { gsnEnabled: GsnEnabled } = AppStatusState.get();
  return {
    warpSyncHash: state.universe.warpSyncHash,
    userAvailableRep: state.loginAccount.balances && state.loginAccount.balances.rep,
    GsnEnabled,
    gasPrice: getGasPrice(),
    gsnUnavailable: isGSNUnavailable(state),
    gsnWalletInfoSeen,
  };
};

const mapDispatchToProps = dispatch => ({
  initializeGsnWallet: (customAction = null) => AppStatusActions.actions.setModal({ customAction, type: MODAL_INITIALIZE_ACCOUNT }),
});

const DisputingBondsViewContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(DisputingBondsView);

export default DisputingBondsViewContainer;
