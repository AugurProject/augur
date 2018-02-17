/* eslint jsx-a11y/label-has-for: 0 */

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import { BINARY, CATEGORICAL, SCALAR } from 'modules/markets/constants/market-types'

import FormStyles from 'modules/common/less/form'
import Styles from 'modules/reporting/components/reporting-report-form/reporting-report-form.styles'
import { ExclamationCircle as InputErrorIcon } from 'modules/common/components/icons/icons'

export default class ReportingReportForm extends Component {

  static propTypes = {
    market: PropTypes.object.isRequired,
    updateState: PropTypes.func.isRequired,
    validations: PropTypes.object.isRequired,
    selectedOutcome: PropTypes.string.isRequired,
    stake: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
    isMarketValid: PropTypes.bool
  }

  constructor(props) {
    super(props)

    this.state = {
      outcomes: []
    }
  }

  validateIsMarketValid(validations, isMarketValid, selectedOutcome) {
    const updatedValidations = { ...validations }
    updatedValidations.selectedOutcome = true

    this.props.updateState({
      validations: updatedValidations,
      isMarketValid,
      selectedOutcome: '',
    })
  }

  validateOutcome(validations, selectedOutcome) {
    const updatedValidations = { ...validations }
    updatedValidations.selectedOutcome = true

    this.props.updateState({
      validations: updatedValidations,
      selectedOutcome,
      isMarketValid: true
    })
  }

  validateNumber(validations, fieldName, value, humanName, min, max) {
    const updatedValidations = { ...validations }

    const minValue = parseFloat(min)
    const maxValue = parseFloat(max)
    const valueValue = parseFloat(value)

    switch (true) {
      case value === '':
        updatedValidations[fieldName] = `The ${humanName} field is required.`
        break
      case (valueValue > maxValue || valueValue < minValue):
        updatedValidations[fieldName] = `Please enter a ${humanName} between ${min} and ${max}.`
        break
      default:
        updatedValidations[fieldName] = true
        updatedValidations.selectedOutcome = true
        break
    }

    this.props.updateState({
      validations: updatedValidations,
      selectedOutcome: value,
      isMarketValid: true,
    })
  }

  render() {
    const p = this.props
    const s = this.state

    s.outcomes = p.market ? p.market.outcomes.slice() : []
    if (p.market && p.market.marketType === BINARY && p.market.outcomes.length === 1) {
      s.outcomes.push({ id: 0, name: 'No' })
    }

    return (
      <ul className={classNames(Styles.ReportingReportForm__fields, FormStyles.Form__fields)}>
        <li>
          <label>
            <span>Outcome</span>
          </label>
          { p.validations.hasOwnProperty('selectedOutcome') && p.validations.selectedOutcome.length &&
            <span className={FormStyles.Form__error}>
              {InputErrorIcon}{ p.validations.selectedOutcome }
            </span>
          }
        </li>
        { (p.market.marketType === BINARY || p.market.marketType === CATEGORICAL) &&
          <li>
            <ul className={FormStyles['Form__radio-buttons--per-line']}>
              { s.outcomes && s.outcomes.sort((a, b) => b.stake - a.stake).map(outcome => (
                <li key={outcome.id}>
                  <button
                    className={classNames({ [`${FormStyles.active}`]: p.selectedOutcome === outcome.name })}
                    onClick={(e) => { this.validateOutcome(p.validations, outcome.name) }}
                  >{outcome.name}
                  </button>
                </li>
              ))
              }
              <li className={FormStyles['Form__radio-buttons--per-line']}>
                <button
                  className={classNames({ [`${FormStyles.active}`]: p.isMarketValid === false })}
                  onClick={(e) => { this.validateIsMarketValid(p.validations, false, p.selectedOutcome) }}
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
                  className={classNames({ [`${FormStyles.active}`]: p.selectedOutcome !== '' })}
                  onClick={(e) => { this.validateOutcome(p.validations, 'selectedOutcome') }}
                />
                <input
                  id="sr__input--outcome-scalar"
                  type="number"
                  min={p.market.minPrice}
                  max={p.market.maxPrice}
                  placeholder={p.market.minPrice}
                  value={p.selectedOutcome}
                  className={classNames({ [`${FormStyles['Form__error--field']}`]: p.validations.hasOwnProperty('selectedOutcome') && p.validations.selectedOutcome.length })}
                  onChange={(e) => { this.validateNumber(p.validations, 'selectedOutcome', e.target.value, 'outcome', p.market.minPrice, p.market.maxPrice) }}
                />
              </li>
              <li className={FormStyles['Form__radio-buttons--per-line']}>
                <button
                  className={classNames({ [`${FormStyles.active}`]: p.isMarketValid === false })}
                  onClick={(e) => { this.validateIsMarketValid(p.validations, false, p.selectedOutcome) }}
                >Market is invalid
                </button>
              </li>
            </ul>
          </li>
        }
        <li className={Styles.ReportingReport__RepLabel}>
          <label>
            <span htmlFor="sr__input--stake">Required Stake</span>
            { p.validations.hasOwnProperty('stake') && p.validations.stake.length &&
              <span className={FormStyles.Form__error}>
                { p.validations.stake }
              </span>
            }
          </label>
        </li>
        <li className={Styles.ReportingReport__RepAmount}>
          <span>{p.stake} REP</span>
        </li>
      </ul>
    )
  }
}
