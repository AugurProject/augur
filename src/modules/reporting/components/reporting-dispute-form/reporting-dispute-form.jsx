/* eslint jsx-a11y/label-has-for: 0 */

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { createBigNumber } from 'utils/create-big-number'

import { SCALAR } from 'modules/markets/constants/market-types'
import { formatAttoRep, formatNumber } from 'utils/format-number'
import { ExclamationCircle as InputErrorIcon } from 'modules/common/components/icons'
import FormStyles from 'modules/common/less/form'
import Styles from 'modules/reporting/components/reporting-dispute-form/reporting-dispute-form.styles'
import ReportingDisputeProgress from 'modules/reporting/components/reporting-dispute-progress/reporting-dispute-progress'
import selectDisputeOutcomes from 'modules/reporting/selectors/select-dispute-outcomes'
import fillDisputeOutcomeProgress from 'modules/reporting/selectors/fill-dispute-outcome-progress'
import { isEqual } from 'lodash'

export default class ReportingDisputeForm extends Component {

  static propTypes = {
    market: PropTypes.object.isRequired,
    updateState: PropTypes.func.isRequired,
    stake: PropTypes.number.isRequired,
    addUpdateAccountDispute: PropTypes.func.isRequired,
    getDisputeInfo: PropTypes.func.isRequired,
    forkThreshold: PropTypes.object.isRequired,
    accountDisputeData: PropTypes.object,
  }

  static checkStake(wholeREPstake, updatedValidations, maxRep) {
    const bnMaxRep = createBigNumber(formatNumber(createBigNumber(maxRep).toNumber(), { decimals: 4, roundUp: true }).formattedValue)
    const bnStake = createBigNumber(wholeREPstake || 0)

    if (wholeREPstake === '' || wholeREPstake == null || wholeREPstake <= 0) {
      updatedValidations.stake = 'The stake field is required.'
    } else if (bnStake.gt(bnMaxRep)) {
      updatedValidations.stake = `Max value is ${formatNumber(bnMaxRep, { decimals: 4, roundUp: true }).formatted}`
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
      selectedOutcome: '',
      selectedOutcomeName: '',
      disputeBondValue: '0',
      isMarketInValid: false,
      validations: {
        stake: false,
        selectedOutcome: null,
      },
      currentOutcome: {},
      scalarInputChoosen: false,
    }

    this.focusTextInput = this.focusTextInput.bind(this)
  }

