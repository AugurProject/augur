import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { submitNewMarket } from "modules/markets/actions/submit-new-market";
import {
  addOrderToNewMarket,
  removeOrderFromNewMarket,
  updateNewMarket,
  clearNewMarket
} from "modules/markets/actions/update-new-market";
import Form from "modules/create-market/components/form";
import getValue from "utils/get-value";
import {
  MODAL_DISCARD,
  MODAL_CREATE_MARKET
} from "modules/common/constants";
import { addDraft, updateDraft } from "modules/create-market/actions/update-drafts";
import { updateModal } from "modules/modal/actions/update-modal";

const mapStateToProps = state => ({
  newMarket: state.newMarket,
  currentTimestamp: getValue(state, "blockchain.currentAugurTimestamp"),
  drafts: state.drafts,
});

const mapDispatchToProps = dispatch => ({
  updateNewMarket: data => dispatch(updateNewMarket(data)),
  submitNewMarket: (data, history, cb) =>
    dispatch(submitNewMarket(data, history, cb)),
  addDraft: (key, data) => dispatch(addDraft(key, data)),
  clearNewMarket: () => dispatch(clearNewMarket()),
  updateDraft: (key, data) => dispatch(updateDraft(key, data)),
  discardModal: (cb: NodeStyleCallback) =>
    dispatch(updateModal({ type: MODAL_DISCARD, cb })),
  openCreateMarketModal: (cb: NodeStyleCallback) =>
    dispatch(updateModal({ type: MODAL_CREATE_MARKET, cb })),
});

const FormContainer = withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Form)
);

export default FormContainer;
