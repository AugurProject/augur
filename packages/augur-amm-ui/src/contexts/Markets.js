import React, { createContext, useContext, useReducer, useMemo, useCallback, useEffect } from 'react'

import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'

import { augurV2Client } from '../apollo/client'
import { GET_MARKETS } from '../apollo/queries'
//import { getAMMAddressForMarketShareToken } from '../utils/contractCalls'
//import { PARA_AUGUR_TOKENS } from '../contexts/TokenData'
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
/*
async function getAMMExchangePairs(network, { markets }) {
  let paraShareTokens = {}
  if (markets) {
    // Currently slicing the markets due the the number of ETH calls required for the below
    // TODO wrap all these getAMMAddressForMarketShareToken calls in multiCall
    const slicedMarkets = markets.slice(0, 5)
    for (const market of slicedMarkets) {
      for (const token of PARA_AUGUR_TOKENS) {
        const ammExchange = await getAMMAddressForMarketShareToken(network, market.id, token)
        paraShareTokens[ammExchange] = {
          id: ammExchange,
          token0: {
            id: token,
            symbol: token === PARA_AUGUR_TOKENS[0] ? 'ETH' : 'DAI',
            name: token === PARA_AUGUR_TOKENS[0] ? 'Ether (Wrapped)' : 'Dai Stablecoin',
            totalLiquidity: '0',
            derivedETH: '0',
            __typename: 'Token'
          },
          token1: {
            id: market.id,
            symbol: market.description,
            name: 'ParaAugur',
            totalLiquidity: '0',
            derivedETH: '0',
            __typename: 'Token'
          }
        }
      }
    }
  }
  return paraShareTokens
}
*/
export function Updater() {
  const config = useConfig()
  const [, { updateMarkets, updateParaShareTokens }] = useMarketDataContext()
  useEffect(() => {
    async function getData() {
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
        //const ammExchangePairs = await getAMMExchangePairs(config.network, response.data)
        //updateParaShareTokens(ammExchangePairs)
      }
    }
    getData()
  }, [updateMarkets, updateParaShareTokens, config])
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
    state?.paraShareTokens ?? state?.paraShareTokens.find(s => s.cash.id.toLowerCase() === cash?.toLowerCase())
  return shareToken?.id
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
    id: ammExchange?.id,
    cash: ammExchange?.shareToken?.cash?.id,
    sharetoken: ammExchange?.shareToken?.id
  }
}

export function useMarketNonExistingAmms(marketId) {
  const [state] = useMarketDataContext()
  const market = useMarket(marketId)
  const ammCashes = market.amms && market.amms.length > 0 ? market.amms.map(a => a.shareToken.cash.id) : []
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
