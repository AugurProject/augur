import { connect } from 'react-redux'

import AccountUniverses from 'modules/account/components/account-universes/account-universes'

import { loadUniverseInfo } from 'modules/account/actions/load-universe-info'

const mapStateToProps = state => ({
  address: state.loginAccount.address,
  universe: state.universe.id,
  winningChild: state.universe.winningChildUniverse,
})

const windowRef = typeof window === 'undefined' ? {} : window

const mapDispatchToProps = dispatch => ({
  getUniverses: callback => dispatch(loadUniverseInfo(callback)),
  switchUniverse: (universeId) => {
    if (windowRef.localStorage && windowRef.localStorage.setItem) {
      windowRef.localStorage.setItem('selectedUniverse', universeId)
      location.reload()
    }
  },
})

const AccountUniversesContainer = connect(mapStateToProps, mapDispatchToProps)(AccountUniverses)

export default AccountUniversesContainer
