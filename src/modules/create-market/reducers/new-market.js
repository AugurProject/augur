import {
  ADD_VALIDATION_TO_NEW_MARKET,
  REMOVE_VALIDATION_FROM_NEW_MARKET,
  ADD_ORDER_TO_NEW_MARKET,
  REMOVE_ORDER_FROM_NEW_MARKET,
  UPDATE_NEW_MARKET,
  CLEAR_NEW_MARKET
} from 'modules/create-market/actions/update-new-market'

import { TAKER_FEE_DEFAULT, MAKER_FEE_DEFAULT } from 'modules/create-market/constants/new-market-constraints'

import BigNumber from 'bignumber.js'

const DEFAULT_STATE = {
  isValid: false,
  holdForUserAction: false,
  validations: [
    {
      description: false,
      category: false,
      tag1: false,
      tag2: false,
    },
    {
      type: false,
    },
    {
      expirySourceType: false,
      endDate: false,
      hour: false,
      minute: false,
      meridiem: false,
    }
  ],
  currentStep: 0,
  type: '',
  outcomes: Array(8).fill(''),
  scalarSmallNum: '',
  scalarBigNum: '',
  description: '',
  expirySourceType: '',
  expirySource: '',
  endDate: {},
  hour: '',
  minute: '',
  meridiem: '',
  detailsText: '',
  category: '',
  tag1: '',
  tag2: '',
  takerFee: TAKER_FEE_DEFAULT,
  makerFee: MAKER_FEE_DEFAULT,
  orderBook: {}, // for submit orders
  orderBookSorted: {}, // for order book table
  orderBookSeries: {}, // for order book chart
  initialLiquidityEth: new BigNumber(0),
  initialLiquidityGas: new BigNumber(0),
  initialLiquidityFees: new BigNumber(0),
  creationError: 'Unable to create market.  Ensure your market is unique and all values are valid.'
}

export default function (newMarket = DEFAULT_STATE, action) {
  switch (action.type) {
    case ADD_VALIDATION_TO_NEW_MARKET: {
      if (newMarket.validations.indexOf(action.data) === -1) {
        return {
          ...newMarket,
          validations: [
            ...newMarket.validations,
            action.data
          ]
        }
      }
      return newMarket
    }
    case REMOVE_VALIDATION_FROM_NEW_MARKET: {
      if (newMarket.validations.indexOf(action.data) !== -1) {
        return {
          ...newMarket,
          validations: [
            ...newMarket.validations.slice(0, newMarket.validations.indexOf(action.data)),
            ...newMarket.validations.slice(newMarket.validations.indexOf(action.data) + 1)
          ]
        }
      }
      return newMarket
    }
    case ADD_ORDER_TO_NEW_MARKET: {
      const existingOrders = newMarket.orderBook[action.data.outcome] || []

      return {
        ...newMarket,
        orderBook: {
          ...newMarket.orderBook,
          [action.data.outcome]: [
            ...existingOrders,
            { type: action.data.type, price: action.data.price, quantity: action.data.quantity }
          ]
        }
      }
    }
    case REMOVE_ORDER_FROM_NEW_MARKET: {
      const updatedOutcome = [
        ...newMarket.orderBook[action.data.outcome].slice(0, action.data.index),
        ...newMarket.orderBook[action.data.outcome].slice(action.data.index + 1)
      ]

      return {
        ...newMarket,
        orderBook: {
          ...newMarket.orderBook,
          [action.data.outcome]: updatedOutcome
        }
      }
    }
    case UPDATE_NEW_MARKET:
      return {
        ...newMarket,
        ...action.data
      }
    case CLEAR_NEW_MARKET:
      return DEFAULT_STATE
    default:
      return newMarket
  }
}
