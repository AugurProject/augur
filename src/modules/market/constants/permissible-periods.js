// Note: times are in seconds
export const RANGES = [
  {
    duration: 60,
    label: 'Past minute',
  },
  {
    duration: 3600,
    label: 'Past hour',
  },
  {
    duration: 86400,
    label: 'Past day',
    isDefault: true,
  },
  {
    duration: 604800,
    label: 'Past week',
  },
  {
    duration: 2629800,
    label: 'Past month',
  },
  {
    duration: 31557600,
    label: 'Past year',
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
