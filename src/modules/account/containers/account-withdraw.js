import { connect } from 'react-redux'

import AccountWithdraw from 'modules/account/components/account-withdraw/account-withdraw'

import { transferFunds } from 'modules/auth/actions/transfer-funds'
import { selectLoginAccount } from 'modules/auth/selectors/login-account'

const mapStateToProps = (state) => {
  const loginAccount = selectLoginAccount(state)
  return {
    eth: loginAccount.eth,
    rep: loginAccount.rep,
    isMobileSmall: state.isMobileSmall,
  }
}

const mapDispatchToProps = dispatch => ({
  transferFunds: (amount, asset, to) => dispatch(transferFunds(amount, asset, to)),
})

const AccountWithdrawContainer = connect(mapStateToProps, mapDispatchToProps)(AccountWithdraw)

export default AccountWithdrawContainer
