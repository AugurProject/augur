import memoize from 'memoizee'
import store from 'src/store'
import { formatNumber } from 'utils/format-number'

export default function (outcomes) {
  const { loginAccount } = store.getState()

  return selectUserOpenOrdersSummary(outcomes, loginAccount)
}

const selectUserOpenOrdersSummary = memoize((outcomes, loginAccount) => {
  if (loginAccount.address == null) {
    return null
  }

  const openOrdersCount = (outcomes || []).reduce((openOrdersCount, outcome) => (
    openOrdersCount + (outcome.userOpenOrders ? outcome.userOpenOrders.length : 0)
  ), 0)

  return {
    openOrdersCount: formatNumber(openOrdersCount, { denomination: 'Open Orders' }),
  }
}, { max: 10 })
