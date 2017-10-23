/* eslint jsx-a11y/label-has-for: 0 */

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { Helmet } from 'react-helmet'

import MarketPreview from 'modules/market/components/market-preview/market-preview'

import { BINARY, CATEGORICAL, SCALAR } from 'modules/markets/constants/market-types'

import FormStyles from 'modules/common/less/form'
import ConfirmStyles from 'modules/common/less/confirm-table'
import Styles from 'modules/reporting/components/reporting-report/reporting-report.styles'

export default class ReportingReport extends Component {

  static propTypes = {
    market: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props)

    this.state = {
      currentStep: 0,
      isFormValid: true,
      isMarketValid: null,
      selectedOutcome: '',
      stake: '',
      validations: {
        isMarketValid: false,
        stake: false,
      }
    }

    this.prevPage = this.prevPage.bind(this)
    this.nextPage = this.nextPage.bind(this)
    this.validateIsMarketValid = this.validateIsMarketValid.bind(this)
    this.validateOutcome = this.validateOutcome.bind(this)
    this.validateNumber = this.validateNumber.bind(this)
    this.validateStake = this.validateStake.bind(this)
  }

  prevPage() {
    const newStep = this.state.currentStep <= 0 ? 0 : this.state.currentStep - 1
    this.setState({ currentStep: newStep })
  }

  nextPage() {
    const newStep = this.state.currentStep >= 1 ? 1 : this.state.currentStep + 1
    this.setState({ currentStep: newStep })
  }

  validateIsMarketValid(isMarketValid) {
    const updatedValidations = { ...this.state.validations }
    updatedValidations.isMarketValid = true

    if (isMarketValid) {
      if (!updatedValidations.hasOwnProperty('selectedOutcome')) {
        updatedValidations.selectedOutcome = false
      }
    } else if (updatedValidations.hasOwnProperty('selectedOutcome') && updatedValidations.selectedOutcome === false) {
      delete updatedValidations.selectedOutcome
    }

    this.setState({
      validations: updatedValidations,
      isMarketValid
    })
  }

  validateOutcome(selectedOutcome) {
    const updatedValidations = { ...this.state.validations }
    updatedValidations.selectedOutcome = true

    this.setState({
      validations: updatedValidations,
      selectedOutcome
    })
  }

  validateNumber(fieldName, value, humanName, min, max) {
    const updatedValidations = { ...this.state.validations }

    const minValue = parseFloat(min)
    const maxValue = parseFloat(max)

    switch (true) {
      case value === '':
        updatedValidations[fieldName] = `The ${humanName} field is required.`
        break
      case (value > maxValue || value < minValue):
        updatedValidations[fieldName] = `Please enter a ${humanName} between ${min} and ${max}.`
        break
      default:
        updatedValidations[fieldName] = true
        break
    }

    this.setState({
      validations: updatedValidations,
      [fieldName]: value
    })
  }

  validateStake(stake) {
    const updatedValidations = { ...this.state.validations }

    switch (true) {
      case stake === '':
        updatedValidations.stake = `The stake field is required.`
        break
      case stake <= 0:
        updatedValidations.stake = `Please enter a stake greater than 0.`
        break
      default:
        updatedValidations.stake = true
        break
    }

    this.setState({
      validations: updatedValidations,
      stake
    })
  }

  render() {
    const s = this.state
    const p = this.props

    return (
      <section>
        <Helmet>
          <title>Submit Report</title>
        </Helmet>
        <MarketPreview
          {...p.market}
          isLogged={p.isLogged}
          location={p.location}
          history={p.history}
          cardStyle="single-card"
          buttonText="View"
        />
        <article className={FormStyles.Form}>
          { s.currentStep === 0 &&
            <ul className={classNames(Styles.ReportingReport__fields, FormStyles.Form__fields)}>
              { p.market.extraInfo &&
                <li>
                  <label>
                    <span>Market Details</span>
                  </label>
                  <p>{ p.market.extraInfo }</p>
                </li>
              }
              <li>
                <label>
                  <span>Resolution Source</span>
                </label>
                <p>Outcome will be detailed on a public website: <a href="http://www.example.com" target="_blank" rel="noopener noreferrer">http://www.example.com</a></p>
              </li>
              <li>
                <label>
                  <span>Is Market Valid?</span>
                </label>
                <ul className={FormStyles['Form__radio-buttons--per-line']}>
                  <li>
                    <button
                      className={classNames({ [`${FormStyles.active}`]: s.isMarketValid === true })}
                      onClick={(e) => { this.validateIsMarketValid(true) }}
                    >Yes</button>
                  </li>
                  <li>
                    <button
                      className={classNames({ [`${FormStyles.active}`]: s.isMarketValid === false })}
                      onClick={(e) => { this.validateIsMarketValid(false) }}
                    >No</button>
                  </li>
                </ul>
              </li>
              { s.isMarketValid && p.market.type === BINARY &&
                <li>
                  <label>
                    <span>Outcome</span>
                  </label>
                  <ul className={FormStyles['Form__radio-buttons--per-line']}>
                    <li>
                      <button
                        className={classNames({ [`${FormStyles.active}`]: s.selectedOutcome === 'yes' })}
                        onClick={(e) => { this.validateOutcome('yes') }}
                      >Yes</button>
                    </li>
                    <li>
                      <button
                        className={classNames({ [`${FormStyles.active}`]: s.selectedOutcome === 'no' })}
                        onClick={(e) => { this.validateOutcome('no') }}
                      >No</button>
                    </li>
                  </ul>
                </li>
              }
              { s.isMarketValid && p.market.type === CATEGORICAL &&
                <li>
                  <label>
                    <span>Outcome</span>
                  </label>
                  <ul className={FormStyles['Form__radio-buttons--per-line']}>
                    { p.market.outcomes && p.market.outcomes.map(outcome => (
                      <li key={outcome.id}>
                        <button
                          className={classNames({ [`${FormStyles.active}`]: s.selectedOutcome === outcome.name })}
                          onClick={(e) => { this.validateOutcome(outcome.name) }}
                        >{outcome.name}</button>
                      </li>
                      ))
                    }
                  </ul>
                </li>
              }
              { s.isMarketValid && p.market.type === SCALAR &&
                <li className={FormStyles['field--short']}>
                  <label>
                    <span htmlFor="sr__input--outcome-scalar">Outcome</span>
                    { s.validations.hasOwnProperty('selectedOutcome') && s.validations.selectedOutcome.length &&
                      <span className={FormStyles.Form__error}>
                        { s.validations.selectedOutcome }
                      </span>
                    }
                  </label>
                  <input
                    id="sr__input--outcome-scalar"
                    type="number"
                    min={p.market.minValue}
                    max={p.market.maxValue}
                    placeholder="0"
                    value={s.selectedOutcome}
                    onChange={(e) => { this.validateNumber('selectedOutcome', e.target.value, 'outcome', p.market.minValue, p.market.maxValue) }}
                  />
                </li>
              }
              <li className={FormStyles['field--short']}>
                <label>
                  <span htmlFor="sr__input--stake">Stake</span>
                  { s.validations.hasOwnProperty('stake') && s.validations.stake.length &&
                    <span className={FormStyles.Form__error}>
                      { s.validations.stake }
                    </span>
                  }
                </label>
                <input
                  id="sr__input--stake"
                  type="number"
                  min="0"
                  placeholder="0.0000 REP"
                  value={s.stake}
                  onChange={(e) => { this.validateStake(e.target.value) }}
                />
              </li>
            </ul>
          }
          { s.currentStep === 1 &&
            <article className={FormStyles.Form__fields}>
              <div className={ConfirmStyles.Confirm}>
                <h2 className={ConfirmStyles.Confirm__heading}>Confirm Report</h2>
                <div className={ConfirmStyles.Confirm__wrapper}>
                  <div className={ConfirmStyles.Confirm__creation}>
                    <ul className={ConfirmStyles.Confirm__list}>
                      <li>
                        <span>Market</span>
                        <span>{ s.isMarketValid ? 'Valid' : 'Invalid' }</span>
                      </li>
                      { s.isMarketValid &&
                        <li>
                          <span>Outcome</span>
                          <span>{ s.selectedOutcome }</span>
                        </li>
                      }
                      <li>
                        <span>Stake</span>
                        <span>{ s.stake } REP</span>
                      </li>
                      <li>
                        <span>Gas</span>
                        <span>0.0023 ETH (2.8%)</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </article>
          }
          <div className={FormStyles.Form__navigation}>
            <button
              className={classNames(FormStyles.Form__prev, { [`${FormStyles['hide-button']}`]: s.currentStep === 0 })}
              onClick={this.prevPage}
            >Previous</button>
            <button
              className={classNames(FormStyles.Form__next, { [`${FormStyles['hide-button']}`]: s.currentStep === 1 })}
              disabled={!Object.keys(s.validations).every(key => s.validations[key] === true)}
              onClick={Object.keys(s.validations).every(key => s.validations[key] === true) && this.nextPage}
            >Report</button>
            { s.currentStep === 1 &&
              <button className={FormStyles.Form__submit}>Submit</button>
            }
          </div>
        </article>
      </section>
    )
  }
}
