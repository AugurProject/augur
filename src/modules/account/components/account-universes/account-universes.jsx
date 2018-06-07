import React, { Component } from 'react'
import PropTypes from 'prop-types'

import Styles from 'modules/account/components/account-universes/account-universes.styles'
import AccountUniverseDescription from '../account-universe-description/account-universe-description'

export default class AccountUniverses extends Component {

  static propTypes = {
    address: PropTypes.string.isRequired,
    universe: PropTypes.string.isRequired,
    getUniverses: PropTypes.func.isRequired,
    switchUniverse: PropTypes.func.isRequired,
    winningChild: PropTypes.string,
  }

  constructor(props) {
    super(props)

    this.state = {
      universesInfo: {},
    }
  }

  componentWillMount() {
    this.getUniverses()
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextProps.universe !== this.props.universe) {
      this.getUniverses()
    }
  }

  getUniverses() {
    const {
      getUniverses,
    } = this.props
    getUniverses((universesInfo) => {
      this.setState({
        universesInfo,
      })
    })
  }

  render() {
    const p = this.props
    const s = this.state

    const { parent, currentLevel, children } = s.universesInfo

    return (
      <section className={Styles.AccountUniverses}>
        <div className={Styles.AccountUniverses__heading}>
          <h1>Universes</h1>
        </div>
        <div className={Styles.AccountUniverses__main}>
          {parent &&
            <div className={Styles.AccountUniverses__description}>
              <h4>Parent Universe</h4>
              <AccountUniverseDescription
                switchUniverse={p.switchUniverse}
                isCurrentUniverse={false}
                universeDescription={parent.description}
                accountRep={parent.balance}
                universeRep={parent.supply}
                openInterest={parent.openInterest}
                numMarkets={parent.numMarkets}
                isWinningUniverse={parent.isWinningUniverse}
                key={parent.universe}
                universe={parent.universe}
              />
            </div>
          }
          {currentLevel && currentLevel.length > 0 &&
            <div className={Styles.AccountUniverses__description}>
              <h4>Current Universe and Siblings</h4>
              {currentLevel.map(universeInfo => (
                <AccountUniverseDescription
                  switchUniverse={p.switchUniverse}
                  isCurrentUniverse={universeInfo.universe === p.universe}
                  universeDescription={universeInfo.description}
                  accountRep={universeInfo.balance}
                  universeRep={universeInfo.supply}
                  openInterest={universeInfo.openInterest}
                  numMarkets={universeInfo.numMarkets}
                  isWinningUniverse={universeInfo.isWinningUniverse}
                  key={universeInfo.universe}
                  universe={universeInfo.universe}
                />
              ))}
            </div>
          }
          {children && children.length > 0 &&
            <div className={Styles.AccountUniverses__description}>
              <h4>Child Universes</h4>
              {children.map(universeInfo => (
                <AccountUniverseDescription
                  switchUniverse={p.switchUniverse}
                  isCurrentUniverse={false}
                  universeDescription={universeInfo.description}
                  accountRep={universeInfo.balance}
                  universeRep={universeInfo.supply}
                  openInterest={universeInfo.openInterest}
                  numMarkets={universeInfo.numMarkets}
                  isWinningUniverse={universeInfo.isWinningUniverse}
                  key={universeInfo.universe}
                  universe={universeInfo.universe}
                />
              ))}
            </div>
          }
        </div>
      </section>
    )
  }
}
