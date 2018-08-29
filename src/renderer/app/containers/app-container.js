import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { App } from "../App";
import { updateConfig } from "../actions/configuration"

const mapStateToProps = state => ({
  connections: state.configuration.networks || {},
  sslEnabled: state.configuration.sslEnabled,
  selected: (Object.values(state.configuration.networks || [])).find(network => network.selected === true),
  serverStatus: state.serverStatus,
  blockInfo: state.blockInfo,
  notifications: state.notifications,
});

const mapDispatchToProps = dispatch => ({
  updateConfig: sslEnabled => dispatch(updateConfig(sslEnabled))
});

const AppContainer = connect(mapStateToProps, mapDispatchToProps)(App);

export default AppContainer;
