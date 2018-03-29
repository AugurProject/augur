/* eslint jsx-a11y/label-has-for: 0 */

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { BigNumber, WrappedBigNumber } from 'utils/wrapped-big-number'

import { SCALAR } from 'modules/markets/constants/market-types'
import { formatAttoRep } from 'utils/format-number'
import { ExclamationCircle as InputErrorIcon } from 'modules/common/components/icons'
import FormStyles from 'modules/common/less/form'
import Styles from 'modules/reporting/components/reporting-dispute-form/reporting-dispute-form.styles'
import ReportingDisputeProgress from 'modules/reporting/components/reporting-dispute-progress/reporting-dispute-progress'
import selectDisputeOutcomes from 'modules/reporting/selectors/select-dispute-outcomes'
import fillDisputeOutcomeProgress from 'modules/reporting/selectors/fill-dispute-outcome-progress'

export default class ReportingDisputeForm extends Component {

  static propTypes = {
    market: PropTypes.object.isRequired,
    updateState: PropTypes.func.isRequired,
    stake: PropTypes.number.isRequired,
    addUpdateAccountDispute: PropTypes.func.isRequired,
    getDisputeInfo: PropTypes.func.isRequired,
    accountDisputeData: PropTypes.object,
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
      inputStake: this.props.stake > 0 ? this.props.stake : '',
      inputSelectedOutcome: '',
      paddingBuffer: 0,
      selectedOutcome: '',
      selectedOutcomeName: '',
      isMarketInValid: false,
      validations: {
        stake: false,
        selectedOutcome: null,
      },
      currentOutcome: {},
      scalarInputChoosen: false,
    }

    this.focusTextInput = this.focusTextInput.bind(this)

