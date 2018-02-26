import { augur } from 'services/augurjs'
import noop from 'utils/noop'
import logError from 'utils/log-error'
import { updateLoginAccount } from 'modules/auth/actions/update-login-account'

export function checkAccountAllowance(callback = logError) {
  return (dispatch, getState) => {
    const { loginAccount } = getState()
    augur.api.Cash.allowance({
      _owner: loginAccount.address,
      _spender: augur.contracts.addresses[augur.rpc.getNetworkID()].Augur
    }, (err, allowance) => {
      if (err) callback(err)
      dispatch(updateLoginAccount({ allowance }))
    })
  }
}

export function approveAccount(callback = logError) {
  return (dispatch, getState) => {
    const { loginAccount } = getState()
    const { address, meta } = loginAccount
    augur.accounts.approveAugur({
      meta,
      address,
      onSent: noop,
      onSuccess: (res) => {
        dispatch(checkAccountAllowance())
        callback(null, res)
      },
      onFailed: err => callback(err),
    })
  }
}
