import React from 'react'
import PropTypes from 'prop-types'

import Styles from 'modules/account/components/account-universe-description/account-universe-description.styles'
import { formatAttoRep } from 'utils/format-number'

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
      {!p.isCurrentUniverse &&
        <button onClick={() => {p.switchUniverse(p.universe, p.history)}} className={Styles.AccountUniversesDescription__button}>Switch Universe</button>
      }
      {p.isCurrentUniverse &&
        <button disabled className={Styles.AccountUniversesDescription__current_universe_button}>Current Universe</button>
      }
    </div>
    <div className={Styles.AccountUniverseDescription__description}>
      <div>Your wallet:  {formatAttoRep(p.accountRep, { decimals: 2, roundUp: true }).formatted} REP</div>
      <div>Total amount of REP:  {formatAttoRep(p.universeRep, { decimals: 2, roundUp: true }).formatted} REP</div>
      <div>Number of markets created:  {p.numMarkets}</div>
    </div>
  </div>
)

AccountUniverseDescription.propTypes = {
  switchUniverse: PropTypes.func.isRequired,
  accountRep: PropTypes.string.isRequired,
  universeRep: PropTypes.string.isRequired,
  numMarkets: PropTypes.number.isRequired,
  isWinningUniverse: PropTypes.bool.isRequired,
  isCurrentUniverse: PropTypes.bool.isRequired,
  universeDescription: PropTypes.string.isRequired,
  universe: PropTypes.string.isRequired,
  history: PropTypes.object.isRequired,
}

export default AccountUniverseDescription
