import { connect } from 'react-redux';
// import asyncComponent from 'modules/app/helpers/async-component';
import AccountView from 'modules/account/components/account-view';

import { changeAccountName } from 'modules/auth/actions/update-login-account';
import { transferFunds } from 'modules/auth/actions/transfer-funds';
import links from 'modules/link/selectors/links';

import { selectLoginAccount } from 'modules/account/selectors/login-account';

const mapStateToProps = state => ({
  loginAccount: selectLoginAccount(state),
  authLink: links().authLink
});

const mapDispatchToProps = dispatch => ({
  editName: name => dispatch(changeAccountName(name)),
  transferFunds: (amount, currency, toAddress) => dispatch(transferFunds(amount, currency, toAddress))
});

const Account = connect(mapStateToProps, mapDispatchToProps)(AccountView);

export default Account;
