import { connect } from 'react-redux'

import AccountWithdraw from 'modules/new-account/components/account-withdraw/account-withdraw'

const mapStateToProps = state => ({
  address: state.loginAccount.address
})

const AccountWithdrawContainer = connect(mapStateToProps)(AccountWithdraw)

export default AccountWithdrawContainer