    if (this.props.accountDisputeData) {
      this.setAccountDisputeData(this.props.accountDisputeData)
    }

  }

  componentWillMount() {
    this.getDisputeInfo()
  }

  componentDidUpdate() {
    this.getDisputeInfo()
  }

  componentWillUnmount() {
    if (this.state.selectedOutcome !== '' || this.state.isMarketInValid) {
      this.props.addUpdateAccountDispute({
        marketId: this.props.market.id,
        selectedOutcome: this.state.selectedOutcome,
        selectedOutcomeName: this.state.selectedOutcomeName,
        isMarketInValid: this.state.isMarketInValid,
        validations: this.state.validations,
      })
    }
  }

  getDisputeInfo() {
    this.props.getDisputeInfo([this.props.market.id], (err, disputeInfos) => {
      if (err) return console.error(err)
      const disputeInfo = disputeInfos[0]
      const { bondSizeOfNewStake } = disputeInfo
      const disputeOutcomes = selectDisputeOutcomes(this.props.market, disputeInfo.stakes, bondSizeOfNewStake)
        .map(o => fillDisputeOutcomeProgress(bondSizeOfNewStake, o))

      this.state.outcomes = disputeOutcomes.filter(item => !item.tentativeWinning) || []
      this.state.currentOutcome = disputeOutcomes.find(item => item.tentativeWinning) || {}

      this.state.paddingBuffer = this.state.outcomes.reduce((p, i) => {
        const result = i.name.length > p ? i.name.length : p
        return result
      }, 0)

      this.state.disputeBondValue = parseInt(bondSizeOfNewStake, 10)
      this.state.disputeBondFormatted = formatAttoRep(bondSizeOfNewStake, { decimals: 4, denomination: ' REP' }).formatted

      this.props.updateState({
        disputeBondFormatted: this.state.disputeBondFormatted,
        currentOutcome: this.state.currentOutcome,
      })
      // outcomes need to be populated before validating saved data
      if (this.props.accountDisputeData) {
        this.validateSavedValues()
      }
    })
  }

  setAccountDisputeData(accountDisputeData) {
    if (this.props.stake > 0) {
      delete accountDisputeData.validations.stake
    }
    this.state.isMarketInValid = accountDisputeData.isMarketInValid ? accountDisputeData.isMarketInValid : null
    this.state.selectedOutcome = accountDisputeData.selectedOutcome ? accountDisputeData.selectedOutcome : ''
    this.state.selectedOutcomeName = accountDisputeData.selectedOutcomeName ? accountDisputeData.selectedOutcomeName : ''
    this.state.validations = accountDisputeData.validations

    this.props.updateState({
      isMarketInValid: this.state.isMarketInValid,
      selectedOutcome: this.state.selectedOutcome,
      selectedOutcomeName: this.state.selectedOutcomeName,
      validations: this.state.validations,
    })
  }

  setMAXStake() {
    this.validateStake(this.calculateMaxRep(this.state.selectedOutcome))
  }

  validateSavedValues() {
    if (this.props.market.marketType === SCALAR) {
      if (!this.state.outcomes.find(o => o.id === this.state.selectedOutcome)) {
        this.validateScalar(this.state.selectedOutcome, 'outcome', this.props.market.minPrice, this.props.market.maxPrice, this.state.isMarketInValid)
      }
    } else {
      this.validateOutcome(this.state.validations, this.state.selectedOutcome, this.state.selectedOutcomeName, this.state.isMarketInValid)
    }
  }

  validateStake(rawStake) {
    const updatedValidations = { ...this.state.validations }

    let stake = rawStake

    if (stake !== '' && !(BigNumber.isBigNumber(stake))) {
      stake = WrappedBigNumber(rawStake).decimalPlaces(4)
    }

    ReportingDisputeForm.checkStake(stake, updatedValidations)

    this.setState({
      inputStake: stake ? stake.toNumber() : stake,
      validations: updatedValidations,
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

    this.state.inputSelectedOutcome = ''
    this.state.scalarInputChoosen = false

    this.setState({
      validations: updatedValidations,
      selectedOutcome,
      selectedOutcomeName: selectedOutcomeName.toString(),
      isMarketInValid: isInvalid,
    })

    this.props.updateState({
      validations: updatedValidations,
      selectedOutcome,
      selectedOutcomeName: selectedOutcomeName.toString(),
      isMarketInValid: isInvalid,
    })
  }

  focusTextInput() {
    this.textInput.focus()
  }

  validateScalar(value, humanName, min, max, isInvalid) {
    const updatedValidations = { ...this.state.validations }
    this.state.scalarInputChoosen = true
    if (value === '') {
      this.focusTextInput()
    }

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
        case value === this.state.currentOutcome.id:
          updatedValidations.err = `Current tentative winning outcome.`
          break
        default:
          delete updatedValidations.err
          updatedValidations.selectedOutcome = true
          break
      }
    }

    ReportingDisputeForm.checkStake(this.props.stake, updatedValidations)

    this.setState({
      inputSelectedOutcome: value,
      validations: updatedValidations,
      selectedOutcome: value,
      selectedOutcomeName: value ? value.toString() : '',
      isMarketInValid: isInvalid,
    })

    this.props.updateState({
      validations: updatedValidations,
      selectedOutcome: value,
      selectedOutcomeName: value ? value.toString() : '',
      isMarketInValid: isInvalid,
    })
  }

  calculateMaxRep(selectedOutcome) {
    const outcome = this.state.outcomes.find((o) => {
      const result = o.id === selectedOutcome
      return result
    })

    const value = outcome ? outcome.stakeRemaining : this.state.disputeBondValue
    const BNValue = WrappedBigNumber(value)
    return formatAttoRep(BNValue.toNumber(), { decimals: 4, roundUp: true }).formattedValue
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
          <p>{s.currentOutcome.isInvalid ? 'Invalid' : s.currentOutcome.name }
            {p.market.marketType === SCALAR && !s.currentOutcome.isInvalid &&
              <label>{p.market.scalarDenomination}</label>
            }
          </p>

        </li>
        <li>
          <label>
            <span>Proposed Outcome</span>
          </label>
        </li>
        <li>
          <ul className={FormStyles['Form__radio-buttons--per-line']}>
            { s.outcomes.map(outcome => (
              <li key={outcome.id}>
                <button
                  className={classNames({ [`${FormStyles.active}`]: s.selectedOutcome === outcome.id })}
                  onClick={(e) => { this.validateOutcome(s.validations, outcome.id, outcome.name, false) }}
                >{outcome.name === 'Indeterminate' ? 'Market Is Invalid' : outcome.name}
                </button>
                <ReportingDisputeProgress
                  key={outcome.id}
                  {...outcome}
                  isSelected={s.selectedOutcome === outcome.id}
                  paddingAmount={s.paddingBuffer - outcome.name.length}
                  stakeRemaining={outcome.stakeRemaining}
                  percentageComplete={outcome.percentageComplete}
                  percentageAccount={outcome.percentageAccount}
                  tentativeStake={p.stake}
                  bondSizeCurrent={outcome.bondSizeCurrent}
                  stakeCurrent={outcome.stakeCurrent}
                  accountStakeCurrent={outcome.accountStakeCurrent}
                />
              </li>
            ))
            }
            { p.market.marketType === SCALAR &&
              <li className={FormStyles['field--inline']}>
                <ul className={FormStyles['Form__radio-buttons--per-line-long']}>
                  <li>
                    <button
                      className={classNames({ [`${FormStyles.active}`]: s.scalarInputChoosen })}
                      onClick={(e) => { this.validateScalar('', 'selectedOutcome', p.market.minPrice, p.market.maxPrice, false) }}
                    />
                    <input
                      id="sr__input--outcome-scalar"
                      type="number"
                      ref={(input) => { this.textInput = input }}
                      min={p.market.minPrice}
                      max={p.market.maxPrice}
                      step={p.market.tickSize}
                      placeholder={p.market.scalarDenomination}
                      value={s.inputSelectedOutcome}
                      className={classNames({ [`${FormStyles['Form__error--field']}`]: s.validations.hasOwnProperty('err') && s.validations.selectedOutcome })}
                      onChange={(e) => { this.validateScalar(e.target.value, 'outcome', p.market.minPrice, p.market.maxPrice, false) }}
                    />
                  </li>
                  <li>
                    { s.validations.hasOwnProperty('err') &&
                      <span className={FormStyles.Form__error}>
                        {InputErrorIcon}{ s.validations.err }
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
            <span htmlFor="sr__input--stake">Deposit Stake</span>
          </label>
          <ul className={FormStyles['Form__radio-buttons--per-line-inline']}>
            <li>
              <input
                id="sr__input--stake"
                type="number"
                min="0"
                placeholder="0.0000 REP"
                value={s.inputStake}
                className={classNames({ [`${FormStyles['Form__error--field']}`]: s.validations.hasOwnProperty('stake') && s.validations.selectedOutcome })}
                onChange={(e) => { this.validateStake(e.target.value) }}
              />
              { s.selectedOutcomeName && s.selectedOutcomeName.length > 0 &&
                <button
                  className={FormStyles['button--inline']}
                  onClick={() => { this.setMAXStake() }}
                >MAX
                </button>
              }
            </li>
            <li>
              { s.validations.hasOwnProperty('stake') && s.validations.stake.length &&
                <span className={FormStyles['Form__error--even']}>
                  {InputErrorIcon}{ s.validations.stake }
                </span>
              }
            </li>
          </ul>
        </li>
      </ul>
    )
  }
}
