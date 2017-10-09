/* eslint jsx-a11y/label-has-for: 0 */

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import 'react-dates/initialize'
import 'react-dates/lib/css/_datepicker.css'
import { SingleDatePicker } from 'react-dates'

import { formatDate } from 'utils/format-date'
import { EXPIRY_SOURCE_GENERIC, EXPIRY_SOURCE_SPECIFIC } from 'modules/create-market/constants/new-market-constraints'

import Styles from 'modules/create-market/components/create-market-form-resolution/create-market-form-resolution.styles'
import StylesForm from 'modules/create-market/components/create-market-form/create-market-form.styles'

export const ChevronLeft = () => (
  <svg viewBox="0 0 8 14" xmlns="http://www.w3.org/2000/svg">
    <g id="Symbols" fill="none" fillRule="evenodd" strokeLinecap="round" opacity=".54" strokeLinejoin="round"><g id="Selector/Calendar" stroke="#231A3A"><g id="Group-2"><g id="Icon/chevron-left"><path id="Stroke-3" d="M7.362 13.228L.998 6.864 7.362.5" /></g></g></g></g>
  </svg>
)

export const ChevronRight = () => (
  <svg viewBox="0 0 9 14" xmlns="http://www.w3.org/2000/svg">
    <g id="Symbols" fill="none" fillRule="evenodd" strokeLinecap="round" opacity=".54" strokeLinejoin="round"><g id="Selector/Calendar" stroke="#231A3A"><g id="Group-2"><g id="Icon/chevron-right"><path id="Stroke-3" d="M1.16 13.228l6.363-6.364L1.16.5" /></g></g></g></g>
  </svg>
)

export default class CreateMarketResolution extends Component {

  static propTypes = {
    newMarket: PropTypes.object.isRequired,
    updateNewMarket: PropTypes.func.isRequired,
    validateField: PropTypes.func.isRequired,
    isValid: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props)

    this.state = {
      expirySourceType: false,
      date: null,
      focused: false,
    }

    this.validateExpiryType = this.validateExpiryType.bind(this)
  }

  validateExpiryType(value) {
    const p = this.props
    const updatedMarket = p.newMarket
    const validations = p.newMarket.validations[p.newMarket.currentStep]

    const updatedValidations = Object.keys(validations).reduce((p, key) => (validations[key] === true ? { ...p, [key]: true } : p), {})

    if (value === EXPIRY_SOURCE_SPECIFIC) {
      updatedValidations.expirySource = updatedValidations.expirySource ? updatedValidations.expirySource : false
    }

    updatedValidations.expirySourceType = true

    updatedMarket.validations[p.newMarket.currentStep] = updatedValidations
    updatedMarket.expirySourceType = value
    updatedMarket.isValid = p.isValid(p.newMarket.currentStep)

    p.updateNewMarket({ newMarket: updatedMarket })
  }

  render() {
    const p = this.props

    return (
      <ul className={StylesForm.CreateMarketForm__fields}>
        <li>
          <label>
            <span>Resolution Source</span>
          </label>
          <ul className={StylesForm['CreateMarketForm__radio-buttons--per-line']}>
            <li>
              <button
                className={classNames({ [`${StylesForm.active}`]: p.newMarket.expirySourceType === EXPIRY_SOURCE_GENERIC })}
                onClick={(e) => { this.setState({ expirySourceType: EXPIRY_SOURCE_GENERIC }); this.validateExpiryType(EXPIRY_SOURCE_GENERIC) }}
              >Outcome will be determined by news media</button>
            </li>
            <li className={Styles['CreateMarketResolution__expiry-source-specific']}>
              <button
                className={classNames({ [`${StylesForm.active}`]: p.newMarket.expirySourceType === EXPIRY_SOURCE_SPECIFIC })}
                onClick={(e) => { this.setState({ expirySourceType: EXPIRY_SOURCE_SPECIFIC }); this.validateExpiryType(EXPIRY_SOURCE_SPECIFIC) }}
              >Outcome will be detailed on a public website</button>
              { p.newMarket.expirySourceType === EXPIRY_SOURCE_SPECIFIC &&
                <input
                  type="text"
                  value={p.newMarket.expirySource}
                  placeholder="Define URL"
                  onChange={e => p.validateField('expirySource', e.target.value)}
                />
              }
            </li>
          </ul>
        </li>
        <li className={Styles.CreateMarketResolution__datepicker}>
          <label htmlFor="cm__input--date">
            <span>Expiration Date</span>
          </label>
          <SingleDatePicker
            date={this.state.date}
            onDateChange={date => this.setState({ date })}
            focused={this.state.focused}
            onFocusChange={({ focused }) => this.setState({ focused })}
            numberOfMonths={1}
            navPrev={<ChevronLeft />}
            navNext={<ChevronRight />}
          />
        </li>
      </ul>
    )
  }
}
