import * as React from 'react'
import { Component } from 'react'
import PropTypes from "prop-types";

import { Logo } from "../common/components/logo/logo";
import { SettingsDropdown } from "./components/settings-dropdown/settings-dropdown";
import NetworkDropdownContainer from "./containers/network-dropdown-container";
import { ProcessingView } from "./components/processing-view/processing-view";
import { ConnectingView } from "./components/connecting-view/connecting-view";
import NotificationContainer from "./containers/notification-container"
import { requestServerConfigurations, startUiServer, startAugurNode, stopAugurNode, openAugurUi } from './actions/localServerCmds'
import Styles from './app.styles.less'
import Modal from "../common/components/modal/containers/modal-view";

export class App extends Component {
   constructor(props) {
    super(props);

    this.state = {
      connectedPressed: false,
      processing: props.serverStatus.CONNECTED || false,
    };

    this.connect = this.connect.bind(this);
    this.processingTimeout = null;
  }

  componentWillMount() {
    requestServerConfigurations()
  }

  componentDidUpdate(prevProps) {
    if (prevProps.serverStatus !== this.props.serverStatus) {
      // timeout so that there is time to finish animation
      clearTimeout(this.processingTimeout);
      if (this.props.serverStatus.CONNECTED) {
        this.processingTimeout = setTimeout(() => {
          this.setState({processing: true})
        }, 400);
      } else {
        this.setState({processing: false})
      }
    }
  }

  connect() {
    const selected = this.props.selected
    if (this.props.serverStatus.CONNECTED) {
      this.setState({connectedPressed: false});
      stopAugurNode()
    } else {
      this.setState({connectedPressed: true});
      startAugurNode(selected)
    }
  }

  openAugurUi() {
    console.log('hi')
    openAugurUi()
  }

  render() {
    const {
      sslEnabled,
      updateConfig,
      serverStatus,
      blockInfo,
    } = this.props

    const {
      connectedPressed,
      processing,
    } = this.state

    let openBrowserEnabled = false
    const blocksRemaining = parseInt(blockInfo.highestBlockNumber, 10) - parseInt(blockInfo.lastSyncBlockNumber, 10)
    if (blocksRemaining <= 15 && connectedPressed && serverStatus.CONNECTED) {
      openBrowserEnabled = true
    }


    return (
      <div className={Styles.App}>
        <Modal />
        <div className={Styles.App__connectingContainer}>
          <div className={Styles.App__row}>
            <Logo />
            <SettingsDropdown
              sslEnabled={sslEnabled}
              updateConfig={updateConfig}
            />
          </div>
          <div>
            <NetworkDropdownContainer />
            <button className={Styles.App__connectButton} onClick={this.connect}>
              {serverStatus.CONNECTED ? 'Disconnect' : 'Connect'}
            </button>
            <ConnectingView
              connected={serverStatus.CONNECTED}
              connecting={connectedPressed}
            />
            <ProcessingView
              processing={processing}
              blockInfo={blockInfo}
              openBrowserEnabled={openBrowserEnabled}
            />
          </div>
          <NotificationContainer />
        </div>
        <div className={Styles.App__footer}>
          <button className={Styles.App__openBrowserButton} disabled={!openBrowserEnabled} onClick={this.openAugurUi}>
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
  serverStatus: PropTypes.object,
  blockInfo: PropTypes.object,
};
