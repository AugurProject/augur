/* eslint jsx-a11y/label-has-for: 0 */
/* eslint react/no-array-index-key: 0 */

import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { uniqBy, isEmpty } from "lodash";
import {
  DESCRIPTION_MAX_LENGTH,
  TAGS_MAX_LENGTH
} from "modules/markets/constants/new-market-constraints";
import moment from "moment";

import { ExclamationCircle as InputErrorIcon } from "modules/common/components/icons";
import { MarketCreateFormTime } from "modules/create-market/components/create-market-form-time/create-market-form-time";
import { MarketCreationTimeDisplay } from "modules/create-market/components/create-market-form-time/market-create-time-display";
import Styles from "modules/create-market/components/create-market-form-define/create-market-form-define.styles";
import StylesForm from "modules/create-market/components/create-market-form/create-market-form.styles";

export default class CreateMarketDefine extends Component {
  static propTypes = {
    categories: PropTypes.array.isRequired,
    newMarket: PropTypes.object.isRequired,
    isValid: PropTypes.func.isRequired,
    keyPressed: PropTypes.func.isRequired,
    updateNewMarket: PropTypes.func.isRequired,
    validateField: PropTypes.func.isRequired,
    validateNumber: PropTypes.func.isRequired,
    isMobileSmall: PropTypes.bool.isRequired,
    currentTimestamp: PropTypes.number.isRequired
  };

  constructor(props) {
    super(props);

    const localValues = {};
    localValues.tag1 = props.newMarket.tag1;
    localValues.tag2 = props.newMarket.tag2;
    localValues.category = props.newMarket.category;
    this.state = {
      suggestedCategories: this.filterCategories(this.props.newMarket.category),
      shownSuggestions: 2,
      localValues,
      date: Object.keys(this.props.newMarket.endTime).length
        ? moment(this.props.newMarket.endTime.timestamp * 1000)
        : null,
      focused: false,
      hours: Array.from(new Array(12), (val, index) => index + 1),
      minutes: [
        ...Array.from(Array(10).keys(), (val, index) => "0" + index),
        ...Array.from(Array(50).keys(), (val, index) => index + 10)
      ],
      ampm: ["AM", "PM"]
    };
    this.filterCategories = this.filterCategories.bind(this);
    this.updateFilteredCategories = this.updateFilteredCategories.bind(this);
    this.validateTag = this.validateTag.bind(this);
    this.updateState = this.updateState.bind(this);
  }

  filterCategories(category) {
    const { categories } = this.props;
    const userString = category.toLowerCase();
    return categories.filter(
      cat => cat.categoryName.toLowerCase().indexOf(userString) === 0
    );
  }

  updateFilteredCategories(userString, clearSuggestions = false) {
    let filteredCategories = this.filterCategories(userString);

    if (userString === "" || clearSuggestions) {
      filteredCategories = [];
    }

    this.setState({
      suggestedCategories: filteredCategories,
      shownSuggestions: 2
    });
  }

  validateTag(fieldName, value, maxLength, isRequired = true) {
    const { isValid, newMarket, updateNewMarket } = this.props;
    const { currentStep } = newMarket;
    const { localValues } = this.state;
    const updatedMarket = { ...newMarket };

    localValues[fieldName] = value;
    this.setState({
      localValues
    });

    // compare unquiness remove empty values
    const localValuesLen = Object.values(localValues).filter(x => !isEmpty(x))
      .length;
    const isUnique =
      uniqBy(Object.values(localValues).filter(x => !isEmpty(x)), value =>
        value.toUpperCase()
      ).length === localValuesLen;

    switch (true) {
      case typeof value === "string" && !value.trim().length && isRequired:
        updatedMarket.validations[currentStep][fieldName] =
          "This field is required.";
        break;
      case maxLength && value.length > maxLength:
        updatedMarket.validations[currentStep][
          fieldName
        ] = `Maximum length is ${maxLength}.`;
        break;
      case !isUnique:
        updatedMarket.validations[currentStep][fieldName] =
          "Tag and category names must be unique.";
        break;
      default:
        Object.keys(localValues).forEach(fieldName => {
          updatedMarket.validations[currentStep][fieldName] = "";
        });
    }

    if (updatedMarket.validations[currentStep][fieldName] === "") {
      Object.keys(localValues).forEach(fieldName => {
        updatedMarket[fieldName] = localValues[fieldName];
      });
    }

    if (fieldName !== "category") {
      // category is a required field, verify
      this.validateTag("category", updatedMarket.category, TAGS_MAX_LENGTH);
    }
    updatedMarket.isValid = isValid(currentStep);

    updateNewMarket(updatedMarket);
  }

  updateState(state) {
    this.setState(state);
  }

