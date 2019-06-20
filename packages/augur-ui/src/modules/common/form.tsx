import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { AM, PM } from "modules/common/constants";
import ChevronFlip from 'modules/common/chevron-flip';
import { BigNumber, createBigNumber } from 'utils/create-big-number';
import { PulseLoader } from 'react-spinners';
import {
  SearchIcon,
  XIcon,
  CheckMark,
  OutlineChevron,
  Ellipsis,
  EmptyRadio,
  FilledRadio,
  EmptyCheckbox,
  FilledCheckbox,
  Chevron
} from 'modules/common/icons';
import debounce from 'utils/debounce';

import Styles from 'modules/common/form.styles.less';
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';
import { SingleDatePicker } from 'react-dates';
import { SquareDropdown } from "modules/common/selection";

interface CheckboxProps {
  id: string;
  isChecked: boolean;
  disabled?: boolean;
  type?: string;
  value?: any;
  onClick: Function;
  small?: boolean;
  smallOnDesktop?: boolean;
}

interface DatePickerProps {
  id?: string;
  date: any;
  placeholder?: string;
  onDateChange: Function;
  isOutsideRange?: Function;
  focused?: boolean;
  onFocusChange?: Function;
  displayFormat: string;
  numberOfMonths: number;
  navPrev?: any;
  navNext?: any;
}

interface TextInputProps {
  error?: boolean;
  errrorMessage?: string;
  disabled?: boolean;
  placeholder?: string;
  onChange: Function;
  value?: string;
}

interface TextInputState {
  value: string;
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

interface FormDropdownProps {
  id?: string;
  onChange: any;
  className?: string;
  defaultValue?: string | number;
  options: Array<NameValuePair>;
  staticLabel?: string;
  disabled?: Boolean;
  error?: Boolean;
  errorMessage?: String;
  openTop?: Boolean;
}

export const FormDropdown = (props: FormDropdownProps) => 
  <>
    <SquareDropdown 
      {...props} 
      className={classNames(Styles.FormDropdown, {[Styles.disabled]: props.disabled, [Styles.error]: props.error})} 
      activeClassName={Styles.FormDropdownActive}
    />
    {props.error && props.errorMessage && 
      <span className={Styles.ErrorText}>
        {props.errorMessage}
      </span>
    }
  </>;

interface TimezoneDropdownProps {
  id?: string;
  onChange: any;
  className?: string;
  disabled?: Boolean;
}

export const TimezoneDropdown = (props: TimezoneDropdownProps) => (
  <FormDropdown
    {...props}
    options={[{
      label: "UTC - 0",
      value: 0
    }]}
  />
);

interface RadioCardProps {
  value: string;
  header: string;
  description: string;
  checked?: boolean;
  onChange?: Function;
  icon?: SVGElement;
}

interface RadioCardGroupProps {
  radioButtons: Array<RadioCardProps>;
  defaultSelected?: string | null;
}

interface RadioCardGroupState {
  selected: string | null;
}

interface RadioBarProps {
  header: string;
  value: string;
  onChange?: Function;
  expandable?: boolean;
  checked?: boolean;
  error?: boolean;
  onTextChange?: Function;
}

interface RadioTwoLineBarProps {
  header: string;
  description: string;
  value: string;
  onChange?: Function;
  checked?: boolean;
  error?: boolean;
}

interface CheckboxBarProps {
  header: string;
  value: string;
  onChange?: Function;
  checked?: boolean;
  error?: boolean;
}

export const CheckboxBar = ({
  header,
  onChange,
  checked,
  value,
  error,
}: CheckboxBarProps) => (
  <div
    className={classNames(Styles.CheckboxBar, {
      [Styles.RadioBarError]: error,
      [Styles.CheckboxBarChecked]: checked,
    })}
    role="button"
    onClick={e => onChange(value)}
  >
    {checked ? FilledCheckbox : EmptyCheckbox}
    <h5>{header}</h5>
  </div>
);

export const RadioBar = ({
  header,
  onChange,
  checked,
  value,
  error,
  expandable,
  onTextChange,
}: RadioBarProps) => (
  <div
    className={classNames(Styles.RadioBar, {
      [Styles.RadioBarExpanded]: checked && expandable,
      [Styles.RadioBarError]: error,
    })}
    role="button"
    onClick={e => onChange(value)}
  >
    {checked ? FilledRadio : EmptyRadio}
    <h5>{header}</h5>
    {expandable && checked ? <TextInput onChange={onTextChange} /> : null}
  </div>
);

export const RadioTwoLineBar = ({
  header,
  onChange,
  checked,
  value,
  error,
  description,
}: RadioTwoLineBarProps) => (
  <div
    className={classNames(Styles.RadioTwoLineBar, {
      [Styles.RadioBarError]: error,
    })}
    role="button"
    onClick={e => onChange(value)}
  >
    {checked ? FilledRadio : EmptyRadio}
    <h5>{header}</h5>
    <p>{description}</p>
  </div>
);

export class RadioCardGroup extends Component<
  RadioCardGroupProps,
  RadioCardGroupState
> {
  state: RadioCardGroupState = {
    selected: this.props.defaultSelected || null,
  };

  render() {
    const { radioButtons } = this.props;
    const { selected } = this.state;
    return (
      <section className={Styles.RadioCardGroup}>
        {radioButtons.map(radio => (
          <RadioCard
            key={radio.value}
            {...radio}
            checked={radio.value === selected}
            onChange={selected => this.setState({ selected })}
          />
        ))}
      </section>
    );
  }
}
// this has to be a div to allow for the grid layout we want to use.
const RadioCard = ({
  value,
  header,
  description,
  onChange,
  checked,
  icon,
}: RadioCardProps) => (
  <div
    className={classNames(Styles.RadioCard, {
      [Styles.RadioCardActive]: checked,
    })}
    role="button"
    onClick={e => onChange(value)}
  >
    <div>{CheckMark}</div>
    {icon ? icon : Ellipsis}
    <h5>{header}</h5>
    <p>{description}</p>
  </div>
);

export class TextInput extends React.Component<TextInputProps, TextInputState> {
  state: TextInputState = {
    value: this.props.value,
  };

