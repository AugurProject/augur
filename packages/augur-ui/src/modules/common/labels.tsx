import React, { useEffect, useState, useRef } from 'react';
import classNames from 'classnames';
import * as constants from 'modules/common/constants';
import Styles from 'modules/common/labels.styles.less';
import { ClipLoader } from 'react-spinners';
import {
  CheckCircleIcon,
  HintAlternate,
  LoadingEllipse,
  MarketIcon,
  QuestionIcon,
  RedFlagIcon,
  ScalarIcon,
  TemplateIcon,
  YellowTemplateIcon,
  ArchivedIcon,
  ExclamationCircle,
  FilledCheckbox,
  EmptyCheckbox,
} from 'modules/common/icons';
import ReactTooltip from 'react-tooltip';
import TooltipStyles from 'modules/common/tooltip.styles.less';
import { createBigNumber, BigNumber } from 'utils/create-big-number';
import {
  SELL,
  BOUGHT,
  PROBABLE_INVALID_MARKET,
  SOLD,
  CLOSED,
  SHORT,
  ZERO,
  YES_NO,
  SCALAR,
  CATEGORICAL,
  REPORTING_STATE,
  DISCORD_LINK,
  ACCOUNT_TYPES,
  THEMES,
  CLOSED_SHORT,
  MODAL_INVALID_MARKET_RULES,
  GWEI_CONVERSION,
  AUTO_ETH_REPLENISH,
  BUY,
} from 'modules/common/constants';
import { useAppStatusStore, AppStatus } from 'modules/app/store/app-status';
import { ViewTransactionDetailsButton } from 'modules/common/buttons';
import {
  formatNumber,
  formatBlank,
  formatGasCostToEther,
  formatAttoEth,
} from 'utils/format-number';
import {
  DateFormattedObject,
  FormattedNumber,
  SizeTypes,
  MarketData,
} from 'modules/types';
import type { Getters } from '@augurproject/sdk';
import { TXEventName } from '@augurproject/sdk-lite';
import {
  DISMISSABLE_NOTICE_BUTTON_TYPES,
  DismissableNotice,
  DismissableNoticeProps,
} from 'modules/reporting/common';
import {
  AugurMarketsContent,
  EventDetailsContent,
} from 'modules/create-market/constants';
import {
  ExplainerBlock,
  MultipleExplainerBlock,
} from 'modules/create-market/components/common';
import { hasTemplateTextInputs } from '@augurproject/templates';
import { getDurationBetween } from 'utils/format-date';
import { useTimer } from 'modules/common/progress';
import { isGSNUnavailable } from 'modules/app/selectors/is-gsn-unavailable';
import { ethToDai } from 'modules/app/actions/get-ethToDai-rate';
import { getEthForDaiRate } from 'modules/contracts/actions/contractCalls';
import { getEthReserve } from 'modules/auth/helpers/get-eth-reserve';
import { getTransactionLabel } from 'modules/auth/helpers/get-gas-price';
import { augurSdk } from 'services/augursdk';

export interface MarketTypeProps {
  marketType: string;
}

export interface MarketStatusProps {
  marketStatus: string;
  reportingState: string;
  endTimeFormatted: DateFormattedObject;
  currentAugurTimestamp: number;
  isWarpSync?: boolean;
  mini?: boolean;
}

export interface InReportingLabelProps extends MarketStatusProps {
  disputeInfo: Getters.Markets.DisputeInfo;
  isForkingMarket?: boolean;
}

export interface MovementLabelProps {
  value: FormattedNumber;
  size?: SizeTypes;
  styles?: object;
  showIcon?: boolean;
  showBrackets?: boolean;
  showPlusMinus?: boolean;
  useFull?: boolean;
  hideNegative?: boolean;
}

export interface MovementIconProps {
  value: number;
  size: SizeTypes;
}

export interface MovementTextProps {
  value: FormattedNumber;
  numberValue: number;
  size: SizeTypes;
  showBrackets: boolean;
  showPlusMinus: boolean;
  useFull: boolean;
  hideNegative: boolean;
}

export interface PropertyLabelProps {
  label: string;
  value: string;
  hint?: React.ReactNode;
  large?: boolean;
}

export interface LinearPropertyLabelProps {
  label: string;
  value: string | FormattedNumber;
  accentValue?: boolean;
  highlightFirst?: boolean;
  highlight?: boolean;
  highlightAlternateBolded?: boolean;
  highlightAlternate?: boolean;
  useValueLabel?: boolean;
  showDenomination?: boolean;
  useFull?: boolean;
  underline?: boolean;
  onValueClick?: Function;
  regularCase?: boolean;
}

export interface LinearPropertyLabelTooltipProps {
  label: string;
  value: string;
}

export interface LinearPropertyLabelPercentMovementProps {
  label: string;
  value: string;
  accentValue?: boolean;
  movementValue: FormattedNumber;
  showIcon?: boolean;
  showBrackets?: boolean;
  showPercent?: boolean;
  showPlusMinus?: boolean;
  useValueLabel?: boolean;
  useFull?: boolean;
}

export interface PillLabelProps {
  label: string;
  hideOnMobile?: boolean;
}

export interface PositionTypeLabelProps {
  type: string;
  pastTense: boolean;
}

export interface LinearPropertyLabelViewTransactionProps {
  transactionHash: string;
  highlightFirst?: boolean;
}

export interface ValueLabelProps {
  value: FormattedNumber;
  showDenomination?: boolean;
  keyId?: string;
  showEmptyDash?: boolean;
  useFull?: boolean;
  usePercent?: boolean;
  alert?: boolean;
  showFullPrecision?: boolean;
}

interface SizableValueLabelProps extends ValueLabelProps {
  size: SizeTypes;
  highlight?: boolean;
}

interface HoverValueLabelState {
  hover: boolean;
}

export interface TextLabelProps {
  text: string;
  keyId?: string;
}

export interface InvalidLabelProps extends TextLabelProps {
  openInvalidMarketRulesModal?: Function;
  tooltipPositioning?: string;
}

export interface TextLabelState {
  scrollWidth: string | null;
  clientWidth: string | null;
  isDisabled: boolean;
}

export interface RepBalanceProps {
  rep: string;
  alternate?: boolean;
  larger?: boolean;
}

export interface MarketStateLabelProps {
  label: string;
  count: number;
  loading: boolean;
  selected: boolean;
  handleClick: Function;
  marketType: string;
}