  render() {
    const {
      newMarket,
      validateField,
      keyPressed,
      currentTimestamp,
      isMobileSmall,
      validateNumber
    } = this.props;
    const s = this.state;

    let tagMessage = null;
    if (newMarket.validations[newMarket.currentStep].tag1) {
      tagMessage = newMarket.validations[newMarket.currentStep].tag1;
    } else if (newMarket.validations[newMarket.currentStep].tag2) {
      tagMessage = newMarket.validations[newMarket.currentStep].tag2;
    }

    return (
      <ul className={StylesForm.CreateMarketForm__fields}>
        <li className={Styles.CreateMarketDefine_datepicker}>
          <MarketCreateFormTime
            date={s.date}
            hours={s.hours}
            minutes={s.minutes}
            ampm={s.ampm}
            isMobileSmall={isMobileSmall}
            validateNumber={validateNumber}
            currentTimestamp={currentTimestamp}
            newMarket={newMarket}
            keyPressed={keyPressed}
            validateField={validateField}
            updateState={this.updateState}
            focused={s.focused}
          />
          <div className={Styles.CreateMarketDefine_datepicker_message}>
            <div>
              Make sure to factor in potential delays that can impact the event
              end time when entering the{" "}
              <span className={Styles.CreateMarketDefine_bolden}>
                Event End Date and Time.
              </span>{" "}
            </div>
            <div>
              <span className={Styles.CreateMarketDefine_bolden}>
                Delay Reporting
              </span>{" "}
              add additional time before reporting begins to avoid any unforseen
              issues that may result. Reporting starting before event end time
              may result in the market being reported as invalid.
            </div>
            {newMarket.endTime &&
              newMarket.endTime.formattedUtc && (
                <MarketCreationTimeDisplay endTime={newMarket.endTime} />
              )}
          </div>
        </li>
        <li className={Styles.CreateMarketDefine__question}>
          <label htmlFor="cm__input--desc">
            <span>Market Question</span>
            {newMarket.validations[newMarket.currentStep].description && (
              <span className={StylesForm.CreateMarketForm__error}>
                {InputErrorIcon}
                {newMarket.validations[newMarket.currentStep].description}
              </span>
            )}
          </label>
          <input
            id="cm__input--desc"
            type="text"
            className={classNames({
              [`${StylesForm["CreateMarketForm__error--field"]}`]: newMarket
                .validations[newMarket.currentStep].description
            })}
            value={newMarket.description}
            maxLength={DESCRIPTION_MAX_LENGTH}
            placeholder="What question do you want the world to predict?"
            onChange={e =>
              validateField(
                "description",
                e.target.value,
                DESCRIPTION_MAX_LENGTH
              )
            }
            onKeyPress={e => keyPressed(e)}
          />
          <div className={Styles["CreateMarketDefine__question-disclaimer"]}>
            The Augur platform does not work well for markets that are
            subjective or ambiguous. If you&#39;re not sure that the
            market&#39;s outcome will be known beyond a reasonable doubt by the
            expiration date, you should not create this market.
          </div>
        </li>
        <li className={StylesForm["field--50"]}>
          <label htmlFor="cm__input--cat">
            <span>Category</span>
          </label>
          <input
            ref={catInput => {
              this.catInput = catInput;
            }}
            id="cm__input--cat"
            className={classNames({
              [`${StylesForm["CreateMarketForm__error--field"]}`]: newMarket
                .validations[newMarket.currentStep].category
            })}
            type="text"
            value={s.localValues.category}
            maxLength={TAGS_MAX_LENGTH}
            placeholder="Help users find your market by defining its category"
            onChange={e => {
              this.updateFilteredCategories(e.target.value);
              this.validateTag("category", e.target.value, TAGS_MAX_LENGTH);
            }}
            onKeyPress={e => keyPressed(e)}
          />
          {newMarket.validations[newMarket.currentStep].category && (
            <span
              className={[`${StylesForm["CreateMarketForm__error--bottom"]}`]}
            >
              {InputErrorIcon}
              {newMarket.validations[newMarket.currentStep].category}
            </span>
          )}
        </li>
        <li className={StylesForm["field--50"]}>
          <label>
            <span>Suggested Categories</span>
          </label>
          <ul className={Styles["CreateMarketDefine__suggested-categories"]}>
            {newMarket.category &&
              s.suggestedCategories
                .slice(0, s.shownSuggestions)
                .map((cat, i) => (
                  <li key={i}>
                    <button
                      onClick={() => {
                        this.updateFilteredCategories(cat.categoryName, true);
                        this.catInput.value = cat.categoryName;
                        this.validateTag(
                          "category",
                          cat.categoryName,
                          TAGS_MAX_LENGTH
                        );
                      }}
                    >
                      {cat.categoryName}
                    </button>
                  </li>
                ))}
            {newMarket.category &&
              s.suggestedCategories.length > s.shownSuggestions && (
                <li>
                  <button
                    onClick={() =>
                      this.setState({
                        shownSuggestions: s.suggestedCategories.length
                      })
                    }
                  >
                    + {s.suggestedCategories.length - 2} more
                  </button>
                </li>
              )}
          </ul>
        </li>
        <li className={Styles.CreateMarketDefine__tags}>
          <div>
            <label
              className={classNames({
                [StylesForm["CreateMarketForm__error--label"]]: tagMessage
              })}
              htmlFor="cm__input--tag1"
            >
              <span>Tags</span>
              {tagMessage && (
                <span
                  className={classNames(
                    StylesForm["CreateMarketForm__error--abs"],
                    StylesForm["CreateMarketForm__error--lessSpace"]
                  )}
                >
                  {InputErrorIcon}
                  {tagMessage}
                </span>
              )}
            </label>
            <input
              id="cm__input--tag1"
              type="text"
              className={classNames({
                [`${StylesForm["CreateMarketForm__error--field"]}`]: newMarket
                  .validations[newMarket.currentStep].tag1
              })}
              value={s.localValues.tag1}
              maxLength={TAGS_MAX_LENGTH}
              placeholder="Tag 1"
              onChange={e =>
                this.validateTag("tag1", e.target.value, TAGS_MAX_LENGTH, false)
              }
              onKeyPress={e => keyPressed(e)}
            />
            <input
              id="cm__input--tag2"
              type="text"
              className={classNames({
                [`${StylesForm["CreateMarketForm__error--field"]}`]: newMarket
                  .validations[newMarket.currentStep].tag2
              })}
              value={s.localValues.tag2}
              maxLength={TAGS_MAX_LENGTH}
              placeholder="Tag 2"
              onChange={e =>
                this.validateTag("tag2", e.target.value, TAGS_MAX_LENGTH, false)
              }
              onKeyPress={e => keyPressed(e)}
            />
          </div>
        </li>
      </ul>
    );
  }
}
