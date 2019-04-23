import React from "react";
import classNames from "classnames";
import * as constants from "modules/common-elements/constants";
import { constants as serviceConstants } from "services/constants";
import Styles from "modules/common-elements/labels.styles";
import { ClipLoader } from "react-spinners";
import { MarketIcon, InfoIcon, CheckCircleIcon } from "modules/common-elements/icons";
import { MarketProgress } from "modules/common-elements/progress";
import ReactTooltip from "react-tooltip";
import TooltipStyles from "modules/common/less/tooltip.styles";
import { createBigNumber } from "utils/create-big-number";
import { DashlineNormal } from "modules/common/components/dashline/dashline";
import {
  SELL,
  BOUGHT,
  SOLD,
  CLOSED,
  SHORT,
  ZERO
} from "modules/common-elements/constants";
import { ViewTransactionDetailsButton } from "modules/common-elements/buttons";
import { formatNumber } from "utils/format-number";

const { REPORTING_STATE } = serviceConstants;

enum SizeTypes {
  SMALL = constants.SMALL,
  NORMAL = constants.NORMAL,
  LARGE = constants.LARGE
}

export interface MarketTypeProps {
  marketType: string;
}

export interface MarketStatusProps {
  marketStatus: string;
  mini?: boolean;
  alternate?: boolean;
}

export interface InReportingLabelProps extends MarketStatusProps {
  reportingState: string;
  disputeInfo: any;
  endTime: object;
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
  value: string | FormattedValue;
  accentValue?: boolean;
  highlightFirst?: boolean;
  highlight?: boolean;
  highlightAlternateBolded?: boolean;
  useValueLabel?: boolean;
  showDenomination?: boolean;
}

export interface LinearPropertyLabelPercentProps {
  label: string;
  value: string;
  accentValue?: boolean;
  numberValue: number;
  highlightFirst?: boolean;
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
}

export interface PositionTypeLabelProps {
  type: string;
  pastTense: boolean;
}

export interface LinearPropertyLabelViewTransactionProps {
  transactionHash: string;
  highlightFirst?: boolean;
}

export interface FormattedValue {
  value: number;
  formattedValue: number;
  formatted: string;
  roundedValue: number;
  roundedFormatted: string;
  minimized: string;
  denomination: string;
  full: string;
  fullPrecision: string;
}

export interface ValueLabelProps {
  value: FormattedValue;
  showDenomination: boolean;
  keyId: string;
  showEmptyDash: boolean;
}

interface HoverValueLabelState {
  hover: boolean;
}

export interface TextLabelProps {
  text: string;
  keyId: string;
}

export interface RepBalanceProps {
  rep: string;
}

export function formatExpandedValue(
  value,
  showDenomination,
  fixedPrecision = false,
  max = "1000",
  min = "0.0001"
) {
  const {
    fullPrecision,
    roundedFormatted,
    denomination,
    formatted
  } = value;
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
      if (fullValue.split(".")[1] && fullValue.split(".")[1].length > maxHoverDecimals) {
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
      <ReactTooltip
        id={`valueLabel-${fullPrecision}-${denominationLabel}-${props.keyId}`}
        className={TooltipStyles.Tooltip}
        effect="solid"
        place="top"
        type="light"
        data-event="mouseover"
        data-event-off="blur scroll"
        disable={postfix.length === 0}
      >
        {`${fullPrecision} ${denominationLabel}`}
      </ReactTooltip>
    </span>
  );
};

export class TextLabel extends React.Component<TextLabelProps> {
  labelRef: any = null;
  render() {
    const { text, keyId } = this.props;
    const isDisabled = !(
      this.labelRef && this.labelRef.scrollWidth > this.labelRef.clientWidth
    );
    return (
      <span className={Styles.TextLabel}>
        <label
          ref={label => (this.labelRef = label)}
          data-tip
          data-for={`${keyId}-${text.replace(" ", "-")}`}
        >
          {text}
        </label>
        <ReactTooltip
          id={`${keyId}-${text.replace(" ", "-")}`}
          className={TooltipStyles.Tooltip}
          effect="solid"
          place="top"
          type="light"
          data-event="mouseover"
          data-event-off="blur scroll"
          disable={isDisabled}
        >
          {text}
        </ReactTooltip>
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
      {props.marketType === constants.YES_NO ? "Yes/No" : props.marketType}
    </span>
  );
};

export const MarketStatusLabel = (props: MarketStatusProps) => {
  const { marketStatus, mini, alternate } = props;
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
        [Styles.MarketStatus_alternate]: alternate,
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
          Styles.MarketStatus_reporting,
          {
            [Styles.MarketStatus_alternate]: alternate,
            [Styles.MarketStatus_mini]: mini
          }
        )}
      >
        {text}
        {reportingExtraText && (
          <span className={Styles.InReporting_reportingDetails}>
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
  <span 
    className={Styles.PendingLabel}
    data-tip
    data-for={'processing'}
  >
    Processing <ClipLoader size={8} color="#ffffff" />
    <ReactTooltip
      id={'processing'}
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
  <span className={Styles.ConfirmedLabel}>
    Confirmed {CheckCircleIcon}
  </span>
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
      {showIcon &&
        props.value !== 0 && (
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

export const PillLabel = (props: PillLabelProps) => (
  <span className={Styles.PillLabel}>{props.label}</span>
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
