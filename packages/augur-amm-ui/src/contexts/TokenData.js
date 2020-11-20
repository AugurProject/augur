import React, { createContext, useContext, useReducer, useMemo, useCallback, useEffect } from 'react'

import { client } from '../apollo/client'
import { CASH_TOKEN_DATA } from '../apollo/queries'

import { useEthPrice } from './GlobalData'

import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'

import { isAddress } from '../utils'
import { useMarket, useAllMarketCashes, useMarketCashTokens } from './Markets'

const UPDATE = 'UPDATE'
const UPDATE_TOKEN_TXNS = 'UPDATE_TOKEN_TXNS'
const UPDATE_CHART_DATA = 'UPDATE_CHART_DATA'
const UPDATE_PRICE_DATA = 'UPDATE_PRICE_DATA'
const UPDATE_TOP_TOKENS = ' UPDATE_TOP_TOKENS'
const UPDATE_ALL_PAIRS = 'UPDATE_ALL_PAIRS'
const UPDATE_CASH_DATA = 'UPDATE_CASH_DATA'

const TOKEN_PAIRS_KEY = 'TOKEN_PAIRS_KEY'
const CASH_DATA = 'CASH_DATA'

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

    case UPDATE_CASH_DATA: {
      const { cashes } = payload
      return {
        ...state,
        [CASH_DATA]: cashes
      }
    }

    default: {
      throw Error(`Unexpected action type in DataContext reducer: '${type}'.`)
    }
  }
}

export default function Provider({ children }) {
  const [state, dispatch] = useReducer(reducer, {
    [CASH_DATA]: {}
  })
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
      type: UPDATE_CASH_DATA,
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
  let bulkResults = []
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
        let tokenData = { usdPrice: usdPrice?.data?.tokenDayDatas[0], id: cash }
        if (!tokenData.usdPrice) {
          // TOOD remove this, used only form kovan testing
          tokenData = {
            id: cash,
            priceUSD: cash.toLowerCase() === "0x7290c2b7D5Fc91a112d462fe06aBBB8948668f56".toLowerCase() ? '400' : '1'
          }
        }
        return tokenData
      })
    )
  } catch (e) {
    console.error(e)
  }
  return (bulkResults || []).reduce((p, a) => ({ ...p, [a.id]: a }), {})
}

export function Updater() {
  const [state, { updateCashTokens }] = useTokenDataContext()
  const cashTokens = state[CASH_DATA]
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
  }, [updateCashTokens, cashes, cashTokens])
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
    }
  }, [ethPrice, ethPriceOld, tokenAddress, tokenData, update, market])

  return tokenData || {}
}

export function useTokenDayPriceData() {
  const [state, { updateCashTokens }] = useTokenDataContext()
  const cashTokens = state[CASH_DATA]
  const cashes = useMarketCashTokens()
  const cashAddresses = Object.keys(cashes)
  useEffect(() => {
    async function getData() {
      if (cashAddresses && cashAddresses.length > 0) {
        try {
          let cashTokens = await getCashTokenData(cashAddresses).catch(e => console.error(e))
          // TOOD: should get values using mainnet token addresses
          console.log('mainnet addresses should have data, cashTokens result', cashTokens)
          if (cashTokens) {
            cashTokens = Object.keys(cashTokens).reduce(
              (p, c) => ({
                ...p,
                [c]: { ...cashTokens[c], ...cashes[c] }
              }),
              {}
            )
          }
          updateCashTokens(cashTokens)
        } catch (e) {
          console.error(e)
        }
      }
    }
    if (!cashTokens || Object.keys(cashTokens).length === 0) getData()
  }, [updateCashTokens, cashes, cashTokens, cashAddresses])

  return cashTokens
}

export function useAllTokenData() {
  const [state] = useTokenDataContext()
  return state
}
