import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import { Alerts } from "modules/common/components/icons";
import ConnectAccount from "modules/auth/containers/connect-account";
import GasPriceEdit from "modules/app/containers/gas-price-edit";
import BlockInfoData from "modules/block-info/containers/block-info-data";
import {
  MovementLabel,
  LinearPropertyLabel,
  LinearPropertyLabelMovement
} from "modules/common-elements/labels";
import { RepLogoIcon } from "modules/common-elements/icons";
import Styles from "modules/app/components/top-bar.styles";

interface TopBarProps {
  alertsVisible: Boolean;
  isLogged: Boolean;
  isMobileSmall: Boolean;
  stats: Array<any>;
  unseenCount: number;
  updateIsAlertVisible: Function;
}

const TopBar = ({
  alertsVisible,
  isLogged,
  isMobileSmall,
  stats,
  unseenCount,
  updateIsAlertVisible
}: TopBarProps) => (
  <header className={Styles.TopBar}>
    <div>{RepLogoIcon}</div>
    {isLogged && (
      <div className={Styles.statsContainer}>
        <div
          className={classNames(
            Styles.stats,
            Styles["regular-stats"]
          )}
        >
          <LinearPropertyLabel
            label={stats[0].availableFunds.label}
            value={stats[0].availableFunds.value}
            highlightAlternateBolded
          />
          <LinearPropertyLabel
            label={stats[0].frozenFunds.label}
            value={stats[0].frozenFunds.value}
            highlightAlternateBolded
          />
          <LinearPropertyLabel
            label={stats[0].totalFunds.label}
            value={stats[0].totalFunds.value}
            highlightAlternateBolded
          />
          <LinearPropertyLabelMovement
            showColors
            label={stats[1].realizedPL.label}
            numberValue={stats[1].realizedPL.value}
          />
        </div>
        <div
          className={classNames(
            Styles.stats,
            Styles.hideForSmallScreens,
            {
              [Styles.leftBorder]: isMobileSmall
            }
          )}
        >
          <div>
            <span>{stats[1].realizedPL.label}</span>
            <MovementLabel
              showColors
              value={stats[1].realizedPL.value}
              size="normal"
            />
          </div>
        </div>
      </div>
    )}
    <div className={Styles.rightContent}>
      <BlockInfoData />
      {isLogged && (
        <GasPriceEdit className={Styles.hideForSmallScreens} />
      )}
      <ConnectAccount
        className={classNames({
          [Styles.hideForSmallScreens]: isLogged
        })}
      />
      <div
        className={classNames(Styles.alerts, {
          [Styles.alertsDark]: alertsVisible,
          [Styles.alertsDisabled]: !isLogged
        })}
        onClick={(e: any) => {
          if (isLogged) {
            updateIsAlertVisible(!alertsVisible);
          }
        }}
        role="button"
        tabIndex={-1}
      >
        <div className={Styles.alertsContainer}>
          <div className={Styles.alertIcon}>
            {unseenCount > 99 ? Alerts("99+") : Alerts(unseenCount)}
          </div>
        </div>
      </div>
    </div>
  </header>
);

TopBar.propTypes = {
  alertsVisible: PropTypes.bool.isRequired,
  isLogged: PropTypes.bool.isRequired,
  isMobileSmall: PropTypes.bool.isRequired,
  stats: PropTypes.array.isRequired,
  unseenCount: PropTypes.number.isRequired,
  updateIsAlertVisible: PropTypes.func.isRequired
};

export default TopBar;
