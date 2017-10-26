import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import ReportingDispute from 'modules/reporting/components/reporting-dispute/reporting-dispute'

const mapStateToProps = state => ({
  isLogged: state.isLogged,
  market
})

// const mapDispatchToProps = dispatch => ({
// })

const Reporting = withRouter(connect(mapStateToProps)(ReportingDispute))

export default Reporting

// Binary Example
const market = {
  isStakeRequired: false,
  id: '0xcd7b177af7a12ec3be1c7f992ec7d608959630f2113227a2cdd9db562bd01eb4',
  branchID: '0xf69b5',
  tradingPeriod: 8947,
  tradingFee: '0.025',
  makerFee: '0.0125',
  takerFee: '0.025',
  creationTime: {
    value: '2017-10-16T14:36:38.000Z',
    formatted: 'Oct 16, 2017 2:36 PM',
    formattedLocal: 'Oct 16, 2017 7:36 AM (UTC -7)',
    full: 'Mon, 16 Oct 2017 14:36:38 GMT',
    timestamp: 1508164598000
  },
  volume: {
    value: 3000,
    formattedValue: 3000,
    formatted: '3,000',
    roundedValue: 3000,
    rounded: '3,000.00',
    minimized: '3,000',
    denomination: ' shares',
    full: '3,000 shares'
  },
  topic: 'Cryptocurrency',
  tags: [
    'Cryptocurrency',
    'Bitcoin',
    'Ethereum'
  ],
  endDate: {
    value: '2018-12-30T08:00:00.000Z',
    formatted: 'Dec 30, 2018 8:00 AM',
    formattedLocal: 'Dec 30, 2018 12:00 AM (UTC -8)',
    full: 'Sun, 30 Dec 2018 08:00:00 GMT',
    timestamp: 1546156800000
  },
  eventID: '0xee03ff4923cb4fc8f2f2370e0f1d5cffd321342d304e221e566623616f676ba4',
  minValue: '1',
  maxValue: '2',
  numOutcomes: 2,
  type: 'binary',
  consensus: null,
  description: 'Will Bitcoin be surpassed by Ethereum by the end of 2018?',
  isLoadedMarketInfo: true,
  isLoading: false,
  network: '9000',
  cumulativeScale: '1',
  creationBlock: 422516,
  creationFee: '7.2',
  author: '0xa5f5cecbb1e1a1e784a975b4d019f50e06a95091',
  eventBond: '3.6',
  outcomes: [
    {
      id: '2',
      outstandingShares: '1000',
      price: '0',
      sharesPurchased: '0',
      name: 'Yes',
      marketID: '0xcd7b177af7a12ec3be1c7f992ec7d608959630f2113227a2cdd9db562bd01eb4',
      lastPrice: {
        value: 0,
        formattedValue: 0,
        formatted: '0',
        roundedValue: 0,
        rounded: '0.0000',
        minimized: '0',
        denomination: ' ETH Tokens',
        full: '0 ETH Tokens'
      },
      lastPricePercent: {
        value: 50,
        formattedValue: 50,
        formatted: '50.0',
        roundedValue: 50,
        rounded: '50',
        minimized: '50',
        denomination: '%',
        full: '50.0%'
      },
      trade: {
        side: 'buy',
        numShares: null,
        limitPrice: null,
        maxNumShares: {
          value: 0,
          formattedValue: 0,
          formatted: '0',
          roundedValue: 0,
          rounded: '0.00',
          minimized: '0',
          denomination: ' shares',
          full: '0 shares'
        },
        potentialEthProfit: null,
        potentialEthLoss: null,
        potentialLossPercent: null,
        potentialProfitPercent: null,
        totalFee: {
          value: 0,
          formattedValue: 0,
          formatted: '',
          roundedValue: 0,
          rounded: '',
          minimized: '',
          denomination: '',
          full: ''
        },
        gasFeesRealEth: {
          value: 0,
          formattedValue: 0,
          formatted: '',
          roundedValue: 0,
          rounded: '',
          minimized: '',
          denomination: '',
          full: ''
        },
        totalCost: {
          value: 0,
          formattedValue: 0,
          formatted: '0',
          roundedValue: 0,
          rounded: '0.0000',
          minimized: '0',
          denomination: ' ETH Tokens',
          full: '0 ETH Tokens'
        },
        tradeTypeOptions: [
          {
            label: 'buy',
            value: 'buy'
          },
          {
            label: 'sell',
            value: 'sell'
          }
        ],
        tradeSummary: {
          totalGas: {
            value: 0,
            formattedValue: 0,
            formatted: '0',
            roundedValue: 0,
            rounded: '0.0000',
            minimized: '0',
            denomination: ' ETH',
            full: '0 ETH'
          },
          tradeOrders: [

          ]
        }
      },
      orderBook: {
        bids: [

        ],
        asks: [

        ]
      },
      orderBookSeries: {
        bids: [

        ],
        asks: [

        ]
      },
      topBid: null,
      topAsk: null,
      position: null,
      userOpenOrders: [

      ]
    }
  ],
  extraInfo: 'Will Ethereum value overpass Bitcoin by the end of 2018?',
  formattedDescription: 'will_bitcoin_be_surpassed_by_ethereum_by_the_end_of_2018',
  isBinary: true,
  isCategorical: false,
  isScalar: false,
  isMarketLoading: false,
  endDateLabel: 'ends',
  isOpen: true,
  isFavorite: false,
  takerFeePercent: {
    value: 2.5,
    formattedValue: 2.5,
    formatted: '2.5',
    roundedValue: 2,
    rounded: '2',
    minimized: '2.5',
    denomination: '%',
    full: '2.5%'
  },
  makerFeePercent: {
    value: 1.25,
    formattedValue: 1.2,
    formatted: '1.2',
    roundedValue: 1,
    rounded: '1',
    minimized: '1.2',
    denomination: '%',
    full: '1.2%'
  },
  isRequiredToReportByAccount: false,
  isPendingReport: true,
  isReportSubmitted: false,
  isReported: false,
  isMissedReport: false,
  isReportTabVisible: false,
  isSnitchTabVisible: false,
  report: {

  },
  outstandingShares: {
    value: 1000,
    formattedValue: 1000,
    formatted: '1,000',
    roundedValue: 1000,
    rounded: '1,000',
    minimized: '1,000',
    denomination: '',
    full: '1,000'
  },
  priceTimeSeries: [

  ],
  reportableOutcomes: [
    {
      id: '1',
      name: 'No'
    },
    {
      id: '2',
      name: 'Yes'
    },
    {
      id: '1.5',
      name: 'Indeterminate'
    }
  ],
  userOpenOrdersSummary: null,
  tradeSummary: {
    totalGas: {
      value: 0,
      formattedValue: 0,
      formatted: '0',
      roundedValue: 0,
      rounded: '0.0000',
      minimized: '0',
      denomination: ' ETH',
      full: '0 ETH'
    },
    tradeOrders: [

    ],
    hasUserEnoughFunds: false
  }
}

