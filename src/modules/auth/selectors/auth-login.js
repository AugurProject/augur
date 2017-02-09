import store from 'src/store';
import { login } from 'modules/auth/actions/login';
import { selectAirbitzLink } from 'modules/link/selectors/links';

export default function () {
  return {
    submitLogin,
    airbitzLogin: selectAirbitzLink
  };
}

function submitLogin(id, password, remember, cb) {
  store.dispatch(login(id, password, remember, cb));
}
