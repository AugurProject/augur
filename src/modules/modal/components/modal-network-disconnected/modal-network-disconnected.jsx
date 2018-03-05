import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { AugurLoadingLogo } from 'modules/common/components/icons'
import Styles from 'modules/modal/components/modal-network-disconnected/modal-network-disconnected.styles'

import getValue from 'utils/get-value'

export default class ModalNetworkDisconnected extends Component {
  static propTypes = {
    modal: PropTypes.shape({
      env: PropTypes.object.isRequired,
      connection: PropTypes.object.isRequired,
    }),
    updateEnv: PropTypes.func.isRequired,
    updateIsReconnectionPaused: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props)

    this.state = {
      showEnvForm: false,
      augurNode: props.modal.env['augur-node'],
      ethereumNodeHttp: props.modal.env['ethereum-node'].http,
      ethereumNodeWs: props.modal.env['ethereum-node'].ws,
    }

    this.showForm = this.showForm.bind(this)
    this.submitForm = this.submitForm.bind(this)
    this.updateField = this.updateField.bind(this)
  }

  showForm(e) {
    e.preventDefault()
    this.setState({ showEnvForm: !this.state.showEnvForm })
    // if the form is going to be shown, we pass true to pause reconnection
    this.props.updateIsReconnectionPaused(!this.state.showEnvForm)
  }

  submitForm(e, ...args) {
    e.preventDefault()
    this.props.updateEnv({
      ...this.props.modal.env,
      'augur-node': this.state.augurNode,
      'ethereum-node': {
        http: this.state.ethereumNodeHttp,
        ws: this.state.ethereumNodeWs,
      },
    })
    // unpause reconnection
    this.props.updateIsReconnectionPaused(false)
    this.setState({ showEnvForm: false })
  }

  updateField(field, value, ...args) {
    this.setState({ [field]: value })
  }

  render() {
    const p = this.props
    const s = this.state
    const connectionStatus = getValue(p, 'modal.connection')
    let nodeTitleText = ''
    let nodeDescriptionText = ''
    if ((connectionStatus.isConnected && !connectionStatus.isConnectedToAugurNode)) {
      // augurNode disconnected only
      nodeTitleText = ' to Augur Node'
      nodeDescriptionText = ' from your Augur Node'
    }
    if ((!connectionStatus.isConnected && connectionStatus.isConnectedToAugurNode)) {
      // ethereumNode disconnected only
      nodeTitleText = ' to Ethereum Node'
      nodeDescriptionText = ' from your Ethereum Node'
    }
    // assemble the text based on disconnections
    const titleText = `Reconnecting${nodeTitleText}`
    const descriptionText = `You have been disconnected${nodeDescriptionText}. Please wait while we try to reconnect you, or update your node addresses `

    return (
      <section className={Styles.ModalNetworkDisconnected}>
        {!s.showEnvForm &&
          <div className={Styles.ModalNetworkDisconnected__AugurLogo}>
            {AugurLoadingLogo}
          </div>
        }
        {!s.showEnvForm &&
          <div>
            <h1>{titleText}</h1>
            <span>{descriptionText}<a href="#" onClick={this.showForm}>here.</a></span>
          </div>
        }
        {s.showEnvForm &&
          <form
            className={Styles.ModalNetworkDisconnected__form}
            onSubmit={this.submitForm}
          >
            <h1 className={Styles.ModalNetworkDisconnected__formTitle}>Connect to Augur Via</h1>
            <label htmlFor="modal__dc-augurNode">
              Augur Node Address:
              <input
                id="modal__dc-augurNode"
                type="text"
                className={Styles.ModalNetworkDisconnected__input}
                value={s.augurNode}
                placeholder="Enter the augurNode address you would like to connect to."
                onChange={e => this.updateField('augurNode', e.target.value)}
              />
            </label>
            <label htmlFor="modal__dc-ethNodeHttp">
              Ethereum Node HTTP address:
              <input
                id="modal__dc-ethNodeHttp"
                type="text"
                className={Styles.ModalNetworkDisconnected__input}
                value={s.ethereumNodeHttp}
                placeholder="Enter the Ethereum Node http address you would like to connect to."
                onChange={e => this.updateField('ethereumNodeHttp', e.target.value)}
              />
            </label>
            <label htmlFor="modal__dc-ethereumNodeWs">
              Ethereum Node Websocket Address:
              <input
                id="modal__dc-ethereumNodeWs"
                type="text"
                className={Styles.ModalNetworkDisconnected__input}
                value={s.ethereumNodeWs}
                placeholder="Enter the Ethereum Node Websocket address you would like to connect to."
                onChange={e => this.updateField('ethereumNodeWs', e.target.value)}
              />
            </label>
            <button type="submit">Connect</button>
          </form>
        }
      </section>
    )
  }
}
