import { augur } from 'services/augurjs'
import { UNIVERSE_ID } from 'modules/app/constants/network'
import logError from 'utils/log-error'
import noop from 'utils/noop'
import { updateAssets } from 'modules/auth/actions/update-assets'

export default function (universeID, callback = logError) {
  return (dispatch, getState) => {
    const { universe } = getState()
    const universeID = universe.id || UNIVERSE_ID

    augur.api.Universe.getReputationToken({ tx: { to: universeID } }, (err, reputationTokenAddress) => {
      if (err) return callback(err)
      augur.api.LegacyReputationToken.approve({
        _spender: reputationTokenAddress,
        _value: augur.constants.ETERNAL_APPROVAL_VALUE,
        onSent: noop,
        onSuccess: (res) => {
          dispatch(updateAssets())
        },
        onFailed: callback,
      })
    })
  }
}
