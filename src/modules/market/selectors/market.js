/*
This is one of the most important and sensitive selectors in the app.
It builds the fat, heavy, rigid, hierarchical market objects,
that are used to render and display many parts of the ui.
This is the point where the shallow, light, loose, flexible, independent
pieces of state come together to make each market.

IMPORTANT
The assembleMarket() function (where all the action happens) is heavily memoized, and performance sensitive.
Doing things sub-optimally here will cause noticeable performance degradation in the app.
The "trick" is to maximize memoization cache hits as much as possible, and not have assembleMarket()
run any more than it has to.

To achieve that, we pass in the minimum number of the shallowest arguments possible.
For example, instead of passing in the entire `favorites` collection and letting the
function find the one it needs for the market, we instead find the specific favorite
for that market in advance, and only pass in a boolean: `!!favorites[marketId]`
That way the market only gets re-assembled when that specific favorite changes.

This is true for all selectors, but especially important for this one.
*/

import { createBigNumber } from 'utils/create-big-number'
import memoize from 'memoizee'
import { formatShares, formatEther, formatPercent, formatNumber } from 'utils/format-number'
import { convertUnixToFormattedDate } from 'utils/format-date'
import { selectCurrentTimestamp, selectCurrentTimestampInSeconds } from 'src/select-state'
import { isMarketDataOpen, isMarketDataExpired } from 'utils/is-market-data-open'
import { ZERO } from 'modules/trade/constants/numbers'
import { UNIVERSE_ID } from 'modules/app/constants/network'
import { YES_NO, CATEGORICAL, SCALAR } from 'modules/markets/constants/market-types'
import { YES_NO_INDETERMINATE_OUTCOME_ID, CATEGORICAL_SCALAR_INDETERMINATE_OUTCOME_ID, INDETERMINATE_OUTCOME_NAME } from 'modules/markets/constants/market-outcomes'

import { placeTrade } from 'modules/trade/actions/place-trade'
import { submitReport } from 'modules/reports/actions/submit-report'

import store from 'src/store'

import selectAccountPositions from 'modules/user-open-orders/selectors/positions-plus-asks'
import { selectUserOpenOrders } from 'modules/user-open-orders/selectors/user-open-orders'
import selectUserOpenOrdersSummary from 'modules/user-open-orders/selectors/user-open-orders-summary'

import { selectPriceTimeSeries } from 'modules/market/selectors/price-time-series'

import { selectAggregateOrderBook, selectTopBid, selectTopAsk } from 'modules/bids-asks/helpers/select-order-book'
import getOrderBookSeries from 'modules/order-book/selectors/order-book-series'

import { generateTrade, generateTradeSummary } from 'modules/trade/helpers/generate-trade'
import hasUserEnoughFunds from 'modules/trade/helpers/has-user-enough-funds'
import { generateOutcomePositionSummary, generateMarketsPositionsSummary } from 'modules/my-positions/selectors/my-positions-summary'

import { selectReportableOutcomes } from 'modules/reports/selectors/reportable-outcomes'

import { listWordsUnderLength } from 'utils/list-words-under-length'
import calculatePayoutNumeratorsValue from 'utils/calculate-payout-numerators-value'

export default function () {
  return selectSelectedMarket(store.getState())
}

export const selectSelectedMarket = state => selectMarket(state.selectedMarketId)

export const selectMarket = (marketId) => {
  const {
    marketsData,
    marketLoading,
    favorites,
    reports,
    outcomesData,
    accountTrades,
    tradesInProgress,
    priceHistory,
    orderBooks,
    universe,
    orderCancellation,
    smallestPositions,
    loginAccount,
    ...state
  } = store.getState()

  const accountPositions = selectAccountPositions()

  if (!marketId || !marketsData || !marketsData[marketId]) {
    return {}
  }
  const endTime = convertUnixToFormattedDate(marketsData[marketId].endTime)

  return assembleMarket(
    marketId,
    marketsData[marketId],
    marketLoading[marketId] || null,
    priceHistory[marketId],
    isMarketDataOpen(marketsData[marketId]),
    isMarketDataExpired(marketsData[marketId], selectCurrentTimestampInSeconds(state)),

    !!favorites[marketId],
    outcomesData[marketId],

    selectMarketReport(marketId, reports[universe.id || UNIVERSE_ID]),
    (accountPositions || {})[marketId],
    (accountTrades || {})[marketId],
    tradesInProgress[marketId],

    // the reason we pass in the date parts broken up like this, is because date objects are never equal, thereby always triggering re-assembly, and never hitting the memoization cache
    endTime.value.getFullYear(),
    endTime.value.getMonth(),
    endTime.value.getDate(),

    universe && universe.currentReportingWindowAddress,

    orderBooks[marketId],
    orderCancellation,
    (smallestPositions || {})[marketId],
    loginAccount,
    store.dispatch,
  )
}

