import { connect } from 'react-redux'

import AccountUniverses from 'modules/account/components/account-universes/account-universes'

const mapStateToProps = state => ({
  address: state.loginAccount.address,
  universe: state.universe.id,
})

const mapDispatchToProps = dispatch => ({
  getUniverses: (universeId) => {},
  switchUniverse: (universeId) => {},
})

const AccountUniversesContainer = connect(mapStateToProps, mapDispatchToProps)(AccountUniverses)

export default AccountUniversesContainer
