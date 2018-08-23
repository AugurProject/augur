import * as React from 'react'
import { Component } from 'react'
import { Logo } from "./components/logo/logo";
import { NetworkDropdown } from "./components/network-dropdown/network-dropdown";
import { ProcessingView } from "./components/processing-view/processing-view";
import { ConnectingView } from "./components/connecting-view/connecting-view";
import Styles from './app.styles.less'
import { Link } from 'react-router-dom'

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

  render() {
    return (
      <div className={Styles.App}>
        <div className={Styles.App__connectingContainer}>
          <div className={Styles.App__row}>
            <Logo />
          </div>
          <div>
            <NetworkDropdown />
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
