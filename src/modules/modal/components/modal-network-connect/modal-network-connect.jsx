import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import { AugurLoadingLogo, ExclamationCircle as InputErrorIcon } from 'modules/common/components/icons'
import Input from 'modules/common/components/input/input'

import Styles from 'modules/modal/components/modal-network-connect/modal-network-connect.styles'

function calculateConnectionErrors(err, res) {
  const errors = []

  if (err || (!!res && !res.ethereumNode && !res.augurNode)) errors.push('There was an issue connecting to the nodes, please try again.')
  if (!!res && !res.ethereumNode && !err && res.augurNode) errors.push('Failed to connect to the Ethereum Node.')
  if (!!res && !res.augurNode && !err && res.ethereumNode) errors.push('Failed to connect to the Augur Node.')

  return errors
}

export default class ModalNetworkConnect extends Component {
  static propTypes = {
    modal: PropTypes.shape({
      isInitialConnection: PropTypes.bool,
    }),
    env: PropTypes.object,
    connection: PropTypes.object,
    submitForm: PropTypes.func.isRequired,
    closeModal: PropTypes.func.isRequired,
    updateEnv: PropTypes.func.isRequired,
    connectAugur: PropTypes.func.isRequired,
    isAugurJSVersionsEqual: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props)
    // prioritize ethereumNode connections
    let ethereumNode = ''
    if (props.env['ethereum-node']) {
      if (props.env['ethereum-node'].ipc) {
        ethereumNode = props.env['ethereum-node'].ipc
      } else if (props.env['ethereum-node'].ws) {
        ethereumNode = props.env['ethereum-node'].ws
      } else if (props.env['ethereum-node'].http) {
        ethereumNode = props.env['ethereum-node'].http
      }
    }

    this.state = {
      augurNode: props.env['augur-node'] || '',
      ethereumNode,
      isAttemptingConnection: false,
      isWeb3Available: (!!window && !!window.web3),
      connectErrors: [],
      formErrors: {
        augurNode: [],
        ethereumNode: [],
      },
    }

    this.types = { IPC: 'ipc', HTTP: 'http', WS: 'ws' }

    this.submitForm = this.submitForm.bind(this)
    this.validateField = this.validateField.bind(this)
    this.isFormInvalid = this.isFormInvalid.bind(this)
    this.calcProtocol = this.calcProtocol.bind(this)
  }

  calcProtocol(uri) {
    const { types } = this
    if (typeof uri === 'string' && uri.length && uri.includes('://')) {
      if (uri.includes(types.IPC)) return types.IPC
      if (uri.includes(types.WS)) return types.WS
      if (uri.includes(types.HTTP)) return types.HTTP
    }
    return false
  }

  validateField(field, value) {
    const { formErrors } = this.state
    const connectErrors = []
    formErrors[field] = []

    if (!value || value.length === 0) formErrors[field].push(`This field is required.`)

    this.setState({ connectErrors, formErrors, [field]: value })
  }

  isFormInvalid() {
    const { augurNode, ethereumNode, isWeb3Available } = this.state
    if (augurNode.length && (ethereumNode.length || isWeb3Available)) {
      return false
    }
    return true
  }

  submitForm(e) {
    const p = this.props
    let ethNode = {}
    const protocol = this.calcProtocol(this.state.ethereumNode)
    if (protocol) {
      ethNode = {
        [`${protocol}`]: this.state.ethereumNode,
      }
    }
    // because we prioritize, lets wipe out all previous connection options but not remove things like timeout.
    const updatedEnv = {
      ...this.props.env,
      'augur-node': this.state.augurNode,
      'ethereum-node': {
        ...this.props.env['ethereum-node'],
        ipc: '',
        http: '',
        ws: '',
        ...ethNode,
      },
    }
    p.updateEnv(updatedEnv)
    // p.submitForm used as a hook for disconnection modal, normally just preventsDefault
    p.submitForm(e)
    // reset local error state and initial attemptConnection loading icon
    this.setState({ isAttemptingConnection: true, connectErrors: [] })

    p.connectAugur(p.history, updatedEnv, !!p.modal.isInitialConnection, (err, res) => {
      const connectErrors = calculateConnectionErrors(err, res)
      if (connectErrors.length || err || res) {
        return this.setState({ isAttemptingConnection: false, connectErrors })
      }
      // no errors and we didn't get an err or res object? we are connected.
      if (!connectErrors.length && !err && !res) {
        let isAugurJSEqual
        p.isAugurJSVersionsEqual().then((res) => {
          isAugurJSEqual = res.isEqual
          if (isAugurJSEqual) return p.closeModal()
          const { formErrors } = this.state
          formErrors.augurNode = []
          formErrors.augurNode.push(`AugurJS version (${res.augurjs}) doesn't match AugurNode (${res.augurNode}).`)
          this.setState({ isAttemptingConnection: false, connectErrors, formErrors })
        })
      }
    })
  }

  render() {
    const s = this.state
    const AugurNodeInValid = (s.formErrors.augurNode.length > 0)
    const ethereumNodeInValid = (s.formErrors.ethereumNode.length > 0)
    const hasConnectionErrors = (s.connectErrors.length > 0)
    const formInvalid = this.isFormInvalid()

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
          isRequired
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
        <label htmlFor="modal__ethNode-input">
          Ethereum Node address:
        </label>
        {s.isWeb3Available &&
          <div
            className={Styles.ModalNetworkConnect__web3}
          >
            You are already connected to an Ethereum Node through Metamask. If you would like to specify a node, please disable Metamask.
          </div>
        }
        {!s.isWeb3Available &&
          <Input
            id="modal__ethNode-input"
            type="text"
            className={classNames({ [`${Styles['ModalNetworkConnect__error--field']}`]: ethereumNodeInValid })}
            value={s.ethereumNode}
            placeholder="Enter the Ethereum Node address you would like to connect to."
            onChange={value => this.validateField('ethereumNode', value)}
            isRequired
          />
        }
        {!s.isWeb3Available &&
          <div className={Styles.ModalNetworkConnect__formErrors}>
            {ethereumNodeInValid && s.formErrors.ethereumNode.map((error, index) =>
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
        }
        <div className={Styles.ModalNetworkConnect__ConnectErrors}>
          {hasConnectionErrors && s.connectErrors.map(error =>
            (<span key={error}>{InputErrorIcon} {error}</span>))}
        </div>
        <div className={Styles.ModalNetworkConnect__actions}>
          <button type="submit" disabled={formInvalid}>Connect</button>
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
