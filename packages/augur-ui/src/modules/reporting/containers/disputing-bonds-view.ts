import { connect } from 'react-redux';
import { DisputingBondsView } from 'modules/reporting/common';
import getGasPrice from 'modules/auth/helpers/get-gas-price';
import { AppState } from 'appStore';
import {
  GSN_WALLET_SEEN,
  MODAL_INITIALIZE_ACCOUNT,
} from 'modules/common/constants';
import { isGSNUnavailable } from 'modules/app/selectors/is-gsn-unavailable';
import getValueFromlocalStorage from 'utils/get-local-storage-value';
import { AppStatus } from 'modules/app/store/app-status';

const mapStateToProps = (state: AppState) => {
  const gsnWalletInfoSeen = getValueFromlocalStorage(GSN_WALLET_SEEN);
  const {
    loginAccount: {
      balances: { rep: userAvailableRep },
    },
    universe: { warpSyncHash },
    gsnEnabled: GsnEnabled,
  } = AppStatus.get();
  return {
    warpSyncHash,
    userAvailableRep,
    GsnEnabled,
    gasPrice: getGasPrice(),
    gsnUnavailable: isGSNUnavailable(),
    gsnWalletInfoSeen,
  };
};

const mapDispatchToProps = dispatch => ({
  initializeGsnWallet: (customAction = null) =>
    AppStatus.actions.setModal({
      customAction,
      type: MODAL_INITIALIZE_ACCOUNT,
    }),
});

const DisputingBondsViewContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(DisputingBondsView);

export default DisputingBondsViewContainer;
