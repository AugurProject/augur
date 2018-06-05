/* eslint jsx-a11y/label-has-for: 0 */

import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { createBigNumber, BigNumber } from 'utils/create-big-number'
import Input from 'modules/common/components/input/input'
import InputDropdown from 'modules/common/components/input-dropdown/input-dropdown'
import { ZERO } from 'modules/trade/constants/numbers'
import { ETH, REP } from 'modules/account/constants/asset-types'
import { ExclamationCircle as InputErrorIcon, Withdraw } from 'modules/common/components/icons'
import isAddress from 'modules/auth/helpers/is-address'
import FormStyles from 'modules/common/less/form'
import Styles from 'modules/account/components/account-withdraw/account-withdraw.styles'

export default class AccountWithdraw extends Component {
  static propTypes = {
    isMobileSmall: PropTypes.bool.isRequired,
    eth: PropTypes.object.isRequired,
    rep: PropTypes.object.isRequired,
    transferFunds: PropTypes.func.isRequired,
  }

  static validateAddress(address, callback) {
    const sanitizedAddress = sanitizeArg(address)
    const updatedErrors = {}

    if (address && !isAddress(sanitizedAddress)) {
      updatedErrors.address = `Address is invalid`
    }

    if (address === '') {
      updatedErrors.address = `Address is required`
    }


    callback(updatedErrors, sanitizedAddress)
  }

  constructor(props) {
    super(props)

    this.DEFAULT_STATE = {
      upperBound: props.eth.fullPrecision,
      selectedAsset: ETH,
      amount: '',
      address: '',
      isValid: null,
    }

    this.state = Object.assign(this.DEFAULT_STATE, { errors: {} })
    this.validateForm = this.validateForm.bind(this)
    this.submitForm = this.submitForm.bind(this)
  }

  validateAmount(amount, callback) {
    const sanitizedAmount = sanitizeArg(amount)
    const BNsanitizedAmount = createBigNumber(sanitizedAmount || 0)
    const BNupperlimit = createBigNumber(this.state.upperBound)
    const updatedErrors = {}

    if (amount === '') {
      updatedErrors.amount = `Quantity is required.`
    }

    if (amount && isNaN(parseFloat(sanitizedAmount))) {
      updatedErrors.amount = `Quantity isn't a number.`
    }

    if (amount && !isFinite(sanitizedAmount)) {
      updatedErrors.amount = `Quantity isn't finite.`
    }

    if (amount && BNsanitizedAmount.gt(BNupperlimit)) {
      updatedErrors.amount = `Quantity is greater than available funds.`
    }

    if (amount && BNsanitizedAmount.lte(ZERO)) {
      updatedErrors.amount = `Quantity must be greater than zero.`
    }

    callback(updatedErrors, sanitizedAmount)
  }

  validateForm(amountValue, addressValue) {
    this.validateAmount(amountValue, (amountErrors, sanitizedAmount) => {
      AccountWithdraw.validateAddress(addressValue, (addressErrors, sanitizedAddress) => {
        const updatedErrors = Object.assign(amountErrors, addressErrors)
        this.setState({
          errors: updatedErrors,
          isValid: !amountErrors.amount && !addressErrors.address,
          address: sanitizedAddress,
          amount: sanitizedAmount,
        })
      })
    })
  }

  submitForm() {
    const { transferFunds } = this.props
    const s = this.state

    if (s.isValid) {
      const stringedAmount = BigNumber.isBigNumber(s.amount) ? s.amount.toString() : s.amount
      transferFunds(stringedAmount, s.selectedAsset, s.address)
      const { selectedAsset } = s
      this.setState(this.DEFAULT_STATE, () => {
        this.setState({
          selectedAsset,
        })
      })
    }
  }

  render() {
    const {
      eth,
      isMobileSmall,
      rep,
    } = this.props
    const s = this.state

    return (
      <section className={Styles.AccountWithdraw}>
        <div className={Styles.AccountWithdraw__heading}>
          <h1>Account: Withdraw</h1>
          { Withdraw }
        </div>
        <div className={Styles.AccountWithdraw__main}>
          <div className={Styles.AccountWithdraw__description}>
            <p>Withdraw Ethereum or Reputation from your Trading Account into another account.</p>
            <a href="https://shapeshift.io/">Use Shapeshift</a>
          </div>
          <div className={Styles.AccountWithdraw__form}>
            <div className={Styles['AccountWithdraw__form-fields']}>
              <div className={Styles['AccountWithdraw__input-wrapper']}>
                <label htmlFor="currency">Select Currency</label>
                <InputDropdown
                  name="currency"
                  className={Styles.AccountWithdraw__dropdown}
                  label="Select Currency"
                  options={['ETH', 'REP']}
                  default="ETH"
                  type="text"
                  isMobileSmall={isMobileSmall}
                  onChange={(type) => {
                    const selectedAsset = (type === 'ETH') ? ETH : REP
                    const upperBound = (type === 'ETH') ? eth.fullPrecision : rep.fullPrecision
                    this.setState({
                      selectedAsset,
                      upperBound,
                    }, () => {
                      this.validateForm(s.amount, s.address)
                    })
                  }}
                />
              </div>
              <div className={Styles['AccountWithdraw__input-wrapper']}>
                <label htmlFor="quantity">Quantity</label>
                <Input
                  name="quantity"
                  label="Quantity"
                  type="number"
                  isIncrementable
                  incrementAmount={1}
                  max={s.upperBound}
                  min={0.1}
                  value={s.amount}
                  updateValue={amount => this.validateForm(amount, s.address)}
                  onChange={amount => this.validateForm(amount, s.address)}
                />
                { s.errors.hasOwnProperty('amount') && s.errors.amount.length &&
                  <span className={FormStyles['Form__error--even__space']}>
                    {InputErrorIcon}{ s.errors.amount }
                  </span>
                }
              </div>
              <div className={Styles['AccountWithdraw__input-wrapper']}>
                <label htmlFor="address">Recipient Account Address</label>
                <Input
                  name="address"
                  label="Recipient Account Address"
                  type="text"
                  value={s.address}
                  updateValue={address => this.validateForm(s.amount, address)}
                  onChange={address => this.validateForm(s.amount, address)}
                />
                { s.errors.hasOwnProperty('address') && s.errors.address.length &&
                  <span className={FormStyles['Form__error--even__space']}>
                    {InputErrorIcon}{ s.errors.address }
                  </span>
                }
              </div>
            </div>
            <button
              className={Styles.AccountWithdraw__submitButton}
              disabled={!s.isValid}
              onClick={this.submitForm}
            >
              Withdraw
            </button>
          </div>
        </div>
      </section>
    )
  }
}

function sanitizeArg(arg) {
  return (arg == null || arg === '') ? '' : arg
}
