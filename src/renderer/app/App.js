import * as React from 'react'
import { Component } from 'react'
import { Logo } from "../common/components/logo/logo";
import { SettingsDropdown } from "./components/settings-dropdown/settings-dropdown";
import NetworkDropdownContainer from "./containers/network-dropdown-container";
import { ProcessingView } from "./components/processing-view/processing-view";
import { ConnectingView } from "./components/connecting-view/connecting-view";
import { requestConnectionConfigurations } from './actions/localServerCmds'
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

  connect() {
    this.setState({connected: !this.state.connected, openBrowserEnabled: !this.state.openBrowserEnabled});
  }

  componentWillMount() {
    requestConnectionConfigurations()
  }

  render() {
    return (
      <div className={Styles.App}>
        {<Modal />}
        <div className={Styles.App__connectingContainer}>
          <div className={Styles.App__row}>
            <Logo />
            <SettingsDropdown />
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
