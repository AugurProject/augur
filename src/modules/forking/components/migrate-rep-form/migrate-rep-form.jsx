/* eslint jsx-a11y/label-has-for: 0 */

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import BigNumber from 'bignumber.js'

import { BINARY, SCALAR } from 'modules/markets/constants/market-types'
import { ExclamationCircle as InputErrorIcon } from 'modules/common/components/icons'
import FormStyles from 'modules/common/less/form'
import Styles from 'modules/forking/components/migrate-rep-form/migrate-rep-form.styles'
import { formatAttoRep } from 'utils/format-number'

export default class MigrateRepForm extends Component {

  static propTypes = {
    market: PropTypes.object.isRequired,
    updateState: PropTypes.func.isRequired,
    validations: PropTypes.object.isRequired,
    selectedOutcome: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    selectedOutcomeName: PropTypes.string.isRequired,
    forkMigrationTotals: PropTypes.object.isRequired,
    repAmount: PropTypes.number,
    isMarketInValid: PropTypes.bool,
    accountREP: PropTypes.string.isRequired,
  }

  static checkRepAmount(repAmount, updatedValidations) {
    if (repAmount === '' || repAmount == null || repAmount <= 0) {
      updatedValidations.repAmount = 'The rep Amount field is required.'
    } else {
      delete updatedValidations.repAmount
    }
    return updatedValidations
  }

  constructor(props) {
    super(props)

    this.state = {
      outcomes: [],
      inputRepAmount: '',
      inputSelectedOutcome: '',
    }

    // TODO Reportable outcomes?
    this.state.outcomes = this.props.market ? this.props.market.outcomes.slice() : []
    if (this.props.market && this.props.market.marketType === BINARY && this.props.market.outcomes.length === 1) {
      this.state.outcomes.push({ id: 0, name: 'No' })
    }

    this.state.outcomes.sort((a, b) => a.name - b.name)
    if (this.props.repAmount) this.state.inputRepAmount = this.props.repAmount.toString()

    this.componentWillReceiveProps(this.props)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.selectedOutcome || typeof nextProps.selectedOutcome === 'number') {
      if (!this.state.outcomes.find(o => o.id === nextProps.selectedOutcome)) {
        this.setState({
          inputSelectedOutcome: nextProps.selectedOutcome,
        })
      }
    }
  }

  validateRepAmount(rawRepAmount) {
    const updatedValidations = { ...this.props.validations }

    let repAmount = rawRepAmount

    if (repAmount !== '' && !(repAmount instanceof BigNumber)) {
      repAmount = new BigNumber(rawRepAmount)
      repAmount = repAmount.toNumber()
    }

    MigrateRepForm.checkRepAmount(repAmount, updatedValidations)

    this.setState({
      inputRepAmount: repAmount,
    })

    this.props.updateState({
      validations: updatedValidations,
      repAmount,
    })
  }

  validateOutcome(validations, selectedOutcome, selectedOutcomeName, isMarketInValid) {
    const updatedValidations = { ...validations }
    updatedValidations.selectedOutcome = true
    delete updatedValidations.err
    let isInvalid = isMarketInValid

    // outcome with id of .5 means invalid
    if (selectedOutcome === '0.5') isInvalid = true

    MigrateRepForm.checkRepAmount(this.props.repAmount, updatedValidations)

    this.setState({
      inputSelectedOutcome: '',
    })

    this.props.updateState({
      validations: updatedValidations,
      selectedOutcome,
      selectedOutcomeName: selectedOutcomeName.toString(),
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

    MigrateRepForm.checkRepAmount(this.props.repAmount, updatedValidations)

    this.setState({
      inputSelectedOutcome: value,
    })

    this.props.updateState({
      validations: updatedValidations,
      selectedOutcome: value,
      selectedOutcomeName: value.toString(),
      isMarketInValid: isInvalid,
    })
  }

  render() {
    const p = this.props
    const s = this.state

    const formattedMigrationTotals = Object.keys(p.forkMigrationTotals).reduce((totals, curOutcomeId) => {
      const forkMigrationOutcomeData = p.forkMigrationTotals[curOutcomeId]
      totals[curOutcomeId] = formatAttoRep(forkMigrationOutcomeData.repTotal, { decimals: 4, roundUp: false }).formatted
      return totals
    }, {})

    return (
      <ul className={classNames(Styles.MigrateRepForm__fields, FormStyles.Form__fields)}>
        <li>
          <h3>Choose carefully. Migrating REP is an irreversible, one-way operation.</h3>
        </li>
        <li>
          <label>
            <span>Outcome</span>
          </label>
        </li>
        <li>
          <ul className={FormStyles['Form__radio-buttons--per-line']}>
            { s.outcomes.map(outcome => (
              <li key={outcome.id}>
                <button
                  className={classNames({ [`${FormStyles.active}`]: p.selectedOutcome === outcome.id })}
                  onClick={(e) => { this.validateOutcome(p.validations, outcome.id, outcome.name, false) }}
                >{outcome.name}
                  <span className={Styles.MigrateRepForm__outcome_rep_total}>{ (formattedMigrationTotals[outcome.id] && formattedMigrationTotals[outcome.id]) || '0'} REP Migrated</span>
                  { p.forkMigrationTotals[outcome.id] && p.forkMigrationTotals[outcome.id].winner &&
                    <span className={Styles.MigrateRepForm__winning_outcome}> WINNING OUTCOME</span>
                  }
                </button>
              </li>
            ))
            }
            { p.market.marketType === SCALAR &&
              <li className={FormStyles['field--inline']}>
                <ul className={FormStyles['Form__radio-buttons--per-line-long']}>
                  <li>
                    <button
                      className={classNames({ [`${FormStyles.active}`]: s.inputSelectedOutcome !== '' })}
                      onClick={(e) => { this.validateScalar(0, 'selectedOutcome', p.market.minPrice, p.market.maxPrice, false) }}
                    />
                    <input
                      id="sr__input--outcome-scalar"
                      type="number"
                      min={p.market.minPrice}
                      max={p.market.maxPrice}
                      step={p.market.tickSize}
                      placeholder={p.market.scalarDenomination}
                      value={s.inputSelectedOutcome}
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
          </ul>
        </li>
        <li className={FormStyles['field--short']}>
          <label>
            <span htmlFor="sr__input--repAmount">Migrate REP</span>
          </label>
          <ul className={FormStyles['Form__radio-buttons--per-line-inline']}>
            <li>
              <input
                id="sr__input--repAmount"
                type="number"
                min="0"
                placeholder="0.0000 REP"
                value={s.inputRepAmount}
                className={classNames({ [`${FormStyles['Form__error--field']}`]: p.validations.hasOwnProperty('repAmount') && p.validations.selectedOutcome })}
                onChange={(e) => { this.validateRepAmount(e.target.value) }}
              />
              { p.selectedOutcomeName && p.selectedOutcomeName.length > 0 &&
                <button
                  className={FormStyles['button--inline']}
                  onClick={() => { this.validateRepAmount(p.accountREP) }}
                >MAX
                </button>
              }
            </li>
            <li>
              { p.validations.hasOwnProperty('repAmount') && p.validations.repAmount.length &&
                <span className={FormStyles['Form__error--even']}>
                  {InputErrorIcon}{ p.validations.repAmount }
                </span>
              }
            </li>
          </ul>
        </li>
      </ul>
    )
  }
}
