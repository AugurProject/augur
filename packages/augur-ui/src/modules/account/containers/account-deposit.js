import { connect } from 'react-redux'

import AccountDeposit from 'modules/account/components/account-deposit/account-deposit'

const mapStateToProps = state => ({
  address: state.loginAccount.displayAddress,
})

const AccountDepositContainer = connect(mapStateToProps)(AccountDeposit)

export default AccountDepositContainer
