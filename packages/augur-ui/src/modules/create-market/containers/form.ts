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
} from "modules/common/constants";
import { addDraft, updateDraft } from "modules/create-market/actions/update-drafts";
import { updateModal } from "modules/modal/actions/update-modal";
import { NodeStyleCallback } from "modules/types";
import { marketCreationStarted, marketCreationSaved } from "services/analytics/helpers";
import getValueFromlocalStorage from "utils/get-local-storage-value";
import { WALLET_STATUS } from "modules/app/actions/update-app-status";
import { AppState } from "appStore/index";

const mapStateToProps = (state: AppState) => {

  return {
    newMarket: state.newMarket,
    currentTimestamp: getValue(state, "blockchain.currentAugurTimestamp"),
    drafts: state.drafts,
    walletStatus: state.appStatus[WALLET_STATUS],
    availableEth: state.loginAccount.balances.eth,
    gasPrice: state.gasPriceInfo.userDefinedGasPrice || state.gasPriceInfo.average,
  }
}

const mapDispatchToProps = dispatch => ({
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
