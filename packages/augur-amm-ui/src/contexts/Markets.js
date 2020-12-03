import React, { createContext, useContext, useReducer, useMemo, useCallback, useEffect } from 'react'

import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import BigNumber, { BigNumber as BN } from 'bignumber.js'
import { augurV2Client } from '../apollo/client'
import { GET_MARKETS } from '../apollo/queries'
import { useConfig, useParaDeploys } from '../contexts/Application'
import { getBlockFromTimestamp, calculateLiquidity } from '../utils'
import { useTokenDayPriceData } from '../contexts/TokenData'

const UPDATE = 'UPDATE'
const UPDATE_MARKETS = ' UPDATE_MARKETS'
const UPDATE_PARA_SHARE_TOKENS = ' UPDATE_PARA_SHARE_TOKENS'
const UPDATE_NEED_REFRESH_DATA = 'UPDATE_NEED_REFRESH_DATA'

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

    case UPDATE_NEED_REFRESH_DATA: {
      const { flag } = payload
      console.log('UPDATE_NEED_REFRESH_DATA', flag)
      return {
        ...state,
        isDataClean: flag
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

  const updateIsDataClean = useCallback(flag => {
    dispatch({
      type: UPDATE_NEED_REFRESH_DATA,
      payload: {
        flag
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
            updateParaShareTokens,
            updateIsDataClean
          }
        ],
        [state, update, updateMarkets, updateParaShareTokens, updateIsDataClean]
      )}
    >
      {children}
    </MarketDataaContext.Provider>
  )
}

async function getPastDayBlockNumber(config) {
  const utcCurrentTime = dayjs.utc()
  let block = null
  try {
    const utcOneDayBack = utcCurrentTime.subtract(1, 'day').unix()
    block = await getBlockFromTimestamp(utcOneDayBack, config.blockClient)
  } catch (e) {
    console.error('get past day block number', e)
  }
  return block
}

export function useMarketDataRefresher() {
  const [, { updateIsDataClean }] = useMarketDataContext()
  return { updateIsDataClean }
}

async function getMarketsData(updateMarkets, config) {
  let response = null
  try {
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
  const [state, { updateMarkets, updateIsDataClean }] = useMarketDataContext()
  const refresh = state?.isDataClean

  useEffect(() => {
    if (refresh) return
    getMarketsData(updateMarkets, config)
    updateIsDataClean(true)
  }, [config, refresh])
  return null
}

export function useAllMarketData() {
  const [state] = useMarketDataContext()
  return state
}

function shapeMarketsByAmm(markets) {
  const marketsByAmm = (markets || []).reduce((p, m) => {
    if (!m.amms || m.amms.length === 0) return [...p, { ...m, amm: null }]
    const splitOut = m.amms.map(amm =>
      ({ ...m, amm: shapeAMMData(amm), cash: amm.shareToken.cash.id })
    )
    return p.concat(splitOut)
  }, [])
  return marketsByAmm
}

function shapeAMMData(amm) {
  return {
    ...amm,
    // TODO: this data will come from graph call
    priceYes: Number(amm.percentageNo) / 100,
    priceNo: Number(amm.percentageYes) / 100,
    cash: amm.shareToken.cash.id,
    sharetoken: amm?.shareToken?.id,
    hasLiquidity: amm?.liquidity && amm?.liquidity !== '0'
  }
}

export function useMarketsByAMM() {
  const [state] = useMarketDataContext()
  const { markets } = state
  return shapeMarketsByAmm(markets)
}

export function useMarketsByAMMLiquidityVolume() {
  const [state] = useMarketDataContext()
  const cashData = useTokenDayPriceData()
  const cashTokens = useMarketCashTokens()
  const { markets, past } = state
  const shapedMarkets = shapeMarketsByAmm(markets)
  const keyedPastMarkets = past
    ? past.filter(p => p.amms.length > 0).reduce((group, a) => ({ ...group, [a.id]: a }), {})
    : {}
  return useMemo(() => {
    return shapedMarkets
      ? shapedMarkets.map(s => {
          const newMarket = { ...s }
          const { amm } = newMarket
          const cashPrice =
            cashData && cashData[s.cash] && cashData[s.cash]?.priceUSD ? cashData[s.cash]?.priceUSD : '0'
          const hasPastMarket = keyedPastMarkets[s.id]
          if (amm) {
            const cashToken = cashTokens[s.cash]
            // liquidity in USD
            newMarket.amm.liquidityUSD = calculateLiquidity(
              Number(cashToken?.decimals),
              String(amm?.liquidity),
              String(cashPrice)
            )
            if (hasPastMarket) {
              // add 24 hour volume, find correct cash
              const pastCashAmm = [...hasPastMarket.amms].find(a => a.shareToken.cash.id === s.cash)
              if (pastCashAmm) {
                const volNotwentyfour = new BigNumber(amm.volumeNo)
                  .minus(new BigNumber(pastCashAmm.volumeNo))
                  .times(amm.priceNo)
                  .times(new BigNumber(cashPrice))
                const volYestwentyfour = new BigNumber(amm.volumeYes)
                  .minus(new BigNumber(pastCashAmm.volumeYes))
                  .times(amm.priceYes)
                  .times(new BigNumber(cashPrice))
                const volume24hrUsd = calculateLiquidity(
                  Number(cashToken?.decimals),
                  String(volYestwentyfour.plus(volNotwentyfour)),
                  String(cashPrice)
                )
                newMarket.amm.volumeNo24hrUSD = calculateLiquidity(
                  Number(cashToken?.decimals),
                  String(volNotwentyfour),
                  String(cashPrice)
                )
                newMarket.amm.volumeYes24hrUSD = calculateLiquidity(
                  Number(cashToken?.decimals),
                  String(volYestwentyfour),
                  String(cashPrice)
                )
                newMarket.amm.volume24hrUSD = volume24hrUsd
              }
            }
          }
          return newMarket
        })
      : []
  }, [cashData, shapedMarkets, keyedPastMarkets])
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
  let shareTokenAddress = undefined
  if (cash && state?.paraShareTokens) {
    const shareToken = (state?.paraShareTokens || []).find(s => s.cash.id.toLowerCase() === cash.toLowerCase())
    if (shareToken) shareTokenAddress = shareToken?.id
  }
  return shareTokenAddress
}

export function useMarketAmm(marketId, amm) {
  const market = useMarket(marketId)
  let ammExchange = null
  let doesExist = market && market.amms && market.amms.length > 0
  if (doesExist) {
    const exchange = market.amms.find(a => a.id.toLowerCase() === amm?.toLowerCase())
    ammExchange = exchange ? shapeAMMData(exchange) : null
  }
  return ammExchange
}

export function useMarketAmmExchanges(marketId) {
  const marketsLV = useMarketsByAMMLiquidityVolume()
  const cashes = useMarketCashTokens()
  const markets = marketsLV.filter(m => m.id === marketId)
  const ammExchanges =
    markets.length > 0 && markets.filter(m => m.amm).length > 0 ? markets.reduce((p, m) => [...p, m.amm], []) : []

  return ammExchanges.length > 0
    ? ammExchanges.map(ammExchange => ({
        ...ammExchange,
        hasLiquidity: ammExchange?.liquidity && ammExchange?.liquidity !== '0',
        id: ammExchange?.id,
        cash: cashes[ammExchange?.shareToken?.cash?.id],
        sharetoken: ammExchange?.shareToken?.id
      }))
    : []
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
  const cashes = deploys
    ? Object.keys(deploys).reduce(
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
    : {}
  return cashes
}

export function usePositionMarkets(positions) {
  const [state] = useMarketDataContext()
  const { markets } = state
  const marketPositions = positions.map(position => {
    const marketId = position.marketId;
    const market = markets.find(m => m.id === marketId)
    return { market, ...position }
  })
  return marketPositions
}

export function useAmmMarkets(balances) {
  const [state] = useMarketDataContext()
  const cashes = useMarketCashTokens()
  const { markets } = state
  const ammMarkets = []
  if (markets) {
    Object.keys(balances).forEach(ammId => {
      const balance = balances[ammId]
      const market = markets.find(m => m.amms.map(a => a.id).includes(ammId))
      const groupedAmms = market ? market.amms.reduce((group, a) => ({ ...group, [a.id]: a }), {}) : {}
      const shareToken = groupedAmms[ammId]?.shareToken;
      const cash = cashes[shareToken?.cash?.id]
      if (market && balance !== '0') {
        ammMarkets.push({ ...market, balance, shareToken, cash })
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
          ? { ...p, [m.cash.toLowerCase()]: new BN(m.amm[param] || 0).plus(currentCash) }
          : { ...p, [m.cash.toLowerCase()]: new BN(m.amm[param] || 0) }
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

    const totalDiff = Object.keys(tx).reduce((p, t) => p + ((tx[t] || 0) - (past[t] || 0)), 0)
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
        [c]: volumeYes[c].plus(volumeNo[c] || 0)
      }),
      {}
    )

    const past = Object.keys(volumeYesPast).reduce(
      (p, c) => ({
        ...p,
        [c]: volumeYesPast[c].plus(volumeNoPast[c] || 0)
      }),
      {}
    )

    const diff = Object.keys(volume).reduce(
      (p, c) => ({
        ...p,
        [c]: volume[c].minus(past[c] || 0)
      }),
      {}
    )

    const totalDiff = Object.keys(diff).reduce((p, c) => p.plus(new BN(diff[c] || 0)), new BN(0))
    return { volume, past, diff, totalDiff: String(totalDiff) }
  }, [markets, marketsPast])
}

export const useMarketAmmTradeData = (marketId, cashAddress) => {
  const amms = useMarketAmmExchanges(marketId);
  console.log('amms', amms)
  console.log(marketId, cashAddress)
  const amm = amms.find(a => a.cash.address === cashAddress);
  console.log('amm', amm)
  if (!amm) return []

  return [
    {
      no: .76,
      yes: .24,
      date: 1606925914
    },
    {
      no: .78,
      yes: .22,
      date: 1606839514
    },
    {
      no: .79,
      yes: .21,
      date: 1606753114
    },
    {
      no: .80,
      yes: .20,
      date: 1606666714
    },
    {
      no: .79,
      yes: .21,
      date: 1606580314
    },
    {
      no: .60,
      yes: .40,
      date: 1606493914
    },
    {
      no: .55,
      yes: .45,
      date: 1606407514
    }
  ]

}