// Scalar Example
// const market = {
//   isStakeRequired: false,
//   id: '0x12b6b957ee773b598f58969cacfd463a8bac84f464e698fd266d50f5957badd0',
//   branchID: '0xf69b5',
//   tradingPeriod: 8766,
//   tradingFee: '0.02',
//   makerFee: '0.01',
//   takerFee: '0.02',
//   creationTime: {
//     value: {},
//     formatted: 'Aug 9, 2017 3:18 AM',
//     formattedLocal: 'Aug 8, 2017 8:18 PM (UTC -7)',
//     full: 'Wed, 09 Aug 2017 03:18:53 GMT',
//     timestamp: 1502248733000
//   },
//   volume: {
//     value: 380,
//     formattedValue: 380,
//     formatted: '380',
//     roundedValue: 380,
//     rounded: '380.00',
//     minimized: '380',
//     denomination: ' shares',
//     full: '380 shares'
//   },
//   topic: 'science',
//   tags: [
//     'science',
//     'extinction',
//     'marine biology'
//   ],
//   endDate: {
//     value: {},
//     formatted: 'Jan 2, 2018 8:00 AM',
//     formattedLocal: 'Jan 2, 2018 12:00 AM (UTC -8)',
//     full: 'Tue, 02 Jan 2018 08:00:00 GMT',
//     timestamp: 1514880000000
//   },
//   eventID: '0x3e45db076c93a3726c5d96ec7d31a29bed0b4016946236b4363807d646a4e6c3',
//   minValue: '0',
//   maxValue: '10000',
//   numOutcomes: 2,
//   type: 'scalar',
//   consensus: null,
//   description: 'How many marine species will go extinct between January 1, 2016 and January 1, 2018?',
//   isLoadedMarketInfo: true,
//   isLoading: false,
//   network: '9000',
//   cumulativeScale: '10000',
//   creationBlock: 363,
//   creationFee: '9',
//   author: '0x05ae1d0ca6206c6168b42efcd1fbe0ed144e821b',
//   eventBond: '4.5',
//   outcomes: [
//     {}
//   ],
//   resolutionSource: 'science!',
//   formattedDescription: 'how_many_marine_species_will_go_extinct_between_january_1_2016_and_january_1_2018',
//   isBinary: false,
//   isCategorical: false,
//   isScalar: true,
//   isMarketLoading: false,
//   endDateLabel: 'ends',
//   isOpen: true,
//   isFavorite: false,
//   takerFeePercent: {
//     value: 2,
//     formattedValue: 2,
//     formatted: '2.0',
//     roundedValue: 2,
//     rounded: '2',
//     minimized: '2',
//     denomination: '%',
//     full: '2.0%'
//   },
//   makerFeePercent: {
//     value: 1,
//     formattedValue: 1,
//     formatted: '1.0',
//     roundedValue: 1,
//     rounded: '1',
//     minimized: '1',
//     denomination: '%',
//     full: '1.0%'
//   },
//   isRequiredToReportByAccount: false,
//   isPendingReport: false,
//   isReportSubmitted: false,
//   isReported: false,
//   isMissedReport: false,
//   isReportTabVisible: false,
//   isSnitchTabVisible: false,
//   onSubmitPlaceTrade: '[function ]',
//   report: {
//     onSubmitReport: {}
//   },
//   outstandingShares: {
//     value: 100,
//     formattedValue: 100,
//     formatted: '100',
//     roundedValue: 100,
//     rounded: '100',
//     minimized: '100',
//     denomination: '',
//     full: '100'
//   },
//   priceTimeSeries: [],
//   reportableOutcomes: [
//     {}
//   ],
//   onSubmitSlashRep: '[function ]',
//   userOpenOrdersSummary: null,
//   tradeSummary: {
//     totalGas: {},
//     tradeOrders: {},
//     hasUserEnoughFunds: false
//   },
//   isLogged: false,
//   shareDenominations: [
//     {},
//     {},
//     {}
//   ],
//   toggleFavorite: '[function toggleFavorite]'
// }

// Categorical Example
// const market = {
//   isStakeRequired: false,
//   id: '0x284dc8742e7441375adad1e545b685ded6ff3a361a4659c1be11fca2055de6e9',
//   branchID: '0xf69b5',
//   tradingPeriod: 8720,
//   tradingFee: '0.023333333333333333',
//   makerFee: '0.004999999999999999935238095238095238',
//   takerFee: '0.029999999999999999564761904761904762',
//   creationTime: {
//     value: '2017-08-09T03:17:52.000Z',
//     formatted: 'Aug 9, 2017 3:17 AM',
//     formattedLocal: 'Aug 8, 2017 8:17 PM (UTC -7)',
//     full: 'Wed, 09 Aug 2017 03:17:52 GMT',
//     timestamp: 1502248672000
//   },
//   volume: {
//     value: 2661.9,
//     formattedValue: 2661.9,
//     formatted: '2,661.9',
//     roundedValue: 2661.9,
//     rounded: '2,661.90',
//     minimized: '2,661.9',
//     denomination: ' shares',
//     full: '2,661.9 shares'
//   },
//   topic: 'housing',
//   tags: [
//     'housing',
//     'economy',
//     'bubble'
//   ],
//   endDate: {
//     value: '2017-10-02T07:00:00.000Z',
//     formatted: 'Oct 2, 2017 7:00 AM',
//     formattedLocal: 'Oct 2, 2017 12:00 AM (UTC -7)',
//     full: 'Mon, 02 Oct 2017 07:00:00 GMT',
//     timestamp: 1506927600000
//   },
//   eventID: '0x726fb98bb6c821d6c9a1cb4a25fc9bc88f6091024f4658ec4b4b78e512ef3b36',
//   minValue: '1',
//   maxValue: '8',
//   numOutcomes: 8,
//   type: 'categorical',
//   consensus: null,
//   description: 'Which city will have the highest median single-family home price for September 2017?',
//   isLoadedMarketInfo: true,
//   isLoading: false,
//   network: '9000',
//   cumulativeScale: '1',
//   creationBlock: 333,
//   creationFee: '7.714285714285714395',
//   author: '0x05ae1d0ca6206c6168b42efcd1fbe0ed144e821b',
//   eventBond: '3.857142857142857197',
//   outcomes: [
//     {
//       outstandingShares: '166',
//       price: '0.5625',
//       sharesPurchased: '0',
//       name: 'Hong Kong',
//       id: '7',
//       marketID: '0x284dc8742e7441375adad1e545b685ded6ff3a361a4659c1be11fca2055de6e9',
//       lastPrice: {
//         value: 0.5625,
//         formattedValue: 0.5625,
//         formatted: '0.5625',
//         roundedValue: 0.5625,
//         rounded: '0.5625',
//         minimized: '0.5625',
//         denomination: ' ETH Tokens',
//         full: '0.5625 ETH Tokens'
//       },
//       lastPricePercent: {
//         value: 56.25,
//         formattedValue: 56.2,
//         formatted: '56.2',
//         roundedValue: 56,
//         rounded: '56',
//         minimized: '56.2',
//         denomination: '%',
//         full: '56.2%'
//       },
//       trade: {
//         side: 'buy',
//         numShares: null,
//         limitPrice: null,
//         maxNumShares: {
//           value: 0,
//           formattedValue: 0,
//           formatted: '0',
//           roundedValue: 0,
//           rounded: '0.00',
//           minimized: '0',
//           denomination: ' shares',
//           full: '0 shares'
//         },
//         potentialEthProfit: null,
//         potentialEthLoss: null,
//         potentialLossPercent: null,
//         potentialProfitPercent: null,
//         totalFee: {
//           value: 0,
//           formattedValue: 0,
//           formatted: '',
//           roundedValue: 0,
//           rounded: '',
//           minimized: '',
//           denomination: '',
//           full: ''
//         },
//         gasFeesRealEth: {
//           value: 0,
//           formattedValue: 0,
//           formatted: '',
//           roundedValue: 0,
//           rounded: '',
//           minimized: '',
//           denomination: '',
//           full: ''
//         },
//         totalCost: {
//           value: 0,
//           formattedValue: 0,
//           formatted: '0',
//           roundedValue: 0,
//           rounded: '0.0000',
//           minimized: '0',
//           denomination: ' ETH Tokens',
//           full: '0 ETH Tokens'
//         },
//         tradeTypeOptions: [
//           {
//             label: 'buy',
//             value: 'buy'
//           },
//           {
//             label: 'sell',
//             value: 'sell'
//           }
//         ],
//         tradeSummary: {
//           totalGas: {
//             value: 0,
//             formattedValue: 0,
//             formatted: '0',
//             roundedValue: 0,
//             rounded: '0.0000',
//             minimized: '0',
//             denomination: ' ETH',
//             full: '0 ETH'
//           },
//           tradeOrders: [

