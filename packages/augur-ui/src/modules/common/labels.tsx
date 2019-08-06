import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import * as constants from "modules/common/constants";
import Styles from "modules/common/labels.styles.less";
import { ClipLoader } from "react-spinners";
import {
  MarketIcon,
  InfoIcon,
  CheckCircleIcon,
  HintAlternate,
  DoubleArrows
} from "modules/common/icons";
import { MarketProgress } from "modules/common/progress";
import ReactTooltip from "react-tooltip";
import TooltipStyles from "modules/common/tooltip.styles.less";
import { createBigNumber } from "utils/create-big-number";
import {
  SELL,
  BOUGHT,
  SOLD,
  CLOSED,
  SHORT,
  ZERO,
  YES_NO,
  REPORTING_STATE
} from "modules/common/constants";
import { ViewTransactionDetailsButton } from "modules/common/buttons";
import { formatNumber } from "utils/format-number";
import { FormattedNumber, SizeTypes, DateFormattedObject } from "modules/types";

export interface MarketTypeProps {
  marketType: string;
}

export interface MarketStatusProps {
  marketStatus: string;
}

export interface InReportingLabelProps extends MarketStatusProps {
  reportingState: string;
  disputeInfo: any;
  endTime: DateFormattedObject;
  reportingWindowStatsEndTime: number;
  currentAugurTimestamp: number;
}

export interface MovementLabelProps {
  value: number;
  size: SizeTypes;
  styles?: object;
  showColors?: boolean;
  showIcon?: boolean;
  showBrackets?: boolean;
  showPercent?: boolean;
  showPlusMinus?: boolean;
}

export interface MovementIconProps {
  value: number;
  size: SizeTypes;
}

export interface MovementTextProps {
  value: number;
  size: SizeTypes;
  showColors: boolean;
  showBrackets: boolean;
  showPercent: boolean;
  showPlusMinus: boolean;
}

export interface PropertyLabelProps {
  label: string;
  value: string;
  hint?: HTMLElement;
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
}

export interface LinearPropertyLabelTooltipProps {
  label: string;
  value: string;
}

export interface LinearPropertyLabelPercentMovementProps {
  label: string;
  value: string;
  accentValue?: boolean;
  numberValue: number;
  showColors?: boolean;
  showIcon?: boolean;
  showBrackets?: boolean;
  showPercent?: boolean;
  showPlusMinus?: boolean;
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
  showDenomination: boolean;
  keyId?: string;
  showEmptyDash: boolean;
}

interface HoverValueLabelState {
  hover: boolean;
}

export interface TextLabelProps {
  text: string;
  keyId?: string;
}

export interface TextLabelState {
  scrollWidth: string | null;
  clientWidth: string | null;
  isDisabled: boolean;
}

export interface RepBalanceProps {
  rep: string;
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
  tags: Array<ButtonObj>;
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
  max = "1000",
  min = "0.0001"
) {
  const { fullPrecision, roundedFormatted, denomination, formatted } = value;
  const maxHoverDecimals = 8;
  const minHoverDecimals = 4;
  const fullWithoutDecimals = fullPrecision.split(".")[0];
  const testValue = createBigNumber(fullPrecision);
  const isGreaterThan = testValue.abs().gt(max);
  const isLessThan = testValue.abs().lt(min) && !testValue.eq(ZERO);
  let postfix = isGreaterThan || isLessThan ? String.fromCodePoint(0x2026) : "";
  let frontFacingLabel = isGreaterThan ? fullWithoutDecimals : roundedFormatted;
  const denominationLabel = showDenomination ? `${denomination}` : "";

  let fullValue = fullPrecision;
  if (fixedPrecision) {
    const decimals = fullValue.toString().split(".")[1];
    if (decimals && decimals.length > maxHoverDecimals) {
      const round = formatNumber(fullPrecision, {
        decimals: maxHoverDecimals,
        decimalsRounded: maxHoverDecimals
      });
      fullValue = round.formatted;
      if (
        fullValue.split(".")[1] &&
        fullValue.split(".")[1].length > maxHoverDecimals
      ) {
        fullValue = round.rounded;
      }
    }

    if (testValue.gte("1000") && fixedPrecision) {
      frontFacingLabel = testValue.toFixed(minHoverDecimals);
    }
  }

  if (fullValue.length === frontFacingLabel.length) {
    postfix = "";
  }

  if (postfix.length && !isGreaterThan) {
    frontFacingLabel = frontFacingLabel.slice(0, -1);
  }

  return {
    fullPrecision: fullValue,
    postfix,
    frontFacingLabel,
    denominationLabel
  };
}

