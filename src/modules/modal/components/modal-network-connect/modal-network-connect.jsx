import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import { AugurLoadingLogo, ExclamationCircle as InputErrorIcon } from 'modules/common/components/icons'
import Input from 'modules/common/components/input/input'

import Styles from 'modules/modal/components/modal-network-connect/modal-network-connect.styles'

function calculateConnectionErrors(err, res) {
  const errors = []

  if (err || (!res.ethereumNode && !res.augurNode)) errors.push('There was an issue connecting to the nodes, please try again.')
  if (!res.ethereumNode && !err && res.augurNode) errors.push('Failed to connect to the Ethereum Node.')
  if (!res.augurNode && !err && res.ethereumNode) errors.push('Failed to connect to the Augur Node.')

  return errors
}

export default class ModalNetworkConnect extends Component {
  static propTypes = {
    modal: PropTypes.shape({
      isInitialConnection: PropTypes.bool.isRequired,
    }),
    env: PropTypes.object,
    connection: PropTypes.object,
    submitForm: PropTypes.func.isRequired,
    closeModal: PropTypes.func.isRequired,
    updateEnv: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props)

    this.state = {
      augurNode: props.env['augur-node'] || '',
      ethereumNodeHttp: (props.env['ethereum-node'] && props.env['ethereum-node'].http) || '',
      ethereumNodeWs: (props.env['ethereum-node'] && props.env['ethereum-node'].ws) || '',
      isAttemptingConnection: false,
      connectErrors: [],
      formErrors: {
        augurNode: [],
        ethereumNodeHttp: [],
        ethereumNodeWs: [],
      },
    }

    this.submitForm = this.submitForm.bind(this)
    this.updateField = this.updateField.bind(this)
    this.validateField = this.validateField.bind(this)
  }

  updateField(field, value) {
    this.setState({ [field]: value })
  }

  validateField(field, value) {
    const { formErrors } = this.state
    const connectErrors = []
    formErrors[field] = []

    if (!value || value.length === 0) formErrors[field].push(`This field is required.`)

    this.setState({ connectErrors, formErrors, [field]: value })
  }

  submitForm(e) {
    const p = this.props
    const updatedEnv = {
      ...this.props.env,
      'augur-node': this.state.augurNode,
      'ethereum-node': {
        http: this.state.ethereumNodeHttp,
        ws: this.state.ethereumNodeWs,
      },
    }
    p.updateEnv(updatedEnv)
    // this is used as a hook for disconnection modal, normally just preventsDefault
    p.submitForm(e)
    // reset local error state and initial attemptConnection loading icon
    this.setState({ isAttemptingConnection: true, connectErrors: [] })
    p.connectAugur(p.history, updatedEnv, p.modal.isInitialConnection, (err, res) => {
      const connectErrors = calculateConnectionErrors(err, res)
      if (!connectErrors.length && !err && !!res.ethereumNode && !!res.augurNode) return this.closeModal()
      this.setState({ isAttemptingConnection: false, connectErrors })
    })
  }

  render() {
    const s = this.state
    const AugurNodeInValid = (s.formErrors.augurNode.length > 0)
    const ethereumNodeWsInValid = (s.formErrors.ethereumNodeWs.length > 0)
    const ethereumNodeHttpInValid = (s.formErrors.ethereumNodeHttp.length > 0)
    const formInValid = (AugurNodeInValid || ethereumNodeWsInValid || ethereumNodeHttpInValid)
    const hasConnectionErrors = (s.connectErrors.length > 0)

    return (
      <form
        className={Styles.ModalNetworkConnect__form}
        onSubmit={this.submitForm}
      >
        <h1 className={Styles.ModalNetworkConnect__formTitle}>Connect to Augur Via</h1>
        <label htmlFor="modal__augurNode-input">
          Augur Node Address:
        </label>
        <Input
          id="modal__augurNode-input"
          type="text"
          className={classNames({ [`${Styles['ModalNetworkConnect__error--field']}`]: AugurNodeInValid })}
          value={s.augurNode}
          placeholder="Enter the augurNode address you would like to connect to."
          onChange={value => this.validateField('augurNode', value)}
        />
        <div className={Styles.ModalNetworkConnect__formErrors}>
          {AugurNodeInValid && s.formErrors.augurNode.map((error, index) =>
            (
              <p
                key={error}
                className={Styles.ModalNetworkConnect__error}
              >
                {InputErrorIcon} {error}
              </p>
            ))
          }
        </div>
        <label htmlFor="modal__ethNodeHttp-input">
          Ethereum Node HTTP address:
        </label>
        <Input
          id="modal__ethNodeHttp-input"
          type="text"
          className={classNames({ [`${Styles['ModalNetworkConnect__error--field']}`]: ethereumNodeHttpInValid })}
          value={s.ethereumNodeHttp}
          placeholder="Enter the Ethereum Node http address you would like to connect to."
          onChange={value => this.validateField('ethereumNodeHttp', value)}
        />
        <div className={Styles.ModalNetworkConnect__formErrors}>
          {ethereumNodeHttpInValid && s.formErrors.ethereumNodeHttp.map((error, index) =>
            (
              <p
                key={error}
                className={Styles.ModalNetworkConnect__error}
              >
                {InputErrorIcon} {error}
              </p>
            ))
          }
        </div>
        <label htmlFor="modal__ethereumNodeWs-input">
          Ethereum Node Websocket Address:
        </label>
        <Input
          id="modal__ethereumNodeWs-input"
          type="text"
          className={classNames({ [`${Styles['ModalNetworkConnect__error--field']}`]: ethereumNodeWsInValid })}
          value={s.ethereumNodeWs}
          placeholder="Enter the Ethereum Node Websocket address you would like to connect to."
          onChange={value => this.validateField('ethereumNodeWs', value)}
        />
        <div className={Styles.ModalNetworkConnect__ConnectErrors}>
          {ethereumNodeWsInValid && s.formErrors.ethereumNodeWs.map((error, index) =>
            (
              <p
                key={error}
                className={Styles.ModalNetworkConnect__error}
              >
                {InputErrorIcon} {error}
              </p>
            ))
          }
          {hasConnectionErrors && s.connectErrors.map(error =>
            (<span key={error}>{InputErrorIcon} {error}</span>))}
        </div>
        <div className={Styles.ModalNetworkConnect__actions}>
          <button type="submit" disabled={formInValid}>Connect</button>
          {s.isAttemptingConnection &&
            <div className={Styles.ModalNetworkConnect__AugurLogo}>
              {AugurLoadingLogo}
            </div>
          }
        </div>
      </form>
    )
  }
}