//           ]
//         }
//       },
//       orderBook: {
//         bids: [

//         ],
//         asks: [

//         ]
//       },
//       orderBookSeries: {
//         bids: [

//         ],
//         asks: [

//         ]
//       },
//       topBid: null,
//       topAsk: null,
//       position: null,
//       userOpenOrders: [

//       ]
//     },
//     {
//       outstandingShares: '166',
//       price: '0.225',
//       sharesPurchased: '0',
//       name: 'Tokyo',
//       id: '5',
//       marketID: '0x284dc8742e7441375adad1e545b685ded6ff3a361a4659c1be11fca2055de6e9',
//       lastPrice: {
//         value: 0.225,
//         formattedValue: 0.225,
//         formatted: '0.2250',
//         roundedValue: 0.225,
//         rounded: '0.2250',
//         minimized: '0.225',
//         denomination: ' ETH Tokens',
//         full: '0.2250 ETH Tokens'
//       },
//       lastPricePercent: {
//         value: 22.5,
//         formattedValue: 22.5,
//         formatted: '22.5',
//         roundedValue: 22,
//         rounded: '22',
//         minimized: '22.5',
//         denomination: '%',
//         full: '22.5%'
//       },
//       trade: {
//         side: 'buy',
//         numShares: null,
//         limitPrice: null,
//         maxNumShares: {
//           value: 0,
//           formattedValue: 0,
//           formatted: '0',
//           roundedValue: 0,
//           rounded: '0.00',
//           minimized: '0',
//           denomination: ' shares',
//           full: '0 shares'
//         },
//         potentialEthProfit: null,
//         potentialEthLoss: null,
//         potentialLossPercent: null,
//         potentialProfitPercent: null,
//         totalFee: {
//           value: 0,
//           formattedValue: 0,
//           formatted: '',
//           roundedValue: 0,
//           rounded: '',
//           minimized: '',
//           denomination: '',
//           full: ''
//         },
//         gasFeesRealEth: {
//           value: 0,
//           formattedValue: 0,
//           formatted: '',
//           roundedValue: 0,
//           rounded: '',
//           minimized: '',
//           denomination: '',
//           full: ''
//         },
//         totalCost: {
//           value: 0,
//           formattedValue: 0,
//           formatted: '0',
//           roundedValue: 0,
//           rounded: '0.0000',
//           minimized: '0',
//           denomination: ' ETH Tokens',
//           full: '0 ETH Tokens'
//         },
//         tradeTypeOptions: [
//           {
//             label: 'buy',
//             value: 'buy'
//           },
//           {
//             label: 'sell',
//             value: 'sell'
//           }
//         ],
//         tradeSummary: {
//           totalGas: {
//             value: 0,
//             formattedValue: 0,
//             formatted: '0',
//             roundedValue: 0,
//             rounded: '0.0000',
//             minimized: '0',
//             denomination: ' ETH',
//             full: '0 ETH'
//           },
//           tradeOrders: [

//           ]
//         }
//       },
//       orderBook: {
//         bids: [

//         ],
//         asks: [

//         ]
//       },
//       orderBookSeries: {
//         bids: [

//         ],
//         asks: [

//         ]
//       },
//       topBid: null,
//       topAsk: null,
//       position: null,
//       userOpenOrders: [

//       ]
//     },
//     {
//       outstandingShares: '166',
//       price: '0.225',
//       sharesPurchased: '0',
//       name: 'other',
//       id: '8',
//       marketID: '0x284dc8742e7441375adad1e545b685ded6ff3a361a4659c1be11fca2055de6e9',
//       lastPrice: {
//         value: 0.225,
//         formattedValue: 0.225,
//         formatted: '0.2250',
//         roundedValue: 0.225,
//         rounded: '0.2250',
//         minimized: '0.225',
//         denomination: ' ETH Tokens',
//         full: '0.2250 ETH Tokens'
//       },
//       lastPricePercent: {
//         value: 22.5,
//         formattedValue: 22.5,
//         formatted: '22.5',
//         roundedValue: 22,
//         rounded: '22',
//         minimized: '22.5',
//         denomination: '%',
//         full: '22.5%'
//       },
//       trade: {
//         side: 'buy',
//         numShares: null,
//         limitPrice: null,
//         maxNumShares: {
//           value: 0,
//           formattedValue: 0,
//           formatted: '0',
//           roundedValue: 0,
//           rounded: '0.00',
//           minimized: '0',
//           denomination: ' shares',
//           full: '0 shares'
//         },
//         potentialEthProfit: null,
//         potentialEthLoss: null,
//         potentialLossPercent: null,
//         potentialProfitPercent: null,
//         totalFee: {
//           value: 0,
//           formattedValue: 0,
//           formatted: '',
//           roundedValue: 0,
//           rounded: '',
//           minimized: '',
//           denomination: '',
//           full: ''
//         },
//         gasFeesRealEth: {
//           value: 0,
//           formattedValue: 0,
//           formatted: '',
//           roundedValue: 0,
//           rounded: '',
//           minimized: '',
//           denomination: '',
//           full: ''
//         },
//         totalCost: {
//           value: 0,
//           formattedValue: 0,
//           formatted: '0',
//           roundedValue: 0,
//           rounded: '0.0000',
//           minimized: '0',
//           denomination: ' ETH Tokens',
//           full: '0 ETH Tokens'
//         },
//         tradeTypeOptions: [
//           {
//             label: 'buy',
//             value: 'buy'
//           },
//           {
//             label: 'sell',
//             value: 'sell'
//           }
//         ],
//         tradeSummary: {
//           totalGas: {
//             value: 0,
//             formattedValue: 0,
//             formatted: '0',
//             roundedValue: 0,
//             rounded: '0.0000',
//             minimized: '0',
//             denomination: ' ETH',
//             full: '0 ETH'
//           },
//           tradeOrders: [

//           ]
//         }
//       },
//       orderBook: {
//         bids: [

//         ],
//         asks: [

//         ]
//       },
//       orderBookSeries: {
//         bids: [

//         ],
//         asks: [

//         ]
//       },
//       topBid: null,
//       topAsk: null,
//       position: null,
//       userOpenOrders: [

