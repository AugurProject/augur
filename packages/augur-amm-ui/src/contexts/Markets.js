import React, { createContext, useContext, useReducer, useMemo, useCallback, useEffect } from 'react'

import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { BigNumber as BN } from 'bignumber.js'
import { augurV2Client } from '../apollo/client'
import { GET_MARKETS } from '../apollo/queries'
import { useConfig, useParaDeploys } from '../contexts/Application'
import { getBlockFromTimestamp } from '../utils'
import { NetworkId } from '../constants'

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

const roughlyTestnetBlockDiff = 10631525
async function getPastDayBlockNumber(config) {
  const utcCurrentTime = dayjs.utc()
  const utcOneDayBack = utcCurrentTime.subtract(1, 'day').unix()
  let block = await getBlockFromTimestamp(utcOneDayBack)
  if (config.networkId !== NetworkId.Mainnet) {
    // theGraph calls for latest block is for mainnet
    // adjust for testnet
    block = Number(block) + Number(roughlyTestnetBlockDiff)
  }
  console.log('utcOneDayBack', utcOneDayBack, block)
  return block
}

async function getMarketsData(updateMarkets, config) {
  let response = null
  try {
    console.log('call the graph to get market data')
    const block = await getPastDayBlockNumber(config)
    const query = GET_MARKETS(block)
    response = await augurV2Client(config.augurClient).query({ query })
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

function shapeMarketsByAmm(markets) {
  const marketsByAmm = (markets || []).reduce((p, m) => {
    if (!m.amms || m.amms.length === 0) return [...p, { ...m, amm: null }]
    const splitOut = m.amms.map(amm => {
      return { ...m, amm, cash: amm.shareToken.cash.id }
    })
    return p.concat(splitOut)
  }, [])
  return marketsByAmm
}

export function useMarketsByAMM() {
  const [state] = useMarketDataContext()
  const { markets } = state
  return shapeMarketsByAmm(markets)
}

export function useMarketsByAMMPast() {
  const [state] = useMarketDataContext()
  const { past } = state
  return shapeMarketsByAmm(past)
}

export function useMarket(marketId) {
  const [state] = useMarketDataContext()
  const markets = state?.markets
  return markets ? markets.find(m => m.id === marketId) : null
}

export function useAllMarketCashes() {
  const [state] = useMarketDataContext()
  const shareTokens = state?.paraShareTokens
  if (!shareTokens || shareTokens.length === 0) return []
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
    hasLiquidity: ammExchange?.liquidity && ammExchange?.liquidity !== '0',
    id: ammExchange?.id,
    cash: ammExchange?.shareToken?.cash?.id,
    sharetoken: ammExchange?.shareToken?.id
  }
}

export function useMarketAmmExchanges(marketId) {
  const market = useMarket(marketId)
  const ammExchanges = market && market.amms && market.amms.length > 0 ? market.amms : []

  return ammExchanges.map(ammExchange => ({
    ...ammExchange,
    hasLiquidity: ammExchange?.liquidity && ammExchange?.liquidity !== '0',
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

export function useMarketCashAddresses() {
  const [state] = useMarketDataContext()
  const cashes = state?.paraShareTokens ? state?.paraShareTokens.reduce((p, s) => [...p, s.cash.id], []) : []
  return cashes
}

export function useMarketCashTokens() {
  const deploys = useParaDeploys()
  const cashes = Object.keys(deploys).reduce(
    (p, address) => ({
      ...p,
      [address.toLowerCase()]: {
        address: address.toLowerCase(),
        decimals: deploys[address].decimals,
        name: deploys[address]?.name,
        symbol: deploys[address]?.name
      }
    }),
    {}
  )
  return cashes
}

export function usePositionMarkets(positions) {
  const [state] = useMarketDataContext()
  const { markets } = state
  const marketPositions = Object.keys(positions).map(marketId => {
    const market = markets.find(m => m.id === marketId)
    return { market, ...positions[marketId] }
  })
  return marketPositions
}

export function useAmmMarkets(balances) {
  const [state] = useMarketDataContext()
  const { markets } = state
  const ammMarkets = []
  if (markets) {
    Object.keys(balances).forEach(ammId => {
      const balance = balances[ammId]
      const market = markets.find(m => m.amms.map(a => a.id).includes(ammId))
      const groupedAmms = market ? market.amms.reduce((group, a) => ({ ...group, [a.id]: a }), {}) : {}
      if (market && balance !== '0') {
        ammMarkets.push({ ...market, balance, shareToken: groupedAmms[ammId]?.shareToken })
      }
    })
  }
  return ammMarkets
}

function sumAmmParam(markets, param) {
  return markets
    ? markets.reduce((p, m) => {
        if (!m.amm) return p
        const currentCash = p[m.cash.toLowerCase()]
        return currentCash
          ? { ...p, [m.cash.toLowerCase()]: new BN(m.amm[param]).plus(currentCash) }
          : { ...p, [m.cash.toLowerCase()]: new BN(m.amm[param]) }
      }, {})
    : {}
}

export function useTotalLiquidity() {
  const markets = useMarketsByAMM()
  return useMemo(() => sumAmmParam(markets, 'liquidity'), [markets])
}

export function useMarketVolumeByCash(marketId) {
  const markets = useMarketsByAMM()
  const marketsPast = useMarketsByAMMPast()
  const myMarkets = markets.filter(m => m.id === marketId)
  const myMarketsPast = marketsPast.filter(m => m.id === marketId)
  return useCalcVolumes(myMarkets, myMarketsPast)
}

export function useVolumesByCash() {
  const markets = useMarketsByAMM()
  const marketsPast = useMarketsByAMMPast()
  return useCalcVolumes(markets, marketsPast)
}

function sumAmmTransactions(markets) {
  return markets
    ? markets.reduce((p, m) => {
        if (!m.amm) return p
        const currentCash = p[m.cash.toLowerCase()]
        return currentCash
          ? {
              ...p,
              [m.cash.toLowerCase()]: new BN(m.amm.swaps.length + m.amm.enters.length + m.amm.exits.length).plus(
                currentCash
              )
            }
          : { ...p, [m.cash.toLowerCase()]: new BN(m.amm.swaps.length + m.amm.enters.length + m.amm.exits.length) }
      }, {})
    : {}
}

export function useAmmTransactions() {
  const markets = useMarketsByAMM()
  const marketsPast = useMarketsByAMMPast()

  return useMemo(() => {
    const tx = sumAmmTransactions(markets)
    const past = sumAmmTransactions(marketsPast)

    const totalDiff = Object.keys(tx).reduce((p, t) => p + (tx[t] - past[t]), 0)
    return { tx, past, totalDiff: String(totalDiff) }
  }, [markets, marketsPast])
}

function useCalcVolumes(markets, marketsPast) {
  return useMemo(() => {
    const volumeYes = sumAmmParam(markets, 'volumeYes')
    const volumeNo = sumAmmParam(markets, 'volumeNo')
    const volumeYesPast = sumAmmParam(marketsPast, 'volumeYes')
    const volumeNoPast = sumAmmParam(marketsPast, 'volumeNo')

    const volume = Object.keys(volumeYes).reduce(
      (p, c) => ({
        ...p,
        [c]: volumeYes[c].plus(volumeNo[c])
      }),
      {}
    )

    const past = Object.keys(volumeYesPast).reduce(
      (p, c) => ({
        ...p,
        [c]: volumeYesPast[c].plus(volumeNoPast[c])
      }),
      {}
    )

    const diff = Object.keys(volume).reduce(
      (p, c) => ({
        ...p,
        [c]: volume[c].minus(past[c])
      }),
      {}
    )

    const totalDiff = Object.keys(diff).reduce((p, c) => p.plus(new BN(diff[c])), new BN(0))
    return { volume, past, diff, totalDiff: String(totalDiff) }
  }, [markets, marketsPast])
}
