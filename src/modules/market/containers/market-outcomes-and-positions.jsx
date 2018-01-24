import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import MarketOutcomesAndPositions from 'modules/market/components/market-outcomes-and-positions/market-outcomes-and-positions'
import getScalarShareDenomination from 'modules/market/selectors/scalar-share-denomination'
import { selectMarket } from 'modules/market/selectors/market'
import getValue from 'utils/get-value'

const mapStateToProps = state => ({
  marketID: '0x7d9f26082539a7f9793b8c3b25f2a20374ab357d73ff6d6dc99cab6145b567a0',
  scalarShareDenomination: getScalarShareDenomination(),
  positions,
  openOrders,
  isMobile: state.isMobile,
})

const mergeProps = (sP, dP, oP) => {
  const market = selectMarket(oP.marketId)

  console.log('market -- ', market)

  return {
    ...sP,
    ...oP,
    outcomes: market.outcomes
    // TODO -- need to rethink best shape for `userOpenOrders`
    // openOrder: getValue(market, 'outcomes')
  }
}

const MarketOutcomesAndPositionsContainer = withRouter(connect(mapStateToProps, null, mergeProps)(MarketOutcomesAndPositions))

export default MarketOutcomesAndPositionsContainer

const openOrders = [
  {
    name: '1. HARTNELL (12)',
    id: '1',
    pending: false,
    order: {
      qtyShares: {
        formatted: '10.942',
        formattedValue: 10.942,
      },
      purchasePrice: {
        formatted: '0.3938',
        formattedValue: 0.3938,
      },
      cancelOrder: () => console.log('cancel order'),
    },
  },
  {
    name: '1. HARTNELL (12)',
    id: '1',
    pending: true,
    order: {
      qtyShares: {
        formatted: '4.942',
        formattedValue: 4.942,
      },
      purchasePrice: {
        formatted: '0.6',
        formattedValue: 0.6,
      },
      cancelOrder: () => console.log('cancel order'),
    },
  },
  {
    name: '1. HARTNELL (12)',
    id: '1',
    pending: false,
    order: {
      qtyShares: {
        formatted: '7',
        formattedValue: 7,
      },
      purchasePrice: {
        formatted: '0.38',
        formattedValue: 0.38,
      },
      cancelOrder: () => console.log('cancel order'),
    },
  },
  {
    name: '1. HARTNELL (12)',
    id: '1',
    pending: false,
    order: {
      qtyShares: {
        formatted: '15.203',
        formattedValue: 15.203,
      },
      purchasePrice: {
        formatted: '0.3507',
        formattedValue: 0.3507,
      },
      cancelOrder: () => console.log('cancel order'),
    },
  },
  {
    name: '1. HARTNELL (12)',
    id: '1',
    pending: false,
    order: {
      qtyShares: {
        formatted: '2.942',
        formattedValue: 2.942,
      },
      purchasePrice: {
        formatted: '0.35',
        formattedValue: 0.35,
      },
      cancelOrder: () => console.log('cancel order'),
    },
  },
  {
    name: '2. ALMANDIN (14)',
    id: '2',
    pending: false,
    order: {
      qtyShares: {
        formatted: '9.5',
        formattedValue: 9.5,
      },
      purchasePrice: {
        formatted: '0.8',
        formattedValue: 0.8,
      },
      cancelOrder: () => console.log('cancel order'),
    },
  },
]

const positions = [
  {
    name: '1. HARTNELL (12)',
    id: '1',
    position: {
      qtyShares: {
        formatted: '10',
        formattedValue: 10,
      },
      avgPrice: {
        formatted: '0.5',
        formattedValue: 0.5,
      },
      realizedNet: { formatted: '+0' },
      unrealizedNet: { formatted: '-1.2' },
      closePosition: () => console.log('close position'),
    },
  },
  {
    id: '2',
    name: '2. ALMANDIN (14)',
    position: {
      qtyShares: {
        formatted: '5',
        formattedValue: 5,
      },
      avgPrice: {
        formatted: '0.75',
        formattedValue: 0.75,
      },
      realizedNet: { formatted: '+0' },
      unrealizedNet: { formatted: '+0.05' },
      closePosition: () => console.log('close position'),
    },
  },
]