//       ]
//     },
//     {
//       outstandingShares: '166',
//       price: '0.025',
//       sharesPurchased: '0',
//       name: 'San Francisco',
//       id: '4',
//       marketID: '0x284dc8742e7441375adad1e545b685ded6ff3a361a4659c1be11fca2055de6e9',
//       lastPrice: {
//         value: 0.025,
//         formattedValue: 0.025,
//         formatted: '0.0250',
//         roundedValue: 0.025,
//         rounded: '0.0250',
//         minimized: '0.025',
//         denomination: ' ETH Tokens',
//         full: '0.0250 ETH Tokens'
//       },
//       lastPricePercent: {
//         value: 2.5,
//         formattedValue: 2.5,
//         formatted: '2.5',
//         roundedValue: 2,
//         rounded: '2',
//         minimized: '2.5',
//         denomination: '%',
//         full: '2.5%'
//       },
//       trade: {
//         side: 'buy',
//         numShares: null,
//         limitPrice: null,
//         maxNumShares: {
//           value: 0,
//           formattedValue: 0,
//           formatted: '0',
//           roundedValue: 0,
//           rounded: '0.00',
//           minimized: '0',
//           denomination: ' shares',
//           full: '0 shares'
//         },
//         potentialEthProfit: null,
//         potentialEthLoss: null,
//         potentialLossPercent: null,
//         potentialProfitPercent: null,
//         totalFee: {
//           value: 0,
//           formattedValue: 0,
//           formatted: '',
//           roundedValue: 0,
//           rounded: '',
//           minimized: '',
//           denomination: '',
//           full: ''
//         },
//         gasFeesRealEth: {
//           value: 0,
//           formattedValue: 0,
//           formatted: '',
//           roundedValue: 0,
//           rounded: '',
//           minimized: '',
//           denomination: '',
//           full: ''
//         },
//         totalCost: {
//           value: 0,
//           formattedValue: 0,
//           formatted: '0',
//           roundedValue: 0,
//           rounded: '0.0000',
//           minimized: '0',
//           denomination: ' ETH Tokens',
//           full: '0 ETH Tokens'
//         },
//         tradeTypeOptions: [
//           {
//             label: 'buy',
//             value: 'buy'
//           },
//           {
//             label: 'sell',
//             value: 'sell'
//           }
//         ],
//         tradeSummary: {
//           totalGas: {
//             value: 0,
//             formattedValue: 0,
//             formatted: '0',
//             roundedValue: 0,
//             rounded: '0.0000',
//             minimized: '0',
//             denomination: ' ETH',
//             full: '0 ETH'
//           },
//           tradeOrders: [

//           ]
//         }
//       },
//       orderBook: {
//         bids: [

//         ],
//         asks: [

//         ]
//       },
//       orderBookSeries: {
//         bids: [

//         ],
//         asks: [

//         ]
//       },
//       topBid: null,
//       topAsk: null,
//       position: null,
//       userOpenOrders: [

//       ]
//     },
//     {
//       outstandingShares: '166',
//       price: '0',
//       sharesPurchased: '0',
//       name: 'London',
//       id: '1',
//       marketID: '0x284dc8742e7441375adad1e545b685ded6ff3a361a4659c1be11fca2055de6e9',
//       lastPrice: {
//         value: 0,
//         formattedValue: 0,
//         formatted: '0',
//         roundedValue: 0,
//         rounded: '0.0000',
//         minimized: '0',
//         denomination: ' ETH Tokens',
//         full: '0 ETH Tokens'
//       },
//       lastPricePercent: {
//         value: 12.5,
//         formattedValue: 12.5,
//         formatted: '12.5',
//         roundedValue: 12,
//         rounded: '12',
//         minimized: '12.5',
//         denomination: '%',
//         full: '12.5%'
//       },
//       trade: {
//         side: 'buy',
//         numShares: null,
//         limitPrice: null,
//         maxNumShares: {
//           value: 0,
//           formattedValue: 0,
//           formatted: '0',
//           roundedValue: 0,
//           rounded: '0.00',
//           minimized: '0',
//           denomination: ' shares',
//           full: '0 shares'
//         },
//         potentialEthProfit: null,
//         potentialEthLoss: null,
//         potentialLossPercent: null,
//         potentialProfitPercent: null,
//         totalFee: {
//           value: 0,
//           formattedValue: 0,
//           formatted: '',
//           roundedValue: 0,
//           rounded: '',
//           minimized: '',
//           denomination: '',
//           full: ''
//         },
//         gasFeesRealEth: {
//           value: 0,
//           formattedValue: 0,
//           formatted: '',
//           roundedValue: 0,
//           rounded: '',
//           minimized: '',
//           denomination: '',
//           full: ''
//         },
//         totalCost: {
//           value: 0,
//           formattedValue: 0,
//           formatted: '0',
//           roundedValue: 0,
//           rounded: '0.0000',
//           minimized: '0',
//           denomination: ' ETH Tokens',
//           full: '0 ETH Tokens'
//         },
//         tradeTypeOptions: [
//           {
//             label: 'buy',
//             value: 'buy'
//           },
//           {
//             label: 'sell',
//             value: 'sell'
//           }
//         ],
//         tradeSummary: {
//           totalGas: {
//             value: 0,
//             formattedValue: 0,
//             formatted: '0',
//             roundedValue: 0,
//             rounded: '0.0000',
//             minimized: '0',
//             denomination: ' ETH',
//             full: '0 ETH'
//           },
//           tradeOrders: [

//           ]
//         }
//       },
//       orderBook: {
//         bids: [

//         ],
//         asks: [

//         ]
//       },
//       orderBookSeries: {
//         bids: [

//         ],
//         asks: [

//         ]
//       },
//       topBid: null,
//       topAsk: null,
//       position: null,
//       userOpenOrders: [

//       ]
//     },
//     {
//       outstandingShares: '166',
//       price: '0',
//       sharesPurchased: '0',
//       name: 'Los Angeles',
//       id: '3',
//       marketID: '0x284dc8742e7441375adad1e545b685ded6ff3a361a4659c1be11fca2055de6e9',
//       lastPrice: {
//         value: 0,
//         formattedValue: 0,
//         formatted: '0',
//         roundedValue: 0,
//         rounded: '0.0000',
//         minimized: '0',
//         denomination: ' ETH Tokens',
//         full: '0 ETH Tokens'
//       },
//       lastPricePercent: {
//         value: 12.5,
//         formattedValue: 12.5,
//         formatted: '12.5',
//         roundedValue: 12,
//         rounded: '12',
//         minimized: '12.5',
//         denomination: '%',
//         full: '12.5%'
//       },
//       trade: {
//         side: 'buy',
//         numShares: null,
//         limitPrice: null,
//         maxNumShares: {
//           value: 0,
//           formattedValue: 0,
//           formatted: '0',
//           roundedValue: 0,
//           rounded: '0.00',
//           minimized: '0',
//           denomination: ' shares',
//           full: '0 shares'
//         },
//         potentialEthProfit: null,
//         potentialEthLoss: null,
//         potentialLossPercent: null,
//         potentialProfitPercent: null,
//         totalFee: {
//           value: 0,
//           formattedValue: 0,
//           formatted: '',
//           roundedValue: 0,
//           rounded: '',
//           minimized: '',
//           denomination: '',
//           full: ''
//         },
//         gasFeesRealEth: {
//           value: 0,
//           formattedValue: 0,
//           formatted: '',
//           roundedValue: 0,
//           rounded: '',
//           minimized: '',
//           denomination: '',
//           full: ''
//         },
//         totalCost: {
//           value: 0,
//           formattedValue: 0,
//           formatted: '0',
//           roundedValue: 0,
//           rounded: '0.0000',
//           minimized: '0',
//           denomination: ' ETH Tokens',
//           full: '0 ETH Tokens'
//         },
//         tradeTypeOptions: [
//           {
//             label: 'buy',
//             value: 'buy'
//           },
//           {
//             label: 'sell',
//             value: 'sell'
//           }
//         ],
//         tradeSummary: {
//           totalGas: {
//             value: 0,
//             formattedValue: 0,
//             formatted: '0',
//             roundedValue: 0,
//             rounded: '0.0000',
//             minimized: '0',
//             denomination: ' ETH',
//             full: '0 ETH'
//           },
//           tradeOrders: [

//           ]
//         }
//       },
//       orderBook: {
//         bids: [

//         ],
//         asks: [

//         ]
//       },
//       orderBookSeries: {
//         bids: [

//         ],
//         asks: [

//         ]
//       },
//       topBid: null,
//       topAsk: null,
//       position: null,
//       userOpenOrders: [

