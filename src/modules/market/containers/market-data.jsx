import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import MarketData from 'modules/market/components/market-data/market-data'

// import { selectMarket } from 'modules/market/selectors/market'

// import parseQuery from 'modules/routes/helpers/parse-query'

import getValue from 'utils/get-value'

const mapStateToProps = state => ({
  outcomes,
})

const MarketTradingContainer = withRouter(connect(mapStateToProps)(MarketData))

export default MarketTradingContainer


const outcomes = [
  {
    "outstandingShares": "800",
    "price": "0",
    "sharesPurchased": "0",
    "name": "1. HARTNELL (12)",
    "id": "1",
    "marketID": "0x7d9f26082539a7f9793b8c3b25f2a20374ab357d73ff6d6dc99cab6145b567a0",
    "lastPrice": {
      "value": 0,
      "formattedValue": 0,
      "formatted": "0",
      "roundedValue": 0,
      "rounded": "0.0000",
      "minimized": "0",
      "denomination": " ETH Tokens",
      "full": "0 ETH Tokens"
    },
    "lastPricePercent": {
      "value": 12.5,
      "formattedValue": 12.5,
      "formatted": "12.5",
      "roundedValue": 12,
      "rounded": "12",
      "minimized": "12.5",
      "denomination": "%",
      "full": "12.5%"
    },
    "trade": {
      "side": "buy",
      "numShares": null,
      "limitPrice": null,
      "maxNumShares": {
        "value": 0,
        "formattedValue": 0,
        "formatted": "0",
        "roundedValue": 0,
        "rounded": "0.00",
        "minimized": "0",
        "denomination": " shares",
        "full": "0 shares"
      },
      "potentialEthProfit": null,
      "potentialEthLoss": null,
      "potentialLossPercent": null,
      "potentialProfitPercent": null,
      "totalFee": {
        "value": 0,
        "formattedValue": 0,
        "formatted": "",
        "roundedValue": 0,
        "rounded": "",
        "minimized": "",
        "denomination": "",
        "full": ""
      },
      "gasFeesRealEth": {
        "value": 0,
        "formattedValue": 0,
        "formatted": "",
        "roundedValue": 0,
        "rounded": "",
        "minimized": "",
        "denomination": "",
        "full": ""
      },
      "totalCost": {
        "value": 0,
        "formattedValue": 0,
        "formatted": "0",
        "roundedValue": 0,
        "rounded": "0.0000",
        "minimized": "0",
        "denomination": " ETH Tokens",
        "full": "0 ETH Tokens"
      },
      "tradeTypeOptions": [
        {
          "label": "buy",
          "value": "buy"
        },
        {
          "label": "sell",
          "value": "sell"
        }
      ],
      "tradeSummary": {
        "totalGas": {
          "value": 0,
          "formattedValue": 0,
          "formatted": "0",
          "roundedValue": 0,
          "rounded": "0.0000",
          "minimized": "0",
          "denomination": " ETH",
          "full": "0 ETH"
        },
        "tradeOrders": []
      },
      "updateTradeOrder": {},
      "totalSharesUpToOrder": {}
    },
    "orderBook": {
      "bids": [
        {
          "isOfCurrentUser": false,
          "shares": {},
          "price": {}
        }
      ],
      "asks": [
        {
          "isOfCurrentUser": false,
          "shares": {},
          "price": {}
        }
      ]
    },
    "orderBookSeries": {
      "bids": [
        [
          0.2,
          100
        ]
      ],
      "asks": [
        [
          0.3,
          100
        ]
      ]
    },
    "topBid": {
      "isOfCurrentUser": false,
      "shares": {
        "value": 100,
        "formattedValue": 100,
        "formatted": "100",
        "roundedValue": 100,
        "rounded": "100.00",
        "minimized": "100",
        "denomination": " shares",
        "full": "100 shares"
      },
      "price": {
        "value": 0.2,
        "formattedValue": 0.2,
        "formatted": "0.2000",
        "roundedValue": 0.2,
        "rounded": "0.2000",
        "minimized": "0.2",
        "denomination": " ETH Tokens",
        "full": "0.2000 ETH Tokens"
      }
    },
    "topAsk": {
      "isOfCurrentUser": false,
      "shares": {
        "value": 100,
        "formattedValue": 100,
        "formatted": "100",
        "roundedValue": 100,
        "rounded": "100.00",
        "minimized": "100",
        "denomination": " shares",
        "full": "100 shares"
      },
      "price": {
        "value": 0.3,
        "formattedValue": 0.3,
        "formatted": "0.3000",
        "roundedValue": 0.3,
        "rounded": "0.3000",
        "minimized": "0.3",
        "denomination": " ETH Tokens",
        "full": "0.3000 ETH Tokens"
      }
    },
    "position": null,
    "userOpenOrders": []
  },
  {
    "outstandingShares": "800",
    "price": "0",
    "sharesPurchased": "0",
    "name": "2. ALMANDIN (14)",
    "id": "2",
    "marketID": "0x7d9f26082539a7f9793b8c3b25f2a20374ab357d73ff6d6dc99cab6145b567a0",
    "lastPrice": {
      "value": 0,
      "formattedValue": 0,
      "formatted": "0",
      "roundedValue": 0,
      "rounded": "0.0000",
      "minimized": "0",
      "denomination": " ETH Tokens",
      "full": "0 ETH Tokens"
    },
    "lastPricePercent": {
      "value": 12.5,
      "formattedValue": 12.5,
      "formatted": "12.5",
      "roundedValue": 12,
      "rounded": "12",
      "minimized": "12.5",
      "denomination": "%",
      "full": "12.5%"
    },
    "trade": {
      "side": "buy",
      "numShares": null,
      "limitPrice": null,
      "maxNumShares": {
        "value": 0,
        "formattedValue": 0,
        "formatted": "0",
        "roundedValue": 0,
        "rounded": "0.00",
        "minimized": "0",
        "denomination": " shares",
        "full": "0 shares"
      },
      "potentialEthProfit": null,
      "potentialEthLoss": null,
      "potentialLossPercent": null,
      "potentialProfitPercent": null,
      "totalFee": {
        "value": 0,
        "formattedValue": 0,
        "formatted": "",
        "roundedValue": 0,
        "rounded": "",
        "minimized": "",
        "denomination": "",
        "full": ""
      },
      "gasFeesRealEth": {
        "value": 0,
        "formattedValue": 0,
        "formatted": "",
        "roundedValue": 0,
        "rounded": "",
        "minimized": "",
        "denomination": "",
        "full": ""
      },
      "totalCost": {
        "value": 0,
        "formattedValue": 0,
        "formatted": "0",
        "roundedValue": 0,
        "rounded": "0.0000",
        "minimized": "0",
        "denomination": " ETH Tokens",
        "full": "0 ETH Tokens"
      },
      "tradeTypeOptions": [
        {
          "label": "buy",
          "value": "buy"
        },
        {
          "label": "sell",
          "value": "sell"
        }
      ],
      "tradeSummary": {
        "totalGas": {
          "value": 0,
          "formattedValue": 0,
          "formatted": "0",
          "roundedValue": 0,
          "rounded": "0.0000",
          "minimized": "0",
          "denomination": " ETH",
          "full": "0 ETH"
        },
        "tradeOrders": []
      },
      "updateTradeOrder": {},
      "totalSharesUpToOrder": {}
    },
    "orderBook": {
      "bids": [
        {
          "isOfCurrentUser": false,
          "shares": {},
          "price": {}
        }
      ],
      "asks": [
        {
          "isOfCurrentUser": false,
          "shares": {},
          "price": {}
        }
      ]
    },
    "orderBookSeries": {
      "bids": [
        [
          0.2,
          100
        ]
      ],
      "asks": [
        [
          0.3,
          100
        ]
      ]
    },
    "topBid": {
      "isOfCurrentUser": false,
      "shares": {
        "value": 100,
        "formattedValue": 100,
        "formatted": "100",
        "roundedValue": 100,
        "rounded": "100.00",
        "minimized": "100",
        "denomination": " shares",
        "full": "100 shares"
      },
      "price": {
        "value": 0.2,
        "formattedValue": 0.2,
        "formatted": "0.2000",
        "roundedValue": 0.2,
        "rounded": "0.2000",
        "minimized": "0.2",
        "denomination": " ETH Tokens",
        "full": "0.2000 ETH Tokens"
      }
    },
    "topAsk": {
      "isOfCurrentUser": false,
      "shares": {
        "value": 100,
        "formattedValue": 100,
        "formatted": "100",
        "roundedValue": 100,
        "rounded": "100.00",
        "minimized": "100",
        "denomination": " shares",
        "full": "100 shares"
      },
      "price": {
        "value": 0.3,
        "formattedValue": 0.3,
        "formatted": "0.3000",
        "roundedValue": 0.3,
        "rounded": "0.3000",
        "minimized": "0.3",
        "denomination": " ETH Tokens",
        "full": "0.3000 ETH Tokens"
      }
    },
    "position": null,
    "userOpenOrders": []
  },
  {
    "outstandingShares": "800",
    "price": "0",
    "sharesPurchased": "0",
    "name": "3. HUMIDOR (13)",
    "id": "3",
    "marketID": "0x7d9f26082539a7f9793b8c3b25f2a20374ab357d73ff6d6dc99cab6145b567a0",
    "lastPrice": {
      "value": 0,
      "formattedValue": 0,
      "formatted": "0",
      "roundedValue": 0,
      "rounded": "0.0000",
      "minimized": "0",
      "denomination": " ETH Tokens",
      "full": "0 ETH Tokens"
    },
    "lastPricePercent": {
      "value": 12.5,
      "formattedValue": 12.5,
      "formatted": "12.5",
      "roundedValue": 12,
      "rounded": "12",
      "minimized": "12.5",
      "denomination": "%",
      "full": "12.5%"
    },
    "trade": {
      "side": "buy",
      "numShares": null,
      "limitPrice": null,
      "maxNumShares": {
        "value": 0,
        "formattedValue": 0,
        "formatted": "0",
        "roundedValue": 0,
        "rounded": "0.00",
        "minimized": "0",
        "denomination": " shares",
        "full": "0 shares"
      },
      "potentialEthProfit": null,
      "potentialEthLoss": null,
      "potentialLossPercent": null,
      "potentialProfitPercent": null,
      "totalFee": {
        "value": 0,
        "formattedValue": 0,
        "formatted": "",
        "roundedValue": 0,
        "rounded": "",
        "minimized": "",
        "denomination": "",
        "full": ""
      },
      "gasFeesRealEth": {
        "value": 0,
        "formattedValue": 0,
        "formatted": "",
        "roundedValue": 0,
        "rounded": "",
        "minimized": "",
        "denomination": "",
        "full": ""
      },
      "totalCost": {
        "value": 0,
        "formattedValue": 0,
        "formatted": "0",
        "roundedValue": 0,
        "rounded": "0.0000",
        "minimized": "0",
        "denomination": " ETH Tokens",
        "full": "0 ETH Tokens"
      },
      "tradeTypeOptions": [
        {
          "label": "buy",
          "value": "buy"
        },
        {
          "label": "sell",
          "value": "sell"
        }
      ],
      "tradeSummary": {
        "totalGas": {
          "value": 0,
          "formattedValue": 0,
          "formatted": "0",
          "roundedValue": 0,
          "rounded": "0.0000",
          "minimized": "0",
          "denomination": " ETH",
          "full": "0 ETH"
        },
        "tradeOrders": []
      },
      "updateTradeOrder": {},
      "totalSharesUpToOrder": {}
    },
    "orderBook": {
      "bids": [
        {
          "isOfCurrentUser": false,
          "shares": {},
          "price": {}
        }
      ],
      "asks": [
        {
          "isOfCurrentUser": false,
          "shares": {},
          "price": {}
        }
      ]
    },
    "orderBookSeries": {
      "bids": [
        [
          0.2,
          100
        ]
      ],
      "asks": [
        [
          0.3,
          100
        ]
      ]
    },
    "topBid": {
      "isOfCurrentUser": false,
      "shares": {
        "value": 100,
        "formattedValue": 100,
        "formatted": "100",
        "roundedValue": 100,
        "rounded": "100.00",
        "minimized": "100",
        "denomination": " shares",
        "full": "100 shares"
      },
      "price": {
        "value": 0.2,
        "formattedValue": 0.2,
        "formatted": "0.2000",
        "roundedValue": 0.2,
        "rounded": "0.2000",
        "minimized": "0.2",
        "denomination": " ETH Tokens",
        "full": "0.2000 ETH Tokens"
      }
    },
    "topAsk": {
      "isOfCurrentUser": false,
      "shares": {
        "value": 100,
        "formattedValue": 100,
        "formatted": "100",
        "roundedValue": 100,
        "rounded": "100.00",
        "minimized": "100",
        "denomination": " shares",
        "full": "100 shares"
      },
      "price": {
        "value": 0.3,
        "formattedValue": 0.3,
        "formatted": "0.3000",
        "roundedValue": 0.3,
        "rounded": "0.3000",
        "minimized": "0.3",
        "denomination": " ETH Tokens",
        "full": "0.3000 ETH Tokens"
      }
    },
    "position": null,
    "userOpenOrders": []
  },
  {
    "outstandingShares": "800",
    "price": "0",
    "sharesPurchased": "0",
    "name": "4. TIBERIAN (23)",
    "id": "4",
    "marketID": "0x7d9f26082539a7f9793b8c3b25f2a20374ab357d73ff6d6dc99cab6145b567a0",
    "lastPrice": {
      "value": 0,
      "formattedValue": 0,
      "formatted": "0",
      "roundedValue": 0,
      "rounded": "0.0000",
      "minimized": "0",
      "denomination": " ETH Tokens",
      "full": "0 ETH Tokens"
    },
    "lastPricePercent": {
      "value": 12.5,
      "formattedValue": 12.5,
      "formatted": "12.5",
      "roundedValue": 12,
      "rounded": "12",
      "minimized": "12.5",
      "denomination": "%",
      "full": "12.5%"
    },
    "trade": {
      "side": "buy",
      "numShares": null,
      "limitPrice": null,
      "maxNumShares": {
        "value": 0,
        "formattedValue": 0,
        "formatted": "0",
        "roundedValue": 0,
        "rounded": "0.00",
        "minimized": "0",
        "denomination": " shares",
        "full": "0 shares"
      },
      "potentialEthProfit": null,
      "potentialEthLoss": null,
      "potentialLossPercent": null,
      "potentialProfitPercent": null,
      "totalFee": {
        "value": 0,
        "formattedValue": 0,
        "formatted": "",
        "roundedValue": 0,
        "rounded": "",
        "minimized": "",
        "denomination": "",
        "full": ""
      },
      "gasFeesRealEth": {
        "value": 0,
        "formattedValue": 0,
        "formatted": "",
        "roundedValue": 0,
        "rounded": "",
        "minimized": "",
        "denomination": "",
        "full": ""
      },
      "totalCost": {
        "value": 0,
        "formattedValue": 0,
        "formatted": "0",
        "roundedValue": 0,
        "rounded": "0.0000",
        "minimized": "0",
        "denomination": " ETH Tokens",
        "full": "0 ETH Tokens"
      },
      "tradeTypeOptions": [
        {
          "label": "buy",
          "value": "buy"
        },
        {
          "label": "sell",
          "value": "sell"
        }
      ],
      "tradeSummary": {
        "totalGas": {
          "value": 0,
          "formattedValue": 0,
          "formatted": "0",
          "roundedValue": 0,
          "rounded": "0.0000",
          "minimized": "0",
          "denomination": " ETH",
          "full": "0 ETH"
        },
        "tradeOrders": []
      },
      "updateTradeOrder": {},
      "totalSharesUpToOrder": {}
    },
    "orderBook": {
      "bids": [
        {
          "isOfCurrentUser": false,
          "shares": {},
          "price": {}
        }
      ],
      "asks": [
        {
          "isOfCurrentUser": false,
          "shares": {},
          "price": {}
        }
      ]
    },
    "orderBookSeries": {
      "bids": [
        [
          0.2,
          100
        ]
      ],
      "asks": [
        [
          0.3,
          100
        ]
      ]
    },
    "topBid": {
      "isOfCurrentUser": false,
      "shares": {
        "value": 100,
        "formattedValue": 100,
        "formatted": "100",
        "roundedValue": 100,
        "rounded": "100.00",
        "minimized": "100",
        "denomination": " shares",
        "full": "100 shares"
      },
      "price": {
        "value": 0.2,
        "formattedValue": 0.2,
        "formatted": "0.2000",
        "roundedValue": 0.2,
        "rounded": "0.2000",
        "minimized": "0.2",
        "denomination": " ETH Tokens",
        "full": "0.2000 ETH Tokens"
      }
    },
    "topAsk": {
      "isOfCurrentUser": false,
      "shares": {
        "value": 100,
        "formattedValue": 100,
        "formatted": "100",
        "roundedValue": 100,
        "rounded": "100.00",
        "minimized": "100",
        "denomination": " shares",
        "full": "100 shares"
      },
      "price": {
        "value": 0.3,
        "formattedValue": 0.3,
        "formatted": "0.3000",
        "roundedValue": 0.3,
        "rounded": "0.3000",
        "minimized": "0.3",
        "denomination": " ETH Tokens",
        "full": "0.3000 ETH Tokens"
      }
    },
    "position": null,
    "userOpenOrders": []
  },
  {
    "outstandingShares": "800",
    "price": "0",
    "sharesPurchased": "0",
    "name": "5. MARMELO (16)",
    "id": "5",
    "marketID": "0x7d9f26082539a7f9793b8c3b25f2a20374ab357d73ff6d6dc99cab6145b567a0",
    "lastPrice": {
      "value": 0,
      "formattedValue": 0,
      "formatted": "0",
      "roundedValue": 0,
      "rounded": "0.0000",
      "minimized": "0",
      "denomination": " ETH Tokens",
      "full": "0 ETH Tokens"
    },
    "lastPricePercent": {
      "value": 12.5,
      "formattedValue": 12.5,
      "formatted": "12.5",
      "roundedValue": 12,
      "rounded": "12",
      "minimized": "12.5",
      "denomination": "%",
      "full": "12.5%"
    },
    "trade": {
      "side": "buy",
      "numShares": null,
      "limitPrice": null,
      "maxNumShares": {
        "value": 0,
        "formattedValue": 0,
        "formatted": "0",
        "roundedValue": 0,
        "rounded": "0.00",
        "minimized": "0",
        "denomination": " shares",
        "full": "0 shares"
      },
      "potentialEthProfit": null,
      "potentialEthLoss": null,
      "potentialLossPercent": null,
      "potentialProfitPercent": null,
      "totalFee": {
        "value": 0,
        "formattedValue": 0,
        "formatted": "",
        "roundedValue": 0,
        "rounded": "",
        "minimized": "",
        "denomination": "",
        "full": ""
      },
      "gasFeesRealEth": {
        "value": 0,
        "formattedValue": 0,
        "formatted": "",
        "roundedValue": 0,
        "rounded": "",
        "minimized": "",
        "denomination": "",
        "full": ""
      },
      "totalCost": {
        "value": 0,
        "formattedValue": 0,
        "formatted": "0",
        "roundedValue": 0,
        "rounded": "0.0000",
        "minimized": "0",
        "denomination": " ETH Tokens",
        "full": "0 ETH Tokens"
      },
      "tradeTypeOptions": [
        {
          "label": "buy",
          "value": "buy"
        },
        {
          "label": "sell",
          "value": "sell"
        }
      ],
      "tradeSummary": {
        "totalGas": {
          "value": 0,
          "formattedValue": 0,
          "formatted": "0",
          "roundedValue": 0,
          "rounded": "0.0000",
          "minimized": "0",
          "denomination": " ETH",
          "full": "0 ETH"
        },
        "tradeOrders": []
      },
      "updateTradeOrder": {},
      "totalSharesUpToOrder": {}
    },
    "orderBook": {
      "bids": [
        {
          "isOfCurrentUser": false,
          "shares": {},
          "price": {}
        }
      ],
      "asks": [
        {
          "isOfCurrentUser": false,
          "shares": {},
          "price": {}
        }
      ]
    },
    "orderBookSeries": {
      "bids": [
        [
          0.2,
          100
        ]
      ],
      "asks": [
        [
          0.3,
          100
        ]
      ]
    },
    "topBid": {
      "isOfCurrentUser": false,
      "shares": {
        "value": 100,
        "formattedValue": 100,
        "formatted": "100",
        "roundedValue": 100,
        "rounded": "100.00",
        "minimized": "100",
        "denomination": " shares",
        "full": "100 shares"
      },
      "price": {
        "value": 0.2,
        "formattedValue": 0.2,
        "formatted": "0.2000",
        "roundedValue": 0.2,
        "rounded": "0.2000",
        "minimized": "0.2",
        "denomination": " ETH Tokens",
        "full": "0.2000 ETH Tokens"
      }
    },
    "topAsk": {
      "isOfCurrentUser": false,
      "shares": {
        "value": 100,
        "formattedValue": 100,
        "formatted": "100",
        "roundedValue": 100,
        "rounded": "100.00",
        "minimized": "100",
        "denomination": " shares",
        "full": "100 shares"
      },
      "price": {
        "value": 0.3,
        "formattedValue": 0.3,
        "formatted": "0.3000",
        "roundedValue": 0.3,
        "rounded": "0.3000",
        "minimized": "0.3",
        "denomination": " ETH Tokens",
        "full": "0.3000 ETH Tokens"
      }
    },
    "position": null,
    "userOpenOrders": []
  },
  {
    "outstandingShares": "800",
    "price": "0",
    "sharesPurchased": "0",
    "name": "6. RED CARDINAL (24)",
    "id": "6",
    "marketID": "0x7d9f26082539a7f9793b8c3b25f2a20374ab357d73ff6d6dc99cab6145b567a0",
    "lastPrice": {
      "value": 0,
      "formattedValue": 0,
      "formatted": "0",
      "roundedValue": 0,
      "rounded": "0.0000",
      "minimized": "0",
      "denomination": " ETH Tokens",
      "full": "0 ETH Tokens"
    },
    "lastPricePercent": {
      "value": 12.5,
      "formattedValue": 12.5,
      "formatted": "12.5",
      "roundedValue": 12,
      "rounded": "12",
      "minimized": "12.5",
      "denomination": "%",
      "full": "12.5%"
    },
    "trade": {
      "side": "buy",
      "numShares": null,
      "limitPrice": null,
      "maxNumShares": {
        "value": 0,
        "formattedValue": 0,
        "formatted": "0",
        "roundedValue": 0,
        "rounded": "0.00",
        "minimized": "0",
        "denomination": " shares",
        "full": "0 shares"
      },
      "potentialEthProfit": null,
      "potentialEthLoss": null,
      "potentialLossPercent": null,
      "potentialProfitPercent": null,
      "totalFee": {
        "value": 0,
        "formattedValue": 0,
        "formatted": "",
        "roundedValue": 0,
        "rounded": "",
        "minimized": "",
        "denomination": "",
        "full": ""
      },
      "gasFeesRealEth": {
        "value": 0,
        "formattedValue": 0,
        "formatted": "",
        "roundedValue": 0,
        "rounded": "",
        "minimized": "",
        "denomination": "",
        "full": ""
      },
      "totalCost": {
        "value": 0,
        "formattedValue": 0,
        "formatted": "0",
        "roundedValue": 0,
        "rounded": "0.0000",
        "minimized": "0",
        "denomination": " ETH Tokens",
        "full": "0 ETH Tokens"
      },
      "tradeTypeOptions": [
        {
          "label": "buy",
          "value": "buy"
        },
        {
          "label": "sell",
          "value": "sell"
        }
      ],
      "tradeSummary": {
        "totalGas": {
          "value": 0,
          "formattedValue": 0,
          "formatted": "0",
          "roundedValue": 0,
          "rounded": "0.0000",
          "minimized": "0",
          "denomination": " ETH",
          "full": "0 ETH"
        },
        "tradeOrders": []
      },
      "updateTradeOrder": {},
      "totalSharesUpToOrder": {}
    },
    "orderBook": {
      "bids": [
        {
          "isOfCurrentUser": false,
          "shares": {},
          "price": {}
        }
      ],
      "asks": [
        {
          "isOfCurrentUser": false,
          "shares": {},
          "price": {}
        }
      ]
    },
    "orderBookSeries": {
      "bids": [
        [
          0.2,
          100
        ]
      ],
      "asks": [
        [
          0.3,
          100
        ]
      ]
    },
    "topBid": {
      "isOfCurrentUser": false,
      "shares": {
        "value": 100,
        "formattedValue": 100,
        "formatted": "100",
        "roundedValue": 100,
        "rounded": "100.00",
        "minimized": "100",
        "denomination": " shares",
        "full": "100 shares"
      },
      "price": {
        "value": 0.2,
        "formattedValue": 0.2,
        "formatted": "0.2000",
        "roundedValue": 0.2,
        "rounded": "0.2000",
        "minimized": "0.2",
        "denomination": " ETH Tokens",
        "full": "0.2000 ETH Tokens"
      }
    },
    "topAsk": {
      "isOfCurrentUser": false,
      "shares": {
        "value": 100,
        "formattedValue": 100,
        "formatted": "100",
        "roundedValue": 100,
        "rounded": "100.00",
        "minimized": "100",
        "denomination": " shares",
        "full": "100 shares"
      },
      "price": {
        "value": 0.3,
        "formattedValue": 0.3,
        "formatted": "0.3000",
        "roundedValue": 0.3,
        "rounded": "0.3000",
        "minimized": "0.3",
        "denomination": " ETH Tokens",
        "full": "0.3000 ETH Tokens"
      }
    },
    "position": null,
    "userOpenOrders": []
  },
  {
    "outstandingShares": "800",
    "price": "0",
    "sharesPurchased": "0",
    "name": "7. JOHANNES VERMEER (3)",
    "id": "7",
    "marketID": "0x7d9f26082539a7f9793b8c3b25f2a20374ab357d73ff6d6dc99cab6145b567a0",
    "lastPrice": {
      "value": 0,
      "formattedValue": 0,
      "formatted": "0",
      "roundedValue": 0,
      "rounded": "0.0000",
      "minimized": "0",
      "denomination": " ETH Tokens",
      "full": "0 ETH Tokens"
    },
    "lastPricePercent": {
      "value": 12.5,
      "formattedValue": 12.5,
      "formatted": "12.5",
      "roundedValue": 12,
      "rounded": "12",
      "minimized": "12.5",
      "denomination": "%",
      "full": "12.5%"
    },
    "trade": {
      "side": "buy",
      "numShares": null,
      "limitPrice": null,
      "maxNumShares": {
        "value": 0,
        "formattedValue": 0,
        "formatted": "0",
        "roundedValue": 0,
        "rounded": "0.00",
        "minimized": "0",
        "denomination": " shares",
        "full": "0 shares"
      },
      "potentialEthProfit": null,
      "potentialEthLoss": null,
      "potentialLossPercent": null,
      "potentialProfitPercent": null,
      "totalFee": {
        "value": 0,
        "formattedValue": 0,
        "formatted": "",
        "roundedValue": 0,
        "rounded": "",
        "minimized": "",
        "denomination": "",
        "full": ""
      },
      "gasFeesRealEth": {
        "value": 0,
        "formattedValue": 0,
        "formatted": "",
        "roundedValue": 0,
        "rounded": "",
        "minimized": "",
        "denomination": "",
        "full": ""
      },
      "totalCost": {
        "value": 0,
        "formattedValue": 0,
        "formatted": "0",
        "roundedValue": 0,
        "rounded": "0.0000",
        "minimized": "0",
        "denomination": " ETH Tokens",
        "full": "0 ETH Tokens"
      },
      "tradeTypeOptions": [
        {
          "label": "buy",
          "value": "buy"
        },
        {
          "label": "sell",
          "value": "sell"
        }
      ],
      "tradeSummary": {
        "totalGas": {
          "value": 0,
          "formattedValue": 0,
          "formatted": "0",
          "roundedValue": 0,
          "rounded": "0.0000",
          "minimized": "0",
          "denomination": " ETH",
          "full": "0 ETH"
        },
        "tradeOrders": []
      },
      "updateTradeOrder": {},
      "totalSharesUpToOrder": {}
    },
    "orderBook": {
      "bids": [
        {
          "isOfCurrentUser": false,
          "shares": {},
          "price": {}
        }
      ],
      "asks": [
        {
          "isOfCurrentUser": false,
          "shares": {},
          "price": {}
        }
      ]
    },
    "orderBookSeries": {
      "bids": [
        [
          0.2,
          100
        ]
      ],
      "asks": [
        [
          0.8,
          100
        ]
      ]
    },
    "topBid": {
      "isOfCurrentUser": false,
      "shares": {
        "value": 100,
        "formattedValue": 100,
        "formatted": "100",
        "roundedValue": 100,
        "rounded": "100.00",
        "minimized": "100",
        "denomination": " shares",
        "full": "100 shares"
      },
      "price": {
        "value": 0.2,
        "formattedValue": 0.2,
        "formatted": "0.2000",
        "roundedValue": 0.2,
        "rounded": "0.2000",
        "minimized": "0.2",
        "denomination": " ETH Tokens",
        "full": "0.2000 ETH Tokens"
      }
    },
    "topAsk": {
      "isOfCurrentUser": false,
      "shares": {
        "value": 100,
        "formattedValue": 100,
        "formatted": "100",
        "roundedValue": 100,
        "rounded": "100.00",
        "minimized": "100",
        "denomination": " shares",
        "full": "100 shares"
      },
      "price": {
        "value": 0.8,
        "formattedValue": 0.8,
        "formatted": "0.8000",
        "roundedValue": 0.8,
        "rounded": "0.8000",
        "minimized": "0.8",
        "denomination": " ETH Tokens",
        "full": "0.8000 ETH Tokens"
      }
    },
    "position": null,
    "userOpenOrders": []
  },
  {
    "outstandingShares": "800",
    "price": "0",
    "sharesPurchased": "0",
    "name": "8. BONDI BEACH (1)",
    "id": "8",
    "marketID": "0x7d9f26082539a7f9793b8c3b25f2a20374ab357d73ff6d6dc99cab6145b567a0",
    "lastPrice": {
      "value": 0,
      "formattedValue": 0,
      "formatted": "0",
      "roundedValue": 0,
      "rounded": "0.0000",
      "minimized": "0",
      "denomination": " ETH Tokens",
      "full": "0 ETH Tokens"
    },
    "lastPricePercent": {
      "value": 12.5,
      "formattedValue": 12.5,
      "formatted": "12.5",
      "roundedValue": 12,
      "rounded": "12",
      "minimized": "12.5",
      "denomination": "%",
      "full": "12.5%"
    },
    "trade": {
      "side": "buy",
      "numShares": null,
      "limitPrice": null,
      "maxNumShares": {
        "value": 0,
        "formattedValue": 0,
        "formatted": "0",
        "roundedValue": 0,
        "rounded": "0.00",
        "minimized": "0",
        "denomination": " shares",
        "full": "0 shares"
      },
      "potentialEthProfit": null,
      "potentialEthLoss": null,
      "potentialLossPercent": null,
      "potentialProfitPercent": null,
      "totalFee": {
        "value": 0,
        "formattedValue": 0,
        "formatted": "",
        "roundedValue": 0,
        "rounded": "",
        "minimized": "",
        "denomination": "",
        "full": ""
      },
      "gasFeesRealEth": {
        "value": 0,
        "formattedValue": 0,
        "formatted": "",
        "roundedValue": 0,
        "rounded": "",
        "minimized": "",
        "denomination": "",
        "full": ""
      },
      "totalCost": {
        "value": 0,
        "formattedValue": 0,
        "formatted": "0",
        "roundedValue": 0,
        "rounded": "0.0000",
        "minimized": "0",
        "denomination": " ETH Tokens",
        "full": "0 ETH Tokens"
      },
      "tradeTypeOptions": [
        {
          "label": "buy",
          "value": "buy"
        },
        {
          "label": "sell",
          "value": "sell"
        }
      ],
      "tradeSummary": {
        "totalGas": {
          "value": 0,
          "formattedValue": 0,
          "formatted": "0",
          "roundedValue": 0,
          "rounded": "0.0000",
          "minimized": "0",
          "denomination": " ETH",
          "full": "0 ETH"
        },
        "tradeOrders": []
      },
      "updateTradeOrder": {},
      "totalSharesUpToOrder": {}
    },
    "orderBook": {
      "bids": [
        {
          "isOfCurrentUser": false,
          "shares": {},
          "price": {}
        }
      ],
      "asks": [
        {
          "isOfCurrentUser": false,
          "shares": {},
          "price": {}
        }
      ]
    },
    "orderBookSeries": {
      "bids": [
        [
          0.5,
          100
        ]
      ],
      "asks": [
        [
          0.6,
          100
        ]
      ]
    },
    "topBid": {
      "isOfCurrentUser": false,
      "shares": {
        "value": 100,
        "formattedValue": 100,
        "formatted": "100",
        "roundedValue": 100,
        "rounded": "100.00",
        "minimized": "100",
        "denomination": " shares",
        "full": "100 shares"
      },
      "price": {
        "value": 0.5,
        "formattedValue": 0.5,
        "formatted": "0.5000",
        "roundedValue": 0.5,
        "rounded": "0.5000",
        "minimized": "0.5",
        "denomination": " ETH Tokens",
        "full": "0.5000 ETH Tokens"
      }
    },
    "topAsk": {
      "isOfCurrentUser": false,
      "shares": {
        "value": 100,
        "formattedValue": 100,
        "formatted": "100",
        "roundedValue": 100,
        "rounded": "100.00",
        "minimized": "100",
        "denomination": " shares",
        "full": "100 shares"
      },
      "price": {
        "value": 0.6,
        "formattedValue": 0.6,
        "formatted": "0.6000",
        "roundedValue": 0.6,
        "rounded": "0.6000",
        "minimized": "0.6",
        "denomination": " ETH Tokens",
        "full": "0.6000 ETH Tokens"
      }
    },
    "position": null,
    "userOpenOrders": []
  }
]
