import React, { Component, useState, useEffect } from 'react';
import classNames from 'classnames';

import { SecondaryButton } from 'modules/common/buttons';
import {
  TextInput,
  DatePicker,
  TimeSelector,
  TimezoneDropdown,
} from 'modules/common/form';
import { XIcon, AddIcon, HintAlternate } from 'modules/common/icons';
import ReactTooltip from 'react-tooltip';
import TooltipStyles from 'modules/common/tooltip.styles.less';
import Link from 'modules/create-market/containers/link';
import { Error } from 'modules/common/form';
import Styles from 'modules/create-market/components/common.styles.less';
import { FormattedNumber, DateFormattedObject } from 'modules/types';
import moment, { Moment } from 'moment';

export interface HeaderProps {
  text: string;
  children?: Array<any>;
}

export const Header = (props: HeaderProps) => (
  <h2 className={Styles.Header}>
    {props.children ? props.children : props.text}
  </h2>
);

export const LargeHeader = (props: HeaderProps) => (
  <span className={Styles.LargeHeader}>
    {props.children ? props.children : props.text}
  </span>
);

export const MediumHeader = (props: HeaderProps) => (
  <span className={Styles.MediumHeader}>
    {props.children ? props.children : props.text}
  </span>
);

export interface SubheadersProps {
  header: string;
  subheader: string;
  link?: Boolean;
  href?: string;
  underline?: Boolean;
  ownLine?: Boolean;
  smallSubheader?: Boolean;
}

export interface DateTimeHeadersProps extends SubheadersProps {
  timezoneDateTime: string;
  timezone: string;
}

export const Subheaders = (props: SubheadersProps) => (
  <div className={Styles.Subheaders}>
    <h1>{props.header}</h1>
    <p>
      <span>{props.subheader}</span>
      {props.link && (
        <Link
          href={props.href}
          underline={props.underline}
          ownLine={props.ownLine}
        />
      )}
    </p>
  </div>
);

export interface XLargeSubheadersProps {
  header: string;
  subheader: string;
  children?: Array<any>;
}

export const XLargeSubheaders = (props: XLargeSubheadersProps) => (
  <div className={Styles.XLargeSubheaders}>
    <LargeHeader text={props.header} />
    <MediumHeader text={props.subheader}>{props.children}</MediumHeader>
  </div>
);

export interface HeaderLinkProps {
  text: string;
  href?: string;
  link?: Boolean;
  ownLine?: Boolean;
  underline?: Boolean;
  smallSubheader?: Boolean;
}

export const SmallHeaderLink = (props: HeaderLinkProps) => (
  <p
    className={classNames(Styles.SmallHeaderLink, {
      [Styles.XSmall]: props.smallSubheader,
    })}
  >
    <span>{props.text}</span>
    {props.link && (
      <Link
        href={props.href}
        underline={props.underline}
        ownLine={props.ownLine}
      />
    )}
  </p>
);

export const LargeSubheaders = (props: SubheadersProps) => (
  <div
    className={classNames(Styles.LargeSubheaders, {
      [Styles.Small]: props.smallSubheader,
    })}
  >
    <Header text={props.header} />
    <SmallHeaderLink
      text={props.subheader}
      href={props.href}
      underline={props.underline}
      ownLine={props.ownLine}
      link={props.link}
      smallSubheader={props.smallSubheader}
    />
  </div>
);

export const DateTimeHeaders = (props: DateTimeHeadersProps) => (
  <div className={Styles.SmallSubheaders}>
    <h1>{props.header}</h1>
    <span>{props.subheader}</span>
    {props.timezone && <span>{props.timezoneDateTime}</span>}
  </div>
);

export const SmallSubheaders = (props: SubheadersProps) => (
  <div className={Styles.SmallSubheaders}>
    <h1>{props.header}</h1>
    <span>{props.subheader}</span>
  </div>
);

export interface SubheadersTooltipProps {
  header: string | Element;
  subheader: string | Element;
  link?: Boolean;
  href?: string;
  underline?: Boolean;
  ownLine?: Boolean;
  smallSubheader?: Boolean;
  text: string;
  tooltipSubheader?: Boolean;
}

export const SmallSubheadersTooltip = (props: SubheadersTooltipProps) => (
  <div className={Styles.SmallSubheadersTooltip}>
    <h1>
      {props.header}
      {!props.tooltipSubheader && (
        <>
          <label
            className={TooltipStyles.TooltipHint}
            data-tip
            data-for={`tooltip-${props.header}`}
          >
            {HintAlternate}
          </label>
          <ReactTooltip
            id={`tooltip-${props.header}`}
            className={TooltipStyles.Tooltip}
            effect="solid"
            place="top"
            type="light"
            data-event="mouseover"
            data-event-off="blur scroll"
          >
            {props.text}
          </ReactTooltip>
        </>
      )}
    </h1>
    <span>
      {props.subheader}
      {props.tooltipSubheader && (
        <>
          <label
            className={TooltipStyles.TooltipHint}
            data-tip
            data-for={`tooltip-${props.header}`}
          >
            {HintAlternate}
          </label>
          <ReactTooltip
            id={`tooltip-${props.header}`}
            className={TooltipStyles.Tooltip}
            effect="solid"
            place="top"
            type="light"
            data-event="mouseover"
            data-event-off="blur scroll"
          >
            {props.text}
          </ReactTooltip>
        </>
      )}
    </span>
  </div>
);

