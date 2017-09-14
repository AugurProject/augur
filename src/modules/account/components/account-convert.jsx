import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import Input from 'modules/common/components/input/input'
import EtherLogo from 'modules/common/components/ether-logo'
import EtherTokenLogo from 'modules/common/components/ether-token-logo'

export default class AccountConvert extends Component {
  static propTypes = {
    ethTokens: PropTypes.object.isRequired,
    eth: PropTypes.object.isRequired,
    convertToToken: PropTypes.func.isRequired,
    convertToEther: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props)

    this.TO_ETHER = 'TO_ETHER'
    this.TO_TOKEN = 'TO_TOKEN'

    this.state = {
      direction: this.TO_TOKEN,
      upperBound: props.eth.value,
      amount: '',
      isValid: null,
      isAmountValid: null
    }

    this.setDirection = this.setDirection.bind(this)
    this.validateAmount = this.validateAmount.bind(this)
    this.convert = this.convert.bind(this)
  }

  setDirection(direction) {
    this.setState({
      direction,
      upperBound: direction === this.TO_TOKEN ? this.props.eth.value : this.props.ethTokens.value
    })
  }

  validateAmount(amount) {
    const sanitizedAmount = (amount == null || amount === '') ? '' : amount

    if (isNaN(parseFloat(sanitizedAmount)) || !isFinite(sanitizedAmount) || (sanitizedAmount > this.state.upperBound || sanitizedAmount <= 0)) {
      this.setState({
        amount: sanitizedAmount,
        isAmountValid: false,
        isValid: false,
      })
      return
    }

    this.setState({
      amount: sanitizedAmount,
      isValid: true,
      isAmountValid: true
    })
  }

  convert() {
    if (this.state.direction === this.TO_TOKEN) {
      this.props.convertToToken(this.state.amount)
    } else {
      this.props.convertToEther(this.state.amount)
    }

    this.setState({ // Reset form, leaving direction in place
      amount: '',
      isValid: false
    })
  }

  render() {
    const p = this.props
    const s = this.state

    return (
      <article className="account-convert account-sub-view">
        <aside>
          <h3>Convert Account Ether</h3>
          <p>All trading on Augur is conducted with ETH Tokens, which are exchanged one-to-one with ETH.</p>
        </aside>
        <div className="account-actions">
          <form
            onSubmit={(e) => {
              e.preventDefault()

              if (s.isValid) {
                this.convert()
              }
            }}
          >
            <div className="account-convert-select-direction">
              <button
                type="button"
                className="unstyled logo-button"
                onClick={() => this.setDirection(this.TO_ETHER)}
              >
                <EtherLogo />
                <span>Ether</span>
              </button>
              <button
                type="button"
                className="unstyled direction-indicator"
                onClick={() => this.setDirection(s.direction === this.TO_TOKEN ? this.TO_ETHER : this.TO_TOKEN)}
              >
                <i className={classNames('fa fa-angle-double-right', { 'direction-to-token': s.direction === this.TO_TOKEN })} />
              </button>
              <button
                type="button"
                className="unstyled logo-button"
                onClick={() => this.setDirection(this.TO_TOKEN)}
              >
                <EtherTokenLogo />
                <span>Ether Token</span>
              </button>
            </div>
            <Input
              isIncrementable
              incrementAmount={1}
              max={s.direction === this.TO_TOKEN ? p.eth.value : p.ethTokens.value}
              min={0.1}
              value={s.amount}
              updateValue={amount => this.validateAmount(amount)}
              onChange={amount => this.validateAmount(amount)}
              placeholder={`Amount of ${s.direction === this.TO_TOKEN ? 'ETH' : 'ETH Tokens'} to Convert`}
            />
            <span
              className={classNames('account-input-error', {
                'input-in-error': s.amount !== '' && s.isAmountValid !== null && !s.isAmountValid
              })}
            >
              {`Amount must be between 0 and ${(s.direction === this.TO_TOKEN ? p.eth.value : p.ethTokens.value).toLocaleString()} ${s.direction === this.TO_TOKEN ? 'ETH' : 'ETH Tokens'}`}
            </span>
            <button
              type="submit"
              className={classNames('account-convert-submit', { 'form-is-valid': s.isValid !== null && s.isValid })}
            >
              Convert
            </button>
          </form>
        </div>
      </article>
    )
  }
}
