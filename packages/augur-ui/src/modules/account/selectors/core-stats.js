import { createBigNumber } from 'utils/create-big-number'
import { createSelector } from 'reselect'
import store from 'src/store'
import { selectAccountTradesState, selectCurrentTimestamp, selectBlockchainState, selectOutcomesDataState } from 'src/select-state'
import { augur } from 'services/augurjs'
import { formatEther } from 'utils/format-number'
import { ZERO } from 'modules/trade/constants/numbers'
import { selectLoginAccount } from 'modules/auth/selectors/login-account'
import selectLoginAccountPositions from 'modules/my-positions/selectors/login-account-positions'
import getValue from 'utils/get-value'

export default function () {
  return selectCoreStats(store.getState())
}

export const selectOutcomeLastPrice = (marketOutcomeData, outcomeId) => {
  if (!marketOutcomeData || !outcomeId) return null
  return (marketOutcomeData[outcomeId] || {}).price
}

// Period is in days
export const createPeriodPLSelector = period => createSelector(
  selectAccountTradesState,
  selectBlockchainState,
  selectOutcomesDataState,
  selectCurrentTimestamp,
  (accountTrades, blockchain, outcomesData, currentTimestamp) => {
    if (!accountTrades || !blockchain) return null

    const periodDate = new Date(currentTimestamp - (period*24*60*60*1000))
    const periodTime = (periodDate.getTime() / 1000)

    return Object.keys(accountTrades).reduce((p, marketId) => { // Iterate over marketIds
      if (!outcomesData[marketId]) return p

      const accumulatedPL = Object.keys(accountTrades[marketId]).reduce((p, outcomeId) => { // Iterate over outcomes

        const periodTrades = accountTrades[marketId][outcomeId].filter(trade => trade.timestamp > periodTime) // Filter out trades older than periodTime
        const lastPrice = selectOutcomeLastPrice(outcomesData[marketId], outcomeId)
        const { realized, unrealized } = augur.trading.calculateProfitLoss({ trades: periodTrades, lastPrice })

        return p.plus(createBigNumber(realized, 10).plus(createBigNumber(unrealized, 10)))
      }, ZERO)

      return p.plus(accumulatedPL)
    }, ZERO)
  },
)

export const selectCoreStats = createSelector(
  selectAccountTradesState,
  selectBlockchainState,
  selectOutcomesDataState,
  selectLoginAccount,
  selectLoginAccountPositions,
  createPeriodPLSelector(30),
  createPeriodPLSelector(1),
  (accountTrades, blockchain, outcomesData, loginAccount, loginAccountPositions, totalPLMonth, totalPLDay) => [
    // Group 1
    {
      totalEth: {
        label: 'ETH Tokens',
        title: 'Ether Tokens -- outcome trading currency',
        value: { ...loginAccount.ethTokens, denomination: null },
      },
      totalRealEth: {
        label: 'ETH',
        title: 'Ether -- pays transaction gas fees',
        value: { ...loginAccount.eth, denomination: null },
      },
      totalRep: {
        label: 'REP',
        title: 'Reputation -- event voting currency',
        value: { ...loginAccount.rep, denomination: null },
      },
    },
    // Group 2
    // NOTE -- group two is excluded for now due to not having all OPEN orders available without calling against every market
    // {
    //  totalRiskedEth: {
    //    label: 'Risked ETH',
    //    title: 'Risked Ether -- Ether tied up in positions',
    //    value: totalRiskedEth
    //  },
    //  totalAvailableEth: {
    //    label: 'Available ETH',
    //    title: 'Available Ether -- Ether not tied up in positions',
    //    value: totalAvailableEth
    //  }
    // },
    // Group 3
    {
      totalPL: {
        label: 'Total P/L',
        title: 'Profit/Loss -- net of all trades',
        value: getValue(loginAccountPositions, 'summary.totalNet'),
      },
      totalPLMonth: {
        label: '30 Day P/L',
        title: 'Profit/Loss -- net of all trades over the last 30 days',
        value: formatEther(loginAccount.totalPLMonth),
      },
      totalPLDay: {
        label: '1 Day P/L',
        title: 'Profit/Loss -- net of all trades over the last day',
        value: formatEther(loginAccount.totalPLDay),
      },
    },
  ],
)
