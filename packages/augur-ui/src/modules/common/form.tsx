import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

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
  Chevron,
  DirectionArrow,
  Calendar,
  Clock,
  Arrow,
} from 'modules/common/icons';
import { SortedGroup } from 'modules/categories/set-categories';
import debounce from 'utils/debounce';

import Styles from 'modules/common/form.styles.less';
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';
import { SingleDatePicker } from 'react-dates';
import { SquareDropdown } from 'modules/common/selection';

const CUSTOM = "Custom";

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
  errorMessage?: string;
  disabled?: boolean;
  placeholder?: string;
  onChange: Function;
  value?: string;
  trailingLabel?: string;
}

interface TextInputState {
  value: string;
}

interface InputDropdownProps {
  onChange: Function;
  default: string;
  options: Array<string>;
  isMobileSmall?: Boolean;
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

export const FormDropdown = (props: FormDropdownProps) => (
  <>
    <SquareDropdown
      {...props}
      className={classNames(Styles.FormDropdown, {
        [Styles.disabled]: props.disabled,
        [Styles.error]: props.error,
      })}
      activeClassName={Styles.FormDropdownActive}
    />
    {props.error && props.errorMessage && (
      <span className={Styles.ErrorText}>{props.errorMessage}</span>
    )}
  </>
);

interface TimezoneDropdownProps {
  id?: string;
  onChange: any;
  className?: string;
  disabled?: Boolean;
}

export const TimezoneDropdown = (props: TimezoneDropdownProps) => (
  <FormDropdown
    {...props}
    staticLabel="Timezone"
    options={[
      {
        label: 'UTC - 0',
        value: 0,
      },
    ]}
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

interface RadioGroupProps {
  onChange: Function;
  radioButtons:
    | Array<RadioCardProps>
    | Array<RadioBarProps>
    | Array<RadioTwoLineBarProps>;
  defaultSelected?: string | null;
  children?: Array<any>;
}

interface RadioGroupState {
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
  placeholder?: string;
  textValue?: string;
}

interface RadioTwoLineBarProps {
  header: string;
  description: string;
  value: string;
  onChange: Function;
  checked?: boolean;
  error?: boolean;
}

interface CheckboxBarProps {
  header: string;
  value: string;
  onChange: Function;
  checked?: boolean;
  error?: boolean;
}

interface CategoryMultiSelectProps {
  sortedGroup: Array<SortedGroup>;
  initialSelected?: Array<string>;
  updateSelection: Function;
}

interface CategoryMultiSelectState {
  groups: Array<SortedGroup>;
  selected: Array<string>;
  values: Array<string>;
}

const defaultMultiSelect = (amount: number, justStrings: boolean = false) => {
  let result = [];
  let item = justStrings ? '' : { value: '' };
  for (let i = 1; i <= amount; i++) {
    result.push(item);
  }
  return result;
};

export class CategoryMultiSelect extends Component<
  CategoryMultiSelectProps,
  CategoryMultiSelectState
> {
  state: CategoryMultiSelectState = {
    groups: this.props.sortedGroup || defaultMultiSelect(3),
    selected: this.props.initialSelected || ['', '', ''],
    values: this.props.initialSelected || ['', '', ''],
  };

  createOptions(sortedGroup) {
    let options = sortedGroup.map(item => ({ label: item.value, value: item.value }));
    options.push({ label: CUSTOM, value: CUSTOM });
    return options;
  }

  findSubgroup(sortedGroup, selection) {
    if (selection === '') return [];
    const selected = sortedGroup.find(item => item.value === selection);
    if (selected && selected.subGroup) {
      return selected.subGroup;
    } else {
      return [];
    }
  }

  createGroups(groups, values) {
    const primaryOptions = this.createOptions(groups);
    const primarySubgroup = this.findSubgroup(groups, values[0]);
    const secondaryOptions = this.createOptions(primarySubgroup);
    const tertiaryOptions = this.createOptions(
      this.findSubgroup(primarySubgroup, values[1])
    );

    return {
      primaryOptions,
      secondaryOptions,
      tertiaryOptions,
    };
  }

  determineVisible(values, secondaryOptions, tertiaryOptions, selected) {
    const showSecondaryDropdown = values[0] !== '' && secondaryOptions.length > 1;
    const showTertiaryDropdown = tertiaryOptions.length > 1 && values[1] !== '';
    const customPrimary = selected[0] === CUSTOM;
    const customSecondary = selected[1] === CUSTOM || !showSecondaryDropdown && customPrimary && values[0] !== '';
    const customTertiary =
      selected[2] === CUSTOM || (!showTertiaryDropdown && values[1] !== '');
    return {
      showSecondaryDropdown,
      showTertiaryDropdown,
      customPrimary,
      customSecondary,
      customTertiary,
    };
  }

  getNewValues(value, position) {
    const { values } = this.state;
    const updatedValues = values;
    updatedValues[position] = value;
    return updatedValues;
  }

  getNewSelected(selection, position) {
    const { selected } = this.state;
    const updatedSelected = selected;
    updatedSelected[position] = selection;
    return updatedSelected;
  }

  onChangeDropdown(choice, position) {
    let value = choice;
    if (choice === CUSTOM) value = '';
    const selected = this.getNewSelected(choice, position);
    const values = this.getNewValues(value, position);
    this.handleUpdate(selected, values);
  }

  handleUpdate(selected, values) {
    const { updateSelection } = this.props;
    this.setState({ selected, values }, () => updateSelection(values));
  }

  render() {
    const { groups, selected, values } = this.state;
    const {
      primaryOptions,
      secondaryOptions,
      tertiaryOptions,
    } = this.createGroups(groups, values);
    const {
      showSecondaryDropdown,
      showTertiaryDropdown,
      customPrimary,
      customSecondary,
      customTertiary,
    } = this.determineVisible(values, secondaryOptions, tertiaryOptions, selected);

    return (
      <ul className={Styles.CategoryMultiSelect}>
        <FormDropdown
          staticLabel="Primary Category"
          onChange={choice => this.onChangeDropdown(choice, 0)}
          options={primaryOptions}
        />
        {customPrimary && (
          <TextInput
            value={values[0]}
            placeholder="Custom Primary Category"
            onChange={v => this.handleUpdate(selected, this.getNewValues(v, 0))}
          />
        )}
        {showSecondaryDropdown && (
          <FormDropdown
            staticLabel="Secondary Category"
            onChange={choice => this.onChangeDropdown(choice, 1)}
            options={secondaryOptions}
          />
        )}
        {customSecondary && (
          <TextInput
            value={values[1]}
            placeholder="Custom Secondary Category"
            onChange={v => this.handleUpdate(selected, this.getNewValues(v, 1))}
          />
        )}
        {showTertiaryDropdown && (
          <FormDropdown
            staticLabel="Tertiary Category"
            onChange={choice => this.onChangeDropdown(choice, 2)}
            options={tertiaryOptions}
          />
        )}
        {customTertiary && (
          <TextInput
            value={values[2]}
            placeholder="Custom Tertiary Category"
            onChange={v => this.handleUpdate(selected, this.getNewValues(v, 2))}
          />
        )}
      </ul>
    );
  }
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

export class RadioBarGroup extends Component<RadioGroupProps, RadioGroupState> {
  state: RadioGroupState = {
    selected: this.props.defaultSelected || null,
  };

  render() {
    const { radioButtons, onChange } = this.props;
    const { selected } = this.state;
    return (
      <div>
        {radioButtons.map(radio => (
          <RadioBar
            key={radio.value}
            {...radio}
            checked={radio.value === selected}
            onChange={selected => {
              onChange(selected);
              this.setState({ selected });
            }}
          />
        ))}
      </div>
    );
  }
}

export const RadioBar = ({
  header,
  onChange,
  checked,
  value,
  error,
  expandable,
  onTextChange,
  placeholder,
  textValue,
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
    {expandable && checked ? (
      <TextInput
        placeholder={placeholder}
        value={textValue}
        onChange={onTextChange}
      />
    ) : null}
  </div>
);

export class RadioTwoLineBarGroup extends Component<
  RadioGroupProps,
  RadioGroupState
> {
  state: RadioGroupState = {
    selected: this.props.defaultSelected || null,
  };

  render() {
    const { radioButtons, onChange } = this.props;
    const { selected } = this.state;
    return (
      <div>
        {radioButtons.map(radio => (
          <RadioTwoLineBar
            key={radio.value}
            {...radio}
            checked={radio.value === selected}
            onChange={selected => {
              onChange(selected);
              this.setState({ selected });
            }}
          />
        ))}
      </div>
    );
  }
}

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
  RadioGroupProps,
  RadioGroupState
> {
  state: RadioGroupState = {
    selected: this.props.defaultSelected || null,
  };

  render() {
    const { radioButtons, onChange, children } = this.props;
    const { selected } = this.state;
    return (
      <div className={Styles.RadioCardGroup}>
        {radioButtons.map(radio => (
          <RadioCard
            key={radio.value}
            {...radio}
            checked={radio.value === selected}
            onChange={selected => {
              onChange(selected);
              this.setState({ selected });
            }}
          />
        ))}
        <div className={Styles.Additional}>{children}</div>
      </div>
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
      [Styles.CustomIcon]: icon,
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

interface LocationDisplayProps {
  currentStep: Number;
  pages: Array<Object>;
}

export const LocationDisplay = ({
  currentStep,
  pages,
}: LocationDisplayProps) => (
  <div className={Styles.LocationDisplay}>
    {pages.map((page: Object, index: Number) => (
      <>
        <span
          className={classNames({ [Styles.Selected]: index === currentStep })}
        >
          {page.title}
        </span>
        {index !== pages.length - 1 && DirectionArrow}
      </>
    ))}
  </div>
);

export class TextInput extends React.Component<TextInputProps, TextInputState> {
  state: TextInputState = {
    value: this.props.value || '',
  };

  componentWillReceiveProps(nextProps: TextInputProps) {
    const { value } = this.props;
    if (value !== nextProps.value) {
      this.setState({ value: nextProps.value });
    }
  }

  onChange = (e: any) => {
    const value = e.target.value;
    this.props.onChange(value);
    this.setState({ value });
  };
  render() {
    const {
      placeholder,
      disabled,
      error,
      errorMessage,
      type,
      trailingLabel,
    } = this.props;

    return (
      <>
        <div className={Styles.TextInput}>
          {type !== 'textarea' ? (
            <input
              {...this.props}
              className={classNames({ [Styles.error]: error })}
              value={this.state.value}
              onChange={this.onChange}
              placeholder={placeholder}
              disabled={disabled}
            />
          ) : (
            <textarea
              {...this.props}
              className={classNames({ [Styles.error]: error })}
              value={this.state.value}
              onChange={this.onChange}
              placeholder={placeholder}
              disabled={disabled}
            />
          )}
          {trailingLabel && <span>{trailingLabel}</span>}
        </div>
        {error && <span className={Styles.ErrorText}>{errorMessage}</span>}
      </>
    );
  }
}

interface TimeSelectorProps {
  minute: string;
  hour: string;
  meridiem: string;
  onFocusChange: Function;
  onDateChange: Function;
  focused?: Boolean;
}

export class TimeSelector extends React.Component<TimeSelectorProps, {}> {
  componentDidMount() {
    window.addEventListener('click', this.handleWindowOnClick);
  }

  componentWillUnmount() {
    window.removeEventListener('click', this.handleWindowOnClick);
  }

  handleWindowOnClick = (event: React.MouseEvent<HTMLElement>) => {
    if (
      this.timeSelector &&
      !this.timeSelector.contains(event.target) &&
      this.props.focused
    ) {
      this.props.onFocusChange(false);
    }
  };

  toggleSelector = () => {
    this.props.onFocusChange(!this.props.focused);
  };

  onChangeMinutes = value => {
    this.props.onChange('minute', value);
  };

  onChangeHours = value => {
    this.props.onChange('hour', value);
  };

  onChangeAM = value => {
    this.props.onChange('meridiem', value);
  };

  render() {
    const { placeholder, hour, minute, meridiem, focused } = this.props;

    return (
      <div
        className={Styles.TimeSelector}
        ref={timeSelector => {
          this.timeSelector = timeSelector;
        }}
      >
        <button onClick={this.toggleSelector}>
          <span>
            {!hour || !minute || !meridiem
              ? 'Time'
              : hour + ':' + minute + ' ' + meridiem}
          </span>
          {Clock}
        </button>
        {focused && (
          <>
            {Arrow}
            <div>
              <IndividualTimeSelector
                label="Hours"
                min={1}
                max={12}
                onChange={this.onChangeHours}
                value={hour !== null ? hour : '12'}
              />
              <span>:</span>
              <IndividualTimeSelector
                label="Minutes"
                showLeadingZero
                min={0}
                max={59}
                onChange={this.onChangeMinutes}
                value={minute !== null ? minute : '12'}
              />
              <IndividualTimeSelector
                label="AM/PM"
                hasOptions
                onChange={this.onChangeAM}
                value={meridiem || 'AM'}
              />
            </div>
          </>
        )}
      </div>
    );
  }
}

interface IndividualTimeSelectorProps {
  hasOptions?: Boolean;
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
    value: this.props.value,
  };

  componentWillReceiveProps(nextProps: IndividualTimeSelectorProps) {
    const { value } = this.props;
    if (value !== nextProps.value) {
      this.setState({ value: nextProps.value });
    }
  }

  onChange = (value: any) => {
    const { showLeadingZero, hasOptions, onChange, min, max } = this.props;

    if (!hasOptions && value.toString() !== '') {
      if (value > max) return;
      if (value < min) return;
    }

    if (
      showLeadingZero &&
      value.toString().length === 1 &&
      value.toString() !== '0'
    ) {
      value = '0' + value;
    } else if (showLeadingZero && value.toString().length > 2) {
      value = value.substring(1);
    }

    this.setState({ value });
    onChange(value);
  };

  increment = () => {
    let value = this.state.value;
    if (!this.props.hasOptions) {
      const newValue = parseFloat(value) + 1;
      this.onChange(newValue);
    } else {
      this.onChange(value === 'AM' ? 'PM' : 'AM');
    }
  };

  decrement = () => {
    let value = this.state.value;
    if (!this.props.hasOptions) {
      const newValue = parseFloat(value) - 1;
      this.onChange(newValue);
    } else {
      this.onChange(value === 'AM' ? 'PM' : 'AM');
    }
  };

  render() {
    const { label, onChange, value, hasOptions, min, max } = this.props;

    return (
      <div className={Styles.IndividualTimeSelector}>
        <span>{label}</span>
        <button onClick={this.increment}>{Chevron}</button>
        {hasOptions && (
          <input
            type="text"
            onChange={e => this.onChange(e.target.value)}
            value={this.state.value}
            disabled
          />
        )}
        {!hasOptions && (
          <input
            type="number"
            min={min}
            max={max}
            step="1"
            onChange={e => this.onChange(e.target.value)}
            value={this.state.value}
          />
        )}
        <button onClick={this.decrement}>{Chevron}</button>
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
      customInputIcon={Calendar}
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
