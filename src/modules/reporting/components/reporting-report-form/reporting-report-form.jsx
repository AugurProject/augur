/* eslint jsx-a11y/label-has-for: 0 */

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import { BINARY, CATEGORICAL, SCALAR } from 'modules/markets/constants/market-types'

import FormStyles from 'modules/common/less/form'
import Styles from 'modules/reporting/components/reporting-report-form/reporting-report-form.styles'
import { ExclamationCircle as InputErrorIcon } from 'modules/common/components/icons'

export default class ReportingReportForm extends Component {

  static propTypes = {
    market: PropTypes.object.isRequired,
    updateState: PropTypes.func.isRequired,
    validations: PropTypes.object.isRequired,
    selectedOutcome: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    stake: PropTypes.string.isRequired,
    isOpenReporting: PropTypes.bool.isRequired,
    isMarketInValid: PropTypes.bool,
  }

  static BUTTONS = {
    MARKET_IS_INVALID: 'MARKET_IS_INVALID',
    SCALAR_VALUE: 'SCALAR_VALUE',
  }
  constructor(props) {
    super(props)

    this.state = {
      outcomes: [],
      inputSelectedOutcome: this.props.market.marketType === SCALAR && this.props.selectedOutcome ? this.props.selectedOutcome : '',
      activeButton: '',
    }

    if (this.props.market.marketType === SCALAR && this.props.selectedOutcome) {
      this.state.activeButton = this.props.isMarketInValid ? ReportingReportForm.BUTTONS.MARKET_IS_INVALID : ReportingReportForm.BUTTONS.SCALAR_VALUE
    }

    this.state.outcomes = this.props.market ? this.props.market.outcomes.slice() : []
    if (this.props.market && this.props.market.marketType === BINARY && this.props.market.outcomes.length === 1) {
      this.state.outcomes.push({ id: 0, name: 'No' })
    }
    this.state.outcomes.sort((a, b) => a.name - b.name)

    this.focusTextInput = this.focusTextInput.bind(this)
  }

  setMarketInvalid(buttonName) {
    this.state.activeButton = buttonName
    if (buttonName === ReportingReportForm.BUTTONS.MARKET_IS_INVALID) {
      const updatedValidations = { ...this.props.validations }
      delete updatedValidations.err
      updatedValidations.selectedOutcome = true
      this.state.inputSelectedOutcome = ''
      this.props.updateState({
        isMarketInValid: true,
        validations: updatedValidations,
        selectedOutcome: '',
      })
    }
  }

  focusTextInput() {
    this.textInput.focus()
  }

  validateOutcome(validations, selectedOutcome, selectedOutcomeName, isMarketInValid) {
    const updatedValidations = { ...validations }
    updatedValidations.selectedOutcome = true
    delete updatedValidations.err

    this.state.inputSelectedOutcome = ''
    this.props.updateState({
      validations: updatedValidations,
      selectedOutcome,
      selectedOutcomeName,
      isMarketInValid,
    })
  }

  validateScalar(validations, value, humanName, min, max, isInvalid) {
    const updatedValidations = { ...validations }
    this.state.activeButton = ReportingReportForm.BUTTONS.SCALAR_VALUE
    const minValue = parseFloat(min)
    const maxValue = parseFloat(max)
    const valueValue = parseFloat(value)

    if (value === '') {
      this.focusTextInput()
    }

    switch (true) {
      case value === '':
        updatedValidations.err = `The ${humanName} field is required.`
        break
      case isNaN(valueValue):
        updatedValidations.err = `The ${humanName} field is a number.`
        break
      case (valueValue > maxValue || valueValue < minValue):
        updatedValidations.err = `Please enter a ${humanName} between ${min} and ${max}.`
        break
      default:
        delete updatedValidations.err
        updatedValidations.selectedOutcome = true
        break
    }

    this.state.inputSelectedOutcome = value

    this.props.updateState({
      validations: updatedValidations,
      selectedOutcome: value,
      selectedOutcomeName: value ? value.toString() : '',
      isMarketInValid: isInvalid,
    })
  }

  render() {
    const p = this.props
    const s = this.state

    return (
      <ul className={classNames(Styles.ReportingReportForm__fields, FormStyles.Form__fields)}>
        <li>
          <label>
            <span>Outcome</span>
          </label>
        </li>
        { (p.market.marketType === BINARY || p.market.marketType === CATEGORICAL) &&
          <li>
            <ul className={FormStyles['Form__radio-buttons--per-line']}>
              { s.outcomes.map(outcome => (
                <li key={outcome.id}>
                  <button
                    className={classNames({ [`${FormStyles.active}`]: p.selectedOutcome === outcome.id })}
                    onClick={(e) => { this.validateOutcome(p.validations, outcome.id, outcome.name, false) }}
                  >{outcome.name}
                  </button>
                </li>
              ))
              }
              <li className={FormStyles['Form__radio-buttons--per-line']}>
                <button
                  className={classNames({ [`${FormStyles.active}`]: p.isMarketInValid === true })}
                  onClick={(e) => { this.setMarketInvalid(ReportingReportForm.BUTTONS.MARKET_IS_INVALID) }}
                >Market is invalid
                </button>
              </li>
            </ul>
          </li>
        }
        { p.market.marketType === SCALAR &&
          <li className={FormStyles['field--short']}>
            <ul className={FormStyles['Form__radio-buttons--per-line']}>
              <li>
                <button
                  className={classNames({ [`${FormStyles.active}`]: s.activeButton === ReportingReportForm.BUTTONS.SCALAR_VALUE })}
                  onClick={(e) => { this.validateScalar(p.validations, '', 'selectedOutcome', p.market.minPrice, p.market.maxPrice, false) }}
                />
                <input
                  id="sr__input--outcome-scalar"
                  type="number"
                  ref={(input) => { this.textInput = input }}
                  min={p.market.minPrice}
                  max={p.market.maxPrice}
                  step={p.market.tickSize}
                  placeholder={p.market.scalarDenomination}
                  value={s.inputSelectedOutcome}
                  className={classNames({ [`${FormStyles['Form__error--field']}`]: p.validations.hasOwnProperty('err') && p.validations.selectedOutcome })}
                  onChange={(e) => { this.validateScalar(p.validations, e.target.value, 'outcome', p.market.minPrice, p.market.maxPrice, false) }}
                />
              </li>
              <li>
                { p.validations.hasOwnProperty('err') &&
                  <span className={FormStyles.Form__error}>
                    {InputErrorIcon}{ p.validations.err }
                  </span>
                }
              </li>
              <li className={FormStyles['Form__radio-buttons--per-line']}>
                <button
                  className={classNames({ [`${FormStyles.active}`]: s.activeButton === ReportingReportForm.BUTTONS.MARKET_IS_INVALID })}
                  onClick={(e) => { this.setMarketInvalid(ReportingReportForm.BUTTONS.MARKET_IS_INVALID) }}
                >Market is invalid
                </button>
              </li>
            </ul>
          </li>
        }
        { !p.isOpenReporting &&
        <li>
          <ul>
            <li className={Styles.ReportingReport__RepLabel}>
              <label htmlFor="sr__input--stake">
                <span>Required Stake</span>
              </label>
            </li>
            <li className={Styles.ReportingReport__RepAmount}>
              <span>{p.stake} REP</span>
            </li>
          </ul>
        </li>
        }
      </ul>
    )
  }
}
