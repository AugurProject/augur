import * as AugurJS from 'services/augurjs'
import { updateEnv } from 'modules/app/actions/update-env'
import { updateConnectionStatus, updateAugurNodeConnectionStatus } from 'modules/app/actions/update-connection'
import { updateContractAddresses } from 'modules/contracts/actions/update-contract-addresses'
import { updateFunctionsAPI, updateEventsAPI } from 'modules/contracts/actions/update-contract-api'
import { setLoginAccount } from 'modules/auth/actions/set-login-account'
import { logout } from 'modules/auth/actions/logout'
import { loadUniverse } from 'modules/app/actions/load-universe'
import { registerTransactionRelay } from 'modules/transactions/actions/register-transaction-relay'
import { updateModal } from 'modules/modal/actions/update-modal'
import { closeModal } from 'modules/modal/actions/close-modal'
import logError from 'utils/log-error'

import { MODAL_NETWORK_MISMATCH } from 'modules/modal/constants/modal-types'

function pollForAccount(dispatch) {
  let account

  setInterval(() => {
    AugurJS.augur.rpc.eth.accounts((accounts) => {
      if (account !== accounts[0]) {
        account = accounts[0]

        if (account) {
          dispatch(setLoginAccount(true, account))
        } else {
          dispatch(logout())
        }
      }
    })
  }, 250)
}

function pollForNetwork(dispatch, expectedNetwork) {
  let networkId

  setInterval(() => {
    if (parseInt(AugurJS.augur.rpc.getNetworkID(), 10) !== networkId) {
      networkId = parseInt(AugurJS.augur.rpc.getNetworkID(), 10)

      if (networkId !== expectedNetwork) {
        dispatch(updateModal({
          type: MODAL_NETWORK_MISMATCH,
          expectedNetwork
        }))
      } else {
        dispatch(closeModal())
      }
    }
  })
}

export function initAugur(callback = logError) {
  return (dispatch, getState) => {
    const xhttp = new XMLHttpRequest()
    xhttp.onreadystatechange = () => {
      if (xhttp.readyState === 4) {
        if (xhttp.status === 200) {
          const env = JSON.parse(xhttp.responseText)
          dispatch(updateEnv(env))
          AugurJS.connect(env, (err, ethereumNodeConnectionInfo) => {
            if (err) return callback(err)
            dispatch(updateConnectionStatus(true))
            dispatch(updateContractAddresses(ethereumNodeConnectionInfo.contracts))
            dispatch(updateFunctionsAPI(ethereumNodeConnectionInfo.abi.functions))
            dispatch(updateEventsAPI(ethereumNodeConnectionInfo.abi.events))
            dispatch(updateAugurNodeConnectionStatus(true))
            dispatch(registerTransactionRelay())
            dispatch(loadUniverse(env.universe || AugurJS.augur.contracts.addresses[AugurJS.augur.rpc.getNetworkID()].Universe))
            pollForAccount(dispatch)
            pollForNetwork(dispatch, env['network-id'])
            callback()
          })
        } else {
          callback(xhttp.statusText)
        }
      }
    }
    xhttp.open('GET', 'config/env.json', true)
    xhttp.send()
  }
}
