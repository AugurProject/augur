import type { Getters } from '@augurproject/sdk';
import classNames from 'classnames';

import ChevronFlip from 'modules/common/chevron-flip';
import {
  CATEGORY_PARAM_NAME,
  CUSTOM,
  SCALAR,
  ZERO,
  INVALID_OUTCOME_LABEL
} from 'modules/common/constants';

import Styles from 'modules/common/form.styles.less';
import {
  Arrow,
  Calendar,
  CheckMark,
  Chevron,
  Clock,
  DirectionArrow,
  Ellipsis,
  EmptyCheckbox,
  EmptyRadio,
  ExclamationCircle,
  FilledCheckbox,
  FilledRadio,
  LoadingEllipse,
  OutlineChevron,
  RightAngle,
  SearchIcon,
  XIcon,
} from 'modules/common/icons';
import MarkdownRenderer from 'modules/common/markdown-renderer';
import { NameValuePair, SquareDropdown } from 'modules/common/selection';
import { DisputingButtonView, Subheaders } from 'modules/reporting/common';
import DisputingBondsView
  from 'modules/reporting/containers/disputing-bonds-view';
import ReportingBondsView
  from 'modules/reporting/containers/reporting-bonds-view';
import makeQuery from 'modules/routes/helpers/make-query';
import {
  DisputeInputtedValues,
  MarketData,
  QueryEndpoints,
  SortedGroup,
} from 'modules/types';
import React, { Component, useEffect, useState } from 'react';
import { SingleDatePicker } from 'react-dates';

import 'react-dates/lib/css/_datepicker.css';
import { PulseLoader } from 'react-spinners';
import { BigNumber, createBigNumber } from 'utils/create-big-number';
import debounce from 'utils/debounce';
import { formatAttoRep } from 'utils/format-number';
import { getTimezones, UTC_Default } from 'utils/get-timezones';
import noop from 'utils/noop';

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
  errorMessage?: string;
  condensedStyle?: boolean;
  openTop?: boolean;
  readOnly?: boolean;
}

interface TextInputProps {
  type?: string;
  errorMessage?: string;
  disabled?: boolean;
  placeholder?: string;
  onChange: Function;
  value?: string;
  maxLength?: number;
  trailingLabel?: string;
  innerLabel?: string;
  autoCompleteList?: SortedGroup[];
  onAutoCompleteListSelected?: Function;
  hideTrailingOnMobile?: boolean;
  openTop?: boolean;
}

interface TextInputState {
  value: string;
  showList: boolean;
}

interface InputDropdownProps {
  onChange: Function;
  default: string;
  options: string[];
  isMobileSmall?: boolean;
  label: string;
  className?: string;
  onKeyPress?: Function;
}

interface InputDropdownState {
  label: string;
  value: string;
  showList: boolean;
  selected: boolean;
}

interface FormDropdownProps {
  id?: string;
  onChange: any;
  className?: string;
  sort?: boolean;
  defaultValue?: string | number;
  options: NameValuePair[];
  staticLabel?: string;
  disabled?: boolean;
  error?: boolean;
  errorMessage?: string;
  openTop?: boolean;
}

export const FormDropdown = (props: FormDropdownProps) => (
  <div className={Styles.FormDropdown}>
    <SquareDropdown
      {...props}
      className={classNames({
        [Styles.disabled]: props.disabled,
        [Styles.error]:
          props.errorMessage &&
          props.errorMessage !== '' &&
          props.errorMessage.length > 0,
      })}
      activeClassName={Styles.FormDropdownActive}
    />
    {props.errorMessage &&
      props.errorMessage !== '' &&
      props.errorMessage.length > 0 && (
        <span className={Styles.ErrorText}>{props.errorMessage}</span>
      )}
  </div>
);

interface TimezoneDropdownProps {
  id?: string;
  onChange: any;
  className?: string;
  autoCompleteList?: SortedGroup[];
  disabled?: boolean;
  timestamp?: number;
  timezone: string;
  condensedStyle?: boolean;
  openTop?: boolean;
}

export const TimezoneDropdown = (props: TimezoneDropdownProps) => {
  const [value, setValue] = useState(
    props.timezone ? props.timezone : UTC_Default
  );
  const [timezones, setTimezones] = useState(getTimezones(props.timestamp));
  useEffect(() => {
    props.timezone ? setValue(props.timezone) : setValue(UTC_Default);
    setTimezones(getTimezones(props.timestamp));
  }, [props.timezone, props.timestamp]);

  return (
    <section
      className={classNames(Styles.Timezones, {
        [Styles.Condensed]: props.condensedStyle,
      })}
    >
      <TextInput
        value={value === UTC_Default ? '' : value}
        placeholder={UTC_Default}
        disabled={props.disabled}
        autoCompleteList={timezones.timezones}
        onChange={() => {}}
        openTop={props.openTop}
        onAutoCompleteListSelected={timezone => {
          const parse = /\(UTC (.*)\)/i;
          if (timezone !== '') {
            const offset = timezone.match(parse)[1];
            const offsetName = timezone.split(')')[1].trim();
            props.onChange(offsetName, offset, timezone);
          } else {
            props.onChange(null, 0, null);
          }
          setValue(timezone);
        }}
      />
    </section>
  );
};

interface ErrorProps {
  header?: string;
  subheader?: string;
  alternate?: boolean;
}

export const Error = (props: ErrorProps) => (
  <section
    className={classNames(Styles.ErrorLabel, {
      [Styles.Alternate]: props.alternate,
    })}
  >
    {!props.alternate && ExclamationCircle}
    <div>
      <span>{props.header}</span>
      <span>{props.subheader}</span>
    </div>
  </section>
);

