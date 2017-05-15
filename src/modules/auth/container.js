import { connect } from 'react-redux';
// import asyncComponent from 'modules/app/helpers/async-component';
import AuthView from 'modules/auth/components/auth-view';

import { register, setupAndFundNewAccount } from 'modules/auth/actions/register';
import { login } from 'modules/auth/actions/login';
import { importAccount } from 'modules/auth/actions/import-account';

import { selectAirbitzLink, selectAirbitzOnLoad } from 'modules/link/selectors/links';

import { AUTH_NAV_ITEMS } from 'modules/auth/constants/auth-nav-items';

const mapStateToProps = state => ({
  authNavItems: AUTH_NAV_ITEMS
});

const mapDispatchToProps = dispatch => ({
  register: (pass, cb) => dispatch(register(pass, cb)),
  setupAndFundNewAccount: (pass, id, remember, cb) => dispatch(setupAndFundNewAccount(pass, id, remember, cb)),
  submitLogin: (id, pass, remember, cb) => dispatch(login(id, pass, remember, cb)),
  importAccount: (pass, remember, keystore) => dispatch(importAccount(pass, remember, keystore)),
  airbitzLoginLink: selectAirbitzLink(null, dispatch),
  airbitzOnLoad: selectAirbitzOnLoad(dispatch)
});

// const Auth = asyncComponent(() => import(/* webpackChunkName: 'auth' */ 'modules/auth/components/auth-view')
//   .then(module => connect(mapStateToProps, mapDispatchToProps)(module.default))
//   .catch((err) => {
//     console.error(`ERROR: Failed to load 'Auth' module -- `, err);
//   })
// );

const Auth = connect(mapStateToProps, mapDispatchToProps)(AuthView);

export default Auth;
