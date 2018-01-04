import BigNumber from 'bignumber.js'
import { augur } from 'services/augurjs'
import { updateAssets } from 'modules/auth/actions/update-assets'
import { syncBlockchain } from 'modules/app/actions/sync-blockchain'
import syncUniverse from 'modules/universe/actions/sync-universe'
import { convertLogsToTransactions } from 'modules/transactions/actions/convert-logs-to-transactions'
import { loadMarketsInfo } from 'modules/markets/actions/load-markets-info'
import { updateOutcomePrice } from 'modules/markets/actions/update-outcome-price'
// import { fillOrder } from 'modules/bids-asks/actions/update-market-order-book'
import { updateMarketCategoryPopularity } from 'modules/categories/actions/update-categories'
import { updateAccountTradesData, updateAccountBidsAsksData, updateAccountCancelsData, updateAccountPositionsData } from 'modules/my-positions/actions/update-account-trades-data'
import { addNotification } from 'modules/notifications/actions/update-notifications'
// import claimTradingProceeds from 'modules/my-positions/actions/claim-trading-proceeds'
import makePath from 'modules/routes/helpers/make-path'
import * as TYPES from 'modules/transactions/constants/types'
import { MY_MARKETS } from 'modules/routes/constants/views'

export function listenToUpdates() {
  return (dispatch, getState) => {
    augur.events.startBlockListeners({
      onAdded: (block) => {
        console.log('block added:', block)
        dispatch(syncBlockchain())
        dispatch(syncUniverse())
      },
      onRemoved: (block) => {
        console.log('block removed:', block)
        dispatch(syncBlockchain())
        dispatch(syncUniverse())
      }
    })
    augur.events.startAugurNodeEventListeners({
      MarketCreated: (err, log) => {
        if (err) return console.error('MarketCreated:', err)
        if (log) {
          console.log('MarketCreated:', log)
          dispatch(loadMarketsInfo([log.marketID]))
          if (log.sender === getState().loginAccount.address) {
            dispatch(updateAssets())
            dispatch(convertLogsToTransactions(TYPES.CREATE_MARKET, [log]))
          }
        }
      },
      TokensTransferred: (err, log) => {
        if (err) return console.error('TokensTransferred:', err)
        if (log) {
          console.log('TokensTransferred:', log)
          const { address } = getState().loginAccount
          if (log._from === address || log._to === address) {
            dispatch(updateAssets())
            dispatch(convertLogsToTransactions(TYPES.TRANSFER, [log]))
          }
        }
      },
      OrderCanceled: (err, log) => {
        if (err) return console.error('OrderCanceled:', err)
        if (log) {
          console.log('OrderCanceled:', log)
          // if this is the user's order, then add it to the transaction display
          if (log.sender === getState().loginAccount.address) {
            dispatch(updateAccountCancelsData({
              [log.marketID]: { [log.outcome]: [log] }
            }, log.marketID))
            dispatch(updateAssets())
          }
        }
      },
      OrderCreated: (err, log) => {
        if (err) return console.error('OrderCreated:', err)
        if (log) {
          console.log('OrderCreated:', log)
          // if this is the user's order, then add it to the transaction display
          if (log.sender === getState().loginAccount.address) {
            dispatch(updateAccountBidsAsksData({
              [log.marketID]: {
                [log.outcome]: [log]
              }
            }, log.marketID))
            dispatch(updateAssets())
          }
        }
      },
      OrderFilled: (err, log) => {
        if (err) return console.error('OrderFilled:', err)
        if (log) {
          console.log('OrderFilled:', log)
          dispatch(updateOutcomePrice(log.marketID, log.outcome, new BigNumber(log.price, 10)))
          dispatch(updateMarketCategoryPopularity(log.market, log.amount))
          const { address } = getState().loginAccount
          if (log.sender === address || log.owner === address) {
            // dispatch(convertLogsToTransactions(TYPES.FILL_ORDER, [log]))
            updateAccountTradesData(updateAccountTradesData({
              [log.marketID]: {
                [log.outcome]: [log]
              }
            }, log.marketID))
            dispatch(updateAccountPositionsData({
              [log.marketID]: {
                [log.outcome]: [{
                  ...log,
                  maker: log.creator === address
                }]
              }
            }))
            dispatch(updateAssets())
            dispatch(loadMarketsInfo([log.marketID]))
            console.log('MSG -- ', log)
          }
        }
      },
      TradingProceedsClaimed: (err, log) => {
        if (err) return console.error('TradingProceedsClaimed:', err)
        if (log) {
          console.log('TradingProceedsClaimed:', log)
          if (log.sender === getState().loginAccount.address) {
            dispatch(updateAssets())
            dispatch(convertLogsToTransactions(TYPES.PAYOUT, [log]))
          }
        }
      },
      DesignatedReportSubmitted: (err, log) => {
        if (err) return console.error('DesignatedReportSubmitted:', err)
        if (log) {
          console.log('DesignatedReportSubmitted:', log)
        }
      },
      ReportSubmitted: (err, log) => {
        if (err) return console.error('ReportSubmitted:', err)
        if (log) {
          console.log('ReportSubmitted:', log)
          if (log.sender === getState().loginAccount.address) {
            dispatch(updateAssets())
            dispatch(convertLogsToTransactions(TYPES.SUBMIT_REPORT, [log]))
          }
        }
      },
      WinningTokensRedeemed: (err, log) => {
        if (err) return console.error('WinningTokensRedeemed:', err)
        if (log) {
          console.log('WinningTokensRedeemed:', log)
          if (log.reporter === getState().loginAccount.address) {
            dispatch(updateAssets())
            dispatch(convertLogsToTransactions(TYPES.REDEEM_WINNING_TOKENS, [log]))
          }
        }
      },
      ReportsDisputed: (err, log) => {
        if (err) return console.error('ReportsDisputed:', err)
        if (log) {
          console.log('ReportsDisputed:', log)
        }
      },
      MarketFinalized: (err, log) => {
        if (err) return console.error('MarketFinalized:', err)
        if (log) {
          console.log('MarketFinalized:', log)
          const { universe, loginAccount } = getState()
          if (universe.id === log.universe) {
            dispatch(loadMarketsInfo([log.marketID], () => {
              const { volume, author, description } = getState().marketsData[log.marketID]
              dispatch(updateMarketCategoryPopularity(log.marketID, new BigNumber(volume, 10).neg().toNumber()))
              if (loginAccount.address === author) {
                dispatch(addNotification({
                  id: log.hash,
                  timestamp: log.timestamp,
                  blockNumber: log.blockNumber,
                  title: `Collect Fees`,
                  description: `Market Finalized: "${description}"`,
                  linkPath: makePath(MY_MARKETS)
                }))
              }
            }))
          }
        }
      },
      UniverseForked: (err, log) => {
        if (err) return console.error('UniverseForked:', err)
        if (log) {
          console.log('UniverseForked:', log)
        }
      },
    }, err => console.log(err || 'Listening for events'))
  }
}
