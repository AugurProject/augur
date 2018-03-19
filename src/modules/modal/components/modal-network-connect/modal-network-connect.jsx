import React, { Component } from 'react'
import PropTypes from 'prop-types'

import Styles from 'modules/modal/components/modal-network-connect/modal-network-connect.styles'

export default class ModalNetworkConnect extends Component {
  static propTypes = {
    submitForm: PropTypes.func,
    env: PropTypes.object,
    connection: PropTypes.object,
  }

  constructor(props) {
    super(props)

    this.state = {
      augurNode: props.env['augur-node'] || '',
      ethereumNodeHttp: props.env['ethereum-node'] && props.env['ethereum-node'].http || '',
      ethereumNodeWs: props.env['ethereum-node'] && props.env['ethereum-node'].ws || '',
    }

    this.submitForm = this.submitForm.bind(this)
    this.updateField = this.updateField.bind(this)
  }

  updateField(field, value) {
    this.setState({ [field]: value })
  }

  submitForm(e) {
    e.preventDefault()
    const p = this.props
    const updatedEnv = {
      ...this.props.env,
      'augur-node': this.state.augurNode,
      'ethereum-node': {
        http: this.state.ethereumNodeHttp,
        ws: this.state.ethereumNodeWs,
      },
    }
    p.submitForm(e, updatedEnv)
    // callback in container will close or update the modal
    p.connectAugur(p.history, updatedEnv, p.modal.isInitialConnection)
  }


  render() {
    const s = this.state

    return (
      <form
        className={Styles.ModalNetworkConnect__form}
        onSubmit={this.submitForm}
      >
        <h1 className={Styles.ModalNetworkConnect__formTitle}>Connect to Augur Via</h1>
        <label htmlFor="modal__dc-augurNode">
          Augur Node Address:
          <input
            id="modal__dc-augurNode"
            type="text"
            className={Styles.ModalNetworkConnect__input}
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
            className={Styles.ModalNetworkConnect__input}
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
            className={Styles.ModalNetworkConnect__input}
            value={s.ethereumNodeWs}
            placeholder="Enter the Ethereum Node Websocket address you would like to connect to."
            onChange={e => this.updateField('ethereumNodeWs', e.target.value)}
          />
        </label>
        <button type="submit">Connect</button>
      </form>
    )
  }
}
