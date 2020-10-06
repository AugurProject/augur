import React, { createContext, useContext, useReducer, useMemo, useCallback, useState, useEffect } from 'react'
import { timeframeOptions, SUPPORTED_LIST_URLS__NO_ENS, DEFAULT_NETWORK } from '../constants'

import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import getTokenList from '../utils/tokenLists'
import { healthClient } from '../apollo/client'
import { SUBGRAPH_HEALTH } from '../apollo/queries'
import config from '../config.json'
dayjs.extend(utc)

const UPDATE = 'UPDATE'
const UPDATE_TIMEFRAME = 'UPDATE_TIMEFRAME'
const UPDATE_SESSION_START = 'UPDATE_SESSION_START'
const UPDATE_WEB3 = 'UPDATE_WEB3'
const UPDATED_SUPPORTED_TOKENS = 'UPDATED_SUPPORTED_TOKENS'
const UPDATE_LATEST_BLOCK = 'UPDATE_LATEST_BLOCK'
const UPDATE_CONTRACTS = 'UPDATE_CONTRACTS'

const SUPPORTED_TOKENS = 'SUPPORTED_TOKENS'
const TIME_KEY = 'TIME_KEY'
const CURRENCY = 'CURRENCY'
const SESSION_START = 'SESSION_START'
const WEB3 = 'WEB3'
const LATEST_BLOCK = 'LATEST_BLOCK'
const CONTRACTS = 'CONTRACTS'

const ApplicationContext = createContext()

function useApplicationContext() {
  return useContext(ApplicationContext)
}

function reducer(state, { type, payload }) {
  switch (type) {
    case UPDATE: {
      const { currency } = payload
      return {
        ...state,
        [CURRENCY]: currency
      }
    }
    case UPDATE_TIMEFRAME: {
      const { newTimeFrame } = payload
      return {
        ...state,
        [TIME_KEY]: newTimeFrame
      }
    }
    case UPDATE_SESSION_START: {
      const { timestamp } = payload
      return {
        ...state,
        [SESSION_START]: timestamp
      }
    }
    case UPDATE_WEB3: {
      const { web3 } = payload
      return {
        ...state,
        [WEB3]: web3
      }
    }

    case UPDATE_LATEST_BLOCK: {
      const { block } = payload
      return {
        ...state,
        [LATEST_BLOCK]: block
      }
    }

    case UPDATED_SUPPORTED_TOKENS: {
      const { supportedTokens } = payload
      return {
        ...state,
        [SUPPORTED_TOKENS]: supportedTokens
      }
    }

    case UPDATE_CONTRACTS: {
      const { contracts } = payload
      return {
        ...state,
        [CONTRACTS]: contracts
      }
    }

    default: {
      throw Error(`Unexpected action type in DataContext reducer: '${type}'.`)
    }
  }
}

const INITIAL_STATE = {
  CURRENCY: 'USD',
  TIME_KEY: timeframeOptions.ALL_TIME
}

export default function Provider({ children }) {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE)
  const update = useCallback(currency => {
    dispatch({
      type: UPDATE,
      payload: {
        currency
      }
    })
  }, [])

  // global time window for charts - see timeframe options in constants
  const updateTimeframe = useCallback(newTimeFrame => {
    dispatch({
      type: UPDATE_TIMEFRAME,
      payload: {
        newTimeFrame
      }
    })
  }, [])

  // used for refresh button
  const updateSessionStart = useCallback(timestamp => {
    dispatch({
      type: UPDATE_SESSION_START,
      payload: {
        timestamp
      }
    })
  }, [])

  const updateWeb3 = useCallback(web3 => {
    dispatch({
      type: UPDATE_WEB3,
      payload: {
        web3
      }
    })
  }, [])

  const updateSupportedTokens = useCallback(supportedTokens => {
    dispatch({
      type: UPDATED_SUPPORTED_TOKENS,
      payload: {
        supportedTokens
      }
    })
  }, [])

  const updateLatestBlock = useCallback(block => {
    dispatch({
      type: UPDATE_LATEST_BLOCK,
      payload: {
        block
      }
    })
  }, [])

  const updateContracts = useCallback(contracts => {
    dispatch({
      type: UPDATE_CONTRACTS,
      payload: {
        contracts
      }
    })
  }, [])

  return (
    <ApplicationContext.Provider
      value={useMemo(
        () => [
          state,
          {
            update,
            updateSessionStart,
            updateTimeframe,
            updateWeb3,
            updateSupportedTokens,
            updateLatestBlock,
            updateContracts
          }
        ],
        [
          state,
          update,
          updateTimeframe,
          updateWeb3,
          updateSessionStart,
          updateSupportedTokens,
          updateLatestBlock,
          updateContracts
        ]
      )}
    >
      {children}
    </ApplicationContext.Provider>
  )
}

