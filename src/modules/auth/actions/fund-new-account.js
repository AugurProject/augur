import { augur, utils } from '../../../services/augurjs';
import { loadRegisterBlockNumber } from '../../../modules/auth/actions/load-register-block-number';
import { updateAssets } from '../../auth/actions/update-assets';

export function fundNewAccount() {
  return (dispatch, getState) => {
    const { env, branch, loginAccount } = getState();
    if (env.fundNewAccountFromAddress && env.fundNewAccountFromAddress.amount) {
      const fromAddress = env.fundNewAccountFromAddress.address;
      const amount = env.fundNewAccountFromAddress.amount;
      augur.beta.fundNewAccountFromAddress({
        _signer: loginAccount.privateKey,
        fromAddress: fromAddress,
        amount: amount,
        registeredAddress: loginAccount.address,
        branch: branch.id,
        onSent: utils.noop,
        onSuccess: (r) => {
          console.log('fundNewAccountFromAddress success:', r);
          dispatch(updateAssets());
          dispatch(loadRegisterBlockNumber());
        },
        onFailed: e => console.error('fundNewAccountFromAddress:', e)
      });
    } else {
      augur.beta.fundNewAccountFromFaucet({
        registeredAddress: loginAccount.address,
        branch: branch.id,
        onSent: utils.noop,
        onSuccess: (r) => {
          console.log('fundNewAccountFromFaucet success:', r);
          dispatch(updateAssets());
          dispatch(loadRegisterBlockNumber());
        },
        onFailed: e => console.error('fundNewAccountFromFaucet:', e)
      });
    }
  };
}