interface ButtonObj {
  label: string;
  onClick: Function;
}

interface WordTrailProps {
  typeLabel: string;
  items: Array<ButtonObj>;
  children: Array<any>;
}

interface CategoryTagTrailProps {
  categories: Array<ButtonObj>;
}

interface ValueDenominationProps {
  valueClassname?: string | null;
  className?: string | null;
  value?: number | null;
  formatted?: string | null;
  fullPrecision?: string | null;
  denomination?: string | null;
  hidePrefix?: Boolean;
  hidePostfix?: Boolean;
  prefix?: string | null;
  postfix?: string | null;
  hideDenomination?: Boolean;
}

interface TimeLabelProps {
  label: string;
  time: string;
  hint?: React.ReactNode;
  large?: boolean;
}

interface FullTimeLabelProps {
  label: string;
  time: DateFormattedObject;
  hint?: React.ReactNode;
  large?: boolean;
}

interface CountdownLabelProps {
  expiry: DateFormattedObject;
}

export const CountdownLabel = ({ expiry }: CountdownLabelProps) => {
  if (!expiry) return null;
  const currentTime = useTimer();
  const duration = getDurationBetween(expiry.timestamp, currentTime);
  let durationValue = duration.asSeconds();
  let unit = 'm';
  if (durationValue > constants.SECONDS_IN_HOUR) return null;
  if (durationValue > constants.SECONDS_IN_MINUTE) {
    durationValue = Math.round(duration.asMinutes());
  } else {
    unit = 's';
  }
  return (
    <div className={Styles.CountdownLabel}>
      {durationValue}
      {unit}
    </div>
  );
};

interface RedFlagProps {
  market: Getters.Markets.MarketInfo;
}

export const RedFlag = ({ market }: RedFlagProps) => {
  const { theme } = useAppStatusStore();
  return market.mostLikelyInvalid ? (
    <>
      <label
        className={classNames(TooltipStyles.TooltipHint, Styles.RedFlag)}
        data-tip
        data-for={`tooltip-${market.id}-redFlag`}
        data-iscapture={true}
      >
        {theme !== THEMES.TRADING ? `High Risk` : RedFlagIcon}
      </label>
      <ReactTooltip
        id={`tooltip-${market.id}-redFlag`}
        className={TooltipStyles.Tooltip}
        effect="solid"
        place="right"
        type={theme === THEMES.TRADING ? 'light' : null}
        event="mouseover mouseenter"
        eventOff="mouseleave mouseout scroll mousewheel blur"
      >
        {PROBABLE_INVALID_MARKET}
      </ReactTooltip>
    </>
  ) : null;
};

interface TypeLabelProps {
  type: string;
}

export const TypeLabel = ({type}: TypeLabelProps) => (
  <span className={classNames(Styles.TypeLabel, {[Styles.Ask]: type !== BUY})}>{type}</span>
);

interface TemplateShieldProps {
  market: Getters.Markets.MarketInfo;
}

export const TemplateShield = ({ market }: TemplateShieldProps) => {
  const { theme } = useAppStatusStore();
  const isTrading = theme === THEMES.TRADING;
  if (!market.isTemplate || !isTrading) return null;
  const yellowShield = hasTemplateTextInputs(
    market.template.hash,
    market.marketType === CATEGORICAL
  );
  return (
    <>
      <label
        className={classNames(TooltipStyles.TooltipHint, {
          [Styles.YellowTemplate]: yellowShield,
          [Styles.Template]: !yellowShield,
        })}
        data-tip
        data-for={`tooltip-${market.id}-templateShield`}
        data-iscapture={true}
      >
        {yellowShield ? YellowTemplateIcon : TemplateIcon}
      </label>
      <ReactTooltip
        id={`tooltip-${market.id}-templateShield`}
        className={TooltipStyles.Tooltip}
        effect="solid"
        place="right"
        type='light'
        event="mouseover mouseenter"
        eventOff="mouseleave mouseout scroll mousewheel blur"
      >
        {yellowShield
          ? "Templated market question, contains market creator text. This text should match to highlighted section's tooltip"
          : 'Template markets have predefined terms and have a smaller chance of resolving as invalid'}
      </ReactTooltip>
    </>
  );
};

interface ArchivedProps {
  market: MarketData;
}

export const Archived = ({ market }: ArchivedProps) => {
  if (!market.isArchived) return null;
  return (
    <>
      <label
        className={Styles.Archived}
        data-tip
        data-for={`tooltip-${market.id}-archived`}
        data-iscapture={true}
      >
        {ArchivedIcon}
      </label>
      <ReactTooltip
        id={`tooltip-${market.id}-archived`}
        className={TooltipStyles.Tooltip}
        effect="solid"
        place="top"
        type="light"
        event="mouseover mouseenter"
        eventOff="mouseleave mouseout scroll mousewheel blur"
      >
        Data only saved for 30 days
      </ReactTooltip>
    </>
  );
};

interface DataArchivedProps {
  label: string;
}

export const DataArchivedLabel = ({ label }: DataArchivedProps) => {
  return (
    <div className={Styles.DataArchivedLabel}>
      <label
        data-tip
        data-for={`tooltip-${label}-archived-data`}
        data-iscapture={true}
      >
        Data Archived {QuestionIcon}
      </label>
      <ReactTooltip
        id={`tooltip-${label}-archived-data`}
        className={TooltipStyles.Tooltip}
        effect="solid"
        place="top"
        type="light"
        event="mouseover mouseenter"
        eventOff="mouseleave mouseout scroll mousewheel blur"
      >
        Data only saved for 30 days
      </ReactTooltip>
    </div>
  );
};

export const TimeLabel = ({
  label,
  time,
  hint,
  large,
}: TimeLabelProps) => (
  <div className={classNames(Styles.TimeLabel, { [Styles.Large]: large })}>
    <span>
      {label}
      {hint && (
        <>
          <label
            className={TooltipStyles.TooltipHint}
            data-tip
            data-for={`tooltip-${label.replace(' ', '-')}`}
            data-iscapture={true}
          >
            {QuestionIcon}
          </label>
          <ReactTooltip
            id={`tooltip-${label.replace(' ', '-')}`}
            className={TooltipStyles.Tooltip}
            effect="solid"
            place="right"
            type="light"
            event="mouseover mouseenter"
            eventOff="mouseleave mouseout scroll mousewheel blur"
          >
            {hint}
          </ReactTooltip>
        </>
      )}
    </span>
    <span>{time}</span>
  </div>
);

