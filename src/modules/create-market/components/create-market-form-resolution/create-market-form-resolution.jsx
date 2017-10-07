/* eslint jsx-a11y/label-has-for: 0 */

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import Datetime from 'react-datetime'

import { formatDate } from 'utils/format-date'
import { EXPIRY_SOURCE_GENERIC, EXPIRY_SOURCE_SPECIFIC } from 'modules/create-market/constants/new-market-constraints'

import Styles from 'modules/create-market/components/create-market-form-resolution/create-market-form-resolution.styles'
import StylesForm from 'modules/create-market/components/create-market-form/create-market-form.styles'

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

    const yesterday = Datetime.moment().subtract(1, 'day')
    const valid = current => current.isAfter(yesterday)

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
          <Datetime
            isValidDate={valid}
            dateFormat="MMM D, YYYY"
            timeFormat={false}
            defaultValue={Object.keys(p.newMarket.endDate).length ? p.newMarket.endDate : ''}
            inputProps={{ placeholder: 'Date' }}
            onChange={(date) => {
              p.validateField('endDate', formatDate(new Date(date)))
            }}
          />
        </li>
      </ul>
    )
  }
}
