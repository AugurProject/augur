import { connect } from "react-redux";
import {
  MODAL_CREATION_HELP
} from "modules/common/constants";
import Link from "modules/create-market/link";
import { updateModal } from "modules/modal/actions/update-modal";
import { NodeStyleCallback } from "modules/types";

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => ({
  updateModal: (cb: NodeStyleCallback) =>
    dispatch(updateModal({ type: MODAL_CREATION_HELP, cb })),
});

const LinkContainer = connect(
    mapStateToProps,
    mapDispatchToProps
  )(Link);

export default LinkContainer;
