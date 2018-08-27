import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { App } from "../App";

const mapStateToProps = state => ({
  connections: state.configuration.networks || {},
  selected: (Object.values(state.configuration.networks || [])).find(network => network.selected === true),
});

const AppContainer = connect(mapStateToProps)(App);

export default AppContainer;
