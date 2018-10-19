import React, { Component } from "react";
import PropTypes from "prop-types";

import { orderBy } from "lodash";
import { formatAttoRep } from "utils/format-number";
import Styles from "modules/account/components/account-universes/account-universes.styles";
import AccountUniverseDescription from "../account-universe-description/account-universe-description";

export default class AccountUniverses extends Component {
  static propTypes = {
    universe: PropTypes.string.isRequired,
    getUniverses: PropTypes.func.isRequired,
    switchUniverse: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      universesInfo: {}
    };
  }

  componentWillMount() {
    this.getUniverses();
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextProps.universe !== this.props.universe) {
      this.getUniverses();
    }
  }

  getUniverses() {
    const { getUniverses } = this.props;
    getUniverses(universesInfo => {
      const children = universesInfo.children.map(c => ({
        ...c,
        totalRep: formatAttoRep(c.supply, { decimals: 2, roundUp: true })
          .formattedValue
      }));
      universesInfo.children = orderBy(children, ["totalRep"], ["desc"]);

      const currentLevel = universesInfo.currentLevel.map(c => ({
        ...c,
        totalRep: formatAttoRep(c.supply, { decimals: 2, roundUp: true })
          .formattedValue
      }));
      universesInfo.currentLevel = orderBy(
        currentLevel,
        ["totalRep"],
        ["desc"]
      );

      this.setState({
        universesInfo
      });
    });
  }

  render() {
    const { switchUniverse, universe } = this.props;
    const { parent, currentLevel, children } = this.state.universesInfo;

    return (
      <section className={Styles.AccountUniverses}>
        <div className={Styles.AccountUniverses__heading}>
          <h1>Universes</h1>
        </div>
        <div className={Styles.AccountUniverses__main}>
          {parent && (
            <div className={Styles.AccountUniverses__description}>
              <h4>Parent Universe</h4>
              <AccountUniverseDescription
                switchUniverse={switchUniverse}
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
          )}
          {currentLevel &&
            currentLevel.length > 0 && (
              <div className={Styles.AccountUniverses__description}>
                <h4>Current Universe and Siblings</h4>
                {currentLevel.map(universeInfo => (
                  <AccountUniverseDescription
                    switchUniverse={switchUniverse}
                    isCurrentUniverse={universeInfo.universe === universe}
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
            )}
          {children &&
            children.length > 0 && (
              <div className={Styles.AccountUniverses__description}>
                <h4>Child Universes</h4>
                {children.map(universeInfo => (
                  <AccountUniverseDescription
                    switchUniverse={switchUniverse}
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
            )}
        </div>
      </section>
    );
  }
}
