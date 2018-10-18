/* eslint jsx-a11y/label-has-for: 0 */

import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { BigNumber, createBigNumber } from "utils/create-big-number";

import FormStyles from "modules/common/less/form";
import { SCALAR } from "modules/markets/constants/market-types";
import { ExclamationCircle as InputErrorIcon } from "modules/common/components/icons";
import Styles from "modules/forking/components/migrate-rep-form/migrate-rep-form.styles";
import FormattedMigrationTotals from "modules/forking/components/migrate-rep-form/formatted-migration-totals";

export default class MigrateRepForm extends Component {
  static propTypes = {
    market: PropTypes.object.isRequired,
    updateState: PropTypes.func.isRequired,
    getForkMigrationTotals: PropTypes.func.isRequired,
    validations: PropTypes.object.isRequired,
    selectedOutcome: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
      .isRequired,
    selectedOutcomeName: PropTypes.string.isRequired,
    accountREP: PropTypes.string.isRequired,
    currentBlockNumber: PropTypes.number.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      inputRepAmount: "",
      inputSelectedOutcome: ""
    };

    this.focusTextInput = this.focusTextInput.bind(this);
    this.validateOutcome = this.validateOutcome.bind(this);
  }

  componentDidUpdate(prevProps) {
    const { updateState, validations, accountREP } = this.props;

    if (prevProps.accountREP !== accountREP) {
      const updatedValidations = { ...validations };

      if (this.state.inputRepAmount > accountREP) {
        updatedValidations.repAmount = `Migrate REP amount is greater then your available amount`;
      } else {
        delete updatedValidations.repAmount;
      }
      updateState({
        validations: updatedValidations
      });
    }
  }

  checkRepAmount(repAmount, updatedValidations) {
    if (repAmount === "" || repAmount == null || repAmount <= 0) {
      updatedValidations.repAmount = "The REP amount field is required.";
    } else if (repAmount > this.props.accountREP) {
      updatedValidations.repAmount = `Migrate REP amount is greater then your available amount`;
    } else {
      delete updatedValidations.repAmount;
    }
    return updatedValidations;
  }

  validateRepAmount(rawRepAmount, isMax) {
    const { updateState, validations } = this.props;
    const updatedValidations = { ...validations };

    let repAmount = rawRepAmount;

    if (repAmount !== "" && !BigNumber.isBigNumber(repAmount) && !isMax) {
      repAmount = createBigNumber(rawRepAmount);
      repAmount = repAmount.toNumber();
    }

    this.checkRepAmount(repAmount, updatedValidations);

    this.setState({
      inputRepAmount: repAmount
    });

    updateState({
      validations: updatedValidations,
      repAmount: repAmount.toString()
    });
  }

  validateOutcome(selectedOutcome, selectedOutcomeName, isMarketInValid) {
    const { updateState, validations } = this.props;
    const updatedValidations = { ...validations };
    updatedValidations.selectedOutcome = true;
    delete updatedValidations.err;
    let isInvalid = isMarketInValid;

    // outcome with id of 0.5 means invalid
    if (selectedOutcome === "0.5") isInvalid = true;

    this.checkRepAmount(this.state.inputRepAmount, updatedValidations);

    this.setState({
      inputSelectedOutcome: ""
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
    const { updateState, validations } = this.props;
    const updatedValidations = { ...validations };
    const { inputRepAmount } = this.state;

    if (value === "") {
      this.focusTextInput();
    }
    if (isInvalid) {
      delete updatedValidations.err;
      updatedValidations.selectedOutcome = true;
    } else {
      const minValue = parseFloat(min);
      const maxValue = parseFloat(max);
      const valueValue = parseFloat(value);
      const bnValue = createBigNumber(valueValue || 0);
      const bnTickSize = createBigNumber(tickSize);

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
        case bnValue.mod(bnTickSize).gt("0"):
          updatedValidations.err = `The ${humanName} field must be a multiple of ${tickSize}.`;
          break;
        default:
          delete updatedValidations.err;
          updatedValidations.selectedOutcome = true;
          break;
      }
    }

    this.checkRepAmount(inputRepAmount, updatedValidations);

    this.setState({
      inputSelectedOutcome: value
    });

    updateState({
      validations: updatedValidations,
      selectedOutcome: value,
      selectedOutcomeName: value.toString(),
      isMarketInValid: isInvalid
    });
  }

  render() {
    const {
      accountREP,
      market,
      selectedOutcome,
      selectedOutcomeName,
      validations,
      getForkMigrationTotals,
      currentBlockNumber
    } = this.props;
    const {
      marketType,
      minPrice,
      maxPrice,
      tickSize,
      scalarDenomination
    } = market;
    const { inputSelectedOutcome, inputRepAmount } = this.state;

    return (
      <ul
        className={classNames(
          Styles.MigrateRepForm__fields,
          FormStyles.Form__fields
        )}
      >
        <li>
          <h3>
            Choose carefully. Migrating REP is an irreversible, one-way
            operation.
          </h3>
        </li>
        <li>
          <ul className={FormStyles["Form__radio-buttons--per-line"]}>
            <li>
              <label style={{ marginBottom: "1.5rem" }}>
                <span>Outcome</span>
              </label>
            </li>
            <FormattedMigrationTotals
              validateOutcome={this.validateOutcome}
              market={market}
              getForkMigrationTotals={getForkMigrationTotals}
              currentBlockNumber={currentBlockNumber}
              selectedOutcome={selectedOutcome}
            />
            {marketType === SCALAR && (
              <ul className={FormStyles["Form__radio-buttons--per-line-long"]}>
                <li>
                  <button
                    className={classNames({
                      [`${FormStyles.active}`]: inputSelectedOutcome !== ""
                    })}
                    onClick={e => {
                      this.validateScalar(
                        "",
                        "selected outcome",
                        minPrice,
                        maxPrice,
                        tickSize,
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
                    min={minPrice}
                    max={maxPrice}
                    step={tickSize}
                    placeholder={scalarDenomination}
                    value={inputSelectedOutcome}
                    className={classNames(FormStyles.Form__input, {
                      [`${FormStyles["Form__error--field"]}`]:
                        validations.hasOwnProperty("err") &&
                        validations.selectedOutcome
                    })}
                    onChange={e => {
                      this.validateScalar(
                        e.target.value,
                        "outcome",
                        minPrice,
                        maxPrice,
                        tickSize,
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
          </ul>
        </li>
        <li className={FormStyles["field--short"]}>
          <label>
            <span htmlFor="sr__input--repAmount">Migrate REP</span>
          </label>
          <ul className={FormStyles["Form__radio-buttons--per-line-inline"]}>
            <li>
              <input
                id="sr__input--repAmount"
                type="number"
                min="0"
                placeholder="0.0000 REP"
                value={inputRepAmount}
                className={classNames(FormStyles.Form__input, {
                  [`${FormStyles["Form__error--field"]}`]:
                    validations.hasOwnProperty("repAmount") &&
                    validations.selectedOutcome
                })}
                onChange={e => {
                  this.validateRepAmount(e.target.value);
                }}
              />
              {selectedOutcomeName &&
                selectedOutcomeName.length > 0 && (
                  <div className={Styles.MigrateRepForm__container}>
                    <button
                      className={classNames(
                        FormStyles["button--inline"],
                        Styles.MigrateRepForm__button
                      )}
                      onClick={() => {
                        this.validateRepAmount(accountREP, true);
                      }}
                    >
                      MAX
                    </button>
                  </div>
                )}
            </li>
            <li>
              {validations.hasOwnProperty("repAmount") &&
                validations.repAmount.length && (
                  <span className={FormStyles["Form__error--even"]}>
                    {InputErrorIcon}
                    {validations.repAmount}
                  </span>
                )}
            </li>
          </ul>
        </li>
      </ul>
    );
  }
}
