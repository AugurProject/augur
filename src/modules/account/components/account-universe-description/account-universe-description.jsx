import React from 'react'
import PropTypes from 'prop-types'

import Styles from 'modules/account/components/account-universe-description/account-universe-description.styles'
import { formatAttoRep, formatAttoEth } from 'utils/format-number'

const AccountUniverseDescription = p => (
  <div className={Styles.AccountUniverseDescription}>
    <div className={Styles.AccountUniverseDescription__container}>
      <div className={Styles.AccountUniverseDescription__label}>
        <h3>
          Universe {p.universeDescription}
        </h3>
        {p.isWinningUniverse &&
          <div className={Styles.AccountUniverseDescription__winning_universe}>Winning Universe</div>
        }
      </div>
      {!p.isCurrentUniverse &&
        <button onClick={() => { p.switchUniverse(p.universe) }} className={Styles.AccountUniversesDescription__button}>Switch</button>
      }
      {p.isCurrentUniverse &&
        <span className={Styles.AccountUniversesDescription__current_universe_button}>Current</span>
      }
    </div>
    <div className={Styles.AccountUniverseDescription__description}>
      <div>Your REP:  {p.accountRep === '0' ? '0' : formatAttoRep(p.accountRep, { decimals: 2, roundUp: true }).formatted} REP</div>
      <div>Total REP Supply:  {p.universeRep === '0' ? '0' : formatAttoRep(p.universeRep, { decimals: 2, roundUp: true }).formatted} REP</div>
      <div>Total Open Interest:  {p.openInterest === '0' ? '0' : formatAttoEth(p.openInterest, { decimals: 2, roundUp: true }).formatted} ETH</div>
      <div>Number of Markets:  {p.numMarkets}</div>
    </div>
  </div>
)

AccountUniverseDescription.propTypes = {
  switchUniverse: PropTypes.func.isRequired,
  accountRep: PropTypes.string.isRequired,
  openInterest: PropTypes.string.isRequired,
  universeRep: PropTypes.string.isRequired,
  numMarkets: PropTypes.number.isRequired,
  isWinningUniverse: PropTypes.bool.isRequired,
  isCurrentUniverse: PropTypes.bool.isRequired,
  universeDescription: PropTypes.string.isRequired,
  universe: PropTypes.string.isRequired,
}

export default AccountUniverseDescription