export const FullTimeLabel = ({
  label,
  time,
  hint,
  large,
}: FullTimeLabelProps) => (
    <div className={classNames(Styles.FullTimeLabel, { [Styles.Large]: large })}>
      <span>
        {label}
        {hint && (
          <>
            <label
              className={TooltipStyles.TooltipHint}
              data-tip
              data-for={`tooltip-${label.replace(' ', '-')}`}
              data-iscapture={true}
            >
              {QuestionIcon}
            </label>
            <ReactTooltip
              id={`tooltip-${label.replace(' ', '-')}`}
              className={TooltipStyles.Tooltip}
              effect="solid"
              place="right"
              type="light"
              event="mouseover mouseenter"
              eventOff="mouseleave mouseout scroll mousewheel blur"
            >
              {hint}
            </ReactTooltip>
          </>
        )}
      </span>
      <span>{time.formattedUtc}</span>
      <span>{time.formattedLocalShortWithUtcOffsetWithoutSeconds}</span>
    </div>
);

export const DashlineNormal = () => (
  <svg width="100%" height="1">
    <line x1="0" x2="100%" y1="0" y2="0" className={Styles.Dashline} />
  </svg>
);

export const DashlineLong = () => (
  <svg width="100%" height="1">
    <line x1="0" x2="100%" y1="0" y2="0" className={Styles.DashlineLong} />
  </svg>
);

export function formatExpandedValue(
  value,
  showDenomination,
  fixedPrecision = false,
  max = '1000',
  min = '0.0001'
) {
  const { fullPrecision, roundedFormatted, denomination, formatted } = value;
  const maxHoverDecimals = 8;
  const minHoverDecimals = 4;
  const fullWithoutDecimals = fullPrecision.split('.')[0];
  const testValue = createBigNumber(fullPrecision);
  const isGreaterThan = testValue.abs().gt(max);
  const isLessThan = testValue.abs().lt(min) && !testValue.eq(ZERO);
  let postfix = isGreaterThan || isLessThan ? String.fromCodePoint(0x2026) : '';
  let frontFacingLabel = isGreaterThan ? fullWithoutDecimals : roundedFormatted;
  const denominationLabel = showDenomination ? `${denomination}` : '';

  let fullValue = fullPrecision;
  if (fixedPrecision) {
    const decimals = fullValue.toString().split('.')[1];
    if (decimals && decimals.length > maxHoverDecimals) {
      const round = formatNumber(fullPrecision, {
        decimals: maxHoverDecimals,
        decimalsRounded: maxHoverDecimals,
      });
      fullValue = round.formatted;
      if (
        fullValue.split('.')[1] &&
        fullValue.split('.')[1].length > maxHoverDecimals
      ) {
        fullValue = round.rounded;
      }
    }

    if (testValue.gte('1000') && fixedPrecision) {
      frontFacingLabel = testValue.toFixed(minHoverDecimals);
    }
  }

  if (fullValue.length === frontFacingLabel.length) {
    postfix = '';
  }

  if (postfix.length && !isGreaterThan) {
    frontFacingLabel = frontFacingLabel.slice(0, -1);
  }

  return {
    fullPrecision: fullValue,
    postfix,
    frontFacingLabel,
    denominationLabel,
  };
}

export function formatDecimalValue(
  value,
  showDenomination,
  usePercent = false
) {
  const { fullPrecision, roundedFormatted, denomination } = value;
  const fullWithoutDecimals = fullPrecision.split('.');
  const denominationLabel = showDenomination ? `${denomination}` : '';

  return {
    fullPrecision,
    postfix: '',
    frontFacingLabel: roundedFormatted,
    denominationLabel,
    showHover:
      !!fullWithoutDecimals[1] &&
      !createBigNumber(roundedFormatted).eq(createBigNumber(fullPrecision)),
  };
}

export const SizableValueLabel = (props: SizableValueLabelProps) => (
  <span
    className={classNames(Styles.SizableValueLabel, {
      [Styles.Large]: props.size === SizeTypes.LARGE,
      [Styles.Small]: props.size === SizeTypes.SMALL,
      [Styles.Highlight]: props.highlight,
    })}
  >
    <ValueLabel {...props} />
  </span>
);

export const ValueLabel = (props: ValueLabelProps) => {
  if (!props.value || props.value === null)
    return props.showEmptyDash ? <span>&#8213;</span> : <span />;

  let expandedValues = formatExpandedValue(props.value, props.showDenomination);

  if (props.showFullPrecision) {
    expandedValues = formatDecimalValue(
      props.value,
      props.showDenomination,
      props.usePercent
    );
  }

  const {
    fullPrecision,
    postfix,
    frontFacingLabel,
    denominationLabel,
    showHover,
  } = expandedValues;

  return (
    <span
      className={classNames(Styles.ValueLabel, {
        [Styles.DarkDash]: props.value.full === '-',
        [Styles.Alert]: props.alert,
      })}
    >
      <label
        data-tip
        data-for={`valueLabel-${fullPrecision}-${denominationLabel}-${props.keyId}`}
        data-iscapture={true}
      >
        {props.usePercent
          ? props.value.percent
          : props.useFull && props.value.full}
        {!props.useFull && !props.usePercent && (
          <span>{denominationLabel}</span>
        )}
        {!props.useFull && !props.usePercent && `${frontFacingLabel}${postfix}`}
      </label>
      {(postfix.length !== 0 || showHover) && !props.usePercent && (
        <ReactTooltip
          id={`valueLabel-${fullPrecision}-${denominationLabel}-${props.keyId}`}
          className={TooltipStyles.Tooltip}
          effect="solid"
          place="top"
          type="light"
          event="mouseover mouseenter"
          eventOff="mouseleave mouseout scroll mousewheel blur"
        >
          {props.useFull && props.value.full}
          {!props.useFull &&
            !props.usePercent &&
            `${denominationLabel}${fullPrecision}`}
        </ReactTooltip>
      )}
    </span>
  );
};

