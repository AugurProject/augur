import { augur } from 'services/augurjs'
import logError from 'utils/log-error'
import noop from 'utils/noop'
import { updateAssets } from 'modules/auth/actions/update-assets'
import { UNIVERSE_ID } from 'modules/app/constants/network'

export default function (callback = logError) {
  return (dispatch, getState) => {
    const { universe, loginAccount } = getState()
    const universeID = universe.id || UNIVERSE_ID

    augur.api.Universe.getReputationToken({ tx: { to: universeID } }, (err, reputationTokenAddress) => {
      if (err) return callback(err)
      augur.api.TestNetReputationToken.faucet({
        tx: { to: reputationTokenAddress },
        _amount: 0,
        meta: loginAccount.meta,
        onSent: noop,
        onSuccess: (res) => {
          dispatch(updateAssets())
        },
        onFailed: callback,
      })
    })
  }
}
