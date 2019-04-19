/* eslint jsx-a11y/label-has-for: 0 */

import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { createBigNumber } from "utils/create-big-number";
import {
  SCALAR,
  MALFORMED_OUTCOME,
  ZERO
} from "modules/common-elements/constants";
import { formatAttoRep, formatNumber, formatRep } from "utils/format-number";
import { augur } from "services/augurjs";
import { ExclamationCircle as InputErrorIcon } from "modules/common/components/icons";
import FormStyles from "modules/common/less/form";
import Styles from "modules/reporting/components/reporting-dispute-form/reporting-dispute-form.styles";
import ReportingDisputeProgress from "modules/reporting/components/reporting-dispute-progress/reporting-dispute-progress";
import Input from "modules/common/components/input/input";
import { RepBalance } from "modules/common-elements/labels";

const { ETHER } = augur.rpc.constants;
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
    outcomes: PropTypes.array
  };

  static defaultProps = {
    accountDisputeData: null,
    outcomes: []
  };

  static constructRepObject(raw) {
    const adjRaw = raw;

    return {
      formatted: formatAttoRep(createBigNumber(adjRaw, 10), {
        decimals: 4,
        roundUp: true
      }),
      fullAmount: createBigNumber(adjRaw, 10)
        .dividedBy(ETHER)
        .toFixed()
    };
  }

  constructor(props) {
    super(props);
    const { availableRep, stakeInfo, market } = props;
    const bondSizeOfNewStake =
      market.disputeInfo && market.disputeInfo.bondSizeOfNewStake;
    const disputeRound = market.disputeInfo && market.disputeInfo.disputeRound;

    this.state = {
      inputStake: stakeInfo.displayValue || "",
      inputSelectedOutcome: "",
      selectedOutcome: "",
      selectedOutcomeName: "",
      currentDisputeRound: disputeRound,
      disputeBondValue: bondSizeOfNewStake,
      bnAvailableRep: createBigNumber(availableRep, 10),
      isMarketInValid: false,
      validations: {
        stake: false,
        selectedOutcome: null,
        isDisputeActive: true
      },
      scalarInputChoosen: false
    };

    this.focusTextInput = this.focusTextInput.bind(this);
  }

  componentWillMount() {
    const { accountDisputeData } = this.props;
    this.updateDisptueInfoState();
    if (accountDisputeData) {
      this.setAccountDisputeData(accountDisputeData);
    }
  }

  componentWillReceiveProps(newProps) {
    const { disputeInfo } = newProps.market;
    const { updateState } = this.props;
    const updatedValidations = { ...this.state.validations };
    if (
      disputeInfo &&
      disputeInfo.disputeRound !== this.state.currentDisputeRound
    ) {
      updatedValidations.isDisputeActive =
        disputeInfo.disputeRound === this.state.currentDisputeRound;
      this.setState({
        validations: updatedValidations
      });
      updateState({
        validations: updatedValidations
      });
    }
  }

  componentWillUnmount() {
    const { addUpdateAccountDispute, market } = this.props;
    const {
      selectedOutcome,
      selectedOutcomeName,
      isMarketInValid,
      validations
    } = this.state;
    if (selectedOutcome !== "" || isMarketInValid) {
      addUpdateAccountDispute({
        marketId: market.id,
        selectedOutcome,
        selectedOutcomeName,
        isMarketInValid,
        validations
      });
    }
  }

  setAccountDisputeData(accountDisputeData) {
    const { stakeInfo, updateState } = this.props;
    if (stakeInfo && createBigNumber(stakeInfo.repValue).gt(ZERO)) {
      delete accountDisputeData.validations.stake;
    }
    delete accountDisputeData.validations.isDisputeActive;
    this.setState(
      {
        isMarketInValid: accountDisputeData.isMarketInValid
          ? accountDisputeData.isMarketInValid
          : null,
        selectedOutcome: accountDisputeData.selectedOutcome
          ? accountDisputeData.selectedOutcome
          : "",
        selectedOutcomeName: accountDisputeData.selectedOutcomeName
          ? accountDisputeData.selectedOutcomeName
          : "",
        validations: accountDisputeData.validations
      },
      () => {
        const {
          isMarketInValid,
          selectedOutcome,
          selectedOutcomeName,
          validations
        } = this.state;
        updateState({
          isMarketInValid,
          selectedOutcome,
          selectedOutcomeName,
          validations
        });
      }
    );
  }

  setMAXStake() {
    this.validateStake(this.calculateMaxRep(this.state.selectedOutcome));
  }

  updateDisptueInfoState() {
    const {
      accountDisputeData,
      loadMarketsDisputeInfo,
      market,
      availableRep
    } = this.props;

    this.setState({
      bnAvailableRep: createBigNumber(availableRep)
    });

    loadMarketsDisputeInfo([market.id], (err, disputeInfos) => {
      if (accountDisputeData) {
        this.validateSavedValues();
      }
    });
  }

  checkStake(stakeValue, updatedValidations, maxRepObject) {
    if (
      stakeValue === "" ||
      stakeValue == null ||
      stakeValue === 0 ||
      stakeValue === "0"
    ) {
      updatedValidations.stake = "The stake field is required.";
      return updatedValidations;
    }

    const availableAttoRep = this.state.bnAvailableRep.times(ETHER).toFixed();
    const availableRepFormatted = ReportingDisputeForm.constructRepObject(
      availableAttoRep
    );

    const bnStake = createBigNumber(stakeValue);
    if (stakeValue < 0) {
      updatedValidations.stake = "The stake field must be a positive value.";
    } else if (
      createBigNumber(availableRepFormatted.formatted.formattedValue).lt(
        bnStake
      )
    ) {
      updatedValidations.stake = `Desposit Stake is greater then your available amount`;
    } else {
      delete updatedValidations.stake;
    }
    return updatedValidations;
  }

  validateSavedValues() {
    const { market, outcomes } = this.props;
    const {
      validations,
      selectedOutcome,
      selectedOutcomeName,
      isMarketInValid
    } = this.state;
    if (market.marketType === SCALAR) {
      if (!outcomes.find(o => o.id === selectedOutcome)) {
        this.validateScalar(
          selectedOutcome,
          "outcome",
          market.minPrice,
          market.maxPrice,
          market.tickSize,
          isMarketInValid
        );
      }
    } else {
      this.validateOutcome(
        validations,
        selectedOutcome,
        selectedOutcomeName,
        isMarketInValid
      );
    }
  }

  validateStake(rawStakeObj) {
    const { updateState } = this.props;
    const updatedValidations = { ...this.state.validations };
    let completeStakeObj = rawStakeObj;
    const maxInfo = this.calculateMaxRep(this.state.selectedOutcome);

    if (completeStakeObj.raw === "") {
      this.checkStake("", updatedValidations, maxInfo);
      this.setState({
        inputStake: completeStakeObj.raw,
        validations: updatedValidations
      });
      updateState({
        validations: updatedValidations,
        stakeInfo: { displayValue: 0, repValue: "0" }
      });
      return;
    }

    if (!completeStakeObj.formatted) {
      // convert user inputted value to attoRep
      const rep = createBigNumber(completeStakeObj.raw, 10).times(ETHER);
      const attoRep = createBigNumber(
        formatNumber(rep, { decimals: 4, roundUp: true }).formattedValue,
        10
      );
      completeStakeObj = ReportingDisputeForm.constructRepObject(attoRep);
    }

    this.checkStake(
      completeStakeObj.formatted.formattedValue,
      updatedValidations,
      maxInfo
    );

    const newStake = {
      displayValue: completeStakeObj.formatted.formattedValue,
      repValue: completeStakeObj.fullAmount
    };
    if (
      completeStakeObj.formatted.formattedValue ===
      maxInfo.formatted.formattedValue
    ) {
      newStake.repValue = maxInfo.fullAmount;
    }

    this.setState({
      inputStake: completeStakeObj.formatted.formattedValue,
      validations: updatedValidations
    });

    updateState({
      validations: updatedValidations,
      stakeInfo: newStake
    });
  }

  validateOutcome(
    validations,
    selectedOutcome,
    selectedOutcomeName,
    isMarketInValid
  ) {
    const { stakeInfo, updateState } = this.props;
    const updatedValidations = { ...validations };
    updatedValidations.selectedOutcome = true;
    delete updatedValidations.err;
    let isInvalid = isMarketInValid;

    // outcome with id of .5 means invalid
    if (selectedOutcome === "0.5") isInvalid = true;

    this.checkStake(
      stakeInfo.repValue,
      updatedValidations,
      this.calculateMaxRep(selectedOutcome)
    );

    this.setState({
      validations: updatedValidations,
      selectedOutcome,
      selectedOutcomeName: selectedOutcomeName.toString(),
      isMarketInValid: isInvalid,
      inputSelectedOutcome: "",
      scalarInputChoosen: false
    });

    updateState({
      validations: updatedValidations,
      selectedOutcome,
      selectedOutcomeName: selectedOutcomeName.toString(),
      isMarketInValid: isInvalid
    });
  }

  focusTextInput() {
    this.textInput.focus();
  }

  validateScalar(value, humanName, min, max, tickSize, isInvalid) {
    const { stakeInfo, updateState } = this.props;
    const updatedValidations = { ...this.state.validations };

    if (value === "") {
      this.focusTextInput();
    }

    if (isInvalid) {
      delete updatedValidations.err;
      updatedValidations.selectedOutcome = true;
    } else {
      const minValue = parseFloat(min);
      const bnMinPrice = createBigNumber(min);
      const maxValue = parseFloat(max);
      const valueValue = parseFloat(value);
      const bnValue = createBigNumber(value || 0);
      const bnTickSize = createBigNumber(tickSize);
      const winner = this.props.outcomes.find(o => o.tentativeWinning);

      switch (true) {
        case value === "":
          updatedValidations.err = `The ${humanName} field is required.`;
          break;
        case isNaN(valueValue):
          updatedValidations.err = `The ${humanName} field must be a number.`;
          break;
        case valueValue > maxValue || valueValue < minValue:
          updatedValidations.err = `Please enter a ${humanName} between ${min} and ${max}.`;
          break;
        case value === winner.id:
          updatedValidations.err = `Current tentative winning outcome.`;
          break;
        case bnValue
          .minus(bnMinPrice)
          .mod(bnTickSize)
          .gt("0"):
          updatedValidations.err = `The ${humanName} field must be a multiple of ${tickSize}.`;
          break;
        default:
          delete updatedValidations.err;
          updatedValidations.selectedOutcome = true;
          break;
      }
    }

    this.checkStake(
      stakeInfo.repValue,
      updatedValidations,
      this.calculateMaxRep()
    );

    this.setState({
      inputSelectedOutcome: value,
      validations: updatedValidations,
      selectedOutcome: value,
      selectedOutcomeName: value ? value.toString() : "",
      isMarketInValid: isInvalid,
      scalarInputChoosen: true
    });

    updateState({
      validations: updatedValidations,
      selectedOutcome: value,
      selectedOutcomeName: value ? value.toString() : "",
      isMarketInValid: isInvalid
    });
  }

  calculateMaxRep(selectedOutcome) {
    const outcome = this.props.outcomes.find(o => {
      const result = o.id === selectedOutcome;
      return result;
    });

    const stakeNeeded = outcome
      ? outcome.stakeRemaining
      : this.state.disputeBondValue;

    const availableAttoRep = this.state.bnAvailableRep.times(ETHER).toFixed();

    if (createBigNumber(availableAttoRep).lt(createBigNumber(stakeNeeded))) {
      return ReportingDisputeForm.constructRepObject(availableAttoRep);
    }

    return ReportingDisputeForm.constructRepObject(
      outcome ? outcome.stakeRemaining : this.state.disputeBondValue
    );
  }

  render() {
    const { market, stakeInfo, outcomes, availableRep } = this.props;
    const s = this.state;
    const winner = (outcomes && outcomes.find(o => o.tentativeWinning)) || {};
    const disputeRound = market.disputeInfo && market.disputeInfo.disputeRound;

    // need to check if selectedOutcome has already been disputed on
    let selectedOutcome =
      outcomes &&
      outcomes.find(outcome => outcome.name === s.inputSelectedOutcome);
    if (!selectedOutcome) {
      selectedOutcome = {
        percentageComplete: 0,
        percentageAccount: 0,
        bondSizeCurrent: s.disputeBondValue,
        stakeRemaining: s.disputeBondValue,
        stakeCurrent: "0",
        accountStakeCurrent: "0"
      };
    }

    return (
      <ul
        className={classNames(
          Styles.ReportingDisputeForm__fields,
          FormStyles.Form__fields
        )}
      >
        <li>
          <div className={Styles.ReportingDisputeForm__outcome_selection_msg}>
            Choose an outcome based on the resolution source when the event
            ended.
          </div>
        </li>
        <li>
          <label>
            <span>Tentative Winning Outcome</span>
          </label>
          <p>
            {winner.id === MALFORMED_OUTCOME && (
              <span>
                <span className={Styles.ReportingDisputeForm__malformed}>
                  MALFORMED OUTCOME
                </span>
              </span>
            )}
            {winner.isInvalid ? "Invalid" : winner.name}
            {market.marketType === SCALAR &&
              !winner.isInvalid && <label>{market.scalarDenomination}</label>}
            {s.currentDisputeRound !== disputeRound && (
              <label className={Styles.ReportingDisputeForm__tentative}>
                New tentative outcome
              </label>
            )}
          </p>
        </li>
        {winner.id === MALFORMED_OUTCOME && (
          <div className={Styles.ReportingReport__malformed_msg}>
            <span>
              WARNING: The tentative outcome for this market is currently
              MALFORMED.
            </span>
            <p>
              This means that the tentative outcome CANNOT BE CORRECT. You
              and/or other reporters MUST DISPUTE the outcome of this market! If
              no one disputes this outcome, then Augur will forever have an
              INCORRECT OUTCOME for this market, and outstanding bets in this
              market will not be paid out correctly.
            </p>
          </div>
        )}
        <li>
          <label>
            <span>Proposed Outcome</span>
          </label>
          <ul
            className={classNames(
              Styles.ReportingDisputeForm__table,
              FormStyles["Form__radio-buttons--per-line"]
            )}
          >
            {outcomes &&
              outcomes
                .filter(o => !o.tentativeWinning && o.id !== MALFORMED_OUTCOME)
                .map(
                  outcome =>
                    outcome.display && (
                      <li key={outcome.id}>
                        <button
                          data-testid={"button-" + outcome.id}
                          className={classNames({
                            [`${FormStyles.active}`]:
                              s.selectedOutcome === outcome.id &&
                              !s.scalarInputChoosen,
                            [FormStyles.isInvalidField]:
                              outcome.name === "Indeterminate"
                          })}
                          onClick={e => {
                            this.validateOutcome(
                              s.validations,
                              outcome.id,
                              outcome.name,
                              false
                            );
                          }}
                        >
                          {outcome.name === "Indeterminate"
                            ? "Market Is Invalid"
                            : outcome.name}
                        </button>
                        <ReportingDisputeProgress
                          key={outcome.id}
                          {...outcome}
                          isSelected={s.selectedOutcome === outcome.id}
                          tentativeStake={stakeInfo.displayValue}
                        />
                      </li>
                    )
                )}
            {market.marketType === SCALAR && (
              <li className={FormStyles["field--inline"]}>
                <ul
                  className={classNames(
                    Styles.ReportingDisputeForm__table__input,
                    FormStyles["Form__radio-buttons--per-line"]
                  )}
                >
                  <li>
                    <button
                      className={classNames({
                        [`${FormStyles.active}`]: s.scalarInputChoosen
                      })}
                      data-testid="scalar-dispute-button"
                      onClick={e => {
                        this.validateScalar(
                          "",
                          "selected outcome",
                          market.minPrice,
                          market.maxPrice,
                          market.tickSize,
                          false
                        );
                      }}
                    />
                    <input
                      id="sr__input--outcome-scalar"
                      type="number"
                      ref={input => {
                        this.textInput = input;
                      }}
                      min={market.minPrice}
                      max={market.maxPrice}
                      step={market.tickSize}
                      placeholder={market.scalarDenomination}
                      value={s.inputSelectedOutcome}
                      className={classNames(FormStyles.Form__input, {
                        [`${FormStyles["Form__error--field"]}`]:
                          s.validations.hasOwnProperty("err") &&
                          s.validations.selectedOutcome
                      })}
                      style={{ boxShadow: "none" }}
                      onChange={e => {
                        this.validateScalar(
                          e.target.value,
                          "outcome",
                          market.minPrice,
                          market.maxPrice,
                          market.tickSize,
                          false
                        );
                      }}
                    />
                    <ReportingDisputeProgress
                      key="scalar_input_progress"
                      {...selectedOutcome}
                      isSelected={s.scalarInputChoosen}
                      tentativeStake={stakeInfo.displayValue}
                    />
                  </li>
                  <li>
                    {s.validations.hasOwnProperty("err") && (
                      <span className={FormStyles.Form__error__space}>
                        {InputErrorIcon()}
                        {s.validations.err}
                      </span>
                    )}
                  </li>
                </ul>
              </li>
            )}
          </ul>
        </li>
        <li>
          <label>
            <span htmlFor="sr__input--stake">Deposit Stake</span>
          </label>
          <ul className={FormStyles["Form__radio-buttons--per-line-inline"]}>
            <li className={Styles.ReportingDisputeForm_Rep}>
              <Input
                id="sr__input--stake"
                type="number"
                className={classNames({
                  [`${FormStyles["Form__error--field"]}`]:
                    s.validations.hasOwnProperty("stake") &&
                    s.validations.selectedOutcome
                })}
                min="0"
                value={s.inputStake}
                placeholder="0.0000 REP"
                onChange={value => this.validateStake({ raw: value })}
                autoComplete="off"
                maxButton={Boolean(
                  s.selectedOutcomeName && s.selectedOutcomeName.length > 0
                )}
                onMaxButtonClick={() => this.setMAXStake()}
                darkMaxBtn
              />
              <RepBalance rep={formatRep(availableRep).formattedValue} />
            </li>
            <li>
              {s.validations.hasOwnProperty("stake") &&
                s.validations.stake.length && (
                  <span className={FormStyles["Form__error--even"]}>
                    {InputErrorIcon()}
                    {s.validations.stake}
                  </span>
                )}
            </li>
            {s.validations.hasOwnProperty("isDisputeActive") &&
              !s.validations.isDisputeActive && (
                <label>
                  <span className={Styles.ReportingDisputeForm__disputeEnded}>
                    {InputErrorIcon()}
                    {`Dispute round has ended, wait for next round to dispute`}
                  </span>
                </label>
              )}
          </ul>
        </li>
      </ul>
    );
  }
}
