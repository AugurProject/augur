import { connect } from 'react-redux'

import AccountWithdraw from 'modules/new-account/components/account-withdraw/account-withdraw'

import { transferFunds } from 'modules/auth/actions/transfer-funds'
import { selectLoginAccount } from 'modules/auth/selectors/login-account'

const mapStateToProps = (state) => {
  const loginAccount = selectLoginAccount(state)
  return {
    ethTokens: loginAccount.ethTokens,
    eth: loginAccount.eth,
    rep: loginAccount.rep
  }
}

const mapDispatchToProps = dispatch => ({
  transferFunds: (amount, asset, to) => dispatch(transferFunds(amount, asset, to)),
})

const AccountWithdrawContainer = connect(mapStateToProps, mapDispatchToProps)(AccountWithdraw)

export default AccountWithdrawContainer
