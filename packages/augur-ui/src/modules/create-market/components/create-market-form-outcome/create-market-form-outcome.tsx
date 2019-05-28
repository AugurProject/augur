/* eslint jsx-a11y/label-has-for: 0 */
/* eslint react/no-array-index-key: 0 */

import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { BigNumber, createBigNumber } from "utils/create-big-number";
import * as speedomatic from "speedomatic";
import { uniq, isEmpty } from "lodash";
import { formatNumber, cutOffDecimal } from "utils/format-number";
import {
  YES_NO,
  CATEGORICAL,
  SCALAR,
  CATEGORICAL_OUTCOMES_MIN_NUM,
  CATEGORICAL_OUTCOMES_MAX_NUM,
  CATEGORICAL_OUTCOME_MAX_LENGTH,
  ZERO
} from "modules/common-elements/constants";

import {
  ExclamationCircle as InputErrorIcon,
  Hint
} from "modules/common/components/icons";
import Styles from "modules/create-market/components/create-market-form-outcome/create-market-form-outcome.styles";
import StylesForm from "modules/create-market/components/create-market-form/create-market-form.styles";
import ReactTooltip from "react-tooltip";
import TooltipStyles from "modules/common/less/tooltip.styles";

const NUM_DIGITS_LIMIT = 4;

export default class CreateMarketOutcome extends Component {
  static propTypes = {
    isMobileSmall: PropTypes.bool.isRequired,
    newMarket: PropTypes.object.isRequired,
    isValid: PropTypes.func.isRequired,
    keyPressed: PropTypes.func.isRequired,
    updateNewMarket: PropTypes.func.isRequired
  };

  static calculateOutcomeFieldCount(p) {
    const numCleanedOutcomes = p.newMarket.outcomes.filter(
      outcome => outcome !== ""
    ).length;
    const totalOutcomes = p.newMarket.outcomes.length;
    return !p.isMobileSmall
      ? totalOutcomes
      : Math.min(Math.max(3, numCleanedOutcomes + 1), totalOutcomes);
  }

  constructor(props) {
    super(props);
    this.state = {
      // marketType: false,
      outcomeFieldCount: CreateMarketOutcome.calculateOutcomeFieldCount(
        this.props
      ),
      showAddOutcome:
        CreateMarketOutcome.calculateOutcomeFieldCount(this.props) < 8,
      scalarMin: createBigNumber(
        speedomatic.INT256_MIN_VALUE
      ).decimalPlaces(18, BigNumber.ROUND_DOWN),
      scalarMinFormatted: formatNumber(speedomatic.INT256_MIN_VALUE),
      scalarMax: createBigNumber(
        speedomatic.INT256_MAX_VALUE
      ).decimalPlaces(18, BigNumber.ROUND_DOWN),
      scalarMaxFormatted: formatNumber(speedomatic.INT256_MAX_VALUE),
      scalarType: {
        MIN_PRICE: "MIN_PRICE",
        MAX_PRICE: "MAX_PRICE",
        TICK_SIZE: "TICK_SIZE",
        DENOMINATION: "DENOMINATION"
      }
    };

    this.handleAddOutcomeClick = this.handleAddOutcomeClick.bind(this);
    this.validateType = this.validateType.bind(this);
    this.validateScalarNum = this.validateScalarNum.bind(this);
    this.validateOutcomes = this.validateOutcomes.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const { isMobileSmall } = this.props;
    if (isMobileSmall !== nextProps.isMobileSmall) {
      const outcomeFieldCount = CreateMarketOutcome.calculateOutcomeFieldCount(
        nextProps
      );
      const showAddOutcome = nextProps.isMobileSmall
        ? !(outcomeFieldCount >= nextProps.newMarket.outcomes.length)
        : false;
      this.setState({
        outcomeFieldCount,
        showAddOutcome
      });
    }
  }

  handleAddOutcomeClick() {
    const { newMarket } = this.props;
    const totalOutcomes = newMarket.outcomes.length;
    const outcomeFieldCount = Math.min(
      this.state.outcomeFieldCount + 1,
      totalOutcomes
    );
    const showAddOutcome = !(outcomeFieldCount >= totalOutcomes);
    this.setState({
      outcomeFieldCount,
      showAddOutcome
    });
  }

