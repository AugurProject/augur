/* eslint jsx-a11y/label-has-for: 0 */

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import BigNumber from 'bignumber.js'

import { BINARY, CATEGORICAL, SCALAR } from 'modules/markets/constants/market-types'

import FormStyles from 'modules/common/less/form'
import Styles from 'modules/reporting/components/reporting-dispute-form/reporting-dispute-form.styles'

const validateIsMarketValid = (validations, updateState, isMarketValid) => {
  const updatedValidations = { ...validations }
  updatedValidations.isMarketValid = true

  if (isMarketValid) {
    if (!updatedValidations.hasOwnProperty('selectedOutcome')) {
      updatedValidations.selectedOutcome = false
    }
  } else if (updatedValidations.hasOwnProperty('selectedOutcome') && updatedValidations.selectedOutcome === false) {
    delete updatedValidations.selectedOutcome
  }

  updateState({
    validations: updatedValidations,
    isMarketValid,
  })
}

const validateOutcome = (validations, updateState, selectedOutcome) => {
  const updatedValidations = { ...validations }
  updatedValidations.selectedOutcome = true

  updateState({
    validations: updatedValidations,
    selectedOutcome,
  })
}

const validateNumber = (validations, updateState, fieldName, value, humanName, min, max) => {
  const updatedValidations = { ...validations }

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

  updateState({
    validations: updatedValidations,
    [fieldName]: value,
  })
}

const validateStake = (p, rawStake) => {
  const updatedValidations = { ...p.validations }
  const minStake = p.minimumStakeRequired instanceof BigNumber ? p.minimumStakeRequired : new BigNumber(p.minimumStakeRequired)
  const minStakeNum = p.minimumStakeRequired instanceof BigNumber ? p.minimumStakeRequired.toNumber() : p.minimumStakeRequired

  let stake = rawStake

  if (stake !== '' && !(stake instanceof BigNumber)) {
    stake = new BigNumber(rawStake)
    stake = stake.round(4)
  }

  if (p.stakeIsRequired) {
    switch (true) {
      case stake === '':
        updatedValidations.stake = 'The stake field is required.'
        break
      case stake <= minStake:
        updatedValidations.stake = `Please enter a stake greater than ${minStakeNum}.`
        break
      default:
        updatedValidations.stake = true
        break
    }
  }

  p.updateState({
    validations: updatedValidations,
    stake,
  })
}

export default class ReportingDisputeForm extends Component {

