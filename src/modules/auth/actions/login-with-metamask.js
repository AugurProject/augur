import logError from 'utils/log-error'
import { loadAccount } from 'src/modules/app/actions/init-augur'
import { updateEnv } from 'src/modules/app/actions/update-env'

export const loginWithMetaMask = (callback = logError) => (dispatch, getState) => {
  dispatch(updateEnv({
    useWeb3Transport: true,
  }))

  const { env } = getState()
  loadAccount(dispatch, null, env, callback)
}
