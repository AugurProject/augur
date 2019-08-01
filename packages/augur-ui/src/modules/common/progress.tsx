import * as React from "react";
import Styles from "modules/common/progress.styles.less";
import * as format from "utils/format-date";
import classNames from "classnames";
import { DateFormattedObject } from "modules/types";
import { REPORTING_STATE } from "modules/common/constants";

export interface CountdownProgressProps {
  time: DateFormattedObject | null;
  currentTime?: DateFormattedObject;
  label: string;
  countdownBreakpoint?: number;
  firstColorBreakpoint?: number;
  finalColorBreakpoint?: number;
  alignRight?: Boolean;
}

export interface TimeLabelProps {
  time: DateFormattedObject;
  label?: string;
}

export interface TimeProgressBarProps {
  startTime: DateFormattedObject | number;
  endTime: DateFormattedObject | number;
  currentTime: DateFormattedObject | number;
}

export interface MarketProgressProps {
  reportingState: string;
  currentTime: DateFormattedObject | number;
  endTime: DateFormattedObject;
  reportingWindowEndtime: DateFormattedObject | number;
  customLabel?: string;
  alignRight?: Boolean;
}
// default breakpoints
const OneWeek = 168 * 60 * 60;
const ThreeDays = 72 * 60 * 60;
const OneDay = 24 * 60 * 60;

export const formatTime = (time: DateFormattedObject | number) => {
  if (typeof time !== "object") {
    return format.convertUnixToFormattedDate(time);
  }
  return time;
};

const reportingStateToLabelTime = (
  reportingState: string,
  endTime: DateFormattedObject,
  reportingEndTime: DateFormattedObject
) => {
  let label: string = "";
  let time: DateFormattedObject | null = null;
  switch (reportingState) {
    case REPORTING_STATE.PRE_REPORTING:
      label = "Reporting Begins";
      time = endTime;
      break;
    case REPORTING_STATE.DESIGNATED_REPORTING:
      label = "Designated Reporting";
      time = formatTime(endTime.timestamp + OneDay);
      break;
    case REPORTING_STATE.OPEN_REPORTING:
      label = "Open Reporting";
      break;
    case REPORTING_STATE.CROWDSOURCING_DISPUTE:
      label = "Disputing Ends";
      time = reportingEndTime;
      break;
    case REPORTING_STATE.AWAITING_NEXT_WINDOW:
      label = "Next Dispute";
      time = reportingEndTime;
      break;
    case REPORTING_STATE.FORKING:
      label = "Forking";
      time = endTime;
      break;
    case REPORTING_STATE.AWAITING_NO_REPORT_MIGRATION:
      label = "Awaiting No Report Migration";
      break;
    case REPORTING_STATE.AWAITING_FORK_MIGRATION:
      label = "Awaiting Fork Migration";
      break;
    case REPORTING_STATE.AWAITING_FINALIZATION:
    case REPORTING_STATE.FINALIZED:
    default:
      label = "Expired";
      break;
  }

  return { label, time };
};

export const MarketProgress = (props: MarketProgressProps) => {
  const {
    reportingState,
    currentTime,
    endTime,
    reportingWindowEndtime,
    customLabel,
    alignRight,
  } = props;
  const currTime = formatTime(currentTime);
  const marketEndTime = endTime;
  const reportingEndTime = formatTime(reportingWindowEndtime);
  const { label, time } = reportingStateToLabelTime(
    reportingState,
    marketEndTime,
    reportingEndTime
  );

  // Don't flash countdown component if we don't have reporting / augur timestamp data on state yet
  if (!reportingWindowEndtime || !currentTime) {
    return null;
  }

  return (
    <CountdownProgress
      label={customLabel || label}
      time={time}
      currentTime={currTime}
      alignRight={alignRight}
    />
  );
};

