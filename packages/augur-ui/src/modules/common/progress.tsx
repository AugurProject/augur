import * as React from 'react';
import Styles from 'modules/common/progress.styles.less';
import * as format from 'utils/format-date';
import classNames from 'classnames';
import { DateFormattedObject } from 'modules/types';
import { REPORTING_STATE } from 'modules/common/constants';

export interface CountdownProgressProps {
  time?: DateFormattedObject;
  currentTime?: DateFormattedObject;
  label: string;
  countdownBreakpoint?: number;
  firstColorBreakpoint?: number;
  finalColorBreakpoint?: number;
  alignRight?: boolean;
}

export interface TimeLabelProps {
  time: DateFormattedObject;
  label?: string;
}

export interface TimeProgressBarProps {
  startTime: DateFormattedObject;
  endTime: DateFormattedObject;
  currentTime: DateFormattedObject;
}

export interface MarketProgressProps {
  reportingState: string;
  currentTime: DateFormattedObject | number;
  endTimeFormatted: DateFormattedObject;
  reportingWindowEndTime: DateFormattedObject | number;
  customLabel?: string;
  alignRight?: boolean;
}
// default breakpoints
const OneWeek = 168 * 60 * 60;
const ThreeDays = 72 * 60 * 60;
const OneDay = 24 * 60 * 60;

export const formatTime = (time: DateFormattedObject | number) => {
  if (typeof time !== 'object') {
    return format.convertUnixToFormattedDate(time);
  }
  return time;
};

const determineProgress = (
  startTime: number | DateFormattedObject,
  endTime: number | DateFormattedObject,
  currentTime: number | DateFormattedObject
) => {
  const formattedStartTime: DateFormattedObject = formatTime(startTime);
  const formattedEndTime: DateFormattedObject = formatTime(endTime);
  const formattedCurrentTime: DateFormattedObject = formatTime(currentTime);

  const daysRemaining = format.getDaysRemaining(
    formattedEndTime.timestamp,
    formattedCurrentTime.timestamp
  );
  const totalHours = format.getHoursRemaining(
    formattedEndTime.timestamp,
    formattedStartTime.timestamp
  );
  const hoursRemaining = format.getHoursMinusDaysRemaining(
    formattedEndTime.timestamp,
    formattedCurrentTime.timestamp
  );
  const hoursRemainingTotal = format.getHoursRemaining(
    formattedEndTime.timestamp,
    formattedCurrentTime.timestamp
  );
  const minutesRemaining = format.getMinutesMinusHoursRemaining(
    formattedEndTime.timestamp,
    formattedCurrentTime.timestamp
  );
  const secondsRemaining = format.getSecondsMinusMinutesRemaining(
    formattedEndTime.timestamp,
    formattedCurrentTime.timestamp
  );

  const percentageToGo = Math.ceil(
    hoursRemainingTotal > 0 ? (hoursRemainingTotal / totalHours) * 100 : 0
  );
  const percentageDone = 100 - percentageToGo;

  return {
    formattedStartTime,
    formattedEndTime,
    formattedCurrentTime,
    percentageToGo,
    percentageDone,
    daysRemaining,
    totalHours,
    hoursRemaining,
    minutesRemaining,
    secondsRemaining,
  };
};

const reportingStateToLabelTime = (
  reportingState: string,
  endTimeFormatted: DateFormattedObject,
  reportingEndTime: DateFormattedObject
) => {
  let label: string = '';
  let time: DateFormattedObject = null;
  switch (reportingState) {
    case REPORTING_STATE.PRE_REPORTING:
      label = 'Event Expiration';
      time = endTimeFormatted;
      break;
    case REPORTING_STATE.DESIGNATED_REPORTING:
      label = 'Designated Reporting';
      time = formatTime(endTimeFormatted.timestamp + OneDay);
      break;
    case REPORTING_STATE.OPEN_REPORTING:
      label = 'Open Reporting';
      break;
    case REPORTING_STATE.CROWDSOURCING_DISPUTE:
      label = 'Time Left to Dispute';
      time = reportingEndTime;
      break;
    case REPORTING_STATE.AWAITING_NEXT_WINDOW:
      label = 'Next Dispute';
      time = reportingEndTime;
      break;
    case REPORTING_STATE.FORKING:
      label = 'Forking';
      time = endTimeFormatted;
      break;
    case REPORTING_STATE.AWAITING_FORK_MIGRATION:
      label = 'Awaiting Fork Migration';
      break;
    case REPORTING_STATE.AWAITING_FINALIZATION:
    case REPORTING_STATE.FINALIZED:
    default:
      label = 'Expired';
      time = reportingEndTime;
      break;
  }

  return { label, time };
};

