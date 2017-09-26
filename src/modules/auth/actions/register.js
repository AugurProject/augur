import { augur } from 'services/augurjs'
import { base58Decode } from 'utils/base-58'
import { loadAccountData } from 'modules/auth/actions/load-account-data'
import { updateIsLoggedIn } from 'modules/auth/actions/update-is-logged-in'
import logError from 'utils/log-error'

export const register = (password, callback = logError) => dispatch => (
  augur.accounts.register({ password }, (err, account) => {
    if (err) return callback(err)
    dispatch(updateIsLoggedIn(true))
    callback(null, account)
  })
)

export const setupAndFundNewAccount = (password, loginID, callback = logError) => (dispatch, getState) => {
  if (!loginID) return callback({ message: 'loginID is required' })
  dispatch(loadAccountData({ loginID, ...base58Decode(loginID) }, true))
  callback(null)
}
