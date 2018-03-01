import { MARKET_USER_DATA_NAV_POSITIONS, MARKET_USER_DATA_NAV_OPEN_ORDERS } from 'modules/routes/constants/views' // TODO -- These should be params, not views

export const MARKET_USER_DATA_NAV_ITEMS = {
  [MARKET_USER_DATA_NAV_POSITIONS]: {
    label: 'Positions',
  },
  [MARKET_USER_DATA_NAV_OPEN_ORDERS]: {
    label: 'Orders',
  },
}
