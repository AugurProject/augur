import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import { Alerts } from "modules/common/icons";
import ConnectAccount from "modules/auth/containers/connect-account";
import GasPriceEdit from "modules/app/containers/gas-price-edit";
import BlockInfoData from "modules/block-info/containers/block-info-data";
import {
  MovementLabel,
  LinearPropertyLabel,
  LinearPropertyLabelMovement
} from "modules/common/labels";
import { CoreStats } from "modules/types";
import Styles from "modules/app/components/top-bar.styles.less";
import { Link } from "react-router-dom";
import makePath from "modules/routes/helpers/make-path";
import Logo from "modules/app/components/logo";
import { DEFAULT_VIEW } from "modules/routes/constants/views";


interface TopBarProps {
  alertsVisible: boolean;
  isLogged: boolean;
  stats: CoreStats;
  unseenCount: number;
  updateIsAlertVisible: Function;
}

const TopBar = ({
  alertsVisible,
  isLogged,
  stats,
  unseenCount,
  updateIsAlertVisible,
}: TopBarProps) => {
  const {
    availableFunds,
    frozenFunds,
    totalFunds,
    realizedPL
  } = stats;

  return (
    <header className={Styles.TopBar}>
      <div className={Styles.Logo}>
        <Link to={makePath(DEFAULT_VIEW)}>
          <Logo />
        </Link>
      </div>

      {isLogged && (
        <div className={Styles.statsContainer}>
          <div>
            <LinearPropertyLabel
              {...availableFunds}
              highlightAlternateBolded
            />
            <LinearPropertyLabel
              {...frozenFunds}
              highlightAlternateBolded
            />
            <LinearPropertyLabel
              {...totalFunds}
              highlightAlternateBolded
            />
            <LinearPropertyLabelMovement
              showColors
              label={realizedPL.label}
              numberValue={realizedPL.value}
            />
          </div>
          <div>
            <span>{realizedPL.label}</span>
            <MovementLabel
              showColors
              value={realizedPL.value}
              size="normal"
            />
          </div>
        </div>
      )}
      <div className={isLogged ? Styles.TopBar_blockGasAcccount_HideMobile : null}>
        <BlockInfoData />
        {isLogged && <GasPriceEdit />}
        <ConnectAccount />
        <button
          className={classNames(Styles.alerts, {
            [Styles.alertsDark]: alertsVisible,
            [Styles.alertsDisabled]: !isLogged
          })}
          onClick={(e: any) => {
            if (isLogged) {
              updateIsAlertVisible(!alertsVisible);
            }
          }}
          tabIndex={-1}
        >
          {unseenCount > 99 ? Alerts("99+") : Alerts(unseenCount)}
        </button>
      </div>
    </header>
  );
};

TopBar.propTypes = {
  alertsVisible: PropTypes.bool.isRequired,
  isLogged: PropTypes.bool.isRequired,
  stats: PropTypes.object.isRequired,
  unseenCount: PropTypes.number.isRequired,
  updateIsAlertVisible: PropTypes.func.isRequired
};

export default TopBar;
