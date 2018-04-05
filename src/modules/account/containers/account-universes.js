import { connect } from 'react-redux'

import AccountUniverses from 'modules/account/components/account-universes/account-universes'

import getUniverses from 'modules/account/actions/get-universe-info'
import switchUniverse from 'modules/account/actions/switch-universe'

const mapStateToProps = state => ({
  address: state.loginAccount.address,
  universe: state.universe.id,
  winningChild: state.universe.winningChildUniverse,
})

const mapDispatchToProps = dispatch => ({
  getUniverses: (callback) => dispatch(getUniverses(callback)),
  switchUniverse: (universeId, callback) => dispatch(switchUniverse(universeId, callback)),
})

const AccountUniversesContainer = connect(mapStateToProps, mapDispatchToProps)(AccountUniverses)

export default AccountUniversesContainer
