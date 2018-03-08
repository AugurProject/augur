/* eslint jsx-a11y/label-has-for: 0 */

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import BigNumber from 'bignumber.js'

import { BINARY, CATEGORICAL, SCALAR } from 'modules/markets/constants/market-types'
import { ExclamationCircle as InputErrorIcon } from 'modules/common/components/icons'
import FormStyles from 'modules/common/less/form'
import Styles from 'modules/reporting/components/reporting-dispute-form/reporting-dispute-form.styles'

export default class ReportingDisputeForm extends Component {

  static propTypes = {
    market: PropTypes.object.isRequired,
    updateState: PropTypes.func.isRequired,
    validations: PropTypes.object.isRequired,
    selectedOutcome: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    currentOutcome: PropTypes.object.isRequired,
    disputeBond: PropTypes.string.isRequired,
    disputeOutcomes: PropTypes.array.isRequired,
    stakes: PropTypes.array.isRequired,
    stake: PropTypes.number,
    isMarketInValid: PropTypes.bool,
  }

  static checkStake(stake, updatedValidations) {
    if (stake === '' || stake == null || stake <= 0) {
      updatedValidations.stake = 'The stake field is required.'
    } else {
      delete updatedValidations.stake
    }
    return updatedValidations
  }

  constructor(props) {
    super(props)

    this.state = {
      outcomes: [],
      inputStake: '',
    }

    this.state.outcomes = this.props.market ? this.props.market.outcomes.slice() : []
    if (this.props.market && this.props.market.marketType === BINARY && this.props.market.outcomes.length === 1) {
      this.state.outcomes.push({ id: 0, name: 'No' })
    }

    this.state.outcomes.sort((a, b) => a.name - b.name)
    if (this.props.stake) this.state.inputStake = this.props.stake.toString()
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.disputeOutcomes && nextProps.disputeOutcomes.length > 0) {
      this.state.outcomes = nextProps.disputeOutcomes.filter(item => !item.tentativeWinning) || []
      const outcome = this.state.outcomes.find(o => o.name === 'Indeterminate')
      if (outcome) outcome.name = 'Market Is Invalid'
    }
  }


  validateStake(rawStake) {
    const updatedValidations = { ...this.props.validations }

    let stake = rawStake

    if (stake !== '' && !(stake instanceof BigNumber)) {
      stake = new BigNumber(rawStake)
      stake = stake.round(4)
    }

    ReportingDisputeForm.checkStake(stake, updatedValidations)

    this.setState({
      inputStake: stake ? stake.toNumber() : stake,
    })

    this.props.updateState({
      validations: updatedValidations,
      stake: stake ? stake.toNumber() : 0,
    })
  }

  validateOutcome(validations, selectedOutcome, selectedOutcomeName, isMarketInValid) {
    const updatedValidations = { ...validations }
    updatedValidations.selectedOutcome = true
    delete updatedValidations.err
    let isInvalid = isMarketInValid

    // outcome with id of .5 means invalid
    if (selectedOutcome === '0.5') isInvalid = true

    ReportingDisputeForm.checkStake(this.props.stake, updatedValidations)

    this.props.updateState({
      validations: updatedValidations,
      selectedOutcome,
      selectedOutcomeName,
      isMarketInValid: isInvalid,
    })
  }

  validateScalar(value, humanName, min, max, isInvalid) {
    const updatedValidations = { ...this.props.validations }

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

    ReportingDisputeForm.checkStake(this.props.stake, updatedValidations)

    this.props.updateState({
      validations: updatedValidations,
      selectedOutcome: value,
      selectedOutcomeName: value,
      isMarketInValid: isInvalid,
    })

  }


  render() {
    const p = this.props
    const s = this.state

    return (
      <ul className={classNames(Styles.ReportingDisputeForm__fields, FormStyles.Form__fields)}>
        <li>
          <label>
            <span>Tentative Winning Outcome</span>
          </label>
          <p>{p.currentOutcome.isInvalid ? 'Invalid' : p.currentOutcome.name }</p>
        </li>
        <li>
          <label>
            <span>Proposed Outcome</span>
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
            </ul>
          </li>
        }
        { p.market.marketType === SCALAR &&
          <li className={FormStyles['field--short']}>
            <ul className={FormStyles['Form__radio-buttons--per-line']}>
              <li>
                <button
                  className={classNames({ [`${FormStyles.active}`]: p.selectedOutcome !== '' })}
                  onClick={(e) => { this.validateScalar(0, 'selectedOutcome', p.market.minPrice, p.market.maxPrice, false) }}
                />
                <input
                  id="sr__input--outcome-scalar"
                  type="number"
                  min={p.market.minPrice}
                  max={p.market.maxPrice}
                  step={p.market.tickSize}
                  placeholder={p.market.minPrice}
                  value={p.selectedOutcome}
                  className={classNames({ [`${FormStyles['Form__error--field']}`]: p.validations.hasOwnProperty('err') && p.validations.selectedOutcome })}
                  onChange={(e) => { this.validateScalar(e.target.value, 'outcome', p.market.minPrice, p.market.maxPrice, false) }}
                />
              </li>
              <li>
                { p.validations.hasOwnProperty('err') &&
                  <span className={FormStyles.Form__error}>
                    {InputErrorIcon}{ p.validations.err }
                  </span>
                }
              </li>
            </ul>
          </li>
        }
        <li className={FormStyles['field--short']}>
          <label>
            <span htmlFor="sr__input--stake">Deposit Stake</span>
          </label>
          <ul className={FormStyles['Form__radio-buttons--per-line']}>
            <li>
              <input
                id="sr__input--stake"
                type="number"
                min="0"
                placeholder="0.0000 REP"
                value={s.inputStake}
                className={classNames({ [`${FormStyles['Form__error--field']}`]: p.validations.hasOwnProperty('stake') && p.validations.selectedOutcome })}
                onChange={(e) => { this.validateStake(e.target.value) }}
              />
            </li>
            <li>
              { p.validations.hasOwnProperty('stake') && p.validations.stake.length &&
                <span className={FormStyles['Form__error--even']}>
                  {InputErrorIcon}{ p.validations.stake }
                </span>
              }
            </li>
          </ul>
        </li>
      </ul>
    )
  }
}
