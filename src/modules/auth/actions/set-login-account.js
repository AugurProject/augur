import { useUnlockedAccount } from 'modules/auth/actions/use-unlocked-account'
import logError from 'utils/log-error'

// If there is an available unlocked account, set as the user's sending address.
export const setLoginAccount = (autoLogin, account, callback = logError) => (dispatch, getState) => {
  // If autoLogin=true, use an unlocked local Ethereum node (if present)
  if (autoLogin) {
    dispatch(useUnlockedAccount(account, callback))
  }
}
