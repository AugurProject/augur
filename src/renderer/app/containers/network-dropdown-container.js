import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { NetworkDropdown } from "../components/network-dropdown/network-dropdown";
import { updateModal } from "../../common/components/modal/actions/update-modal";
import { MODAL_EDIT_CONNECTION } from "../../common/components/modal/constants/modal-types";
import { updateSelectedConnection } from "../actions/configuration";

const mapStateToProps = state => ({
  connections: state.configuration.networks || {},
});

const mapDispatchToProps = dispatch => ({
	updateModal: data => dispatch(updateModal({ type: MODAL_EDIT_CONNECTION, ...data })),
	updateSelectedConnection: key => dispatch(updateSelectedConnection(key))
});

const NetworkDropdownContainer = connect(mapStateToProps, mapDispatchToProps)(NetworkDropdown);

export default NetworkDropdownContainer;
