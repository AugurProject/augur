import { useUnlockedAccount } from 'src/modules/auth/actions/use-unlocked-account'

export const helpers = (dispatch, getState) => ({
  updateAccountAddress: account => new Promise(resolve => dispatch(useUnlockedAccount(account, resolve))),
})
