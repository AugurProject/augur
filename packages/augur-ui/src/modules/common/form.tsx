import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import ChevronFlip from "modules/common/chevron-flip";
import { BigNumber, createBigNumber } from "utils/create-big-number";
import { PulseLoader } from "react-spinners";
import { SearchIcon, XIcon, CheckMark } from "modules/common/icons";
import debounce from "utils/debounce";
import Styles from "modules/common/form.styles";

interface CheckboxProps {
  id: string;
  isChecked: boolean;
  disabled?: boolean;
  // value: boolean;
  onClick: Function;
  small?: boolean;
  smallOnDesktop?: boolean;
}

interface InputDropdownProps {
  onChange: Function;
  default: string;
  options: Array<string>;
  isMobileSmall: Boolean;
  label: string;
  className?: string;
  onKeyPress?: Function;
}

interface InputDropdownState {
  label: string;
  value: string;
  showList: Boolean;
  selected: Boolean;
}

export const Checkbox = ({
  id,
  smallOnDesktop = false,
  isChecked,
  // value,
  onClick,
  disabled
}: CheckboxProps) => (
  <div
    className={classNames(Styles.Checkbox, {
      [Styles.CheckboxSmall]: smallOnDesktop
    })}
  >
    <input
      id={id}
      type="checkbox"
      checked={isChecked}
      // value={value}
      disabled={disabled}
      onChange={e => onClick()}
    />
    <span
      role="button"
      tabIndex={0}
      onClick={e => onClick()}
      className={classNames({
        [Styles.CheckmarkSmall]: smallOnDesktop
      })}
    >
      {CheckMark}
    </span>
  </div>
);

Checkbox.propTypes = {
  id: PropTypes.string.isRequired,
  isChecked: PropTypes.bool.isRequired,
  disabled: PropTypes.bool,
  // value: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  small: PropTypes.bool,
  smallOnDesktop: PropTypes.bool
};

Checkbox.defaultProps = {
  disabled: false,
  small: false,
  smallOnDesktop: false
};

interface InputProps {
  type?: string;
  className?: string;
  value: any;
  max?: any;
  min?: any;
  isMultiline?: Boolean;
  isClearable?: Boolean;
  onChange: Function;
  updateValue?: Function;
  onBlur?: Function;
  isIncrementable?: Boolean;
  incrementAmount?: number;
  canToggleVisibility?: Boolean;
  shouldMatchValue?: Boolean;
  comparisonValue?: string;
  isSearch?: Boolean;
  placeholder?: string;
  maxButton?: Boolean;
  onMaxButtonClick?: Function;
  noFocus?: Boolean;
  isLoading?: Boolean;
  onFocus?: Function;
  lightBorder?: Boolean;
  darkMaxBtn?: Boolean;
  style?: any;
}

interface InputState {
  value: any;
  isHiddenContentVisible: Boolean;
  focused: Boolean;
}

