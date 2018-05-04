import speedomatic from 'speedomatic'
import { augur } from 'services/augurjs'
import { updateLoginAccount } from 'modules/auth/actions/update-login-account'
import logError from 'utils/log-error'

export const updateEtherBalance = (callback = logError) => (dispatch, getState) => {
  const { loginAccount } = getState()
  if (!loginAccount.address) return callback(null)
  augur.rpc.eth.getBalance([loginAccount.address, 'latest'], (err, attoEtherBalance) => {
    if (err) return callback(err)
    const etherBalance = speedomatic.unfix(attoEtherBalance, 'string')
    if (!loginAccount.eth || loginAccount.eth !== etherBalance) {
      dispatch(updateLoginAccount({ eth: etherBalance }))
    }
    // console.log('Ether balance:', etherBalance)
    callback(null, etherBalance)
  })
}
