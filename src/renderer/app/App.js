import * as React from 'react'
import { Component } from 'react'
import PropTypes from "prop-types";

import { Logo } from "../common/components/logo/logo";
import { SettingsDropdown } from "./components/settings-dropdown/settings-dropdown";
import NetworkDropdownContainer from "./containers/network-dropdown-container";
import { ProcessingView } from "./components/processing-view/processing-view";
import { ConnectingView } from "./components/connecting-view/connecting-view";
import NotificationContainer from "./containers/notification-container"
import ShowErrorsContainer from "./containers/show-errors-container"
import { requestServerConfigurations, startAugurNode, stopAugurNode, openAugurUi } from './actions/localServerCmds'
import Styles from './app.styles.less'
import Modal from "../common/components/modal/containers/modal-view";
import classNames from "classnames";
import ModalDownloadGeth from "../common/components/modal/components/modal-download-geth/modal-download-geth";

const localLightNodeName = 'Local (Light Node)' // need to use key

export class App extends Component {
   constructor(props) {
    super(props);

    this.state = {
      connectedPressed: false,
      processing: props.serverStatus.CONNECTED || false,
      showDownloadGeth: false,
    };

    this.connect = this.connect.bind(this);
    this.callOpenAugurUi = this.callOpenAugurUi.bind(this);
    this.downloadGeth = this.downloadGeth.bind(this);
    this.cancelDownload = this.cancelDownload.bind(this);
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
        }, 800);
      } else {
        this.setState({processing: false, connectedPressed: false})
      }
    }
  }

  connect() {
    const selected = this.props.selected

    if (!this.props.serverStatus.CONNECTED && selected.name === localLightNodeName) {
      this.setState({showDownloadGeth: true})
    } else {
      if (this.props.serverStatus.CONNECTED) {
        this.setState({connectedPressed: false});
        stopAugurNode()
      } else {
        this.setState({connectedPressed: true});
        startAugurNode(selected)
      }
    }
  }

  downloadGeth() {
    const selected = this.props.selected
    this.setState({connectedPressed: true, showDownloadGeth: false});
    startAugurNode(selected)
  }

  cancelDownload() {
    this.setState({connectedPressed: false, showDownloadGeth: false});
  }

  callOpenAugurUi() {
    openAugurUi(this.props.selected)
  }

  render() {
    const {
      sslEnabled,
      updateConfig,
      serverStatus,
      blockInfo,
      addInfoNotification,
      selected,
    } = this.props

    const {
      connectedPressed,
      processing,
      showDownloadGeth,
    } = this.state

    let openBrowserEnabled = false
    const blocksRemaining = parseInt(blockInfo.highestBlockNumber, 10) - parseInt(blockInfo.lastSyncBlockNumber, 10)
    if (blocksRemaining <= 15 && connectedPressed && serverStatus.CONNECTED) {
      openBrowserEnabled = true
    }

    return (
      <div className={Styles.App}>
        <Modal />
          <div
            className={classNames(Styles.App__smallBg, {
              [Styles['App__smallBg-show']]: showDownloadGeth
            })}
          >
            <ModalDownloadGeth closeModal={this.cancelDownload} download={this.downloadGeth} />
          </div>
        <div className={Styles.App__connectingContainer}>
          <div className={Styles.App__scrollContainer}>
            <div className={Styles.App__row}>
              <Logo />
              <SettingsDropdown
                sslEnabled={sslEnabled}
                updateConfig={updateConfig}
                addInfoNotification={addInfoNotification}
              />
            </div>
            <NetworkDropdownContainer
              openBrowserEnabled={openBrowserEnabled}
              isConnectedPressed={connectedPressed}
              stopAugurNode={this.connect}
            />
            <button className={Styles.App__connectButton} onClick={this.connect}>
              {(serverStatus.CONNECTED && connectedPressed) ? 'Disconnect' : 'Connect'}
            </button>
          </div>
          <div style={{marginTop: '215px'}}>
            <ConnectingView
              connected={serverStatus.CONNECTED}
              connecting={connectedPressed}
              isLocalLighNode={selected && selected.name === localLightNodeName}
            />
            <ProcessingView
              processing={processing && connectedPressed}
              blockInfo={blockInfo}
              openBrowserEnabled={openBrowserEnabled}
            />
          </div>
        </div>
        <ShowErrorsContainer />
        <div className={Styles.App_constantContainer}>
          <NotificationContainer />
        </div>
        <div className={Styles.App__footer}>
          <button className={Styles.App__openBrowserButton} disabled={!openBrowserEnabled} onClick={this.callOpenAugurUi}>
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
  addInfoNotification: PropTypes.func,
};
