import { augur, utils } from 'services/augurjs'
import { loadRegisterBlockNumber } from 'modules/auth/actions/load-register-block-number'
import { updateAssets } from 'modules/auth/actions/update-assets'

export function fundNewAccount() {
  return (dispatch, getState) => {
    const { env, branch, loginAccount } = getState()
    if (env.fundNewAccountFromAddress && env.fundNewAccountFromAddress.amount) {
      const fromAddress = env.fundNewAccountFromAddress.address
      const amount = env.fundNewAccountFromAddress.amount
      augur.beta.fundNewAccountFromAddress({
        _signer: loginAccount.privateKey,
        fromAddress,
        amount,
        registeredAddress: loginAccount.address,
        branch: branch.id,
        onSent: utils.noop,
        onSuccess: () => {
          dispatch(updateAssets())
          dispatch(loadRegisterBlockNumber())
        },
        onFailed: e => console.error('fundNewAccountFromAddress:', e)
      })
    } else {
      augur.beta.fundNewAccountFromFaucet({
        _signer: loginAccount.privateKey,
        registeredAddress: loginAccount.address,
        branch: branch.id,
        onSent: utils.noop,
        onSuccess: () => {
          dispatch(updateAssets())
          dispatch(loadRegisterBlockNumber())
        },
        onFailed: e => console.error('fundNewAccountFromFaucet:', e)
      })
    }
  }
}
