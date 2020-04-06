import { connect } from 'react-redux';
import { DisputingBondsView } from 'modules/reporting/common';
import { getGasPrice } from 'modules/auth/selectors/get-gas-price';
import { AppState } from 'appStore';
import { GSN_WALLET_SEEN, MODAL_INITIALIZE_ACCOUNT } from 'modules/common/constants';
import { isGSNUnavailable } from 'modules/app/selectors/is-gsn-unavailable';
import { updateModal } from 'modules/modal/actions/update-modal';
import getValueFromlocalStorage from 'utils/get-local-storage-value';

const mapStateToProps = (state: AppState) => {
  const gsnWalletInfoSeen = getValueFromlocalStorage(GSN_WALLET_SEEN);

  return {
    warpSyncHash: state.universe.warpSyncHash,
    userAvailableRep: state.loginAccount.balances && state.loginAccount.balances.rep,
    GsnEnabled: state.appStatus.gsnEnabled,
    gasPrice: getGasPrice(state),
    gsnUnavailable: isGSNUnavailable(state),
    gsnWalletInfoSeen,
  };
};

const mapDispatchToProps = dispatch => ({
  initializeGsnWallet: (customAction = null) => dispatch(updateModal({ customAction, type: MODAL_INITIALIZE_ACCOUNT })),
});

const DisputingBondsViewContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(DisputingBondsView);

export default DisputingBondsViewContainer;
