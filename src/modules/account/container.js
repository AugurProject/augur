import { connect } from 'react-redux';
// import asyncComponent from 'modules/app/helpers/async-component';
import AccountView from 'modules/account/components/account-view';

import { changeAccountName } from 'modules/auth/actions/update-login-account';
import { transferFunds } from 'modules/auth/actions/transfer-funds';

import { selectLoginAccount } from 'modules/account/selectors/login-account';
import { authLink } from 'modules/link/selectors/links';

const mapStateToProps = state => ({
  loginAccount: selectLoginAccount(state),
  authLink
});

const mapDispatchToProps = dispatch => ({
  editName: name => dispatch(changeAccountName(name)),
  transferFunds: (amount, currency, toAddress) => dispatch(transferFunds(amount, currency, toAddress))
});

const Account = connect(mapStateToProps, mapDispatchToProps)(AccountView);

// const Account = asyncComponent(() => import(/* webpackChunkName: 'topics' */ 'modules/account/components/account-view')
//     .then(module => connect(mapStateToProps, mapDispatchToProps)(module.default))
//     .catch((err) => {
//       console.error(`ERROR: Failed to load 'Account' module -- `, err);
//     })
// );

export default Account;
