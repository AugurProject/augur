import React from "react";
import PropTypes from "prop-types";

import Styles from "modules/account/components/account-universe-description/account-universe-description.styles";
import { formatAttoRep, formatAttoEth } from "utils/format-number";

const AccountUniverseDescription = ({
  switchUniverse,
  accountRep,
  openInterest,
  universeRep,
  numMarkets,
  isWinningUniverse,
  isCurrentUniverse,
  universeDescription,
  universe
}) => (
  <div className={Styles.AccountUniverseDescription}>
    <div className={Styles.AccountUniverseDescription__container}>
      <div className={Styles.AccountUniverseDescription__label}>
        <h3>Universe {universeDescription}</h3>
        {isWinningUniverse && (
          <div className={Styles.AccountUniverseDescription__winning_universe}>
            Winning Universe
          </div>
        )}
      </div>
      {!isCurrentUniverse && (
        <button
          onClick={() => {
            switchUniverse(universe);
          }}
          className={Styles.AccountUniversesDescription__button}
        >
          Switch
        </button>
      )}
      {isCurrentUniverse && (
        <span
          className={
            Styles.AccountUniversesDescription__current_universe_button
          }
        >
          Current
        </span>
      )}
    </div>
    <div className={Styles.AccountUniverseDescription__description}>
      <div>
        Your REP:{" "}
        {accountRep === "0"
          ? "0"
          : formatAttoRep(accountRep, { decimals: 2, roundUp: true })
              .formatted}{" "}
        REP
      </div>
      <div>
        Total REP Supply:{" "}
        {universeRep === "0"
          ? "0"
          : formatAttoRep(universeRep, { decimals: 2, roundUp: true })
              .formatted}{" "}
        REP
      </div>
      <div>
        Total Open Interest:{" "}
        {openInterest === "0"
          ? "0"
          : formatAttoEth(openInterest, { decimals: 2, roundUp: true })
              .formatted}{" "}
        ETH
      </div>
      <div>Number of Markets: {numMarkets}</div>
    </div>
  </div>
);

AccountUniverseDescription.propTypes = {
  switchUniverse: PropTypes.func.isRequired,
  accountRep: PropTypes.string.isRequired,
  openInterest: PropTypes.string.isRequired,
  universeRep: PropTypes.string.isRequired,
  numMarkets: PropTypes.number.isRequired,
  isWinningUniverse: PropTypes.bool.isRequired,
  isCurrentUniverse: PropTypes.bool.isRequired,
  universeDescription: PropTypes.string.isRequired,
  universe: PropTypes.string.isRequired
};

export default AccountUniverseDescription;
