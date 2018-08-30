import { connect } from "react-redux";
import { App } from "../App";
import { updateConfig } from "../actions/configuration"
import { addInfoNotification } from "../actions/notifications"
import { gethPrcessorHandler } from "../actions/geth-prcessor-handler"

const mapStateToProps = state => {

  if (state.serverStatus.GETH_INITIATED) gethPrcessorHandler(state.serverStatus)

  return {
    connections: state.configuration.networks || {},
    sslEnabled: state.configuration.sslEnabled,
    selected: (Object.values(state.configuration.networks || [])).find(network => network.selected === true),
    serverStatus: state.serverStatus,
    blockInfo: state.blockInfo,
    downloadModalSeen: state.configuration.downloadModalSeen || false,
  }
}

const mapDispatchToProps = dispatch => ({
  updateConfig: sslEnabled => dispatch(updateConfig(sslEnabled)),
  addInfoNotification: message => dispatch(addInfoNotification(message))
});

const AppContainer = connect(mapStateToProps, mapDispatchToProps)(App);

export default AppContainer;
