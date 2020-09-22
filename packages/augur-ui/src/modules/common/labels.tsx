import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
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
  EmptyCheckbox
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
  CLOSED_SHORT,
  GWEI_CONVERSION,
  AUTO_ETH_REPLENISH,
} from 'modules/common/constants';
import { ViewTransactionDetailsButton } from 'modules/common/buttons';
import { formatNumber, formatBlank, formatGasCostToEther, formatAttoEth, formatEther } from 'utils/format-number';
import { DateFormattedObject, FormattedNumber, SizeTypes, MarketData } from 'modules/types';
import type { Getters } from '@augurproject/sdk';
import { TXEventName } from '@augurproject/sdk-lite';
import {
  DISMISSABLE_NOTICE_BUTTON_TYPES,
  DismissableNotice,
  DismissableNoticeProps,
} from 'modules/reporting/common';
import { hasTemplateTextInputs } from '@augurproject/templates';
import { AugurMarketsContent, EventDetailsContent, InvalidTradingTooltip } from 'modules/create-market/constants';
import { MultipleExplainerBlock } from 'modules/create-market/components/common';
import { getDurationBetween } from 'utils/format-date';
import { useTimer } from 'modules/common/progress';
import { isGSNUnavailable } from 'modules/app/selectors/is-gsn-unavailable';
import { AppState } from 'appStore';
import { Ox_STATUS } from 'modules/app/actions/update-app-status';
import { ethToDai } from 'modules/app/actions/get-ethToDai-rate';
import { augurSdk } from 'services/augursdk';
import { getGasCost } from 'modules/modal/gas';
import { addPendingData } from 'modules/pending-queue/actions/pending-queue-management';

export interface MarketTypeProps {
  marketType: string;
}

export interface MarketStatusProps {
  marketStatus: string;
  reportingState: string;
  endTimeFormatted: DateFormattedObject;
  currentAugurTimestamp: number;
  isWarpSync?: boolean;
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
  maxPrice?: string;
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
  time: DateFormattedObject;
  showLocal?: boolean;
  hint?: React.ReactNode;
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
  return market.mostLikelyInvalid ? (
    <>
      <label
        className={TooltipStyles.TooltipHint}
        data-tip
        data-for={`tooltip-${market.id}-redFlag`}
        data-iscapture={true}
      >
        {RedFlagIcon}
      </label>
      <ReactTooltip
        id={`tooltip-${market.id}-redFlag`}
        className={TooltipStyles.Tooltip}
        effect="solid"
        place="right"
        type="light"
        event="mouseover mouseenter"
        eventOff="mouseleave mouseout scroll mousewheel blur"
      >
        {PROBABLE_INVALID_MARKET}
      </ReactTooltip>
    </>
  ) : null;
};

interface TemplateShieldProps {
  market: Getters.Markets.MarketInfo;
}

export const TemplateShield = ({ market }: TemplateShieldProps) => {
  if (!market.isTemplate) return null;
  const yellowShield = hasTemplateTextInputs(market.template.hash, market.marketType === CATEGORICAL);
  return (
    <>
      <label
        className={TooltipStyles.TooltipHint}
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
        type="light"
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

export const TimeLabel = ({ label, time, showLocal, hint }: TimeLabelProps) => (
  <div className={Styles.TimeLabel}>
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
    <span>{time && time.formattedShortUtc}</span>
    {showLocal && (
      <span>{time && time.formattedLocalShortDateTimeWithTimezone}</span>
    )}
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
  usePercent = false,
) {
  const { fullPrecision, roundedFormatted, denomination } = value;
  const fullWithoutDecimals = fullPrecision.split('.');
  const denominationLabel = showDenomination ? `${denomination}` : '';

  return {
    fullPrecision,
    postfix: '',
    frontFacingLabel: roundedFormatted,
    denominationLabel,
    showHover: !!fullWithoutDecimals[1] && !createBigNumber(roundedFormatted).eq(createBigNumber(fullPrecision))
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
    <ValueLabel
      {...props}
    />
  </span>
);

export const ValueLabel = (props: ValueLabelProps) => {
  if (!props.value || props.value === null)
    return props.showEmptyDash ? <span>&#8213;</span> : <span />;

  let expandedValues = formatExpandedValue(
    props.value,
    props.showDenomination
  );

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
    showHover
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
        {!props.useFull && !props.usePercent && <span>{denominationLabel}</span>}
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
          {!props.useFull && !props.usePercent && `${denominationLabel}${fullPrecision}`}
        </ReactTooltip>
      )}
    </span>
  );
};

