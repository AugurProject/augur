import { connect } from 'react-redux';
import AccountView from 'modules/account/components/account-view';

import { transferFunds } from 'modules/auth/actions/transfer-funds';
import { updateAccountName } from 'modules/account/actions/update-account-name';

import links from 'modules/link/selectors/links';

import { selectLoginAccount } from 'modules/auth/selectors/login-account';
import selectABCUIContext from 'modules/auth/helpers/abc';

const mapStateToProps = state => ({
  loginAccount: selectLoginAccount(state),
  authLink: links().authLink,
  manageAirbitzAccount: airbitzAccount => selectABCUIContext().openManageWindow(airbitzAccount, (err) => {
    if (err) console.error('onAirbitzManageAccount:', err);
  }),
  isMobile: state.isMobile
});

const mapDispatchToProps = dispatch => ({
  updateAccountName: name => dispatch(updateAccountName(name)),
  transferFunds: (amount, asset, to) => dispatch(transferFunds(amount, asset, to))
});

const Account = connect(mapStateToProps, mapDispatchToProps)(AccountView);

export default Account;
