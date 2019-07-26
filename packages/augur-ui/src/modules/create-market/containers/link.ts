import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import {
  MODAL_CREATION_HELP
} from "modules/common/constants";
import Link from "modules/create-market/link";
import { updateModal } from "modules/modal/actions/update-modal";

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => ({
  updateModal: (cb: NodeStyleCallback) =>
    dispatch(updateModal({ type: MODAL_CREATION_HELP, cb })),
});

const LinkContainer = withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Link)
);

export default LinkContainer;