export interface OutcomesListProps {
  outcomes: Array<string>;
}

export const OutcomesList = (props: OutcomesListProps) => (
  <div className={Styles.OutcomesList}>
    <h1>Outcomes</h1>
    <div>
      {props.outcomes.map((outcome: string, index: Number) => (
        <span key={index}>
          {index + 1}. {outcome}
        </span>
      ))}
    </div>
  </div>
);

export interface ExplainerBlockProps {
  title: string;
  subtexts: Array<string>;
}

export const ExplainerBlock = (props: ExplainerBlockProps) => (
  <div className={Styles.ExplainerBlock}>
    <h2>{props.title}</h2>
    {props.subtexts.map((subtext, index) => (
      <p key={index}>{subtext}</p>
    ))}
  </div>
);

export interface ContentBlockProps {
  children: Array<any>;
  noDarkBackground?: Boolean;
  dark?: Boolean;
}

export const ContentBlock = (props: ContentBlockProps) => (
  <div
    className={classNames(Styles.ContentBlock, {
      [Styles.NoDark]: props.noDarkBackground,
      [Styles.Dark]: props.dark,
    })}
  >
    {props.children}
  </div>
);

export const LineBreak = () => <div className={Styles.LineBreak} />;

interface DateTimeSelectorProps {
  setEndTime?: number;
  onChange: Function;
  currentTimestamp: number;
  dateFocused?: boolean;
  validations: object;
  hour: string;
  minute: string;
  meridiem: string;
  timezone: string;
  endTimeFormatted: DateFormattedObject;
}

interface TimeSelectorParams {
  hour?: string;
  minute?: string;
  meridiem?: string;
}

export const DateTimeSelector = (props: DateTimeSelectorProps) => {
  const {
    setEndTime,
    onChange,
    currentTimestamp,
    validations,
    hour,
    minute,
    meridiem,
    timezone,
    endTimeFormatted,
  } = props;

  const [dateFocused, setDateFocused] = useState(false);
  const [timeFocused, setTimeFocused] = useState(false);

  useEffect(() => {
    const timezoneParams = {
      offset: 0,
      timezone: '',
      offsetName: '',
    };
    onChange('timezoneDropdown', timezoneParams);
  }, [dateFocused]);

  return (
    <div className={Styles.DateTimeSelector}>
      <Subheaders
        header="Reporting start date and time"
        subheader="Choose a date and time that is sufficiently after the end of the event. If event expiration before the event end time the market will likely be reported as invalid. Make sure to factor in potential delays that can impact the event end time. "
        link
      />
      <span>
        <DatePicker
          date={setEndTime ? moment(setEndTime * 1000) : null}
          placeholder="Date"
          displayFormat="MMM D, YYYY"
          id="input-date"
          onDateChange={(date: Moment) => {
            if (!date) return onChange('setEndTime', '');
            onChange('setEndTime', date.startOf('day').unix());
          }}
          isOutsideRange={day =>
            day.isAfter(moment(currentTimestamp * 1000).add(6, 'M')) ||
            day.isBefore(moment(currentTimestamp * 1000))
          }
          numberOfMonths={1}
          onFocusChange={({ focused }) => {
            if (setEndTime === null) {
              onChange('setEndTime', currentTimestamp);
            }
            setDateFocused(() => focused);

          }}
          focused={dateFocused}
          errorMessage={validations.setEndTime}
        />
        <TimeSelector
          hour={hour}
          minute={minute}
          meridiem={meridiem}
          onChange={(label: string, value: number) => {
            onChange(label, value);
          }}
          onFocusChange={(focused: Boolean) => {
            const timeSelector: TimeSelectorParams = {};
            if (!hour) {
              timeSelector.hour = '12';
            }
            if (!minute) {
              timeSelector.minute = '00';
            }
            if (!meridiem) {
              timeSelector.meridiem = 'AM';
            }

            onChange('timeSelector', timeSelector);
            setTimeFocused(() => focused);
          }}
          focused={timeFocused}
          errorMessage={validations.hour}
        />
        <TimezoneDropdown
          onChange={(offsetName: string, offset: number, timezone: string) => {
            const timezoneParams = { offset, timezone, offsetName };
            onChange('timezoneDropdown', timezoneParams);
          }}
          timestamp={setEndTime}
          timezone={timezone}
        />
      </span>
      {endTimeFormatted && hour && hour !== '' && setEndTime && (
        <span>
          <div>
            <span>Converted to UTC-0:</span>
            <span>{endTimeFormatted.formattedUtc}</span>
          </div>
          <span>
            Augur uses the UTC-0 timezone to standarise times. Ensure the UTC-0
            time is accurate and does not conflict with the resolution start
            time.
          </span>
        </span>
      )}
    </div>
  );
};

