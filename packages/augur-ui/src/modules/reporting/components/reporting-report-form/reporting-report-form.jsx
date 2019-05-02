/* eslint jsx-a11y/label-has-for: 0 */

import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { createBigNumber } from "utils/create-big-number";
import { constants } from "services/augurjs";

import { YES_NO, CATEGORICAL, SCALAR } from "modules/common-elements/constants";
import FormStyles from "modules/common/less/form";
import Styles from "modules/reporting/components/reporting-report-form/reporting-report-form.styles";
import { ExclamationCircle as InputErrorIcon } from "modules/common/components/icons";
import { formatRep } from "utils/format-number";
import { RepBalance } from "modules/common-elements/labels";

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
    insufficientRep: PropTypes.bool.isRequired,
    availableRep: PropTypes.string,
    stakeLabel: PropTypes.string.isRequired
  };

  static defaultProps = {
    isMarketInValid: false,
    availableRep: "0"
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
      availableRep,
      validations,
      insufficientRep,
      isDesignatedReporter,
      stakeLabel
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
            Choose an outcome based on the resolution source when the event
            ended.
          </div>
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
                    {InputErrorIcon()}
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
              {InputErrorIcon()}
              {errorMessage}
            </span>
          </label>
        )}
        {(!isOpenReporting || isDesignatedReporter) && (
          <li className={Styles.ReportingReportREP}>
            <div>
              <label htmlFor="sr__input--stake">
                <span>{stakeLabel}</span>
              </label>
              <p>{stake} REP</p>
            </div>
            <RepBalance rep={formatRep(availableRep).formattedValue} />
          </li>
        )}
        {validations.hasOwnProperty("neverReported") &&
          !validations.neverReported && (
            <label>
              <span className={Styles["ReportingReport__insufficient-funds"]}>
                {InputErrorIcon()}
                {`Market has already been reported on`}
              </span>
            </label>
          )}
      </ul>
    );
  }
}
