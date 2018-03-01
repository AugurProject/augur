import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { AugurLoadingLogo } from 'modules/common/components/icons'
import Styles from 'modules/modal/components/modal-network-disconnected/modal-network-disconnected.styles'

export default class ModalNetworkDisconnected extends Component {
  static propTypes = {
    modal: PropTypes.shape({
      env: PropTypes.object.isRequired,
      connection: PropTypes.object.isRequired,
    }),
    updateEnv: PropTypes.func.isRequired,
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
    this.setState({ showEnvForm: false })
  }

  updateField(field, value, ...args) {
    this.setState({ [field]: value })
  }

  render() {
    const s = this.state

    return (
      <section className={Styles.ModalNetworkDisconnected}>
        <div className={Styles.ModalNetworkDisconnected__AugurLogo}>
          {AugurLoadingLogo}
        </div>
        <h1>Reconnecting to Augur Node</h1>
        <span>You have been disconnected from your Augur Node. Please wait while we try to reconnect you, or update your node addresses <a href="#" onClick={this.showForm}>here.</a></span>
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
