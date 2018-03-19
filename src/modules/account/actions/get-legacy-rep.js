import { augur } from 'services/augurjs'
import logError from 'utils/log-error'
import noop from 'utils/noop'
import { updateAssets } from 'modules/auth/actions/update-assets'

export default function (callback = logError) {
  return (dispatch) => {
    augur.api.LegacyReputationToken.faucet({
      _amount: 0,
      onSent: noop,
      onSuccess: (res) => {
        dispatch(updateAssets())
      },
      onFailed: callback,
    })
  }
}
