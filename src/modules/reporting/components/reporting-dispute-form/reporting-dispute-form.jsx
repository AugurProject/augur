/* eslint jsx-a11y/label-has-for: 0 */

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { createBigNumber } from 'utils/create-big-number'
import { ZERO } from 'modules/trade/constants/numbers'
import { SCALAR } from 'modules/markets/constants/market-types'
import { formatAttoRep, formatNumber } from 'utils/format-number'
import { augur } from 'services/augurjs'
import { ExclamationCircle as InputErrorIcon } from 'modules/common/components/icons'
import FormStyles from 'modules/common/less/form'
import Styles from 'modules/reporting/components/reporting-dispute-form/reporting-dispute-form.styles'
import ReportingDisputeProgress from 'modules/reporting/components/reporting-dispute-progress/reporting-dispute-progress'

export default class ReportingDisputeForm extends Component {

  static propTypes = {
    market: PropTypes.object.isRequired,
    updateState: PropTypes.func.isRequired,
    stakeInfo: PropTypes.object.isRequired,
    addUpdateAccountDispute: PropTypes.func.isRequired,
    loadMarketsDisputeInfo: PropTypes.func.isRequired,
    forkThreshold: PropTypes.object.isRequired,
    accountDisputeData: PropTypes.object,
    availableRep: PropTypes.string.isRequired,
    outcomes: PropTypes.array,
  }

  static constructRepObject(raw) {
    const { ETHER } = augur.rpc.constants
    const adjRaw = raw

    return {
      formatted: formatAttoRep(createBigNumber(adjRaw, 10), { decimals: 4, roundUp: true }),
      fullAmount: createBigNumber(adjRaw, 10).dividedBy(ETHER).toFixed(),
    }
  }

  constructor(props) {
    super(props)
    const { bondSizeOfNewStake, disputeRound } = props.market.disputeInfo

    this.state = {
      inputStake: this.props.stakeInfo.displayValue || '',
      inputSelectedOutcome: '',
      selectedOutcome: '',
      selectedOutcomeName: '',
      currentDisputeRound: disputeRound,
      disputeBondValue: bondSizeOfNewStake,
      bnAvailableRep: createBigNumber(this.props.availableRep, 10),
      isMarketInValid: false,
      validations: {
        stake: false,
        selectedOutcome: null,
        isDisputeActive: true,
      },
      scalarInputChoosen: false,
    }

    this.focusTextInput = this.focusTextInput.bind(this)
  }

  componentWillMount() {
    this.updateDisptueInfoState()
    if (this.props.accountDisputeData) {
      this.setAccountDisputeData(this.props.accountDisputeData)
    }
  }

