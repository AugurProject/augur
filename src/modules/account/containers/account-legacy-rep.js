import { connect } from 'react-redux'

import getLegacyRep from 'modules/account/actions/get-legacy-rep'
import approveLegacyRep from 'modules/account/actions/approve-legacy-rep'
import migrateLegacyRep from 'modules/account/actions/migrate-legacy-rep'
import AccountLegacyRep from 'modules/account/components/account-legacy-rep/account-legacy-rep'

const mapStateToProps = state => ({
  address: state.loginAccount.address,
  rep: state.loginAccount.rep,
  legacyRep: state.loginAccount.legacyRep,
  legacyRepAllowance: state.loginAccount.legacyRepAllowance,
})

const mapDispatchToProps = dispatch => ({
  legacyRepApprove: () => dispatch(approveLegacyRep()),
  legacyRepFaucet: () => dispatch(getLegacyRep()),
  migrateRep: () => dispatch(migrateLegacyRep()),
})

const AccountLegacyRepContainer = connect(mapStateToProps, mapDispatchToProps)(AccountLegacyRep)

export default AccountLegacyRepContainer
