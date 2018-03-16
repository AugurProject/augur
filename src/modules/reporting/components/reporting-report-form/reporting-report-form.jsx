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

  constructor(props) {
    super(props)

    this.state = {
      outcomes: [],
      inputSelectedOutcome: undefined,
    }

    this.state.outcomes = this.props.market ? this.props.market.outcomes.slice() : []
    if (this.props.market && this.props.market.marketType === BINARY && this.props.market.outcomes.length === 1) {
      this.state.outcomes.push({ id: 0, name: 'No' })
    }
    this.state.outcomes.sort((a, b) => a.name - b.name)

    this.focusTextInput = this.focusTextInput.bind(this)
    this.validateOnBlur = this.validateOnBlur.bind(this)
  }

  focusTextInput() {
    this.textInput.focus()
  }

  validateOutcome(validations, selectedOutcome, selectedOutcomeName, isMarketInValid) {
    const updatedValidations = { ...validations }
    updatedValidations.selectedOutcome = true
    delete updatedValidations.err

    this.state.inputSelectedOutcome = undefined
    this.props.updateState({
      validations: updatedValidations,
      selectedOutcome,
      selectedOutcomeName,
      isMarketInValid,
    })
  }

  validateOnBlur() {
    this.validateScalar(this.props.validations, this.state.inputSelectedOutcome, 'outcome', this.props.market.minPrice, this.props.market.maxPrice, this.props.isMarketInValid, true)
  }

  validateScalar(validations, value, humanName, min, max, isInvalid, onBlur) {

    if (value === '' && !onBlur) {
      this.props.updateState({
        isMarketInValid: isInvalid,
      })
      if (isInvalid) {
        delete updatedValidations.err
        updatedValidations.selectedOutcome = true
        return
      }

      this.state.inputSelectedOutcome = value
      this.focusTextInput()
      return
    }
    const updatedValidations = { ...validations }

    if (isInvalid) {
      delete updatedValidations.err
      updatedValidations.selectedOutcome = true

    } else {
      const minValue = parseFloat(min)
      const maxValue = parseFloat(max)
      const valueValue = parseFloat(value)

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
                  onClick={(e) => { this.validateOutcome(p.validations, '', '', true) }}
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
                  className={classNames({ [`${FormStyles.active}`]: s.inputSelectedOutcome !== undefined })}
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
                  onBlur={this.validateOnBlur}
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
                  className={classNames({ [`${FormStyles.active}`]: p.isMarketInValid === true })}
                  onClick={(e) => { this.validateScalar(p.validations, undefined, '', p.market.minPrice, p.market.maxPrice, true) }}
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