export const TextLabel = ({ text, keyId }: TextLabelProps) => {
  const [state, setState] = useState({
    scrollWidth: 0,
    clientWidth: 0,
    isDisalbed: true,
  });
  const labelRef = useRef({
    current: { clientWidth: 0, scrollWidth: 0 },
  });
  useEffect(() => {
    const { scrollWidth, clientWidth } = labelRef.current;
    setState({ ...state, clientWidth, scrollWidth });
  }, [labelRef.current.clientWidth, labelRef.current.scrollWidth, text]);
  const { theme } = useAppStatusStore();
  const { isDisabled } = state;

  return (
    <span className={Styles.TextLabel}>
      <label
        ref={labelRef}
        data-tip
        data-for={`${keyId}-${text ? text.replace(/\s+/g, '-') : ''}`}
        data-iscapture={true}
      >
        {text}
      </label>
      {!isDisabled && (
        <ReactTooltip
          id={`${keyId}-${text ? text.replace(/\s+/g, '-') : ''}`}
          className={TooltipStyles.Tooltip}
          effect="solid"
          place="top"
          type={theme === THEMES.TRADING ? 'light' : null}
          event="mouseover mouseenter"
          eventOff="mouseleave mouseout scroll mousewheel blur"
        >
          {text}
        </ReactTooltip>
      )}
    </span>
  );
};

export const HoverValueLabel = ({
    value = null,
    showDenomination = false,
    useFull = false
  }) => {
  const [hover, setHover] = useState(false);
  if (value === null) return <span />;

  const expandedValues = formatDecimalValue(value, showDenomination);
  const {
    fullPrecision,
    postfix,
    frontFacingLabel,
    showHover,
  } = expandedValues;

  const frontFacingLabelSplit = frontFacingLabel.toString().split('.');
  const firstHalf = frontFacingLabelSplit[0];
  const secondHalf = frontFacingLabelSplit[1];

  const fullPrecisionSplit = fullPrecision.toString().split('.');
  const firstHalfFull = fullPrecisionSplit[0];
  const secondHalfFull = fullPrecisionSplit[1];
  return (
    <span
      className={Styles.HoverValueLabel}
      onMouseEnter={() => {
        setHover(true);
      }}
      onMouseLeave={() => {
        setHover(false);
      }}
    >
      {hover && showHover ? (
        <span>
          {useFull && value.full}
          {!useFull && (
            <>
              <span>
                {firstHalfFull}
                {secondHalfFull && '.'}
              </span>
              <span>{secondHalfFull}</span>
            </>
          )}
        </span>
      ) : (
        <span>
          {useFull && value.formatted}
          {!useFull && (
            <>
              <span>
                {firstHalf}
                {secondHalf && '.'}
              </span>
              <span>
                {secondHalf} {postfix}
              </span>
            </>
          )}
        </span>
      )}
    </span>
  );
}

export const InvalidLabel = ({
  text,
  keyId,
  tooltipPositioning,
}: InvalidLabelProps) => {
  const {
    theme,
    actions: { setModal },
  } = useAppStatusStore();
  const {
    explainerBlockTitle: title,
    explainerBlockSubtexts: subtexts,
    useBullets,
  } = EventDetailsContent();

  const openModal = event => {
    event.preventDefault();
    event.stopPropagation();
    setModal({ type: MODAL_INVALID_MARKET_RULES });
  };

  return (
    <span className={Styles.InvalidLabel}>
      {constants.INVALID_OUTCOME_LABEL}
      <label
        data-tip
        data-for={`${keyId}-${text ? text.replace(/\s+/g, '-') : ''}`}
        data-iscapture={true}
        onClick={event => openModal(event)}
      >
        {QuestionIcon}
      </label>
      <ReactTooltip
        id={`${keyId}-${text.replace(/\s+/g, '-')}`}
        className={classNames(
          TooltipStyles.Tooltip,
          TooltipStyles.TooltipInvalidRules
        )}
        effect="solid"
        place={tooltipPositioning || 'left'}
        type={theme === THEMES.TRADING ? 'dark' : null}
        event="mouseover mouseenter"
        eventOff="mouseleave mouseout scroll mousewheel blur"
      >
        <MultipleExplainerBlock
          contents={[
            {
              title,
              subtexts,
              useBullets,
            },
            {
              title: AugurMarketsContent().explainerBlockTitle,
              subtexts: AugurMarketsContent().explainerBlockSubtexts,
              useBullets: AugurMarketsContent().useBullets,
            },
          ]}
        />
      </ReactTooltip>
    </span>
  );
};

export const PropertyLabel = ({
  large,
  label,
  hint,
  value,
}: PropertyLabelProps) => (
  <div className={classNames(Styles.PropertyLabel, { [Styles.Large]: large })}>
    <span>
      {label}
      {hint && (
        <>
          <label
            className={TooltipStyles.TooltipHint}
            data-tip
            data-for={`tooltip-${label.replace(' ', '-')}`}
            data-iscapture={true}
          >
            {QuestionIcon}
          </label>
          <ReactTooltip
            id={`tooltip-${label.replace(' ', '-')}`}
            className={TooltipStyles.Tooltip}
            effect="solid"
            place="right"
            type="light"
            event="mouseover mouseenter"
            eventOff="mouseleave mouseout scroll mousewheel blur"
          >
            {hint}
          </ReactTooltip>
        </>
      )}
    </span>
    <span>{value}</span>
  </div>
);

interface TransactionFeeLabelProps {
  gasCostDai: FormattedNumber;
  isError: boolean;
}

export const TransactionFeeLabel = ({
  gasCostDai,
}: TransactionFeeLabelProps) => {
  const label = getTransactionLabel();
  return (
    <LinearPropertyLabel
      label={label}
      value={gasCostDai}
      showDenomination={true}
    />
  );
};

export const TransactionFeeLabelToolTip = ({
  isError,
  gasCostDai,
}: TransactionFeeLabelProps) => {
  const label = getTransactionLabel();
  return (
    <LinearPropertyLabelUnderlineTooltip
      label={label}
      value={gasCostDai}
      showDenomination={true}
      highlight
      accentValue={isError}
      id={'transaction_fee'}
      tipText={`Est. TX Fee is not included in profit and loss`}
    />
  );
};