export interface BaseRadioButtonProp {
  id: string;
  checked: boolean;
  value?: string;
}
export interface RadioCardProps extends BaseRadioButtonProp {
  header: string;
  description: string;
  onChange?: Function;
  icon?: JSX.Element;
  useIconColors?: boolean;
  inverseFill?: boolean;
}

interface RadioGroupProps {
  id: string;
  onChange: Function;
  radioButtons: BaseRadioButtonProp[];
  market?: MarketData;
  defaultSelected?: string | null;
  children?: any[];
  reportAction: Function;
  inputtedReportingStake?: DisputeInputtedValues;
  updateInputtedStake?: Function;
  updateScalarOutcome?: Function;
  inputScalarOutcome?: string;
  stake?: Getters.Markets.StakeDetails;
  userCurrentDisputeRound:
    | Getters.Accounts.UserCurrentOutcomeDisputeStake[]
    | [];
  hideRadioButton?: boolean;
  disabled?: boolean;
}

export interface RadioGroupState {
  selected: string | null;
}

export interface RadioBarProps extends BaseRadioButtonProp {
  header: string;
  onChange?: Function;
  expandable?: boolean;
  error?: boolean;
  onTextChange?: Function;
  placeholder?: string;
  textValue?: string;
  errorMessage?: string;
  multiSelect?: boolean;
  disabled?: boolean;
}

export interface ReportingRadioBarProps extends BaseRadioButtonProp {
  market: MarketData;
  header: string;
  updateChecked?: Function;
  expandable?: boolean;
  error?: boolean;
  stake: Getters.Markets.StakeDetails | null;
  isInvalid?: boolean;
  inputtedReportingStake?: DisputeInputtedValues;
  updateInputtedStake?: Function;
  reportAction: Function;
  updateScalarOutcome?: Function;
  inputScalarOutcome?: string;
  userOutcomeCurrentRoundDispute: Getters.Accounts.UserCurrentOutcomeDisputeStake | null;
  hideButton?: boolean;
  isDisputing: boolean;
  isWarpSync: boolean;
}

export interface RadioTwoLineBarProps extends BaseRadioButtonProp {
  header: string;
  description: string;
  onChange: Function;
  error?: boolean;
  hideRadioButton?: boolean;
  renderMarkdown?: boolean;
}

interface CheckboxBarProps extends BaseRadioButtonProp {
  header: string;
  onChange: Function;
  error?: boolean;
}

interface CategoryMultiSelectProps {
  sortedGroup: SortedGroup[];
  initialSelected?: string[];
  initialValues?: string[];
  updateSelection: Function;
  errorMessage?: string[];
  disableCategory?: boolean;
  disableSubCategory?: boolean;
  disableTertiaryCategory?: boolean;
}

interface CategoryMultiSelectState {
  groups: SortedGroup[];
  selected: string[];
  values: string[];
}

interface DropdownInputGroupProps {
  defaultValue?: string;
  staticLabel?: string;
  onChangeDropdown: Function;
  autoCompleteList?: SortedGroup[];
  options: NameValuePair[];
  errorMessage?: string;
  value: string;
  placeholder?: string;
  onChangeInput: Function;
  showText: boolean;
  showIcon: boolean;
  showDropdown: boolean;
  disabled: boolean;
  removable?: boolean;
}

const defaultMultiSelect = (amount: number, justStrings = false) => {
  const result = [];
  const item = justStrings ? '' : { value: '' };
  for (let i = 1; i <= amount; i++) {
    result.push(item);
  }
  return result;
};

export const createGroups = (
  groups: SortedGroup[],
  values: string[],
  selected: string[]
) => {
  const primaryOptions = createOptions(groups, selected[0]);
  const primarySubgroup = findSubgroup(groups, values[0]);
  const secondaryCustom = selected[1] === CUSTOM;
  const secondaryAutoComplete = secondaryCustom
    ? findAutoComplete(primarySubgroup, CUSTOM)
    : findAutoComplete(primarySubgroup, values[0]);
  const secondaryOptions = createOptions(primarySubgroup, selected[1]);
  const tertiaryAutoComplete = secondaryCustom
    ? findAutoComplete(secondaryAutoComplete, values[1])
    : findAutoComplete(primarySubgroup, values[1]);
  const tertiaryOptions = createOptions(
    findSubgroup(primarySubgroup, values[1]),
    selected[2]
  );

  return {
    primaryOptions,
    secondaryOptions,
    secondaryAutoComplete,
    tertiaryOptions,
    tertiaryAutoComplete,
  };
};

export const determineVisible = (
  values: string[],
  primaryOptions: NameValuePair[],
  secondaryOptions: NameValuePair[],
  tertiaryOptions: NameValuePair[],
  disableSubCategory: boolean,
  disabledTertiary: boolean,
  selected: string[]
) => {
  const showSecondaryDropdown = values[0] !== '' && secondaryOptions.length > 0;
  const showTertiaryDropdown = tertiaryOptions.length > 0 && values[1] !== '' && !values[2];
  const customPrimary =
    selected[0] === CUSTOM ||
    (selected[0] &&
      !primaryOptions.map(option => option.value).includes(selected[0]));
  const customSecondary =
    selected[1] === CUSTOM ||
    (selected[1] &&
      !disableSubCategory &&
      !secondaryOptions.map(option => option.value).includes(selected[1])) ||
    (!showSecondaryDropdown && customPrimary && values[0] !== '');
  const customTertiary =
    selected[2] === CUSTOM ||
    (selected[2] &&
      !disabledTertiary &&
      !tertiaryOptions.map(option => option.value).includes(selected[2])) ||
    (!showTertiaryDropdown && values[1] !== '') || values[2];
  return {
    showSecondaryDropdown,
    showTertiaryDropdown,
    customPrimary,
    customSecondary,
    customTertiary,
  };
};

export const getNewValues = (
  value: string,
  position: number,
  values: string[]
) => {
  const updatedValues = [...values];
  updatedValues[position] = value;
  return updatedValues;
};