//       ]
//     },
//     {
//       outstandingShares: '166',
//       price: '0',
//       sharesPurchased: '0',
//       name: 'New York',
//       id: '2',
//       marketID: '0x284dc8742e7441375adad1e545b685ded6ff3a361a4659c1be11fca2055de6e9',
//       lastPrice: {
//         value: 0,
//         formattedValue: 0,
//         formatted: '0',
//         roundedValue: 0,
//         rounded: '0.0000',
//         minimized: '0',
//         denomination: ' ETH Tokens',
//         full: '0 ETH Tokens'
//       },
//       lastPricePercent: {
//         value: 12.5,
//         formattedValue: 12.5,
//         formatted: '12.5',
//         roundedValue: 12,
//         rounded: '12',
//         minimized: '12.5',
//         denomination: '%',
//         full: '12.5%'
//       },
//       trade: {
//         side: 'buy',
//         numShares: null,
//         limitPrice: null,
//         maxNumShares: {
//           value: 0,
//           formattedValue: 0,
//           formatted: '0',
//           roundedValue: 0,
//           rounded: '0.00',
//           minimized: '0',
//           denomination: ' shares',
//           full: '0 shares'
//         },
//         potentialEthProfit: null,
//         potentialEthLoss: null,
//         potentialLossPercent: null,
//         potentialProfitPercent: null,
//         totalFee: {
//           value: 0,
//           formattedValue: 0,
//           formatted: '',
//           roundedValue: 0,
//           rounded: '',
//           minimized: '',
//           denomination: '',
//           full: ''
//         },
//         gasFeesRealEth: {
//           value: 0,
//           formattedValue: 0,
//           formatted: '',
//           roundedValue: 0,
//           rounded: '',
//           minimized: '',
//           denomination: '',
//           full: ''
//         },
//         totalCost: {
//           value: 0,
//           formattedValue: 0,
//           formatted: '0',
//           roundedValue: 0,
//           rounded: '0.0000',
//           minimized: '0',
//           denomination: ' ETH Tokens',
//           full: '0 ETH Tokens'
//         },
//         tradeTypeOptions: [
//           {
//             label: 'buy',
//             value: 'buy'
//           },
//           {
//             label: 'sell',
//             value: 'sell'
//           }
//         ],
//         tradeSummary: {
//           totalGas: {
//             value: 0,
//             formattedValue: 0,
//             formatted: '0',
//             roundedValue: 0,
//             rounded: '0.0000',
//             minimized: '0',
//             denomination: ' ETH',
//             full: '0 ETH'
//           },
//           tradeOrders: [

//           ]
//         }
//       },
//       orderBook: {
//         bids: [

//         ],
//         asks: [

//         ]
//       },
//       orderBookSeries: {
//         bids: [

//         ],
//         asks: [

//         ]
//       },
//       topBid: null,
//       topAsk: null,
//       position: null,
//       userOpenOrders: [

//       ]
//     },
//     {
//       outstandingShares: '166',
//       price: '0',
//       sharesPurchased: '0',
//       name: 'Palo Alto',
//       id: '6',
//       marketID: '0x284dc8742e7441375adad1e545b685ded6ff3a361a4659c1be11fca2055de6e9',
//       lastPrice: {
//         value: 0,
//         formattedValue: 0,
//         formatted: '0',
//         roundedValue: 0,
//         rounded: '0.0000',
//         minimized: '0',
//         denomination: ' ETH Tokens',
//         full: '0 ETH Tokens'
//       },
//       lastPricePercent: {
//         value: 12.5,
//         formattedValue: 12.5,
//         formatted: '12.5',
//         roundedValue: 12,
//         rounded: '12',
//         minimized: '12.5',
//         denomination: '%',
//         full: '12.5%'
//       },
//       trade: {
//         side: 'buy',
//         numShares: null,
//         limitPrice: null,
//         maxNumShares: {
//           value: 0,
//           formattedValue: 0,
//           formatted: '0',
//           roundedValue: 0,
//           rounded: '0.00',
//           minimized: '0',
//           denomination: ' shares',
//           full: '0 shares'
//         },
//         potentialEthProfit: null,
//         potentialEthLoss: null,
//         potentialLossPercent: null,
//         potentialProfitPercent: null,
//         totalFee: {
//           value: 0,
//           formattedValue: 0,
//           formatted: '',
//           roundedValue: 0,
//           rounded: '',
//           minimized: '',
//           denomination: '',
//           full: ''
//         },
//         gasFeesRealEth: {
//           value: 0,
//           formattedValue: 0,
//           formatted: '',
//           roundedValue: 0,
//           rounded: '',
//           minimized: '',
//           denomination: '',
//           full: ''
//         },
//         totalCost: {
//           value: 0,
//           formattedValue: 0,
//           formatted: '0',
//           roundedValue: 0,
//           rounded: '0.0000',
//           minimized: '0',
//           denomination: ' ETH Tokens',
//           full: '0 ETH Tokens'
//         },
//         tradeTypeOptions: [
//           {
//             label: 'buy',
//             value: 'buy'
//           },
//           {
//             label: 'sell',
//             value: 'sell'
//           }
//         ],
//         tradeSummary: {
//           totalGas: {
//             value: 0,
//             formattedValue: 0,
//             formatted: '0',
//             roundedValue: 0,
//             rounded: '0.0000',
//             minimized: '0',
//             denomination: ' ETH',
//             full: '0 ETH'
//           },
//           tradeOrders: [

//           ]
//         }
//       },
//       orderBook: {
//         bids: [

//         ],
//         asks: [

//         ]
//       },
//       orderBookSeries: {
//         bids: [

//         ],
//         asks: [

//         ]
//       },
//       topBid: null,
//       topAsk: null,
//       position: null,
//       userOpenOrders: [

//       ]
//     }
//   ],
//   formattedDescription: 'which_city_will_have_the_highest_median_single-family_home_price_for_september_2017',
//   isBinary: false,
//   isCategorical: true,
//   isScalar: false,
//   isMarketLoading: false,
//   endDateLabel: 'ends',
//   isOpen: true,
//   isFavorite: false,
//   takerFeePercent: {
//     value: 3,
//     formattedValue: 3,
//     formatted: '3.0',
//     roundedValue: 3,
//     rounded: '3',
//     minimized: '3',
//     denomination: '%',
//     full: '3.0%'
//   },
//   makerFeePercent: {
//     value: 0.5,
//     formattedValue: 0.5,
//     formatted: '0.5',
//     roundedValue: 0,
//     rounded: '0',
//     minimized: '0.5',
//     denomination: '%',
//     full: '0.5%'
//   },
//   isRequiredToReportByAccount: false,
//   isPendingReport: false,
//   isReportSubmitted: false,
//   isReported: false,
//   isMissedReport: false,
//   isReportTabVisible: false,
//   isSnitchTabVisible: false,
//   report: {

//   },
//   outstandingShares: {
//     value: 1328,
//     formattedValue: 1328,
//     formatted: '1,328',
//     roundedValue: 1328,
//     rounded: '1,328',
//     minimized: '1,328',
//     denomination: '',
//     full: '1,328'
//   },
//   priceTimeSeries: [

