import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import getValue from "utils/get-value";
import {
  updateNewMarket,
  clearNewMarket
} from "modules/markets/actions/update-new-market";
import { TemplatePicker } from "modules/create-market/components/template-picker";

const mapStateToProps = state => ({
  newMarket: state.newMarket,
  currentTimestamp: getValue(state, "blockchain.currentAugurTimestamp"),
  address: getValue(state, "loginAccount.address"),
});

const mapDispatchToProps = dispatch => ({
  updateNewMarket: data => dispatch(updateNewMarket(data)),
  clearNewMarket: () => dispatch(clearNewMarket()),
});

const TemplatePickerContainer = withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(TemplatePicker)
);

export default TemplatePickerContainer;
