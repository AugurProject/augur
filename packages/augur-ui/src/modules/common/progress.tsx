import React, { useState, useEffect } from 'react';
import Styles from 'modules/common/progress.styles.less';
import * as format from 'utils/format-date';
import classNames from 'classnames';
import { DateFormattedObject } from 'modules/types';
import { REPORTING_STATE } from 'modules/common/constants';
import { useAppStatusStore } from 'modules/app/store/app-status';

export interface CountdownProgressProps {
  time?: DateFormattedObject;
  label: string;
  countdownBreakpoint?: number;
  firstColorBreakpoint?: number;
  finalColorBreakpoint?: number;
  alignRight?: boolean;
  reportingState?: string;
  value?: string;
  forceLongDate?: boolean;
  onlyFinalCountdown?: boolean;
}

export interface TimeProgressBarProps {
  startTime: DateFormattedObject;
  endTime: DateFormattedObject;
}

export interface MarketProgressProps {
  reportingState: string;
  endTimeFormatted: DateFormattedObject;
  reportingWindowEndTime: DateFormattedObject | number;
  customLabel?: string;
  alignRight?: boolean;
  forkingMarket?: boolean;
  forkingEndTime?: number;
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
  reportingEndTime: DateFormattedObject,
  alignRight: boolean,
  forkingMarket: boolean,
  forkingEndTime: number
) => {
  let label: string = '';
  let time: DateFormattedObject = null;
  switch (reportingState) {
    case REPORTING_STATE.PRE_REPORTING:
      label = `Event Expiration${alignRight ? '' : ':'}`;
      time = endTimeFormatted;
      break;
    case REPORTING_STATE.DESIGNATED_REPORTING:
      label = 'Time left to report';
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
      time = endTimeFormatted;
      break;
  }

  if (forkingMarket) {
    label = 'Time Left in Fork Window';
    time = formatTime(forkingEndTime);
  }

  return { label, time };
};

export const MarketProgress = ({
  reportingState,
  endTimeFormatted,
  reportingWindowEndTime,
  customLabel,
  alignRight,
  forkingEndTime,
  forkingMarket,
}: MarketProgressProps) => {
  const reportingEndTime = formatTime(reportingWindowEndTime);
  const { label, time } = reportingStateToLabelTime(
    reportingState,
    endTimeFormatted,
    reportingEndTime,
    alignRight,
    forkingMarket,
    forkingEndTime
  );

  return (
    <CountdownProgress
      label={customLabel || label}
      time={time}
      reportingState={reportingState}
      alignRight={alignRight}
    />
  );
};

export const useTimer = () => {
  const [currentTime, setCurrentTime] = useState(Math.floor(Date.now() / 1000));

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(seconds => seconds + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [currentTime]);

  return currentTime;
};

export const CountdownProgress = ({
  label,
  time,
  countdownBreakpoint,
  firstColorBreakpoint,
  finalColorBreakpoint,
  alignRight,
  reportingState,
  value,
  forceLongDate = false,
  onlyFinalCountdown = false,
}: CountdownProgressProps) => {
  const currentTime = useTimer();

  let valueString = '';
  let timeLeft = 1;
  let countdown = false;
  const firstBreakpoint = firstColorBreakpoint || ThreeDays;
  const secondBreakpoint = finalColorBreakpoint || OneDay;
  if (time && time !== null && currentTime) {
    const daysRemaining = format.getDaysRemaining(time.timestamp, currentTime);
    const hoursRemaining = format.getHoursMinusDaysRemaining(
      time.timestamp,
      currentTime
    );
    const minutesRemaining = format.getMinutesMinusHoursRemaining(
      time.timestamp,
      currentTime
    );

    const secondsRemaining = format.getSecondsMinusMinutesRemaining(
      time.timestamp,
      currentTime
    );

    timeLeft = time.timestamp - currentTime;
    countdown =
      (countdownBreakpoint || onlyFinalCountdown ? OneDay : OneWeek) >=
        timeLeft && timeLeft > 0;
    valueString =
      countdown &&
      reportingState !== REPORTING_STATE.AWAITING_FINALIZATION &&
      reportingState !== REPORTING_STATE.FINALIZED
        ? `${onlyFinalCountdown ? `` : `${daysRemaining}:`}${
            hoursRemaining >= 10 ? hoursRemaining : `0${hoursRemaining}`
          }:${
            minutesRemaining >= 10 ? minutesRemaining : `0${minutesRemaining}`
          }:${
            secondsRemaining >= 10 ? secondsRemaining : `0${secondsRemaining}`
          }`
        : forceLongDate
        ? format.formatDate(time.value).formattedLocalShortDateTimeNoTimezone
        : format.formatDate(time.value).formattedLocalShortDateSecondary;
  }
  const breakpointOne =
    timeLeft <= firstBreakpoint && timeLeft > secondBreakpoint && countdown;
  const breakpointTwo = timeLeft <= secondBreakpoint && countdown;
  return (
    <span
      className={classNames(Styles.ProgressLabel, {
        [Styles.FirstBreakpoint]: breakpointOne && !onlyFinalCountdown,
        [Styles.SecondBreakpoint]: breakpointTwo,
        [Styles.Finished]: timeLeft < 0,
        [Styles.AlignRight]: alignRight,
      })}
    >
      <span>{label}</span>
      <span>{value || valueString}</span>
    </span>
  );
};

export const TimeProgressBar = ({
  startTime,
  endTime,
}: TimeProgressBarProps) => {
  const {
    blockchain: { currentAugurTimestamp: currentTime },
  } = useAppStatusStore();
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
  description?: string;
}

export const WindowProgress = ({ description }: WindowProgressProps) => {
  const title = 'Current Dispute Window';
  const countdownLabel = 'Time Remaining in Window';
  const {
    blockchain: { currentAugurTimestamp: currentTime },
    universe: { disputeWindow },
  } = useAppStatusStore();
  const { startTime, endTime } = disputeWindow;
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
      <TimeProgressBar
        startTime={formattedStartTime}
        endTime={formattedEndTime}
      />
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
