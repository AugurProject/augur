/* eslint jsx-a11y/label-has-for: 0 */

import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { createBigNumber } from "utils/create-big-number";
import { constants } from "services/augurjs";

import {
  YES_NO,
  CATEGORICAL,
  SCALAR
} from "modules/markets/constants/market-types";

import FormStyles from "modules/common/less/form";
import Styles from "modules/reporting/components/reporting-report-form/reporting-report-form.styles";
import { ExclamationCircle as InputErrorIcon } from "modules/common/components/icons";

export default class ReportingReportForm extends Component {
  static propTypes = {
    market: PropTypes.object.isRequired,
    updateState: PropTypes.func.isRequired,
    validations: PropTypes.object.isRequired,
    selectedOutcome: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
      .isRequired,
    stake: PropTypes.string.isRequired,
    isOpenReporting: PropTypes.bool.isRequired,
    isDesignatedReporter: PropTypes.bool.isRequired,
    isMarketInValid: PropTypes.bool,
    insufficientRep: PropTypes.bool.isRequired
  };

  static defaultProps = {
    isMarketInValid: false
  };

  static BUTTONS = {
    MARKET_IS_INVALID: "MARKET_IS_INVALID",
    SCALAR_VALUE: "SCALAR_VALUE"
  };
  constructor(props) {
    super(props);

    this.state = {
      outcomes: [],
      inputSelectedOutcome:
        this.props.market.marketType === SCALAR && this.props.selectedOutcome
          ? this.props.selectedOutcome
          : "",
      activeButton: ""
    };

    if (this.props.market.marketType === SCALAR && this.props.selectedOutcome) {
      this.state.activeButton = this.props.isMarketInValid
        ? ReportingReportForm.BUTTONS.MARKET_IS_INVALID
        : ReportingReportForm.BUTTONS.SCALAR_VALUE;
    }

    this.state.outcomes = this.props.market
      ? this.props.market.outcomes.slice()
      : [];
    if (
      this.props.market &&
      this.props.market.marketType === YES_NO &&
      this.props.market.outcomes.length === 1
    ) {
      this.state.outcomes.push({ id: 0, name: "No" });
    }
    this.state.outcomes.sort((a, b) => a.name - b.name);

    this.focusTextInput = this.focusTextInput.bind(this);
  }

  componentWillReceiveProps(newProps) {
    const { reportingState, validations } = newProps.market;
    const updatedValidations = { ...validations };
    if (
      reportingState !== this.props.market.reportingState &&
      reportingState === constants.REPORTING_STATE.AWAITING_NEXT_WINDOW
    ) {
      updatedValidations.neverReported = false;
      this.props.updateState({
        validations: updatedValidations
      });
    }
  }

  setMarketInvalid(buttonName) {
    const { updateState, validations } = this.props;
    this.setState({ activeButton: buttonName });
    if (buttonName === ReportingReportForm.BUTTONS.MARKET_IS_INVALID) {
      const updatedValidations = { ...validations };
      delete updatedValidations.err;
      updatedValidations.selectedOutcome = true;
      this.setState({ inputSelectedOutcome: "" });
      updateState({
        isMarketInValid: true,
        validations: updatedValidations,
        selectedOutcome: ""
      });
    }
  }

  focusTextInput() {
    this.textInput.focus();
  }

  validateOutcome(
    validations,
    selectedOutcome,
    selectedOutcomeName,
    isMarketInValid
  ) {
    const { updateState } = this.props;
    const updatedValidations = { ...validations };
    updatedValidations.selectedOutcome = true;
    delete updatedValidations.err;

    this.setState({ inputSelectedOutcome: "" });
    updateState({
      validations: updatedValidations,
      selectedOutcome,
      selectedOutcomeName,
      isMarketInValid
    });
  }

