import React, { Component } from 'react'
import PropTypes from 'prop-types'
import BigNumber from 'bignumber.js'

import Input from 'modules/common/components/input'
import CreateMarketFormInputNotifications from 'modules/create-market/components/create-market-form-input-notifications'

import { formatPercent } from 'utils/format-number'

import { SETTLEMENT_FEE_MIN, SETTLEMENT_FEE_MAX } from 'modules/create-market/constants/new-market-constraints'
import newMarketCreationOrder from 'modules/create-market/constants/new-market-creation-order'
import { NEW_MARKET_FEES } from 'modules/create-market/constants/new-market-creation-steps'

export default class CreateMarketFormDescription extends Component {
  static propTypes = {
    currentStep: PropTypes.number.isRequired,
    settlementFee: PropTypes.oneOfType([
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
        settlement: []
      },
      warnings: {
        settlement: []
      },
      settlementFee: this.props.settlementFee
    }

    this.validateForm = this.validateForm.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.currentStep !== nextProps.currentStep && newMarketCreationOrder[nextProps.currentStep] === NEW_MARKET_FEES) {
      nextProps.updateValidity(true, true)
    }
    if (nextProps.settlementFee !== this.state.settlementFee) {
      // when clearMarket button is pressed and user navigates back here the state will still be the old fee values. this call makes sure to reset them if they don't line up with props passed.
      this.setState({ settlementFee: nextProps.settlementFee })
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.currentStep !== this.props.currentStep && this.props.currentStep === newMarketCreationOrder.indexOf(NEW_MARKET_FEES)) {
      this.defaultFormToFocus.getElementsByTagName('input')[0].focus()
    }
  }

  validateForm(settlementFeeRaw, init) {
    const errors = {
      settlementFee: []
    }
    const warnings = {
      settlementFee: []
    }

    const settlementFee = settlementFeeRaw === undefined ? this.state.settlementFee : settlementFeeRaw

    const settlementFeeError = validateSettlementFee(settlementFee)
    if (settlementFeeError) {
      errors.settlementFee.push(settlementFeeError)
      this.props.updateNewMarket({ settlementFee: '' })
    } else {
      this.props.updateNewMarket({ settlementFee })
    }

    // Error Check
    if (errors.settlementFee.length) {
      this.props.updateValidity(false)
    } else {
      this.props.updateValidity(true)
    }

    // Warning Check
    if (!init) {
      if (settlementFeeRaw !== undefined) {
        if (settlementFee === SETTLEMENT_FEE_MIN) {
          warnings.settlementFee.push(`Settlement fee minimum is: ${SETTLEMENT_FEE_MIN}%`)
        } else if (settlementFee === SETTLEMENT_FEE_MAX) {
          warnings.settlementFee.push(`Settlement fee maximum is: ${SETTLEMENT_FEE_MAX}%`)
        }
      }
    }

    this.setState({ errors, warnings, settlementFee })
  }

  render() {
    const p = this.props
    const s = this.state

    return (
      <article className={`create-market-form-part create-market-form-fees ${p.className || ''}`}>
        <div className="create-market-form-part-content">
          <div className="create-market-form-part-input">
            <aside>
              <h3>Settlement Fee</h3>
              <span>Specify the settlement fee paid to you (the market creator).  (Note: this does not include fees paid to Reporters, which are calculated separately.)</span>
            </aside>
            <div className="vertical-form-divider" />
            <form
              ref={(defaultFormToFocus) => { this.defaultFormToFocus = defaultFormToFocus }}
              onSubmit={e => e.preventDefault()}
            >
              <Input
                type="number"
                value={s.settlementFee}
                isIncrementable
                incrementAmount={0.1}
                min={SETTLEMENT_FEE_MIN}
                max={SETTLEMENT_FEE_MAX}
                updateValue={(settlementFee) => {
                  const sanitizedSettlementFee = sanitizeFee(settlementFee)
                  this.validateForm(sanitizedSettlementFee)
                }}
                onChange={(settlementFee) => {
                  const sanitizedSettlementFee = sanitizeFee(settlementFee)
                  this.validateForm(sanitizedSettlementFee)
                }}
              />
              <CreateMarketFormInputNotifications
                errors={s.errors.settlement}
                warnings={s.warnings.settlement}
              />
            </form>
          </div>
        </div>
      </article>
    )
  }
}

function validateSettlementFee(settlementFee) {
  if (settlementFee === '') {
    return 'Settlement fee is required'
  } else if (settlementFee < SETTLEMENT_FEE_MIN || settlementFee > SETTLEMENT_FEE_MAX) {
    return `Settlement fee must be between ${
      formatPercent(SETTLEMENT_FEE_MIN, true).full
      } and ${
      formatPercent(SETTLEMENT_FEE_MAX, true).full
      }`
  }
}

function sanitizeFee(fee) {
  if (fee === '') {
    return fee
  }

  return fee instanceof BigNumber ? fee.toNumber() : parseFloat(fee)
}