export interface NumberedInputProps {
  value: string;
  removable: boolean;
  number: number;
  placeholder: string;
  onChange: Function;
  onRemove?: Function;
  errorMessage?: strinng;
}

export interface NumberedListProps {
  initialList: Array<string>;
  minShown: number;
  maxList: number;
  placeholder: string;
  updateList: Function;
  errorMessage?: string;
}

export interface NumberedListState {
  list: Array<string>;
  isFull: boolean;
  isMin: boolean;
}

export const NumberedInput = ({
  number,
  value,
  placeholder,
  onChange,
  removable,
  onRemove,
  errorMessage,
}: NumberedInputProps) => (
  <li key={number} className={Styles.NumberedInput}>
    <span>{`${number + 1}.`}</span>
    <TextInput
      onChange={value => onChange(value, number)}
      value={value}
      placeholder={placeholder}
      errorMessage={errorMessage}
    />
    {removable && <button onClick={e => onRemove(number)}>{XIcon}</button>}
  </li>
);

export class NumberedList extends Component<
  NumberedListProps,
  NumberedListState
> {
  state: NumberedListState = {
    list: this.props.initialList,
    isFull: this.props.initialList.length === this.props.maxList,
    isMin: this.props.initialList.length === this.props.minShown,
  };

  onChange = (value, index) => {
    const { updateList } = this.props;
    const { list } = this.state;
    list[index] = value;
    this.setState({ list }, () => updateList(list));
  };

  addItem = () => {
    const { isFull, list } = this.state;
    const { maxList, minShown, updateList } = this.props;
    if (!isFull) {
      list.push('');
      this.setState(
        {
          list,
          isFull: list.length === maxList,
          isMin: list.length === minShown,
        },
        () => updateList(list)
      );
    }
  };

  removeItem = index => {
    const { isMin, list } = this.state;
    const { minShown, maxList, updateList } = this.props;
    if (!isMin) {
      list.splice(index, 1);
      this.setState(
        {
          list,
          isMin: list.length === minShown,
          isFull: list.length === maxList,
        },
        () => updateList(list)
      );
    }
  };

  render() {
    const { list, isFull } = this.state;
    const { placeholder, minShown, errorMessage } = this.props;

    return (
      <ul className={Styles.NumberedList}>
        {list.map((item, index) => (
          <NumberedInput
            key={index}
            value={item}
            placeholder={placeholder}
            onChange={this.onChange}
            number={index}
            removable={index >= minShown}
            onRemove={this.removeItem}
            errorMessage={errorMessage[index]}
          />
        ))}
        <li>
          <SecondaryButton
            disabled={isFull}
            text="Add"
            action={e => this.addItem()}
            icon={AddIcon}
          />
        </li>
      </ul>
    );
  }
}

export interface NoFundsErrorsProps {
  noEth: boolean;
  noRep: boolean;
  noDai: boolean;
  totalEth: FormattedNumber;
  totalRep: FormattedNumber;
  totalDai: FormattedNumber;
  availableEthFormatted: FormattedNumber;
  availableRepFormatted: FormattedNumber;
  availableDaiFormatted: FormattedNumber;
}
export const NoFundsErrors = (props: NoFundsErrorsProps) => {
  const {
    noEth,
    noRep,
    noDai,
    totalEth,
    totalRep,
    totalDai,
    availableEthFormatted,
    availableRepFormatted,
    availableDaiFormatted,
  } = props;

  return (
    <div className={classNames({ [Styles.HasError]: noEth || noDai || noRep })}>
      {noEth && (
        <Error
          alternate
          header="Not enough ETH in your wallet"
          subheader={`You have ${availableEthFormatted.formatted} ETH of ${totalEth.formatted} required to create this market`}
        />
      )}
      {noRep && (
        <Error
          alternate
          header="Not enough REP in your wallet"
          subheader={`You have ${availableRepFormatted.formatted} V2 REP of ${totalRep.formatted} required to create this market.`}
        />
      )}
      {noDai && (
        <Error
          alternate
          header="Not enough $ (DAI) in your wallet"
          subheader={`You have $${availableDaiFormatted.formatted} (DAI) of $${totalDai.formatted} (DAI) required to create this market`}
        />
      )}
    </div>
  );
};
