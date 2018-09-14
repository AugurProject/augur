import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import classNames from "classnames";

import { Notifications } from "modules/common/components/icons";
import makePath from "modules/routes/helpers/make-path";
import { CATEGORIES } from "modules/routes/constants/views";
import Styles from "modules/app/components/top-bar/top-bar.styles";

const TopBar = props => (
  <header className={Styles.TopBar}>
    {props.isLogged && (
      <div>
        <div
          className={classNames(
            Styles.TopBar__stats,
            Styles["TopBar__regular-stats"]
          )}
        >
          <div className={Styles.TopBar__stat}>
            <span className={Styles["TopBar__stat-label"]}>ETH</span>
            <span className={Styles["TopBar__stat-value"]} id="core-bar-eth">
              {props.stats[0].totalRealEth.value.formatted}
            </span>
          </div>
          <div className={Styles.TopBar__stat}>
            <span className={Styles["TopBar__stat-label"]}>REP</span>
            <span className={Styles["TopBar__stat-value"]} id="core-bar-rep">
              {props.stats[0].totalRep.value.formatted}
            </span>
          </div>
        </div>
        <div
          className={classNames(
            Styles.TopBar__stats,
            Styles.TopBar__performance
          )}
        >
          <div
            className={classNames(
              Styles.TopBar__stat,
              Styles["TopBar__performance-stat"]
            )}
          >
            <div className={Styles["TopBar__stat-label"]}>
              <span>{props.stats[1].totalPLMonth.label}</span>
            </div>
            <span className={Styles["TopBar__stat-value"]}>
              {props.stats[1].totalPLMonth.value.formatted}
              <span className={Styles["TopBar__stat-unit"]}>ETH</span>
            </span>
          </div>
          <div
            className={classNames(
              Styles.TopBar__stat,
              Styles["TopBar__performance-stat"]
            )}
          >
            <div className={Styles["TopBar__stat-label"]}>
              <span>{props.stats[1].totalPLDay.label}</span>
            </div>
            <span className={Styles["TopBar__stat-value"]}>
              {props.stats[1].totalPLDay.value.formatted}
              <span className={Styles["TopBar__stat-unit"]}>ETH</span>
            </span>
          </div>
        </div>
        <div className={Styles.TopBar__notifications}>
          <div className={Styles["TopBar__notifications-container"]}>
            <button
              className={Styles["TopBar__notification-icon"]}
              onClick={e => {
                e.preventDefault();
                e.stopPropagation();
                props.toggleNotifications();
              }}
            >
              {props.unseenCount > 99
                ? Notifications("99+", "7.4591451")
                : Notifications(props.unseenCount, "6.4591451")}
            </button>
          </div>
        </div>
      </div>
    )}
    <span className={Styles["TopBar__logo-text"]}>
      <Link to={makePath(CATEGORIES)}>Augur</Link>
    </span>
  </header>
);

TopBar.propTypes = {
  isLogged: PropTypes.bool.isRequired,
  stats: PropTypes.array.isRequired,
  unseenCount: PropTypes.number.isRequired,
  toggleNotifications: PropTypes.func.isRequired
};

export default TopBar;
