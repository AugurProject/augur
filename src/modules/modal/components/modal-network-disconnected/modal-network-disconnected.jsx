import React, { Component } from 'react'
import PropTypes from 'prop-types'

import ModalNetworkConnect from 'modules/modal/containers/modal-network-connect'

import { AugurLoadingLogo } from 'modules/common/components/icons'
import Styles from 'modules/modal/components/modal-network-disconnected/modal-network-disconnected.styles'

import getValue from 'utils/get-value'

export default class ModalNetworkDisconnected extends Component {
  static propTypes = {
    modal: PropTypes.shape({
      env: PropTypes.object.isRequired,
      connection: PropTypes.object.isRequired,
    }),
    updateIsReconnectionPaused: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props)

    this.state = {
      showEnvForm: false,
    }

    this.showForm = this.showForm.bind(this)
    this.submitForm = this.submitForm.bind(this)
    this.updateField = this.updateField.bind(this)
  }

  showForm(e) {
    const { updateIsReconnectionPaused } = this.props
    e.preventDefault()
    this.setState({ showEnvForm: !this.state.showEnvForm })
    // if the form is going to be shown, we pass true to pause reconnection
    updateIsReconnectionPaused(!this.state.showEnvForm)
  }

  submitForm(e, env) {
    const {
      updateIsReconnectionPaused,
    } = this.props
    e.preventDefault()
    // unpause reconnection
    updateIsReconnectionPaused(false)
    this.setState({ showEnvForm: false })
  }

  updateField(field, value) {
    this.setState({ [field]: value })
  }

  render() {
    const {
      modal,
    } = this.props
    const s = this.state
    const connectionStatus = getValue(this.props, 'modal.connection')
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
            <span>{descriptionText}<button onClick={this.showForm}>here</button>.</span>
          </div>
        }
        {s.showEnvForm &&
          <ModalNetworkConnect submitForm={this.submitForm} env={modal.env} />
        }
      </section>
    )
  }
}
