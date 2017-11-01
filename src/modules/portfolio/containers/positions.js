import { connect } from 'react-redux'
// import memoize from 'memoizee'

import Positions from 'modules/portfolio/components/positions/positions'

// import getLoginAccountPositions from 'modules/my-positions/selectors/login-account-positions'
// import getOpenOrders from 'modules/user-open-orders/selectors/open-orders'
// import getClosePositionStatus from 'modules/my-positions/selectors/close-position-status'
import getScalarShareDenomination from 'modules/market/selectors/scalar-share-denomination'
import getOrderCancellation from 'modules/bids-asks/selectors/order-cancellation'
import { loadAccountHistory } from 'modules/auth/actions/load-account-history'
import { triggerTransactionsExport } from 'modules/transactions/actions/trigger-transactions-export'

const mapStateToProps = (state) => {
  // const positions = getLoginAccountPositions()
  // const openOrders = getOpenOrders()
  // console.log('pos, oord:', positions, openOrders)
  // console.log('posMarkets', getPositionsMarkets(positions, openOrders))
  // console.log('closPosStat', getClosePositionStatus())
  // console.log('scalarShareDenomination', getScalarShareDenomination())
  // console.log('orderCancellation:', getOrderCancellation())
  // console.log('state:', state)
  const date = new Date()
  const dummyMarketData = [{
    id: '1',
    description: 'my test market',
    endDateLabel: 'endDateLabel',
    endDate: { date, formatted: date.toString() },
    outcomes: [
      [],
      {
        name: 'outcome1',
        userOpenOrders: [{
          qtyShares: { formatted: '10' },
          unmatchedShares: { formatted: '10' },
          purchasePrice: { formatted: '0.5' },
          avgPrice: { formatted: '0.5' }
        }],
        position: { closePosition: () => console.log('closeposition1') }
      },
      {
        name: 'outcome2',
        userOpenOrders: [{
          unmatchedShares: { formatted: '5' },
          purchasePrice: { formatted: '0.75' },
          avgPrice: { formatted: '0.7' }
        }],
        position: { closePosition: () => console.log('closeposition2') }
      }
    ],
    myPositionsSummary: {
      realizedNet: { formatted: '1.0' },
      unrealizedNet: { formatted: '2.0' },
      totalNet: { formatted: '3.0' }
    },
    myPositionOutcomes: [
      {
        name: 'outcome1',
        position: {
          qtyShares: { formatted: '10' },
          purchasePrice: { formatted: '0.5' },
          lastPrice: { formatted: '0.45' },
          realizedNet: { formatted: '0' },
          unrealizedNet: { formatted: '1' },
          totalNet: { formatted: '1' },
          closePosition: { closePosition: () => console.log('closeposition3') }
        }
      },
      {
        name: 'outcome2',
        position: {
          qtyShares: { formatted: '5' },
          purchasePrice: { formatted: '0.75' },
          lastPrice: { formatted: '0.8' },
          realizedNet: { formatted: '0' },
          unrealizedNet: { formatted: '0.05' },
          totalNet: { formatted: '.05' },
          closePosition: { closePosition: () => console.log('closeposition4') }
        }
      }
    ]
  }]

  return {
    markets: dummyMarketData, // getPositionsMarkets(positions, openOrders)
    isTradeCommitLocked: false, // state.tradeCommitLock.isLocked
    closePositionStatus: {}, // getClosePositionStatus()
    scalarShareDenomination: getScalarShareDenomination(),
    orderCancellation: getOrderCancellation(),
    transactionsLoading: state.transactionsLoading,
    hasAllTransactionsLoaded: state.transactionsOldestLoadedBlock === state.loginAccount.registerBlockNumber,
    registerBlockNumber: state.loginAccount.registerBlockNumber
  }
}

const mapDispatchToProps = dispatch => ({
  loadMoreTransactions: () => dispatch(loadAccountHistory()),
  loadAllTransactions: () => dispatch(loadAccountHistory(true)),
  triggerTransactionsExport: () => dispatch(triggerTransactionsExport()),
})

// const getPositionsMarkets = memoize((positions, openOrders) => Array.from(new Set([...positions.markets, ...openOrders])), { max: 1 })

const PositionsContainer = connect(mapStateToProps, mapDispatchToProps)(Positions)

export default PositionsContainer
