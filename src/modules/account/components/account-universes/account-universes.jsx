import React, { Component }  from 'react'
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
    this.getUniverses();
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
    const p = this.props;
    const s = this.state;

    const parentUniverse = s.universesInfo.parentUniverse
    const currentLevel = s.universesInfo.currentLevel
    const children = s.universesInfo.children

    console.log("UNIVERSES INFO: ", s.universesInfo)

    return (
      <section className={Styles.AccountUniverses}>
        <div className={Styles.AccountUniverses__heading}>
          <h1>Universes</h1>
        </div>
        <div className={Styles.AccountUniverses__main}>
        {parentUniverse && 
          <div className={Styles.AccountUniverses__description}>
            <h4>Parent Universe</h4>
            <AccountUniverseDescription
              switchUniverse={p.switchUniverse}
              isCurrentUniverse={false}
              universeDescription={parentUniverse.description || "NO DESC"}
              accountRep={parentUniverse.balance}
              universeRep={parentUniverse.supply}
              numMarkets={parentUniverse.numMarkets}
              isWinningUniverse={false}
            />
          </div>
        }
        {currentLevel && currentLevel.length > 0 &&
          <div className={Styles.AccountUniverses__description}>
            <h4>Current and Sibling Universes</h4>
            {currentLevel.map((universeInfo) => (
              <AccountUniverseDescription
                switchUniverse={p.switchUniverse}
                isCurrentUniverse={universeInfo.universe === p.universe}
                universeDescription={universeInfo.description || "NO DESC"}
                accountRep={universeInfo.balance}
                universeRep={universeInfo.supply}
                numMarkets={universeInfo.numMarkets}
                isWinningUniverse={universeInfo.isWinningUniverse}
                key={universeInfo.universe}
              />
            ))}
          </div>
        }
        {children && children.length > 0 &&
          <div className={Styles.AccountUniverses__description}>
            <h4>Child Universes</h4>
            {children.map((universeInfo) => (
              <AccountUniverseDescription
                switchUniverse={p.switchUniverse}
                isCurrentUniverse={false}
                universeDescription={universeInfo.description || "NO DESC"}
                accountRep={universeInfo.balance}
                universeRep={universeInfo.supply}
                numMarkets={universeInfo.numMarkets}
                isWinningUniverse={universeInfo.universe === p.winningChild}
                key={universeInfo.universe}
              />
            ))}
          </div>
        }
        </div>
      </section>
    )
  }
}
