import React, { createContext, useContext, useReducer, useMemo, useCallback, useEffect } from 'react'

import { client } from '../apollo/client'
import {
  CASH_TOKEN_DATA,
  TOKEN_DATA,
  FILTERED_TRANSACTIONS,
  TOKEN_CHART,
  TOKENS_CURRENT,
  TOKENS_DYNAMIC,
  PRICES_BY_BLOCK
} from '../apollo/queries'

import { useEthPrice } from './GlobalData'

import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'

import {
  get2DayPercentChange,
  getPercentChange,
  getBlockFromTimestamp,
  isAddress,
  getBlocksFromTimestamps,
  splitQuery
} from '../utils'
import { timeframeOptions } from '../constants'
import { useLatestBlock, getCashInfo } from './Application'
import { useMarket, useAllMarketCashes } from './Markets'

const UPDATE = 'UPDATE'
const UPDATE_TOKEN_TXNS = 'UPDATE_TOKEN_TXNS'
const UPDATE_CHART_DATA = 'UPDATE_CHART_DATA'
const UPDATE_PRICE_DATA = 'UPDATE_PRICE_DATA'
const UPDATE_TOP_TOKENS = ' UPDATE_TOP_TOKENS'
const UPDATE_ALL_PAIRS = 'UPDATE_ALL_PAIRS'
const UPDATE_CASH_USDT = 'UPDATE_CASH_USDT'

const TOKEN_PAIRS_KEY = 'TOKEN_PAIRS_KEY'
const CASH_USDT_PAIRS = 'CASH_USDT_PAIRS'

dayjs.extend(utc)

const TokenDataContext = createContext()

function useTokenDataContext() {
  return useContext(TokenDataContext)
}

function reducer(state, { type, payload }) {
  switch (type) {
    case UPDATE: {
      const { tokenAddress, data } = payload
      return {
        ...state,
        [tokenAddress]: {
          ...state?.[tokenAddress],
          ...data
        }
      }
    }
    case UPDATE_TOP_TOKENS: {
      const { topTokens } = payload
      let added = {}
      topTokens &&
        topTokens.map(token => {
          return (added[token.id] = token)
        })

      return {
        ...state,
        ...added
      }
    }

    case UPDATE_TOKEN_TXNS: {
      const { address, transactions } = payload
      return {
        ...state,
        [address]: {
          ...state?.[address],
          txns: transactions
        }
      }
    }
    case UPDATE_CHART_DATA: {
      const { address, chartData } = payload
      return {
        ...state,
        [address]: {
          ...state?.[address],
          chartData
        }
      }
    }

    case UPDATE_PRICE_DATA: {
      const { address, data, timeWindow, interval } = payload
      return {
        ...state,
        [address]: {
          ...state?.[address],
          [timeWindow]: {
            ...state?.[address]?.[timeWindow],
            [interval]: data
          }
        }
      }
    }

    case UPDATE_ALL_PAIRS: {
      const { address, allPairs } = payload
      return {
        ...state,
        [address]: {
          ...state?.[address],
          [TOKEN_PAIRS_KEY]: allPairs
        }
      }
    }

    case UPDATE_CASH_USDT: {
      const { cashes } = payload
      let addedCashes = {}
      cashes &&
        cashes.map(token => {
          return (addedCashes[token.id] = token)
        })

      return {
        ...state,
        [CASH_USDT_PAIRS]: addedCashes
      }
    }

    default: {
      throw Error(`Unexpected action type in DataContext reducer: '${type}'.`)
    }
  }
}

