import { augur } from 'services/augurjs'
import logError from 'utils/log-error'
import noop from 'utils/noop'
import { updateAssets } from 'modules/auth/actions/update-assets'

export default function (callback = logError) {
  return (dispatch, getState) => {
    const { loginAccount } = getState()

    augur.api.LegacyReputationToken.faucet({
      _amount: 0,
      meta: loginAccount.meta,
      onSent: noop,
      onSuccess: (res) => {
        dispatch(updateAssets())
      },
      onFailed: callback,
    })
  }
}