export const LinearPropertyLabel = ({
  highlight,
  highlightAlternateBolded,
  highlightFirst,
  label,
  useValueLabel,
  showDenomination,
  accentValue,
  value,
  useFull,
  underline,
  onValueClick,
  regularCase,
  secondary,
  recentlyUpdated
}: LinearPropertyLabelProps) => (
  <div
    className={classNames(Styles.LinearPropertyLabel, {
      [Styles.Highlight]: highlight,
      [Styles.HighlightAlternateBolded]: highlightAlternateBolded,
      [Styles.HighlightFirst]: highlightFirst,
      [Styles.RecentlyUpdated]: recentlyUpdated
    })}
  >
    <span
      className={classNames({
        [Styles.RegularCase]: regularCase,
    })}
    >{label}</span>
    <DashlineNormal />
    {useValueLabel ? (
      <ValueLabel
        value={value}
        showDenomination={showDenomination}
        useFull={useFull}
      />
    ) : (
      <span
        className={classNames({
          [Styles.isAccented]: accentValue,
          [Styles.underline]: underline,
          [Styles.isSecondary]: secondary,
        })}
        onClick={() => onValueClick && onValueClick()}
      >
        {value && value.formatted
          ? `${
              showDenomination || useFull ? value.full : value.roundedFormatted
            }`
          : value}
      </span>
    )}
  </div>
);

export const MarketTypeLabel = ({
  marketType,
  isWarpSync,
}: MarketTypeProps) => {
  if (!marketType) {
    return null;
  }
  const labelTexts = {
    [YES_NO]: 'Yes/No',
    [CATEGORICAL]: 'Categorical',
    [SCALAR]: 'Scalar Market',
  };
  const text = isWarpSync ? 'Warp Sync Market' : labelTexts[marketType];
  const isScalar = !isWarpSync && marketType === SCALAR;

  return (
    <span
      className={classNames(Styles.MarketTypeLabel, {
        [Styles.MarketScalarLabel]: isScalar,
        [Styles.MarketStatus_warpSync]: isWarpSync,
      })}
    >
      {text} {isScalar && ScalarIcon}
    </span>
  );
};

interface LiquidityDepletedLabelProps {
  market: MarketData;
}

export const LiquidityDepletedLabel = ({
  market,
}: LiquidityDepletedLabelProps) => {
  if (
    market.passDefaultLiquiditySpread ||
    market.hasPendingLiquidityOrders ||
    market.marketStatus === constants.MARKET_CLOSED
  )
    return null;
  return (
    <span
      className={classNames(Styles.LiquidityDepletedLabel)}
      data-tip
      data-for={'liquidityDepleted' + market.id}
      data-iscapture={true}
    >
      LIQUIDITY DEPLETED
      <ReactTooltip
        id={'liquidityDepleted' + market.id}
        className={TooltipStyles.Tooltip}
        effect="solid"
        place="top"
        type="light"
        event="mouseover mouseenter"
        eventOff="mouseleave mouseout scroll mousewheel blur"
      >
        No longer passing the Liquidity spread filter, add more liquidity to
        have your market seen. Liquidity indicator updates every minute.
      </ReactTooltip>
    </span>
  );
};
export interface MarketStatusLabelProps {
  reportingState: string;
  mini?: boolean;
  isWarpSync?: boolean; 
};

export const MarketStatusLabel = ({
  reportingState,
  mini = false,
  isWarpSync = false,
}: MarketStatusLabelProps) => {
  let open = false;
  let resolved = false;
  let reporting = false;
  let text: string;
  switch (reportingState) {
    case REPORTING_STATE.UNKNOWN:
    case REPORTING_STATE.PRE_REPORTING:
      open = true;
      text = constants.MARKET_STATUS_MESSAGES.OPEN;
      break;
    case REPORTING_STATE.AWAITING_FINALIZATION:
      resolved = true;
      text = constants.MARKET_STATUS_MESSAGES.AWAITING_RESOLVED;
      break;
    case REPORTING_STATE.FINALIZED:
      resolved = true;
      text = constants.MARKET_STATUS_MESSAGES.RESOLVED;
      break;
    default:
      reporting = true;
      text = constants.MARKET_STATUS_MESSAGES.IN_REPORTING;
      break;
  }

  if (isWarpSync) {
    text = 'Warp Sync Market';
  }
  return (
    <span
      className={classNames(Styles.MarketStatus, {
        [Styles.MarketStatus_mini]: mini,
        [Styles.MarketStatus_open]: open,
        [Styles.MarketStatus_resolved]: resolved,
        [Styles.MarketStatus_reporting]: reporting,
        [Styles.MarketStatus_warpSync]: isWarpSync,
      })}
    >
      {text}
    </span>
  );
};

export const InReportingLabel = ({ reportingState, disputeInfo, isWarpSync, isForkingMarket }: InReportingLabelProps) => {

  const reportingStates = [
    REPORTING_STATE.DESIGNATED_REPORTING,
    REPORTING_STATE.OPEN_REPORTING,
    REPORTING_STATE.AWAITING_NEXT_WINDOW,
    REPORTING_STATE.CROWDSOURCING_DISPUTE,
  ];

  if (!reportingStates.includes(reportingState)) {
    return <MarketStatusLabel reportingState={reportingState} isWarpSync={isWarpSync} />;
  }

  let reportingExtraText: string | null;
  // const text: string = constants.IN_REPORTING;
  const text = '';

  if (reportingState === REPORTING_STATE.DESIGNATED_REPORTING) {
    reportingExtraText = constants.WAITING_ON_REPORTER;
  } else if (reportingState === REPORTING_STATE.OPEN_REPORTING) {
    reportingExtraText = constants.OPEN_REPORTING;
  } else if (disputeInfo && disputeInfo.disputePacingOn) {
    reportingExtraText = constants.SLOW_DISPUTE;
  } else if (disputeInfo && !disputeInfo.disputePacingOn) {
    reportingExtraText = constants.FAST_DISPUTE;
  } else {
    reportingExtraText = null;
  }

  if (isWarpSync) {
    reportingExtraText = 'Warp Sync Market';
  }

  if (isForkingMarket) {
    reportingExtraText = 'Forking Market';
  }

  return (
    <span
      className={classNames(
        Styles.MarketStatus,
        Styles.MarketStatus_reporting,
        {
          [Styles.MarketStatus_warpSync]: isWarpSync,
          [Styles.MarketStatus_forking]: isForkingMarket,
        }
      )}
    >
      {isForkingMarket && ExclamationCircle}
      {text}
      {reportingExtraText && (
        <span className={Styles.InReporting_reportingDetails}>
          {/* {DoubleArrows} */}
          {reportingExtraText}
        </span>
      )}
    </span>
  );
};

interface PendingLabelProps {
  status?: string;
}

