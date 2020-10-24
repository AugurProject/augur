import React, { createContext, useContext, useReducer, useMemo, useCallback, useEffect } from 'react'

import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'

import { augurV2Client } from '../apollo/client'
import { GET_MARKETS } from '../apollo/queries'
import { useConfig } from '../contexts/Application'

const UPDATE = 'UPDATE'
const UPDATE_MARKETS = ' UPDATE_MARKETS'
const UPDATE_PARA_SHARE_TOKENS = ' UPDATE_PARA_SHARE_TOKENS'

dayjs.extend(utc)

const MarketDataaContext = createContext()

function useMarketDataContext() {
  return useContext(MarketDataaContext)
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
    case UPDATE_MARKETS: {
      const { markets } = payload

      return {
        ...state,
        ...markets
      }
    }

    case UPDATE_PARA_SHARE_TOKENS: {
      const { paraShareTokens } = payload

      return {
        ...state,
        paraShareTokens: {
          ...paraShareTokens
        }
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

  const updateMarkets = useCallback(markets => {
    dispatch({
      type: UPDATE_MARKETS,
      payload: {
        markets
      }
    })
  }, [])

  const updateParaShareTokens = useCallback(paraShareTokens => {
    dispatch({
      type: UPDATE_PARA_SHARE_TOKENS,
      payload: {
        paraShareTokens
      }
    })
  }, [])

  return (
    <MarketDataaContext.Provider
      value={useMemo(
        () => [
          state,
          {
            update,
            updateMarkets,
            updateParaShareTokens
          }
        ],
        [state, update, updateMarkets, updateParaShareTokens]
      )}
    >
      {children}
    </MarketDataaContext.Provider>
  )
}

async function getMarketsData(updateMarkets, config) {
  let response = null
  try {
    console.log('call the graph to get market data')
    response = await augurV2Client(config.augurClient).query({ query: GET_MARKETS })
  } catch (e) {
    console.error(e)
  }

  if (response) {
    console.log(JSON.stringify(response.data, null, 1))
    updateMarkets(response.data)
  }
}

export function Updater() {
  const config = useConfig()
  const [, { updateMarkets }] = useMarketDataContext()
  useEffect(() => {
    getMarketsData(updateMarkets, config)
  }, [updateMarkets, config])
  return null
}

export function useAllMarketData() {
  const [state] = useMarketDataContext()
  return state
}

export function useMarket(marketId) {
  const [state] = useMarketDataContext()
  const markets = state?.markets
  return markets ? markets.find(m => m.id === marketId) : null
}

export function useAllMarketCashes() {
  const [state] = useMarketDataContext()
  const shareTokens = state?.paraShareTokens
  if (!shareTokens) return []
  const cashes = shareTokens.map(s => s.cash.id)
  return cashes
}

export function useShareTokens(cash) {
  const [state] = useMarketDataContext()
  const shareToken =
    state?.paraShareTokens ?? (state?.paraShareTokens || []).find(s => s.cash.id.toLowerCase() === cash?.toLowerCase())
  return shareToken[0].id
}

export function useMarketAmm(marketId, amm) {
  const market = useMarket(marketId)
  let ammExchange = null
  let doesExist = market && market.amms && market.amms.length > 0
  if (doesExist) {
    ammExchange = market.amms.find(a => a.id.toLowerCase() === amm?.toLowerCase())
  }

  return {
    ...ammExchange,
    hasLiquidity: ammExchange?.liquidity  && ammExchange?.liquidity !== "0",
    id: ammExchange?.id,
    cash: ammExchange?.shareToken?.cash?.id,
    sharetoken: ammExchange?.shareToken?.id,
    percentageYes: 0.4, // TODO: hardcoding for testing
    percentageNo: 0.1, // TOOD: hardcoding for testing
  }
}

export function useMarketAmmExchanges(marketId) {
  const market = useMarket(marketId)
  const ammExchanges = market && market.amms && market.amms.length > 0 ? market.amms : []

  return ammExchanges.map(ammExchange => ({
    ...ammExchange,
    hasLiquidity: ammExchange?.liquidity  && ammExchange?.liquidity !== "0",
    id: ammExchange?.id,
    cash: ammExchange?.shareToken?.cash?.id,
    sharetoken: ammExchange?.shareToken?.id
  }))
}

export function useMarketNonExistingAmms(marketId) {
  const [state] = useMarketDataContext()
  const market = useMarket(marketId)
  const ammCashes = market && market.amms && market.amms.length > 0 ? market.amms.map(a => a.shareToken.cash.id) : []
  const uncreatedAmms =
    state?.paraShareTokens && state.paraShareTokens.length > 0
      ? state.paraShareTokens.reduce((p, s) => (ammCashes.includes(s.cash.id) ? p : [...p, s.cash.id]), [])
      : []

  return uncreatedAmms
}

export function useMarketCashes() {
  const [state] = useMarketDataContext()
  const cashes = state?.paraShareTokens ? state?.paraShareTokens.reduce((p, s) => [...p, s.cash.id], []) : []
  return cashes
}

export function usePositionMarkets(positions) {
  const [state] = useMarketDataContext()
  const { markets } = state
  const marketPositions = Object.keys(positions).map(marketId => {
    const market = markets.find(m => m.id === marketId)
    return { market, ...positions[marketId]}
  })
  return marketPositions;
}

export function useAmmMarkets(balances) {
  const [state] = useMarketDataContext()
  const { markets } = state
  const ammMarkets = []
  if (markets) {
    Object.keys(balances).map(ammId => {
      const balance = balances[ammId];
      const market = markets.find(m => m.amms.map(a => a.id).includes(ammId))
      const groupedAmms = market ? market.amms.reduce((group, a) => ({...group, [a.id]: a}), {}) : {}
      if (market && balance !== "0") {
        ammMarkets.push({...market, balance, shareToken: groupedAmms[ammId]?.shareToken})
      }
    })
  }
  return ammMarkets
}