export const getNewSelected = (
  selection: string,
  position: number,
  selected: string[]
) => {
  const updatedSelected = [...selected];
  updatedSelected[position] = selection;
  return updatedSelected;
};

export const createOptions = (sortedGroup: SortedGroup, selected: string) => {
  const options = sortedGroup.map(({ label, value }) => ({
    label,
    value,
    selected: selected === value,
  }));
  return options;
};

export const findSubgroup = (sortedGroup: SortedGroup, selection: string) => {
  if (selection === '') return [];
  const selected = sortedGroup.find(item => item.value === selection);
  if (selected && selected.subGroup) {
    return selected.subGroup;
  } else {
    return [];
  }
};

export const findAutoComplete = (
  sortedGroup: SortedGroup,
  selection: string
) => {
  if (selection === '') return [];
  const selected = sortedGroup.find(item => item.value === selection);
  if (selected && selected.autoCompleteList) {
    return selected.autoCompleteList;
  } else {
    return [];
  }
};

export const DropdownInputGroup = ({
  defaultValue,
  staticLabel,
  onChangeDropdown,
  options,
  autoCompleteList,
  errorMessage,
  value,
  placeholder,
  onChangeInput,
  showText,
  showIcon,
  showDropdown,
  disabled,
  removable,
}: DropdownInputGroupProps) => (
  <li>
    {showIcon && RightAngle}
    {showDropdown && (
      <FormDropdown
        defaultValue={showText ? CUSTOM : defaultValue}
        staticLabel={staticLabel}
        onChange={onChangeDropdown}
        options={options}
        errorMessage={errorMessage}
        disabled={disabled}
      />
    )}
    {showText && (
      <TextInput
        value={value}
        placeholder={placeholder}
        autoCompleteList={autoCompleteList}
        onChange={onChangeInput}
        errorMessage={!showDropdown ? errorMessage : ''}
        onAutoCompleteListSelected={null}
        disabled={disabled}
      />
    )}
    {removable && !disabled && value !== '' && !showText && (
      <button
        onClick={e => {
          if (showText) {
            onChangeInput('');
          } else if (showDropdown) {
            onChangeDropdown('');
          }
        }}
      >
        {XIcon}
      </button>
    )}
  </li>
);

interface CategorySingleSelectProps {
  options: NameValuePair[];
  autoCompleteList?: NameValuePair[];
  initialSelected?: string;
  initialValue?: string;
  updateSelection: Function;
  errorMessage?: string;
  staticLabel?: string;
  placeholder?: string;
  disabled?: boolean;
  showDropdown?: boolean;
}

interface CategorySingleSelectState {
  selected: string;
  value: string;
  showText: boolean;
}

export class CategorySingleSelect extends Component<
  CategorySingleSelectProps,
  CategorySingleSelectState
> {
  state: CategorySingleSelectState = {
    selected: this.props.initialSelected || '',
    value:
      this.props.initialValue ||
      (this.props.initialSelected === CUSTOM
        ? ''
        : this.props.initialSelected || ''),
    showText: this.props.initialSelected === CUSTOM,
  };

  componentDidUpdate(prevProps) {
    if (this.props.initialSelected !== prevProps.initialSelected) {
      this.handleUpdate(this.props.initialSelected, this.props.initialValue);
    }
  }

  onChangeDropdown(choice) {
    let value = choice;
    if (choice === CUSTOM) value = '';
    if (choice === '') {
      value = '';
    }
    this.handleUpdate(choice, value);
  }

  handleUpdate(selected, value) {
    const { updateSelection } = this.props;
    this.setState({ selected, value, showText: selected === CUSTOM }, () =>
      updateSelection(value)
    );
  }

  render() {
    const {
      options,
      errorMessage,
      staticLabel,
      placeholder,
      autoCompleteList,
      disabled,
      showDropdown,
    } = this.props;
    const { selected, value, showText } = this.state;
    return (
      <ul className={Styles.CategoryMultiSelect}>
        <DropdownInputGroup
          defaultValue={selected}
          staticLabel={staticLabel}
          onChangeDropdown={choice => this.onChangeDropdown(choice)}
          options={options}
          errorMessage={errorMessage}
          value={value}
          placeholder={placeholder}
          onChangeInput={v => this.handleUpdate(selected, v)}
          showText={showText}
          showDropdown={showDropdown || options.length > 0}
          autoCompleteList={autoCompleteList}
          disabled={disabled}
        />
      </ul>
    );
  }
}

export class CategoryMultiSelect extends Component<
  CategoryMultiSelectProps,
  CategoryMultiSelectState