  validateType(value) {
    const { isValid, newMarket, updateNewMarket } = this.props;
    const updatedMarket = { ...newMarket };
    const validations = updatedMarket.validations[newMarket.currentStep];

    const updatedValidations = Object.keys(validations).reduce(
      (p, key) =>
        validations[key] === ""
          ? { ...p, [key]: "" }
          : { ...p, [key]: validations[key] || null },
      {}
    );

    // Reset tickSize and scalarDenomination as it only applies to 'scalar' markets and we are 'defaulting' the value in the componenet.
    delete updatedMarket.scalarDenomination;
    delete updatedMarket.tickSize;
    delete updatedValidations.scalarDenomination;
    delete updatedValidations.outcomes;
    delete updatedValidations.scalarSmallNum;
    delete updatedValidations.scalarBigNum;
    delete updatedValidations.tickSize;

    switch (value) {
      case CATEGORICAL:
        updatedValidations.outcomes = updatedValidations.outcomes
          ? updatedValidations.outcomes
          : null;
        break;
      case SCALAR:
        updatedValidations.scalarSmallNum = updatedValidations.scalarSmallNum
          ? updatedValidations.scalarSmallNum
          : null;
        updatedValidations.scalarBigNum = updatedValidations.scalarBigNum
          ? updatedValidations.scalarBigNum
          : null;
        updatedValidations.tickSize = updatedValidations.tickSize
          ? updatedValidations.tickSize
          : null;
        break;
      default:
        break;
    }

    updatedValidations.type = "";

    updatedMarket.validations[newMarket.currentStep] = updatedValidations;
    updatedMarket.type = value;
    updatedMarket.isValid = isValid(newMarket.currentStep);
    updatedMarket.orderBook = {};

    updateNewMarket(updatedMarket);
  }