//   ],
//   reportableOutcomes: [
//     {
//       outstandingShares: '166',
//       price: '0.5625',
//       sharesPurchased: '0',
//       name: 'Hong Kong',
//       id: '7',
//       marketID: '0x284dc8742e7441375adad1e545b685ded6ff3a361a4659c1be11fca2055de6e9',
//       lastPrice: {
//         value: 0.5625,
//         formattedValue: 0.5625,
//         formatted: '0.5625',
//         roundedValue: 0.5625,
//         rounded: '0.5625',
//         minimized: '0.5625',
//         denomination: ' ETH Tokens',
//         full: '0.5625 ETH Tokens'
//       },
//       lastPricePercent: {
//         value: 56.25,
//         formattedValue: 56.2,
//         formatted: '56.2',
//         roundedValue: 56,
//         rounded: '56',
//         minimized: '56.2',
//         denomination: '%',
//         full: '56.2%'
//       },
//       trade: {
//         side: 'buy',
//         numShares: null,
//         limitPrice: null,
//         maxNumShares: {
//           value: 0,
//           formattedValue: 0,
//           formatted: '0',
//           roundedValue: 0,
//           rounded: '0.00',
//           minimized: '0',
//           denomination: ' shares',
//           full: '0 shares'
//         },
//         potentialEthProfit: null,
//         potentialEthLoss: null,
//         potentialLossPercent: null,
//         potentialProfitPercent: null,
//         totalFee: {
//           value: 0,
//           formattedValue: 0,
//           formatted: '',
//           roundedValue: 0,
//           rounded: '',
//           minimized: '',
//           denomination: '',
//           full: ''
//         },
//         gasFeesRealEth: {
//           value: 0,
//           formattedValue: 0,
//           formatted: '',
//           roundedValue: 0,
//           rounded: '',
//           minimized: '',
//           denomination: '',
//           full: ''
//         },
//         totalCost: {
//           value: 0,
//           formattedValue: 0,
//           formatted: '0',
//           roundedValue: 0,
//           rounded: '0.0000',
//           minimized: '0',
//           denomination: ' ETH Tokens',
//           full: '0 ETH Tokens'
//         },
//         tradeTypeOptions: [
//           {
//             label: 'buy',
//             value: 'buy'
//           },
//           {
//             label: 'sell',
//             value: 'sell'
//           }
//         ],
//         tradeSummary: {
//           totalGas: {
//             value: 0,
//             formattedValue: 0,
//             formatted: '0',
//             roundedValue: 0,
//             rounded: '0.0000',
//             minimized: '0',
//             denomination: ' ETH',
//             full: '0 ETH'
//           },
//           tradeOrders: [

//           ]
//         }
//       },
//       orderBook: {
//         bids: [

//         ],
//         asks: [

//         ]
//       },
//       orderBookSeries: {
//         bids: [

//         ],
//         asks: [

//         ]
//       },
//       topBid: null,
//       topAsk: null,
//       position: null,
//       userOpenOrders: [

//       ]
//     },
//     {
//       outstandingShares: '166',
//       price: '0.225',
//       sharesPurchased: '0',
//       name: 'Tokyo',
//       id: '5',
//       marketID: '0x284dc8742e7441375adad1e545b685ded6ff3a361a4659c1be11fca2055de6e9',
//       lastPrice: {
//         value: 0.225,
//         formattedValue: 0.225,
//         formatted: '0.2250',
//         roundedValue: 0.225,
//         rounded: '0.2250',
//         minimized: '0.225',
//         denomination: ' ETH Tokens',
//         full: '0.2250 ETH Tokens'
//       },
//       lastPricePercent: {
//         value: 22.5,
//         formattedValue: 22.5,
//         formatted: '22.5',
//         roundedValue: 22,
//         rounded: '22',
//         minimized: '22.5',
//         denomination: '%',
//         full: '22.5%'
//       },
//       trade: {
//         side: 'buy',
//         numShares: null,
//         limitPrice: null,
//         maxNumShares: {
//           value: 0,
//           formattedValue: 0,
//           formatted: '0',
//           roundedValue: 0,
//           rounded: '0.00',
//           minimized: '0',
//           denomination: ' shares',
//           full: '0 shares'
//         },
//         potentialEthProfit: null,
//         potentialEthLoss: null,
//         potentialLossPercent: null,
//         potentialProfitPercent: null,
//         totalFee: {
//           value: 0,
//           formattedValue: 0,
//           formatted: '',
//           roundedValue: 0,
//           rounded: '',
//           minimized: '',
//           denomination: '',
//           full: ''
//         },
//         gasFeesRealEth: {
//           value: 0,
//           formattedValue: 0,
//           formatted: '',
//           roundedValue: 0,
//           rounded: '',
//           minimized: '',
//           denomination: '',
//           full: ''
//         },
//         totalCost: {
//           value: 0,
//           formattedValue: 0,
//           formatted: '0',
//           roundedValue: 0,
//           rounded: '0.0000',
//           minimized: '0',
//           denomination: ' ETH Tokens',
//           full: '0 ETH Tokens'
//         },
//         tradeTypeOptions: [
//           {
//             label: 'buy',
//             value: 'buy'
//           },
//           {
//             label: 'sell',
//             value: 'sell'
//           }
//         ],
//         tradeSummary: {
//           totalGas: {
//             value: 0,
//             formattedValue: 0,
//             formatted: '0',
//             roundedValue: 0,
//             rounded: '0.0000',
//             minimized: '0',
//             denomination: ' ETH',
//             full: '0 ETH'
//           },
//           tradeOrders: [

//           ]
//         }
//       },
//       orderBook: {
//         bids: [

//         ],
//         asks: [

//         ]
//       },
//       orderBookSeries: {
//         bids: [

//         ],
//         asks: [

//         ]
//       },
//       topBid: null,
//       topAsk: null,
//       position: null,
//       userOpenOrders: [

//       ]
//     },
//     {
//       outstandingShares: '166',
//       price: '0.225',
//       sharesPurchased: '0',
//       name: 'other',
//       id: '8',
//       marketID: '0x284dc8742e7441375adad1e545b685ded6ff3a361a4659c1be11fca2055de6e9',
//       lastPrice: {
//         value: 0.225,
//         formattedValue: 0.225,
//         formatted: '0.2250',
//         roundedValue: 0.225,
//         rounded: '0.2250',
//         minimized: '0.225',
//         denomination: ' ETH Tokens',
//         full: '0.2250 ETH Tokens'
//       },
//       lastPricePercent: {
//         value: 22.5,
//         formattedValue: 22.5,
//         formatted: '22.5',
//         roundedValue: 22,
//         rounded: '22',
//         minimized: '22.5',
//         denomination: '%',
//         full: '22.5%'
//       },
//       trade: {
//         side: 'buy',
//         numShares: null,
//         limitPrice: null,
//         maxNumShares: {
//           value: 0,
//           formattedValue: 0,
//           formatted: '0',
//           roundedValue: 0,
//           rounded: '0.00',
//           minimized: '0',
//           denomination: ' shares',
//           full: '0 shares'
//         },
//         potentialEthProfit: null,
//         potentialEthLoss: null,
//         potentialLossPercent: null,
//         potentialProfitPercent: null,
//         totalFee: {
//           value: 0,
//           formattedValue: 0,
//           formatted: '',
//           roundedValue: 0,
//           rounded: '',
//           minimized: '',
//           denomination: '',
//           full: ''
//         },
//         gasFeesRealEth: {
//           value: 0,
//           formattedValue: 0,
//           formatted: '',
//           roundedValue: 0,
//           rounded: '',
//           minimized: '',
//           denomination: '',
//           full: ''
//         },
//         totalCost: {
//           value: 0,
//           formattedValue: 0,
//           formatted: '0',
//           roundedValue: 0,
//           rounded: '0.0000',
//           minimized: '0',
//           denomination: ' ETH Tokens',
//           full: '0 ETH Tokens'
//         },
//         tradeTypeOptions: [
//           {
//             label: 'buy',
//             value: 'buy'
//           },
//           {
//             label: 'sell',
//             value: 'sell'
//           }
//         ],
//         tradeSummary: {
//           totalGas: {
//             value: 0,
//             formattedValue: 0,
//             formatted: '0',
//             roundedValue: 0,
//             rounded: '0.0000',
//             minimized: '0',
//             denomination: ' ETH',
//             full: '0 ETH'
//           },
//           tradeOrders: [

//           ]
//         }
//       },
//       orderBook: {
//         bids: [

//         ],
//         asks: [

