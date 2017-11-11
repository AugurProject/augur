import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import MarketData from 'modules/market/components/market-data/market-data'

import getScalarShareDenomination from 'modules/market/selectors/scalar-share-denomination'
// import { selectMarket } from 'modules/market/selectors/market'

// import parseQuery from 'modules/routes/helpers/parse-query'

const mapStateToProps = state => ({
  marketID: '0x7d9f26082539a7f9793b8c3b25f2a20374ab357d73ff6d6dc99cab6145b567a0',
  scalarShareDenomination: getScalarShareDenomination(),
  outcomes,
  positions,
  openOrders,
  isMobile: state.isMobile,
})

const MarketTradingContainer = withRouter(connect(mapStateToProps)(MarketData))

export default MarketTradingContainer

const openOrders = [
  {
    name: '1. HARTNELL (12)',
    id: '1',
    pending: false,
    order: {
      qtyShares: { formatted: '10.942' },
      purchasePrice: { formatted: '0.3938' },
      cancelOrder: () => console.log('cancel order'),
    },
  },
  {
    name: '1. HARTNELL (12)',
    id: '1',
    pending: true,
    order: {
      qtyShares: { formatted: '4.942' },
      purchasePrice: { formatted: '0.35' },
      cancelOrder: () => console.log('cancel order'),
    },
  },
  {
    name: '2. ALMANDIN (14)',
    id: '2',
    pending: true,
    order: {
      qtyShares: { formatted: '5' },
      purchasePrice: { formatted: '0.75' },
      cancelOrder: () => console.log('cancel order'),
    },
  },
]

const positions = [
  {
    name: '1. HARTNELL (12)',
    id: '1',
    position: {
      qtyShares: { formatted: '10' },
      purchasePrice: { formatted: '0.5' },
      realizedNet: { formatted: '0' },
      unrealizedNet: { formatted: '1' },
      closePosition: () => console.log('close position'),
    },
  },
  {
    id: '2',
    name: '2. ALMANDIN (14)',
    position: {
      qtyShares: { formatted: '5' },
      purchasePrice: { formatted: '0.75' },
      realizedNet: { formatted: '0' },
      unrealizedNet: { formatted: '0.05' },
      closePosition: () => console.log('close position'),
    },
  },
]

const outcomes = [
  {
    name: '1. HARTNELL (12)',
    id: '1',
    marketID: '0x7d9f26082539a7f9793b8c3b25f2a20374ab357d73ff6d6dc99cab6145b567a0',
    lastPrice: {
      formatted: '0',
    },
    lastPricePercent: {
      full: '12.5%'
    },
    topBid: {
      shares: {
        formatted: '100',
      },
      price: {
        formatted: '0.2000',
      }
    },
    topAsk: {
      shares: {
        formatted: '100',
      },
      price: {
        formatted: '0.3000',
      }
    },
  },
  {
    name: '2. ALMANDIN (14)',
    id: '2',
    marketID: '0x7d9f26082539a7f9793b8c3b25f2a20374ab357d73ff6d6dc99cab6145b567a0',
    lastPrice: {
      formatted: '0',
    },
    lastPricePercent: {
      full: '12.5%'
    },
    topBid: {
      shares: {
        formatted: '100',
      },
      price: {
        formatted: '0.2000',
      }
    },
    topAsk: {
      shares: {
        formatted: '100',
      },
      price: {
        formatted: '0.3000',
      }
    },
  },
  {
    name: '3. HUMIDOR (13)',
    id: '3',
    marketID: '0x7d9f26082539a7f9793b8c3b25f2a20374ab357d73ff6d6dc99cab6145b567a0',
    lastPrice: {
      formatted: '0',
    },
    lastPricePercent: {
      full: '12.5%'
    },
    topBid: {
      shares: {
        formatted: '100',
      },
      price: {
        formatted: '0.2000',
      }
    },
    topAsk: {
      shares: {
        formatted: '100',
      },
      price: {
        formatted: '0.3000',
      }
    },
    positions: [],
    openOrders: [],
  },
  {
    name: '4. TIBERIAN (23)',
    id: '4',
    marketID: '0x7d9f26082539a7f9793b8c3b25f2a20374ab357d73ff6d6dc99cab6145b567a0',
    lastPrice: {
      formatted: '0',
    },
    lastPricePercent: {
      full: '12.5%'
    },
    topBid: {
      shares: {
        formatted: '100',
      },
      price: {
        formatted: '0.2000',
      }
    },
    topAsk: {
      shares: {
        formatted: '100',
      },
      price: {
        formatted: '0.3000',
      }
    },
    positions: [],
    openOrders: [],
  },
  {
    name: '5. MARMELO (16)',
    id: '5',
    marketID: '0x7d9f26082539a7f9793b8c3b25f2a20374ab357d73ff6d6dc99cab6145b567a0',
    lastPrice: {
      formatted: '0',
    },
    lastPricePercent: {
      full: '12.5%'
    },
    topBid: {
      shares: {
        formatted: '100',
      },
      price: {
        formatted: '0.2000',
      }
    },
    topAsk: {
      shares: {
        formatted: '100',
      },
      price: {
        formatted: '0.3000',
      }
    },
    positions: [],
    openOrders: [],
  },
  {
    name: '6. RED CARDINAL (24)',
    id: '6',
    marketID: '0x7d9f26082539a7f9793b8c3b25f2a20374ab357d73ff6d6dc99cab6145b567a0',
    lastPrice: {
      formatted: '0',
    },
    lastPricePercent: {
      full: '12.5%'
    },
    topBid: {
      shares: {
        formatted: '100',
      },
      price: {
        formatted: '0.2000',
      }
    },
    topAsk: {
      shares: {
        formatted: '100',
      },
      price: {
        formatted: '0.3000',
      }
    },
    positions: [],
    openOrders: [],
  },
  {
    name: '7. JOHANNES VERMEER (3)',
    id: '7',
    marketID: '0x7d9f26082539a7f9793b8c3b25f2a20374ab357d73ff6d6dc99cab6145b567a0',
    lastPrice: {
      formatted: '0',
    },
    lastPricePercent: {
      full: '12.5%'
    },
    topBid: {
      shares: {
        formatted: '100',
      },
      price: {
        formatted: '0.2000',
      }
    },
    topAsk: {
      shares: {
        formatted: '100',
      },
      price: {
        formatted: '0.8000',
      }
    },
    positions: [],
    openOrders: [],
  },
  {
    name: '8. BONDI BEACH (1)',
    id: '8',
    marketID: '0x7d9f26082539a7f9793b8c3b25f2a20374ab357d73ff6d6dc99cab6145b567a0',
    lastPrice: {
      formatted: '0',
    },
    lastPricePercent: {
      full: '12.5%'
    },
    topBid: {
      shares: {
        formatted: '100',
      },
      price: {
        formatted: '0.5000',
      }
    },
    topAsk: {
      shares: {
        formatted: '100',
      },
      price: {
        formatted: '0.6000',
      }
    },
    positions: [],
    openOrders: [],
  }
]
