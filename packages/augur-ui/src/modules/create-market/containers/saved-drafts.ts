import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { submitNewMarket } from "modules/markets/actions/submit-new-market";
import {
  addOrderToNewMarket,
  removeOrderFromNewMarket,
  updateNewMarket
} from "modules/markets/actions/update-new-market";
import SavedDrafts from "modules/create-market/saved-drafts";
import getValue from "utils/get-value";
import { addDraft, updateDraft, removeDraft } from "modules/create-market/actions/update-drafts";

const mapStateToProps = state => ({
  drafts: state.drafts,
  currentTimestamp: getValue(state, "blockchain.currentAugurTimestamp"),
  address: getValue(state, "loginAccount.address"),
});

const mapDispatchToProps = dispatch => ({
  updateNewMarket: data => dispatch(updateNewMarket(data)),
  submitNewMarket: (data, history, cb) =>
    dispatch(submitNewMarket(data, history, cb)),
  addDraft: (key, data) => dispatch(addDraft(key, data)),
  updateDraft: (key, data) => dispatch(updateDraft(key, data)),
  removeDraft: (key) => dispatch(removeDraft(key)),
});

const SavedDraftsContainer = withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(SavedDrafts)
);

export default SavedDraftsContainer;
