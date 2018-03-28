import React from 'react'
import PropTypes from 'prop-types'

import Styles from 'modules/account/components/account-universe-description/account-universe-description.styles'

const AccountUniverseDescription = p => (
  <div className={Styles.AccountUniverseDescription}>
    <div className={Styles.AccountUniverseDescription__container}>
      <div className={Styles.AccountUniverseDescription__label}>
        <h3>
          {p.universeDescription}
        </h3>
        {p.isWinningUniverse &&
          <div className={Styles.AccountUniverseDescription__winning_universe}>Winning Universe</div>
        }
      </div>
      {!p.hideSwitchButton &&
        <button className={Styles.AccountUniversesDescription__button}>Switch Universe</button>
      }
    </div>
    <div className={Styles.AccountUniverseDescription__description}>
      <div>Your wallet:  {p.accountRep} REP</div>
      <div>Total amount of REP:  {p.universeRep} REP</div>
      <div>Number of markets created:  {p.numMarkets}</div>
    </div>
  </div>
)

AccountUniverseDescription.propTypes = {
  switchUniverse: PropTypes.func.isRequired,
  accountRep: PropTypes.string.isRequired,
  universeRep: PropTypes.string.isRequired,
  numMarkets: PropTypes.string.isRequired,
  isWinningUniverse: PropTypes.bool.isRequired,
  universeDescription: PropTypes.string.isRequired,
  hideSwitchButton: PropTypes.bool,
}

export default AccountUniverseDescription
