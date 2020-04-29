import React from 'react';
import classNames from 'classnames';
import { Alerts } from 'modules/common/icons';
import ConnectAccount from 'modules/auth/containers/connect-account';
import {
  MovementLabel,
  LinearPropertyLabel,
  LinearPropertyLabelUnderlineTooltip,
} from 'modules/common/labels';
import { CoreStats } from 'modules/types';
import Styles from 'modules/app/components/top-bar.styles.less';
import { Link } from 'react-router-dom';
import makePath from 'modules/routes/helpers/make-path';
import { NewLogo } from 'modules/app/components/logo';
import { ThemeSwitch } from 'modules/app/components/theme-switch';
import { PrimaryButton, SecondaryButton } from 'modules/common/buttons';
import { MARKETS } from 'modules/routes/constants/views';
import { HelpResources } from 'modules/app/components/help-resources';
import { OddsMenu } from 'modules/app/components/odds-menu';
import { TOTAL_FUNDS_TOOLTIP } from 'modules/common/constants';
import { useAppStatusStore } from 'modules/app/store/app-status';

interface TopBarProps {
  stats: CoreStats;
  unseenCount: number;
  signupModal: Function;
  loginModal: Function;
}

const TopBar: React.FC<TopBarProps> = ({
  stats,
  unseenCount,
  signupModal,
  loginModal,
}) => {
  const { isLogged, restoredAccount, isMobile, isAlertsMenuOpen, actions: { setIsAlertsMenuOpen } } = useAppStatusStore();
  const { availableFunds, frozenFunds, totalFunds, realizedPL } = stats;
  return (
    <header className={Styles.TopBar}>
      <div className={Styles.Logo}>
        <Link to={makePath(MARKETS)}>
          <NewLogo />
        </Link>
      </div>
      <ThemeSwitch />
      {(isLogged || restoredAccount) && (
        <div className={Styles.statsContainer}>
          <div>
            <LinearPropertyLabel {...availableFunds} highlightAlternateBolded />
            <LinearPropertyLabel {...frozenFunds} highlightAlternateBolded />
            <LinearPropertyLabelUnderlineTooltip
              {...totalFunds}
              highlightAlternateBolded
              id={'totalFunds'}
              tipText={TOTAL_FUNDS_TOOLTIP}
            />
            <div>
              <span>{realizedPL.label}</span>
              <MovementLabel value={realizedPL.value} useFull />
            </div>
          </div>
          <div>
            <span>{realizedPL.label}</span>
            <MovementLabel value={realizedPL.value} useFull />
          </div>
        </div>
      )}
      <div>
        {(!isLogged || (!isMobile && (isLogged || restoredAccount))) && <HelpResources />}
        <OddsMenu />
        {!isLogged && !restoredAccount && (
          <SecondaryButton action={() => loginModal()} text={'Login'} />
        )}
        {!isLogged && !restoredAccount && (
          <PrimaryButton action={() => signupModal()} text={'Signup'} />
        )}

        {!isMobile && <ConnectAccount />}
        {(isLogged || restoredAccount) && (
          <button
            className={classNames(Styles.alerts, {
              [Styles.alertsDark]: isAlertsMenuOpen,
              [Styles.Empty]: unseenCount < 1,
            })}
            onClick={() => {
              setIsAlertsMenuOpen(!isAlertsMenuOpen);
            }}
            tabIndex={-1}
          >
            {Alerts(unseenCount)}
          </button>
        )}
      </div>
    </header>
  );
};

export default TopBar;
