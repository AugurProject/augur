import React from 'react';
import classNames from 'classnames';
import { Alerts } from 'modules/common/icons';
import ConnectAccount from 'modules/auth/containers/connect-account';
import {
  MovementLabel,
  LinearPropertyLabel,
  LinearPropertyLabelMovement,
} from 'modules/common/labels';
import { CoreStats } from 'modules/types';
import Styles from 'modules/app/components/top-bar.styles.less';
import { Link } from 'react-router-dom';
import makePath from 'modules/routes/helpers/make-path';
import Logo from 'modules/app/components/logo';
import { PrimaryButton, SecondaryButton } from 'modules/common/buttons';
import { LANDING_PAGE } from 'modules/routes/constants/views';

interface TopBarProps {
  alertsVisible: boolean;
  isLogged: boolean;
  stats: CoreStats;
  unseenCount: number;
  updateIsAlertVisible: Function;
  signupModal: Function;
  loginModal: Function;
}

const TopBar = ({
  alertsVisible,
  isLogged,
  stats,
  unseenCount,
  updateIsAlertVisible,
  signupModal,
  loginModal,
}: TopBarProps) => {
  const { availableFunds, frozenFunds, totalFunds, realizedPL } = stats;

  return (
    <header className={Styles.TopBar}>
      <div className={Styles.Logo}>
        <Link to={makePath(LANDING_PAGE)}>
          <Logo />
        </Link>
      </div>

      {isLogged && (
        <div className={Styles.statsContainer}>
          <div>
            <LinearPropertyLabel {...availableFunds} highlightAlternateBolded />
            <LinearPropertyLabel {...frozenFunds} highlightAlternateBolded />
            <LinearPropertyLabel {...totalFunds} highlightAlternateBolded />
            <LinearPropertyLabelMovement
              showColors
              label={realizedPL.label}
              numberValue={realizedPL.value}
            />
          </div>
          <div>
            <span>{realizedPL.label}</span>
            <MovementLabel showColors value={realizedPL.value} size='normal' />
          </div>
        </div>
      )}
      <div>
        {!isLogged && (
          <SecondaryButton action={() => loginModal()} text={'Login'} />
        )}
        {!isLogged && (
          <PrimaryButton action={() => signupModal()} text={'Signup'} />
        )}

        <ConnectAccount />

        {isLogged && (
          <button
            className={classNames(Styles.alerts, {
              [Styles.alertsDark]: alertsVisible,
              [Styles.alertsDisabled]: !isLogged,
            })}
            onClick={(e: any) => {
              if (isLogged) {
                updateIsAlertVisible(!alertsVisible);
              }
            }}
            tabIndex={-1}
          >
            {unseenCount > 99 ? Alerts('99+') : Alerts(unseenCount)}
          </button>
        )}
      </div>
    </header>
  );
};

export default TopBar;
