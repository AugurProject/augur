import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { App } from "../App";
import { updateConfig } from "../actions/configuration"

const mapStateToProps = state => ({
  connections: state.configuration.networks || {},
  sslEnabled: state.configuration.sslEnabled,
  selected: (Object.values(state.configuration.networks || [])).find(network => network.selected === true),
});

const mapDispatchToProps = dispatch => ({
   //updateModal: data => dispatch(updateModal({ type: MODAL_EDIT_CONNECTION, ...data }))
  updateConfig: sslEnabled => dispatch(updateConfig(sslEnabled))
});
const AppContainer = connect(mapStateToProps, mapDispatchToProps)(App);

export default AppContainer;
