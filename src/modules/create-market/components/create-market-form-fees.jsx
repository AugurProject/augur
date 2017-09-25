import React, { Component } from 'react'
import PropTypes from 'prop-types'
import BigNumber from 'bignumber.js'

import Input from 'modules/common/components/input/input'
import CreateMarketFormInputNotifications from 'modules/create-market/components/create-market-form-input-notifications'

import { formatPercent } from 'utils/format-number'

import { TWO } from 'modules/trade/constants/numbers'
import { TAKER_FEE_MIN, TAKER_FEE_MAX, MAKER_FEE_MIN } from 'modules/create-market/constants/new-market-constraints'
import newMarketCreationOrder from 'modules/create-market/constants/new-market-creation-order'
import { NEW_MARKET_FEES } from 'modules/create-market/constants/new-market-creation-steps'

export default class CreateMarketFormDescription extends Component {
  static propTypes = {
    currentStep: PropTypes.number.isRequired,
    takerFee: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]).isRequired,
    makerFee: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]).isRequired,
    updateValidity: PropTypes.func.isRequired,
    updateNewMarket: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props)

    this.state = {
      errors: {
        taker: [],
        maker: []
      },
      warnings: {
        taker: [],
        maker: []
      },
      makerFee: this.props.makerFee,
      takerFee: this.props.takerFee
    }

    this.validateForm = this.validateForm.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.currentStep !== nextProps.currentStep && newMarketCreationOrder[nextProps.currentStep] === NEW_MARKET_FEES) nextProps.updateValidity(true, true)
    if (nextProps.makerFee !== this.state.makerFee || nextProps.takerFee !== this.state.takerFee) {
      // when clearMarket button is pressed and user navigates back here the state will still be the old fee values. this call makes sure to reset them if they don't line up with props passed.
      this.setState({ makerFee: nextProps.makerFee, takerFee: nextProps.takerFee })
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.currentStep !== this.props.currentStep &&
      this.props.currentStep === newMarketCreationOrder.indexOf(NEW_MARKET_FEES)
    ) {
      this.defaultFormToFocus.getElementsByTagName('input')[0].focus()
    }
  }

  validateForm(takerFeeRaw, makerFeeRaw, init) {
    const errors = {
      taker: [],
      maker: []
    }
    const warnings = {
      taker: [],
      maker: []
    }

    const takerFee = takerFeeRaw === undefined ? this.state.takerFee : takerFeeRaw
    const makerFee = makerFeeRaw === undefined ? this.state.makerFee : makerFeeRaw

    const takerFeeError = validateTakerFee(takerFee)
    if (takerFeeError) {
      errors.taker.push(takerFeeError)
      this.props.updateNewMarket({ takerFee: '' })
    } else {
      this.props.updateNewMarket({ takerFee })
    }

    const makerFeeError = validateMakerFee(makerFee, takerFee)
    if (makerFeeError) {
      errors.maker.push(makerFeeError)
      this.props.updateNewMarket({ makerFee: '' })
    } else {
      this.props.updateNewMarket({ makerFee })
    }

    // Error Check
    if (errors.taker.length || errors.maker.length) {
      this.props.updateValidity(false)
    } else {
      this.props.updateValidity(true)
    }

    // Warning Check
    //    Taker
    if (!init) {
      if (takerFeeRaw !== undefined) {
        if (takerFee === TAKER_FEE_MIN) {
          warnings.taker.push(`Taker fee minimum is: ${TAKER_FEE_MIN}%`)
        } else if (takerFee === TAKER_FEE_MAX) {
          warnings.taker.push(`Taker fee maximum is: ${TAKER_FEE_MAX}%`)
        }
      }

      if (makerFeeRaw !== undefined) {
        const makerFeeMax = new BigNumber(takerFee || TAKER_FEE_MAX).dividedBy(TWO).toNumber()
        if (makerFee === MAKER_FEE_MIN) {
          warnings.maker.push(`Maker fee minimum is: ${MAKER_FEE_MIN}%`)
        } else if (makerFee === makerFeeMax) {
          warnings.maker.push(`Maker fee maximum is: ${makerFeeMax}%`)
        }
      }
    }

    this.setState({ errors, warnings, takerFee, makerFee })
  }

  render() {
    const p = this.props
    const s = this.state

    const makerFeeMax = new BigNumber(p.takerFee || TAKER_FEE_MAX).dividedBy(TWO).toNumber()

    return (
      <article className={`create-market-form-part create-market-form-fees ${p.className || ''}`}>
        <div className="create-market-form-part-content">
          <div className="create-market-form-part-input">
            <aside>
              <h3>Taker Fee</h3>
              <span>Specify the fee paid by those taking an existing order from the order book.</span>
            </aside>
            <div className="vertical-form-divider" />
            <form
              ref={(defaultFormToFocus) => { this.defaultFormToFocus = defaultFormToFocus }}
              onSubmit={e => e.preventDefault()}
            >
              <Input
                type="number"
                value={s.takerFee}
                isIncrementable
                incrementAmount={0.1}
                min={TAKER_FEE_MIN}
                max={TAKER_FEE_MAX}
                updateValue={(takerFee) => {
                  const sanitizedTakerFee = sanitizeFee(takerFee)
                  this.validateForm(sanitizedTakerFee)
                }}
                onChange={(takerFee) => {
                  const sanitizedTakerFee = sanitizeFee(takerFee)
                  this.validateForm(sanitizedTakerFee)
                }}
              />
              <CreateMarketFormInputNotifications
                errors={s.errors.taker}
                warnings={s.warnings.taker}
              />
            </form>
          </div>
          <div className="create-market-form-part-input">
            <aside>
              <h3>Maker Fee</h3>
              <span>Specify the fee paid by those adding an order to the order book.</span>
            </aside>
            <div className="vertical-form-divider" />
            <form onSubmit={e => e.preventDefault()} >
              <Input
                type="number"
                value={s.makerFee}
                isIncrementable
                incrementAmount={0.1}
                min={MAKER_FEE_MIN}
                max={makerFeeMax}
                updateValue={(makerFee) => {
                  const sanitizedMakerFee = sanitizeFee(makerFee)
                  this.validateForm(undefined, sanitizedMakerFee)
                }}
                onChange={(makerFee) => {
                  const sanitizedMakerFee = sanitizeFee(makerFee)
                  this.validateForm(undefined, sanitizedMakerFee)
                }}
              />
              <CreateMarketFormInputNotifications
                errors={s.errors.maker}
                warnings={s.warnings.maker}
              />
            </form>
          </div>
        </div>
      </article>
    )
  }
}

function validateTakerFee(takerFee) {
  if (takerFee === '') {
    return 'Taker fee is required'
  } else if (takerFee < TAKER_FEE_MIN || takerFee > TAKER_FEE_MAX) {
    return `Taker fee must be between ${
      formatPercent(TAKER_FEE_MIN, true).full
      } and ${
      formatPercent(TAKER_FEE_MAX, true).full
      }`
  }
}

function validateMakerFee(makerFee, takerFee) {
  let halfTakerFee
  if (isNaN(parseFloat(takerFee))) {
    halfTakerFee = 0
  } else {
    halfTakerFee = new BigNumber(takerFee).dividedBy(TWO).toNumber()
  }

  if (makerFee === '') {
    return 'Maker fee required'
  } else if (makerFee < MAKER_FEE_MIN || makerFee > halfTakerFee) {
    return `Maker fee must be between ${
      formatPercent(MAKER_FEE_MIN, true).full
      } and ${
      formatPercent(halfTakerFee, true).full
      }`
  }
}

function sanitizeFee(fee) {
  if (fee === '') {
    return fee
  }

  return fee instanceof BigNumber ? fee.toNumber() : parseFloat(fee)
}