  validateScalarNum(rawValue, type, limitDigits) {
    const { isValid, newMarket, updateNewMarket } = this.props;
    const { currentStep } = newMarket;
    const { scalarType } = this.state;

    let value = rawValue;

    if (limitDigits) {
      value = cutOffDecimal(value, NUM_DIGITS_LIMIT);
    }

    const updatedMarket = { ...newMarket };
    let scalarSmallNum =
      type === scalarType.MIN_PRICE ? value : updatedMarket.scalarSmallNum;
    let scalarBigNum =
      type === scalarType.MAX_PRICE ? value : updatedMarket.scalarBigNum;
    let numTicksBigNum =
      type === scalarType.TICK_SIZE ? value : updatedMarket.tickSize;
    const denomination =
      type === scalarType.DENOMINATION
        ? value
        : updatedMarket.scalarDenomination;

    if (!BigNumber.isBigNumber(scalarSmallNum) && scalarSmallNum !== "") {
      scalarSmallNum = createBigNumber(scalarSmallNum);
    }

    if (!BigNumber.isBigNumber(scalarBigNum) && scalarBigNum !== "") {
      scalarBigNum = createBigNumber(scalarBigNum);
    }

    if (!BigNumber.isBigNumber(numTicksBigNum) && numTicksBigNum !== "") {
      numTicksBigNum = createBigNumber(numTicksBigNum);
    }

    // reset errors
    updatedMarket.validations[currentStep].scalarBigNum = "";
    updatedMarket.validations[currentStep].scalarSmallNum = "";
    updatedMarket.validations[currentStep].tickSize = "";

    switch (true) {
      case scalarSmallNum === "":
        updatedMarket.validations[currentStep].scalarSmallNum =
          "This field is required.";
        break;
      case scalarSmallNum.lt(this.state.scalarMin):
        updatedMarket.validations[
          currentStep
        ].scalarSmallNum = `Must be greater than: ${
          this.state.scalarMinFormatted.roundedValue
        }`;
        break;
      case scalarSmallNum.gt(this.state.scalarMax):
        updatedMarket.validations[
          currentStep
        ].scalarSmallNum = `Must be less than: ${
          this.state.scalarMaxFormatted.roundedValue
        }`;
        break;
      case scalarBigNum !== "" && scalarSmallNum.gte(scalarBigNum):
        updatedMarket.validations[currentStep].scalarSmallNum =
          "Min must be less than max.";
        break;
      default:
        updatedMarket.validations[currentStep].scalarSmallNum = "";
    }
    updatedMarket.scalarSmallNum = scalarSmallNum;

    if (updatedMarket.validations[currentStep].scalarSmallNum === "") {
      switch (true) {
        case scalarBigNum === "":
          updatedMarket.validations[currentStep].scalarBigNum =
            "This field is required.";
          break;
        case scalarBigNum.lt(this.state.scalarMin):
          updatedMarket.validations[
            currentStep
          ].scalarBigNum = `Must be greater than: ${
            this.state.scalarMinFormatted.roundedValue
          }`;
          break;
        case scalarBigNum.gt(this.state.scalarMax):
          updatedMarket.validations[
            currentStep
          ].scalarBigNum = `Must be less than: ${
            this.state.scalarMaxFormatted.roundedValue
          }`;
          break;
        case scalarSmallNum !== "" && scalarBigNum.lte(scalarSmallNum):
          updatedMarket.validations[currentStep].scalarBigNum =
            "Max must be more than min.";
          break;
        default:
          updatedMarket.validations[currentStep].scalarBigNum = "";
      }
    }
    updatedMarket.scalarBigNum = scalarBigNum;

    switch (true) {
      case numTicksBigNum === "" || numTicksBigNum.eq(ZERO):
        updatedMarket.validations[currentStep].tickSize =
          "Tick size is required.";
        break;
      case numTicksBigNum.lt(ZERO):
        updatedMarket.validations[currentStep].tickSize =
          "Tick size cannot be negative.";
        break;
      case numTicksBigNum.gt(this.state.scalarMax):
        updatedMarket.validations[currentStep].tickSize = `Must be less than: ${
          this.state.scalarMaxFormatted.roundedValue
        }`;
        break;
      default:
        updatedMarket.validations[currentStep].tickSize = "";
    }

    if (type === scalarType.TICK_SIZE) {
      updatedMarket.tickSize = value;
    }

    switch (true) {
      case denomination.trim() === "":
        updatedMarket.validations[currentStep].scalarDenomination =
          "Denomination is required.";
        break;
      default:
        updatedMarket.validations[currentStep].scalarDenomination = "";
    }

    if (type === scalarType.DENOMINATION) {
      updatedMarket.scalarDenomination = value;
    }

    // Make sure scalarBigNum, scalarSmallNum, & numTicksBigNum are all BigNumbers
    if (
      BigNumber.isBigNumber(scalarBigNum) &&
      BigNumber.isBigNumber(scalarSmallNum) &&
      BigNumber.isBigNumber(numTicksBigNum) &&
      !numTicksBigNum.eq(ZERO)
    ) {
      // Always check if (maxPrice - minPrice) / precision is an even number
      if (
        scalarBigNum
          .minus(scalarSmallNum)
          .div(numTicksBigNum)
          .mod(2)
          .toString() !== "0"
      ) {
        updatedMarket.validations[
          currentStep
        ].tickSize = `Range must be evenly divisible by the precision.`;
      }
    }

    updatedMarket.isValid = isValid(currentStep);

    updateNewMarket(updatedMarket);
  }

  validateOutcomes(value, index) {
    const { isValid, newMarket, updateNewMarket } = this.props;
    const { currentStep } = newMarket;

    const updatedMarket = { ...newMarket };
    const { outcomes } = updatedMarket;
    outcomes[index] = value;
    const cleanedOutcomes = outcomes.filter(outcome => outcome !== "");
    const cleanedOutcomesLen = Object.values(cleanedOutcomes).filter(
      x => !isEmpty(x)
    ).length;
    const isUnique =
      uniq(Object.values(cleanedOutcomes).filter(x => !isEmpty(x))).length ===
      cleanedOutcomesLen;

    switch (true) {
      case cleanedOutcomes.length < CATEGORICAL_OUTCOMES_MIN_NUM:
        updatedMarket.validations[currentStep].outcomes =
          "At least two outcomes are required.";
        break;
      case cleanedOutcomes.length > CATEGORICAL_OUTCOMES_MAX_NUM:
        updatedMarket.validations[currentStep].outcomes =
          "Please enter a max of 8 outcomes.";
        break;
      case !isUnique:
        updatedMarket.validations[currentStep].outcomes =
          "Outcome names must be unique.";
        break;
      default:
        updatedMarket.validations[currentStep].outcomes = "";
    }

    if (updatedMarket.validations[currentStep].outcomes === "") {
      updatedMarket.outcomes = outcomes;
    }
    updatedMarket.isValid = isValid(currentStep);

    updateNewMarket(updatedMarket);
  }

