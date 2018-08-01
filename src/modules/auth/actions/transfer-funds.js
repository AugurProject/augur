import speedomatic from 'speedomatic'
import { augur } from 'services/augurjs'
import { updateNotification, addNotification } from 'modules/notifications/actions'
import { selectCurrentTimestampInSeconds } from 'src/select-state'

import trimString from 'utils/trim-string'

import { ETH, REP } from 'modules/account/constants/asset-types'

export function transferFunds(amount, currency, toAddress) {
  return (dispatch, getState) => {
    const { universe, loginAccount } = getState()
    const fromAddress = loginAccount.address
    const to = speedomatic.formatEthereumAddress(toAddress)
    switch (currency) {
      case ETH:
        return augur.assets.sendEther({
          meta: loginAccount.meta,
          to,
          etherToSend: amount,
          from: fromAddress,
          onSent: (tx) => {
            dispatch(addNotification({
              id: tx.hash,
              status: 'Pending',
              title: `Transfer Ether`,
              description: `${amount} ETH -> ${trimString(to)}`,
              timestamp: selectCurrentTimestampInSeconds(getState()),
            }))
          },
          onSuccess: (tx) => {
            dispatch(updateNotification(tx.hash, {
              status: 'Success',
              title: `Transfer Ether`,
              description: `${amount} ETH -> ${trimString(to)}`,
              timestamp: selectCurrentTimestampInSeconds(getState()),
            }))
          },
          onFailed: (tx) => {
            dispatch(updateNotification(tx.hash, {
              status: 'Failed',
              title: `Transfer Ether -- Failed`,
              description: `${amount} ETH -> ${trimString(to)}`,
              timestamp: selectCurrentTimestampInSeconds(getState()),
            }))
          },
        })
      case REP:
        return augur.assets.sendReputation({
          meta: loginAccount.meta,
          universe: universe.id,
          reputationToSend: amount,
          _to: to,
          onSent: (tx) => {
            dispatch(addNotification({
              id: `REP-${tx.hash}`,
              status: 'Pending',
              title: `Transfer REP`,
              description: `${amount} REP -> ${trimString(to)}`,
              timestamp: selectCurrentTimestampInSeconds(getState()),
            }))
          },
          onSuccess: (tx) => {
            dispatch(updateNotification(`REP-${tx.hash}`, {
              status: 'Success',
              title: `Transfer REP`,
              description: `${amount} REP -> ${trimString(to)}`,
              timestamp: selectCurrentTimestampInSeconds(getState()),
            }))
          },
          onFailed: (tx) => {
            dispatch(updateNotification(`REP-${tx.hash}`, {
              status: 'Failed',
              title: `Transfer REP`,
              description: `${amount} REP -> ${trimString(to)}`,
              timestamp: selectCurrentTimestampInSeconds(getState()),
            }))
          },
        })
      default:
        console.error('transferFunds: unknown currency', currency)
    }
  }
}
