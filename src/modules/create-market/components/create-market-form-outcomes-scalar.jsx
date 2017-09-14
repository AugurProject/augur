import React, { Component } from 'react'
import PropTypes from 'prop-types'
import BigNumber from 'bignumber.js'
import { abi } from 'services/augurjs'

import Input from 'modules/common/components/input/input'
import CreateMarketFormInputNotifications from 'modules/create-market/components/create-market-form-input-notifications'

import newMarketCreationOrder from 'modules/create-market/constants/new-market-creation-order'
import { NEW_MARKET_OUTCOMES } from 'modules/create-market/constants/new-market-creation-steps'

export default class CreateMarketFormOutcomesScalar extends Component {
  static propTypes = {
    currentStep: PropTypes.number.isRequired,
    scalarSmallNum: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.instanceOf(BigNumber)
    ]).isRequired,
    scalarBigNum: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.instanceOf(BigNumber)
    ]).isRequired,
    updateValidity: PropTypes.func.isRequired,
    updateNewMarket: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props)

    this.state = {
      errors: {
        small: [],
        big: []
      },
      scalarMin: abi.unfix(abi.constants.SERPINT_MIN).round(18, BigNumber.ROUND_DOWN),
      scalarMax: abi.unfix(abi.constants.SERPINT_MAX).round(18, BigNumber.ROUND_DOWN),
      scalarSmallNum: '',
      scalarBigNum: ''
    }

    this.validateForm = this.validateForm.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.currentStep !== nextProps.currentStep && newMarketCreationOrder[nextProps.currentStep] === NEW_MARKET_OUTCOMES) this.validateForm(nextProps.scalarSmallNum, nextProps.scalarBigNum)
  }

  componentDidUpdate(prevProps) {
    if (prevProps.currentStep !== this.props.currentStep &&
      this.props.currentStep === newMarketCreationOrder.indexOf(NEW_MARKET_OUTCOMES)
    ) {
      this.defaultFormToFocus.getElementsByTagName('input')[0].focus()
    }
  }

  validateForm(scalarSmallNumRaw, scalarBigNumRaw) {
    const errors = {
      small: [],
      big: []
    }

    const sanitizeValue = (value, type) => {
      if (value == null) {
        if (type === 'big') {
          return this.props.scalarBigNum
        }
        return this.props.scalarSmallNum
      } else if (!(value instanceof BigNumber) && value !== '') {
        return new BigNumber(value)
      }

      return value
    }

    const scalarSmallNum = sanitizeValue(scalarSmallNumRaw)
    const scalarBigNum = sanitizeValue(scalarBigNumRaw, 'big')
    const outcomes = new Array(2)

    if (scalarBigNumRaw == null && scalarSmallNum !== '') {
      if (scalarBigNum !== '' && scalarSmallNum.greaterThanOrEqualTo(scalarBigNum)) {
        errors.small.push(`Must be smaller than maximum value of: ${scalarBigNum}`)
      } else if (scalarSmallNum.lessThan(this.state.scalarMin)) {
        errors.small.push(`Must be greater than: ${this.state.scalarMin.toNumber()}`)
      }
    } else if (scalarBigNum !== '') {
      if (scalarSmallNum !== '' && scalarBigNum.lessThanOrEqualTo(scalarSmallNum)) {
        errors.big.push(`Must be greater than minimum value of: ${scalarSmallNum}`)
      } else if (scalarBigNum.greaterThan(this.state.scalarMax)) {
        errors.big.push(`Must be less than: ${this.state.scalarMax.toNumber()}`)
      }
    }

    // Handle outcomes
    if (errors.small.length) {
      outcomes[0] = ''
    } else {
      outcomes[0] = `${scalarSmallNum}`
    }

    if (errors.big.length) {
      outcomes[1] = ''
    } else {
      outcomes[1] = `${scalarBigNum}`
    }

    if (errors.small.length || errors.big.length || scalarSmallNum === '' || scalarBigNum === '') {
      this.props.updateValidity(false)
    } else {
      this.props.updateValidity(true)
    }

    this.setState({ errors })

    this.props.updateNewMarket({ scalarSmallNum, scalarBigNum, outcomes })
  }

  render() {
    const p = this.props
    const s = this.state

    const maxSmall = p.scalarBigNum === '' ? undefined : p.scalarBigNum
    const minBig = p.scalarSmallNum === '' ? undefined : p.scalarSmallNum

    return (
      <article className="create-market-form-part-content">
        <div className="create-market-form-part-input">
          <aside>
            <h3>Minimum Value</h3>
            <span>What is the <strong>minimum</strong> value possible for this event.</span>
          </aside>
          <div className="vertical-form-divider" />
          <form
            ref={(defaultFormToFocus) => { this.defaultFormToFocus = defaultFormToFocus }}
            onSubmit={e => e.preventDefault()}
          >
            <Input
              className="constrained-width"
              type="number"
              isIncrementable
              incrementAmount={1}
              min={s.scalarMin}
              max={maxSmall}
              value={p.scalarSmallNum}
              updateValue={scalarSmallNum => this.validateForm(scalarSmallNum, undefined)}
              onChange={scalarSmallNum => this.validateForm(scalarSmallNum, undefined)}
            />
            <CreateMarketFormInputNotifications
              errors={s.errors.small}
            />
          </form>
        </div>
        <div className="create-market-form-part-input">
          <aside>
            <h3>Maximum Value</h3>
            <span>What is the <strong>maximum</strong> value possible for this event.</span>
          </aside>
          <div className="vertical-form-divider" />
          <form onSubmit={e => e.preventDefault()} >
            <Input
              className="constrained-width"
              type="number"
              isIncrementable
              incrementAmount={1}
              min={minBig}
              max={s.scalarMax}
              value={p.scalarBigNum}
              updateValue={scalarBigNum => this.validateForm(undefined, scalarBigNum)}
              onChange={scalarBigNum => this.validateForm(undefined, scalarBigNum)}
            />
            <CreateMarketFormInputNotifications
              errors={s.errors.big}
            />
          </form>
        </div>
      </article>
    )
  }
}
