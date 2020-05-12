import React from 'react';
import classNames from 'classnames';
import { Alerts } from 'modules/common/icons';
import ConnectAccount from 'modules/auth/components/connect-account/connect-account';
import {
  MovementLabel,
  LinearPropertyLabel,
  LinearPropertyLabelUnderlineTooltip,
} from 'modules/common/labels';
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
import { MODAL_LOGIN, MODAL_SIGNUP } from 'modules/common/constants';
import { getCoreStats } from 'modules/auth/helpers/login-account';
import { getInfoAlertsAndSeenCount } from 'modules/alerts/helpers/alerts';

export const Stats = () => {
  const { isMobile, loginAccount, isLogged, restoredAccount } = useAppStatusStore();
  const stats = getCoreStats(isLogged, loginAccount);
  if (!stats) return null;
  const { availableFunds, frozenFunds, totalFunds, realizedPL } = stats;

  return (
    <>
      {(isLogged || restoredAccount) && (
        <div className={Styles.statsContainer}>
          <div>
            <LinearPropertyLabel {...availableFunds} highlightAlternateBolded />
            <LinearPropertyLabel {...frozenFunds} highlightAlternateBolded />
            <LinearPropertyLabelUnderlineTooltip
              {...totalFunds}
              highlightAlternateBolded
              id={isMobile ? 'totalFundsMobile' : 'totalFunds'}
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
    </>
  );
};


const TopBar = () => {
  const {
    isLogged,
    restoredAccount,
    isMobile,
    isAlertsMenuOpen,
    actions: { setIsAlertsMenuOpen, setModal },
  } = useAppStatusStore();
  const { unseenCount } = getInfoAlertsAndSeenCount();
  
  return (
    <header className={Styles.TopBar}>
      <div className={Styles.Logo}>
        <Link to={makePath(MARKETS)}>
          <NewLogo />
        </Link>
      </div>
      <ThemeSwitch />
      {(isLogged || restoredAccount) && (
        <Stats />
      )}
      <div>
        {(!isLogged || (!isMobile && (isLogged || restoredAccount))) && (
          <HelpResources />
        )}
        <OddsMenu />
        {!isLogged && !restoredAccount && (
          <SecondaryButton action={() => setModal({ type: MODAL_LOGIN })} text={'Login'} />
        )}
        {!isLogged && !restoredAccount && (
          <PrimaryButton action={() => setModal({ type: MODAL_SIGNUP })} text={'Signup'} />
        )}
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
        <ConnectAccount />
      </div>
    </header>
  );
};

export default TopBar;
