import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import formatAddress from "modules/auth/helpers/format-address";
import { prevIcon, nextIcon } from "modules/common/components/icons";
import { formatEther } from "utils/format-number";

import StylesDropdown from "modules/auth/components/connect-dropdown/connect-dropdown.styles";
import Styles from "modules/auth/components/common/address-picker-content.styles";

export default class AddressPickerContent extends Component {
  static propTypes = {
    addresses: PropTypes.array.isRequired,
    indexArray: PropTypes.array.isRequired,
    clickAction: PropTypes.func.isRequired,
    clickPrevious: PropTypes.func.isRequired,
    clickNext: PropTypes.func.isRequired,
    disablePrevious: PropTypes.bool.isRequired,
    disableNext: PropTypes.bool.isRequired
  };

  constructor(props) {
    super(props);

    this.LedgerEthereum = null;

    this.clickPrevious = this.clickPrevious.bind(this);
    this.clickNext = this.clickNext.bind(this);
  }

  clickPrevious(e) {
    if (!this.props.disablePrevious) {
      e.stopPropagation();
      e.preventDefault();

      this.props.clickPrevious();
    }
  }

  clickNext(e) {
    if (!this.props.disableNext) {
      e.stopPropagation();
      e.preventDefault();

      this.props.clickNext();
    }
  }

  render() {
    const {
      indexArray,
      addresses,
      clickAction,
      disablePrevious,
      disableNext
    } = this.props;

    return (
      <div
        className={StylesDropdown.ConnectDropdown__content}
        style={{ paddingLeft: "0", paddingRight: "0" }}
      >
        <div
          className={classNames(
            StylesDropdown.ConnectDropdown__row,
            StylesDropdown.ConnectDropdown__header
          )}
        >
          <div className={StylesDropdown.ConnectDropdown__addressColumn}>
            Address
          </div>
          <div className={StylesDropdown.ConnectDropdown__balanceColumn}>
            Balance
          </div>
        </div>
        {indexArray.map(index => (
          <div
            key={index}
            className={classNames(StylesDropdown.ConnectDropdown__row, {
              [StylesDropdown.FadeInAndOut]: !(addresses[index] || {}).address,
              [StylesDropdown.ConnectDropdown__rowTransition]: true
            })}
          >
            <button
              className={StylesDropdown.ConnectDropdown__addressColumn}
              onClick={() => clickAction(addresses[index])}
            >
              {((addresses[index] || {}).address &&
                formatAddress((addresses[index] || {}).address)) ||
                `—`}
            </button>
            <div className={StylesDropdown.ConnectDropdown__balanceColumn}>
              {(addresses[index] || {}).balance
                ? formatEther((addresses[index] || {}).balance).formatted
                : `—`}
            </div>
          </div>
        ))}
        <div
          className={classNames(
            StylesDropdown.ConnectDropdown__row,
            StylesDropdown.ConnectDropdown__footer
          )}
        >
          <button
            className={classNames(Styles.AddressPickerContent__direction, {
              [Styles.AddressPickerContent__directionDisabled]: disablePrevious
            })}
            onClick={this.clickPrevious}
          >
            <span
              style={{ marginRight: "8px" }}
              className={Styles.AddressPickerContent__arrow}
            >
              {prevIcon}
            </span>
            Previous
          </button>
          <button
            className={classNames(Styles.AddressPickerContent__direction, {
              [Styles.AddressPickerContent__directionDisabled]: disableNext
            })}
            onClick={this.clickNext}
            style={{ marginLeft: "24px" }}
          >
            Next
            <span
              style={{ marginLeft: "8px" }}
              className={Styles.AddressPickerContent__arrow}
            >
              {nextIcon}
            </span>
          </button>
        </div>
      </div>
    );
  }
}