> {
  state: CategoryMultiSelectState = {
    groups: this.props.sortedGroup || defaultMultiSelect(3),
    selected: this.props.initialSelected || ['', '', ''],
    values: this.props.initialValues ||
      this.props.initialSelected || ['', '', ''],
  };

  onChangeDropdown(choice, position) {
    let value = choice;
    if (choice === CUSTOM) value = '';
    if (choice === '') {
      value = '';
    }

    // Reset children categories when parents is changed
    const clearAllChildren = (category, idx) => {
      if (idx > position) {
        return '';
      }
      return category;
    };

    const selected = getNewSelected(choice, position, this.state.selected).map(
      clearAllChildren
    );
    const values = getNewValues(value, position, this.state.values).map(
      clearAllChildren
    );
    this.handleUpdate(selected, values);
  }

  handleUpdate(selected, values) {
    const { updateSelection } = this.props;
    this.setState({ selected, values }, () => updateSelection(values));
  }

  render() {
    const {
      errorMessage,
      disableCategory,
      disableSubCategory,
      disableTertiaryCategory,
    } = this.props;
    const { groups, selected, values } = this.state;
    const {
      primaryOptions,
      secondaryOptions,
      secondaryAutoComplete,
      tertiaryOptions,
      tertiaryAutoComplete,
    } = createGroups(groups, values, selected);
    const {
      showSecondaryDropdown,
      showTertiaryDropdown,
      customPrimary,
      customSecondary,
      customTertiary,
    } = determineVisible(
      values,
      primaryOptions,
      secondaryOptions,
      tertiaryOptions,
      disableSubCategory,
      disableTertiaryCategory,
      selected
    );
    const tertiaryDefault = selected[2] || (!disableTertiaryCategory && tertiaryOptions.length > 0) ? (tertiaryOptions[0]?.label || tertiaryOptions[0]) : null;
    if (tertiaryDefault && !selected[2]) this.onChangeDropdown(tertiaryDefault, 2)
    return (
      <ul
        className={classNames(Styles.CategoryMultiSelect, {
          [Styles.CustomPrimary]: customPrimary,
          [Styles.CustomTertiary]: customTertiary,
        })}
      >
        <DropdownInputGroup
          defaultValue={selected[0]}
          staticLabel="Primary Category"
          onChangeDropdown={choice => this.onChangeDropdown(choice, 0)}
          options={primaryOptions}
          errorMessage={errorMessage && errorMessage[0]}
          value={values[0]}
          placeholder="Enter Custom Category"
          onChangeInput={v =>
            this.handleUpdate(selected, getNewValues(v, 0, values))
          }
          showText={customPrimary}
          showIcon={false}
          showDropdown={true}
          disabled={disableCategory}
        />
        {(showSecondaryDropdown || customSecondary) && (
          <DropdownInputGroup
            defaultValue={selected[1]}
            staticLabel="Secondary Category"
            onChangeDropdown={choice => this.onChangeDropdown(choice, 1)}
            options={secondaryOptions}
            errorMessage={errorMessage && errorMessage[1]}
            value={values[1]}
            placeholder="Custom Secondary Category"
            onChangeInput={v =>
              this.handleUpdate(selected, getNewValues(v, 1, values))
            }
            showText={customSecondary}
            showIcon={showSecondaryDropdown || customSecondary}
            showDropdown={showSecondaryDropdown}
            autoCompleteList={secondaryAutoComplete}
            disabled={disableSubCategory}
          />
        )}
        {(showTertiaryDropdown || customTertiary) && (
          <DropdownInputGroup
            defaultValue={tertiaryDefault}
            staticLabel="Sub Category"
            onChangeDropdown={choice => this.onChangeDropdown(choice, 2)}
            options={tertiaryOptions}
            errorMessage={errorMessage && errorMessage[2]}
            value={values[2]}
            placeholder="Custom Sub Category"
            onChangeInput={v =>
              this.handleUpdate(selected, getNewValues(v, 2, values))
            }
            showText={customTertiary}
            showIcon={showTertiaryDropdown || customTertiary}
            showDropdown={showTertiaryDropdown}
            autoCompleteList={tertiaryAutoComplete}
            removable
            disabled={disableTertiaryCategory}
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

interface ReportingRadioGroupProps {
  market: MarketData;
  radioButtons: ReportingRadioBarProps[];
  selected: string | null;
  updateChecked: Function;
  reportAction: Function;
  inputtedReportingStake?: DisputeInputtedValues;
  updateInputtedStake?: Function;
  updateScalarOutcome?: Function;
  inputScalarOutcome?: string;
  userCurrentDisputeRound: Getters.Accounts.UserCurrentOutcomeDisputeStake[];
  isDisputing: boolean;
}

export const ReportingRadioBarGroup = ({
  market,
  radioButtons,
  selected,
  updateChecked,
  reportAction,
  inputtedReportingStake,
  updateInputtedStake,
  inputScalarOutcome,
  updateScalarOutcome,
  userCurrentDisputeRound,
  isDisputing,
}: ReportingRadioGroupProps) => {
  const { disputeInfo } = market;
  const tentativeWinning = radioButtons.find(
    radioButton => radioButton.stake.tentativeWinning
  );
  let winningStakeCurrent = '0';
  let notNewTentativeWinner = false;
  let remainingState = '0';
  if (tentativeWinning) {
    const winning = disputeInfo.stakes.find(s => s.tentativeWinning);
    const disputeOutcome = disputeInfo.stakes.find(s => s.outcome === selected);
    if (disputeOutcome) {
      notNewTentativeWinner = createBigNumber(winning.stakeCurrent).gt(
        disputeOutcome.bondSizeCurrent
      );
      // double pre-filled to make new outcome tentative winner.
      winningStakeCurrent = formatAttoRep(
        createBigNumber(winning.stakeCurrent).times(2)
      ).formatted;
      remainingState = formatAttoRep(disputeOutcome.stakeRemaining).formatted;
    }
  }

  let headerText = !isDisputing ? 'Outcomes' : 'Other Outcomes';
  let subheaderText =   !isDisputing
    ? 'Select which outcome occurred. If you select what is deemed an incorrect outcome, you will lose your stake.'
    : 'If the Tentative Winning Outcome is incorrect, select the outcome you believe to be correct in order to stake in its favor. You will lose your entire stake if the outcome you select is disputed and does not end up as the winning outcome.';
  if (market.isForking) {
    subheaderText = 'Once chosen you will be asked to migrate all your REP across to this outcome’s new universe. Please be aware that migrating REP is a one way operation and once migrated you can not move your REP to another universe generated by the other outcomes of this Fork.';
    headerText = 'Choose carefully the outcome you believe to be correct.';
  }
  return (
    <div className={Styles.ReportingRadioBarGroup}>
      {isDisputing && tentativeWinning && (
        <section>
          <span>Tentative Outcome</span>
          <span>
            Believe this is the correct outcome? Any REP you stake here will go
            toward disputing in its favor, in the event that it is no longer the
            Tentative Winner.
          </span>
          <ReportingRadioBar
            market={market}
            expandable
            {...tentativeWinning}
            inputtedReportingStake={inputtedReportingStake}
            inputScalarOutcome={inputScalarOutcome}
            updateInputtedStake={updateInputtedStake}
            isInvalid={tentativeWinning.isInvalid}
            updateScalarOutcome={updateScalarOutcome}
            updateChecked={(selected, isInvalid) => {
              updateChecked(selected, isInvalid);
            }}
            reportAction={reportAction}
            userOutcomeCurrentRoundDispute={userCurrentDisputeRound.find(
              d => d.outcome === String(tentativeWinning.value)
            )}
            hideButton={disputeInfo.disputePacingOn}
            isDisputing={isDisputing}
            isWarpSync={market.isWarpSync}
          />
        </section>
      )}
      <span>{headerText}</span>
      <span>
        {subheaderText}
      </span>
      {isDisputing &&
        notNewTentativeWinner &&
        tentativeWinning.id !== selected && (
          <Error
            header={`Filling this bond of ${remainingState} REP only completes this current round`}
            subheader={`${winningStakeCurrent} additional REP will still be needed to make it Tentative Winning Outcome. This will require an additional transaction.`}
          />
        )}
      {radioButtons.map(
        (radio, index) =>
          !radio.isInvalid &&
          (!isDisputing || !radio.stake.tentativeWinning) && (
            <ReportingRadioBar
              market={market}
              key={`${index}${radio.value}`}
              expandable
              {...radio}
              updateChecked={(selected, isInvalid) => {
                updateChecked(selected, isInvalid);
              }}
              reportAction={reportAction}
              inputScalarOutcome={inputScalarOutcome}
              updateScalarOutcome={updateScalarOutcome}
              inputtedReportingStake={inputtedReportingStake}
              updateInputtedStake={updateInputtedStake}
              userOutcomeCurrentRoundDispute={userCurrentDisputeRound.find(
                d => d.outcome === String(radio.value)
              )}
              isDisputing={isDisputing}
              isWarpSync={market.isWarpSync}
            />
          )
      )}
      {!market.isWarpSync && (
        <span>
          {!isDisputing
            ? "Select Invalid if you believe this market's outcome was ambiguous or unverifiable."
            : 'If you believe this market to be invalid, you can help fill the dispute bond of the official Invalid outcome below to make Invalid the new Tentative Outcome. Please check the resolution details  above carefully.'}
        </span>
      )}
      {radioButtons.map(
        (radio, index) =>
          ((!market.isForking && !radio.stake.tentativeWinning && radio.isInvalid) ||
          (market.isForking && radio.isInvalid)) && (
            <ReportingRadioBar
              market={market}
              key={`${index}${radio.value}`}
              expandable
              {...radio}
              updateChecked={(selected, isInvalid) => {
                updateChecked(selected, isInvalid);
              }}
              reportAction={reportAction}
              inputScalarOutcome={inputScalarOutcome}
              updateScalarOutcome={updateScalarOutcome}
              inputtedReportingStake={inputtedReportingStake}
              updateInputtedStake={updateInputtedStake}
              userOutcomeCurrentRoundDispute={userCurrentDisputeRound.find(
                d => d.outcome === String(radio.value)
              )}
              isDisputing={isDisputing}
              isWarpSync={market.isWarpSync}
            />
          )
      )}
    </div>
  );
};

export class RadioBarGroup extends Component<RadioGroupProps, RadioGroupState> {
  state: RadioGroupState = {
    selected: this.props.defaultSelected || null,
  };

  componentDidUpdate(prevProps: RadioGroupProps, prevState: RadioGroupState) {
    if (this.props.defaultSelected !== prevProps.defaultSelected) {
      this.updateChecked(this.props.defaultSelected);
    }
  }

  updateChecked = selected => {
    this.props.onChange(selected);
    this.setState({ selected });
  };

  render() {
    const { radioButtons } = this.props;
    const { selected } = this.state;
    return (
      <div className={Styles.RadioBarGroup}>
        {radioButtons.map(radio => (
          <RadioBar
            key={radio.value}
            {...radio}
            checked={radio.value === selected}
            onChange={selected => {
              this.props.onChange(selected);
              this.setState({ selected });
            }}
          />
        ))}
      </div>
    );
  }
}

export class ReportingRadioBar extends Component<ReportingRadioBarProps, {}> {
  render() {
    const {
      id,
      market,
      header,
      updateChecked,
      checked,
      error,
      isInvalid,
      inputtedReportingStake,
      updateInputtedStake,
      reportAction,
      inputScalarOutcome,
      updateScalarOutcome,
      userOutcomeCurrentRoundDispute,
      hideButton,
      isDisputing,
      isWarpSync,
    } = this.props;

    let { stake } = this.props;
    const { disputeInfo, marketType } = market;
    const isScalar = marketType === SCALAR;
    if (isScalar) {
      for (const index in disputeInfo.stakes) {
        if (disputeInfo.stakes[index].outcome === inputScalarOutcome) {
          stake = disputeInfo.stakes[index];
        }
      }
      // Set default values if outcome has not received stake
      if (!stake) {
        stake = disputeInfo.stakes.find(s => s.outcome === null);
      }
    }
    if (stake && stake.stakeCurrent === '-') stake.stakeCurrent = '0';
    const fullBond =
      stake && inputtedReportingStake
        ? createBigNumber(stake.stakeCurrent).plus(
            inputtedReportingStake.inputToAttoRep || ZERO
          )
        : '0';

    return (
      <div
        className={classNames(Styles.ReportingRadioBar, {
          [Styles.RadioBarError]: error,
          [Styles.Invalid]: isInvalid,
          [Styles.Checked]: checked,
          [Styles.Hide]: hideButton,
        })}
        role="button"
        onClick={e => {
          !checked && !hideButton && updateChecked(id, isInvalid);
        }}
      >
        {checked ? FilledRadio : EmptyRadio}
        <h5>{isInvalid ? INVALID_OUTCOME_LABEL : header}</h5>
        <div onClick={e => e.stopPropagation()}>
          {isDisputing && ( // for disputing or for scalar
            <>
              {!stake.tentativeWinning && checked && (
                <DisputingButtonView
                  stakeCurrent={formatAttoRep(
                    createBigNumber(stake.stakeCurrent).minus(
                      createBigNumber(
                        userOutcomeCurrentRoundDispute
                          ? userOutcomeCurrentRoundDispute.userStakeCurrent
                          : ZERO
                      )
                    )
                  )}
                  bondSizeCurrent={formatAttoRep(stake.bondSizeCurrent)}
                  inputtedStake={formatAttoRep(
                    inputtedReportingStake &&
                      inputtedReportingStake.inputToAttoRep &&
                      checked
                      ? inputtedReportingStake.inputToAttoRep
                      : ZERO
                  )}
                  userValue={
                    userOutcomeCurrentRoundDispute
                      ? formatAttoRep(
                          userOutcomeCurrentRoundDispute.userStakeCurrent
                        )
                      : formatAttoRep(ZERO)
                  }
                  fullBond={formatAttoRep(fullBond)}
                />
              )}
              {stake && stake.tentativeWinning && (
                <div className={Styles.PreFilled}>
                  <Subheaders
                    header="pre-filled stake"
                    subheader={formatAttoRep(stake.stakeCurrent || ZERO).full}
                    info
                    tooltipText="Users can add extra support for a Tentative Winning Outcome"
                  />
                  {userOutcomeCurrentRoundDispute && (
                    <Subheaders
                      header="My contribution:"
                      subheader={
                        formatAttoRep(
                          userOutcomeCurrentRoundDispute.userStakeCurrent ||
                            ZERO
                        ).full
                      }
                    />
                  )}
                </div>
              )}
              {checked && (
                <DisputingBondsView
                  market={market}
                  id={id}
                  isInvalid={isInvalid}
                  inputScalarOutcome={inputScalarOutcome}
                  updateScalarOutcome={updateScalarOutcome}
                  stakeValue={inputtedReportingStake.inputStakeValue}
                  updateInputtedStake={updateInputtedStake}
                  stakeRemaining={stake && stake.stakeRemaining}
                  tentativeWinning={stake && stake.tentativeWinning}
                  reportAction={reportAction}
                  isWarpSync={isWarpSync}
                />
              )}
            </>
          )}
          {!isDisputing && checked && (
            <ReportingBondsView
              market={market}
              id={id}
              inputScalarOutcome={inputScalarOutcome}
              updateScalarOutcome={updateScalarOutcome}
              reportAction={reportAction}
              inputtedReportingStake={inputtedReportingStake}
              updateInputtedStake={updateInputtedStake}
            />
          )}
        </div>
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
  errorMessage,
  multiSelect,
  disabled,
}: RadioBarProps) => (
  <div
    className={classNames(Styles.RadioBar, {
      [Styles.Checked]: checked,
      [Styles.RadioBarExpanded]: checked && expandable,
      [Styles.RadioBarError]: error,
      [Styles.MultiSelect]: multiSelect,
      [Styles.Disabled]: disabled,
    })}
    role="button"
    onClick={e => onChange(value)}
  >
    {multiSelect && <Checkbox isChecked={checked} />}
    {!multiSelect && (checked ? FilledRadio : EmptyRadio)}
    <span>{header}</span>
    {expandable && checked ? (
      <>
        <TextInput
          placeholder={placeholder}
          value={textValue}
          onChange={onTextChange}
          errorMessage={errorMessage}
        />
      </>
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

  componentDidUpdate(prevProps: RadioGroupProps) {
    if (this.props.defaultSelected !== prevProps.defaultSelected) {
      this.updateChecked(this.props.defaultSelected);
    }
  }

  updateChecked = selected => {
    this.props.onChange(selected);
    this.setState({ selected });
  };

  render() {
    const { radioButtons, onChange, hideRadioButton } = this.props;
    const { selected } = this.state;
    return (
      <div>
        {radioButtons.map(radio => (
          <RadioTwoLineBar
            key={radio.value}
            {...radio}
            checked={radio.value === selected}
            hideRadioButton={hideRadioButton}
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
  hideRadioButton,
  renderMarkdown,
}: RadioTwoLineBarProps) => (
  <div
    className={classNames(Styles.RadioTwoLineBar, {
      [Styles.RadioBarError]: error,
      [Styles.HideRadioButton]: hideRadioButton,
      [Styles.Checked]: checked,
      [Styles.RenderMarkdown]: !!renderMarkdown,
    })}
    role="button"
    onClick={e => onChange(value)}
  >
    {!hideRadioButton && (checked ? FilledRadio : EmptyRadio)}
    <h5>{header}</h5>
    {renderMarkdown && (
      <MarkdownRenderer hideLabel noPrewrap text={description} />
    )}
    {!renderMarkdown && <p>{description}</p>}
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
  useIconColors = false,
  inverseFill = false,
}: RadioCardProps) => (
  <div
    className={classNames(Styles.RadioCard, {
      [Styles.RadioCardActive]: checked,
      [Styles.CustomIcon]: icon && !useIconColors,
      [Styles.InverseFill]: icon && inverseFill
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
  currentStep: number;
  pages: Array<{}>;
}

export class LocationDisplay extends React.Component<LocationDisplayProps, {}> {
  scrollTo: any = null;
  container: any = null;

  componentDidUpdate() {
    this.container.scrollLeft = this.scrollTo.offsetLeft / 2;
  }

  render() {
    const { pages, currentStep } = this.props;

    return (
      <div
        className={Styles.LocationDisplay}
        ref={container => {
          this.container = container;
        }}
      >
        {pages.map((page: Object, index: Number) => (
          <React.Fragment key={index}>
            <span
              className={classNames({
                [Styles.Selected]: index === currentStep,
              })}
              ref={scrollTo => {
                if (index === currentStep) {
                  this.scrollTo = scrollTo;
                }
              }}
            >
              {page.title}
            </span>
            {index !== pages.length - 1 && DirectionArrow}
          </React.Fragment>
        ))}
      </div>
    );
  }
}

export class TextInput extends React.Component<TextInputProps, TextInputState> {
  static defaultProps = {
    onAutoCompleteListSelected: () => {},
  };

  state: TextInputState = {
    value: this.props.value === undefined ? '' : this.props.value,
    showList: false,
  };
  refDropdown: any = null;

  componentDidMount() {
    window.addEventListener('click', this.handleWindowOnClick);
  }

  componentDidUpdate(prevProps: TextInputProps, prevState: TextInputState) {
    const { value } = prevProps;
    if (value !== this.props.value) {
      this.setState({ value: this.props.value });
    }
  }

  componentWillUnmount() {
    window.removeEventListener('click', this.handleWindowOnClick);
  }

  handleWindowOnClick = (event: React.MouseEvent<HTMLElement>) => {
    if (this.refDropdown && !this.refDropdown.contains(event.target)) {
      this.setState({ showList: false });
    }
  };

  toggleList = () => {
    let value = this.state.value;
    const showList = this.props.autoCompleteList && !this.state.showList;
    if (showList) {
      value = '';
    }
    this.setState(
      {
        value,
        showList,
      },
      () => {
        if (showList) {
          !!this.props.onAutoCompleteListSelected
            ? this.props.onAutoCompleteListSelected(value)
            : this.props.onChange(value);
        }
      }
    );
  };

  debounceOnChange = debounce(
    (value) => this.props.onChange(value),
    500
  );

  onChange = (e: any) => {
    const value = e.target.value;
    this.debounceOnChange(value);
    this.setState({ value });
  };

  onAutoCompleteSelect = value => {
    !!this.props.onAutoCompleteListSelected
      ? this.props.onAutoCompleteListSelected(value)
      : this.props.onChange(value);

    this.setState({ value, showList: false });
  };

  render() {
    const {
      placeholder,
      disabled,
      errorMessage,
      type,
      trailingLabel,
      innerLabel,
      maxLength,
      hideTrailingOnMobile,
      openTop,
    } = this.props;
    const { autoCompleteList = [] } = this.props;
    const { showList } = this.state;

    const filteredList = autoCompleteList.filter(item =>
      item.label.toLowerCase().includes(this.state.value.toLowerCase())
        ? item
        : null
    );
    const error =
      errorMessage && errorMessage !== '' && errorMessage.length > 0;

    return (
      <div className={Styles.TextInput}>
        <div
          ref={dropdown => {
            this.refDropdown = dropdown;
          }}
        >
          {type !== 'textarea' ? (
            <>
              <input
                className={classNames({ [Styles.error]: error })}
                value={this.state.value}
                onChange={this.onChange}
                onFocus={() => this.toggleList()}
                placeholder={placeholder}
                disabled={disabled}
                maxLength={maxLength}
              />
              {innerLabel && <span className={Styles.Inner}>{innerLabel}</span>}
              <div
                className={classNames(Styles.AutoCompleteList, {
                  [Styles.active]: showList,
                  [Styles.OpenTop]: openTop,
                })}
              >
                {filteredList.map(item => (
                  <button
                    key={`${item.value}${item.label}`}
                    value={item.value}
                    onClick={() => this.onAutoCompleteSelect(item.value)}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </>
          ) : (
            <textarea
              className={classNames({ [Styles.error]: error })}
              value={this.state.value}
              onChange={this.onChange}
              placeholder={placeholder}
              disabled={disabled}
            />
          )}
          {trailingLabel && (
            <span
              className={classNames(Styles.Trailing, {
                [Styles.Hide]: hideTrailingOnMobile,
              })}
            >
              {trailingLabel}
            </span>
          )}
        </div>
        {error && <span className={Styles.ErrorText}>{errorMessage}</span>}
      </div>
    );
  }
}

interface TimeSelectorProps {
  minute: string;
  hour: string;
  meridiem: string;
  onFocusChange: Function;
  onDateChange: Function;
  focused?: boolean;
  errorMessage?: string;
  uniqueKey?: string;
  condensedStyle?: boolean;
  openTop?: boolean;
  disabled?: boolean;
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
    const {
      placeholder,
      hour,
      minute,
      meridiem,
      focused,
      errorMessage,
      uniqueKey,
      condensedStyle,
      openTop,
      disabled,
    } = this.props;
    const error =
      errorMessage && errorMessage !== '' && errorMessage.length > 0;

    return (
      <div
        key={`timeSelector${uniqueKey}`}
        className={classNames(Styles.TimeSelector, {
          [Styles.Condensed]: condensedStyle,
          [Styles.Default]: !hour || !minute || !meridiem,
          [Styles.OpenTop]: openTop,
          [Styles.Disabled]: disabled,
        })}
        ref={timeSelector => {
          this.timeSelector = timeSelector;
        }}
      >
        <button
          onClick={this.toggleSelector}
          disabled={disabled}
          className={classNames({ [Styles.error]: error })}
        >
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
                value={minute !== null ? minute : '00'}
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
        {error && <span className={Styles.ErrorText}>{errorMessage}</span>}
      </div>
    );
  }
}

interface IndividualTimeSelectorProps {
  hasOptions?: boolean;
  label: string;
  min?: number;
  max?: number;
  onChange: Function;
  showColon?: boolean;
  value: any;
  showLeadingZero?: boolean;
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

  componentDidUpdate(prevProps: IndividualTimeSelectorProps) {
    const { value } = prevProps;
    if (value !== this.props.value) {
      this.setState({ value: this.props.value });
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
    const value = this.state.value;
    if (!this.props.hasOptions) {
      let newValue = parseFloat(value) + 1;
      if (newValue > this.props.max) newValue = this.props.min;
      if (newValue < this.props.min) newValue = this.props.max;
      this.onChange(newValue);
    } else {
      this.onChange(value === 'AM' ? 'PM' : 'AM');
    }
  };

  decrement = () => {
    const value = this.state.value;
    if (!this.props.hasOptions) {
      let newValue = parseFloat(value) - 1;
      if (newValue > this.props.max) newValue = this.props.min;
      if (newValue < this.props.min) newValue = this.props.max;
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
    role="button"
    onClick={e => {
      e.preventDefault();
      onClick(e);
    }}
  >
    <input
      id={id}
      type="checkbox"
      checked={isChecked}
      disabled={disabled}
      onChange={e => {}}
    />
    <span
      role="button"
      tabIndex={0}
      onClick={e => {}}
      className={classNames({
        [Styles.CheckmarkSmall]: smallOnDesktop,
      })}
    >
      {CheckMark}
    </span>
  </div>
);

Checkbox.defaultProps = {
  disabled: false,
  small: false,
  smallOnDesktop: false,
};

export const DatePicker = (props: DatePickerProps) => (
  <div
    className={classNames(Styles.DatePicker, {
      [Styles.Condensed]: props.condensedStyle,
      [Styles.OpenTop]: props.openTop,
      [Styles.error]:
        props.errorMessage &&
        props.errorMessage !== '' &&
        props.errorMessage.length > 0,
    })}
  >
    <SingleDatePicker
      id={props.id}
      openDirection={props.openTop ? 'up' : 'down'}
      date={props.date}
      disabled={props.readOnly}
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
      readOnly={props.readOnly}
    />
    {props.errorMessage &&
      props.errorMessage !== '' &&
      props.errorMessage.length > 0 && (
        <span className={Styles.ErrorText}>{props.errorMessage}</span>
      )}
  </div>
);

interface InputProps {
  type?: string;
  className?: string;
  value: any;
  max?: any;
  min?: any;
  isMultiline?: boolean;
  isClearable?: boolean;
  onChange: Function;
  updateValue?: Function;
  onBlur?: Function;
  isIncrementable?: boolean;
  incrementAmount?: number;
  canToggleVisibility?: boolean;
  shouldMatchValue?: boolean;
  comparisonValue?: string;
  isSearch?: boolean;
  placeholder?: string;
  maxButton?: boolean;
  onMaxButtonClick?: Function;
  noFocus?: boolean;
  isLoading?: boolean;
  onFocus?: Function;
  lightBorder?: boolean;
  darkMaxBtn?: boolean;
  style?: any;
}

interface InputState {
  value: any;
  isHiddenContentVisible: boolean;
  focused: boolean;
}

export class Input extends Component<InputProps, InputState> {
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

  componentDidUpdate(prevProps: InputProps, prevState: InputState) {
    if (prevProps.value !== this.props.value) {
      this.setState({ value: this.props.value });
    }

    if (
      this.props.canToggleVisibility &&
      !this.state.value &&
      this.state.isHiddenContentVisible
    ) {
      this.updateIsHiddenContentVisible(false);
    }

    if (
      prevState.isHiddenContentVisible !== this.state.isHiddenContentVisible &&
      this.state.isHiddenContentVisible
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
              color="#AFA7C1"
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

InputDropdown.defaultProps = {
  onKeyPress: null,
  className: null,
};

export interface CategoryRowProps {
  history: History;
  hasChildren?: boolean;
  handleClick?: Function;
  active?: boolean;
  loading?: boolean;
  category: string;
  count: number;
  icon?: React.ReactNode;
}

export const CategoryRow = ({
  history,
  hasChildren = true,
  handleClick = noop,
  active = false,
  loading = false,
  category,
  count,
  icon,
}: CategoryRowProps) => (
  <div
    onClick={() => {
      const categories = handleClick();
        const query: QueryEndpoints = {
          [CATEGORY_PARAM_NAME]: categories,
        };
        history.push({
          pathname: 'markets',
          search: makeQuery(query),
        });
      }
    }
    className={classNames(Styles.CategoryRow, {
      [Styles.active]: active,
      [Styles.loading]: loading,
      [Styles.disabled]: !hasChildren,
    })}
  >
    <span>
      {icon}{' '}
      {category && category.length <= 3 ? category.toUpperCase() : category}
    </span>
    {loading && <span>{LoadingEllipse}</span>}
    {!loading && <span>{count}</span>}
  </div>
);

export const MigrateRepInfo = () => (
  <section className={Styles.MigrateRepInfo}>
    <span>A note on Forking</span>
    <p>
      Augur is now in a state of Forking. The fork state is a special state that
      can last up to 60 days. Forking is the market resolution method of last
      resort; it is a very disruptive process and is intended to be a rare
      occurrence. The market below is the forking market, as it has implications
      for the other markets that currenty exist. When a fork is innitiated,
      disputing for all other non-resolved markets are put on hold until this
      fork resolves. The forking period is much longer than the usual fee window
      because the platform needs to provide ample time for REP holders and
      service providers (such as wallets and exchanges) to prepare. A fork’s
      final outcome cannot be disputed.
    </p>
    <p>
      Every Augur market and all REP tokens exist in some universe. Currently
      there is only one universe - the genesis universe - since there has never
      been a fork. REP tokens can be used to report on outcomes (and thus earn
      fees) only for markets that exist in the same universe as the REP tokens.
      When a market forks, new universes are created. Forking creates a new
      child universe for each possible outcome of the forking market (including
      Invalid).
    </p>
  </section>
);
