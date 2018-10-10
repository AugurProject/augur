import { connect } from "react-redux";
import { App } from "../App";
import { updateConfig } from "../actions/configuration"
import { addInfoNotification } from "../actions/notifications"
import { updateServerAttrib } from "../actions/serverStatus"

const mapStateToProps = state => {

  return {
    connections: state.configuration.networks || {},
    sslEnabled: state.configuration.sslEnabled,
    selected: (Object.values(state.configuration.networks || [])).find(network => network.selected === true),
    serverStatus: state.serverStatus,
    gethBlockInfo: state.gethBlockInfo,
    augurNodeBlockInfo: state.augurNodeBlockInfo,
    downloadModalSeen: state.configuration.downloadModalSeen || false,
  }
}

const mapDispatchToProps = dispatch => ({
  updateConfig: sslEnabled => dispatch(updateConfig(sslEnabled)),
  addInfoNotification: message => dispatch(addInfoNotification(message)),
  updateServerAttrib: obj => dispatch(updateServerAttrib(obj)),
});

const AppContainer = connect(mapStateToProps, mapDispatchToProps)(App);

export default AppContainer;
