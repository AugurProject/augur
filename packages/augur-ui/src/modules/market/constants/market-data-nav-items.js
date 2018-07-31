import { MARKET_DATA_NAV_OUTCOMES, MARKET_DATA_ORDERS, MARKET_DATA_NAV_CHARTS, MARKET_DATA_NAV_DETAILS, MARKET_DATA_NAV_REPORT, MARKET_DATA_NAV_SNITCH } from 'modules/routes/constants/views' // TODO -- these should really be params, not views

export const MARKET_DATA_NAV_ITEMS = {
  [MARKET_DATA_NAV_OUTCOMES]: {
    label: 'Outcomes',
  },
  [MARKET_DATA_ORDERS]: {
    label: 'Order Book',
    isMobile: true,
  },
  [MARKET_DATA_NAV_CHARTS]: {
    label: 'Charts',
  },
  [MARKET_DATA_NAV_DETAILS]: {
    label: 'Details',
  },
  [MARKET_DATA_NAV_REPORT]: {
    label: 'Report',
    isReportTabVisible: true,
  },
  [MARKET_DATA_NAV_SNITCH]: {
    label: 'Snitch',
    isSnitchTabVisible: true,
  },
}
