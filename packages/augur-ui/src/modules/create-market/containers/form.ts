import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { submitNewMarket } from "modules/markets/actions/submit-new-market";
import {
  updateNewMarket,
  clearNewMarket,
  removeAllOrdersFromNewMarket
} from "modules/markets/actions/update-new-market";
import Form from "modules/create-market/components/form";
import getValue from "utils/get-value";
import {
  MODAL_DISCARD,
  MODAL_CREATE_MARKET,
  ZERO,
  GSN_WALLET_SEEN,
  MODAL_INITIALIZE_ACCOUNT
} from "modules/common/constants";
import { addDraft, updateDraft } from "modules/create-market/actions/update-drafts";
import { updateModal } from "modules/modal/actions/update-modal";
import { NodeStyleCallback } from "modules/types";
import { marketCreationStarted, marketCreationSaved } from "services/analytics/helpers";
import { isGSNUnavailable } from "modules/app/selectors/is-gsn-unavailable";
import getValueFromlocalStorage from "utils/get-local-storage-value";
import { WALLET_STATUS } from "modules/app/actions/update-app-status";

const mapStateToProps = state => {
  const gsnWalletInfoSeen = getValueFromlocalStorage(GSN_WALLET_SEEN);

  return {
    newMarket: state.newMarket,
    currentTimestamp: getValue(state, "blockchain.currentAugurTimestamp"),
    drafts: state.drafts,
    needsApproval: state.loginAccount.allowance.lte(ZERO),
    GsnEnabled: state.appStatus.gsnEnabled,
    gsnUnavailable: isGSNUnavailable(state),
    gsnWalletInfoSeen,
    walletStatus: state.appStatus[WALLET_STATUS],
  }
}

const mapDispatchToProps = dispatch => ({
  initializeGsnWallet: (customAction = null) => dispatch(updateModal({ customAction, type: MODAL_INITIALIZE_ACCOUNT })),
  updateNewMarket: data => dispatch(updateNewMarket(data)),
  removeAllOrdersFromNewMarket: () => dispatch(removeAllOrdersFromNewMarket()),
  submitNewMarket: (data, cb) =>
    dispatch(submitNewMarket(data, cb)),
  addDraft: (key, data) => dispatch(addDraft(key, data)),
  clearNewMarket: () => dispatch(clearNewMarket()),
  updateDraft: (key, data) => dispatch(updateDraft(key, data)),
  discardModal: (cb: NodeStyleCallback) =>
    dispatch(updateModal({ type: MODAL_DISCARD, cb })),
  openCreateMarketModal: (cb: NodeStyleCallback) =>
    dispatch(updateModal({ type: MODAL_CREATE_MARKET, cb })),
  marketCreationStarted: (templateName, isTemplate) => dispatch(marketCreationStarted(templateName, isTemplate)),
  marketCreationSaved: (templateName, isTemplate) => dispatch(marketCreationSaved(templateName, isTemplate)),
});

const FormContainer = withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Form)
);

export default FormContainer;
