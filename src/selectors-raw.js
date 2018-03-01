// NOTE -- no longer used, leaving temporarily for historical ref

import loginAccount from 'modules/auth/selectors/login-account'
import categories from 'modules/categories/selectors/categories'
import marketsHeader from 'modules/markets/selectors/markets-header'
import marketsTotals from 'modules/markets/selectors/markets-totals'
import allMarkets from 'modules/markets/selectors/markets-all'
import orderCancellation from 'modules/bids-asks/selectors/order-cancellation'
import market from 'modules/market/selectors/market'
import portfolio from 'modules/portfolio/selectors/portfolio'
import loginAccountPositions from 'modules/my-positions/selectors/login-account-positions'
import transactions from 'modules/transactions/selectors/transactions'
import transactionsTotals from 'modules/transactions/selectors/transactions-totals'
import isTransactionsWorking from 'modules/transactions/selectors/is-transactions-working'
import tradesInProgress from 'modules/trade/selectors/trade-in-progress'
import coreStats from 'modules/account/selectors/core-stats'
import { MARKET_DATA_NAV_ITEMS } from 'modules/market/constants/market-data-nav-items'
import { MARKET_USER_DATA_NAV_ITEMS } from 'modules/market/constants/market-user-data-nav-items'
import { OUTCOME_TRADE_NAV_ITEMS } from 'modules/outcomes/constants/outcome-trade-nav-items'
import closePositionStatus from 'modules/my-positions/selectors/close-position-status'
import openOrders from 'modules/user-open-orders/selectors/open-orders'
import notifications from 'modules/notifications/selectors/notifications'

const selectors = {
  loginAccount,
  marketsHeader,
  marketsTotals,
  allMarkets,
  orderCancellation,
  market,
  categories,
  portfolio,
  loginAccountPositions,
  transactions,
  transactionsTotals,
  notifications,
  isTransactionsWorking,
  tradesInProgress,
  coreStats,
  marketDataNavItems: () => MARKET_DATA_NAV_ITEMS,
  marketUserDataNavItems: () => MARKET_USER_DATA_NAV_ITEMS,
  outcomeTradeNavItems: () => OUTCOME_TRADE_NAV_ITEMS,
  closePositionStatus,
  openOrders,
}

export default selectors
