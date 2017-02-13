import { augur, utils } from '../../../services/augurjs';
import { updateAssets } from '../../auth/actions/update-assets';

export function fundNewAccount() {
  return (dispatch, getState) => {
    const { env, branch, loginAccount } = getState();
    if (env.fundNewAccountFromAddress && env.fundNewAccountFromAddress.amount) {
      const fromAddress = env.fundNewAccountFromAddress.address || augur.from;
      const amount = env.fundNewAccountFromAddress.amount;
      augur.accounts.fundNewAccountFromAddress(fromAddress, amount, loginAccount.address, branch.id, utils.noop, (r) => {
        console.log('fundNewAccountFromAddress success:', r);
        dispatch(updateAssets());
      }, e => console.error('fundNewAccountFromAddress:', e));
    } else {
      augur.accounts.fundNewAccountFromFaucet(loginAccount.address, branch.id, utils.noop, (r) => {
        console.log('fundNewAccountFromFaucet success:', r);
        dispatch(updateAssets());
      }, e => console.error('fundNewAccountFromFaucet:', e));
    }
  };
}
