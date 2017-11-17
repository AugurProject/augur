import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import MarketTrading from 'modules/market/components/market-trading/market-trading'

const mapStateToProps = state => ({
  marketID: '0x7d9f26082539a7f9793b8c3b25f2a20374ab357d73ff6d6dc99cab6145b567a0',
  market,
  outcomes,
  selectedOutcome,
  isLogged: state.isLogged,
  isMobile: state.isMobile,
})

const MarketTradingContainer = withRouter(connect(mapStateToProps)(MarketTrading))

export default MarketTradingContainer

const market = {
  marketType: 'categorical',
  tradeSummary: {
    hasUserEnoughFunds: true,
  },
  submitTrade: () => console.log('submit trade'),
}

const selectedOutcome = {
  id: '1',
  name: 'Example Name',
  lastPrice: {
    formatted: '0.3872',
  },
  trade: {
    potentialEthProfit: {
      formatted: '+7.2477',
    },
    potentialEthLoss: {
      formatted: '-5.0458',
    },
    potentialLossPercent: {
      formatted: '+150',
    },
    potentialProfitPercent: {
      formatted: '-150',
    },
    totalCost: {
      formatted: '4.574',
    },
  }
}

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
