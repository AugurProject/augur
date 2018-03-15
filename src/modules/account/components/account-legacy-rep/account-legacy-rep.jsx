import React from 'react'
import PropTypes from 'prop-types'

import { augur } from 'services/augurjs'

import Styles from 'modules/account/components/account-legacy-rep/account-legacy-rep.styles'

const AccountLegacyRep = (p) => {
  const showFaucetButton = parseInt(augur.rpc.getNetworkID(), 10) !== 1
  const legacyRepApproved = p.legacyRepAllowance && p.legacyRepAllowance !== '0'

  return (
    <section className={Styles.AccountLegacyRep}>
      <div className={Styles.AccountLegacyRep__heading}>
        <h1>Account: Legacy REP</h1>
      </div>
      <div className={Styles.AccountLegacyRep__main}>
        <div className={Styles.AccountLegacyRep__description}>
          <h2>
            Legacy Rep Balance: <span className={Styles.AccountLegacyRep__legacyRep}>{p.legacyRep}</span>
          </h2>
          {showFaucetButton &&
            <div>
              <p>On Test Nets you may get Legacy REP by making a TX with the button below.</p>
              <button onClick={p.legacyRepFaucet} className={Styles.AccountLegacyRep__button}>Get Legacy REP</button>
            </div>
          }
        </div>
        <div className={Styles.AccountLegacyRep__description}>
          <h2>Migrate Legacy REP</h2>
          {legacyRepApproved &&
            <div>
              <p>This will convert your Legacy REP into usable REP on the deployed Augur platform.</p>
              <button onClick={p.migrateRep} className={Styles.AccountLegacyRep__button}>Migrate REP</button>
            </div>
          }
          {!legacyRepApproved &&
            <div>
              <p>Before migrating your legacy REP you need to approve the new REP token to migrate your existing balance.</p>
              <button onClick={p.legacyRepApprove} className={Styles.AccountLegacyRep__button}>Approve REP</button>
            </div>
          }
        </div>
      </div>
    </section>
  )
}

AccountLegacyRep.propTypes = {
  address: PropTypes.string.isRequired,
  rep: PropTypes.string.isRequired,
  legacyRep: PropTypes.string.isRequired,
  legacyRepAllowance: PropTypes.string,
  legacyRepFaucet: PropTypes.func.isRequired,
  legacyRepApprove: PropTypes.func.isRequired,
  migrateRep: PropTypes.func.isRequired,
}

export default AccountLegacyRep