export const MarketProgress = (props: MarketProgressProps) => {
  const {
    reportingState,
    currentTime,
    endTimeFormatted,
    reportingWindowEndTime,
    customLabel,
    alignRight,
  } = props;
  const currTime = formatTime(currentTime);
  const reportingEndTime = formatTime(reportingWindowEndTime);
  const { label, time } = reportingStateToLabelTime(
    reportingState,
    endTimeFormatted,
    reportingEndTime
  );

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
  let valueString = '';
  let timeLeft = 1;
  let countdown = false;
  const firstBreakpoint = firstColorBreakpoint || ThreeDays;
  const secondBreakpoint = finalColorBreakpoint || OneDay;
  if (time && time !== null && currentTime) {
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
      ? `${daysRemaining}:${
          hoursRemaining >= 10 ? hoursRemaining : '0' + hoursRemaining
        }:${
          minutesRemaining >= 10 ? minutesRemaining : '0' + minutesRemaining
        }:${secondsRemaining >= 10 ? secondsRemaining : '0' + secondsRemaining}`
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
  if (typeof time !== 'object') {
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
  const { percentageDone, percentageToGo } = determineProgress(
    startTime,
    endTime,
    currentTime
  );
  const percentDone = { '--percent-done': `${percentageDone}%` };
  const percentToGo = { '--percent-to-go': `${percentageToGo}%` };
  return (
    <span className={Styles.TimeProgressBar}>
      <span style={percentDone} />
      <span style={percentToGo} />
    </span>
  );
};

const getWindowLabels = (
  start: DateFormattedObject,
  end: DateFormattedObject
) => {
  const startLabel = `${start.formattedUtcShortDate.substring(
    0,
    start.formattedUtcShortDate.indexOf(',')
  )} ${start.formattedUtcShortTime} (UTC)`;
  const endLabel = `${end.formattedUtcShortDate.substring(
    0,
    end.formattedUtcShortDate.indexOf(',')
  )} ${end.formattedUtcShortTime} (UTC)`;
  const dayLabels = format.getFullDaysBetween(start.timestamp, end.timestamp);
  return {
    startLabel,
    endLabel,
    dayLabels,
  };
};

export interface WindowProgressProps {
  startTime: DateFormattedObject | number;
  endTime: DateFormattedObject | number;
  currentTime: DateFormattedObject | number;
  title: string;
  description: string;
  countdownLabel: string;
}

export const WindowProgress = (props: WindowProgressProps) => {
  const {
    startTime,
    endTime,
    currentTime,
    title,
    description,
    countdownLabel
  } = props;
  const {
    formattedStartTime,
    formattedEndTime,
    daysRemaining,
    hoursRemaining,
    minutesRemaining,
    secondsRemaining,
  } = determineProgress(startTime, endTime, currentTime);
  const { startLabel, endLabel, dayLabels } = getWindowLabels(
    formattedStartTime,
    formattedEndTime
  );
  return (
    <div className={Styles.WindowProgress}>
      <h4>{title}</h4>
      <p>{description}</p>
      <TimeProgressBar {...props} />
      <ul>
        <li>{startLabel}</li>
        {dayLabels.map(label => (
          <li key={label}>{label}</li>
        ))}
        <li>{endLabel}</li>
      </ul>
      <h4>{countdownLabel}</h4>
      <p>
        {`${'0' + daysRemaining}d ${
          hoursRemaining >= 10 ? hoursRemaining : '0' + hoursRemaining
        }h ${
          minutesRemaining >= 10 ? minutesRemaining : '0' + minutesRemaining
        }m ${
          secondsRemaining >= 10 ? secondsRemaining : '0' + secondsRemaining
        }s`}
      </p>
    </div>
  );
};
