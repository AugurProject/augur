/* eslint jsx-a11y/label-has-for: 0 */
/* eslint react/no-array-index-key: 0 */

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import BigNumber from 'bignumber.js'
import { abi } from 'services/augurjs'

import { BINARY, CATEGORICAL, SCALAR } from 'modules/markets/constants/market-types'
import { CATEGORICAL_OUTCOMES_MIN_NUM, CATEGORICAL_OUTCOMES_MAX_NUM, CATEGORICAL_OUTCOME_MAX_LENGTH } from 'modules/create-market/constants/new-market-constraints'

import Styles from 'modules/create-market/components/create-market-form-outcome/create-market-form-outcome.styles'
import StylesForm from 'modules/create-market/components/create-market-form/create-market-form.styles'

export default class CreateMarketOutcome extends Component {

  static propTypes = {
    newMarket: PropTypes.object.isRequired,
    updateNewMarket: PropTypes.func.isRequired,
    validateField: PropTypes.func.isRequired,
    isValid: PropTypes.func.isRequired,
    isMobileSmall: PropTypes.bool.isRequired,
  }

  static calculateOutcomeFieldCount(p) {
    const numCleanedOutcomes = p.newMarket.outcomes.filter(outcome => outcome !== '').length
    const totalOutcomes = p.newMarket.outcomes.length
    return !p.isMobileSmall ? totalOutcomes : Math.min(Math.max(3, numCleanedOutcomes + 1), totalOutcomes)
  }