  componentWillReceiveProps(nextProps: TextInputProps) {
    const { value } = this.props;
    if (value !== nextProps.value) {
      this.setState({ value: nextProps.value });
    }
  }

  onChange = (e: any) => {
    const value = e.target.value;
    this.setState({ value });
    this.props.onChange(value);
  };
  render() {
    const { placeholder, disabled, error, errorMessage } = this.props;

    return (
      <>
        <input
          {...this.props}
          className={classNames(Styles.TextInput, { [Styles.error]: error })}
          value={this.state.value}
          onChange={this.onChange}
          placeholder={placeholder}
          disabled={disabled}
        />
        {error && <span className={Styles.ErrorText}>{errorMessage}</span>}
      </>
    );
  }
}

interface TimeSelectorProps {
  showPicker: Boolean;
}

interface TimeSelectorState {
  showPicker: Boolean;
}

export class TimeSelector extends React.Component<
  TimeSelectorProps,
  TimeSelectorState
> {
  state: TimeSelectorState = {
    showPicker: false,
    minutes: "00",
    hours: "12",
    timeFormat: 0,
  }

  componentDidMount() {
    window.addEventListener("click", this.handleWindowOnClick);
  }

  componentWillUnmount() {
    window.removeEventListener("click", this.handleWindowOnClick);
  }

  handleWindowOnClick = (event: React.MouseEvent<HTMLElement>) => {
    if (this.timeSelector && !this.timeSelector.contains(event.target)) {
      this.setState({ showPicker: false });
    }
  };

  toggleSelector = () => {
    this.setState({showPicker: !this.state.showPicker});
  }

  onChangeMinutes = (value) => {
    this.setState({minutes: value})
  } 

  onChangeHours = (value) => {
    this.setState({hours: value})
  } 

  onChangeAM = () => {
    this.setState({am: !this.state.am})
  } 

  render() {
    const {
      placeholder
    } = this.props;

    const {
      hours,
      minutes,
      timeFormat
    } = this.state;

    const timeOptions = [AM, PM];

    return (
      <div 
        className={Styles.TimeSelector}
        ref={timeSelector => {
          this.timeSelector = timeSelector;
        }}
      >
        <button onClick={this.toggleSelector}>
          {hours}:{minutes} {timeOptions[timeFormat]}
        </button>
        {this.state.showPicker && 
          <div>
            <IndividualTimeSelector 
              label="Hours"
              min={1}
              max={12}
              onChange={this.onChangeHours}
              value={hours}
            />
            <span>:</span>
            <IndividualTimeSelector 
              label="Minutes"
              showLeadingZero
              min={0}
              max={60}
              onChange={this.onChangeMinutes}
              value={minutes}
            />
            <IndividualTimeSelector 
              label="AM/PM"
              options={timeOptions}
              onChange={this.onChangeAM}
              value={timeFormat}
            />
          </div>
        }
      </div>
    );
  }
}

interface IndividualTimeSelectorProps {
  options?: Array;
  label: string;
  min?: Number;
  max?: Number;
  onChange: Function;
  showColon?: Boolean;
  value: any;
  showLeadingZero?: Boolean;
}

interface IndividualTimeSelectorState {
  value: any;
}

class IndividualTimeSelector extends React.Component<
  IndividualTimeSelectorProps,
  IndividualTimeSelectorState
> {
  state: IndividualTimeSelectorState = {
    value: this.props.value
  }

  componentWillReceiveProps(nextProps: IndividualTimeSelectorProps) {
    const { value } = this.props;
    if (value !== nextProps.value) {
      this.setState({ value: nextProps.value });
    }
  }

  onChange = (value: any) => {
    const {
      showLeadingZero,
      options,
      onChange,
      min,
      max
    } = this.props;
    
    if (!options && value.toString() !== "") {
      if (value > max) return;
      if (value < min) return;
    }

    if (showLeadingZero && value.toString().length === 1 && value.toString() !== "0") {
      value = "0" + value;
    } else if (showLeadingZero && value.toString().length > 2) {
      value = value.substring(1);
    }
    
    this.setState({ value });
    onChange(value);
  };

  increment = () => {
    let value = this.state.value;
    if (!this.props.options) {
      const newValue = parseFloat(value) + 1;
      this.onChange(newValue)
    } else {
      if (value !== this.props.options.length - 1) {
        this.onChange(value + 1);
      } else {
        this.onChange(value - 1);
      }
    }
  }

  decrement = () => {
    let value = this.state.value;
    if (!this.props.options) {
      const newValue = parseFloat(value) - 1;
      this.onChange(newValue);
    } else {
      if (value !== 0) {
        this.onChange(value - 1);
      } else {
        this.onChange(value + 1);
      }
    }
  }

  render() {
    const {
      label,
      onChange,
      value,
      options,
      min,
      max
    } = this.props;

    return (
      <div className={Styles.IndividualTimeSelector}>
        <span>{label}</span>
        <button onClick={this.increment}>
          {Chevron}
        </button>
        {options && 
          <input 
            type="text"
            onChange={(e) => this.onChange(e.target.value)} 
            value={options[this.state.value]}
            disabled
          />
        }
        {!options && 
          <input 
            type="number"
            min={min}
            max={max}
            step="1"
            onChange={(e) => this.onChange(e.target.value)} 
            value={this.state.value}
          />
        }
        <button onClick={this.decrement}>
          {Chevron}
        </button>
      </div>
    );
  }
}

export const Checkbox = ({
  id,
  smallOnDesktop = false,
  isChecked,
  onClick,
  disabled,
}: CheckboxProps) => (
  <div
    className={classNames(Styles.Checkbox, {
      [Styles.CheckboxSmall]: smallOnDesktop,
    })}
  >
    <input
      id={id}
      type="checkbox"
      checked={isChecked}
      disabled={disabled}
      onChange={e => onClick(e)}
    />
    <span
      role="button"
      tabIndex={0}
      onClick={e => onClick(e)}
      className={classNames({
        [Styles.CheckmarkSmall]: smallOnDesktop,
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
  smallOnDesktop: PropTypes.bool,
};

Checkbox.defaultProps = {
  disabled: false,
  small: false,
  smallOnDesktop: false,
};

export const DatePicker = (props: DatePickerProps) => (
  <div className={Styles.DatePicker}>
    <SingleDatePicker
      id={props.id}
      date={props.date}
      placeholder={props.placeholder || 'Date (D MMM YYYY)'}
      onDateChange={props.onDateChange}
      isOutsideRange={props.isOutsideRange || (() => false)}
      focused={props.focused}
      onFocusChange={props.onFocusChange}
      displayFormat={props.displayFormat || 'D MMM YYYY'}
      numberOfMonths={props.numberOfMonths}
      navPrev={props.navPrev || OutlineChevron}
      navNext={props.navNext || OutlineChevron}
      weekDayFormat="ddd"
    />
  </div>
);

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
    style: PropTypes.object,
  };

  static defaultProps = {
    type: 'text',
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
    style: {},
  };

  constructor(props) {
    super(props);

    this.state = {
      value: props.value,
      isHiddenContentVisible: false,
      focused: false,
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
    window.addEventListener('click', this.handleWindowOnClick);
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
    window.removeEventListener('click', this.handleWindowOnClick);
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
    this.setState({ value: '' });
    this.props.onChange('');
  };

  handleToggleVisibility = () =>
    this.updateIsHiddenContentVisible(!this.state.isHiddenContentVisible);

  timeoutVisibleHiddenContent = () => this.updateIsHiddenContentVisible(false);

  handleWindowOnClick(event) {
    this.setState({
      focused: this.inputHandler && this.inputHandler.contains(event.target),
    });
  }

  updateIsHiddenContentVisible(isHiddenContentVisible) {
    this.setState({
      isHiddenContentVisible,
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
            'can-toggle-visibility': canToggleVisibility,
            [Styles.FocusBorder]: focused && !noFocus && !lightBorder,
            [`${Styles.NoFocus}`]: noFocus,
            [`${Styles.LightBorder}`]: lightBorder,
            [Styles.SetWidth]: darkMaxBtn,
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
            className={classNames('box', className, {
              'search-input': isSearch,
            })}
            type={type === 'password' && isHiddenContentVisible ? 'text' : type}
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
          <div style={{ marginRight: '8px' }}>
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
              [Styles.MaxDark]: darkMaxBtn,
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
              className={classNames(Styles.IncrementValue, 'unstyled')}
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
      selected: !!props.default,
    };

    this.dropdownSelect = this.dropdownSelect.bind(this);
    this.toggleList = this.toggleList.bind(this);
    this.handleWindowOnClick = this.handleWindowOnClick.bind(this);
    this.onKeyPress = this.onKeyPress.bind(this);
  }

  componentDidMount() {
    const { isMobileSmall, options } = this.props;
    window.addEventListener('click', this.handleWindowOnClick);

    if (isMobileSmall && this.state.value === '') {
      this.dropdownSelect(options[0]);
    }
  }

  componentWillUnmount() {
    window.removeEventListener('click', this.handleWindowOnClick);
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
        selected: true,
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
    const { showList, selected, label: currentLabel, value } = this.state;

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
            [`${Styles.selected}`]: selected,
          })}
        >
          {currentLabel}
        </span>
        <div
          className={classNames({
            [`${Styles.active}`]: showList,
          })}
        >
          {options.map(option => (
            <button
              className={classNames({
                [`${Styles.active}`]: option === value,
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
            [`${Styles.selected}`]: selected,
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
  onKeyPress: PropTypes.func,
};

InputDropdown.defaultProps = {
  onKeyPress: null,
  className: null,
};
