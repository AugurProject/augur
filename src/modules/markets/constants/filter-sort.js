// Filter/Sort Defaults
export const FILTER_SORT_TYPE = 'open'
export const FILTER_SORT_SORT = 'volume'
export const FILTER_SORT_ISDESC = true

// Filter Types
export const FILTER_TYPE_OPEN = 'open'
export const FILTER_TYPE_REPORTING = 'reporting'
export const FILTER_TYPE_CLOSED = 'closed'

export const SELECT_TYPE_OPTIONS = [
  {
    label: 'Open',
    value: FILTER_TYPE_OPEN,
  },
  {
    label: 'Reporting',
    value: FILTER_TYPE_REPORTING,
  },
  {
    label: 'Closed',
    value: FILTER_TYPE_CLOSED,
  },
]

export const SELECT_SORT_OPTIONS = [
  {
    label: 'Volume',
    value: 'volume',
  },
  {
    label: 'Newest',
    value: 'creationTime',
  },
  {
    label: 'Expiration',
    value: 'endDate',
  },
  {
    label: 'Settlement Fee',
    value: 'settlementFeePercent',
  },
]

export const SELECT_ORDER_OPTIONS = {
  isDesc: true,
}