export function useLatestBlock() {
  const [state, { updateLatestBlock }] = useApplicationContext()

  const latestBlock = state?.[LATEST_BLOCK]

  useEffect(() => {
    async function fetch() {
      try {
        const res = await healthClient.query({
          query: SUBGRAPH_HEALTH
        })
        const block = res.data.indexingStatusForCurrentVersion.chains[0].latestBlock.number
        console.log('block', block)
        if (block) {
          updateLatestBlock(block)
        }
      } catch (e) {
        console.log(e)
      }
    }
    if (!latestBlock) {
      fetch()
    }
  }, [latestBlock, updateLatestBlock])

  return latestBlock
}

export function useCurrentCurrency() {
  const [state, { update }] = useApplicationContext()
  const toggleCurrency = useCallback(() => {
    if (state.currency === 'ETH') {
      update('USD')
    } else {
      update('ETH')
    }
  }, [state, update])
  return [state[CURRENCY], toggleCurrency]
}

export function useTimeframe() {
  const [state, { updateTimeframe }] = useApplicationContext()
  const activeTimeframe = state?.[TIME_KEY]
  return [activeTimeframe, updateTimeframe]
}

export function useStartTimestamp() {
  const [activeWindow] = useTimeframe()
  const [startDateTimestamp, setStartDateTimestamp] = useState()

  // monitor the old date fetched
  useEffect(() => {
    let startTime =
      dayjs
        .utc()
        .subtract(
          1,
          activeWindow === timeframeOptions.week ? 'week' : activeWindow === timeframeOptions.ALL_TIME ? 'year' : 'year'
        )
        .startOf('day')
        .unix() - 1
    // if we find a new start time less than the current startrtime - update oldest pooint to fetch
    setStartDateTimestamp(startTime)
  }, [activeWindow, startDateTimestamp])

  return startDateTimestamp
}

// keep track of session length for refresh ticker
export function useSessionStart() {
  const [state, { updateSessionStart }] = useApplicationContext()
  const sessionStart = state?.[SESSION_START]

  useEffect(() => {
    if (!sessionStart) {
      updateSessionStart(Date.now())
    }
  })

  const [seconds, setSeconds] = useState(0)

  useEffect(() => {
    let interval = null
    interval = setInterval(() => {
      setSeconds(Date.now() - sessionStart ?? Date.now())
    }, 1000)

    return () => clearInterval(interval)
  }, [seconds, sessionStart])

  return parseInt(seconds / 1000)
}

export function useListedTokens() {
  const [state, { updateSupportedTokens }] = useApplicationContext()
  const supportedTokens = state?.[SUPPORTED_TOKENS]
  console.error('useListedTokens not used')
  useEffect(() => {
    async function fetchList() {
      const allFetched = await SUPPORTED_LIST_URLS__NO_ENS.reduce(async (fetchedTokens, url) => {
        const tokensSoFar = await fetchedTokens
        const newTokens = await getTokenList(url)
        return Promise.resolve([...tokensSoFar, ...newTokens.tokens])
      }, Promise.resolve([]))
      let formatted = allFetched?.map(t => t.address.toLowerCase())
      updateSupportedTokens(formatted)
    }
    if (!supportedTokens) {
      fetchList()
    }
  }, [updateSupportedTokens, supportedTokens])

  return supportedTokens
}

function getConfig() {
  const network = process.env.network || DEFAULT_NETWORK
  return config[String(network)]
}
export function useConfig() {
  return getConfig()
}

export function getCashAddress(symbol) {
  const contracts = getConfig()
  const cash = contracts.Cashes.find(c => c.symbol === symbol)
  return cash?.address
}

export function getCashInfo(address) {
  if (!address) return null
  const contracts = getConfig()
  console.log('getCashInfo(address)', address)
  const cash = contracts.Cashes.find(c => c.address?.toLowerCase() === address?.toLowerCase())
  return cash
}

export function getAmmFactoryAddress() {
  const contracts = getConfig()
  const ammFactory = contracts.ammFactory
  return ammFactory
}
