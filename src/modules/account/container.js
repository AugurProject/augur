import { connect } from 'react-redux';
import { changeAccountName } from 'modules/auth/actions/update-login-account';
import { transferFunds } from 'modules/auth/actions/transfer-funds';
import { selectLoginAccount } from 'modules/auth/selectors/login-account';
import AccountView from 'modules/account/components/account-view';

const mapStateToProps = state => ({
  loginAccount: selectLoginAccount(state)
});

const mapDispatchToProps = dispatch => ({
  editName: name => dispatch(changeAccountName(name)),
  transferFunds: (amount, currency, toAddress) => dispatch(transferFunds(amount, currency, toAddress))
});

const Account = connect(mapStateToProps, mapDispatchToProps)(AccountView);

export default Account;
