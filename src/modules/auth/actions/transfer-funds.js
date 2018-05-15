import speedomatic from 'speedomatic'
import { augur } from 'services/augurjs'
import { updateAssets } from 'modules/auth/actions/update-assets'
import { addNotification } from 'modules/notifications/actions/update-notifications'
import { selectCurrentTimestampInSeconds } from 'src/select-state'

import trimString from 'utils/trim-string'

import { ETH, REP } from 'modules/account/constants/asset-types'

export function transferFunds(amount, currency, toAddress) {
  return (dispatch, getState) => {
    const { universe, loginAccount } = getState()
    const fromAddress = loginAccount.address
    const to = speedomatic.formatEthereumAddress(toAddress)
    const onSent = r => console.log('transfer', currency, 'sent:', r)
    const onSuccess = (r) => {
      dispatch(updateAssets())
      console.log('transfer', currency, 'success:', r)
    }
    const onFailed = e => console.error('transfer', currency, 'failed:', e)
    switch (currency) {
      case ETH:
        return augur.assets.sendEther({
          meta: loginAccount.meta,
          to,
          etherToSend: amount,
          from: fromAddress,
          onSent: (tx) => {
            dispatch(addNotification({
              id: `onSent-${tx.hash}`,
              title: `Transfer Ether -- Pending`,
              description: `${amount} ETH -> ${trimString(to)}`,
              timestamp: selectCurrentTimestampInSeconds(getState()),
            }))
          },
          onSuccess: (tx) => {
            dispatch(addNotification({
              id: `onSent-${tx.hash}`,
              title: `Transfer Ether -- Success`,
              description: `${amount} ETH -> ${trimString(to)}`,
              timestamp: selectCurrentTimestampInSeconds(getState()),
            }))
            dispatch(updateAssets)
          },
          onFailed: (tx) => {
            dispatch(addNotification({
              id: `onSent-${tx.hash}`,
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
              id: `onSent-${tx.hash}`,
              title: `Transfer REP -- Pending`,
              description: `${amount} REP -> ${trimString(to)}`,
              timestamp: selectCurrentTimestampInSeconds(getState()),
            }))
          },
          onSuccess: (tx) => {
            dispatch(addNotification({
              id: `onSent-${tx.hash}`,
              title: `Transfer REP -- Success`,
              description: `${amount} REP -> ${trimString(to)}`,
              timestamp: selectCurrentTimestampInSeconds(getState()),
            }))
            dispatch(updateAssets)
          },
          onFailed: (tx) => {
            dispatch(addNotification({
              id: `onSent-${tx.hash}`,
              title: `Transfer REP -- Failed`,
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
