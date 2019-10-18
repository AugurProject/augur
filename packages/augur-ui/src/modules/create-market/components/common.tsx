import React, { Component, useState, useEffect } from 'react';
import classNames from 'classnames';

import { SecondaryButton } from 'modules/common/buttons';
import {
  TextInput,
  DatePicker,
  TimeSelector,
  TimezoneDropdown,
  FormDropdown,
  RadioBarGroup,
  MultiSelectRadioBarGroup,
} from 'modules/common/form';
import { XIcon, AddIcon, HintAlternate } from 'modules/common/icons';
import ReactTooltip from 'react-tooltip';
import TooltipStyles from 'modules/common/tooltip.styles.less';
import Link from 'modules/create-market/containers/link';
import { Error } from 'modules/common/form';
import Styles from 'modules/create-market/components/common.styles.less';
import {
  FormattedNumber,
  DateFormattedObject,
  NewMarket,
  TimezoneDateObject,
} from 'modules/types';
import moment, { Moment } from 'moment';
import {
  TemplateInputType,
  TemplateInput,
  Template,
  buildMarketDescription,
  tellIfEditableOutcomes,
  substituteUserOutcome,
  UserInputDateTime,
  createTemplateOutcomes,
  CHOICE,
  OPTIONAL,
} from 'modules/create-market/get-template';
import { CATEGORICAL, CATEGORICAL_OUTCOMES_MIN_NUM } from 'modules/common/constants';
import { buildformattedDate } from 'utils/format-date';
import MarkdownRenderer from 'modules/common/markdown-renderer';

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
  renderMarkdown?: Boolean;
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
    {props.renderMarkdown &&
      <MarkdownRenderer text={props.subheader}/>
    }
    {!props.renderMarkdown && <span>{props.subheader}</span>}
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
        <span key={String(index)}>
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
  endTimeFormatted: TimezoneDateObject | DateFormattedObject;
  header?: string;
  subheader?: string;
  uniqueKey?: string;
}

interface TimeSelectorParams {
  hour?: string;
  minute?: string;
  meridiem?: string;
}

interface DatePickerSelectorProps {
  setEndTime?: number;
  onChange: Function;
  currentTimestamp: number;
  errrorMessage?: string;
  placeholder?: string;
  errorMessage?: string;
}

export const DatePickerSelector = (props: DatePickerSelectorProps) => {
    const {
      setEndTime,
      onChange,
      currentTimestamp,
      errorMessage,
      placeholder
    } = props;

    const [dateFocused, setDateFocused] = useState(false);

    return (
      <DatePicker
        date={setEndTime ? moment(setEndTime * 1000) : null}
        placeholder={placeholder}
        displayFormat="MMM D, YYYY"
        id="input-date"
        onDateChange={(date: Moment) => {
          if (!date) return onChange('setEndTime', '');
          onChange(date.startOf('day').unix());
        }}
        isOutsideRange={day =>
          day.isAfter(moment(currentTimestamp * 1000).add(6, 'M')) ||
          day.isBefore(moment(currentTimestamp * 1000))
        }
        numberOfMonths={1}
        onFocusChange={({ focused }) => {
          if (setEndTime === null) {
            onChange(currentTimestamp);
          }
          setDateFocused(() => focused);
        }}
        focused={dateFocused}
        errorMessage={errorMessage}
      />
    );
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
    header,
    subheader,
    uniqueKey,
  } = props;

  const [dateFocused, setDateFocused] = useState(false);
  const [timeFocused, setTimeFocused] = useState(false);

  return (
    <div className={Styles.DateTimeSelector} key={uniqueKey}>
      <Subheaders
        header={header ? header : 'Event Expiration date and time'}
        subheader={
          subheader
            ? subheader
            : 'Choose a date and time that is sufficiently after the end of the event. If event expiration before the event end time the market will likely be reported as invalid. Make sure to factor in potential delays that can impact the event end time. '
        }
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
          errorMessage={validations && validations.setEndTime}
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
          errorMessage={validations && validations.hour}
          uniqueKey={uniqueKey}
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
  errorMessage?: string;
  editable?: boolean;
}

