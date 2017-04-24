import { augur, utils } from '../../../services/augurjs';
import { loadRegisterBlockNumber } from '../../../modules/auth/actions/load-register-block-number';
import { updateAssets } from '../../auth/actions/update-assets';

export function fundNewAccount() {
  return (dispatch, getState) => {
    const { env, branch, loginAccount } = getState();
    if (env.fundNewAccountFromAddress && env.fundNewAccountFromAddress.amount) {
      const fromAddress = env.fundNewAccountFromAddress.address;
      const amount = env.fundNewAccountFromAddress.amount;
      augur.beta.fundNewAccountFromAddress(fromAddress, amount, loginAccount.address, branch.id, utils.noop, (r) => {
        console.log('fundNewAccountFromAddress success:', r);
        dispatch(updateAssets());
        dispatch(loadRegisterBlockNumber());
      }, e => console.error('fundNewAccountFromAddress:', e));
    } else {
      augur.beta.fundNewAccountFromFaucet(loginAccount.address, branch.id, utils.noop, (r) => {
        console.log('fundNewAccountFromFaucet success:', r);
        dispatch(updateAssets());
        dispatch(loadRegisterBlockNumber());
      }, e => console.error('fundNewAccountFromFaucet:', e));
    }
  };
}
