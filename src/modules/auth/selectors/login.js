import store from 'src/store';
import { login } from 'modules/auth/actions/login';

export default function () {
  return {
    submitLogin
  };
}

function submitLogin(id, password, remember) {
  store.dispatch(login(id, password, remember));
}
