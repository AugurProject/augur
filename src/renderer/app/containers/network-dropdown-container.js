import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { NetworkDropdown } from "../components/network-dropdown/network-dropdown";

const mapStateToProps = state => ({
  connections: state.connections,
});

// const mapDispatchToProps = dispatch => ({
// });

const NetworkDropdownContainer = connect(mapStateToProps)(NetworkDropdown);

export default NetworkDropdownContainer;