  constructor(props) {
    super(props)

    this.state = {
      marketType: false,
      outcomeFieldCount: CreateMarketOutcome.calculateOutcomeFieldCount(this.props),
      showAddOutcome: CreateMarketOutcome.calculateOutcomeFieldCount(this.props) < 8,
      scalarMin: abi.unfix(abi.constants.SERPINT_MIN).round(18, BigNumber.ROUND_DOWN),
      scalarMax: abi.unfix(abi.constants.SERPINT_MAX).round(18, BigNumber.ROUND_DOWN),
    }

    this.handleAddOutcomeClick = this.handleAddOutcomeClick.bind(this)
    this.validateType = this.validateType.bind(this)
    this.validateScalarNum = this.validateScalarNum.bind(this)
    this.validateOutcomes = this.validateOutcomes.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.isMobileSmall !== nextProps.isMobileSmall) {
      const outcomeFieldCount = CreateMarketOutcome.calculateOutcomeFieldCount(nextProps)
      const showAddOutcome = nextProps.isMobileSmall ? !(outcomeFieldCount >= nextProps.newMarket.outcomes.length) : false
      this.setState({ outcomeFieldCount, showAddOutcome })
    }
  }

  handleAddOutcomeClick() {
    const totalOutcomes = this.props.newMarket.outcomes.length
    const outcomeFieldCount = Math.min(this.state.outcomeFieldCount + 1, totalOutcomes)
    const showAddOutcome = !(outcomeFieldCount >= totalOutcomes)
    this.setState({ outcomeFieldCount, showAddOutcome })
  }

  validateType(value) {
    const p = this.props
    const updatedMarket = { ...p.newMarket }
    const validations = updatedMarket.validations[p.newMarket.currentStep]

    const updatedValidations = Object.keys(validations).reduce((p, key) => (validations[key] === true ? { ...p, [key]: true } : p), {})

    switch (value) {
      case CATEGORICAL:
        updatedValidations.outcomes = updatedValidations.outcomes ? updatedValidations.outcomes : false
        break
      case SCALAR:
        updatedValidations.scalarSmallNum = updatedValidations.scalarSmallNum ? updatedValidations.scalarSmallNum : false
        updatedValidations.scalarBigNum = updatedValidations.scalarBigNum ? updatedValidations.scalarBigNum : false
        break
      default:
        break
    }

    updatedValidations.type = true

    updatedMarket.validations[p.newMarket.currentStep] = updatedValidations
    updatedMarket.type = value
    updatedMarket.isValid = p.isValid(p.newMarket.currentStep)

    p.updateNewMarket(updatedMarket)
  }

  validateScalarNum(value, type) {
    const p = this.props
    const currentStep = p.newMarket.currentStep

    const updatedMarket = { ...p.newMarket }
    let scalarSmallNum = type === 'small' ? value : updatedMarket.scalarSmallNum
    let scalarBigNum = type === 'big' ? value : updatedMarket.scalarBigNum

    if (!(scalarSmallNum instanceof BigNumber) && scalarSmallNum !== '') {
      scalarSmallNum = new BigNumber(scalarSmallNum)
    }

    if (!(scalarBigNum instanceof BigNumber) && scalarBigNum !== '') {
      scalarBigNum = new BigNumber(scalarBigNum)
    }

    if (type === 'small') {
      switch (true) {
        case scalarSmallNum === '':
          updatedMarket.validations[currentStep].scalarSmallNum = 'This field is required.'
          break
        case scalarSmallNum.lessThan(this.state.scalarMin):
          updatedMarket.validations[currentStep].scalarSmallNum = `Must be greater than: ${this.state.scalarMin.toNumber()}`
          break
        case scalarSmallNum.greaterThan(this.state.scalarMax):
          updatedMarket.validations[currentStep].scalarSmallNum = `Must be less than: ${this.state.scalarMax.toNumber()}`
          break
        case scalarBigNum !== '' && scalarSmallNum.greaterThanOrEqualTo(scalarBigNum):
          updatedMarket.validations[currentStep].scalarSmallNum = 'Your minimum must be smaller than your maximum.'
          break
        default:
          updatedMarket.validations[currentStep].scalarSmallNum = true
      }

      updatedMarket.scalarSmallNum = scalarSmallNum
    }

    if (type === 'big') {
      switch (true) {
        case scalarBigNum === '':
          updatedMarket.validations[currentStep].scalarBigNum = 'This field is required.'
          break
        case scalarBigNum.lessThan(this.state.scalarMin):
          updatedMarket.validations[currentStep].scalarBigNum = `Must be greater than: ${this.state.scalarMin.toNumber()}`
          break
        case scalarBigNum.greaterThan(this.state.scalarMax):
          updatedMarket.validations[currentStep].scalarBigNum = `Must be less than: ${this.state.scalarMax.toNumber()}`
          break
        case scalarSmallNum !== '' && scalarBigNum.lessThanOrEqualTo(scalarSmallNum):
          updatedMarket.validations[currentStep].scalarBigNum = 'Your maximum must be larger than your minimum.'
          break
        default:
          updatedMarket.validations[currentStep].scalarBigNum = true
      }

      updatedMarket.scalarBigNum = scalarBigNum
    }

    updatedMarket.isValid = p.isValid(currentStep)

    p.updateNewMarket(updatedMarket)
  }

  validateOutcomes(value, index) {
    const p = this.props
    const currentStep = p.newMarket.currentStep

    const updatedMarket = { ...p.newMarket }
    const outcomes = updatedMarket.outcomes
    outcomes[index] = value
    const cleanedOutcomes = outcomes.filter(outcome => outcome !== '')

    switch (true) {
      case cleanedOutcomes.length < CATEGORICAL_OUTCOMES_MIN_NUM:
        updatedMarket.validations[currentStep].outcomes = 'At least two outcomes are required.'
        break
      case cleanedOutcomes.length > CATEGORICAL_OUTCOMES_MAX_NUM:
        updatedMarket.validations[currentStep].outcomes = 'Please enter a max of 8 outcomes.'
        break
      case value !== '' && cleanedOutcomes.filter(outcome => outcome === value).length >= 2:
        updatedMarket.validations[currentStep].outcomes = 'Outcome name must be unique.'
        break
      default:
        updatedMarket.validations[currentStep].outcomes = true
    }

    updatedMarket.outcomes = outcomes
    updatedMarket.isValid = p.isValid(currentStep)

    p.updateNewMarket(updatedMarket)
  }

  render() {
    const p = this.props
    const s = this.state

    return (
      <ul className={StylesForm.CreateMarketForm__fields}>
        <li>
          <label>
            <span>Market Type</span>
          </label>
          <ul className={StylesForm['CreateMarketForm__radio-buttons']}>
            <li>
              <button
                className={classNames({ [`${StylesForm.active}`]: p.newMarket.type === BINARY })}
                onClick={(e) => { this.setState({ marketType: BINARY }); this.validateType(BINARY) }}
              >Yes/No</button>
            </li>
            <li>
              <button
                className={classNames({ [`${StylesForm.active}`]: p.newMarket.type === CATEGORICAL })}
                onClick={(e) => { this.setState({ marketType: CATEGORICAL }); this.validateType(CATEGORICAL) }}
              >Multiple Choice</button>
            </li>
            <li>
              <button
                className={classNames({ [`${StylesForm.active}`]: p.newMarket.type === SCALAR })}
                onClick={(e) => { this.setState({ marketType: SCALAR }); this.validateType(SCALAR) }}
              >Numerical Range</button>
            </li>
          </ul>
        </li>
        { p.newMarket.type === CATEGORICAL &&
          <li>
            <label htmlFor="cm__input--outcome1">
              <span>Potential Outcomes</span>
            </label>
            { p.newMarket.validations[p.newMarket.currentStep].outcomes.length &&
              <span className={StylesForm.CreateMarketForm__error}>
                { p.newMarket.validations[p.newMarket.currentStep].outcomes }
              </span>
            }
            <div className={Styles.CreateMarketOutcome__categorical}>
              {
                [...Array(s.outcomeFieldCount).keys()].map((i) => {
                  const placeholderText = i < 2 ? 'Outcome' : 'Optional Outcome'
                  return (
                    <input
                      key={i}
                      type="text"
                      value={p.newMarket.outcomes[i]}
                      placeholder={placeholderText}
                      maxLength={CATEGORICAL_OUTCOME_MAX_LENGTH}
                      onChange={e => this.validateOutcomes(e.target.value, i)}
                    />
                  )
                })
              }
              { s.showAddOutcome &&
                <button
                  className={Styles['CreateMarketOutcome__show-more']}
                  onClick={this.handleAddOutcomeClick}
                >
                  + Add Outcome
                </button>
              }
            </div>
          </li>
        }
        { p.newMarket.type === SCALAR &&
          <li>
            <label htmlFor="cm__input--min">
              <span>Range Values</span>
            </label>
            { p.newMarket.validations[p.newMarket.currentStep].scalarSmallNum.length &&
              <span className={StylesForm.CreateMarketForm__error}>
                { p.newMarket.validations[p.newMarket.currentStep].scalarSmallNum }
              </span>
            }
            { p.newMarket.validations[p.newMarket.currentStep].scalarBigNum.length &&
              <span className={StylesForm['CreateMarketForm__error--field-50']}>
                { p.newMarket.validations[p.newMarket.currentStep].scalarBigNum }
              </span>
            }
            <div className={Styles.CreateMarketOutcome__scalar}>
              <input
                id="cm__input--min"
                type="number"
                min={s.scalarMin}
                max={s.scalarMax}
                value={p.newMarket.scalarSmallNum instanceof BigNumber ? p.newMarket.scalarSmallNum.toNumber() : p.newMarket.scalarSmallNum}
                placeholder="Min Value"
                onChange={(e) => { this.validateScalarNum(e.target.value, 'small') }}
              />
              <input
                id="cm__input--max"
                type="number"
                min={s.scalarMin}
                max={s.scalarMax}
                value={p.newMarket.scalarBigNum instanceof BigNumber ? p.newMarket.scalarBigNum.toNumber() : p.newMarket.scalarBigNum}
                placeholder="Max Value"
                onChange={(e) => { this.validateScalarNum(e.target.value, 'big') }}
              />
            </div>
          </li>
        }
        { p.newMarket.type &&
          <li>
            <label htmlFor="cm__input--details">
              <span>Additional Details</span>
            </label>
            <textarea
              id="cm__input--details"
              value={p.newMarket.detailsText}
              placeholder="Optional - Include any additional information that traders should know about this market."
              onChange={(e) => { p.updateNewMarket({ detailsText: e.target.value }) }}
            />
          </li>
        }
      </ul>
    )
  }
}