export const CountdownProgress = (props: CountdownProgressProps) => {
  const {
    label,
    time,
    currentTime,
    countdownBreakpoint,
    firstColorBreakpoint,
    finalColorBreakpoint,
    alignRight,
  } = props;
  let valueString: string = "";
  let timeLeft: number = 1;
  let countdown: boolean = false;
  const firstBreakpoint = firstColorBreakpoint || ThreeDays;
  const secondBreakpoint = finalColorBreakpoint || OneDay;
  if (time !== null && currentTime) {
    const daysRemaining = format.getDaysRemaining(
      time.timestamp,
      currentTime.timestamp
    );
    const hoursRemaining = format.getHoursMinusDaysRemaining(
      time.timestamp,
      currentTime.timestamp
    );
    const minutesRemaining = format.getMinutesMinusHoursRemaining(
      time.timestamp,
      currentTime.timestamp
    );

    const secondsRemaining = format.getSecondsMinusMinutesRemaining(
      time.timestamp,
      currentTime.timestamp
    );

    timeLeft = time.timestamp - currentTime.timestamp;
    countdown = (countdownBreakpoint || OneWeek) >= timeLeft && timeLeft > 0;
    valueString = countdown
      ? `${daysRemaining}:${hoursRemaining >= 10 ? hoursRemaining : "0" + hoursRemaining}:${minutesRemaining >= 10 ? minutesRemaining : "0" + minutesRemaining}:${secondsRemaining >= 10 ? secondsRemaining : "0" + secondsRemaining}`
      : time.formattedLocalShortDateSecondary;
  }
  const breakpointOne =
    timeLeft <= firstBreakpoint && timeLeft > secondBreakpoint && countdown;
  const breakpointTwo = timeLeft <= secondBreakpoint && countdown;

  return (
    <span
      className={classNames(Styles.ProgressLabel, {
        [Styles.FirstBreakpoint]: breakpointOne,
        [Styles.SecondBreakpoint]: breakpointTwo,
        [Styles.Finished]: timeLeft < 0,
        [Styles.AlignRight]: alignRight,
      })}
    >
      <span>{label}</span>
      <span>{valueString}</span>
    </span>
  );
};

export const TimeLabel = (props: TimeLabelProps) => {
  const { label, time } = props;
  let formattedTime: DateFormattedObject = time;
  if (typeof time !== "object") {
    formattedTime = format.convertUnixToFormattedDate(time);
  }
  return (
    <span className={Styles.TimeLabel}>
      {label && <span>{label}</span>}
      <span>{formattedTime.formattedUtcShortDate}</span>
      <span>{formattedTime.clockTimeUtc}</span>
    </span>
  );
};

export const TimeProgressBar = (props: TimeProgressBarProps) => {
  const { startTime, endTime, currentTime } = props;
  let formattedStartTime: DateFormattedObject | number = startTime;
  let formattedEndTime: DateFormattedObject = endTime;
  let formattedCurrentTime: DateFormattedObject | number = currentTime;
  if (typeof startTime !== "object") {
    formattedStartTime = format.convertUnixToFormattedDate(startTime);
  }
  if (typeof currentTime !== "object") {
    formattedCurrentTime = format.convertUnixToFormattedDate(currentTime);
  }
  const totalHours = format.getHoursRemaining(
    formattedEndTime.timestamp,
    formattedStartTime.timestamp
  );
  const hoursLeft = format.getHoursRemaining(
    formattedEndTime.timestamp,
    formattedCurrentTime.timestamp
  );
  const percentageToGo = Math.ceil(
    hoursLeft > 0 ? (hoursLeft / totalHours) * 100 : 0
  );
  const percentageDone = 100 - percentageToGo;
  const percentDone = { "--percent-done": `${percentageDone}%` };
  const percentToGo = { "--percent-to-go": `${percentageToGo}%` };
  return (
    <span className={Styles.TimeProgressBar}>
      <span style={percentDone} />
      <span style={percentToGo} />
    </span>
  );
};

export const MarketTimeline = (props: TimeProgressBarProps) => {
  const { startTime, endTime, currentTime } = props;
  let formattedEndTime: DateFormattedObject = endTime;
  let formattedCurrentTime: DateFormattedObject | number = currentTime;

  if (!currentTime) {
    return null;
  }

  if (typeof currentTime !== "object") {
    formattedCurrentTime = format.convertUnixToFormattedDate(currentTime);
  }
  const currentTimestamp = formattedCurrentTime.timestamp;
  const endTimestamp = formattedEndTime.timestamp;
  const hasPassed = currentTimestamp > endTimestamp;
  const endLabel = hasPassed ? "STARTED" : "STARTS";
  return (
    <div className={Styles.MarketTimeline}>
      <div
        className={classNames({
          [Styles.reported]: hasPassed,
          [Styles.open]: !hasPassed
        })}
      >
        <span>Date Created</span>
        <span>{`Reporting ${endLabel}`}</span>
      </div>
      <TimeProgressBar {...props} />
      <div
        className={classNames({
          [Styles.fade]: hasPassed
        })}
      >
        <TimeLabel time={startTime} />
        <TimeLabel time={endTime} />
      </div>
    </div>
  );
};
