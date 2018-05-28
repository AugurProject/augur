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
    currentTimestamp: PropTypes.number.isRequired,
    isMobileSmall: PropTypes.bool.isRequired,
    isValid: PropTypes.func.isRequired,
    newMarket: PropTypes.object.isRequired,
    updateNewMarket: PropTypes.func.isRequired,
    validateField: PropTypes.func.isRequired,
    validateNumber: PropTypes.func.isRequired,
    keyPressed: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props)

    this.state = {
      // expirySourceType: false,
      date: Object.keys(this.props.newMarket.endTime).length ? moment(this.props.newMarket.endTime.timestamp * 1000) : null,
      focused: false,
      hours: Array.from(new Array(12), (val, index) => index + 1),
      minutes: [...Array.from(Array(10).keys(), (val, index) => '0' + index), ...Array.from(Array(50).keys(), (val, index) => index + 10)],
      ampm: ['AM', 'PM'],
    }

    this.validateExpiryType = this.validateExpiryType.bind(this)
  }

  validateDesignatedReporterType(value) {
    const {
      isValid,
      newMarket,
      updateNewMarket,
    } = this.props
    const updatedMarket = { ...newMarket }
    const { currentStep } = newMarket

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
    updatedMarket.isValid = isValid(currentStep)

    updateNewMarket(updatedMarket)
  }

  validateDesignatedReporterAddress(value) {
    const {
      isValid,
      newMarket,
      updateNewMarket,
    } = this.props
    const { currentStep } = newMarket
    const updatedMarket = { ...newMarket }

    if (!isAddress(value)) {
      updatedMarket.validations[currentStep].designatedReporterAddress = 'Invalid Ethereum address.'
    } else {
      updatedMarket.validations[currentStep].designatedReporterAddress = true
    }

    updatedMarket.designatedReporterAddress = value
    updatedMarket.isValid = isValid(currentStep)

    updateNewMarket(updatedMarket)
  }

  validateExpiryType(value) {
    const {
      isValid,
      newMarket,
      updateNewMarket,
    } = this.props
    const { currentStep } = newMarket
    const updatedMarket = { ...newMarket }

    if (value === EXPIRY_SOURCE_SPECIFIC) {
      updatedMarket.validations[currentStep].expirySource =
        updatedMarket.validations[currentStep].expirySource
          ? updatedMarket.validations[currentStep].expirySource
          : false
    } else {
      delete updatedMarket.validations[currentStep].expirySource
    }

    updatedMarket.validations[newMarket.currentStep].expirySourceType = true
    updatedMarket.expirySourceType = value
    updatedMarket.isValid = isValid(newMarket.currentStep)

    updateNewMarket(updatedMarket)
  }

  render() {
    const {
      currentTimestamp,
      isMobileSmall,
      newMarket,
      validateField,
      validateNumber,
      keyPressed,
    } = this.props
    const s = this.state
    // console.log(s.date)
    const validations = newMarket.validations[newMarket.currentStep]
    const { utcLocalOffset } = formatDate(new Date(currentTimestamp))

    const designatedReporterError = newMarket.designatedReporterType === DESIGNATED_REPORTER_SPECIFIC && validations.designatedReporterAddress && !!validations.designatedReporterAddress.length

    return (
      <ul className={StylesForm.CreateMarketForm__fields}>
        <li>
          <label>
            <span>Resolution Source</span>
          </label>
          <ul className={StylesForm['CreateMarketForm__radio-buttons--per-line']}>
            <li>
              <button
                className={classNames({ [`${StylesForm.active}`]: newMarket.expirySourceType === EXPIRY_SOURCE_GENERIC })}
                onClick={() => this.validateExpiryType(EXPIRY_SOURCE_GENERIC)}
                onKeyPress={e => keyPressed(e)}
              >Outcome will be determined by news media
              </button>
            </li>
            <li className={Styles['CreateMarketResolution__expiry-source-specific']}>
              <button
                className={classNames({ [`${StylesForm.active}`]: newMarket.expirySourceType === EXPIRY_SOURCE_SPECIFIC })}
                onClick={() => this.validateExpiryType(EXPIRY_SOURCE_SPECIFIC)}
                onKeyPress={e => keyPressed(e)}
              >Outcome will be detailed on a public website
              </button>
              { newMarket.expirySourceType === EXPIRY_SOURCE_SPECIFIC &&
                <div>
                  <input
                    type="text"
                    value={newMarket.expirySource}
                    placeholder="Define URL"
                    onChange={e => validateField('expirySource', e.target.value)}
                    onKeyPress={e => keyPressed(e)}
                  />
                  { newMarket.validations[newMarket.currentStep].expirySource &&
                    <span className={StylesForm['CreateMarketForm__error--bottom']}>
                      {InputErrorIcon}{
                        newMarket.validations[newMarket.currentStep].expirySource
                      }
                    </span>
                  }
                </div>
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
                className={classNames({ [`${StylesForm.active}`]: newMarket.designatedReporterType === DESIGNATED_REPORTER_SELF })}
                onClick={() => this.validateDesignatedReporterType(DESIGNATED_REPORTER_SELF)}
                onKeyPress={e => keyPressed(e)}
              >Myself
              </button>
            </li>
            <li className={Styles['CreateMarketResolution__designated-reporter-specific']}>
              <button
                className={classNames({ [`${StylesForm.active}`]: newMarket.designatedReporterType === DESIGNATED_REPORTER_SPECIFIC })}
                onClick={() => this.validateDesignatedReporterType(DESIGNATED_REPORTER_SPECIFIC)}
                onKeyPress={e => keyPressed(e)}
              >Someone Else
              </button>
              <div>
                { newMarket.designatedReporterType === DESIGNATED_REPORTER_SPECIFIC &&
                  <input
                    className={classNames({ [`${StylesForm['CreateMarketForm__error--field']}`]: designatedReporterError })}
                    type="text"
                    value={newMarket.designatedReporterAddress}
                    placeholder="Designated Reporter Address"
                    onChange={e => this.validateDesignatedReporterAddress(e.target.value)}
                    onKeyPress={e => keyPressed(e)}
                  />
                }
                { designatedReporterError &&
                  <span className={StylesForm['CreateMarketForm__error--bottom']}>
                    {InputErrorIcon}{
                      newMarket.validations[newMarket.currentStep].designatedReporterAddress
                    }
                  </span>
                }
              </div>
            </li>
          </ul>
        </li>
        <li
          className={Styles.CreateMarketResolution__datepicker}
        >
          <label htmlFor="cm__input--date">
            <span>Expiration Date</span>
          </label>
          <SingleDatePicker
            id="cm__input--date"
            date={this.state.date}
            placeholder="Date (MMM D, YYYY)"
            onDateChange={(date) => {
              this.setState({ date })
              // if date is null, invalidate form.
              if (!date) return validateField('endTime', '')
              validateField('endTime', formatDate(date.toDate()))
            }}
            isOutsideRange={day => day.isBefore(moment(this.props.currentTimestamp))}
            focused={this.state.focused}
            onFocusChange={({ focused }) => {
              if (this.state.date == null) {
                const date = moment(this.props.currentTimestamp)
                this.setState({
                  date,
                })
                validateField('endTime', formatDate(date.toDate()))
              }
              this.setState({ focused })
            }}
            displayFormat="MMM D, YYYY"
            numberOfMonths={1}
            navPrev={<ChevronLeft />}
            navNext={<ChevronRight />}
          />
        </li>
        <li>
          <label htmlFor="cm__input--time">
            <span>Expiration Time (UTC { utcLocalOffset })</span>
            { newMarket.validations[newMarket.currentStep].hour.length &&
              <span
                className={StylesForm.CreateMarketForm__error}
              >{InputErrorIcon}{ newMarket.validations[newMarket.currentStep].hour }
              </span>
            }
            { newMarket.validations[newMarket.currentStep].minute.length &&
              <span
                className={StylesForm.CreateMarketForm__error}
              >{InputErrorIcon}{ newMarket.validations[newMarket.currentStep].minute }
              </span>
            }
          </label>
          <div id="cm__input--time" className={Styles.CreateMarketResolution__time}>
            <InputDropdown
              label="Hour"
              options={s.hours}
              default={newMarket.hour}
              onChange={value => validateNumber('hour', value, 'hour', 1, 12, 0)}
              isMobileSmall={isMobileSmall}
              onKeyPress={e => keyPressed(e)}
            />
            <InputDropdown
              label="Minute"
              options={s.minutes}
              default={newMarket.minute}
              onChange={value => validateNumber('minute', value, 'minute', 0, 59, 0)}
              isMobileSmall={isMobileSmall}
              onKeyPress={e => keyPressed(e)}
            />
            <InputDropdown
              label="AM/PM"
              default={newMarket.meridiem || ''}
              options={s.ampm}
              onChange={value => validateField('meridiem', value)}
              isMobileSmall={isMobileSmall}
              onKeyPress={e => keyPressed(e)}
            />
          </div>
        </li>
      </ul>
    )
  }
}