  componentWillReceiveProps(newProps) {
    const { disputeInfo } = newProps.market
    const updatedValidations = { ...this.state.validations }
    if (disputeInfo.disputeRound !== this.state.currentDisputeRound) {
      updatedValidations.isDisputeActive = disputeInfo.disputeRound === this.state.currentDisputeRound
      this.setState({
        validations: updatedValidations,
      })
      this.props.updateState({
        validations: updatedValidations,
      })
    }
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

  setAccountDisputeData(accountDisputeData) {
    const {
      stakeInfo,
      updateState,
    } = this.props
    if (stakeInfo && createBigNumber(stakeInfo.repValue).gt(ZERO)) {
      delete accountDisputeData.validations.stake
    }
    delete accountDisputeData.validations.isDisputeActive
    this.setState({
      isMarketInValid: accountDisputeData.isMarketInValid ? accountDisputeData.isMarketInValid : null,
      selectedOutcome: accountDisputeData.selectedOutcome ? accountDisputeData.selectedOutcome : '',
      selectedOutcomeName: accountDisputeData.selectedOutcomeName ? accountDisputeData.selectedOutcomeName : '',
      validations: accountDisputeData.validations,
    }, () => {
      updateState({
        isMarketInValid: this.state.isMarketInValid,
        selectedOutcome: this.state.selectedOutcome,
        selectedOutcomeName: this.state.selectedOutcomeName,
        validations: this.state.validations,
      })
    })
  }

  setMAXStake() {
    this.validateStake(this.calculateMaxRep(this.state.selectedOutcome))
  }

  updateDisptueInfoState() {
    const {
      accountDisputeData,
      loadMarketsDisputeInfo,
      market,
      availableRep,
    } = this.props

    this.setState({
      bnAvailableRep: createBigNumber(availableRep),
    })

    loadMarketsDisputeInfo([market.id], (err, disputeInfos) => {
      if (accountDisputeData) {
        this.validateSavedValues()
      }
    })
  }

  checkStake(stakeValue, updatedValidations, maxRepObject) {

    if (stakeValue === '' || stakeValue == null || stakeValue === 0 || stakeValue === '0') {
      updatedValidations.stake = 'The stake field is required.'
      return updatedValidations
    }

    const bnStake = createBigNumber(stakeValue)
    if (stakeValue < 0) {
      updatedValidations.stake = 'The stake field must be a positive value.'
    } else if (bnStake.gt(createBigNumber(maxRepObject.formatted.formattedValue, 10))) {
      updatedValidations.stake = `Max value is ${maxRepObject.formatted.full}`
    } else if (this.state.bnAvailableRep.lt(bnStake)) {
      updatedValidations.stake = `Desposit Stake is greater then your available amount`
    } else {
      delete updatedValidations.stake
    }
    return updatedValidations
  }

  validateSavedValues() {
    const { market, outcomes } = this.props
    if (market.marketType === SCALAR) {
      if (!outcomes.find(o => o.id === this.state.selectedOutcome)) {
        this.validateScalar(this.state.selectedOutcome, 'outcome', market.minPrice, market.maxPrice, market.tickSize, this.state.isMarketInValid)
      }
    } else {
      this.validateOutcome(this.state.validations, this.state.selectedOutcome, this.state.selectedOutcomeName, this.state.isMarketInValid)
    }
  }

  validateStake(rawStakeObj) {
    const { updateState } = this.props
    const { ETHER } = augur.rpc.constants
    const updatedValidations = { ...this.state.validations }
    let completeStakeObj = rawStakeObj
    const maxInfo = this.calculateMaxRep(this.state.selectedOutcome)

    if (completeStakeObj.raw === '') {
      this.checkStake('', updatedValidations, maxInfo)
      this.setState({
        inputStake: completeStakeObj.raw,
        validations: updatedValidations,
      })
      updateState({
        validations: updatedValidations,
        stakeInfo: { displayValue: 0, repValue: '0' },
      })
      return
    }

    if (!completeStakeObj.formatted) {
      // convert user inputted value to attoRep
      const rep = createBigNumber(completeStakeObj.raw, 10).times(ETHER)
      const attoRep = createBigNumber(formatNumber(rep, { decimals: 4, roundUp: true }).formattedValue, 10)
      completeStakeObj = ReportingDisputeForm.constructRepObject(attoRep)
    }

    this.checkStake(completeStakeObj.formatted.formattedValue, updatedValidations, maxInfo)

    const newStake = { displayValue: completeStakeObj.formatted.formattedValue, repValue: completeStakeObj.fullAmount }
    if (completeStakeObj.formatted.formattedValue === maxInfo.formatted.formattedValue) {
      newStake.repValue = maxInfo.fullAmount
    }

    this.setState({
      inputStake: completeStakeObj.formatted.formattedValue,
      validations: updatedValidations,
    })

    updateState({
      validations: updatedValidations,
      stakeInfo: newStake,
    })
  }

  validateOutcome(validations, selectedOutcome, selectedOutcomeName, isMarketInValid) {
    const {
      stakeInfo,
      updateState,
    } = this.props
    const updatedValidations = { ...validations }
    updatedValidations.selectedOutcome = true
    delete updatedValidations.err
    let isInvalid = isMarketInValid

    // outcome with id of .5 means invalid
    if (selectedOutcome === '0.5') isInvalid = true

    this.checkStake(stakeInfo.repValue, updatedValidations, this.calculateMaxRep(selectedOutcome))

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
      stakeInfo,
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
      const bnValue = createBigNumber(value || 0)
      const bnTickSize = createBigNumber(tickSize)
      const winner = this.props.outcomes.find(o => o.tentativeWinning)

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
        case value === winner.id:
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

    this.checkStake(stakeInfo.repValue, updatedValidations, this.calculateMaxRep())

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
    const outcome = this.props.outcomes.find((o) => {
      const result = o.id === selectedOutcome
      return result
    })

    return ReportingDisputeForm.constructRepObject(outcome ? outcome.stakeRemaining : this.state.disputeBondValue)
  }


  render() {
    const {
      market,
      stakeInfo,
      outcomes,
    } = this.props
    const s = this.state
    const winner = (outcomes && outcomes.find(o => o.tentativeWinning)) || {}
    const { disputeRound } = market.disputeInfo
    return (
      <ul className={classNames(Styles.ReportingDisputeForm__fields, FormStyles.Form__fields)}>
        <li>
          <label>
            <span>Tentative Winning Outcome</span>
          </label>
          <p>{winner.isInvalid ? 'Invalid' : winner.name }
            {market.marketType === SCALAR && !winner.isInvalid &&
              <label>{market.scalarDenomination}</label>
            }
            { s.currentDisputeRound !== disputeRound &&
              <label className={Styles.ReportingDisputeForm__tentative} >New tentative outcome</label>
            }
          </p>
        </li>
        <li>
          <label>
            <span>Proposed Outcome</span>
          </label>
          <ul className={classNames(Styles.ReportingDisputeForm__table, FormStyles['Form__radio-buttons--per-line'])}>
            { outcomes && outcomes.filter(o => !o.tentativeWinning).map(outcome => (
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
                  tentativeStake={stakeInfo.displayValue}
                />
              </li>
            ))
            }
            { market.marketType === SCALAR &&
              <li className={FormStyles['field--inline']}>
                <ul className={classNames(Styles.ReportingDisputeForm__table__input, FormStyles['Form__radio-buttons--per-line'])}>
                  <li>
                    <button
                      className={classNames({ [`${FormStyles.active}`]: s.scalarInputChoosen })}
                      onClick={(e) => { this.validateScalar('', 'selected outcome', market.minPrice, market.maxPrice, market.tickSize, false) }}
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
                    <ReportingDisputeProgress
                      key="scalar_input_progress"
                      isSelected={s.scalarInputChoosen}
                      tentativeStake={stakeInfo.displayValue}
                      percentageComplete={0}
                      percentageAccount={0}
                      bondSizeCurrent={s.disputeBondValue}
                      stakeRemaining={s.disputeBondValue}
                      stakeCurrent="0"
                      accountStakeCurrent="0"
                    />
                  </li>
                  <li>
                    { s.validations.hasOwnProperty('err') &&
                      <span className={FormStyles.Form__error__space}>
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
                onChange={e => this.validateStake({ raw: e.target.value })}
              />
              { s.selectedOutcomeName && s.selectedOutcomeName.length > 0 &&
                <div className={Styles.ReportingDisputeForm__container}>
                  <button
                    className={classNames(Styles.ReportingDisputeForm__button, FormStyles['button--inline'])}
                    onClick={() => { this.setMAXStake() }}
                  >MAX
                  </button>
                </div>
              }
            </li>
            <li>
              { s.validations.hasOwnProperty('stake') && s.validations.stake.length &&
                <span className={FormStyles['Form__error--even']}>
                  {InputErrorIcon}{ s.validations.stake }
                </span>
              }
            </li>
            { s.validations.hasOwnProperty('isDisputeActive') && !s.validations.isDisputeActive &&
              <label>
                <span className={Styles.ReportingDisputeForm__disputeEnded}>
                  {InputErrorIcon}{`Dispute round has ended, wait for next round to dispute`}
                </span>
              </label>
            }
          </ul>
        </li>
      </ul>
    )
  }
}
