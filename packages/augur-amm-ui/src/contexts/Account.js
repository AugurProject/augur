import React, { createContext, useContext, useReducer, useMemo, useCallback } from 'react'
import { ethers } from 'ethers'

import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
//import getLibrary from '../utils/getLibrary'

const WEB3 = 'web3'
const UPDATE_WEB3 = ' UPDATE_WEB3'

dayjs.extend(utc)

const AccountContext = createContext()

function useAccountContext() {
  return useContext(AccountContext)
}

function reducer(state, { type, payload }) {
  switch (type) {
    case UPDATE_WEB3: {
      const { web3 } = payload

      return {
        ...state,
        [WEB3]: web3
      }
    }

    default: {
      throw Error(`Unexpected action type in AccountContext reducer: '${type}'.`)
    }
  }
}

const INITIAL_STATE = {
  account: null,
  web3: {}
}

export default function Provider({ children }) {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE)
  const updateWeb3 = useCallback(web3 => {
    dispatch({
      type: UPDATE_WEB3,
      payload: {
        web3
      }
    })
  }, [])

  return (
    <AccountContext.Provider
      value={useMemo(
        () => [
          state,
          {
            updateWeb3
          }
        ],
        [state, updateWeb3]
      )}
    >
      {children}
    </AccountContext.Provider>
  )
}

export function useAccountWeb3() {
  const [state, { updateWeb3 }] = useAccountContext()
  const clearWeb3 = () => {
    updateWeb3({})
  }

  async function getWeb3() {
    const login = async addresses => {
      console.log('login', addresses[0])
      const address = addresses[0]
      const provider = new ethers.providers.Web3Provider(window.web3.currentProvider)
      const signer = provider.getSigner()
      const network = await provider.getNetwork()
      let chainId = 42 // default to kovan for testing
      // provide chainId here
      if (network === 'mainnet') chainId = 1
      updateWeb3({ address, provider, signer, network, chainId, library: provider })
    }

    window.ethereum
      .request({ method: 'eth_requestAccounts' })
      .then(login)
      .catch(error => {
        if (error.code === 4001) {
          // EIP-1193 userRejectedRequest error
          console.log('Please connect to MetaMask.')
        } else {
          console.error(error)
        }
      })

    window.ethereum.on('accountsChanged', async accounts => {
      login(accounts[0])
    })
  }

  const web3 = state[WEB3]
  return [web3, getWeb3, clearWeb3]
}

export function useAllAccountData() {
  const [state] = useAccountContext()
  return state
}
