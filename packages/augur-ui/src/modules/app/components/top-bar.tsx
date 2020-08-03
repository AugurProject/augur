import React from 'react';
import classNames from 'classnames';
import { Alerts } from 'modules/common/icons';
import ConnectAccount from 'modules/auth/connect-account';
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
import {
  TOTAL_FUNDS_TOOLTIP,
  WALLET_STATUS_VALUES,
  MODAL_BUY_DAI,
  MODAL_AUGUR_P2P,
} from 'modules/common/constants';
import { useAppStatusStore } from 'modules/app/store/app-status';
import { MODAL_LOGIN, MODAL_SIGNUP } from 'modules/common/constants';
import { getInfoAlertsAndSeenCount } from 'modules/alerts/helpers/alerts';
import { getEthReserveInDai } from 'modules/auth/helpers/get-eth-reserve';
import AlertsContainer from 'modules/alerts/components/alerts-view';

import HelpResources from 'modules/app/containers/help-resources';

import Styles from 'modules/app/components/top-bar.styles.less';
import { getCoreStats } from 'modules/auth/helpers/login-account';

export const Stats = () => {
  const {
    isLogged, 
    restoredAccount,
    isMobile,
    loginAccount,
    walletStatus
  } = useAppStatusStore();

  const showAddFundsButton =
    isLogged && walletStatus === WALLET_STATUS_VALUES.WAITING_FOR_FUNDING;
  const showActivationButton =
    isLogged && walletStatus === WALLET_STATUS_VALUES.FUNDED_NEED_CREATE;
  const tradingAccountCreated = !showActivationButton && !showAddFundsButton;
  const stats = getCoreStats(isLogged, loginAccount);
  if (!stats) return null;
  const { availableFunds, frozenFunds, totalFunds, realizedPL } = stats;
  const ethReserveInDai = getEthReserveInDai();
  
  return (
    <>
      {(isLogged || restoredAccount) && (
        <div className={Styles.statsContainer}>
          <div>
            <LinearPropertyLabel {...availableFunds} highlightAlternateBolded />
            <LinearPropertyLabel {...frozenFunds} highlightAlternateBolded />
            {tradingAccountCreated ?
              <LinearPropertyLabelUnderlineTooltip
                {...totalFunds}
                highlightAlternateBolded
                id={isMobile ? 'totalFundsMobile' : 'totalFunds_top_bar'}
                tipText={`${TOTAL_FUNDS_TOOLTIP} of $${ethReserveInDai.formatted} DAI`}
              /> :
              <LinearPropertyLabel {...totalFunds} highlightAlternateBolded />
            }
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
    walletStatus,
  } = useAppStatusStore();
  const { unseenCount } = getInfoAlertsAndSeenCount();
  const LoggedOrRestored = isLogged || restoredAccount;
  const notLoggedAndRestored = !isLogged && !restoredAccount;
  const showAddFundsButton =
    isLogged && walletStatus === WALLET_STATUS_VALUES.WAITING_FOR_FUNDING;
  const showActivationButton =
    isLogged && walletStatus === WALLET_STATUS_VALUES.FUNDED_NEED_CREATE;

  return (
    <header className={Styles.TopBar}>
      <div className={Styles.Logo}>
        <Link to={makePath(MARKETS)}>
          <NewLogo />
        </Link>
      </div>
      <ThemeSwitch />
      {LoggedOrRestored && <Stats />}

      <div>
        {(showActivationButton || showAddFundsButton) && (
          <div className={Styles.AccountActivation}>
            <PrimaryButton
              action={() => {
                if (showAddFundsButton) {
                  setModal({ type: MODAL_BUY_DAI });
                } else {
                  setModal({ type: MODAL_AUGUR_P2P });
                }
              }}
              text={'Complete account activation'}
            />
          </div>
        )}
        {(!isLogged || (!isMobile && LoggedOrRestored)) && <HelpResources />}
        {!isMobile && <OddsMenu />}
        {notLoggedAndRestored && (
          <>
            <SecondaryButton
              action={() => setModal({ type: MODAL_LOGIN })}
              text="Login"
            />
            <PrimaryButton
              action={() => setModal({ type: MODAL_SIGNUP })}
              text="Signup"
            />
          </>
        )}
        {LoggedOrRestored &&
          ((isMobile && walletStatus === WALLET_STATUS_VALUES.CREATED) ||
            !isMobile) && (
              <div className={Styles.AlertsDiv}>
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
                <AlertsContainer />
            </div>
          )}
        <ConnectAccount />
      </div>
    </header>
  );
};

export default TopBar;
