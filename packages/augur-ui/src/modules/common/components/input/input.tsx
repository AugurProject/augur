import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { BigNumber, createBigNumber } from "utils/create-big-number";
import { PulseLoader } from "react-spinners";

import { IconSearch, CloseDark } from "modules/common/components/icons";

import debounce from "utils/debounce";

import Styles from "modules/common/components/input/input.styles";

export default class Input extends Component {
  // TODO -- Prop Validations
  static propTypes = {
    type: PropTypes.string,
    className: PropTypes.string,
    value: PropTypes.any.isRequired,
    max: PropTypes.any,
    min: PropTypes.any,
    isMultiline: PropTypes.bool,
    isClearable: PropTypes.bool,
    onChange: PropTypes.func.isRequired,
    updateValue: PropTypes.func,
    onBlur: PropTypes.func,
    isIncrementable: PropTypes.bool,
    incrementAmount: PropTypes.number,
    canToggleVisibility: PropTypes.bool,
    shouldMatchValue: PropTypes.bool,
    comparisonValue: PropTypes.string,
    isSearch: PropTypes.bool,
    placeholder: PropTypes.string,
    maxButton: PropTypes.bool,
    onMaxButtonClick: PropTypes.func,
    noFocus: PropTypes.bool,
    isLoading: PropTypes.bool,
    onFocus: PropTypes.func,
    lightBorder: PropTypes.bool,
    darkMaxBtn: PropTypes.bool,
    style: PropTypes.object
  };

  static defaultProps = {
    type: "text",
    className: null,
    min: null,
    max: null,
    isMultiline: false,
    isClearable: false,
    isIncrementable: false,
    canToggleVisibility: false,
    shouldMatchValue: false,
    isSearch: false,
    maxButton: false,
    noFocus: false,
    isLoading: false,
    lightBorder: false,
    updateValue: null,
    onBlur: null,
    onMaxButtonClick: null,
    onFocus: null,
    incrementAmount: null,
    comparisonValue: null,
    placeholder: null,
    darkMaxBtn: false,
    style: {}
  };

  constructor(props) {
    super(props);

    this.state = {
      value: props.value,
      isHiddenContentVisible: false,
      focused: false
    };

    this.handleOnChange = this.handleOnChange.bind(this);
    this.handleOnBlur = this.handleOnBlur.bind(this);
    this.handleClear = this.handleClear.bind(this);
    this.handleOnFocus = this.handleOnFocus.bind(this);
    this.handleToggleVisibility = this.handleToggleVisibility.bind(this);
    this.handleWindowOnClick = this.handleWindowOnClick.bind(this);
    this.timeoutVisibleHiddenContent = debounce(
      this.timeoutVisibleHiddenContent.bind(this),
      1200
    );
  }

  componentDidMount() {
    window.addEventListener("click", this.handleWindowOnClick);
  }

  componentWillReceiveProps(nextProps) {
    const { value } = this.props;
    if (value !== nextProps.value) {
      this.setState({ value: nextProps.value });
    }
  }

  componentWillUpdate(nextProps, nextState) {
    if (
      nextProps.canToggleVisibility &&
      !nextState.value &&
      nextState.isHiddenContentVisible
    ) {
      this.updateIsHiddenContentVisible(false);
    }

    if (
      this.state.isHiddenContentVisible !== nextState.isHiddenContentVisible &&
      nextState.isHiddenContentVisible
    ) {
      this.timeoutVisibleHiddenContent();
    }
  }

  componentWillUnmount() {
    window.removeEventListener("click", this.handleWindowOnClick);
  }

  handleOnChange = e => {
    const newValue = e.target.value;

    this.props.onChange(newValue);
    this.setState({ value: newValue });
  };

  handleOnBlur = () => {
    this.props.onChange(this.state.value);
    this.props.onBlur && this.props.onBlur();
  };

  handleOnFocus = () => {
    this.props.onChange(this.state.value);
    this.props.onFocus && this.props.onFocus();
  };

  handleClear = () => {
    this.setState({ value: "" });
    this.props.onChange("");
  };

  handleToggleVisibility = () =>
    this.updateIsHiddenContentVisible(!this.state.isHiddenContentVisible);

  timeoutVisibleHiddenContent = () => this.updateIsHiddenContentVisible(false);

  handleWindowOnClick(event) {
    this.setState({
      focused: this.inputHandler && this.inputHandler.contains(event.target)
    });
  }

  updateIsHiddenContentVisible(isHiddenContentVisible) {
    this.setState({
      isHiddenContentVisible
    });
  }

