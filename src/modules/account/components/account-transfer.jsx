import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import BigNumber from 'bignumber.js'
import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup'

import Input from 'modules/common/components/input/input'
import EtherLogo from 'modules/common/components/ether-logo'
import AugurLogoIcon from 'modules/common/components/augur-logo-icon/augur-logo-icon'

import { ETH, REP } from 'modules/account/constants/asset-types'

import isAddress from 'modules/auth/helpers/is-address'

export default class AccountTransfer extends Component {
  static propTypes = {
    ethTokens: PropTypes.object.isRequired,
    eth: PropTypes.object.isRequired,
    rep: PropTypes.object.isRequired,
    transferFunds: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props)

    this.DEFAULT_STATE = {
      animationSpeed: 0,
      upperBound: null,
      selectedAsset: null,
      selectedAssetLabel: null,
      amount: '',
      address: '',
      isValid: null,
      isAmountValid: null,
      isAddressValid: null
    }

    this.state = this.DEFAULT_STATE

    this.setAnimationSpeed = this.setAnimationSpeed.bind(this)
    this.updateSelectedAsset = this.updateSelectedAsset.bind(this)
    this.validateAmount = this.validateAmount.bind(this)
    this.validateAddress = this.validateAddress.bind(this)
    this.validateForm = this.validateForm.bind(this)
  }

  componentDidMount() {
    this.setAnimationSpeed()
  }

  componentWillUpdate(nextProps, nextState) {
    if (
      this.state.isAmountValid !== nextState.isAmountValid ||
      this.state.isAddressValid !== nextState.isAddressValid
    ) {
      this.validateForm(nextState.isAmountValid, nextState.isAddressValid)
    }
  }

  setAnimationSpeed() {
    this.setState({ animationSpeed: parseInt(window.getComputedStyle(document.body).getPropertyValue('--animation-speed-very-fast'), 10) })
  }

  updateSelectedAsset(selectedAsset) {
    let upperBound
    let selectedAssetLabel
    switch (selectedAsset) {
      case REP:
        upperBound = this.props.rep.value
        selectedAssetLabel = 'REP'
        break
      case ETH:
      default:
        upperBound = this.props.eth.value
        selectedAssetLabel = 'ETH'
    }

    this.setState({
      selectedAsset,
      upperBound,
      selectedAssetLabel
    })
  }

  validateAmount(amount) {
    const sanitizedAmount = sanitizeArg(amount)

    if (isNaN(parseFloat(sanitizedAmount)) || !isFinite(sanitizedAmount) || (sanitizedAmount > this.state.upperBound || sanitizedAmount <= 0)) {
      this.setState({
        amount: sanitizedAmount,
        isAmountValid: false
      })
      return
    }

    this.setState({
      amount: sanitizedAmount,
      isAmountValid: true
    })
  }

  validateAddress(address) {
    const sanitizedAddress = sanitizeArg(address)

    if (!isAddress(sanitizedAddress)) {
      this.setState({
        address: sanitizedAddress,
        isAddressValid: false
      })
      return
    }

    this.setState({
      address: sanitizedAddress,
      isAddressValid: true
    })
  }

  validateForm(isAmountValid, isAddressValid) {
    if (isAmountValid && isAddressValid) {
      this.setState({
        isValid: true
      })
    } else {
      this.setState({
        isValid: false
      })
    }
  }

  render() {
    const p = this.props
    const s = this.state

    return (
      <article className="account-transfer account-sub-view">
        <aside>
          <h3>Transfer Funds</h3>
          <p>Use this form to send your ETH or REP to another address.</p>
        </aside>
        <div className="account-actions">
          <form
            onSubmit={(e) => {
              e.preventDefault()

              console.log('submit transfer')

              if (s.isValid) {
                const stringedAmount = s.amount instanceof BigNumber ? s.amount.toString() : s.amount
                p.transferFunds(stringedAmount, s.selectedAsset, s.address)
                this.setState(this.DEFAULT_STATE)
              }
            }}
          >
            <div className="account-transfer-step account-transfer-asset-type">
              <button
                type="button"
                className={classNames('unstyled logo-button', { 'selected-asset': s.selectedAsset === ETH })}
                onClick={() => this.updateSelectedAsset(ETH)}
              >
                <EtherLogo />
                <span>Ether</span>
              </button>
              <button
                type="button"
                className={classNames('unstyled logo-button', { 'selected-asset': s.selectedAsset === REP })}
                onClick={() => this.updateSelectedAsset(REP)}
              >
                <AugurLogoIcon
                  invert
                />
                <span>Reputation</span>
              </button>
            </div>
            <CSSTransitionGroup
              component="div"
              transitionName="amount-transfer"
              transitionEnterTimeout={s.animationSpeed}
              transitionLeave={false}
            >
              {!!s.selectedAsset &&
                <div className="account-transfer-step">
                  <Input
                    isIncrementable
                    incrementAmount={1}
                    max={s.upperBound}
                    min={0.1}
                    value={s.amount}
                    updateValue={amount => this.validateAmount(amount)}
                    onChange={amount => this.validateAmount(amount)}
                    placeholder={`Amount of ${s.selectedAssetLabel} to send`}
                  />
                  <span
                    className={classNames('account-input-error', {
                      'input-in-error': s.amount !== '' && s.isAmountValid !== null && !s.isAmountValid
                    })}
                  >
                    {`Amount must be between 0 and ${s.upperBound} ${s.selectedAssetLabel}`}
                  </span>
                </div>
              }
            </CSSTransitionGroup>
            <CSSTransitionGroup
              component="div"
              transitionName="address-transfer"
              transitionEnterTimeout={s.animationSpeed}
              transitionLeaveTimeout={s.animationSpeed}
            >
              {!!s.isAmountValid &&
                <div className="account-transfer-step">
                  <Input
                    value={s.address}
                    updateValue={address => this.validateAddress(address)}
                    onChange={address => this.validateAddress(address)}
                    placeholder={`Recipient address`}
                  />
                  <span
                    className={classNames('account-input-error', {
                      'input-in-error': s.address !== '' && s.isAddressValid !== null && !s.isAddressValid
                    })}
                  >
                    Not a valid Ethereum address
                  </span>
                </div>
              }
            </CSSTransitionGroup>
            <CSSTransitionGroup
              component="div"
              transitionName="submit-transfer"
              transitionEnterTimeout={s.animationSpeed}
              transitionLeaveTimeout={s.animationSpeed}
            >
              <button
                type="submit"
                className={classNames('account-convert-submit', { 'form-is-valid': s.isValid })}
              >
                Transfer
              </button>
            </CSSTransitionGroup>
          </form>
        </div>
      </article>
    )
  }
}

function sanitizeArg(arg) {
  return (arg == null || arg === '') ? '' : arg
}
