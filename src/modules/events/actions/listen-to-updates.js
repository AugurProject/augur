import { augur } from 'services/augurjs'
import { handleAugurNodeDisconnect, handleEthereumDisconnect } from 'modules/events/actions/disconnect-handlers'
import { handleNewBlock } from 'modules/events/actions/handle-new-block'
import {
  handleMarketStateLog,
  handleMarketCreatedLog,
  handleTokensTransferredLog,
  handleOrderCreatedLog,
  handleOrderCanceledLog,
  handleOrderFilledLog,
  handleTradingProceedsClaimedLog,
  handleInitialReportSubmittedLog,
  handleDesignatedReportSubmittedLog,
  handleReportSubmittedLog,
  handleReportsDisputedLog,
  handleMarketFinalizedLog,
  handleDisputeCrowdsourcerCreated,
  handleDisputeCrowdsourcerContribution,
  handleDisputeCrowdsourcerCompleted,
  handleDisputeCrowdsourcerRedeemed,
} from 'modules/events/actions/log-handlers'
import { wrapLogHandler } from 'modules/events/actions/wrap-log-handler'
import logError from 'utils/log-error'

export const listenToUpdates = history => (dispatch, getState) => {
  augur.events.stopBlockListeners()
  augur.events.stopAugurNodeEventListeners()
  augur.events.stopBlockchainEventListeners()
  augur.events.startBlockListeners({
    onAdded: block => dispatch(handleNewBlock(block)),
    onRemoved: block => dispatch(handleNewBlock(block)),
  })
  augur.events.startAugurNodeEventListeners({
    MarketState: dispatch(wrapLogHandler(handleMarketStateLog)),
    MarketCreated: dispatch(wrapLogHandler(handleMarketCreatedLog)),
    TokensTransferred: dispatch(wrapLogHandler(handleTokensTransferredLog)),
    OrderCreated: dispatch(wrapLogHandler(handleOrderCreatedLog)),
    OrderCanceled: dispatch(wrapLogHandler(handleOrderCanceledLog)),
    OrderFilled: dispatch(wrapLogHandler(handleOrderFilledLog)),
    TradingProceedsClaimed: dispatch(wrapLogHandler(handleTradingProceedsClaimedLog)),
    InitialReportSubmitted: dispatch(wrapLogHandler(handleInitialReportSubmittedLog)),
    DesignatedReportSubmitted: dispatch(wrapLogHandler(handleDesignatedReportSubmittedLog)),
    ReportSubmitted: dispatch(wrapLogHandler(handleReportSubmittedLog)),
    ReportsDisputed: dispatch(wrapLogHandler(handleReportsDisputedLog)),
    MarketFinalized: dispatch(wrapLogHandler(handleMarketFinalizedLog)),
    DisputeCrowdsourcerCreated: dispatch(wrapLogHandler(handleDisputeCrowdsourcerCreated)),
    DisputeCrowdsourcerContribution: dispatch(wrapLogHandler(handleDisputeCrowdsourcerContribution)),
    DisputeCrowdsourcerCompleted: dispatch(wrapLogHandler(handleDisputeCrowdsourcerCompleted)),
    DisputeCrowdsourcerRedeemed: dispatch(wrapLogHandler(handleDisputeCrowdsourcerRedeemed)),
    UniverseForked: dispatch(wrapLogHandler()),
    CompleteSetsPurchased: dispatch(wrapLogHandler()),
    CompleteSetsSold: dispatch(wrapLogHandler()),
    TokensMinted: dispatch(wrapLogHandler()),
    TokensBurned: dispatch(wrapLogHandler()),
    FeeWindowCreated: dispatch(wrapLogHandler()),
    InitialReporterTransferred: dispatch(wrapLogHandler()),
    TimestampSet: dispatch(wrapLogHandler()),
    InitialReporterRedeemed: dispatch(wrapLogHandler()),
    FeeWindowRedeemed: dispatch(wrapLogHandler()),
    UniverseCreated: dispatch(wrapLogHandler()),
  }, logError)
  augur.events.nodes.augur.on('disconnect', event => dispatch(handleAugurNodeDisconnect(history, event)))
  augur.events.nodes.ethereum.on('disconnect', event => dispatch(handleEthereumDisconnect(history, event)))
}
