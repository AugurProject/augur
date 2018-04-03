import React from 'react'
import PropTypes from 'prop-types'

import Styles from 'modules/account/components/account-universes/account-universes.styles'
import AccountUniverseDescription from '../account-universe-description/account-universe-description'

const AccountUniverses = p => (
  <section className={Styles.AccountUniverses}>
    <div className={Styles.AccountUniverses__heading}>
      <h1>Universes</h1>
    </div>
    <div className={Styles.AccountUniverses__main}>
      <div className={Styles.AccountUniverses__description}>
        <h4>Parent Universe</h4>
        <AccountUniverseDescription
          switchUniverse={p.switchUniverse}
          hideSwitchButton
          universeDescription="Universe A"
          accountRep="500"
          universeRep="250,000"
          numMarkets="425"
          isWinningUniverse
        />
      </div>
      <div className={Styles.AccountUniverses__description}>
        <h4>Current and Sibling Universes</h4>
        <AccountUniverseDescription
          switchUniverse={p.switchUniverse}
          universeDescription="Universe B"
          accountRep="60"
          universeRep="50,000"
          numMarkets="525"
          isWinningUniverse={false}
        />
        <AccountUniverseDescription
          switchUniverse={p.switchUniverse}
          universeDescription="Universe C"
          accountRep="0"
          universeRep="0"
          numMarkets="0"
          isWinningUniverse={false}
        />
      </div>
      <div className={Styles.AccountUniverses__description}>
        <h4>Child Universes</h4>
        <AccountUniverseDescription
          switchUniverse={p.switchUniverse}
          universeDescription="Universe B"
          accountRep="60"
          universeRep="50,000"
          numMarkets="525"
          isWinningUniverse={false}
        />
        <AccountUniverseDescription
          switchUniverse={p.switchUniverse}
          universeDescription="Universe C"
          accountRep="0"
          universeRep="0"
          numMarkets="0"
          isWinningUniverse={false}
        />
      </div>
    </div>
  </section>
)

AccountUniverses.propTypes = {
  address: PropTypes.string.isRequired,
  universe: PropTypes.string.isRequired,
  getUniverses: PropTypes.func.isRequired,
  switchUniverse: PropTypes.func.isRequired,
}

export default AccountUniverses
