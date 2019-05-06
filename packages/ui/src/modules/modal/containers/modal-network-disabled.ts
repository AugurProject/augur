import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Message } from "modules/modal/message";

const mapStateToProps = state => ({
  modal: state.modal
});

const mapDispatchToProps = dispatch => ({});

const mergeProps = (sP, dP, oP) => ({
  title: "Network Disabled",
  description: ["Connecting to mainnet through this UI is disabled."]
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps
  )(Message)
);