export const PendingLabel = ({ status }: PendingLabelProps) => (
  <span
    className={classNames(Styles.PendingLabel, {
      [Styles.Failure]: status === TXEventName.Failure,
    })}
    data-tip
    data-for={'processing'}
    data-iscapture={true}
  >
    {(!status ||
      status === TXEventName.Pending ||
      status === TXEventName.AwaitingSigning) && (
      <>
        <span>
          Processing <ClipLoader size={8} color="#ffffff" />
        </span>
        <ReactTooltip
          id={'processing'}
          className={TooltipStyles.Tooltip}
          effect="solid"
          place="top"
          type="light"
          event="mouseover mouseenter"
          eventOff="mouseleave mouseout scroll mousewheel blur"
        >
          You will receive an alert when the transaction has finalized.
        </ReactTooltip>
      </>
    )}
    {status === TXEventName.Failure && <span>Failed</span>}
  </span>
);

export const ConfirmedLabel = () => (
  <span className={Styles.ConfirmedLabel}>Confirmed {CheckCircleIcon}</span>
);

export const MovementIcon = (props: MovementIconProps) => {
  const getIconSizeStyles: Function = (size: SizeTypes): string =>
    classNames(Styles.MovementLabel_Icon, {
      [Styles.MovementLabel_Icon_small]: size == SizeTypes.SMALL,
      [Styles.MovementLabel_Icon_normal]: size == SizeTypes.NORMAL,
      [Styles.MovementLabel_Icon_large]: size == SizeTypes.LARGE,
    });

  const getIconColorStyles: Function = (value: number): string =>
    classNames({
      [Styles.MovementLabel_Icon_positive]: value > 0,
      [Styles.MovementLabel_Icon_negative]: value < 0,
    });

  const iconSize = getIconSizeStyles(props.size);
  const iconColor = getIconColorStyles(props.value);

  return <div className={`${iconSize} ${iconColor}`}>{MarketIcon}</div>;
};

export const MovementText = ({
  value,
  size,
  showPlusMinus,
  showBrackets,
  hideNegative,
  useFull,
  numberValue,
}: MovementTextProps) => {
  const getTextSizeStyle: Function = (sz: SizeTypes): string =>
    classNames(Styles.MovementLabel_Text, {
      [Styles.MovementLabel_Text_small]: sz == SizeTypes.SMALL,
      [Styles.MovementLabel_Text_normal]: sz == SizeTypes.NORMAL,
      [Styles.MovementLabel_Text_large]: sz == SizeTypes.LARGE,
    });
  const getTextColorStyles: Function = (val: number): string =>
    classNames({
      [Styles.MovementLabel_Text_positive]: val > 0,
      [Styles.MovementLabel_Text_negative]: val < 0,
      [Styles.MovementLabel_Text_neutral]: val === 0,
    });

  const textColorStyle = getTextColorStyles(numberValue);
  const textSizeStyle = getTextSizeStyle(size);

  const handlePlusMinus: Function = (label: string): string => {
    if (showPlusMinus) {
      if (numberValue > 0) {
        return '+'.concat(label);
      }
    } else {
      if (numberValue < 0 && hideNegative) {
        return label.replace('-', '');
      }
    }
    return label;
  };

  const addBrackets: Function = (label: string): string => {
    if (showBrackets) {
      return `(${label})`;
    }
    return label;
  };

  const formattedString = addBrackets(
    handlePlusMinus(useFull ? value.full : value.formatted)
  );

  return (
    <div className={`${textColorStyle} ${textSizeStyle}`}>
      {formattedString}
    </div>
  );
};

export const MovementLabel = ({
  value,
  styles,
  size = SizeTypes.NORMAL,
  showBrackets = false,
  showPlusMinus = false,
  showIcon = false,
  hideNegative = false,
  useFull = false,
}: MovementLabelProps) => {
  const numberValue = typeof value === 'number' ? value : value.value;
  return (
    <div
      className={Styles.MovementLabel}
      style={
        showIcon
          ? { ...styles, justifyContent: 'space-between' }
          : { ...styles, justifyContent: 'flex-end' }
      }
    >
      {showIcon && numberValue !== 0 && (
        <MovementIcon value={numberValue} size={size} />
      )}
      {
        <MovementText
          value={value}
          numberValue={numberValue}
          size={size}
          showBrackets={showBrackets}
          showPlusMinus={showPlusMinus}
          useFull={useFull}
          hideNegative={hideNegative}
        />
      }
    </div>
  );
};

export const PillLabel = ({ label, hideOnMobile }: PillLabelProps) => (
  <span
    className={classNames(Styles.PillLabel, {
      [Styles.HideOnMobile]: hideOnMobile,
    })}
  >
    {label}
  </span>
);

export const RepBalance = (props: RepBalanceProps) => (
  <div
    className={classNames(Styles.RepBalance, {
      [Styles.Alternate]: props.alternate,
      [Styles.Larger]: props.larger,
    })}
  >
    <span>{constants.TOTAL_ACCOUNT_VALUE_IN_REP}</span>
    <span>{props.rep}</span>
    <span>rep</span>
  </div>
);

export const PositionTypeLabel = (props: PositionTypeLabelProps) => {
  let type = props.type;
  if (props.pastTense) type = props.type !== SELL ? BOUGHT : SOLD;

  return (
    <span
      className={classNames(Styles.PositionTypeLabel, {
        [Styles.Sell]:
          props.type === SHORT ||
          props.type === SELL ||
          props.type === CLOSED_SHORT,
        [Styles.Closed]: props.type === CLOSED,
      })}
    >
      {type}
    </span>
  );
};

export const LinearPropertyLabelMovement = (
  props: LinearPropertyLabelPercentMovementProps
) => (
  <span className={Styles.LinearPropertyLabelPercent}>
    <LinearPropertyLabel
      label={props.label}
      value={props.value}
      highlightFirst={props.highlightFirst}
      highlightAlternate
      useFull={props.useFull}
      useValueLabel={props.useValueLabel}
    />
    <MovementLabel
      showIcon={props.showIcon}
      showBrackets={props.showBrackets}
      showPlusMinus={props.showPlusMinus}
      value={props.movementValue}
      useFull={props.useFull}
    />
  </span>
);

