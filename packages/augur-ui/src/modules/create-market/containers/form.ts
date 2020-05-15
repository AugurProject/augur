import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { submitNewMarket } from "modules/markets/actions/submit-new-market";
import {
  updateNewMarket,
  clearNewMarket,
  removeAllOrdersFromNewMarket
} from "modules/markets/actions/update-new-market";
import Form from "modules/create-market/components/form";
import {
  MODAL_DISCARD,
  MODAL_CREATE_MARKET,
  ZERO,
  GSN_WALLET_SEEN,
  MODAL_INITIALIZE_ACCOUNT
} from "modules/common/constants";
import { NodeStyleCallback } from "modules/types";
import { marketCreationStarted, marketCreationSaved } from "services/analytics/helpers";
import { isGSNUnavailable } from "modules/app/selectors/is-gsn-unavailable";
import getValueFromlocalStorage from "utils/get-local-storage-value";
import { AppStatus } from "modules/app/store/app-status";

const mapStateToProps = state => {
  const gsnWalletInfoSeen = getValueFromlocalStorage(GSN_WALLET_SEEN);
  const { drafts, loginAccount: { allowance }, gsnEnabled: GsnEnabled, blockchain: { currentAugurTimestamp: currentTimestamp }, walletStatus } = AppStatus.get();

  return {
    newMarket: state.newMarket,
    currentTimestamp,
    drafts,
    needsApproval: allowance.lte(ZERO),
    GsnEnabled,
    gsnUnavailable: isGSNUnavailable(state),
    gsnWalletInfoSeen,
    walletStatus,
  }
}

const mapDispatchToProps = dispatch => {
  const { setModal, addUpdateDraft } = AppStatus.actions;
  return ({
    initializeGsnWallet: (customAction = null) => setModal({ customAction, type: MODAL_INITIALIZE_ACCOUNT }),
    updateNewMarket: data => dispatch(updateNewMarket(data)),
    removeAllOrdersFromNewMarket: () => dispatch(removeAllOrdersFromNewMarket()),
    submitNewMarket: (data, cb) =>
      dispatch(submitNewMarket(data, cb)),
    addUpdateDraft: (key, data) => addUpdateDraft(key, data),
    clearNewMarket: () => dispatch(clearNewMarket()),
    discardModal: (cb: NodeStyleCallback) =>
      setModal({ type: MODAL_DISCARD, cb }),
    openCreateMarketModal: (cb: NodeStyleCallback) =>
      setModal({ type: MODAL_CREATE_MARKET, cb }),
    marketCreationStarted: (templateName, isTemplate) => dispatch(marketCreationStarted(templateName, isTemplate)),
    marketCreationSaved: (templateName, isTemplate) => dispatch(marketCreationSaved(templateName, isTemplate)),
  });
}
const FormContainer = withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Form)
);

export default FormContainer;
