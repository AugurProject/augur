import { augur } from 'services/augurjs'
import { handleAugurNodeDisconnect, handleEthereumDisconnect } from 'modules/events/actions/disconnect-handlers'
import { handleNewBlock } from 'modules/events/actions/handle-new-block'
import {
  handleMarketStateLog,
  handleMarketCreatedLog,
  handleMarketMigratedLog,
  handleTokensTransferredLog,
  handleOrderCreatedLog,
  handleOrderCanceledLog,
  handleOrderFilledLog,
  handleTradingProceedsClaimedLog,
  handleInitialReportSubmittedLog,
  handleInitialReporterRedeemedLog,
  handleMarketFinalizedLog,
  handleDisputeCrowdsourcerCreatedLog,
  handleDisputeCrowdsourcerContributionLog,
  handleDisputeCrowdsourcerCompletedLog,
  handleDisputeCrowdsourcerRedeemedLog,
  handleFeeWindowCreatedLog,
  handleFeeWindowOpenedLog,
  handleTokensMintedLog,
  handleTokensBurnedLog,
  handleFeeWindowRedeemedLog,
} from 'modules/events/actions/log-handlers'
import { wrapLogHandler } from 'modules/events/actions/wrap-log-handler'
import logError from 'utils/log-error'

export const listenToUpdates = history => (dispatch, getState) => {
  augur.events.stopBlockListeners()
  augur.events.stopAugurNodeEventListeners()
  augur.events.startBlockListeners({
    onAdded: block => dispatch(handleNewBlock(block)),
    onRemoved: block => dispatch(handleNewBlock(block)),
  })
  augur.events.startAugurNodeEventListeners({
    MarketState: dispatch(wrapLogHandler(handleMarketStateLog)),
    MarketCreated: dispatch(wrapLogHandler(handleMarketCreatedLog)),
    MarketMigrated: dispatch(wrapLogHandler(handleMarketMigratedLog)),
    TokensTransferred: dispatch(wrapLogHandler(handleTokensTransferredLog)),
    OrderCreated: dispatch(wrapLogHandler(handleOrderCreatedLog)),
    OrderCanceled: dispatch(wrapLogHandler(handleOrderCanceledLog)),
    OrderFilled: dispatch(wrapLogHandler(handleOrderFilledLog)),
    TradingProceedsClaimed: dispatch(wrapLogHandler(handleTradingProceedsClaimedLog)),
    InitialReportSubmitted: dispatch(wrapLogHandler(handleInitialReportSubmittedLog)),
    InitialReporterRedeemed: dispatch(wrapLogHandler(handleInitialReporterRedeemedLog)),
    MarketFinalized: dispatch(wrapLogHandler(handleMarketFinalizedLog)),
    DisputeCrowdsourcerCreated: dispatch(wrapLogHandler(handleDisputeCrowdsourcerCreatedLog)),
    DisputeCrowdsourcerContribution: dispatch(wrapLogHandler(handleDisputeCrowdsourcerContributionLog)),
    DisputeCrowdsourcerCompleted: dispatch(wrapLogHandler(handleDisputeCrowdsourcerCompletedLog)),
    DisputeCrowdsourcerRedeemed: dispatch(wrapLogHandler(handleDisputeCrowdsourcerRedeemedLog)),
    UniverseForked: dispatch(wrapLogHandler()),
    CompleteSetsPurchased: dispatch(wrapLogHandler()),
    CompleteSetsSold: dispatch(wrapLogHandler()),
    TokensMinted: dispatch(wrapLogHandler(handleTokensMintedLog)),
    TokensBurned: dispatch(wrapLogHandler(handleTokensBurnedLog)),
    FeeWindowCreated: dispatch(wrapLogHandler(handleFeeWindowCreatedLog)),
    FeeWindowOpened: dispatch(wrapLogHandler(handleFeeWindowOpenedLog)),
    InitialReporterTransferred: dispatch(wrapLogHandler()),
    TimestampSet: dispatch(wrapLogHandler()),
    FeeWindowRedeemed: dispatch(wrapLogHandler(handleFeeWindowRedeemedLog)),
    UniverseCreated: dispatch(wrapLogHandler()),
  }, logError)
  augur.events.nodes.augur.on('disconnect', event => dispatch(handleAugurNodeDisconnect(history, event)))
  augur.events.nodes.ethereum.on('disconnect', event => dispatch(handleEthereumDisconnect(history, event)))
}
