import BigNumber from 'bignumber.js'
import { augur } from 'services/augurjs'
import { debounce } from 'lodash'
import { updateAssets } from 'modules/auth/actions/update-assets'
import { syncBlockchain } from 'modules/app/actions/sync-blockchain'
import syncUniverse from 'modules/universe/actions/sync-universe'
import { addLogToTransactions, removeLogFromTransactions } from 'modules/transactions/actions/convert-logs-to-transactions'
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

export const handleMarketStateLog = (err, log) => (dispatch, getState) => {
  if (err) return console.error('MarketState:', err)
  if (log) {
    if (log.removed) {
      console.log('MarketState removed:', log)
    } else {
      console.log('MarketState:', log)
      dispatch(loadMarketsInfo([log.marketId]))
    }
  }
}

export const handleMarketCreatedLog = (err, log) => (dispatch, getState) => {
  if (err) return console.error('MarketCreated:', err)
  if (log) {
    if (log.removed) {
      console.log('MarketCreated removed:', log)
      dispatch(removeLogFromTransactions(log))
    } else {
      console.log('MarketCreated:', log)
      dispatch(loadMarketsInfo([log.market]))
      if (log.marketCreator === getState().loginAccount.address) {
        dispatch(updateAssets())
        dispatch(addLogToTransactions(TYPES.CREATE_MARKET, log))
      }
    }
  }
}

export const handleTokensTransferredLog = (err, log) => (dispatch, getState) => {
  if (err) return console.error('TokensTransferred:', err)
  if (log) {
    if (log.removed) {
      console.log('TokensTransferred removed:', log)
      dispatch(removeLogFromTransactions(log))
    } else {
      console.log('TokensTransferred:', log)
      const { address } = getState().loginAccount
      if (log.from === address || log.to === address) {
        dispatch(updateAssets())
        dispatch(addLogToTransactions(TYPES.TRANSFER, log))
      }
    }
  }
}

export const handleOrderCanceledLog = (err, log) => (dispatch, getState) => {
  if (err) return console.error('OrderCanceled:', err)
  if (log) {
    if (log.removed) {
      console.log('OrderCanceled removed:', log)
      dispatch(removeLogFromTransactions(log))
    } else {
      console.log('OrderCanceled:', log)
      // if this is the user's order, then add it to the transaction display
      if (log.orderCreator === getState().loginAccount.address) {
        dispatch(addLogToTransactions(TYPES.CANCEL_ORDER, log))
        dispatch(updateAccountCancelsData({ [log.marketId]: { [log.outcome]: [log] } }, log.marketId))
        dispatch(removeCanceledOrder(log.orderId))
        dispatch(updateAssets())
      }
    }
  }
}

export const handleOrderCreatedLog = (err, log) => (dispatch, getState) => {
  if (err) return console.error('OrderCreated:', err)
  if (log) {
    if (log.removed) {
      console.log('OrderCreated removed:', log)
      dispatch(removeLogFromTransactions(log))
    } else {
      console.log('OrderCreated:', log)
      // if this is the user's order, then add it to the transaction display
      if (log.orderCreator === getState().loginAccount.address) {
        dispatch(addLogToTransactions(TYPES.CREATE_ORDER, log))
        dispatch(updateAccountBidsAsksData({ [log.marketId]: { [log.outcome]: [log] } }, log.marketId))
        dispatch(updateAssets())
      }
    }
  }
}

export const handleOrderFilledLog = (err, log) => (dispatch, getState) => {
  if (err) return console.error('OrderFilled:', err)
  if (log) {
    if (log.removed) {
      console.log('OrderFilled removed:', log)
      dispatch(removeLogFromTransactions(log))
    } else {
      console.log('OrderFilled:', log)
      dispatch(updateOutcomePrice(log.marketId, log.outcome, new BigNumber(log.price, 10)))
      dispatch(updateMarketCategoryPopularity(log.market, log.amount))
      dispatch(loadFullMarket(log.marketId))
      const { address } = getState().loginAccount
      if (log.filler === address || log.creator === address) {
        dispatch(addLogToTransactions(TYPES.FILL_ORDER, log))
        updateAccountTradesData(updateAccountTradesData({ [log.marketId]: { [log.outcome]: [log] } }, log.marketId))
        dispatch(updateAccountPositionsData({
          [log.marketId]: {
            [log.outcome]: [{
              ...log,
              maker: log.creator === address,
            }],
          },
        }))
        dispatch(updateAssets())
      }
    }
  }
}

