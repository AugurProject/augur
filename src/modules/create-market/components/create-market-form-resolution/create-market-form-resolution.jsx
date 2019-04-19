/* eslint jsx-a11y/label-has-for: 0 */

import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import {
  EXPIRY_SOURCE_GENERIC,
  EXPIRY_SOURCE_SPECIFIC,
  DESIGNATED_REPORTER_SELF,
  DESIGNATED_REPORTER_SPECIFIC
} from "modules/common-elements/constants";
import isAddress from "modules/auth/helpers/is-address";

import { ExclamationCircle as InputErrorIcon } from "modules/common/components/icons";
import Styles from "modules/create-market/components/create-market-form-resolution/create-market-form-resolution.styles";
import StylesForm from "modules/create-market/components/create-market-form/create-market-form.styles";

export default class CreateMarketResolution extends Component {
  static propTypes = {
    newMarket: PropTypes.object.isRequired,
    isValid: PropTypes.func.isRequired,
    keyPressed: PropTypes.func.isRequired,
    updateNewMarket: PropTypes.func.isRequired,
    validateField: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    this.validateExpiryType = this.validateExpiryType.bind(this);
  }

  validateDesignatedReporterType(value) {
    const { isValid, newMarket, updateNewMarket } = this.props;
    const updatedMarket = { ...newMarket };
    const { currentStep } = newMarket;

    if (value === DESIGNATED_REPORTER_SPECIFIC) {
      updatedMarket.validations[
        currentStep
      ].designatedReporterAddress = updatedMarket.validations[currentStep]
        .designatedReporterAddress
        ? updatedMarket.validations[currentStep].designatedReporterAddress
        : null;
    } else {
      delete updatedMarket.validations[currentStep].designatedReporterAddress;
    }

    updatedMarket.validations[currentStep].designatedReporterType = "";
    updatedMarket.designatedReporterType = value;
    updatedMarket.isValid = isValid(currentStep);

    updateNewMarket(updatedMarket);
  }

  validateDesignatedReporterAddress(value) {
    const { isValid, newMarket, updateNewMarket } = this.props;
    const { currentStep } = newMarket;
    const updatedMarket = { ...newMarket };

    if (!isAddress(value)) {
      updatedMarket.validations[currentStep].designatedReporterAddress =
        "Invalid Ethereum address.";
    } else {
      updatedMarket.validations[currentStep].designatedReporterAddress = "";
    }

    updatedMarket.designatedReporterAddress = value;
    updatedMarket.isValid = isValid(currentStep);

    updateNewMarket(updatedMarket);
  }

  validateExpiryType(value) {
    const { isValid, newMarket, updateNewMarket } = this.props;
    const { currentStep } = newMarket;
    const updatedMarket = { ...newMarket };

    if (value === EXPIRY_SOURCE_SPECIFIC) {
      updatedMarket.validations[currentStep].expirySource = updatedMarket
        .validations[currentStep].expirySource
        ? updatedMarket.validations[currentStep].expirySource
        : null;
    } else {
      delete updatedMarket.validations[currentStep].expirySource;
    }

    updatedMarket.validations[newMarket.currentStep].expirySourceType = "";
    updatedMarket.expirySourceType = value;
    updatedMarket.isValid = isValid(newMarket.currentStep);

    updateNewMarket(updatedMarket);
  }

  render() {
    const { newMarket, validateField, keyPressed } = this.props;
    const validations = newMarket.validations[newMarket.currentStep];

    const designatedReporterError =
      newMarket.designatedReporterType === DESIGNATED_REPORTER_SPECIFIC &&
      validations.designatedReporterAddress;

    return (
      <ul className={StylesForm.CreateMarketForm__fields}>
        <li>
          <label>
            <span>Resolution Source</span>
          </label>
          <ul
            className={StylesForm["CreateMarketForm__radio-buttons--per-line"]}
          >
            <li>
              <button
                className={classNames({
                  [`${StylesForm.active}`]:
                    newMarket.expirySourceType === EXPIRY_SOURCE_GENERIC
                })}
                onClick={() => this.validateExpiryType(EXPIRY_SOURCE_GENERIC)}
                onKeyPress={e => keyPressed(e)}
              >
                General knowledge
              </button>
            </li>
            <li
              className={
                Styles["CreateMarketResolution__expiry-source-specific"]
              }
            >
              <button
                className={classNames({
                  [`${StylesForm.active}`]:
                    newMarket.expirySourceType === EXPIRY_SOURCE_SPECIFIC
                })}
                onClick={() => this.validateExpiryType(EXPIRY_SOURCE_SPECIFIC)}
                onKeyPress={e => keyPressed(e)}
              >
                Outcome will be detailed on a public website
              </button>
              {newMarket.expirySourceType === EXPIRY_SOURCE_SPECIFIC && (
                <div>
                  <input
                    type="text"
                    value={newMarket.expirySource}
                    placeholder="Define URL"
                    onChange={e =>
                      validateField("expirySource", e.target.value)
                    }
                    onKeyPress={e => keyPressed(e)}
                  />
                  {newMarket.validations[newMarket.currentStep]
                    .expirySource && (
                    <span
                      className={StylesForm["CreateMarketForm__error--bottom"]}
                    >
                      {InputErrorIcon()}
                      {
                        newMarket.validations[newMarket.currentStep]
                          .expirySource
                      }
                    </span>
                  )}
                </div>
              )}
            </li>
          </ul>
        </li>
        <li>
          <label>
            <span>Designated Reporter</span>
          </label>
          <ul
            className={StylesForm["CreateMarketForm__radio-buttons--per-line"]}
          >
            <li>
              <button
                className={classNames({
                  [`${StylesForm.active}`]:
                    newMarket.designatedReporterType ===
                    DESIGNATED_REPORTER_SELF
                })}
                onClick={() =>
                  this.validateDesignatedReporterType(DESIGNATED_REPORTER_SELF)
                }
                onKeyPress={e => keyPressed(e)}
              >
                Myself
              </button>
            </li>
            <li
              className={
                Styles["CreateMarketResolution__designated-reporter-specific"]
              }
            >
              <button
                className={classNames({
                  [`${StylesForm.active}`]:
                    newMarket.designatedReporterType ===
                    DESIGNATED_REPORTER_SPECIFIC
                })}
                onClick={() =>
                  this.validateDesignatedReporterType(
                    DESIGNATED_REPORTER_SPECIFIC
                  )
                }
                onKeyPress={e => keyPressed(e)}
              >
                Someone Else
              </button>
              <div>
                {newMarket.designatedReporterType ===
                  DESIGNATED_REPORTER_SPECIFIC && (
                  <input
                    className={classNames({
                      [`${
                        StylesForm["CreateMarketForm__error--field"]
                      }`]: designatedReporterError
                    })}
                    type="text"
                    value={newMarket.designatedReporterAddress}
                    placeholder="Designated Reporter Address"
                    onChange={e =>
                      this.validateDesignatedReporterAddress(e.target.value)
                    }
                    onKeyPress={e => keyPressed(e)}
                  />
                )}
                {designatedReporterError && (
                  <span
                    className={StylesForm["CreateMarketForm__error--bottom"]}
                  >
                    {InputErrorIcon()}
                    {
                      newMarket.validations[newMarket.currentStep]
                        .designatedReporterAddress
                    }
                  </span>
                )}
              </div>
            </li>
          </ul>
        </li>
      </ul>
    );
  }
}
