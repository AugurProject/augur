import BigNumber from 'bignumber.js'
import { augur } from 'services/augurjs'
import { updateAssets } from 'modules/auth/actions/update-assets'
import { syncBlockchain } from 'modules/app/actions/sync-blockchain'
import syncUniverse from 'modules/universe/actions/sync-universe'
import { convertLogsToTransactions } from 'modules/transactions/actions/convert-logs-to-transactions'
import { loadMarketsInfo } from 'modules/markets/actions/load-markets-info'
import { loadFullMarket } from 'modules/market/actions/load-full-market'
import { updateOutcomePrice } from 'modules/markets/actions/update-outcome-price'
import { removeCanceledOrder } from 'modules/bids-asks/actions/update-order-status'
import { updateMarketCategoryPopularity } from 'modules/categories/actions/update-categories'
import { updateAccountTradesData, updateAccountBidsAsksData, updateAccountCancelsData, updateAccountPositionsData } from 'modules/my-positions/actions/update-account-trades-data'
import { addNotification } from 'modules/notifications/actions/update-notifications'
import makePath from 'modules/routes/helpers/make-path'
import * as TYPES from 'modules/transactions/constants/types'
import { MY_MARKETS, DEFAULT_VIEW } from 'modules/routes/constants/views'
import { resetState } from 'modules/app/actions/reset-state'
import { connectAugur } from 'modules/app/actions/init-augur'
import { updateModal } from 'modules/modal/actions/update-modal'
import { MODAL_NETWORK_DISCONNECTED } from 'modules/modal/constants/modal-types'
import debounce from 'utils/debounce'


export function listenToUpdates(history) {
  return (dispatch, getState) => {
    augur.events.stopBlockListeners()
    augur.events.stopAugurNodeEventListeners()
    augur.events.stopBlockchainEventListeners()
    augur.events.startBlockListeners({
      onAdded: (block) => {
        dispatch(syncBlockchain())
        dispatch(syncUniverse())
      },
      onRemoved: (block) => {
        dispatch(syncBlockchain())
        dispatch(syncUniverse())
      },
    })
    augur.events.startAugurNodeEventListeners({
      MarketCreated: (err, log) => {
        if (err) return console.error('MarketCreated:', err)
        if (log) {
          console.log('MarketCreated:', log)
          // augur-node emitting log.market from raw contract logs.
          dispatch(loadMarketsInfo([log.market]))
          if (log.marketCreator === getState().loginAccount.address) {
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
          if (log.from === address || log.to === address) {
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
          if (log.orderCreator === getState().loginAccount.address) {
            dispatch(updateAccountCancelsData({
              [log.marketId]: { [log.outcome]: [log] },
            }, log.marketId))
            dispatch(removeCanceledOrder(log.orderId))
            dispatch(updateAssets())
          }
        }
      },
      OrderCreated: (err, log) => {
        if (err) return console.error('OrderCreated:', err)
        if (log) {
          console.log('OrderCreated:', log)
          // if this is the user's order, then add it to the transaction display
          if (log.orderCreator === getState().loginAccount.address) {
            dispatch(updateAccountBidsAsksData({
              [log.marketId]: {
                [log.outcome]: [log],
              },
            }, log.marketId))
            dispatch(updateAssets())
          }
        }
      },
      OrderFilled: (err, log) => {
        if (err) return console.error('OrderFilled:', err)
        if (log) {
          console.log('OrderFilled:', log)
          dispatch(updateOutcomePrice(log.marketId, log.outcome, new BigNumber(log.price, 10)))
          dispatch(updateMarketCategoryPopularity(log.market, log.amount))
          dispatch(loadFullMarket(log.marketId))
          const { address } = getState().loginAccount
          if (log.filler === address || log.creator === address) {
            // dispatch(convertLogsToTransactions(TYPES.FILL_ORDER, [log]))
            updateAccountTradesData(updateAccountTradesData({
              [log.marketId]: {
                [log.outcome]: [log],
              },
            }, log.marketId))
            dispatch(updateAccountPositionsData({
              [log.marketId]: {
                [log.outcome]: [{
                  ...log,
                  maker: log.creator === address,
                }],
              },
            }))
            dispatch(updateAssets())
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
          if (log.reporter === getState().loginAccount.address) {
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
            dispatch(loadMarketsInfo([log.marketId], () => {
              const { volume, author, description } = getState().marketsData[log.marketId]
              dispatch(updateMarketCategoryPopularity(log.marketId, new BigNumber(volume, 10).neg().toNumber()))
              if (loginAccount.address === author) {
                dispatch(addNotification({
                  id: log.hash,
                  timestamp: log.timestamp,
                  blockNumber: log.blockNumber,
                  title: `Collect Fees`,
                  description: `Market Finalized: "${description}"`,
                  linkPath: makePath(MY_MARKETS),
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

    const retryFunc = () => {
      const retryTimer = 3000

      const retry = (cb) => {
        const { connection, env } = getState()
        if (!connection.isConnected) {
          dispatch(updateModal({
            type: MODAL_NETWORK_DISCONNECTED,
            connection,
            env,
          }))
          dispatch(connectAugur(history, env, false, cb))
        }
      }

      const debounceCall = debounce(retry, retryTimer)

      const cb = (err, connection) => {
        // both args should be undefined if we are connected.
        if (!err && !connection) return
        if (err || !connection.augurNode || !connection.ethereumNode) {
          debounceCall(cb)
        }
      }

      debounceCall(cb)
    }

    augur.events.nodes.augur.on('disconnect', () => {
      const { connection, env } = getState()
      if (connection.isConnected) {
        // if we were connected when disconnect occured, then resetState and redirect.
        dispatch(resetState())
        dispatch(updateModal({
          type: MODAL_NETWORK_DISCONNECTED,
          connection: getState().connection,
          env,
        }))
        history.push(makePath(DEFAULT_VIEW))
      }
      // attempt re-initAugur every 3 seconds.
      retryFunc()
    })
    augur.events.nodes.ethereum.on('disconnect', () => {
      const { connection, env } = getState()
      if (connection.isConnected) {
        // if we were connected when disconnect occured, then resetState and redirect.
        dispatch(resetState())
        dispatch(updateModal({
          type: MODAL_NETWORK_DISCONNECTED,
          connection: getState().connection,
          env,
        }))
        history.push(makePath(DEFAULT_VIEW))
      }
      // attempt re-initAugur every 3 seconds.
      retryFunc()
    })
  }
}