export const ValueLabel = (props: ValueLabelProps) => {
  if (!props.value || props.value === null)
    return props.showEmptyDash ? <span>&#8213;</span> : <span />;

  const expandedValues = formatExpandedValue(
    props.value,
    props.showDenomination
  );

  const {
    fullPrecision,
    postfix,
    frontFacingLabel,
    denominationLabel
  } = expandedValues;

  return (
    <span className={Styles.ValueLabel}>
      <label
        data-tip
        data-for={`valueLabel-${fullPrecision}-${denominationLabel}-${
          props.keyId
        }`}
        data-iscapture="true"
      >
        {`${frontFacingLabel}${postfix}${denominationLabel}`}
      </label>
      {postfix.length !== 0 && (
        <ReactTooltip
          id={`valueLabel-${fullPrecision}-${denominationLabel}-${props.keyId}`}
          className={TooltipStyles.Tooltip}
          effect="solid"
          place="top"
          type="light"
          data-event="mouseover"
          data-event-off="blur scroll"
        >
          {`${fullPrecision} ${denominationLabel}`}
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
    isDisabled: true
  };

  measure() {
    const { clientWidth, scrollWidth } = this.labelRef;

    this.setState({
      scrollWidth,
      clientWidth,
      isDisabled: !(scrollWidth > clientWidth)
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
      this.state.clientWidth !== nextState.clientWidth
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
          data-for={`${keyId}-${text ? text.replace(/\s+/g, "-") : ""}`}
        >
          {text}
        </label>
        {!isDisabled && (
          <ReactTooltip
            id={`${keyId}-${text.replace(/\s+/g, "-")}`}
            className={TooltipStyles.Tooltip}
            effect="solid"
            place="top"
            type="light"
            data-event="mouseover"
            data-event-off="blur scroll"
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
    hover: false
  };
  render() {
    if (!this.props.value || this.props.value === null) return <span />;

    const expandedValues = formatExpandedValue(
      this.props.value,
      this.props.showDenomination,
      true,
      "99999"
    );
    const { fullPrecision, postfix, frontFacingLabel } = expandedValues;

    const frontFacingLabelSplit = frontFacingLabel.toString().split(".");
    const firstHalf = frontFacingLabelSplit[0];
    const secondHalf = frontFacingLabelSplit[1];

    const fullPrecisionSplit = fullPrecision.toString().split(".");
    const firstHalfFull = fullPrecisionSplit[0];
    const secondHalfFull = fullPrecisionSplit[1];

    return (
      <span
        className={Styles.HoverValueLabel}
        onMouseEnter={() => {
          this.setState({
            hover: true
          });
        }}
        onMouseLeave={() => {
          this.setState({
            hover: false
          });
        }}
      >
        {this.state.hover && postfix.length !== 0 ? (
          <span>
            <span>
              {firstHalfFull}
              {secondHalfFull && "."}
            </span>
            <span>{secondHalfFull}</span>
          </span>
        ) : (
          <span>
            <span>
              {firstHalf}
              {secondHalf && "."}
            </span>
            <span>
              {secondHalf}
              {postfix}
            </span>
          </span>
        )}
      </span>
    );
  }
}

export const PropertyLabel = (props: PropertyLabelProps) => (
  <div className={Styles.PropertyLabel}>
    <span>
      {props.label}
      {props.hint && (
        <>
          <label
            className={TooltipStyles.TooltipHint}
            data-tip
            data-for={`tooltip-${props.label.replace(" ", "-")}`}
          >
            {InfoIcon}
          </label>
          <ReactTooltip
            id={`tooltip-${props.label.replace(" ", "-")}`}
            className={TooltipStyles.Tooltip}
            effect="solid"
            place="right"
            type="light"
          >
            {props.hint}
          </ReactTooltip>
        </>
      )}
    </span>
    <span>{props.value}</span>
  </div>
);

export const LinearPropertyLabel = (props: LinearPropertyLabelProps) => (
  <div
    className={classNames(Styles.LinearPropertyLabel, {
      [Styles.HighlightAlternate]:
        props.highlightAlternate || props.highlightAlternateBolded,
      [Styles.Highlight]: props.highlight,
      [Styles.HighlightAlternateBolded]: props.highlightAlternateBolded,
      [Styles.HighlightFirst]: props.highlightFirst
    })}
  >
    <span>{props.label}</span>
    <DashlineNormal />
    {props.useValueLabel ? (
      <ValueLabel
        value={props.value}
        showDenomination={props.showDenomination}
      />
    ) : (
      <span
        className={classNames({
          [Styles.isAccented]: props.accentValue
        })}
      >
        {props.value && props.value.formatted
          ? `${props.value.formatted} ${
              props.showDenomination ? props.value.denomination : ""
            }`
          : props.value}
      </span>
    )}
  </div>
);

export const MarketTypeLabel = (props: MarketTypeProps) => {
  if (!props.marketType) {
    return null;
  }

  return (
    <span className={Styles.MarketTypeLabel}>
      {props.marketType === YES_NO ? "Yes/No" : props.marketType}
    </span>
  );
};

export const MarketStatusLabel = (props: MarketStatusProps) => {
  const { marketStatus, mini } = props;
  let open: boolean = false;
  let resolved: boolean = false;
  let reporting: boolean = false;
  let text: string;
  switch (marketStatus) {
    case constants.MARKET_OPEN:
      open = true;
      text = constants.MARKET_STATUS_MESSAGES.OPEN;
      break;
    case constants.MARKET_CLOSED:
      resolved = true;
      text = constants.MARKET_STATUS_MESSAGES.RESOLVED;
      break;
    default:
      reporting = true;
      text = constants.MARKET_STATUS_MESSAGES.IN_REPORTING;
      break;
  }
  return (
    <span
      className={classNames(Styles.MarketStatus, {
        [Styles.MarketStatus_mini]: mini,
        [Styles.MarketStatus_open]: open,
        [Styles.MarketStatus_resolved]: resolved,
        [Styles.MarketStatus_reporting]: reporting
      })}
    >
      {text}
    </span>
  );
};

export const InReportingLabel = (props: InReportingLabelProps) => {
  const {
    mini,
    alternate,
    reportingState,
    disputeInfo,
    endTime,
    reportingWindowStatsEndTime,
    currentAugurTimestamp
  } = props;

  const reportingStates = [
    REPORTING_STATE.DESIGNATED_REPORTING,
    REPORTING_STATE.OPEN_REPORTING,
    REPORTING_STATE.AWAITING_NEXT_WINDOW,
    REPORTING_STATE.CROWDSOURCING_DISPUTE
  ];

  if (!reportingStates.includes(reportingState)) {
    return <MarketStatusLabel {...props} />;
  }

  let reportingCountdown: boolean = false;
  let reportingExtraText: string | null;
  const text: string = constants.IN_REPORTING;
  let customLabel: string | null = null;

  if (reportingState === REPORTING_STATE.DESIGNATED_REPORTING) {
    reportingExtraText = constants.WAITING_ON_REPORTER;
    reportingCountdown = true;
    customLabel = constants.REPORTING_ENDS;
  } else if (reportingState === REPORTING_STATE.OPEN_REPORTING) {
    reportingExtraText = constants.OPEN_REPORTING;
  } else if (reportingState === REPORTING_STATE.AWAITING_NEXT_WINDOW) {
    reportingExtraText = constants.AWAITING_NEXT_DISPUTE;
    reportingCountdown = true;
  } else if (
    reportingState === REPORTING_STATE.CROWDSOURCING_DISPUTE ||
    reportingState === REPORTING_STATE.AWAITING_FORK_MIGRATION
  ) {
    reportingExtraText =
      disputeInfo && disputeInfo.disputeRound
        ? `${constants.DISPUTE_ROUND} ${disputeInfo.disputeRound}`
        : constants.DISPUTE_ROUND;
    reportingCountdown = true;
    customLabel = constants.DISPUTE_ENDS;
  } else {
    reportingExtraText = null;
  }

  return (
    <>
      <span
        className={classNames(
          Styles.MarketStatus,
          Styles.MarketStatus_reporting
        )}
      >
        {text}
        {reportingExtraText && (
          <span className={Styles.InReporting_reportingDetails}>
            {DoubleArrows}
            {reportingExtraText}
          </span>
        )}
      </span>
      {reportingCountdown && (
        <span className={classNames({ [Styles.MarketStatus_mini]: mini })}>
          <span className={Styles.InReporting_reportingDetails__countdown}>
            <MarketProgress
              currentTime={currentAugurTimestamp}
              reportingState={reportingState}
              endTime={endTime}
              reportingWindowEndtime={reportingWindowStatsEndTime}
              customLabel={customLabel}
            />
          </span>
        </span>
      )}
    </>
  );
};

export const PendingLabel = () => (
  <span className={Styles.PendingLabel} data-tip data-for={"processing"}>
    Processing <ClipLoader size={8} color="#ffffff" />
    <ReactTooltip
      id={"processing"}
      className={TooltipStyles.Tooltip}
      effect="solid"
      place="top"
      type="light"
      data-event="mouseover"
      data-event-off="blur scroll"
    >
      You will receive an alert when the transaction has finalized.
    </ReactTooltip>
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
      [Styles.MovementLabel_Icon_large]: size == SizeTypes.LARGE
    });

  const getIconColorStyles: Function = (value: number): string =>
    classNames({
      [Styles.MovementLabel_Icon_positive]: value > 0,
      [Styles.MovementLabel_Icon_negative]: value < 0
    });

  const iconSize = getIconSizeStyles(props.size);
  const iconColor = getIconColorStyles(props.value);

  return <div className={`${iconSize} ${iconColor}`}>{MarketIcon}</div>;
};

export const MovementText = (props: MovementTextProps) => {
  const getTextSizeStyle: Function = (size: SizeTypes): string =>
    classNames(Styles.MovementLabel_Text, {
      [Styles.MovementLabel_Text_small]: size == SizeTypes.SMALL,
      [Styles.MovementLabel_Text_normal]: size == SizeTypes.NORMAL,
      [Styles.MovementLabel_Text_large]: size == SizeTypes.LARGE
    });
  const getTextColorStyles: Function = (value: number): string =>
    classNames({
      [Styles.MovementLabel_Text_positive]: value > 0,
      [Styles.MovementLabel_Text_negative]: value < 0,
      [Styles.MovementLabel_Text_neutral]: value === 0
    });

  const textColorStyle = getTextColorStyles(props.value);
  const textSizeStyle = getTextSizeStyle(props.size);

  // Transform label
  const removeMinus: Function = (label: number): number => {
    if (props.value < 0 && !props.showPlusMinus) {
      return Math.abs(props.value);
    }
    return label;
  };

  const toString: Function = (label: number): string => String(label);

  const addPlus: Function = (label: string): string => {
    if (props.value > 0 && props.showPlusMinus) {
      return "+".concat(label);
    }
    return label;
  };

  const addPercent: Function = (label: string): string => {
    if (props.showPercent) {
      return `${label}%`;
    }
    return label;
  };

  const addBrackets: Function = (label: string): string => {
    if (props.showBrackets) {
      return `(${label})`;
    }
    return label;
  };

  const formattedString = addBrackets(
    addPercent(addPlus(toString(removeMinus(props.value))))
  );

  return (
    <div
      className={`${props.showColors ? textColorStyle : ""} ${textSizeStyle}`}
    >
      {formattedString}
    </div>
  );
};

export const MovementLabel = (props: MovementLabelProps) => {
  const showColors = props.showColors || false; // Red/Green
  const showPercent = props.showPercent || false; // 0.00%
  const showBrackets = props.showBrackets || false; // (0.00)
  const showPlusMinus = props.showPlusMinus || false; // +4.32 / -0.32
  const showIcon = props.showIcon || false; // 📈 3.2 / 📉 2.1

  return (
    <div
      className={Styles.MovementLabel}
      style={
        showIcon
          ? { ...props.styles, justifyContent: "space-between" }
          : { ...props.styles, justifyContent: "flex-end" }
      }
    >
      {showIcon && props.value !== 0 && (
        <MovementIcon value={props.value} size={props.size} />
      )}
      {
        <MovementText
          value={props.value}
          size={props.size}
          showColors={showColors}
          showPercent={showPercent}
          showBrackets={showBrackets}
          showPlusMinus={showPlusMinus}
        />
      }
    </div>
  );
};

export const PillLabel = ({ label, hideOnMobile }: PillLabelProps) => (
  <span
    className={classNames(Styles.PillLabel, {
      [Styles.HideOnMobile]: hideOnMobile
    })}
  >
    {label}
  </span>
);

export const RepBalance = (props: RepBalanceProps) => (
  <div className={Styles.RepBalance}>
    <span>my rep balance</span>
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
        [Styles.Sell]: props.type === SHORT || props.type === SELL,
        [Styles.Closed]: props.type === CLOSED
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
    />
    <MovementLabel
      showIcon={props.showIcon}
      showPercent={props.showPercent}
      showBrackets={props.showBrackets}
      showPlusMinus={props.showPlusMinus}
      showColors={props.showColors}
      size={SizeTypes.NORMAL}
      value={props.numberValue}
    />
  </span>
);

export const LinearPropertyLabelTooltip = (
  props: LinearPropertyLabelTooltipProps
) => (
  <span className={Styles.LinearPropertyLabelTooltip}>
    <LinearPropertyLabel
      label={props.label}
      value={props.value}
    />
    <div>
      <label
        className={TooltipStyles.TooltipHint}
        data-tip
        data-for={`tooltip-${props.label}`}
      >
        {HintAlternate}
      </label>
      <ReactTooltip
        id={`tooltip-${props.label}`}
        className={TooltipStyles.Tooltip}
        effect="solid"
        place="top"
        type="light"
        data-event="mouseover"
        data-event-off="blur scroll"
      >
        Information text
      </ReactTooltip>
    </div>
  </span>
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
    <ViewTransactionDetailsButton transactionHash={props.transactionHash} />
  </div>
);

export const WordTrail = ({ items, typeLabel, children }: WordTrailProps) => (
  <div className={Styles.WordTrail}>
    {children}
    {items.map(({ label, onClick }, index) => (
      <button
        key={label}
        data-testid={`${typeLabel}-${index}`}
        className={Styles.WordTrailButton}
        onClick={e => onClick()}
      >
        <span>{label}</span>
        <span>{index + 1 !== items.length && "/" }</span>
      </button>
    ))}
  </div>
);

WordTrail.propTypes = {
  typeLabel: PropTypes.string,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      onClick: PropTypes.func.isRequired
    })
  ),
  children: PropTypes.array
};

WordTrail.defaultProps = {
  children: [],
  items: [],
  typeLabel: "label-type"
};

export const CategoryTagTrail = ({
  categories,
  tags
}: CategoryTagTrailProps) => (
  <div className={Styles.CategoryTagTrail}>
    <WordTrail items={categories} typeLabel="Category" />
    {!tags.length && <WordTrail items={tags} typeLabel="Tags" />}
  </div>
);

CategoryTagTrail.propTypes = {
  categories: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      onClick: PropTypes.func.isRequired
    })
  ).isRequired,
  tags: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      onClick: PropTypes.func.isRequired
    })
  ).isRequired
};

