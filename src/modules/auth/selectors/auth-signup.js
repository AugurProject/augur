import store from 'src/store';
import { register, setupAndFundNewAccount } from 'modules/auth/actions/register';

export default function () {
  return {
    register: (password, cb) => store.dispatch(register(password, cb)),
    setupAndFundNewAccount: (password, loginID, rememberMe, loginAccount, cb) => (
      store.dispatch(setupAndFundNewAccount(password, loginID, rememberMe, loginAccount, cb))
    )
  };
}
