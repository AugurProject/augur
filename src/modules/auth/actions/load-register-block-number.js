import { augur } from 'services/augurjs';
import { loadAccountHistory } from 'modules/auth/actions/load-account-history';
import { updateLoginAccount } from 'modules/auth/actions/update-login-account';

export const loadRegisterBlockNumber = () => (dispatch, getState) => {
  const { loginAccount } = getState();
  if (loginAccount && loginAccount.address) {
    // if (loginAccount.registerBlockNumber) return dispatch(loadAccountHistory());
    augur.getRegisterBlockNumber(loginAccount.address, (err, blockNumber) => {
      if (err) return console.error(err);
      if (!blockNumber) {
        augur.Register.register(augur.utils.noop, (r) => {
          console.log('Register.register success:', r);
          dispatch(updateLoginAccount({ registerBlockNumber: r.blockNumber }));
          // dispatch(loadAccountHistory());
        }, e => console.error('Register.register failed:', e));
      } else {
        dispatch(updateLoginAccount({ registerBlockNumber: blockNumber }));
        // dispatch(loadAccountHistory());
      }
    });
  }
};