export const ValueDenomination = ({
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
  value
}: ValueDenominationProps) => (
  <span className={Styles[className]}>
    {prefix &&
      !hidePrefix && (
        <span className={Styles.prefix}>{prefix}</span>
      )}
    {formatted &&
      fullPrecision && (
        <span
          data-tip={fullPrecision}
          data-event="click focus"
          className={`value_${valueClassname}`}
        >
          {formatted}
        </span>
      )}
    {formatted &&
      !fullPrecision && (
        <span className={`value_${valueClassname}`}>{formatted}</span>
      )}
    {denomination &&
      !hideDenomination && (
        <span className={Styles.denomination}>
          {denomination}
        </span>
      )}
    {postfix &&
      !hidePostfix && (
        <span className={Styles.postfix}>{postfix}</span>
      )}
    {!value &&
      value !== 0 &&
      !formatted &&
      formatted !== "0" && <span>&mdash;</span> // null/undefined state handler
    }
  </span>
);

ValueDenomination.propTypes = {
  valueClassname: PropTypes.string,
  className: PropTypes.string,
  value: PropTypes.number,
  formatted: PropTypes.string,
  fullPrecision: PropTypes.string,
  denomination: PropTypes.string,
  hidePrefix: PropTypes.bool,
  hidePostfix: PropTypes.bool,
  prefix: PropTypes.string,
  postfix: PropTypes.string,
  hideDenomination: PropTypes.bool
};

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
  hideDenomination: false
};