  validateScalar(validations, value, humanName, min, max, tickSize, isInvalid) {
    const { updateState } = this.props;
    const updatedValidations = { ...validations };
    this.setState({ activeButton: ReportingReportForm.BUTTONS.SCALAR_VALUE });
    const minValue = parseFloat(min);
    const bnMinPrice = createBigNumber(min);
    const maxValue = parseFloat(max);
    const valueValue = parseFloat(value);
    const bnValue = createBigNumber(value || 0);
    const bnTickSize = createBigNumber(tickSize);

    if (value === "") {
      this.focusTextInput();
    }

    switch (true) {
      case value === "":
        updatedValidations.err = `The ${humanName} field is required.`;
        break;
      case isNaN(valueValue):
        updatedValidations.err = `The ${humanName} field is a number.`;
        break;
      case valueValue > maxValue || valueValue < minValue:
        updatedValidations.err = `Please enter a ${humanName} between ${min} and ${max}.`;
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

    this.setState({ inputSelectedOutcome: value });

    updateState({
      validations: updatedValidations,
      selectedOutcome: value,
      selectedOutcomeName: value ? value.toString() : "",
      isMarketInValid: isInvalid
    });
  }

  render() {
    const {
      isMarketInValid,
      isOpenReporting,
      market,
      selectedOutcome,
      stake,
      validations,
      insufficientRep,
      isDesignatedReporter
    } = this.props;

    const { reportingState } = market;
    const s = this.state;
    let errorMessage = null;
    if (
      !isDesignatedReporter &&
      !isOpenReporting &&
      reportingState !== constants.REPORTING_STATE.AWAITING_NEXT_WINDOW
    ) {
      errorMessage =
        "You are not the Designated Reporter for this market. Only the Designated Reporter may submit a report.";
    } else if (insufficientRep && !isOpenReporting) {
      errorMessage = "You have insufficient REP to create this report.";
    }
    return (
      <ul
        className={classNames(
          Styles.ReportingReportForm__fields,
          FormStyles.Form__fields
        )}
      >
        <li>
          <div className={Styles.ReportingReport__outcome_selection_msg}>
            Please choose an outcome below based on the resolution source when
            the market ends.
          </div>
          <div className={Styles.ReportingReport__outcome_selection_msg}>
            If a timezone isn&apos;t provided, use&nbsp;
            <a href="https://en.wikipedia.org/wiki/Coordinated_Universal_Time">
              UTC
            </a>
            &nbsp;time to determine the date/time.
          </div>
          <div className={Styles.ReportingReport__outcome_selection_msg}>
            The market should be considered INVALID if any of the following are
            true:
          </div>
          <ul className={Styles.ReportingReport__outcome_selection_msg}>
            <li>The question is subjective in nature.</li>
            <li>The outcome was not known at market end time.</li>
            <li>
              The title, details, end time, resolution source, and outcomes are
              in direct conflict with each other.
            </li>
            <li>
              There are strong arguments for the market resolving as multiple
              outcomes.
            </li>
            <li>
              The resolution source does not provide a readily available answer.
            </li>
            <li>
              The resolution source provides different answers to different
              viewers.
            </li>
          </ul>
        </li>
        <li>
          <label>
            <span>Outcome</span>
          </label>
          {(market.marketType === YES_NO ||
            market.marketType === CATEGORICAL) && (
            <ul className={FormStyles["Form__radio-buttons--per-line"]}>
              {s.outcomes.map(outcome => (
                <li key={outcome.id}>
                  <button
                    className={classNames({
                      [`${FormStyles.active}`]: selectedOutcome === outcome.id
                    })}
                    onClick={e => {
                      this.validateOutcome(
                        validations,
                        outcome.id,
                        outcome.name,
                        false
                      );
                    }}
                  >
                    {outcome.name}
                  </button>
                </li>
              ))}
              <li className={FormStyles["Form__radio-buttons--per-line"]}>
                <button
                  className={classNames({
                    [`${FormStyles.active}`]: isMarketInValid === true
                  })}
                  onClick={e => {
                    this.setMarketInvalid(
                      ReportingReportForm.BUTTONS.MARKET_IS_INVALID
                    );
                  }}
                >
                  Market is invalid
                </button>
              </li>
            </ul>
          )}
          {market.marketType === SCALAR && (
            <ul className={FormStyles["Form__radio-buttons--per-line"]}>
              <li className={FormStyles["Form__radio-buttons--per-line"]}>
                <button
                  className={classNames({
                    [`${FormStyles.active}`]:
                      s.activeButton ===
                      ReportingReportForm.BUTTONS.MARKET_IS_INVALID
                  })}
                  onClick={e => {
                    this.setMarketInvalid(
                      ReportingReportForm.BUTTONS.MARKET_IS_INVALID
                    );
                  }}
                >
                  Market is invalid
                </button>
              </li>
              <li className={FormStyles["field--short"]}>
                <button
                  className={classNames({
                    [`${FormStyles.active}`]:
                      s.activeButton ===
                      ReportingReportForm.BUTTONS.SCALAR_VALUE
                  })}
                  onClick={e => {
                    this.validateScalar(
                      validations,
                      "",
                      "selectedOutcome",
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
                      validations.hasOwnProperty("err") &&
                      validations.selectedOutcome
                  })}
                  onChange={e => {
                    this.validateScalar(
                      validations,
                      e.target.value,
                      "outcome",
                      market.minPrice,
                      market.maxPrice,
                      market.tickSize,
                      false
                    );
                  }}
                />
              </li>
              <li>
                {validations.hasOwnProperty("err") && (
                  <span className={FormStyles.Form__error}>
                    {InputErrorIcon}
                    {validations.err}
                  </span>
                )}
              </li>
            </ul>
          )}
        </li>
        {errorMessage && (
          <label>
            <span className={Styles["ReportingReport__insufficient-funds"]}>
              {InputErrorIcon}
              {errorMessage}
            </span>
          </label>
        )}
        {!isOpenReporting && (
          <li>
            <label htmlFor="sr__input--stake">
              <span>Required Stake</span>
            </label>
            <p>{stake} REP</p>
          </li>
        )}
        {validations.hasOwnProperty("neverReported") &&
          !validations.neverReported && (
            <label>
              <span className={Styles["ReportingReport__insufficient-funds"]}>
                {InputErrorIcon}
                {`Market has already been reported on`}
              </span>
            </label>
          )}
      </ul>
    );
  }
}
