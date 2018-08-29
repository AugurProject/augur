import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { App } from "../App";
import { updateConfig } from "../actions/configuration"
import { addInfoNotification } from "../actions/notifications"

const mapStateToProps = state => ({
  connections: state.configuration.networks || {},
  sslEnabled: state.configuration.sslEnabled,
  selected: (Object.values(state.configuration.networks || [])).find(network => network.selected === true),
  serverStatus: state.serverStatus,
  blockInfo: state.blockInfo,
});

const mapDispatchToProps = dispatch => ({
  updateConfig: sslEnabled => dispatch(updateConfig(sslEnabled)),
  addInfoNotification: message => dispatch(addInfoNotification(message))
});

const AppContainer = connect(mapStateToProps, mapDispatchToProps)(App);

export default AppContainer;
