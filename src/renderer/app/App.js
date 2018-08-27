import * as React from 'react'
import { Component } from 'react'
import PropTypes from "prop-types";

import { Logo } from "../common/components/logo/logo";
import { SettingsDropdown } from "./components/settings-dropdown/settings-dropdown";
import NetworkDropdownContainer from "./containers/network-dropdown-container";
import { ProcessingView } from "./components/processing-view/processing-view";
import { ConnectingView } from "./components/connecting-view/connecting-view";
import { requestServerConfigurations, startUiServer, start } from './actions/localServerCmds'
import Styles from './app.styles.less'
import Modal from "../common/components/modal/containers/modal-view";

export class App extends Component {
   constructor(props) {
    super(props);

    this.state = {
      connected: false,
      openBrowserEnabled: false,
      processing: false,
    };

    this.connect = this.connect.bind(this);
  }

  componentWillMount() {
    requestServerConfigurations()
  }

  connect() {
    const selected = this.props.selected
    start(selected)
    this.setState({connected: !this.state.connected, openBrowserEnabled: !this.state.openBrowserEnabled});
  }

  render() {
    return (
      <div className={Styles.App}>
        {<Modal />}
        <div className={Styles.App__connectingContainer}>
          <div className={Styles.App__row}>
            <Logo />
            <SettingsDropdown
              sslEnabled={this.props.sslEnabled}
              updateConfig={this.props.updateConfig}
            />
          </div>
          <div>
            <NetworkDropdownContainer />
            <button className={Styles.App__connectButton} onClick={this.connect}>
              {this.state.connected ? 'Disconnect' : 'Connect'}
            </button>
            <ConnectingView connected={this.state.connected} />
            <ProcessingView processing={this.state.processing} />
          </div>
        </div>
        <div className={Styles.App__footer}>
          <button className={Styles.App__openBrowserButton} disabled={!this.state.openBrowserEnabled}>
            Open in Browser
          </button>
        </div>
      </div>
    )
  }
}

App.propTypes = {
  connections: PropTypes.object,
  selected: PropTypes.object,
  sslEnabled: PropTypes.bool,
  updateConfig: PropTypes.func,
};