export class TextLabel extends React.Component<TextLabelProps, TextLabelState> {
  labelRef: any = null;
  state: TextLabelState = {
    scrollWidth: null,
    clientWidth: null,
    isDisabled: true,
  };

  measure() {
    const { clientWidth, scrollWidth } = this.labelRef;

    this.setState({
      scrollWidth,
      clientWidth,
      isDisabled: !(scrollWidth > clientWidth),
    });
  }

  componentDidMount() {
    this.measure();
  }

  componentDidUpdate() {
    this.measure();
  }

  shouldComponentUpdate(nextProps: any, nextState: any) {
    return (
      this.state.scrollWidth !== nextState.scrollWidth ||
      this.state.clientWidth !== nextState.clientWidth ||
      this.props.text !== nextProps.text
    );
  }
  render() {
    const { text, keyId } = this.props;
    const { isDisabled } = this.state;

    return (
      <span className={Styles.TextLabel}>
        <label
          ref={ref => (this.labelRef = ref)}
          data-tip
          data-for={`${keyId}-${text ? text.replace(/\s+/g, '-') : ''}`}
          data-iscapture={true}
        >
          {text}
        </label>
        {!isDisabled && (
          <ReactTooltip
            id={`${keyId}-${text.replace(/\s+/g, '-')}`}
            className={TooltipStyles.Tooltip}
            effect="solid"
            place="top"
            type="light"
            event="mouseover mouseenter"
            eventOff="mouseleave mouseout scroll mousewheel blur"
          >
            {text}
          </ReactTooltip>
        )}
      </span>
    );
  }
}

export class HoverValueLabel extends React.Component<
  ValueLabelProps,
  HoverValueLabelState
