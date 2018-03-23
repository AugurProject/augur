import BigNumber from 'bignumber.js'
import { augur } from 'services/augurjs'
import { debounce } from 'lodash'
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
import { MY_MARKETS } from 'modules/routes/constants/views'
import { connectAugur } from 'modules/app/actions/init-augur'
import { updateAugurNodeConnectionStatus, updateConnectionStatus } from 'modules/app/actions/update-connection'
import { loadMarketsDisputeInfo } from 'modules/markets/actions/load-markets-dispute-info'
import { updateModal } from 'modules/modal/actions/update-modal'
import { MODAL_NETWORK_DISCONNECTED } from 'modules/modal/constants/modal-types'

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
      MarketState: (err, log) => {
        if (err) return console.error('MarketState:', err)
        if (log) {
          if (log.removed) {
            console.log('MarketState removed:', log)
          } else {
            console.log('MarketState:', log)
            dispatch(loadMarketsInfo([log.marketId]))
          }
        }
      },
      InitialReportSubmitted: (err, log) => {
        if (err) return console.error('InitialReportSubmitted:', err)
        if (log) {
          if (log.removed) {
            console.log('InitialReportSubmitted removed:', log)
          } else {
            dispatch(loadMarketsInfo([log.market]))
            if (log.reporter === getState().loginAccount.address) {
              dispatch(updateAssets())
            }
          }
        }
      },
      MarketCreated: (err, log) => {
        if (err) return console.error('MarketCreated:', err)
        if (log) {
          if (log.removed) {
            console.log('MarketCreated removed:', log)
          } else {
            console.log('MarketCreated:', log)
            // augur-node emitting log.market from raw contract logs.
            dispatch(loadMarketsInfo([log.market]))
            if (log.marketCreator === getState().loginAccount.address) {
              dispatch(updateAssets())
              dispatch(convertLogsToTransactions(TYPES.CREATE_MARKET, [log]))
            }
          }
        }
      },
      TokensTransferred: (err, log) => {
        if (err) return console.error('TokensTransferred:', err)
        if (log) {
          if (log.removed) {
            console.log('TokensTransferred removed:', log)
          } else {
            console.log('TokensTransferred:', log)
            const { address } = getState().loginAccount
            if (log.from === address || log.to === address) {
              dispatch(updateAssets())
              dispatch(convertLogsToTransactions(TYPES.TRANSFER, [log]))
            }
          }
        }
      },
      OrderCanceled: (err, log) => {
        if (err) return console.error('OrderCanceled:', err)
        if (log) {
          if (log.removed) {
            console.log('OrderCanceled removed:', log)
          } else {
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
        }
      },
      OrderCreated: (err, log) => {
        if (err) return console.error('OrderCreated:', err)
        if (log) {
          if (log.removed) {
            console.log('OrderCreated removed:', log)
          } else {
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
        }
      },
      OrderFilled: (err, log) => {
        if (err) return console.error('OrderFilled:', err)
        if (log) {
          if (log.removed) {
            console.log('OrderFilled removed:', log)
          } else {
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
        }
      },
      TradingProceedsClaimed: (err, log) => {
        if (err) return console.error('TradingProceedsClaimed:', err)
        if (log) {
          if (log.removed) {
            console.log('TradingProceedsClaimed removed:', log)
          } else {
            console.log('TradingProceedsClaimed:', log)
            if (log.sender === getState().loginAccount.address) {
              dispatch(updateAssets())
              dispatch(convertLogsToTransactions(TYPES.PAYOUT, [log]))
            }
          }
        }
      },
      DesignatedReportSubmitted: (err, log) => {
        if (err) return console.error('DesignatedReportSubmitted:', err)
        if (log) {
          if (log.removed) {
            console.log('DesignatedReportSubmitted removed:', log)
          } else {
            console.log('DesignatedReportSubmitted:', log)
          }
        }
      },
      ReportSubmitted: (err, log) => {
        if (err) return console.error('ReportSubmitted:', err)
        if (log) {
          if (log.removed) {
            console.log('ReportSubmitted removed:', log)
          } else {
            console.log('ReportSubmitted:', log)
            if (log.reporter === getState().loginAccount.address) {
              dispatch(updateAssets())
              dispatch(convertLogsToTransactions(TYPES.SUBMIT_REPORT, [log]))
            }
          }
        }
      },
      ReportsDisputed: (err, log) => {
        if (err) return console.error('ReportsDisputed:', err)
        if (log) {
          if (log.removed) {
            console.log('ReportsDisputed removed:', log)
          } else {
            console.log('ReportsDisputed:', log)
          }
        }
      },
      MarketFinalized: (err, log) => {
        if (err) return console.error('MarketFinalized:', err)
        if (log) {
          if (log.removed) {
            console.log('MarketFinalized removed:', log)
          } else {
            console.log('MarketFinalized:', log)
            const { universe, loginAccount } = getState()
            if (universe.id === log.universe) {
              dispatch(loadMarketsInfo([log.marketId], () => {
                const { volume, author, description } = getState().marketsData[log.marketId]
                dispatch(updateMarketCategoryPopularity(log.marketId, new BigNumber(volume, 10).negated().toNumber()))
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
        }
      },
      UniverseForked: (err, log) => {
        if (err) return console.error('UniverseForked:', err)
        if (log) {
          if (log.removed) {
            console.log('UniverseForked removed:', log)
          } else {
            console.log('UniverseForked:', log)
          }
        }
      },
      CompleteSetsPurchased: (err, log) => {
        if (err) return console.error('CompleteSetsPurchased:', err)
        if (log) {
          if (log.removed) {
            console.log('CompleteSetsPurchased removed:', log)
          } else {
            console.log('CompleteSetsPurchased:', log)
          }
        }
      },
      CompleteSetsSold: (err, log) => {
        if (err) return console.error('CompleteSetsSold:', err)
        if (log) {
          if (log.removed) {
            console.log('CompleteSetsSold removed:', log)
          } else {
            console.log('CompleteSetsSold:', log)
          }
        }
      },
      TokensMinted: (err, log) => {
        if (err) return console.error('TokensMinted:', err)
        if (log) {
          if (log.removed) {
            console.log('TokensMinted removed:', log)
          } else {
            console.log('TokensMinted:', log)
          }
        }
      },
      TokensBurned: (err, log) => {
        if (err) return console.error('TokensBurned:', err)
        if (log) {
          if (log.removed) {
            console.log('TokensBurned removed:', log)
          } else {
            console.log('TokensBurned:', log)
          }
        }
      },
      FeeWindowCreated: (err, log) => {
        if (err) return console.error('FeeWindowCreated:', err)
        if (log) {
          if (log.removed) {
            console.log('FeeWindowCreated removed:', log)
          } else {
            console.log('FeeWindowCreated:', log)
          }
        }
      },
      InitialReporterTransferred: (err, log) => {
        if (err) return console.error('InitialReporterTransferred:', err)
        if (log) {
          if (log.removed) {
            console.log('InitialReporterTransferred removed:', log)
          } else {
            console.log('InitialReporterTransferred:', log)
          }
        }
      },
      TimestampSet: (err, log) => {
        if (err) return console.error('TimestampSet:', err)
        if (log) {
          if (log.removed) {
            console.log('TimestampSet removed:', log)
          } else {
            console.log('TimestampSet:', log)
          }
        }
      },
      DisputeCrowdsourcerCreated: (err, log) => {
        if (err) return console.error('DisputeCrowdsourcerCreated:', err)
        if (log) {
          if (log.removed) {
            console.log('DisputeCrowdsourcerCreated removed:', log)
          } else {
            console.log('DisputeCrowdsourcerCreated:', log)
            const marketId = log.market
            dispatch(loadMarketsDisputeInfo([marketId]))
          }
        }
      },
      DisputeCrowdsourcerContribution: (err, log) => {
        if (err) return console.error('DisputeCrowdsourcerContribution:', err)
        if (log) {
          if (log.removed) {
            console.log('DisputeCrowdsourcerContribution removed:', log)
          } else {
            console.log('DisputeCrowdsourcerContribution:', log)
            const marketId = log.market
            dispatch(loadMarketsDisputeInfo([marketId]))
          }
        }
      },
      InitialReporterRedeemed: (err, log) => {
        if (err) return console.error('InitialReporterRedeemed:', err)
        if (log) {
          if (log.removed) {
            console.log('InitialReporterRedeemed removed:', log)
          } else {
            console.log('InitialReporterRedeemed:', log)
          }
        }
      },
      DisputeCrowdsourcerRedeemed: (err, log) => {
        if (err) return console.error('DisputeCrowdsourcerRedeemed:', err)
        if (log) {
          if (log.removed) {
            console.log('DisputeCrowdsourcerRedeemed removed:', log)
          } else {
            console.log('DisputeCrowdsourcerRedeemed:', log)
            const marketId = log.market
            dispatch(loadMarketsDisputeInfo([marketId]))
          }
        }
      },
      FeeWindowRedeemed: (err, log) => {
        if (err) return console.error('FeeWindowRedeemed:', err)
        if (log) {
          if (log.removed) {
            console.log('FeeWindowRedeemed removed:', log)
          } else {
            console.log('FeeWindowRedeemed:', log)
          }
        }
      },
      UniverseCreated: (err, log) => {
        if (err) return console.error('UniverseCreated:', err)
        if (log) {
          if (log.removed) {
            console.log('UniverseCreated removed:', log)
          } else {
            console.log('UniverseCreated:', log)
          }
        }
      },
    }, err => console.log(err || 'Listening for events'))

    const reInitAugur = () => {
      const retryTimer = 3000 // attempt re-initAugur every 3 seconds.
      const retry = (callback = cb) => {
        const { connection, env } = getState()
        if (!connection.isConnected || !connection.isConnectedToAugurNode) {
          dispatch(updateModal({
            type: MODAL_NETWORK_DISCONNECTED,
            connection,
            env,
          }))
          if (connection.isReconnectionPaused) {
            // reconnection has been set to paused, recursive call instead
            callback(connection.isReconnectionPaused)
          } else {
            // reconnection isn't paused, retry connectAugur
            dispatch(connectAugur(history, env, false, callback))
          }
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

    augur.events.nodes.augur.on('disconnect', (event) => {
      console.warn('Disconnected from augur-node', event)
      const { connection, env } = getState()
      if (connection.isConnectedToAugurNode) {
        dispatch(updateModal({
          type: MODAL_NETWORK_DISCONNECTED,
          connection,
          env,
        }))
        dispatch(updateAugurNodeConnectionStatus(false))
      }
      reInitAugur()
    })

    augur.events.nodes.ethereum.on('disconnect', (event) => {
      console.warn('Disconnected from Ethereum', event)
      const { connection, env } = getState()
      if (connection.isConnected) {
        dispatch(updateModal({
          type: MODAL_NETWORK_DISCONNECTED,
          connection,
          env,
        }))
        dispatch(updateConnectionStatus(false))
      }
      reInitAugur()
    })
  }
}
