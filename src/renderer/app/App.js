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
import { requestServerConfigurations, startGethNode, stopGethNode, startAugurNode, stopAugurNode, openAugurUi } from './actions/local-server-cmds'
import Styles from './app.styles.less'
import Modal from "../common/components/modal/containers/modal-view";
import classNames from "classnames";
import ModalDownloadGeth from "../common/components/modal/components/modal-download-geth/modal-download-geth";

const localLightNodeName = 'Local (Light Node)' // need to use key

export class App extends Component {
   constructor(props) {
    super(props);

    this.state = {
      processing: (props.serverStatus.AUGUR_NODE_CONNECTED || props.serverStatus.GETH_CONNECTED) || false,
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
      if (this.props.serverStatus.AUGUR_NODE_CONNECTED || this.props.serverStatus.GETH_CONNECTED) {
        this.processingTimeout = setTimeout(() => {
          this.setState({processing: true})
        }, 700);
      } else {
        this.setState({processing: false})
      }
    }
  }

  connect() {
    const selected = this.props.selected

    if (!this.props.serverStatus.AUGUR_NODE_CONNECTED && selected.name === localLightNodeName && !this.props.downloadModalSeen) {
      this.setState({showDownloadGeth: true})
    } else {
      if (this.props.serverStatus.AUGUR_NODE_CONNECTED) {
        stopAugurNode(selected.name === localLightNodeName)
        if (selected.name === localLightNodeName) stopGethNode()
      } else {
        if (selected.name === localLightNodeName) {
          // only start geth node, we start augurNode automatically when local geth client is synced
          startGethNode()
        } else {
          startAugurNode()
        }

      }
    }
  }

  downloadGeth() {
    this.setState({showDownloadGeth: false});
    this.props.updateConfig({downloadModalSeen: true})
  }

  cancelDownload() {
    this.setState({showDownloadGeth: false});
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
      downloadModalSeen,
    } = this.props

    const {
      processing,
      showDownloadGeth,
    } = this.state

    let openBrowserEnabled = false
    const blocksRemaining = parseInt(blockInfo.highestBlockNumber, 10) - parseInt(blockInfo.lastSyncBlockNumber, 10)
    if (blocksRemaining <= 15 && (serverStatus.AUGUR_NODE_CONNECTED || serverStatus.GETH_CONNECTED)) {
      openBrowserEnabled = true
    }

    return (
      <div className={Styles.App}>
        <Modal />
        { !downloadModalSeen &&
          <div
            className={classNames(Styles.App__smallBg, {
              [Styles['App__smallBg-show']]: showDownloadGeth
            })}
          >
            <ModalDownloadGeth closeModal={this.cancelDownload} download={this.downloadGeth} />
          </div>
        }
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
              stopServer={this.connect}
            />
            <button className={Styles.App__connectButton} onClick={this.connect}>
              {(serverStatus.AUGUR_NODE_CONNECTED || serverStatus.GETH_CONNECTED)  ? 'Disconnect' : 'Connect'}
            </button>
          </div>
          <div style={{marginTop: '195px', overflowY: 'scroll', maxHeight: '500px'}}>
            <ConnectingView
              connected={serverStatus.AUGUR_NODE_CONNECTED || serverStatus.GETH_CONNECTED}
              connecting={serverStatus.CONNECTING}
              isLocalLightNode={selected && selected.name === localLightNodeName}
              serverStatus={serverStatus}
            />
            <ProcessingView
              processing={processing && serverStatus.CONNECTING}
              blockInfo={blockInfo}
              openBrowserEnabled={openBrowserEnabled}
            />
            <ShowErrorsContainer />
          </div>
        </div>
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
  downloadModalSeen: PropTypes.bool,
};
