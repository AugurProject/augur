import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { augur } from 'services/augurjs'

import Styles from 'modules/account/components/account-legacy-rep/account-legacy-rep.styles'

export default class AccountLegacyRep extends Component {
  static propTypes = {
    address: PropTypes.string.isRequired,
    rep: PropTypes.string.isRequired,
    legacyRep: PropTypes.string.isRequired,
    legacyRepFaucet: PropTypes.func.isRequired,
    migrateRep: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props)

    this.legacyRepFaucet = this.legacyRepFaucet.bind(this)
    this.migrateRep = this.migrateRep.bind(this)
  }

  legacyRepFaucet(e, ...args) {
    this.props.legacyRepFaucet()
  }

  migrateRep(e, ...args) {
    this.props.migrateRep()
  }

  render() {
    const p = this.props

    const showFaucetButton = parseInt(augur.rpc.getNetworkID(), 10) !== 1

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
                <button onClick={this.legacyRepFaucet} className={Styles.AccountLegacyRep__button}>Get Legacy REP</button>
              </div>
            }
          </div>
          <div className={Styles.AccountLegacyRep__description}>
            <h2>Migrate Legacy REP</h2>
            <p>This will convert your Legacy REP into usable REP on the deployed Augur platform</p>
            <button onClick={this.migrateRep} className={Styles.AccountLegacyRep__button}>Migrate REP</button>
          </div>
        </div>
      </section>
    )
  }
}
