/* eslint jsx-a11y/label-has-for: 0 */

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import moment from 'moment'

import 'react-dates/initialize'
import 'react-dates/lib/css/_datepicker.css'
import { SingleDatePicker } from 'react-dates'

import { formatDate } from 'utils/format-date'
import { EXPIRY_SOURCE_GENERIC, EXPIRY_SOURCE_SPECIFIC, DESIGNATED_REPORTER_SELF, DESIGNATED_REPORTER_SPECIFIC } from 'modules/create-market/constants/new-market-constraints'

import isAddress from 'modules/auth/helpers/is-address'

import InputDropdown from 'modules/common/components/input-dropdown/input-dropdown'
import { ExclamationCircle as InputErrorIcon } from 'modules/common/components/icons'

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
    validateNumber: PropTypes.func.isRequired,
    isValid: PropTypes.func.isRequired,
    isMobileSmall: PropTypes.bool.isRequired,
  }

  constructor(props) {
    super(props)

    this.state = {
      // expirySourceType: false,
      date: Object.keys(this.props.newMarket.endDate).length ? moment(this.props.newMarket.endDate.timestamp * 1000) : null,
      focused: false,
    }

    this.validateExpiryType = this.validateExpiryType.bind(this)
  }

  validateDesignatedReporterType(value) {
    const p = this.props
    const updatedMarket = { ...p.newMarket }
    const { currentStep } = p.newMarket

    if (value === DESIGNATED_REPORTER_SPECIFIC) {
      updatedMarket.validations[currentStep].designatedReporterAddress =
        updatedMarket.validations[currentStep].designatedReporterAddress
          ? updatedMarket.validations[currentStep].designatedReporterAddress
          : false
    } else {
      delete updatedMarket.validations[currentStep].designatedReporterAddress
    }

    updatedMarket.validations[currentStep].designatedReporterType = true
    updatedMarket.designatedReporterType = value
    updatedMarket.isValid = p.isValid(currentStep)

    p.updateNewMarket(updatedMarket)
  }

  validateDesignatedReporterAddress(value) {
    const p = this.props

    const { currentStep } = p.newMarket
    const updatedMarket = { ...p.newMarket }

    if (!isAddress(value)) {
      updatedMarket.validations[currentStep].designatedReporterAddress = 'The Designated Reporter Address must be a valid Ethereum Address.'
    } else {
      updatedMarket.validations[currentStep].designatedReporterAddress = true
    }

    updatedMarket.designatedReporterAddress = value
    updatedMarket.isValid = p.isValid(currentStep)

    p.updateNewMarket(updatedMarket)
  }

  validateExpiryType(value) {
    const p = this.props

    const { currentStep } = p.newMarket
    const updatedMarket = { ...p.newMarket }

    if (value === EXPIRY_SOURCE_SPECIFIC) {
      updatedMarket.validations[currentStep].expirySource =
        updatedMarket.validations[currentStep].expirySource
          ? updatedMarket.validations[currentStep].expirySource
          : false
    } else {
      delete updatedMarket.validations[currentStep].expirySource
    }

    updatedMarket.validations[p.newMarket.currentStep].expirySourceType = true
    updatedMarket.expirySourceType = value
    updatedMarket.isValid = p.isValid(p.newMarket.currentStep)

    p.updateNewMarket(updatedMarket)
  }

  render() {
    const p = this.props
    const validations = p.newMarket.validations[p.newMarket.currentStep]
    const { utcLocalOffset } = formatDate(new Date(p.currentTimestamp))

    const designatedReporterError = p.newMarket.designatedReporterType === DESIGNATED_REPORTER_SPECIFIC && validations.designatedReporterAddress && !!validations.designatedReporterAddress.length

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
                onClick={() => this.validateExpiryType(EXPIRY_SOURCE_GENERIC)}
              >Outcome will be determined by news media
              </button>
            </li>
            <li className={Styles['CreateMarketResolution__expiry-source-specific']}>
              <button
                className={classNames({ [`${StylesForm.active}`]: p.newMarket.expirySourceType === EXPIRY_SOURCE_SPECIFIC })}
                onClick={() => this.validateExpiryType(EXPIRY_SOURCE_SPECIFIC)}
              >Outcome will be detailed on a public website
              </button>
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
        <li>
          <label>
            <span>Designated Reporter</span>
          </label>
          <ul className={StylesForm['CreateMarketForm__radio-buttons--per-line']}>
            <li>
              <button
                className={classNames({ [`${StylesForm.active}`]: p.newMarket.designatedReporterType === DESIGNATED_REPORTER_SELF })}
                onClick={() => this.validateDesignatedReporterType(DESIGNATED_REPORTER_SELF)}
              >Myself
              </button>
            </li>
            <li className={Styles['CreateMarketResolution__designated-reporter-specific']}>
              <button
                className={classNames({ [`${StylesForm.active}`]: p.newMarket.designatedReporterType === DESIGNATED_REPORTER_SPECIFIC })}
                onClick={() => this.validateDesignatedReporterType(DESIGNATED_REPORTER_SPECIFIC)}
              >Someone Else
              </button>
              <div>
                { p.newMarket.designatedReporterType === DESIGNATED_REPORTER_SPECIFIC &&
                  <input
                    className={classNames({ [`${StylesForm['CreateMarketForm__error--field']}`]: designatedReporterError })}
                    type="text"
                    value={p.newMarket.designatedReporterAddress}
                    placeholder="Designated Reporter Address"
                    onChange={e => this.validateDesignatedReporterAddress(e.target.value)}
                  />
                }
                { designatedReporterError &&
                  <span className={StylesForm['CreateMarketForm__error--bottom']}>
                    {InputErrorIcon}{
                      p.newMarket.validations[p.newMarket.currentStep].designatedReporterAddress
                    }
                  </span>
                }
              </div>
            </li>
          </ul>
        </li>
        <li className={Styles.CreateMarketResolution__datepicker}>
          <label htmlFor="cm__input--date">
            <span>Expiration Date</span>
          </label>
          <SingleDatePicker
            id="cm__input--date"
            date={this.state.date}
            onDateChange={(date) => { this.setState({ date }); p.validateField('endDate', formatDate(date.toDate())) }}
            focused={this.state.focused}
            onFocusChange={({ focused }) => this.setState({ focused })}
            displayFormat="MMM D, YYYY"
            numberOfMonths={1}
            navPrev={<ChevronLeft />}
            navNext={<ChevronRight />}
          />
        </li>
        <li>
          <label htmlFor="cm__input--time">
            <span>Expiration Time (UTC { utcLocalOffset })</span>
            { p.newMarket.validations[p.newMarket.currentStep].hour.length &&
              <span className={StylesForm.CreateMarketForm__error}>{InputErrorIcon}{ p.newMarket.validations[p.newMarket.currentStep].hour }</span>
            }
            { p.newMarket.validations[p.newMarket.currentStep].minute.length &&
              <span className={StylesForm.CreateMarketForm__error}>{InputErrorIcon}{ p.newMarket.validations[p.newMarket.currentStep].minute }</span>
            }
          </label>
          <div className={Styles.CreateMarketResolution__time}>
            <input
              id="cm__input--time"
              type="number"
              min="1"
              max="12"
              step="1"
              value={p.newMarket.hour}
              placeholder="Hour"
              onChange={e => p.validateNumber('hour', e.target.value, 'hour', 1, 12, 0)}
            />
            <input
              type="number"
              min="0"
              max="59"
              step="1"
              value={p.newMarket.minute}
              placeholder="Minute"
              onBlur={e => this.props.validateNumber('minute', e.target.value, 'minute', 0, 59, 0, true)}
              onChange={e => p.validateNumber('minute', e.target.value, 'minute', 0, 59, 0)}
            />
            <InputDropdown
              label="AM/PM"
              default={p.newMarket.meridiem || ''}
              options={['AM', 'PM']}
              onChange={value => p.validateField('meridiem', value)}
              isMobileSmall={this.props.isMobileSmall}
            />
          </div>
        </li>
      </ul>
    )
  }
}