export const handleTradingProceedsClaimedLog = (err, log) => (dispatch, getState) => {
  if (err) return console.error('TradingProceedsClaimed:', err)
  if (log) {
    if (log.removed) {
      console.log('TradingProceedsClaimed removed:', log)
      dispatch(removeLogFromTransactions(log))
    } else {
      console.log('TradingProceedsClaimed:', log)
      if (log.sender === getState().loginAccount.address) {
        dispatch(updateAssets())
        dispatch(addLogToTransactions(TYPES.CLAIM_TRADING_PROCEEDS, log))
      }
    }
  }
}

export const handleInitialReportSubmittedLog = (err, log) => (dispatch, getState) => {
  if (err) return console.error('InitialReportSubmitted:', err)
  if (log) {
    if (log.removed) {
      console.log('InitialReportSubmitted removed:', log)
      dispatch(removeLogFromTransactions(log))
    } else {
      console.log('InitialReportSubmitted:', log)
    }
    dispatch(loadMarketsInfo([log.market]))
    if (log.reporter === getState().loginAccount.address) {
      dispatch(addLogToTransactions(TYPES.SUBMIT_INITIAL_REPORT, log))
      dispatch(updateAssets())
    }
  }
}

export const handleDesignatedReportSubmittedLog = (err, log) => (dispatch, getState) => {
  if (err) return console.error('DesignatedReportSubmitted:', err)
  if (log) {
    if (log.removed) {
      console.log('DesignatedReportSubmitted removed:', log)
      dispatch(removeLogFromTransactions(log))
    } else {
      console.log('DesignatedReportSubmitted:', log)
      dispatch(addLogToTransactions(TYPES.SUBMIT_DESIGNATED_REPORT, log))
    }
  }
}

export const handleReportSubmittedLog = (err, log) => (dispatch, getState) => {
  if (err) return console.error('ReportSubmitted:', err)
  if (log) {
    if (log.removed) {
      console.log('ReportSubmitted removed:', log)
      dispatch(removeLogFromTransactions(log))
    } else {
      console.log('ReportSubmitted:', log)
      if (log.reporter === getState().loginAccount.address) {
        dispatch(updateAssets())
        dispatch(addLogToTransactions(TYPES.SUBMIT_REPORT, log))
      }
    }
  }
}

export const handleReportsDisputedLog = (err, log) => (dispatch, getState) => {
  if (err) return console.error('ReportsDisputed:', err)
  if (log) {
    if (log.removed) {
      console.log('ReportsDisputed removed:', log)
      dispatch(removeLogFromTransactions(log))
    } else {
      console.log('ReportsDisputed:', log)
      dispatch(addLogToTransactions(TYPES.DISPUTE_REPORTS, log))
    }
  }
}