export default function Provider({ children }) {
  const [state, dispatch] = useReducer(reducer, {})
  const update = useCallback((tokenAddress, data) => {
    dispatch({
      type: UPDATE,
      payload: {
        tokenAddress,
        data
      }
    })
  }, [])

  const updateTopTokens = useCallback(topTokens => {
    dispatch({
      type: UPDATE_TOP_TOKENS,
      payload: {
        topTokens
      }
    })
  }, [])

  const updateTokenTxns = useCallback((address, transactions) => {
    dispatch({
      type: UPDATE_TOKEN_TXNS,
      payload: { address, transactions }
    })
  }, [])

  const updateChartData = useCallback((address, chartData) => {
    dispatch({
      type: UPDATE_CHART_DATA,
      payload: { address, chartData }
    })
  }, [])

  const updateAllPairs = useCallback((address, allPairs) => {
    dispatch({
      type: UPDATE_ALL_PAIRS,
      payload: { address, allPairs }
    })
  }, [])

  const updatePriceData = useCallback((address, data, timeWindow, interval) => {
    dispatch({
      type: UPDATE_PRICE_DATA,
      payload: { address, data, timeWindow, interval }
    })
  }, [])

  const updateCashTokens = useCallback(cashes => {
    dispatch({
      type: UPDATE_CASH_USDT,
      payload: {
        cashes
      }
    })
  }, [])

  return (
    <TokenDataContext.Provider
      value={useMemo(
        () => [
          state,
          {
            update,
            updateTokenTxns,
            updateChartData,
            updateTopTokens,
            updateAllPairs,
            updatePriceData,
            updateCashTokens
          }
        ],
        [
          state,
          update,
          updateTokenTxns,
          updateChartData,
          updateTopTokens,
          updateAllPairs,
          updatePriceData,
          updateCashTokens
        ]
      )}
    >
      {children}
    </TokenDataContext.Provider>
  )
}

const getCashTokenData = async (cashes = []) => {
  const utcCurrentTime = dayjs()
  const utcOneDayBack = utcCurrentTime
    .subtract(1, 'day')
    .startOf('minute')
    .unix()

  let bulkResults = {}
  try {
    bulkResults = await Promise.all(
      cashes.map(async cash => {
        let usdPrice = await client.query({
          query: CASH_TOKEN_DATA,
          variables: {
            tokenAddr: cash
          },
          fetchPolicy: 'cache-first'
        })
        console.log('cash token data', JSON.stringify(usdPrice))
        let tokenData = { ...usdPrice?.data?.tokenDayDatas[0], id: cash }

        if (!tokenData) {
          // TOOD remove this, used only form kovan testing
          tokenData = {
            date: 1602460800,
            id: cash,
            priceUSD: '400'
          }
        }
        return tokenData
      })
    )
  } catch (e) {
    console.log(e)
  }
  return bulkResults
}

const getTokenTransactions = async allPairsFormatted => {
  const transactions = {}
  try {
    let result = await client.query({
      query: FILTERED_TRANSACTIONS,
      variables: {
        allPairs: allPairsFormatted
      },
      fetchPolicy: 'cache-first'
    })
    transactions.mints = result.data.mints
    transactions.burns = result.data.burns
    transactions.swaps = result.data.swaps
  } catch (e) {
    console.log(e)
  }
  return transactions
}
/*
const getTokenPairs = async tokenAddress => {
  try {
    // fetch all current and historical data
    let result = await client.query({
      query: TOKEN_DATA(tokenAddress),
      fetchPolicy: 'cache-first'
    })
    return result.data?.['pairs0'].concat(result.data?.['pairs1'])
  } catch (e) {
    console.log(e)
  }
}
*/
const getIntervalTokenData = async (tokenAddress, startTime, interval = 3600, latestBlock) => {
  const utcEndTime = dayjs.utc()
  let time = startTime

  // create an array of hour start times until we reach current hour
  // buffer by half hour to catch case where graph isnt synced to latest block
  const timestamps = []
  while (time < utcEndTime.unix()) {
    timestamps.push(time)
    time += interval
  }

  // backout if invalid timestamp format
  if (timestamps.length === 0) {
    return []
  }

  // once you have all the timestamps, get the blocks for each timestamp in a bulk query
  let blocks
  try {
    blocks = await getBlocksFromTimestamps(timestamps, 100)

    // catch failing case
    if (!blocks || blocks.length === 0) {
      return []
    }

    if (latestBlock) {
      blocks = blocks.filter(b => {
        return parseFloat(b.number) <= parseFloat(latestBlock)
      })
    }

    let result = await splitQuery(PRICES_BY_BLOCK, client, [tokenAddress], blocks, 50)

    // format token ETH price results
    let values = []
    for (var row in result) {
      let timestamp = row.split('t')[1]
      let derivedETH = parseFloat(result[row]?.derivedETH)
      if (timestamp) {
        values.push({
          timestamp,
          derivedETH
        })
      }
    }

    // go through eth usd prices and assign to original values array
    let index = 0
    for (var brow in result) {
      let timestamp = brow.split('b')[1]
      if (timestamp) {
        values[index].priceUSD = result[brow].ethPrice * values[index].derivedETH
        index += 1
      }
    }

    let formattedHistory = []

    // for each hour, construct the open and close price
    for (let i = 0; i < values.length - 1; i++) {
      formattedHistory.push({
        timestamp: values[i].timestamp,
        open: parseFloat(values[i].priceUSD),
        close: parseFloat(values[i + 1].priceUSD)
      })
    }

    return formattedHistory
  } catch (e) {
    console.log(e)
    console.log('error fetching blocks')
    return []
  }
}