export const LinearPropertyLabelTooltip = (
  props: LinearPropertyLabelTooltipProps
) => (
  <span className={Styles.LinearPropertyLabelTooltip}>
    <LinearPropertyLabel label={props.label} value={props.value} />
    <div>
      <label
        className={TooltipStyles.TooltipHint}
        data-tip
        data-for={`tooltip-${props.label}`}
        data-iscapture={true}
      >
        {HintAlternate}
      </label>
      <ReactTooltip
        id={`tooltip-${props.label}`}
        className={TooltipStyles.Tooltip}
        effect="solid"
        place="top"
        type="light"
        event="mouseover mouseenter"
        eventOff="mouseleave mouseout scroll mousewheel blur"
      >
        Information text
      </ReactTooltip>
    </div>
  </span>
);

interface StatusDotTooltipProps {
  status: string;
  tooltip: string;
  title: string;
}

export const StatusDotTooltip = ({
  status,
  tooltip,
  title,
}: StatusDotTooltipProps) => (
  <>
    {status && (
      <div className={classNames(Styles.StatusDotTooltip)}>
        <span
          data-tip
          data-for={`tooltip-${status}`}
          data-iscapture={true}
          className={classNames({
            [Styles.Ready]: status === constants.ZEROX_STATUSES.SYNCED,
            [Styles.Lag]:
              status !== constants.ZEROX_STATUSES.SYNCED &&
              status !== constants.ZEROX_STATUSES.ERROR,
            [Styles.Error]: status === constants.ZEROX_STATUSES.ERROR,
          })}
        ></span>
        <ReactTooltip
          id={`tooltip-${status}`}
          className={TooltipStyles.Tooltip}
          effect="solid"
          place="top"
          type="light"
          event="mouseover mouseenter"
          eventOff="mouseleave mouseout scroll mousewheel blur"
        >
          {tooltip}
        </ReactTooltip>
        {title}
      </div>
    )}
    {!status && title}
  </>
);

export const StatusErrorMessage = () => {
  const { zeroXStatus: status } = useAppStatusStore();
  if (status !== constants.ZEROX_STATUSES.ERROR) return null;
  return (
    <div className={classNames(Styles.StatusErrorMessage)}>
      <span>
        {ExclamationCircle}
        {constants.ZEROX_STATUSES_TOOLTIP[constants.ZEROX_STATUSES.ERROR]}
      </span>
    </div>
  );
};

interface LinearPropertyLabelUnderlineTooltipProps
  extends LinearPropertyLabelProps {
  tipText: string;
  id: string;
}

export const LinearPropertyLabelUnderlineTooltip = ({
  tipText,
  value,
  id,
  label,
  accentValue,
  highlight,
  showDenomination,
  useFull,
}: LinearPropertyLabelUnderlineTooltipProps) => (
  <div className={Styles.LinearPropertyLabel}>
    <span>{label}</span>
    <DashlineNormal />
    <span
      className={classNames({
        [Styles.TEXT]: !!tipText,
        [Styles.isAccented]: accentValue,
        [Styles.isHighlighted]: highlight,
      })}
      data-tip
      data-for={`underlinetooltip-${id}`}
      data-iscapture={true}
    >
      {value && value.formatted
        ? `${showDenomination || useFull ? value.full : value.roundedFormatted}`
        : value}
      <ReactTooltip
        id={`underlinetooltip-${id}`}
        className={TooltipStyles.Tooltip}
        effect="solid"
        place="right"
        type="light"
        event="mouseover mouseenter"
        eventOff="mouseleave mouseout scroll mousewheel blur"
      >
        {tipText}
      </ReactTooltip>
    </span>
  </div>
);

export const LinearPropertyViewTransaction = (
  props: LinearPropertyLabelViewTransactionProps
) => (
  <div
    className={classNames(
      Styles.LinearPropertyLabel,
      Styles.LinearPropertyViewTransaction
    )}
  >
    <LinearPropertyLabel
      label="Transaction Details"
      value=""
      highlightFirst={props.highlightFirst}
    />
    <ViewTransactionDetailsButton
      light
      transactionHash={props.transactionHash}
    />
  </div>
);

export const WordTrail: React.FC<WordTrailProps> = ({
  items,
  typeLabel,
  children,
}) => (
  <div className={Styles.WordTrail}>
    {children}
    {items.map(({ label, onClick }, index) => (
      <button
        key={`${label}-${index}`}
        data-testid={`${typeLabel}-${index}`}
        className={Styles.WordTrailButton}
        onClick={e => onClick()}
      >
        <span>{label}</span>
        <span>{index !== items.length - 1 && '/'}</span>
      </button>
    ))}
  </div>
);

WordTrail.defaultProps = {
  items: [],
  typeLabel: 'label-type',
};

export const CategoryTagTrail = ({ categories }: CategoryTagTrailProps) => (
  <div className={Styles.CategoryTagTrail}>
    <WordTrail items={categories} typeLabel="Category" />
  </div>
);

interface BulkTxLabelProps {
  count: number;
  needsApproval: boolean;
  buttonName: string;
  className?: string;
}
export const BulkTxLabel = ({
  count,
  needsApproval,
  buttonName,
  className,
}: BulkTxLabelProps) =>
  count > 1 || needsApproval ? (
    <div className={classNames(Styles.ModalMessageLabel, className)}>
      <DismissableNotice
        show={true}
        description=""
        title={`${buttonName} requires ${count} transaction${
          count > 1 ? `s` : ``
        }${needsApproval ? `, and 1 approval` : ''}`}
        buttonType={DISMISSABLE_NOTICE_BUTTON_TYPES.NONE}
      />
    </div>
  ) : null;

export const ModalLabelNotice = (props: DismissableNoticeProps) => (
  <div className={classNames(Styles.ModalMessageLabel)}>
    <DismissableNotice {...props} />
  </div>
);

export const InitializeWalletModalNotice = () => {
  const gsnUnavailable = isGSNUnavailable();

  return (
    <>
      {gsnUnavailable && (
        <div className={classNames(Styles.ModalMessageLabelInitWallet)}>
          <DismissableNotice
            show
            buttonType={DISMISSABLE_NOTICE_BUTTON_TYPES.NONE}
            title={`The fee displayed is higher than normal because it includes a one time only account activation.`}
          />
        </div>
      )}
    </>
  );
};

interface EthReseveProps {
  gasLimit: FormattedNumber;
}