export class Input extends Component<InputProps, InputState> {
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
          isIncrementable ? Styles.Incremental : Styles.Input,
          className,
          {
            "can-toggle-visibility": canToggleVisibility,
            [Styles.FocusBorder]: focused && !noFocus && !lightBorder,
            [`${Styles.NoFocus}`]: noFocus,
            [`${Styles.LightBorder}`]: lightBorder,
            [Styles.SetWidth]: darkMaxBtn
          }
        )}
        ref={inputHandler => {
          this.inputHandler = inputHandler;
        }}
        onFocus={this.onFocusIn}
        onBlur={this.onBlurThing}
        style={style}
      >
        {isSearch && SearchIcon}
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

        {isClearable && !isMultiline && !!value && (
          <button
            type="button"
            className={Styles.close}
            onClick={this.handleClear}
          >
            {XIcon}
          </button>
        )}

        {canToggleVisibility && value && (
          <button
            type="button"
            className="button--text-only"
            onClick={this.handleToggleVisibility}
            tabIndex={-1}
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
            className={classNames(Styles.Max, {
              [Styles.MaxDark]: darkMaxBtn
            })}
            onClick={onMaxButtonClick}
          >
            max
          </button>
        )}

        {shouldMatchValue && value && (
          <div className="input-value-comparison">
            {value === comparisonValue ? (
              <i className="fa fa-check-circle input-does-match" />
            ) : (
              <i className="fa fa-times-circle input-does-not-match" />
            )}
          </div>
        )}

        {isIncrementable && (
          <div className={Styles.ValueIncrementers}>
            <button
              type="button"
              tabIndex={-1}
              className={classNames(Styles.IncrementValue, "unstyled")}
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
              tabIndex={-1}
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

export class InputDropdown extends Component<
  InputDropdownProps,
  InputDropdownState
> {
  constructor(props) {
    super(props);

    this.state = {
      label: props.default || props.label,
      value: props.default,
      showList: false,
      selected: !!props.default
    };

    this.dropdownSelect = this.dropdownSelect.bind(this);
    this.toggleList = this.toggleList.bind(this);
    this.handleWindowOnClick = this.handleWindowOnClick.bind(this);
    this.onKeyPress = this.onKeyPress.bind(this);
  }

  componentDidMount() {
    const { isMobileSmall, options } = this.props;
    window.addEventListener("click", this.handleWindowOnClick);

    if (isMobileSmall && this.state.value === "") {
      this.dropdownSelect(options[0]);
    }
  }

  componentWillUnmount() {
    window.removeEventListener("click", this.handleWindowOnClick);
  }

  onKeyPress(value) {
    const { onKeyPress } = this.props;
    if (onKeyPress) {
      onKeyPress(value);
    }
  }

  dropdownSelect(value) {
    const { onChange } = this.props;
    if (value !== this.state.value) {
      this.setState({
        label: value,
        value,
        selected: true
      });
      onChange(value);
      this.toggleList();
    }
  }

  toggleList() {
    this.setState({ showList: !this.state.showList });
  }

  handleWindowOnClick(event) {
    if (
      this.refInputDropdown &&
      !this.refInputDropdown.contains(event.target)
    ) {
      this.setState({ showList: false });
    } else {
      this.refInputDropdown.focus();
    }
  }

  render() {
    const { className, label, options } = this.props;
    const { showList, selected, currentLabel, value } = this.state;

    return (
      <div
        ref={InputDropdown => {
          this.refInputDropdown = InputDropdown;
        }}
        className={classNames(Styles.InputDropdown, className)}
        onClick={this.toggleList}
        onKeyPress={value => this.onKeyPress(value)}
      >
        <span
          key={label}
          className={classNames({
            [`${Styles.selected}`]: selected
          })}
        >
          {currentLabel}
        </span>
        <div
          className={classNames({
            [`${Styles.active}`]: showList
          })}
        >
          {options.map(option => (
            <button
              className={classNames({
                [`${Styles.active}`]: option === value
              })}
              key={option + label}
              value={option}
              onClick={() => this.dropdownSelect(option)}
            >
              {option}
            </button>
          ))}
        </div>
        <select
          className={classNames({
            [`${Styles.selected}`]: selected
          })}
          onChange={e => {
            this.dropdownSelect(e.target.value);
          }}
          value={value}
        >
          {options.map(option => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <span>
          <ChevronFlip pointDown={!showList} stroke="white" />
        </span>
      </div>
    );
  }
}

InputDropdown.propTypes = {
  onChange: PropTypes.func.isRequired,
  default: PropTypes.string.isRequired,
  options: PropTypes.array.isRequired,
  isMobileSmall: PropTypes.bool.isRequired,
  label: PropTypes.string.isRequired,
  className: PropTypes.string,
  onKeyPress: PropTypes.func
};

InputDropdown.defaultProps = {
  onKeyPress: null,
  className: null
};