  render() {
    const { newMarket, keyPressed } = this.props;
    const s = this.state;
    const cleanedOutcomes = newMarket.outcomes.filter(
      outcome => outcome !== ""
    );

    const validation = newMarket.validations[newMarket.currentStep];

    return (
      <ul className={StylesForm.CreateMarketForm__fields}>
        <li>
          <label>
            <span>Market Type</span>
          </label>
          <ul className={StylesForm["CreateMarketForm__radio-buttons"]}>
            <li>
              <button
                className={classNames({
                  [`${StylesForm.active}`]: newMarket.type === YES_NO
                })}
                onClick={() => this.validateType(YES_NO)}
                onKeyPress={e => keyPressed(e)}
              >
                Yes/No
              </button>
            </li>
            <li>
              <button
                className={classNames({
                  [`${StylesForm.active}`]: newMarket.type === CATEGORICAL
                })}
                onClick={() => this.validateType(CATEGORICAL)}
                onKeyPress={e => keyPressed(e)}
              >
                Multiple Choice
              </button>
            </li>
            <li>
              <button
                className={classNames({
                  [`${StylesForm.active}`]: newMarket.type === SCALAR
                })}
                onClick={() => this.validateType(SCALAR)}
                onKeyPress={e => keyPressed(e)}
              >
                Numerical Range
              </button>
            </li>
          </ul>
        </li>
        {newMarket.type === CATEGORICAL && (
          <li
            className={classNames(
              StylesForm.Categorical,
              StylesForm.CreateMarketForm_block
            )}
          >
            <label htmlFor="cm__input--outcome1">
              <span>Potential Outcomes</span>
              {validation.outcomes && (
                <span>
                  {InputErrorIcon()} {validation.outcomes}
                </span>
              )}
            </label>
            <p className={StylesForm.Message}>
              To reduce ambiguity, categorical markets should cover all possible
              outcomes. This can be done by including an outcome such as
              &quot;Other&quot;
            </p>
            <div className={Styles.CreateMarketOutcome__categorical}>
              {[...Array(s.outcomeFieldCount).keys()].map(i => {
                const placeholderText = i < 2 ? "Outcome" : "Optional Outcome";
                const isError =
                  newMarket.validations[1].outcomes &&
                  newMarket.validations[1].outcomes.length > 0;
                const isDuplicate =
                  cleanedOutcomes.filter(
                    outcome => outcome === newMarket.outcomes[i]
                  ).length >= 2;
                const needMinimum =
                  isError &&
                  i < 2 &&
                  (newMarket.outcomes[0] === "" ||
                    newMarket.outcomes[1] === "");
                const tooMany =
                  cleanedOutcomes.length > CATEGORICAL_OUTCOMES_MAX_NUM;
                const highlightInput = isDuplicate || needMinimum || tooMany;
                return (
                  <div key={i}>
                    <input
                      type="text"
                      className={classNames({
                        [`${
                          StylesForm["CreateMarketForm__error--field"]
                        }`]: highlightInput
                      })}
                      data-testid={"categoricalOutcome-" + i}
                      value={newMarket.outcomes[i]}
                      placeholder={placeholderText}
                      maxLength={CATEGORICAL_OUTCOME_MAX_LENGTH}
                      onChange={e => this.validateOutcomes(e.target.value, i)}
                      onKeyPress={e => keyPressed(e)}
                    />
                  </div>
                );
              })}
              {s.showAddOutcome && (
                <button
                  className={Styles["CreateMarketOutcome__show-more"]}
                  onClick={this.handleAddOutcomeClick}
                >
                  + Add Outcome
                </button>
              )}
            </div>
          </li>
        )}
        {newMarket.type === SCALAR && (
          <li>
            <div className={Styles.CreateMarketOutcome__scalar}>
              <div>
                <label htmlFor="cm__input--min">
                  <span>Range Values</span>
                </label>
                <input
                  id="cm__input--min"
                  type="number"
                  min={s.scalarMin}
                  max={s.scalarMax}
                  value={
                    BigNumber.isBigNumber(newMarket.scalarSmallNum)
                      ? newMarket.scalarSmallNum.toNumber()
                      : newMarket.scalarSmallNum
                  }
                  placeholder="Min Value"
                  onChange={e => {
                    this.validateScalarNum(
                      e.target.value,
                      s.scalarType.MIN_PRICE,
                      true
                    );
                  }}
                  onKeyPress={e => keyPressed(e)}
                />
                {validation.scalarSmallNum && (
                  <span
                    className={StylesForm["CreateMarketForm__error--bottom"]}
                  >
                    {InputErrorIcon()}
                    {validation.scalarSmallNum}
                  </span>
                )}
              </div>
              <div>
                <label htmlFor="cm__input--max">
                  <span>&nbsp;</span>
                </label>
                <input
                  id="cm__input--max"
                  type="number"
                  min={s.scalarMin}
                  max={s.scalarMax}
                  value={
                    BigNumber.isBigNumber(newMarket.scalarBigNum)
                      ? newMarket.scalarBigNum.toNumber()
                      : newMarket.scalarBigNum
                  }
                  placeholder="Max Value"
                  onChange={e => {
                    this.validateScalarNum(
                      e.target.value,
                      s.scalarType.MAX_PRICE,
                      true
                    );
                  }}
                  onKeyPress={e => keyPressed(e)}
                />
                {validation.scalarBigNum && (
                  <span
                    className={StylesForm["CreateMarketForm__error--bottom"]}
                  >
                    {InputErrorIcon()}
                    {validation.scalarBigNum}
                  </span>
                )}
              </div>
              <div>
                <label htmlFor="cm__input--denomination">
                  <span>Denomination</span>
                  <div style={{ display: "inline-block" }}>
                    <label
                      className={classNames(
                        TooltipStyles.TooltipHint,
                        Styles.CreateMarketOutcome__tooltip
                      )}
                      data-tip
                      data-for="tooltip--market-fees"
                    >
                      {Hint}
                    </label>
                    <ReactTooltip
                      id="tooltip--market-fees"
                      className={TooltipStyles.Tooltip}
                      effect="solid"
                      place="top"
                      type="light"
                    >
                      <h4>Enter a denomination for your scalar market</h4>
                      <p>
                        {
                          'The denomination specifies what units your market is measured in. For example, a market predicting the temperature on a certain day might be denominated in "Degrees Fahrenheit".'
                        }
                      </p>
                    </ReactTooltip>
                  </div>
                </label>
                <input
                  id="cm__input--denomination"
                  type="text"
                  value={newMarket.scalarDenomination}
                  maxLength={CATEGORICAL_OUTCOME_MAX_LENGTH}
                  placeholder="Denomination"
                  onChange={e =>
                    this.validateScalarNum(
                      e.target.value,
                      s.scalarType.DENOMINATION,
                      false
                    )
                  }
                  onKeyPress={e => keyPressed(e)}
                />
                {validation.scalarDenomination && (
                  <span className={StylesForm.CreateMarketForm__error_tick}>
                    {InputErrorIcon()}
                    {validation.scalarDenomination}
                  </span>
                )}
              </div>
              <div>
                <label htmlFor="cm__input--ticksize">
                  <span>Precision</span>
                </label>
                <input
                  id="cm__input--ticksize"
                  type="number"
                  step="0.000001"
                  value={newMarket.tickSize}
                  placeholder="Tick Size"
                  onChange={e =>
                    this.validateScalarNum(
                      e.target.value,
                      s.scalarType.TICK_SIZE
                    )
                  }
                  onKeyPress={e => keyPressed(e)}
                />
                {validation.tickSize && (
                  <span className={StylesForm.CreateMarketForm__error_tick}>
                    {InputErrorIcon()}
                    {validation.tickSize}
                  </span>
                )}
              </div>
            </div>
          </li>
        )}
      </ul>
    );
  }
}