const assembledMarketsCache = {}

export function assembleMarket(
  marketId,
  marketData,
  marketLoading,
  marketPriceHistory,
  isOpen,
  isExpired,
  isFavorite,
  marketOutcomesData,
  marketReport,
  marketAccountPositions,
  marketAccountTrades,
  marketTradeInProgress,
  endTimeYear,
  endTimeMonth,
  endTimeDay,
  currentReportingWindowAddress,
  orderBooks,
  orderCancellation,
  smallestPosition,
  loginAccount,
  dispatch,
) {

  if (!assembledMarketsCache[marketId]) {
    assembledMarketsCache[marketId] = memoize((
      marketId,
      marketData,
      marketLoading,
      marketPriceHistory,
      isOpen,
      isExpired,
      isFavorite,
      marketOutcomesData,
      marketReport,
      marketAccountPositions,
      marketAccountTrades,
      marketTradeInProgress,
      endTimeYear,
      endTimeMonth,
      endTimeDay,
      currentReportingWindowAddress,
      orderBooks,
      orderCancellation,
      smallestPosition,
      loginAccount,
      dispatch,
    ) => {

      const market = {
        ...marketData,
        description: marketData.description || '',
        formattedDescription: listWordsUnderLength(marketData.description || '', 100).map(word => encodeURIComponent(word.toLowerCase())).join('_'),
        id: marketId,
      }

      if (typeof market.minPrice !== 'undefined') market.minPrice = createBigNumber(market.minPrice)
      if (typeof market.maxPrice !== 'undefined') market.maxPrice = createBigNumber(market.maxPrice)

      const now = new Date(selectCurrentTimestamp(store.getState()))

      switch (market.marketType) {
        case YES_NO:
          market.isYesNo = true
          market.isCategorical = false
          market.isScalar = false
          break
        case CATEGORICAL:
          market.isYesNo = false
          market.isCategorical = true
          market.isScalar = false
          break
        case SCALAR:
          market.isYesNo = false
          market.isCategorical = false
          market.isScalar = true
          break
        default:
          break
      }

      market.loadingState = marketLoading !== null ? marketLoading.state : marketLoading

      market.endTime = convertUnixToFormattedDate(marketData.endTime)
      market.endTimeLabel = (market.endTime < now) ? 'expired' : 'expires'
      market.creationTime = convertUnixToFormattedDate(marketData.creationTime)

      market.isOpen = isOpen
      // market.isExpired = isExpired;
      market.isFavorite = isFavorite

      market.reportingFeeRatePercent = formatPercent(marketData.reportingFeeRate * 100, { positiveSign: false })
      market.marketCreatorFeeRatePercent = formatPercent(marketData.marketCreatorFeeRate * 100, { positiveSign: false })
      market.settlementFeePercent = formatPercent(marketData.settlementFee * 100, { positiveSign: false })
      market.volume = formatShares(marketData.volume, { positiveSign: false })

      market.isRequiredToReportByAccount = !!marketReport
      market.isPendingReport = market.isRequiredToReportByAccount && !marketReport.reportedOutcomeId // account is required to report on this market
      market.isReported = market.isRequiredToReportByAccount && !!marketReport.reportedOutcomeId // the user has reported on this market
      market.isReportTabVisible = market.isRequiredToReportByAccount

      market.onSubmitPlaceTrade = (outcomeId, callback, onComplete, doNotCreateOrders = false) => dispatch(placeTrade(marketId, outcomeId, marketTradeInProgress[outcomeId], doNotCreateOrders, callback, onComplete))

      market.report = {
        ...marketReport,
        onSubmitReport: (reportedOutcomeId, amountToStake, isIndeterminate, history) => dispatch(submitReport(market, reportedOutcomeId, amountToStake, isIndeterminate, history)),
      }

      market.outcomes = []

      let marketTradeOrders = []

      market.outcomes = Object.keys(marketOutcomesData || {}).map((outcomeId) => {
        const outcomeData = marketOutcomesData[outcomeId]
        const outcomeTradeInProgress = marketTradeInProgress && marketTradeInProgress[outcomeId]

        const outcome = {
          ...outcomeData,
          id: outcomeId,
          marketId,
          lastPrice: formatEther(outcomeData.price || 0, { positiveSign: false }),
        }

        if (market.isScalar) {
          // note: not actually a percent
          if (createBigNumber(outcome.volume).gt(ZERO)) {
            outcome.lastPricePercent = formatNumber(outcome.lastPrice.value, {
              decimals: 2,
              decimalsRounded: 1,
              denomination: '',
              positiveSign: false,
              zeroStyled: true,
            })
            // format-number thinks 0 is '-', need to correct
            if (outcome.lastPrice.fullPrecision === '0') {
              outcome.lastPricePercent.formatted = '0'
              outcome.lastPricePercent.full = '0'
            }
          } else {
            const midPoint = (createBigNumber(market.minPrice, 10).plus(createBigNumber(market.maxPrice, 10))).dividedBy(2)
            outcome.lastPricePercent = formatNumber(midPoint, {
              decimals: 2,
              decimalsRounded: 1,
              denomination: '',
              positiveSign: false,
              zeroStyled: true,
            })
          }
        } else if (createBigNumber(outcome.volume || 0).gt(ZERO)) {
          outcome.lastPricePercent = formatPercent(outcome.lastPrice.value * 100, { positiveSign: false })
        } else {
          outcome.lastPricePercent = formatPercent(100 / market.numOutcomes, { positiveSign: false })
        }

        outcome.trade = generateTrade(market, outcome, outcomeTradeInProgress, orderBooks || {})

        const orderBook = selectAggregateOrderBook(outcome.id, orderBooks, orderCancellation)
        outcome.orderBook = orderBook
        outcome.orderBookSeries = getOrderBookSeries(orderBook)
        outcome.topBid = selectTopBid(orderBook, false)
        outcome.topAsk = selectTopAsk(orderBook, false)
        outcome.position = generateOutcomePositionSummary((marketAccountPositions || {})[outcomeId])
        if (outcome.position) outcome.position.name = outcome.name

        marketTradeOrders = marketTradeOrders.concat(outcome.trade.tradeSummary.tradeOrders)

        outcome.userOpenOrders = selectUserOpenOrders(marketId, outcomeId, orderBooks, orderCancellation)
        if (outcome.userOpenOrders) outcome.userOpenOrders.forEach((item) => { item.name = outcome.name })

        outcome.priceTimeSeries = selectPriceTimeSeries(outcome, marketPriceHistory)

        return outcome
      }).sort((a, b) => (b.lastPrice.value - a.lastPrice.value) || (a.name < b.name ? -1 : 1))

      market.tags = (market.tags || []).filter(tag => !!tag)

      market.unclaimedCreatorFees = formatEther(marketData.unclaimedCreatorFees)

      market.marketCreatorFeesCollected = formatEther(marketData.marketCreatorFeesCollected || 0)

      market.reportableOutcomes = selectReportableOutcomes(market.marketType, market.outcomes)
      const indeterminateOutcomeId = market.type === YES_NO ? YES_NO_INDETERMINATE_OUTCOME_ID : CATEGORICAL_SCALAR_INDETERMINATE_OUTCOME_ID
      market.reportableOutcomes.push({ id: indeterminateOutcomeId, name: INDETERMINATE_OUTCOME_NAME })

      market.userOpenOrdersSummary = selectUserOpenOrdersSummary(market.outcomes)

      market.tradeSummary = generateTradeSummary(marketTradeOrders)
      market.tradeSummary.hasUserEnoughFunds = hasUserEnoughFunds(market.outcomes.map(outcome => outcome.trade), loginAccount)

      if (marketAccountTrades) {
        market.myPositionsSummary = generateMarketsPositionsSummary([market])
        if (market.myPositionsSummary) {
          market.myPositionOutcomes = market.myPositionsSummary.positionOutcomes
          delete market.myPositionsSummary.positionOutcomes
        }
      }

      // Update the consensus object:
      //   - formatted reported outcome
      //   - the percentage of correct reports (for binaries only)
      if (marketData.consensus) {
        market.consensus = { ...marketData.consensus }
        if (market.reportableOutcomes.length) {
          const { payout, isInvalid } = market.consensus
          const winningOutcome = calculatePayoutNumeratorsValue(market, payout, isInvalid)
          // for scalars, we will just use the winningOutcome for display
          market.consensus.winningOutcome = winningOutcome
          const marketOutcome = market.reportableOutcomes.find(outcome => outcome.id === winningOutcome)
          if (marketOutcome) market.consensus.outcomeName = marketOutcome.name
        }
        if (market.consensus.proportionCorrect) {
          market.consensus.percentCorrect = formatPercent(createBigNumber(market.consensus.proportionCorrect, 10).times(100))
        }
      } else {
        market.consensus = null
      }

      return market
    }, { max: 1 })
  }

  return assembledMarketsCache[marketId].apply(this, arguments) // eslint-disable-line prefer-rest-params
}

export const selectMarketReport = (marketId, universeReports) => {
  if (marketId && universeReports) {
    const universeReportsMarketIds = Object.keys(universeReports)
    const numUniverseReports = universeReportsMarketIds.length
    for (let i = 0; i < numUniverseReports; ++i) {
      if (universeReports[universeReportsMarketIds[i]].marketId === marketId) {
        return universeReports[universeReportsMarketIds[i]]
      }
    }
  }
}

export const selectScalarMinimum = (market) => {
  const scalarMinimum = {}
  if (market && market.type === SCALAR) scalarMinimum.minPrice = market.minPrice
  return scalarMinimum
}