const getTokenChartData = async tokenAddress => {
  let data = []
  const utcEndTime = dayjs.utc()
  let utcStartTime = utcEndTime.subtract(1, 'year')
  let startTime = utcStartTime.startOf('minute').unix() - 1

  try {
    let allFound = false
    let skip = 0
    while (!allFound) {
      let result = await client.query({
        query: TOKEN_CHART,
        variables: {
          tokenAddr: tokenAddress,
          skip
        },
        fetchPolicy: 'cache-first'
      })
      if (result.data.tokenDayDatas.length < 1000) {
        allFound = true
      }
      skip += 1000
      data = data.concat(result.data.tokenDayDatas)
    }

    let dayIndexSet = new Set()
    let dayIndexArray = []
    const oneDay = 24 * 60 * 60
    data.forEach((dayData, i) => {
      // add the day index to the set of days
      dayIndexSet.add((data[i].date / oneDay).toFixed(0))
      dayIndexArray.push(data[i])
      dayData.dailyVolumeUSD = parseFloat(dayData.dailyVolumeUSD)
    })

    // fill in empty days
    let timestamp = data[0] && data[0].date ? data[0].date : startTime
    let latestLiquidityUSD = data[0] && data[0].totalLiquidityUSD
    let latestPriceUSD = data[0] && data[0].priceUSD
    let latestPairDatas = data[0] && data[0].mostLiquidPairs
    let index = 1
    while (timestamp < utcEndTime.startOf('minute').unix() - oneDay) {
      const nextDay = timestamp + oneDay
      let currentDayIndex = (nextDay / oneDay).toFixed(0)
      if (!dayIndexSet.has(currentDayIndex)) {
        data.push({
          date: nextDay,
          dayString: nextDay,
          dailyVolumeUSD: 0,
          priceUSD: latestPriceUSD,
          totalLiquidityUSD: latestLiquidityUSD,
          mostLiquidPairs: latestPairDatas
        })
      } else {
        latestLiquidityUSD = dayIndexArray[index].totalLiquidityUSD
        latestPriceUSD = dayIndexArray[index].priceUSD
        latestPairDatas = dayIndexArray[index].mostLiquidPairs
        index = index + 1
      }
      timestamp = nextDay
    }
    data = data.sort((a, b) => (parseInt(a.date) > parseInt(b.date) ? 1 : -1))
  } catch (e) {
    console.log(e)
  }
  return data
}

export function Updater() {
  const [STATE, { updateCashTokens }] = useTokenDataContext()
  const cashTokens = STATE[CASH_USDT_PAIRS]
  const cashes = useAllMarketCashes()

  useEffect(() => {
    async function getData() {
      if (cashes && cashes.length > 0) {
        let cashTokens = await getCashTokenData(cashes)
        if (cashTokens && Object.keys(cashTokens) > 0) {
          updateCashTokens(cashTokens)
        }
      }
    }
    if (!cashTokens || Object.keys(cashTokens) === 0) getData()
  }, [cashTokens, updateCashTokens, cashes])
  return null
}

export function useTokenData(tokenAddress) {
  const [state, { update }] = useTokenDataContext()
  const [ethPrice, ethPriceOld] = useEthPrice()
  const market = useMarket(tokenAddress)
  const tokenData = state?.[tokenAddress]

  useEffect(() => {
    if (!tokenData && ethPrice && ethPriceOld && isAddress(tokenAddress)) {
      if (market) {
        // process market data here
        const data = {
          id: market.id,
          name: market.description,
          symbol: null,
          priceUSD: 0,
          oneDayVolumeUSD: 0,
          totalLiquidityUSD: 0,
          volumeChangeUSD: 0,
          oneDayVolumeUT: 0,
          volumeChangeUT: 0,
          priceChangeUSD: 0,
          liquidityChangeUSD: 0,
          oneDayTxns: 0,
          txnChange: 0
        }
        update(tokenAddress, data)
      }
      /* should have all the data needed on markets context
      getTokenData(market, tokenAddress, ethPrice, ethPriceOld).then(data => {
        update(tokenAddress, data)
      })
      */
    }
  }, [ethPrice, ethPriceOld, tokenAddress, tokenData, update, market])

  return tokenData || {}
}