> {
  state: HoverValueLabelState = {
    hover: false,
  };
  render() {
    const { value, showDenomination, useFull } = this.props;
    if (!value || value === null) return <span />;

    const expandedValues = formatDecimalValue(
      value,
      showDenomination
    );
    const { fullPrecision, postfix, frontFacingLabel, showHover } = expandedValues;

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
          this.setState({
            hover: true,
          });
        }}
        onMouseLeave={() => {
          this.setState({
            hover: false,
          });
        }}
      >
        {this.state.hover && showHover ? (
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
}

export const InvalidLabel = ({
  text,
  keyId,
  openInvalidMarketRulesModal,
  tooltipPositioning,
  phrase,
}: InvalidLabelProps) => {
  const openModal = event => {
    event.preventDefault();
    event.stopPropagation();
    openInvalidMarketRulesModal();
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
        className={TooltipStyles.Tooltip}
        effect="solid"
        place={tooltipPositioning || 'left'}
        type="light"
        event="mouseover mouseenter"
        eventOff="mouseleave mouseout scroll mousewheel blur"
      >
        <p onClick={event => openModal(event)} >{phrase}</p>
      </ReactTooltip>
    </span>
  );
};

export const PropertyLabel = (props: PropertyLabelProps) => (
  <div className={Styles.PropertyLabel}>
    <span>
      {props.label}
      {props.hint && (
        <>
          <label
            className={TooltipStyles.TooltipHint}
            data-tip
            data-for={`tooltip-${props.label.replace(' ', '-')}`}
            data-iscapture={true}
          >
            {QuestionIcon}
          </label>
          <ReactTooltip
            id={`tooltip-${props.label.replace(' ', '-')}`}
            className={TooltipStyles.Tooltip}
            effect="solid"
            place="right"
            type="light"
            event="mouseover mouseenter"
            eventOff="mouseleave mouseout scroll mousewheel blur"
          >
            {props.hint}
          </ReactTooltip>
        </>
      )}
    </span>
    <span>{props.value}</span>
  </div>
);

interface TransactionFeeLabelProps {
  label: string;
  gasCostDai: FormattedNumber;
  isError: boolean;
  gasEstimate: number | BigNumber;
  normalGasLimit: number;
}

const mapStateToPropsTransactionFeeLabel = (state: AppState, ownProps) => {
  const gasPrice = state.gasPriceInfo.userDefinedGasPrice || state.gasPriceInfo.average;
  const ethToDaiRate: FormattedNumber = state.appStatus.ethToDaiRate;
  const gasCostDai = getGasCost(ownProps.gasEstimate, gasPrice, ethToDaiRate);
  const normalGasCostDai = ownProps.normalGasLimit && getGasCost(ownProps.normalGasLimit, gasPrice, ethToDaiRate);
  return {
    label: constants.NOT_USE_ETH_RESERVE,
    gasCostDai: ownProps.normalGasLimit ? `${normalGasCostDai.full} to ${gasCostDai.full}` : gasCostDai,
  }
};

export const TransactionFeeLabelCmp = ({
  label,
  gasCostDai,
}: TransactionFeeLabelProps) => (
  <LinearPropertyLabel
    label={label}
    value={gasCostDai}
    showDenomination={true}
  />
);

export const TransactionFeeLabelToolTipCmp = ({
  label,
  isError,
  gasCostDai
}: TransactionFeeLabelProps) => (
    <LinearPropertyLabelUnderlineTooltip
      label={label}
      value={gasCostDai}
      showDenomination={true}
      highlight
      accentValue={isError}
      id={'transaction_fee'}
      tipText={`Est. tx fee is not included in profit and loss`}
    />
)

export const TransactionFeeLabel = connect(
  mapStateToPropsTransactionFeeLabel
)(TransactionFeeLabelCmp);

export const TransactionFeeLabelToolTip = connect(
  mapStateToPropsTransactionFeeLabel
)(TransactionFeeLabelToolTipCmp);

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
}: LinearPropertyLabelProps) => (
  <div
    className={classNames(Styles.LinearPropertyLabel, {
      [Styles.Highlight]: highlight,
      [Styles.HighlightAlternateBolded]: highlightAlternateBolded,
      [Styles.HighlightFirst]: highlightFirst,
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
    [SCALAR]: 'Scalar',
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
      {isScalar && ScalarIcon} {text}
    </span>
  );
};

interface LiquidityDepletedLabelProps {
  market: MarketData;
}

export const LiquidityDepletedLabel = ({
  market,
}: LiquidityDepletedLabelProps) => {
  if (market.passDefaultLiquiditySpread || market.hasPendingLiquidityOrders || market.marketStatus === constants.MARKET_CLOSED)
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

export const MarketStatusLabel = (props: MarketStatusProps) => {
  const { reportingState, mini, isWarpSync } = props;
  let open = false;
  let resolved = false;
  let reporting = false;
  let warpSync = false;
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
    warpSync = true;
    text = 'Warp Sync Market';
  }
  return (
    <span
      className={classNames(Styles.MarketStatus, {
        [Styles.MarketStatus_mini]: mini,
        [Styles.MarketStatus_open]: open,
        [Styles.MarketStatus_resolved]: resolved,
        [Styles.MarketStatus_reporting]: reporting,
        [Styles.MarketStatus_warpSync]: warpSync,
      })}
    >
      {text}
    </span>
  );
};

export const InReportingLabel = (props: InReportingLabelProps) => {
  const { reportingState, disputeInfo, isWarpSync, isForkingMarket } = props;

  const reportingStates = [
    REPORTING_STATE.DESIGNATED_REPORTING,
    REPORTING_STATE.OPEN_REPORTING,
    REPORTING_STATE.AWAITING_NEXT_WINDOW,
    REPORTING_STATE.CROWDSOURCING_DISPUTE,
  ];

  if (!reportingStates.includes(reportingState)) {
    return <MarketStatusLabel {...props} />;
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
        { [Styles.MarketStatus_warpSync]: isWarpSync, [Styles.MarketStatus_forking]: isForkingMarket }
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

export const CustomMarketLabel = ({ isTemplate, inTitle = false }) => {
  if (isTemplate === false) {
    return (
      <span
        className={classNames(
          Styles.MarketStatus,
          Styles.MarketStatus_reporting,
          Styles.MarketStatus_forking,
          { [Styles.MarketStatus_isTitle]: inTitle}
        )}
      >
        {ExclamationCircle}
        {'Custom Market'}
          <span className={Styles.CustomMarketCaution}>
            {/* {DoubleArrows} */}
            {' - Proceed with Caution'}
          </span>
        </span>
    )
  }
  return null;
}

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
    {status === TXEventName.Failure && (
      <span>Failed</span>
    )}
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
    <span>REPv2</span>
  </div>
);

export const PositionTypeLabel = (props: PositionTypeLabelProps) => {
  let type = props.type;
  if (props.pastTense) type = props.type !== SELL ? BOUGHT : SOLD;

  return (
    <span
      className={classNames(Styles.PositionTypeLabel, {
        [Styles.Sell]: props.type === SHORT || props.type === SELL || props.type === CLOSED_SHORT,
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

export const StatusDotTooltip = (props: StatusDotTooltipProps) => (
  <>
    {props.status && (
      <div className={classNames(Styles.StatusDotTooltip)}>
        <span
          data-tip
          data-for={`tooltip-${props.status}`}
          data-iscapture={true}
          className={classNames({
            [Styles.Ready]: props.status === constants.ZEROX_STATUSES.SYNCED,
            [Styles.Lag]:
              props.status !== constants.ZEROX_STATUSES.SYNCED &&
              props.status !== constants.ZEROX_STATUSES.ERROR,
            [Styles.Error]: props.status === constants.ZEROX_STATUSES.ERROR,
          })}
        >
        </span>
        <ReactTooltip
          id={`tooltip-${props.status}`}
          className={TooltipStyles.Tooltip}
          effect="solid"
          place="top"
          type="light"
          event="mouseover mouseenter"
          eventOff="mouseleave mouseout scroll mousewheel blur"
        >
          {props.tooltip}
        </ReactTooltip>
        {props.title}
      </div>
    )}
    {!props.status && props.title}
  </>
);

const mapStateToPropsStatusMessage = (state: AppState) => ({
    status: state.appStatus[Ox_STATUS]
});

export const StatusErrorMessageCmp = ({ status }) => {
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

export const StatusErrorMessage = connect(
  mapStateToPropsStatusMessage
)(StatusErrorMessageCmp);


interface LinearPropertyLabelUnderlineTooltipProps extends LinearPropertyLabelProps {
  tipText: string,
  id: string,
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


interface ApprovalTxButtonLabelProps {
  checkApprovals: Function;
  doApprovals: Function;
  buttonName: string;
  className?: string;
  account: string;
  isApprovalCallback: Function;
  title: string;
  disabled?: boolean;
  userEthBalance: string;
  gasPrice: number;
  addFunds: Function;
  approvalType: string;
  ignore?: boolean;
  addPendingData: Function;
  pendingTx: boolean[];
  hideAddFunds?: boolean;
}
export const ApprovalTxButtonLabelCmp = ({
  checkApprovals,
  doApprovals,
  buttonName,
  className,
  account,
  isApprovalCallback,
  title,
  userEthBalance = "0",
  gasPrice,
  disabled = false,
  addFunds,
  approvalType,
  ignore,
  addPendingData,
  hideAddFunds = false,
}: ApprovalTxButtonLabelProps) => {
  const [approvalsNeeded, setApprovalsNeeded] = useState(0);
  const [insufficientEth, setInsufficientEth] = useState(false);
  const [description, setDescription] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
      const gasNeeded = constants.APPROVE_GAS_ESTIMATE.times(approvalsNeeded);
      const ethNeededForGas = createBigNumber(
        formatGasCostToEther(
          gasNeeded,
          { decimalsRounded: 4 },
          createBigNumber(GWEI_CONVERSION).multipliedBy(gasPrice)
        )
      );
      const notEnoughEth = createBigNumber(userEthBalance).lt(createBigNumber(ethNeededForGas)) && !hideAddFunds;
      setInsufficientEth(notEnoughEth);
      if (notEnoughEth) {
        const ethDo = formatEther(ethNeededForGas);
        setDescription(`Insufficient ETH to approve trading. ${ethDo.formatted} ETH cost.`);
      } else {
        switch(approvalType) {
          case constants.CREATEMARKET:
          setDescription('Approval requires one signing. Once confirmed, click create.');
          break;
          case constants.PUBLICTRADE:
            setDescription(`Approval requires ${approvalsNeeded} signing${approvalsNeeded > 1 ? 's' : ''} before you can place your order.`)
          break;
          case constants.ADDLIQUIDITY:
            setDescription(`Approval requires ${approvalsNeeded} signing${approvalsNeeded > 1 ? 's' : ''}. Once confirmed you can submit your orders.`)
          break;
          case constants.APPROVE:
            setDescription('Approval required before converting (to enable your wallet to interact with the Ethereum network)')
          break;
          default:
            setDescription(`Approval requires ${approvalsNeeded} signing${approvalsNeeded > 1 ? 's' : ''}. Once confirmed you can place your order.`)
          break;
        }

      }
  }, [userEthBalance, gasPrice, approvalsNeeded])

  function doCheckApprovals() {
    checkApprovals(account).then(approvalsNeeded => {
      setApprovalsNeeded(approvalsNeeded);
      isApprovalCallback(approvalsNeeded === 0);
      if (approvalsNeeded === 0) {
        addPendingData(TXEventName.Success);
      }
    });
  }

  useEffect(() => {
    doCheckApprovals();
  }, []);

  return (
    (!ignore && approvalsNeeded > 0) ? (
      <div className={classNames(Styles.ModalMessageLabel, className)}>
        <DismissableNotice
          show={true}
          title={title}
          buttonAction={(account) => {
            if (insufficientEth) {
              addFunds();
            } else {
              addPendingData(TXEventName.Pending);
              setIsProcessing(true)
              doApprovals(account).then(() => {
                doCheckApprovals();
                setIsProcessing(false);
              }).catch(() => {
                addPendingData(TXEventName.Failure);
                setIsProcessing(false)
              });
            }
          }}
          buttonText={insufficientEth ? 'Add Funds' : buttonName}
          queueName={constants.TRANSACTIONS}
          disabled={disabled || isProcessing}
          error={insufficientEth}
          queueId={constants.APPROVALS}
          description={description}
          customPendingButtonText={'Process...'}
          buttonType={DISMISSABLE_NOTICE_BUTTON_TYPES.BUTTON}
        />
      </div>
    ) : null
  )
}

const mapStateToProps = (state: AppState) => ({ });
const mapDispatchToProps = (dispatch) => ({
  addPendingData: status => dispatch(addPendingData(constants.APPROVALS, constants.TRANSACTIONS, status, '', { }))
});
const mergeProps = (sP: any, dP: any, oP: any) => ({...sP, ...dP, ...oP});

export const ApprovalTxButtonLabel = connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(ApprovalTxButtonLabelCmp);

interface BulkTxLabelProps {
  count: number;
  needsApproval?: boolean;
  buttonName: string;
  className?: string;
}
export const BulkTxLabel = ({
  count,
  needsApproval = false,
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

export const AutoCancelOrdersNotice = () => (
    <div className={classNames(Styles.ModalMessageAutoCancel)}>
      <DismissableNotice
        show
        buttonType={DISMISSABLE_NOTICE_BUTTON_TYPES.NONE}
        title={`When cashing out, all open orders will automatically be cancelled, positions are left unchanged.`}
      />
    </div>
);

export const InsufficientFundsNotice = () => (
  <div className={classNames(Styles.ModalMessageAutoCancel)}>
    <DismissableNotice
      show
      buttonType={DISMISSABLE_NOTICE_BUTTON_TYPES.NONE}
      title={`Account does not have enough funds to pay transaction fee, either add DAI or increase fee reserve to cash out.`}
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
      Add ETH to your {props.walletType} wallet address.{' '}
      {props.walletType === ACCOUNT_TYPES.WEB3WALLET
        ? ''
        : `${props.walletType} are our secure account and payment partners. ${props.walletType} will enable you to process the transaction fee without requiring DAI.`}{' '}
      {props.walletType === ACCOUNT_TYPES.WEB3WALLET ? null : (
        <span onClick={() => props.showAddFundsModal()}>
          Add ETH to your {props.walletType} wallet address
        </span>
      )}
    </li>
    <li>
      After you have sent the ETH to your {props.walletType} wallet address you
      can then return and make the transaction.
    </li>
  </ol>
);