export const handleMarketFinalizedLog = (err, log) => (dispatch, getState) => {
  if (err) return console.error('MarketFinalized:', err)
  if (log) {
    if (log.removed) {
      console.log('MarketFinalized removed:', log)
      dispatch(removeLogFromTransactions(log))
    } else {
      console.log('MarketFinalized:', log)
      const { universe, loginAccount } = getState()
      if (universe.id === log.universe) {
        dispatch(addLogToTransactions(TYPES.FINALIZE_MARKET, log))
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
  }
}

export const handleUniverseForkedLog = (err, log) => (dispatch, getState) => {
  if (err) return console.error('UniverseForked:', err)
  if (log) {
    if (log.removed) {
      console.log('UniverseForked removed:', log)
      dispatch(removeLogFromTransactions(log))
    } else {
      console.log('UniverseForked:', log)
      dispatch(addLogToTransactions(TYPES.FORK_UNIVERSE, log))
    }
  }
}

export const handleCompleteSetsPurchasedLog = (err, log) => (dispatch, getState) => {
  if (err) return console.error('CompleteSetsPurchased:', err)
  if (log) {
    if (log.removed) {
      console.log('CompleteSetsPurchased removed:', log)
      dispatch(removeLogFromTransactions(log))
    } else {
      console.log('CompleteSetsPurchased:', log)
      dispatch(addLogToTransactions(TYPES.BUY_COMPLETE_SETS, log))
    }
  }
}

export const handleCompleteSetsSoldLog = (err, log) => (dispatch, getState) => {
  if (err) return console.error('CompleteSetsSold:', err)
  if (log) {
    if (log.removed) {
      console.log('CompleteSetsSold removed:', log)
      dispatch(removeLogFromTransactions(log))
    } else {
      console.log('CompleteSetsSold:', log)
      dispatch(addLogToTransactions(TYPES.SELL_COMPLETE_SETS, log))
    }
  }
}

export const handleTokensMintedLog = (err, log) => (dispatch, getState) => {
  if (err) return console.error('TokensMinted:', err)
  if (log) {
    if (log.removed) {
      console.log('TokensMinted removed:', log)
      dispatch(removeLogFromTransactions(log))
    } else {
      console.log('TokensMinted:', log)
      dispatch(addLogToTransactions(TYPES.MINT_TOKENS, log))
    }
  }
}

export const handleTokensBurnedLog = (err, log) => (dispatch, getState) => {
  if (err) return console.error('TokensBurned:', err)
  if (log) {
    if (log.removed) {
      console.log('TokensBurned removed:', log)
      dispatch(removeLogFromTransactions(log))
    } else {
      console.log('TokensBurned:', log)
      dispatch(addLogToTransactions(TYPES.BURN_TOKENS, log))
    }
  }
}

export const handleFeeWindowCreatedLog = (err, log) => (dispatch, getState) => {
  if (err) return console.error('FeeWindowCreated:', err)
  if (log) {
    if (log.removed) {
      console.log('FeeWindowCreated removed:', log)
      dispatch(removeLogFromTransactions(log))
    } else {
      console.log('FeeWindowCreated:', log)
      dispatch(addLogToTransactions(TYPES.CREATE_FEE_WINDOW, log))
    }
  }
}

export const handleInitialReporterTransferredLog = (err, log) => (dispatch, getState) => {
  if (err) return console.error('InitialReporterTransferred:', err)
  if (log) {
    if (log.removed) {
      console.log('InitialReporterTransferred removed:', log)
      dispatch(removeLogFromTransactions(log))
    } else {
      console.log('InitialReporterTransferred:', log)
      dispatch(addLogToTransactions(TYPES.TRANSFER_INITIAL_REPORTER, log))
    }
  }
}

export const handleTimestampSetLog = (err, log) => (dispatch, getState) => {
  if (err) return console.error('TimestampSet:', err)
  if (log) {
    if (log.removed) {
      console.log('TimestampSet removed:', log)
      dispatch(removeLogFromTransactions(log))
    } else {
      console.log('TimestampSet:', log)
      dispatch(addLogToTransactions(TYPES.SET_TIMESTAMP, log))
    }
  }
}

export const handleDisputeCrowdsourcerCreatedLog = (err, log) => (dispatch, getState) => {
  if (err) return console.error('DisputeCrowdsourcerCreated:', err)
  if (log) {
    if (log.removed) {
      console.log('DisputeCrowdsourcerCreated removed:', log)
      dispatch(removeLogFromTransactions(log))
    } else {
      console.log('DisputeCrowdsourcerCreated:', log)
      dispatch(addLogToTransactions(TYPES.CREATE_DISPUTE_CROWDSOURCER, log))
      const marketId = log.market
      dispatch(loadMarketsDisputeInfo([marketId]))
    }
  }
}

export const handleDisputeCrowdsourcerContributionLog = (err, log) => (dispatch, getState) => {
  if (err) return console.error('DisputeCrowdsourcerContribution:', err)
  if (log) {
    if (log.removed) {
      console.log('DisputeCrowdsourcerContribution removed:', log)
      dispatch(removeLogFromTransactions(log))
    } else {
      console.log('DisputeCrowdsourcerContribution:', log)
      dispatch(addLogToTransactions(TYPES.CONTRIBUTE_DISPUTE_CROWDSOURCER, log))
      const marketId = log.market
      dispatch(loadMarketsDisputeInfo([marketId]))
    }
  }
}

export const handleInitialReporterRedeemedLog = (err, log) => (dispatch, getState) => {
  if (err) return console.error('InitialReporterRedeemed:', err)
  if (log) {
    if (log.removed) {
      console.log('InitialReporterRedeemed removed:', log)
      dispatch(removeLogFromTransactions(log))
    } else {
      console.log('InitialReporterRedeemed:', log)
      dispatch(addLogToTransactions(TYPES.REDEEM_INITIAL_REPORTER, log))
    }
  }
}

export const handleDisputeCrowdsourcerRedeemedLog = (err, log) => (dispatch, getState) => {
  if (err) return console.error('DisputeCrowdsourcerRedeemed:', err)
  if (log) {
    if (log.removed) {
      console.log('DisputeCrowdsourcerRedeemed removed:', log)
      dispatch(removeLogFromTransactions(log))
    } else {
      console.log('DisputeCrowdsourcerRedeemed:', log)
      dispatch(addLogToTransactions(TYPES.REDEEM_DISPUTE_CROWDSOURCER, log))
      const marketId = log.market
      dispatch(loadMarketsDisputeInfo([marketId]))
    }
  }
}

export const handleFeeWindowRedeemedLog = (err, log) => (dispatch, getState) => {
  if (err) return console.error('FeeWindowRedeemed:', err)
  if (log) {
    if (log.removed) {
      console.log('FeeWindowRedeemed removed:', log)
      dispatch(removeLogFromTransactions(log))
    } else {
      console.log('FeeWindowRedeemed:', log)
      dispatch(addLogToTransactions(TYPES.REDEEM_FEE_WINDOW, log))
    }
  }
}

export const handleUniverseCreatedLog = (err, log) => (dispatch, getState) => {
  if (err) return console.error('UniverseCreated:', err)
  if (log) {
    if (log.removed) {
      console.log('UniverseCreated removed:', log)
      dispatch(removeLogFromTransactions(log))
    } else {
      console.log('UniverseCreated:', log)
      dispatch(addLogToTransactions(TYPES.CREATE_UNIVERSE, log))
    }
  }
}

export const handleNewBlockAdded = block => (dispatch) => {
  dispatch(syncBlockchain())
  dispatch(syncUniverse())
}

export const handleNewBlockRemoved = block => (dispatch) => {
  dispatch(syncBlockchain())
  dispatch(syncUniverse())
}

export function listenToUpdates(history) {
  return (dispatch, getState) => {
    augur.events.stopBlockListeners()
    augur.events.stopAugurNodeEventListeners()
    augur.events.stopBlockchainEventListeners()
    augur.events.startBlockListeners({
      onAdded: block => dispatch(handleNewBlockAdded(block)),
      onRemoved: block => dispatch(handleNewBlockRemoved(block)),
    })
    augur.events.startAugurNodeEventListeners({
      MarketState: (err, log) => dispatch(handleMarketStateLog(err, log)),
      MarketCreated: (err, log) => dispatch(handleMarketCreatedLog(err, log)),
      TokensTransferred: (err, log) => dispatch(handleTokensTransferredLog(err, log)),
      OrderCanceled: (err, log) => dispatch(handleOrderCanceledLog(err, log)),
      OrderCreated: (err, log) => dispatch(handleOrderCreatedLog(err, log)),
      OrderFilled: (err, log) => dispatch(handleOrderFilledLog(err, log)),
      TradingProceedsClaimed: (err, log) => dispatch(handleTradingProceedsClaimedLog(err, log)),
      InitialReportSubmitted: (err, log) => dispatch(handleInitialReportSubmittedLog(err, log)),
      DesignatedReportSubmitted: (err, log) => dispatch(handleDesignedReportSubmittedLog(err, log)),
      ReportSubmitted: (err, log) => dispatch(handleReportSubmittedLog(err, log)),
      ReportsDisputed: (err, log) => dispatch(handleReportsDisputedLog(err, log)),
      MarketFinalized: (err, log) => dispatch(handleMarketFinalizedLog(err, log)),
      UniverseForked: (err, log) => dispatch(handleUniverseForkedLog(err, log)),
      CompleteSetsPurchased: (err, log) => dispatch(handleCompleteSetsPurchasedLog(err, log)),
      CompleteSetsSold: (err, log) => dispatch(handleCompleteSetsSoldLog(err, log)),
      TokensMinted: (err, log) => dispatch(handleTokensMintedLog(err, log)),
      TokensBurned: (err, log) => dispatch(handleTokensBurnedLog(err, log)),
      FeeWindowCreated: (err, log) => dispatch(handleFeeWindowCreatedLog(err, log)),
      InitialReporterTransferred: (err, log) => dispatch(handleInitialReporterTransferredLog(err, log)),
      TimestampSet: (err, log) => dispatch(handleTimestampSetLog(err, log)),
      DisputeCrowdsourcerCreated: (err, log) => dispatch(handleDisputeCrowdsourcerCreatedLog(err, log)),
      DisputeCrowdsourcerContribution: (err, log) => dispatch(handleDisputeCrowdsourcerContributionLog(err, log)),
      InitialReporterRedeemed: (err, log) => dispatch(handleInitialReporterRedeemedLog(err, log)),
      DisputeCrowdsourcerRedeemed: (err, log) => dispatch(handleDisputeCrowdsourcerRedeemedLog(err, log)),
      FeeWindowRedeemed: (err, log) => dispatch(handleFeeWindowRedeemedLog(err, log)),
      UniverseCreated: (err, log) => dispatch(handleUniverseCreatedLog(err, log)),
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