//         ]
//       },
//       orderBookSeries: {
//         bids: [

//         ],
//         asks: [

//         ]
//       },
//       topBid: null,
//       topAsk: null,
//       position: null,
//       userOpenOrders: [

//       ]
//     },
//     {
//       outstandingShares: '166',
//       price: '0.025',
//       sharesPurchased: '0',
//       name: 'San Francisco',
//       id: '4',
//       marketID: '0x284dc8742e7441375adad1e545b685ded6ff3a361a4659c1be11fca2055de6e9',
//       lastPrice: {
//         value: 0.025,
//         formattedValue: 0.025,
//         formatted: '0.0250',
//         roundedValue: 0.025,
//         rounded: '0.0250',
//         minimized: '0.025',
//         denomination: ' ETH Tokens',
//         full: '0.0250 ETH Tokens'
//       },
//       lastPricePercent: {
//         value: 2.5,
//         formattedValue: 2.5,
//         formatted: '2.5',
//         roundedValue: 2,
//         rounded: '2',
//         minimized: '2.5',
//         denomination: '%',
//         full: '2.5%'
//       },
//       trade: {
//         side: 'buy',
//         numShares: null,
//         limitPrice: null,
//         maxNumShares: {
//           value: 0,
//           formattedValue: 0,
//           formatted: '0',
//           roundedValue: 0,
//           rounded: '0.00',
//           minimized: '0',
//           denomination: ' shares',
//           full: '0 shares'
//         },
//         potentialEthProfit: null,
//         potentialEthLoss: null,
//         potentialLossPercent: null,
//         potentialProfitPercent: null,
//         totalFee: {
//           value: 0,
//           formattedValue: 0,
//           formatted: '',
//           roundedValue: 0,
//           rounded: '',
//           minimized: '',
//           denomination: '',
//           full: ''
//         },
//         gasFeesRealEth: {
//           value: 0,
//           formattedValue: 0,
//           formatted: '',
//           roundedValue: 0,
//           rounded: '',
//           minimized: '',
//           denomination: '',
//           full: ''
//         },
//         totalCost: {
//           value: 0,
//           formattedValue: 0,
//           formatted: '0',
//           roundedValue: 0,
//           rounded: '0.0000',
//           minimized: '0',
//           denomination: ' ETH Tokens',
//           full: '0 ETH Tokens'
//         },
//         tradeTypeOptions: [
//           {
//             label: 'buy',
//             value: 'buy'
//           },
//           {
//             label: 'sell',
//             value: 'sell'
//           }
//         ],
//         tradeSummary: {
//           totalGas: {
//             value: 0,
//             formattedValue: 0,
//             formatted: '0',
//             roundedValue: 0,
//             rounded: '0.0000',
//             minimized: '0',
//             denomination: ' ETH',
//             full: '0 ETH'
//           },
//           tradeOrders: [

//           ]
//         }
//       },
//       orderBook: {
//         bids: [

//         ],
//         asks: [

//         ]
//       },
//       orderBookSeries: {
//         bids: [

//         ],
//         asks: [

//         ]
//       },
//       topBid: null,
//       topAsk: null,
//       position: null,
//       userOpenOrders: [

//       ]
//     },
//     {
//       outstandingShares: '166',
//       price: '0',
//       sharesPurchased: '0',
//       name: 'London',
//       id: '1',
//       marketID: '0x284dc8742e7441375adad1e545b685ded6ff3a361a4659c1be11fca2055de6e9',
//       lastPrice: {
//         value: 0,
//         formattedValue: 0,
//         formatted: '0',
//         roundedValue: 0,
//         rounded: '0.0000',
//         minimized: '0',
//         denomination: ' ETH Tokens',
//         full: '0 ETH Tokens'
//       },
//       lastPricePercent: {
//         value: 12.5,
//         formattedValue: 12.5,
//         formatted: '12.5',
//         roundedValue: 12,
//         rounded: '12',
//         minimized: '12.5',
//         denomination: '%',
//         full: '12.5%'
//       },
//       trade: {
//         side: 'buy',
//         numShares: null,
//         limitPrice: null,
//         maxNumShares: {
//           value: 0,
//           formattedValue: 0,
//           formatted: '0',
//           roundedValue: 0,
//           rounded: '0.00',
//           minimized: '0',
//           denomination: ' shares',
//           full: '0 shares'
//         },
//         potentialEthProfit: null,
//         potentialEthLoss: null,
//         potentialLossPercent: null,
//         potentialProfitPercent: null,
//         totalFee: {
//           value: 0,
//           formattedValue: 0,
//           formatted: '',
//           roundedValue: 0,
//           rounded: '',
//           minimized: '',
//           denomination: '',
//           full: ''
//         },
//         gasFeesRealEth: {
//           value: 0,
//           formattedValue: 0,
//           formatted: '',
//           roundedValue: 0,
//           rounded: '',
//           minimized: '',
//           denomination: '',
//           full: ''
//         },
//         totalCost: {
//           value: 0,
//           formattedValue: 0,
//           formatted: '0',
//           roundedValue: 0,
//           rounded: '0.0000',
//           minimized: '0',
//           denomination: ' ETH Tokens',
//           full: '0 ETH Tokens'
//         },
//         tradeTypeOptions: [
//           {
//             label: 'buy',
//             value: 'buy'
//           },
//           {
//             label: 'sell',
//             value: 'sell'
//           }
//         ],
//         tradeSummary: {
//           totalGas: {
//             value: 0,
//             formattedValue: 0,
//             formatted: '0',
//             roundedValue: 0,
//             rounded: '0.0000',
//             minimized: '0',
//             denomination: ' ETH',
//             full: '0 ETH'
//           },
//           tradeOrders: [

//           ]
//         }
//       },
//       orderBook: {
//         bids: [

//         ],
//         asks: [

//         ]
//       },
//       orderBookSeries: {
//         bids: [

//         ],
//         asks: [

//         ]
//       },
//       topBid: null,
//       topAsk: null,
//       position: null,
//       userOpenOrders: [

//       ]
//     },
//     {
//       outstandingShares: '166',
//       price: '0',
//       sharesPurchased: '0',
//       name: 'Los Angeles',
//       id: '3',
//       marketID: '0x284dc8742e7441375adad1e545b685ded6ff3a361a4659c1be11fca2055de6e9',
//       lastPrice: {
//         value: 0,
//         formattedValue: 0,
//         formatted: '0',
//         roundedValue: 0,
//         rounded: '0.0000',
//         minimized: '0',
//         denomination: ' ETH Tokens',
//         full: '0 ETH Tokens'
//       },
//       lastPricePercent: {
//         value: 12.5,
//         formattedValue: 12.5,
//         formatted: '12.5',
//         roundedValue: 12,
//         rounded: '12',
//         minimized: '12.5',
//         denomination: '%',
//         full: '12.5%'
//       },
//       trade: {
//         side: 'buy',
//         numShares: null,
//         limitPrice: null,
//         maxNumShares: {
//           value: 0,
//           formattedValue: 0,
//           formatted: '0',
//           roundedValue: 0,
//           rounded: '0.00',
//           minimized: '0',
//           denomination: ' shares',
//           full: '0 shares'
//         },
//         potentialEthProfit: null,
//         potentialEthLoss: null,
//         potentialLossPercent: null,
//         potentialProfitPercent: null,
//         totalFee: {
//           value: 0,
//           formattedValue: 0,
//           formatted: '',
//           roundedValue: 0,
//           rounded: '',
//           minimized: '',
//           denomination: '',
//           full: ''
//         },
//         gasFeesRealEth: {
//           value: 0,
//           formattedValue: 0,
//           formatted: '',
//           roundedValue: 0,
//           rounded: '',
//           minimized: '',
//           denomination: '',
//           full: ''
//         },
//         totalCost: {
//           value: 0,
//           formattedValue: 0,
//           formatted: '0',
//           roundedValue: 0,
//           rounded: '0.0000',
//           minimized: '0',
//           denomination: ' ETH Tokens',
//           full: '0 ETH Tokens'
//         },
//         tradeTypeOptions: [
//           {
//             label: 'buy',
//             value: 'buy'
//           },
//           {
//             label: 'sell',
//             value: 'sell'
//           }
//         ],
//         tradeSummary: {
//           totalGas: {
//             value: 0,
//             formattedValue: 0,
//             formatted: '0',
//             roundedValue: 0,
//             rounded: '0.0000',
//             minimized: '0',
//             denomination: ' ETH',
//             full: '0 ETH'
//           },
//           tradeOrders: [