export function useTokenTransactions(tokenAddress) {
  const [state, { updateTokenTxns }] = useTokenDataContext()
  const tokenTxns = state?.[tokenAddress]?.txns

  const allPairsFormatted =
    state[tokenAddress] &&
    state[tokenAddress].TOKEN_PAIRS_KEY &&
    state[tokenAddress].TOKEN_PAIRS_KEY.map(pair => {
      return pair.id
    })

  useEffect(() => {
    async function checkForTxns() {
      if (!tokenTxns && allPairsFormatted) {
        let transactions = await getTokenTransactions(allPairsFormatted)
        updateTokenTxns(tokenAddress, transactions)
      }
    }
    checkForTxns()
  }, [tokenTxns, tokenAddress, updateTokenTxns, allPairsFormatted])

  return tokenTxns || []
}

export function useTokenPairs(marketId) {
  const [state, { updateAllPairs }] = useTokenDataContext()
  const market = useMarket(marketId)
  const { amms } = market || {}
  const tokenPairs = state?.[marketId]?.[TOKEN_PAIRS_KEY]

  useEffect(() => {
    async function fetchData() {
      console.log('user token pairs', amms)
      let allPairs = []
      if (amms && amms.length > 0) {
        allPairs = amms.filter(a => a.liquidity !== "0").reduce((p, amm) => {
          const { shareToken, id: ammId } = amm
          const { id, cash } = shareToken
          return [
            ...p,
            {
              token0: { id: cash.id, symbol: getCashInfo(cash.id)?.symbol },
              token1: { id, symbol: 'Yes' },
              ammId,
              oneDayVolumeUSD: 1, // this comes from amm stats
              reserveUSD: 2,
              trackedReserveUSD: 3,
              oneWeekVolumeUSD: 4
            },
            {
              token0: { id: cash.id, symbol: getCashInfo(cash.id)?.symbol },
              token1: { id, symbol: 'No' },
              ammId,
              oneDayVolumeUSD: 1,
              reserveUSD: 2,
              trackedReserveUSD: 3,
              oneWeekVolumeUSD: 4
            }
          ]
        }, [])
        updateAllPairs(marketId, allPairs)
      }
    }
    if (!tokenPairs && isAddress(marketId)) {
      fetchData()
    }
  }, [marketId, tokenPairs, updateAllPairs, amms])

  return tokenPairs || []
}

export function useTokenChartData(tokenAddress) {
  const [state, { updateChartData }] = useTokenDataContext()
  const chartData = state?.[tokenAddress]?.chartData
  useEffect(() => {
    async function checkForChartData() {
      if (!chartData) {
        let data = await getTokenChartData(tokenAddress)
        updateChartData(tokenAddress, data)
      }
    }
    checkForChartData()
  }, [chartData, tokenAddress, updateChartData])
  return chartData
}

/**
 * get candlestick data for a token - saves in context based on the window and the
 * interval size
 * @param {*} tokenAddress
 * @param {*} timeWindow // a preset time window from constant - how far back to look
 * @param {*} interval  // the chunk size in seconds - default is 1 hour of 3600s
 */
export function useTokenPriceData(tokenAddress, timeWindow, interval = 3600) {
  const [state, { updatePriceData }] = useTokenDataContext()
  const chartData = state?.[tokenAddress]?.[timeWindow]?.[interval]
  const latestBlock = useLatestBlock()

  useEffect(() => {
    const currentTime = dayjs.utc()
    const windowSize = timeWindow === timeframeOptions.MONTH ? 'month' : 'week'
    const startTime =
      timeWindow === timeframeOptions.ALL_TIME
        ? 1589760000
        : currentTime
            .subtract(1, windowSize)
            .startOf('hour')
            .unix()

    async function fetch() {
      let data = await getIntervalTokenData(tokenAddress, startTime, interval, latestBlock)
      updatePriceData(tokenAddress, data, timeWindow, interval)
    }
    if (!chartData) {
      fetch()
    }
  }, [chartData, interval, timeWindow, tokenAddress, updatePriceData, latestBlock])

  return chartData
}

export function useAllTokenData() {
  const [state] = useTokenDataContext()
  return state
}
