import { augur } from 'services/augurjs'
import { updateAssets } from 'modules/auth/actions/update-assets'
import LogError from 'utils/log-error'
import noop from 'utils/noop'

export function fundNewAccount(callback = LogError) {
  return (dispatch, getState) => {
    const { loginAccount } = getState()
    if (augur.rpc.getNetworkID() !== '1') {
      augur.api.LegacyReputationToken.faucet({
        meta: loginAccount.meta,
        onSent: noop,
        onSuccess: (res) => {
          console.log('LegacyReputationToken.faucet', res)
          dispatch(updateAssets())
          callback(null)
        },
        onFailed: callback,
      })
    }
  }
}
