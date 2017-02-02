import store from 'src/store';
import { register } from 'modules/auth/actions/register';

export default function () {
  return {
    getLoginID,
    registerAccount
  };
}

function getLoginID(password, loginID, remember, cb) {
  store.dispatch(register(null, password, password, null, null, null, cb));
}

function registerAccount(password, loginID, remember, loginAccount, cb) {
  store.dispatch(register(null, password, password, loginID, remember, loginAccount, cb));
}
