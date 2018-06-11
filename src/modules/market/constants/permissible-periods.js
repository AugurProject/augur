import {
  timeDay,
  timeHour,
  timeMinute,
  timeMonth,
  timeSecond,
  timeFormat,
} from 'd3'

// Note: times are in seconds
export const RANGES = [
  {
    duration: 60,
    label: 'Past minute',
    tickInterval: axis => axis.ticks(timeSecond.every(30)),
  },
  {
    duration: 3600,
    label: 'Past hour',
    tickInterval: axis => axis.ticks(timeMinute.every(10)),
  },
  {
    duration: 86400,
    label: 'Past day',
    isDefault: true,
    tickInterval: axis => axis.ticks(timeHour.every(3)),
  },
  {
    duration: 604800,
    label: 'Past week',
    tickInterval: axis => axis.ticks(timeDay.every(1)),
  },
  {
    duration: 2629800,
    label: 'Past month',
    tickInterval: axis => axis.ticks(timeDay.every(6)),
  },
  {
    duration: 31557600,
    label: 'Past year',
    tickInterval: axis => axis.ticks(timeMonth.every(1)).tickFormat(timeFormat('%b')),
  },
]

export const
  PERIODS = [
    {
      duration: 30,
      label: 'Every thirty seconds',
    },
    {
      duration: 60,
      label: 'Every minute',
    },
    {
      duration: 3600,
      label: 'Hourly',
      isDefault: true,
    },
    {
      duration: 86400,
      label: 'Daily',
    },
    {
      duration: 604800,
      label: 'Weekly',
    },
    {
      duration: 2629800,
      label: 'Monthly',
    },
  ]
