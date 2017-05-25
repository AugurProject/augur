import { connect } from 'react-redux';
import AccountView from 'modules/account/components/account-view';

import { transferFunds } from 'modules/auth/actions/transfer-funds';
import { changeAccountName } from 'modules/auth/actions/update-login-account';
import { convertToToken, convertToEther } from 'modules/auth/actions/convert-ether';

import links from 'modules/link/selectors/links';

import { selectLoginAccount } from 'modules/account/selectors/login-account';

const mapStateToProps = state => ({
  loginAccount: selectLoginAccount(state),
  authLink: links().authLink
});

const mapDispatchToProps = dispatch => ({
  updateAccountName: name => dispatch(changeAccountName(name)),
  convertToToken: amount => dispatch(convertToToken(amount)),
  convertToEther: amount => dispatch(convertToEther(amount)),
  transferFunds: (amount, asset, to) => dispatch(transferFunds(amount, asset, to))
});

const Account = connect(mapStateToProps, mapDispatchToProps)(AccountView);

export default Account;