export const EthReserveNotice = ({ gasLimit }: EthReseveProps) => {
  const {
    gasPriceInfo,
    loginAccount: {
      balances: { dai },
    },
    env,
  } = AppStatus.get();
  const aboveCutoff = createBigNumber(dai).isGreaterThan(
    createBigNumber(env.gsn.minDaiForSignerETHBalanceInDAI)
  );
  let show = true;
  if (aboveCutoff) {
    show = false;
  }

  const ethInReserve = getEthReserve();
  const gasPrice = gasPriceInfo.userDefinedGasPrice || gasPriceInfo.average;
  const estTransactionFee = createBigNumber(
    formatGasCostToEther(
      gasLimit,
      { decimalsRounded: 4 },
      createBigNumber(GWEI_CONVERSION).multipliedBy(gasPrice)
    )
  );

  show = createBigNumber(estTransactionFee)
    .minus(createBigNumber(ethInReserve.value))
    .gt(0);

  let reserve = formatBlank();
  if (show) {
    const attoEthToDaiRate: BigNumber = getEthForDaiRate();
    const attoEthReserve = formatAttoEth(env.gsn.desiredSignerBalanceInETH)
      .value;
    const diffReserve = createBigNumber(attoEthReserve).minus(
      createBigNumber(ethInReserve.value).div(10 ** 18)
    );
    reserve = ethToDai(
      diffReserve.lte(0) ? attoEthReserve : diffReserve,
      createBigNumber(attoEthToDaiRate || 0)
    );
  }
  return (
    <>
      {show && (
        <div className={classNames(Styles.EthReserveNotice)}>
          <DismissableNotice
            show
            buttonType={DISMISSABLE_NOTICE_BUTTON_TYPES.NONE}
            title={`Replenish Fee reserves`}
            description={`$${reserve.formatted} DAI will be added to your Fee reserves`}
          />
        </div>
      )}
    </>
  );
};

export const EthReserveAutomaticTopOff = () => {
  const {
    loginAccount: { balances },
    env: { gsn },
  } = useAppStatusStore();
  // top off buffer is used to determine to show automatic top off checkbox
  const topoffBuffer = createBigNumber(1.2);
  const tradingAccountDai = createBigNumber(balances.dai);
  const signerEth = createBigNumber(balances.signerBalances.eth);
  const aboveCutoff = tradingAccountDai.gt(
    createBigNumber(gsn.minDaiForSignerETHBalanceInDAI)
  );
  const aboveTopOff = signerEth.gt(
    createBigNumber(gsn.desiredSignerBalanceInETH).times(topoffBuffer)
  );
  const show = aboveCutoff && !aboveTopOff;
  // using useState b/c lag in setting/getting property from sdk.
  const [checked, setChecked] = useState(
    augurSdk?.client?.getUseDesiredEthBalance()
  );
  if (!show) return null;
  return (
    <div
      className={classNames(Styles.Checkbox, {
        [Styles.CheckboxChecked]: checked,
      })}
      role="button"
      onClick={e => {
        if (checked !== null) {
          augurSdk?.client?.setUseDesiredEthBalance(!checked);
          setChecked(!checked);
        }
      }}
    >
      {checked ? FilledCheckbox : EmptyCheckbox}
      {AUTO_ETH_REPLENISH}
    </div>
  );
};

export const AutoCancelOrdersNotice = () => (
  <div className={classNames(Styles.ModalMessageAutoCancel)}>
    <DismissableNotice
      show
      buttonType={DISMISSABLE_NOTICE_BUTTON_TYPES.NONE}
      title={`When cashing out, all open orders will automatically be cancelled, positions are left unchanged.`}
    />
  </div>
);

export const ValueDenomination: React.FC<ValueDenominationProps> = ({
  className,
  prefix,
  hidePrefix,
  formatted,
  fullPrecision,
  valueClassname,
  denomination,
  hideDenomination,
  postfix,
  hidePostfix,
  value,
}) => (
  <span className={Styles[className]}>
    {prefix && !hidePrefix && <span className={Styles.prefix}>{prefix}</span>}
    {formatted && fullPrecision && (
      <span
        data-tip={fullPrecision}
        data-event="click focus"
        className={`value_${valueClassname}`}
      >
        {formatted}
      </span>
    )}
    {formatted && !fullPrecision && (
      <span className={`value_${valueClassname}`}>{formatted}</span>
    )}
    {denomination && !hideDenomination && (
      <span className={Styles.denomination}>{denomination}</span>
    )}
    {postfix && !hidePostfix && (
      <span className={Styles.postfix}>{postfix}</span>
    )}
    {!value && value !== 0 && !formatted && formatted !== '0' && (
      <span>&mdash;</span>
    ) // null/undefined state handler
    }
  </span>
);

ValueDenomination.defaultProps = {
  className: null,
  valueClassname: null,
  prefix: null,
  postfix: null,
  value: null,
  formatted: null,
  fullPrecision: null,
  denomination: null,
  hidePrefix: false,
  hidePostfix: false,
  hideDenomination: false,
};

export const MarketStateLabel = (props: MarketStateLabelProps) => (
  <div
    onClick={() => props.handleClick()}
    className={classNames(Styles.MarketLabel, {
      [Styles.selected]: props.selected,
      [Styles.loading]: props.loading,
      [Styles.open]: props.marketType === constants.MARKET_OPEN,
      [Styles.inReporting]: props.marketType === constants.MARKET_REPORTING,
      [Styles.resolved]: props.marketType === constants.MARKET_CLOSED,
    })}
  >
    <div>{props.label}</div>
    {props.selected && !props.loading && <div>({props.count})</div>}
    {props.loading && props.selected && (
      <div>
        <span>{LoadingEllipse}</span>
      </div>
    )}
  </div>
);

interface DiscordLinkProps {
  label?: string;
}

export const DiscordLink = (props: DiscordLinkProps) => (
  <div className={Styles.discordLink}>
    {props.label}
    <a href={DISCORD_LINK} target="_blank" rel="noopener noreferrer">
      Discord
    </a>
  </div>
);

export const AddFundsHelp = props => (
  <ol>
    <li>
      Add ETH to your {props.walletType} trading account.{' '}
      {props.walletType === ACCOUNT_TYPES.WEB3WALLET
        ? ''
        : `${props.walletType} are our secure account and payment partners. ${props.walletType} will enable you to process the transaction fee without requiring Dai.`}{' '}
      {props.walletType === ACCOUNT_TYPES.WEB3WALLET ? null : (
        <span onClick={() => props.showAddFundsModal()}>
          Add ETH to your {props.walletType} trading account
        </span>
      )}
    </li>
    <li>
      After you have sent the ETH to your {props.walletType} trading account you
      can then return and make the transaction.
    </li>
  </ol>
);