  render() {
    const {
      isClearable,
      isIncrementable,
      incrementAmount,
      updateValue,
      canToggleVisibility,
      shouldMatchValue,
      comparisonValue,
      isSearch,
      min,
      max,
      maxButton,
      onMaxButtonClick,
      noFocus,
      isLoading,
      lightBorder,
      className,
      placeholder,
      isMultiline,
      type,
      darkMaxBtn,
      style,
      ...p
    } = this.props; // eslint-disable-line no-unused-vars
    const { focused, isHiddenContentVisible, value } = this.state;

    return (
      <div
        className={classNames(
          isIncrementable ? Styles.Input__Incremental : Styles.Input,
          className,
          {
            "can-toggle-visibility": canToggleVisibility,
            [Styles.focusBorder]: focused && !noFocus && !lightBorder,
            [`${Styles.noFocus}`]: noFocus,
            [`${Styles.lightBorder}`]: lightBorder,
            [Styles.setWidth]: darkMaxBtn
          }
        )}
        ref={inputHandler => {
          this.inputHandler = inputHandler;
        }}
        onFocus={this.onFocusIn}
        onBlur={this.onBlurThing}
        style={style}
      >
        {isSearch && IconSearch}
        {!isMultiline && (
          <input
            {...p}
            className={classNames("box", className, {
              "search-input": isSearch
            })}
            type={type === "password" && isHiddenContentVisible ? "text" : type}
            value={value}
            onChange={this.handleOnChange}
            onBlur={this.handleOnBlur}
            placeholder={placeholder}
            onFocus={this.handleOnFocus}
          />
        )}

        {isMultiline && (
          <textarea
            {...p}
            className="box"
            value={value}
            onChange={this.handleOnChange}
            onBlur={this.handleOnBlur}
            onFocus={this.handleOnFocus}
          />
        )}

        {isSearch && (
          <div style={{ marginRight: "8px" }}>
            <PulseLoader
              color="#553580"
              sizeUnit="px"
              size={6}
              loading={isLoading}
            />
          </div>
        )}

        {isClearable &&
          !isMultiline &&
          !!value && (
            <button
              type="button"
              className={Styles.close}
              onClick={this.handleClear}
            >
              {CloseDark}
            </button>
          )}

        {canToggleVisibility &&
          value && (
            <button
              type="button"
              className="button--text-only"
              onClick={this.handleToggleVisibility}
              tabIndex="-1"
            >
              {isHiddenContentVisible ? (
                <i className="fa fa-eye-slash" />
              ) : (
                <i className="fa fa-eye" />
              )}
            </button>
          )}

        {maxButton && (
          <button
            type="button"
            className={classNames(Styles.Input__max, {
              [Styles.Input__maxDark]: darkMaxBtn
            })}
            onClick={onMaxButtonClick}
          >
            max
          </button>
        )}

        {shouldMatchValue &&
          value && (
            <div className="input-value-comparison">
              {value === comparisonValue ? (
                <i className="fa fa-check-circle input-does-match" />
              ) : (
                <i className="fa fa-times-circle input-does-not-match" />
              )}
            </div>
          )}

        {isIncrementable && (
          <div className={Styles.value__incrementers}>
            <button
              type="button"
              tabIndex="-1"
              className={classNames(Styles["increment-value"], "unstyled")}
              onClick={e => {
                e.currentTarget.blur();

                if ((!isNaN(parseFloat(value)) && isFinite(value)) || !value) {
                  const bnMax = sanitizeBound(max);
                  const bnMin = sanitizeBound(min);

                  let newValue = createBigNumber(value || 0);

                  if (bnMax !== null && newValue.greaterThan(bnMax)) {
                    newValue = bnMax;
                  } else if (bnMin !== null && newValue.lessThan(bnMin)) {
                    newValue = bnMin.plus(createBigNumber(incrementAmount));
                  } else {
                    newValue = newValue.plus(createBigNumber(incrementAmount));
                    if (bnMax !== null && newValue.greaterThan(bnMax)) {
                      newValue = bnMax;
                    }
                  }

                  updateValue(newValue);
                }
              }}
            >
              <i className="fa fa-angle-up" />
            </button>
            <button
              type="button"
              tabIndex="-1"
              className="decrement-value unstyled"
              onClick={e => {
                e.currentTarget.blur();

                if ((!isNaN(parseFloat(value)) && isFinite(value)) || !value) {
                  const bnMax = sanitizeBound(max);
                  const bnMin = sanitizeBound(min);

                  let newValue = createBigNumber(value || 0);

                  if (bnMax !== null && newValue.greaterThan(bnMax)) {
                    newValue = bnMax.minus(createBigNumber(incrementAmount));
                  } else if (bnMin !== null && newValue.lessThan(bnMin)) {
                    newValue = bnMin;
                  } else {
                    newValue = newValue.minus(createBigNumber(incrementAmount));
                    if (bnMin !== null && newValue.lessThan(bnMin)) {
                      newValue = bnMin;
                    }
                  }

                  updateValue(newValue);
                }
              }}
            >
              <i className="fa fa-angle-down" />
            </button>
          </div>
        )}
      </div>
    );
  }
}

function sanitizeBound(value) {
  if (value == null) {
    return null;
  } else if (!BigNumber.isBigNumber(value)) {
    return createBigNumber(value);
  }

  return value;
}
