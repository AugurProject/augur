import { augur } from 'services/augurjs'
import { BRANCH_ID } from 'modules/app/constants/network'
import { updateLoginAccount } from 'modules/auth/actions/update-login-account'
import { allAssetsLoaded } from 'modules/auth/selectors/balances'
import logError from 'utils/log-error'

export function updateAssets(callback = logError) {
  return (dispatch, getState) => {
    const { loginAccount, branch } = getState()
    const balances = { eth: undefined, ethTokens: undefined, rep: undefined }
    if (!loginAccount.address) return dispatch(updateLoginAccount(balances))
    augur.assets.loadAssets({
      branchID: branch.id || BRANCH_ID,
      address: loginAccount.address
    },
      (err, ethTokens) => {
        if (err) return callback(err)
        balances.ethTokens = ethTokens
        if (!loginAccount.ethTokens || loginAccount.ethTokens !== ethTokens) {
          dispatch(updateLoginAccount({ ethTokens }))
        }
        if (allAssetsLoaded(balances)) callback(null, balances)
      },
      (err, rep) => {
        if (err) return callback(err)
        balances.rep = rep
        if (!loginAccount.rep || loginAccount.rep !== rep) {
          dispatch(updateLoginAccount({ rep }))
        }
        if (allAssetsLoaded(balances)) callback(null, balances)
      },
      (err, eth) => {
        if (err) return callback(err)
        balances.eth = eth
        if (!loginAccount.eth || loginAccount.eth !== eth) {
          dispatch(updateLoginAccount({ eth }))
        }
        if (allAssetsLoaded(balances)) callback(null, balances)
      }
    )
  }
}
