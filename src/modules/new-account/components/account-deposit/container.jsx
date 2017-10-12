import { connect } from 'react-redux'

import AccountDeposit from 'modules/new-account/components/account-deposit/account-deposit'

const PositionsContainer = connect(mapStateToProps, mapDispatchToProps)(AccountDeposit)

export default AccountDepositContainer
