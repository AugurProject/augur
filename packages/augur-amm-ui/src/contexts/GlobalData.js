import React, { createContext, useContext, useReducer, useMemo, useCallback, useEffect } from 'react'
import { client } from '../apollo/client'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { useConfig, getNetworkId } from './Application'
import {
  getPercentChange,
  getBlockFromTimestamp,
} from '../utils'
import {
  ETH_PRICE,
} from '../apollo/queries'
import weekOfYear from 'dayjs/plugin/weekOfYear'
const UPDATE = 'UPDATE'
const UPDATE_TXNS = 'UPDATE_TXNS'
const UPDATE_CHART = 'UPDATE_CHART'
const UPDATE_ETH_PRICE = 'UPDATE_ETH_PRICE'
const ETH_PRICE_KEY = 'ETH_PRICE_KEY'
const UPDATE_ALL_PAIRS_IN_UNISWAP = 'UPDAUPDATE_ALL_PAIRS_IN_UNISWAPTE_TOP_PAIRS'
const UPDATE_ALL_TOKENS_IN_UNISWAP = 'UPDATE_ALL_TOKENS_IN_UNISWAP'
const UPDATE_TOP_LPS = 'UPDATE_TOP_LPS'

// format dayjs with the libraries that we need
dayjs.extend(utc)
dayjs.extend(weekOfYear)

const GlobalDataContext = createContext()

function useGlobalDataContext() {
  return useContext(GlobalDataContext)
}

function reducer(state, { type, payload }) {
  switch (type) {
    case UPDATE: {
      const { data } = payload
      return {
        ...state,
        globalData: data
      }
    }
    case UPDATE_TXNS: {
      const { transactions } = payload
      return {
        ...state,
        transactions
      }
    }
    case UPDATE_CHART: {
      const { daily, weekly } = payload
      return {
        ...state,
        chartData: {
          daily,
          weekly
        }
      }
    }
    case UPDATE_ETH_PRICE: {
      const { ethPrice, oneDayPrice, ethPriceChange } = payload
      return {
        [ETH_PRICE_KEY]: ethPrice,
        oneDayPrice,
        ethPriceChange
      }
    }

    case UPDATE_ALL_PAIRS_IN_UNISWAP: {
      const { allPairs } = payload
      return {
        ...state,
        allPairs
      }
    }

    case UPDATE_ALL_TOKENS_IN_UNISWAP: {
      const { allTokens } = payload
      return {
        ...state,
        allTokens
      }
    }

    case UPDATE_TOP_LPS: {
      const { topLps } = payload
      return {
        ...state,
        topLps
      }
    }
    default: {
      throw Error(`Unexpected action type in DataContext reducer: '${type}'.`)
    }
  }
}

export default function Provider({ children }) {
  const [state, dispatch] = useReducer(reducer, {})
  const update = useCallback(data => {
    dispatch({
      type: UPDATE,
      payload: {
        data
      }
    })
  }, [])

  const updateTransactions = useCallback(transactions => {
    dispatch({
      type: UPDATE_TXNS,
      payload: {
        transactions
      }
    })
  }, [])

  const updateChart = useCallback((daily, weekly) => {
    dispatch({
      type: UPDATE_CHART,
      payload: {
        daily,
        weekly
      }
    })
  }, [])

  const updateEthPrice = useCallback((ethPrice, oneDayPrice, ethPriceChange) => {
    dispatch({
      type: UPDATE_ETH_PRICE,
      payload: {
        ethPrice,
        oneDayPrice,
        ethPriceChange
      }
    })
  }, [])

  const updateAllPairsInUniswap = useCallback(allPairs => {
    dispatch({
      type: UPDATE_ALL_PAIRS_IN_UNISWAP,
      payload: {
        allPairs
      }
    })
  }, [])

  const updateAllTokensInUniswap = useCallback(allTokens => {
    dispatch({
      type: UPDATE_ALL_TOKENS_IN_UNISWAP,
      payload: {
        allTokens
      }
    })
  }, [])

  const updateTopLps = useCallback(topLps => {
    dispatch({
      type: UPDATE_TOP_LPS,
      payload: {
        topLps
      }
    })
  }, [])
  return (
    <GlobalDataContext.Provider
      value={useMemo(
        () => [
          state,
          {
            update,
            updateTransactions,
            updateChart,
            updateEthPrice,
            updateTopLps,
            updateAllPairsInUniswap,
            updateAllTokensInUniswap
          }
        ],
        [
          state,
          update,
          updateTransactions,
          updateTopLps,
          updateChart,
          updateEthPrice,
          updateAllPairsInUniswap,
          updateAllTokensInUniswap
        ]
      )}
    >
      {children}
    </GlobalDataContext.Provider>
  )
}

const TESTNET_ETH_PRICE  = '400'

const getEthPrice = async (url) => {
  const networkId = getNetworkId()
  const utcCurrentTime = dayjs()
  const utcOneDayBack = utcCurrentTime
    .subtract(1, 'day')
    .startOf('minute')
    .unix()

  let ethPrice = 0
  let ethPriceOneDay = 0
  let priceChangeETH = 0

  try {
    let oneDayBlock = await getBlockFromTimestamp(utcOneDayBack, url)
    let result = await client.query({
      query: ETH_PRICE(networkId),
      fetchPolicy: 'cache-first'
    })
    let resultOneDay = await client.query({
      query: ETH_PRICE(networkId, oneDayBlock),
      fetchPolicy: 'cache-first'
    })
    const currentPrice = result?.data?.bundles[0]?.ethPrice
    const oneDayBackPrice = resultOneDay?.data?.bundles[0]?.ethPrice
    priceChangeETH = getPercentChange(currentPrice, oneDayBackPrice)
    ethPrice = currentPrice
    ethPriceOneDay = oneDayBackPrice

  } catch (e) {
    console.error(e)
    ethPrice = TESTNET_ETH_PRICE
    ethPriceOneDay = TESTNET_ETH_PRICE
    console.error(`going to default eth price to ${ethPrice} just for testing`)
  }

  return [ethPrice, ethPriceOneDay, priceChangeETH]
}

export function useEthPrice() {
  const [state, { updateEthPrice }] = useGlobalDataContext()
  const config = useConfig()
  const ethPrice = state?.[ETH_PRICE_KEY]
  const ethPriceOld = state?.['oneDayPrice']
  useEffect(() => {
    async function checkForEthPrice() {
      if (!ethPrice) {
        let [newPrice, oneDayPrice, priceChange] = await getEthPrice(config.blockClient)
        updateEthPrice(newPrice, oneDayPrice, priceChange)
      }
    }
    checkForEthPrice()
  }, [ethPrice, updateEthPrice])

  return [ethPrice, ethPriceOld]
}

export function useAllTokensInUniswap() {
  const [state] = useGlobalDataContext()
  let allTokens = state?.allTokens

  return allTokens || []
}