//           ]
//         }
//       },
//       orderBook: {
//         bids: [

//         ],
//         asks: [

//         ]
//       },
//       orderBookSeries: {
//         bids: [

//         ],
//         asks: [

//         ]
//       },
//       topBid: null,
//       topAsk: null,
//       position: null,
//       userOpenOrders: [

//       ]
//     },
//     {
//       outstandingShares: '166',
//       price: '0',
//       sharesPurchased: '0',
//       name: 'New York',
//       id: '2',
//       marketID: '0x284dc8742e7441375adad1e545b685ded6ff3a361a4659c1be11fca2055de6e9',
//       lastPrice: {
//         value: 0,
//         formattedValue: 0,
//         formatted: '0',
//         roundedValue: 0,
//         rounded: '0.0000',
//         minimized: '0',
//         denomination: ' ETH Tokens',
//         full: '0 ETH Tokens'
//       },
//       lastPricePercent: {
//         value: 12.5,
//         formattedValue: 12.5,
//         formatted: '12.5',
//         roundedValue: 12,
//         rounded: '12',
//         minimized: '12.5',
//         denomination: '%',
//         full: '12.5%'
//       },
//       trade: {
//         side: 'buy',
//         numShares: null,
//         limitPrice: null,
//         maxNumShares: {
//           value: 0,
//           formattedValue: 0,
//           formatted: '0',
//           roundedValue: 0,
//           rounded: '0.00',
//           minimized: '0',
//           denomination: ' shares',
//           full: '0 shares'
//         },
//         potentialEthProfit: null,
//         potentialEthLoss: null,
//         potentialLossPercent: null,
//         potentialProfitPercent: null,
//         totalFee: {
//           value: 0,
//           formattedValue: 0,
//           formatted: '',
//           roundedValue: 0,
//           rounded: '',
//           minimized: '',
//           denomination: '',
//           full: ''
//         },
//         gasFeesRealEth: {
//           value: 0,
//           formattedValue: 0,
//           formatted: '',
//           roundedValue: 0,
//           rounded: '',
//           minimized: '',
//           denomination: '',
//           full: ''
//         },
//         totalCost: {
//           value: 0,
//           formattedValue: 0,
//           formatted: '0',
//           roundedValue: 0,
//           rounded: '0.0000',
//           minimized: '0',
//           denomination: ' ETH Tokens',
//           full: '0 ETH Tokens'
//         },
//         tradeTypeOptions: [
//           {
//             label: 'buy',
//             value: 'buy'
//           },
//           {
//             label: 'sell',
//             value: 'sell'
//           }
//         ],
//         tradeSummary: {
//           totalGas: {
//             value: 0,
//             formattedValue: 0,
//             formatted: '0',
//             roundedValue: 0,
//             rounded: '0.0000',
//             minimized: '0',
//             denomination: ' ETH',
//             full: '0 ETH'
//           },
//           tradeOrders: [

//           ]
//         }
//       },
//       orderBook: {
//         bids: [

//         ],
//         asks: [

//         ]
//       },
//       orderBookSeries: {
//         bids: [

//         ],
//         asks: [

//         ]
//       },
//       topBid: null,
//       topAsk: null,
//       position: null,
//       userOpenOrders: [

//       ]
//     },
//     {
//       outstandingShares: '166',
//       price: '0',
//       sharesPurchased: '0',
//       name: 'Palo Alto',
//       id: '6',
//       marketID: '0x284dc8742e7441375adad1e545b685ded6ff3a361a4659c1be11fca2055de6e9',
//       lastPrice: {
//         value: 0,
//         formattedValue: 0,
//         formatted: '0',
//         roundedValue: 0,
//         rounded: '0.0000',
//         minimized: '0',
//         denomination: ' ETH Tokens',
//         full: '0 ETH Tokens'
//       },
//       lastPricePercent: {
//         value: 12.5,
//         formattedValue: 12.5,
//         formatted: '12.5',
//         roundedValue: 12,
//         rounded: '12',
//         minimized: '12.5',
//         denomination: '%',
//         full: '12.5%'
//       },
//       trade: {
//         side: 'buy',
//         numShares: null,
//         limitPrice: null,
//         maxNumShares: {
//           value: 0,
//           formattedValue: 0,
//           formatted: '0',
//           roundedValue: 0,
//           rounded: '0.00',
//           minimized: '0',
//           denomination: ' shares',
//           full: '0 shares'
//         },
//         potentialEthProfit: null,
//         potentialEthLoss: null,
//         potentialLossPercent: null,
//         potentialProfitPercent: null,
//         totalFee: {
//           value: 0,
//           formattedValue: 0,
//           formatted: '',
//           roundedValue: 0,
//           rounded: '',
//           minimized: '',
//           denomination: '',
//           full: ''
//         },
//         gasFeesRealEth: {
//           value: 0,
//           formattedValue: 0,
//           formatted: '',
//           roundedValue: 0,
//           rounded: '',
//           minimized: '',
//           denomination: '',
//           full: ''
//         },
//         totalCost: {
//           value: 0,
//           formattedValue: 0,
//           formatted: '0',
//           roundedValue: 0,
//           rounded: '0.0000',
//           minimized: '0',
//           denomination: ' ETH Tokens',
//           full: '0 ETH Tokens'
//         },
//         tradeTypeOptions: [
//           {
//             label: 'buy',
//             value: 'buy'
//           },
//           {
//             label: 'sell',
//             value: 'sell'
//           }
//         ],
//         tradeSummary: {
//           totalGas: {
//             value: 0,
//             formattedValue: 0,
//             formatted: '0',
//             roundedValue: 0,
//             rounded: '0.0000',
//             minimized: '0',
//             denomination: ' ETH',
//             full: '0 ETH'
//           },
//           tradeOrders: [

//           ]
//         }
//       },
//       orderBook: {
//         bids: [

//         ],
//         asks: [

//         ]
//       },
//       orderBookSeries: {
//         bids: [

//         ],
//         asks: [

//         ]
//       },
//       topBid: null,
//       topAsk: null,
//       position: null,
//       userOpenOrders: [

//       ]
//     },
//     {
//       id: '0.5',
//       name: 'Indeterminate'
//     }
//   ],
//   userOpenOrdersSummary: null,
//   tradeSummary: {
//     totalGas: {
//       value: 0,
//       formattedValue: 0,
//       formatted: '0',
//       roundedValue: 0,
//       rounded: '0.0000',
//       minimized: '0',
//       denomination: ' ETH',
//       full: '0 ETH'
//     },
//     tradeOrders: [

//     ],
//     hasUserEnoughFunds: false
//   },
//   isLogged: false,
//   shareDenominations: [
//     {
//       label: 'Shares',
//       value: 'share'
//     },
//     {
//       label: 'mShares',
//       value: 'milli-share'
//     },
//     {
//       label: 'μShares',
//       value: 'micro-share'
//     }
//   ]
// }
