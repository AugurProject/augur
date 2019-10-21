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
import HelpResources from 'modules/app/containers/help-resources';

interface TopBarProps {
  alertsVisible: boolean;
  isLogged: boolean;
  restoredAccount: boolean;
  stats: CoreStats;
  unseenCount: number;
  updateIsAlertVisible: Function;
  signupModal: Function;
  loginModal: Function;
}

const TopBar: React.FC<TopBarProps> = ({
  alertsVisible,
  isLogged,
  restoredAccount,
  stats,
  unseenCount,
  updateIsAlertVisible,
  signupModal,
  loginModal,
}) => {
  const { availableFunds, frozenFunds, totalFunds, realizedPL } = stats;

  return (
    <header className={Styles.TopBar}>
      <div className={Styles.Logo}>
        <Link to={makePath(LANDING_PAGE)}>
          <Logo />
        </Link>
      </div>

      {(isLogged || restoredAccount) && (
        <div className={Styles.statsContainer}>
          <div>
            <LinearPropertyLabel {...availableFunds} highlightAlternateBolded />
            <LinearPropertyLabel {...frozenFunds} highlightAlternateBolded />
            <LinearPropertyLabel {...totalFunds} highlightAlternateBolded />
            <LinearPropertyLabel {...realizedPL} highlightAlternateBolded />
          </div>
          <div>
            <span>{realizedPL.label}</span>
            <MovementLabel showColors value={realizedPL.value} size='normal' />
          </div>
        </div>
      )}
      <div>
        {!isLogged && !restoredAccount && (
          <SecondaryButton action={() => loginModal()} text={'Login'} />
        )}
        {!isLogged && !restoredAccount && (
          <PrimaryButton action={() => signupModal()} text={'Signup'} />
        )}

        {(isLogged || restoredAccount) && <HelpResources />}
        <ConnectAccount />

        {(isLogged || restoredAccount) && (
          <button
            className={classNames(Styles.alerts, {
              [Styles.alertsDark]: alertsVisible,
            })}
            onClick={() => {
              updateIsAlertVisible(!alertsVisible);
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