  static propTypes = {
    market: PropTypes.object.isRequired,
    updateState: PropTypes.func.isRequired,
    validations: PropTypes.object.isRequired,
    selectedOutcome: PropTypes.string.isRequired,
    stake: PropTypes.string.isRequired,
    disputeBond: PropTypes.string.isRequired,
    minimumStakeRequired: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]).isRequired,
    isMarketValid: PropTypes.bool,
  }

  static calcIsStakeRequired(p) {
    const currentOutcome = { ...p.market.currentOutcome }
    currentOutcome.stake = p.market.currentOutcome.stake - p.disputeBond
    return [...p.market.otherOutcomes, currentOutcome].every(outcome => outcome.stake <= 0)
  }

  static calcMinimumStakeRequired(p) {
    let minimumStake = false
    if (ReportingDisputeForm.calcIsStakeRequired(p) && p.selectedOutcome) {
      minimumStake = '0'
      const outcomeObject = p.market.otherOutcomes.filter(outcome => outcome.name === p.selectedOutcome)
      if (p.isMarketValid && outcomeObject.length) {
        minimumStake = `${Math.abs(outcomeObject[0].stake)}`
      }
    }
    return minimumStake
  }

  componentDidMount() {
    if (ReportingDisputeForm.calcIsStakeRequired(this.props)) {
      this.props.updateState({
        stakeIsRequired: true,
        validations: { ...this.props.validations, stake: false },
      })
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.market.otherOutcomes !== nextProps.market.otherOutcomes) {
      this.props.updateState({ stakeIsRequired: ReportingDisputeForm.calcIsStakeRequired(nextProps) })
    }
    if (this.props.selectedOutcome !== nextProps.selectedOutcome || this.props.isMarketValid !== nextProps.isMarketValid) {
      this.props.updateState({ minimumStakeRequired: ReportingDisputeForm.calcMinimumStakeRequired(nextProps) })
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.minimumStakeRequired !== false && prevProps.stake !== '' && (
      prevProps.minimumStakeRequired !== this.props.minimumStakeRequired || prevProps.isMarketValid !== this.props.isMarketValid
    )) {
      validateStake(this.props, this.props.stake)
    }
  }

  render() {
    const p = this.props

    return (
      <ul className={classNames(Styles.ReportingDisputeForm__fields, FormStyles.Form__fields)}>
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
            <span>Dispute Bond</span>
          </label>
          <p className={FormStyles['text--field-style']}>{ p.disputeBond } REP</p>
        </li>
        <li>
          <label>
            <span>Current Outcome</span>
          </label>
          <p className={FormStyles['text--field-style']}>{ p.market.currentOutcome.name } &nbsp;|&nbsp; { p.market.currentOutcome.stake - p.disputeBond } REP</p>
        </li>
        <li>
          <label>
            <span>Is Market Valid?</span>
          </label>
          <ul className={FormStyles['Form__radio-buttons--per-line']}>
            <li>
              <button
                className={classNames({ [`${FormStyles.active}`]: p.isMarketValid === true })}
                onClick={(e) => { validateIsMarketValid(p.validations, p.updateState, true) }}
              >Yes
              </button>
            </li>
            <li>
              <button
                className={classNames({ [`${FormStyles.active}`]: p.isMarketValid === false })}
                onClick={(e) => { validateIsMarketValid(p.validations, p.updateState, false) }}
              >No
              </button>
            </li>
          </ul>
        </li>
        { p.isMarketValid && (p.market.type === BINARY || p.market.type === CATEGORICAL) &&
          <li>
            <label>
              <span>Proposed Outcome</span>
            </label>
            <ul className={FormStyles['Form__radio-buttons--per-line']}>
              { p.market.otherOutcomes && p.market.otherOutcomes.map(outcome => (
                <li key={outcome.id}>
                  <button
                    className={classNames({ [`${FormStyles.active}`]: p.selectedOutcome === outcome.name })}
                    onClick={(e) => { validateOutcome(p.validations, p.updateState, outcome.name) }}
                  >{outcome.name} &nbsp;|&nbsp; {outcome.stake} REP
                  </button>
                </li>
              ))
              }
            </ul>
          </li>
        }
        { p.isMarketValid && p.market.type === SCALAR &&
          <li className={FormStyles['field--short']}>
            <label>
              <span htmlFor="sr__input--outcome-scalar">Proposed Outcome</span>
              { p.validations.hasOwnProperty('selectedOutcome') && p.validations.selectedOutcome.length &&
                <span className={FormStyles.Form__error}>
                  { p.validations.selectedOutcome }
                </span>
              }
            </label>
            <input
              id="sr__input--outcome-scalar"
              type="number"
              min={p.market.minValue}
              max={p.market.maxValue}
              placeholder="0"
              value={p.selectedOutcome}
              onChange={(e) => { validateNumber(p.validations, p.updateState, 'selectedOutcome', e.target.value, 'proposed outcome', p.market.minValue, p.market.maxValue) }}
            />
          </li>
        }
        <li className={FormStyles['field--short']}>
          <label>
            <span htmlFor="sr__input--stake">Stake</span>
            { p.validations.hasOwnProperty('stake') && p.validations.stake.length &&
              <span className={FormStyles.Form__error}>
                { p.validations.stake }
              </span>
            }
          </label>
          { p.stakeIsRequired && p.minimumStakeRequired &&
            <p>A stake of greater than { p.minimumStakeRequired } REP is required.</p>
          }
          <input
            id="sr__input--stake"
            type="number"
            min="0"
            placeholder="0.0000 REP"
            value={p.stake}
            onChange={(e) => { validateStake(p, e.target.value) }}
          />
        </li>
      </ul>
    )
  }
}