  componentWillMount() {
    this.getMarketDisputeInfo()
    if (this.props.accountDisputeData) {
      this.setAccountDisputeData(this.props.accountDisputeData)
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !isEqual(nextState, this.state)
  }

  componentDidUpdate() {
    this.getMarketDisputeInfo()
  }

  componentWillUnmount() {
    const {
      addUpdateAccountDispute,
      market,
    } = this.props
    if (this.state.selectedOutcome !== '' || this.state.isMarketInValid) {
      addUpdateAccountDispute({
        marketId: market.id,
        selectedOutcome: this.state.selectedOutcome,
        selectedOutcomeName: this.state.selectedOutcomeName,
        isMarketInValid: this.state.isMarketInValid,
        validations: this.state.validations,
      })
    }
  }

  getMarketDisputeInfo() {
    const {
      accountDisputeData,
      getDisputeInfo,
      market,
      forkThreshold,
    } = this.props

    getDisputeInfo([market.id], (err, disputeInfos) => {
      if (err) return console.error(err)
      const disputeInfo = disputeInfos[0]
      const { bondSizeOfNewStake } = disputeInfo
      const disputeOutcomes = selectDisputeOutcomes(market, disputeInfo.stakes, bondSizeOfNewStake, forkThreshold)
        .map(o => fillDisputeOutcomeProgress(bondSizeOfNewStake, o))

      this.setState({
        outcomes: disputeOutcomes.filter(item => !item.tentativeWinning) || [],
        currentOutcome: disputeOutcomes.find(item => item.tentativeWinning) || {},
        disputeBondValue: bondSizeOfNewStake,
        disputeBondFormatted: formatAttoRep(bondSizeOfNewStake, { decimals: 4, denomination: ' REP' }).formatted,
      })

      // outcomes need to be populated before validating saved data
      if (accountDisputeData) {
        this.validateSavedValues()
      }
    })
  }

  setAccountDisputeData(accountDisputeData) {
    const {
      stake,
      updateState,
    } = this.props
    if (stake > 0) {
      delete accountDisputeData.validations.stake
    }

    this.setState({
      isMarketInValid: accountDisputeData.isMarketInValid ? accountDisputeData.isMarketInValid : null,
      selectedOutcome: accountDisputeData.selectedOutcome ? accountDisputeData.selectedOutcome : '',
      selectedOutcomeName: accountDisputeData.selectedOutcomeName ? accountDisputeData.selectedOutcomeName : '',
      validations: accountDisputeData.validations,
    })

    updateState({
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
    const { market } = this.props
    if (market.marketType === SCALAR) {
      if (!this.state.outcomes.find(o => o.id === this.state.selectedOutcome)) {
        this.validateScalar(this.state.selectedOutcome, 'outcome', market.minPrice, market.maxPrice, market.tickSize, this.state.isMarketInValid)
      }
    } else {
      this.validateOutcome(this.state.validations, this.state.selectedOutcome, this.state.selectedOutcomeName, this.state.isMarketInValid)
    }
  }

  validateStake(rawStake) {
    const { updateState } = this.props
    const updatedValidations = { ...this.state.validations }

    let stake = rawStake

    if (stake !== '') {
      stake = createBigNumber(formatNumber(createBigNumber(stake).toNumber(), { decimals: 4, roundUp: true }).formattedValue)
    }

    ReportingDisputeForm.checkStake(stake, updatedValidations, this.calculateMaxRep())

    this.setState({
      inputStake: stake ? stake.toNumber() : stake,
      validations: updatedValidations,
    })

    updateState({
      validations: updatedValidations,
      stake: stake ? stake.toNumber() : 0,
    })
  }

  validateOutcome(validations, selectedOutcome, selectedOutcomeName, isMarketInValid) {
    const {
      stake,
      updateState,
    } = this.props
    const updatedValidations = { ...validations }
    updatedValidations.selectedOutcome = true
    delete updatedValidations.err
    let isInvalid = isMarketInValid

    // outcome with id of .5 means invalid
    if (selectedOutcome === '0.5') isInvalid = true

    ReportingDisputeForm.checkStake(stake, updatedValidations, this.calculateMaxRep(selectedOutcome))

    this.setState({
      validations: updatedValidations,
      selectedOutcome,
      selectedOutcomeName: selectedOutcomeName.toString(),
      isMarketInValid: isInvalid,
      inputSelectedOutcome: '',
      scalarInputChoosen: false,
    })

    updateState({
      validations: updatedValidations,
      selectedOutcome,
      selectedOutcomeName: selectedOutcomeName.toString(),
      isMarketInValid: isInvalid,
    })
  }

  focusTextInput() {
    this.textInput.focus()
  }

  validateScalar(value, humanName, min, max, tickSize, isInvalid) {
    const {
      stake,
      updateState,
    } = this.props
    const updatedValidations = { ...this.state.validations }

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
      const bnValue = createBigNumber(value)
      const bnTickSize = createBigNumber(tickSize)

      switch (true) {
        case value === '':
          updatedValidations.err = `The ${humanName} field is required.`
          break
        case isNaN(valueValue):
          updatedValidations.err = `The ${humanName} field must be a number.`
          break
        case (valueValue > maxValue || valueValue < minValue):
          updatedValidations.err = `Please enter a ${humanName} between ${min} and ${max}.`
          break
        case value === this.state.currentOutcome.id:
          updatedValidations.err = `Current tentative winning outcome.`
          break
        case bnValue.mod(bnTickSize).gt('0'):
          updatedValidations.err = `The ${humanName} field must be a multiple of ${tickSize}.`
          break
        default:
          delete updatedValidations.err
          updatedValidations.selectedOutcome = true
          break
      }
    }

    ReportingDisputeForm.checkStake(stake, updatedValidations, this.calculateMaxRep())

    this.setState({
      inputSelectedOutcome: value,
      validations: updatedValidations,
      selectedOutcome: value,
      selectedOutcomeName: value ? value.toString() : '',
      isMarketInValid: isInvalid,
      scalarInputChoosen: true,
    })

    updateState({
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
    const BNValue = createBigNumber(value)
    return formatAttoRep(BNValue.toNumber(), { decimals: 4, roundUp: true }).fullPrecision
  }


  render() {
    const {
      market,
      stake,
    } = this.props
    const s = this.state

    return (
      <ul className={classNames(Styles.ReportingDisputeForm__fields, FormStyles.Form__fields)}>
        <li>
          <label>
            <span>Tentative Winning Outcome</span>
          </label>
          <p>{s.currentOutcome.isInvalid ? 'Invalid' : s.currentOutcome.name }
            {market.marketType === SCALAR && !s.currentOutcome.isInvalid &&
              <label>{market.scalarDenomination}</label>
            }
          </p>
        </li>
        <li>
          <label>
            <span>Proposed Outcome</span>
          </label>
          <ul className={classNames(Styles.ReportingDisputeForm__table, FormStyles['Form__radio-buttons--per-line'])}>
            { s.outcomes.map(outcome => (
              <li key={outcome.id}>
                <button
                  className={classNames({ [`${FormStyles.active}`]: s.selectedOutcome === outcome.id })}
                  onClick={(e) => { this.validateOutcome(s.validations, outcome.id, outcome.name, false) }}
                >
                  { outcome.name === 'Indeterminate' ? 'Market Is Invalid' : outcome.name }
                </button>
                <ReportingDisputeProgress
                  key={outcome.id}
                  {...outcome}
                  isSelected={s.selectedOutcome === outcome.id}
                  tentativeStake={stake}
                  disputeBondFormatted={s.disputeBondFormatted}
                />
              </li>
            ))
            }
            { market.marketType === SCALAR &&
              <li className={FormStyles['field--inline']}>
                <ul className={FormStyles['Form__radio-buttons--per-line-long']}>
                  <li>
                    <button
                      className={classNames({ [`${FormStyles.active}`]: s.scalarInputChoosen })}
                      onClick={(e) => { this.validateScalar('', 'selectedOutcome', market.minPrice, market.maxPrice, market.tickSize, false) }}
                    />
                    <input
                      id="sr__input--outcome-scalar"
                      type="number"
                      ref={(input) => { this.textInput = input }}
                      min={market.minPrice}
                      max={market.maxPrice}
                      step={market.tickSize}
                      placeholder={market.scalarDenomination}
                      value={s.inputSelectedOutcome}
                      className={classNames({ [`${FormStyles['Form__error--field']}`]: s.validations.hasOwnProperty('err') && s.validations.selectedOutcome })}
                      onChange={(e) => { this.validateScalar(e.target.value, 'outcome', market.minPrice, market.maxPrice, market.tickSize, false) }}
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
                className={classNames(FormStyles.Form__input, { [`${FormStyles['Form__error--field']}`]: s.validations.hasOwnProperty('stake') && s.validations.selectedOutcome })}
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