interface NumberedListOutcomes {
  value: string;
  editable: boolean;
}

export interface NumberedListProps {
  initialList: NumberedListOutcomes[];
  minShown: number;
  maxList: number;
  placeholder: string;
  updateList: Function;
  errorMessage?: string;
  hideAdd?: boolean;
}

export interface NumberedListState {
  list: NumberedListOutcomes[];
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
  editable,
}: NumberedInputProps) => (
  <li key={number} className={Styles.NumberedInput}>
    <span>{`${number + 1}.`}</span>
    {editable && (
      <>
        <TextInput
          onChange={value => onChange(value, number)}
          value={value}
          placeholder={placeholder}
          errorMessage={errorMessage}
        />
        {removable && <button onClick={e => onRemove(number)}>{XIcon}</button>}
      </>
    )}
    {!editable && (
      <>
        {value}
        {errorMessage && errorMessage !== '' && errorMessage.length > 0 && (
          <span>{errorMessage}</span>
        )}
      </>
    )}
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

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (
      JSON.stringify(this.props.initialList) !==
      JSON.stringify(nextProps.initialList)
    ) {
      this.setState({
        list: nextProps.initialList,
      });
    }
  }

  onChange = (value, index) => {
    const { updateList } = this.props;
    const { list } = this.state;
    list[index].value = value;
    this.setState({ list }, () => updateList(list.map(item => item.value)));
  };

  addItem = () => {
    const { isFull, list } = this.state;
    const { maxList, minShown, updateList } = this.props;
    if (!isFull) {
      list.push({ value: '', editable: true });
      this.setState(
        {
          list,
          isFull: list.length === maxList,
          isMin: list.length === minShown,
        },
        () => {
          updateList(list.map(item => item.value));
        }
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
        () => {
          updateList(list.map(item => item.value));
        }
      );
    }
  };

  render() {
    const { list, isFull } = this.state;
    const { placeholder, minShown, errorMessage, hideAdd } = this.props;

    return (
      <ul className={Styles.NumberedList}>
        {list.map((item, index) => (
          <NumberedInput
            key={index}
            value={item.value}
            placeholder={placeholder}
            onChange={this.onChange}
            number={index}
            removable={index >= minShown}
            onRemove={this.removeItem}
            errorMessage={errorMessage && errorMessage[index]}
            editable={item.editable}
          />
        ))}
        {!hideAdd && (
          <li>
            <SecondaryButton
              disabled={isFull}
              text="Add"
              action={e => this.addItem()}
              icon={AddIcon}
            />
          </li>
        )}
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

interface InputFactoryProps {
  input: TemplateInput;
  inputIndex: number;
  onChange: Function;
  newMarket: NewMarket;
  currentTimestamp: string;
}

export const InputFactory = (props: InputFactoryProps) => {
  const { input, inputIndex, onChange, newMarket, currentTimestamp } = props;

  const { template, outcomes, marketType, validations } = newMarket;

  const { inputs } = template;

  const updateData = value => {
    let inputValidations = newMarket.validations.inputs;
    if (inputValidations === '') {
      inputValidations = [];
    }
    inputValidations[inputIndex] = '';
    onChange('validations', {
      ...newMarket.validations,
      inputs: inputValidations,
    });

    let newInputs = inputs;
    newInputs[inputIndex].userInput = value;
    onChange('template', {
      ...template,
      inputs: newInputs,
    });

    const question = buildMarketDescription(template.question, newInputs);
    onChange('description', question);

    return newInputs;
  };

  if (input.type === TemplateInputType.TEXT) {
    return (
      <TextInput
        placeholder={input.placeholder}
        errorMessage={validations.inputs && validations.inputs[inputIndex]}
        onChange={value => {
          let newOutcomes = outcomes;
          const newInputs = updateData(value);
          if (marketType === CATEGORICAL && tellIfEditableOutcomes(newInputs)) {
            // todo: this is done because of substitute_user_outcomes,
            // if more substitute_user_outcomes get added relating to other input types will need to add them to other types
            newOutcomes = createTemplateOutcomes(newInputs);
          }
          onChange('outcomes', newOutcomes);
        }}
        value={input.userInput}
      />
    );
  } else if (input.type === TemplateInputType.USER_DESCRIPTION_OUTCOME) {
    return (
      <TextInput
        placeholder={input.placeholder}
        errorMessage={validations.inputs && validations.inputs[inputIndex]}
        onChange={value => {
          let newOutcomes = outcomes;
          newOutcomes[inputIndex] = value;
          updateData(value);
          onChange('outcomes', newOutcomes);
        }}
        value={input.userInput}
      />
    );
  } else if (input.type === TemplateInputType.DATEYEAR) {
    return (
      <DatePickerSelector
        onChange={(value) => {
          updateData(value);
        }}
        currentTimestamp={currentTimestamp}
        placeholder={input.placeholder}
        setEndTime={input.userInput}
        errorMessage={validations.inputs && validations.inputs[inputIndex]}
      />
    );
  } else if (input.type === TemplateInputType.DATETIME) {
    return <span>{input.userInput ? input.userInput : `[${input.placeholder}]`}</span>;
  } else if (input.type === TemplateInputType.DROPDOWN || input.type === TemplateInputType.DENOMINATION_DROPDOWN) {
    return (
      <FormDropdown
        options={input.values}
        defaultValue={input.userInput}
        staticLabel={input.placeholder}
        errorMessage={validations.inputs && validations.inputs[inputIndex]}
        onChange={value => {
          if (input.type === TemplateInputType.DENOMINATION_DROPDOWN) {
            onChange('scalarDenomination', value);
          }
          updateData(value);
        }}
      />
    );
  } else {
    return null;
  }
};

interface EstimatedStartSelectorProps {
  newMarket: NewMarket;
  template: Template;
  input: TemplateInput;
  currentTime: number;
  onChange: Function;
  inputIndex: number;
}

export const EstimatedStartSelector = (props: EstimatedStartSelectorProps) => {
  const {
    newMarket,
    template,
    input,
    inputIndex,
    currentTime,
    onChange,
  } = props;

  const [endTime, setEndTime] = useState(
    props.input.userInput
      ? (props.input.userInputObject as UserInputDateTime).endTime
      : null
  );
  const [hour, setHour] = useState(
    props.input.userInput
      ? (props.input.userInputObject as UserInputDateTime).hour
      : null
  );
  const [minute, setMinute] = useState(
    props.input.userInput
      ? (props.input.userInputObject as UserInputDateTime).minute
      : null
  );
  const [meridiem, setMeridiem] = useState(
    props.input.userInput
      ? (props.input.userInputObject as UserInputDateTime).meridiem
      : 'AM'
  );
  const [timezone, setTimezone] = useState(
    props.input.userInput
      ? (props.input.userInputObject as UserInputDateTime).timezone
      : ''
  );
  const [endTimeFormatted, setEndTimeFormatted] = useState(
    props.input.userInput
      ? (props.input.userInputObject as UserInputDateTime).endTimeFormatted
      : ''
  );
  const [offset, setOffset] = useState(
    props.input.userInput
      ? (props.input.userInputObject as UserInputDateTime).offset
      : 0
  );
  const [offsetName, setOffsetName] = useState(
    props.input.userInput
      ? (props.input.userInputObject as UserInputDateTime).offsetName
      : ''
  );
  let userInput = props.input.placeholder;
  useEffect(() => {
    const endTimeFormatted = buildformattedDate(
      Number(endTime),
      Number(hour),
      Number(minute),
      meridiem,
      offsetName,
      Number(offset)
    );
    setEndTimeFormatted(endTimeFormatted);
    if (hour !== null && minute !== null) {
      userInput = endTimeFormatted.formattedUtc;
    }
    template.inputs[props.input.id].userInputObject = {
      endTime,
      hour,
      minute,
      meridiem,
      timezone,
      offset,
      offsetName,
      endTimeFormatted,
    } as UserInputDateTime;
    if (hour !== null && minute !== null) {
      template.inputs[props.input.id].userInput = userInput;
    }
    let inputValidations = newMarket.validations.inputs;
    if (inputValidations === '') {
      inputValidations = [];
    }
    inputValidations[inputIndex] = { setEndTime: '', hours: '' };
    // todo: need to see if they changed date or time and clear validations accordingly
    onChange('validations', {
      ...newMarket.validations,
      inputs: inputValidations,
    });
    const question = buildMarketDescription(template.question, template.inputs);

    onChange('description', question);
    onChange('template', template);
  }, [endTime, hour, minute, meridiem, timezone, offset, offsetName]);

  return (
    <div className={Styles.EstimatedStartSelector}>
      <DateTimeSelector
        header="Estimated start time"
        subheader="When is the event estimated to begin?"
        setEndTime={endTime}
        onChange={(label, value) => {
          switch (label) {
            case 'timezoneDropdown':
              const { offset, timezone, offsetName } = value;
              setOffset(Number(offset));
              setTimezone(timezone);
              setOffsetName(offsetName);
              break;
            case 'setEndTime':
              setEndTime(value);
              break;
            case 'timeSelector':
              if (value.hour) setHour(value.hour);
              if (value.minute) setMinute(value.minute);
              if (value.meridiem) setMeridiem(value.meridiem);
              break;
            case 'minute':
              setMinute(value);
              break;
            case 'hour':
              setHour(value);
              break;
            case 'meridiem':
              setMeridiem(value);
              break;
            default:
              break;
          }
        }}
        validations={newMarket.validations.inputs && newMarket.validations.inputs[inputIndex]}
        hour={hour ? String(hour) : null}
        minute={minute ? String(minute) : null}
        meridiem={meridiem}
        timezone={timezone}
        currentTimestamp={currentTime}
        endTimeFormatted={endTimeFormatted}
        uniqueKey={'templateEstTime'}
      />
    </div>
  );
};

export interface QuestionBuilderProps {
  newMarket: NewMarket;
  onChange: Function;
  currentTime: number;
}

export const QuestionBuilder = (props: QuestionBuilderProps) => {
  const { onChange, newMarket, currentTimestamp } = props;
  const { template, outcomes, marketType, validations } = newMarket;
  const question = template.question.split(' ');
  const inputs = template.inputs;

  const dateTimeIndex = inputs.findIndex(
    input => input.type === TemplateInputType.DATETIME
  );

  return (
    <div className={Styles.QuestionBuilder}>
      <Subheaders
        header="Market question"
        subheader="What do you want people to predict?"
      />
      <div>
        {question.map((word, index) => {
          const bracketPos = word.indexOf('[');
          const bracketPos2 = word.indexOf(']');

          if (bracketPos === -1 || bracketPos === -1) {
            return <span key={word+index}>{word}</span>;
          } else {
            const id = word.substring(bracketPos + 1, bracketPos2);
            const inputIndex = inputs.findIndex(
              findInput => findInput.id.toString() === id
            );
            if (inputIndex > -1) {
              const input = inputs[inputIndex];
              return (
                <InputFactory
                  key={inputIndex}
                  input={input}
                  inputIndex={inputIndex}
                  onChange={onChange}
                  newMarket={newMarket}
                  currentTimestamp={currentTimestamp}
                />
              );
            }
          }
        })}
      </div>
      {dateTimeIndex > -1 && (
        <EstimatedStartSelector
          newMarket={newMarket}
          onChange={onChange}
          input={inputs[dateTimeIndex]}
          currentTime={currentTimestamp}
          template={template}
          inputIndex={dateTimeIndex}
        />
      )}
      {marketType === CATEGORICAL && (
        <CategoricalTemplate newMarket={newMarket} onChange={onChange} />
      )}
    </div>
  );
};

export interface CategoricalTemplateProps {
  newMarket: NewMarket;
  onChange: Function;
}

export const CategoricalTemplate = (props: CategoricalTemplateProps) => {
  const { onChange, newMarket } = props;
  const { template, outcomes, validations } = newMarket;
  const inputs = template.inputs;

  let initialList = inputs
    .filter(
      input =>
        input.type === TemplateInputType.SUBSTITUTE_USER_OUTCOME ||
        input.type === TemplateInputType.ADDED_OUTCOME ||
        input.type === TemplateInputType.USER_DESCRIPTION_OUTCOME
    )
    .map(input => {
      if (input.type === TemplateInputType.SUBSTITUTE_USER_OUTCOME) {
        return {
          value: substituteUserOutcome(input, inputs),
          editable: false,
        };
      } else if (input.type === TemplateInputType.ADDED_OUTCOME) {
        return {
          value: input.placeholder,
          editable: false,
        };
      } else if (input.type === TemplateInputType.USER_DESCRIPTION_OUTCOME) {
        return {
          value: input.userInput || input.placeholder,
          editable: false,
        };
      }
      return null;
    });
  
  outcomes.forEach(outcome => {
    if (initialList.filter(option => option.value === outcome).length === 0) {
      initialList.push({
        value: outcome,
        editable: true
      });
    }
  });

  while (initialList.length < CATEGORICAL_OUTCOMES_MIN_NUM) {
    initialList.push({
      value: '',
      editable: true,
    });
  }

  const hideAdd = tellIfEditableOutcomes(inputs);

  return (
    <>
      <Subheaders
        header="Outcomes"
        subheader="List the outcomes people can choose from."
        link
      />
      <NumberedList
        initialList={initialList}
        minShown={2}
        maxList={7}
        placeholder={'Enter outcome'}
        updateList={(value: Array<string>) => {
          onChange('outcomes', value);
        }}
        hideAdd={hideAdd}
        errorMessage={validations.outcomes}
      />
    </>
  );
};

export interface ResolutionRulesProps {
  newMarket: NewMarket;
  onChange: Function;
}

export const ResolutionRules = (props: ResolutionRulesProps) => {
  const { onChange, newMarket } = props;
  const { template } = newMarket;
  const { resolutionRules } = template;
  if (Object.keys(resolutionRules).length === 0) {
    return null;
  }
  return (
    <div className={Styles.ResolutionRules}>
      <Subheaders
        header="Suggested resolution rules"
        subheader="Common rules for this template that you can optionally include in your market."
      />
      {resolutionRules[CHOICE] && resolutionRules[CHOICE].length > 0 && (
        <>
          <span>Choose one:</span>
          <RadioBarGroup
            radioButtons={resolutionRules[CHOICE].map((rule, index) =>
              {
                return {
                  header: rule.text,
                  value: index.toString()
                }
              }
            )}
            onChange={(value: string) => {
              const newResolutionRulesChoice = resolutionRules[CHOICE].map((rule, index) => {
                  return {
                    ...rule,
                    isSelected: index.toString() === value
                  }
              });
              onChange('template', {
                ...template,
                resolutionRules: {
                  [OPTIONAL]: resolutionRules[OPTIONAL],
                  [CHOICE]: newResolutionRulesChoice
                }
              })
            }}
          />
        </>
      )}
       {resolutionRules[OPTIONAL] && resolutionRules[OPTIONAL].length > 0 && (
        <>
          <span>Choose as many as you like:</span>
          <MultiSelectRadioBarGroup
            radioButtons={resolutionRules[OPTIONAL].map((rule, index) =>
              {
                return {
                  header: rule.text,
                  value: index.toString(),
                  isSelected: rule.isSelected
                }
              }
            )}
            onChange={(value: string) => {
              let newResolutionRulesOpt = resolutionRules[OPTIONAL];
              newResolutionRulesOpt[parseInt(value)].isSelected = !resolutionRules[OPTIONAL][parseInt(value)].isSelected;
              onChange('template', {
                ...template,
                resolutionRules: {
                  [OPTIONAL]: newResolutionRulesOpt,
                  [CHOICE]: resolutionRules[CHOICE]
                }
              })
            }}
          />
        </>
       )}
    </div>
  );
};
