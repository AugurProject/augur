import {
  timeDay,
  timeHour,
  timeMinute,
  timeMonth,
  timeSecond,
} from 'd3'

// Note: times are in seconds
export const RANGES = [
  {
    duration: 60,
    label: 'Past minute',
    tickInterval: timeSecond.every(30),
  },
  {
    duration: 3600,
    label: 'Past hour',
    tickInterval: timeMinute.every(10),
  },
  {
    duration: 86400,
    label: 'Past day',
    isDefault: true,
    tickInterval: timeHour.every(3),
  },
  {
    duration: 604800,
    label: 'Past week',
    tickInterval: timeDay.every(1),
  },
  {
    duration: 2629800,
    label: 'Past month',
    tickInterval: timeDay.every(6),
  },
  {
    duration: 31557600,
    label: 'Past year',
    tickInterval: timeMonth.every(1),
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
