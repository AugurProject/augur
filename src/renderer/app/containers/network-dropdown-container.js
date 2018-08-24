import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { NetworkDropdown } from "../components/network-dropdown/network-dropdown";
import { updateModal } from "../../common/components/modal/actions/update-modal";
import { MODAL_EDIT_CONNECTION } from "../../common/components/modal/constants/modal-types";

const mapStateToProps = state => ({
  connections: state.connections,
});

const mapDispatchToProps = dispatch => ({
	updateModal: data => dispatch(updateModal({ type: MODAL_EDIT_CONNECTION, ...data }))
});

const NetworkDropdownContainer = connect(mapStateToProps, mapDispatchToProps)(NetworkDropdown);

export default NetworkDropdownContainer;
