import React from 'react';
import classNames from 'classnames';
import { Alerts } from 'modules/common/icons';
import ConnectAccount from 'modules/auth/containers/connect-account';
import {
  MovementLabel,
  LinearPropertyLabel,
} from 'modules/common/labels';
import { CoreStats } from 'modules/types';
import { Link } from 'react-router-dom';
import makePath from 'modules/routes/helpers/make-path';
import Logo from 'modules/app/components/logo';
import { PrimaryButton, SecondaryButton } from 'modules/common/buttons';
import { MARKETS } from 'modules/routes/constants/views';
import HelpResources from 'modules/app/containers/help-resources';
import { WALLET_STATUS_VALUES } from 'modules/common/constants';

import Styles from 'modules/app/components/top-bar.styles.less';

interface StatsProps {
  isLogged: boolean;
  restoredAccount: boolean;
  stats: CoreStats;
  isMobile?: boolean;
  tradingAccountCreated: boolean;
}

export const Stats = ({ isLogged, restoredAccount, stats, isMobile = false, tradingAccountCreated }: StatsProps) => {
  if (!stats) return null;
  const { availableFunds, frozenFunds, totalFunds, realizedPL } = stats;

  return (
    <>
      {(isLogged || restoredAccount) && (
        <div className={Styles.statsContainer}>
          <div>
            <LinearPropertyLabel {...availableFunds} highlightAlternateBolded />
            <LinearPropertyLabel {...frozenFunds} highlightAlternateBolded />
            {tradingAccountCreated ?
              <LinearPropertyLabel
                {...totalFunds}
                highlightAlternateBolded
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
interface TopBarProps {
  alertsVisible: boolean;
  isLogged: boolean;
  isMobile: boolean;
  restoredAccount: boolean;
  stats: CoreStats;
  unseenCount: number;
  updateIsAlertVisible: Function;
  signupModal: Function;
  loginModal: Function;
  helpModal: Function;
  showAddFundsButton: boolean;
  createFundedGsnWallet: Function;
  buyDaiModal: Function;
  activateWalletModal: Function;
  walletStatus: string;
}

const TopBar: React.FC<TopBarProps> = ({
  alertsVisible,
  isLogged,
  isMobile,
  restoredAccount,
  stats,
  unseenCount,
  updateIsAlertVisible,
  signupModal,
  loginModal,
  helpModal,
  showAddFundsButton,
  buyDaiModal,
  activateWalletModal,
  walletStatus,
}) => {
  return (
    <header className={Styles.TopBar}>
      <div className={Styles.Logo}>
        <Link to={makePath(MARKETS)}>
          <Logo />
        </Link>
      </div>

      <Stats
        isLogged={isLogged}
        stats={stats}
        restoredAccount={restoredAccount}
        tradingAccountCreated={!showAddFundsButton }
      />
      <div>

        {(!isLogged || (!isMobile && (isLogged || restoredAccount))) && (
          <HelpResources isMobile={isMobile} helpModal={helpModal} />
        )}
        {!isLogged && !restoredAccount && (
          <PrimaryButton action={() => loginModal()} text={'Connect'} />
        )}
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
        <ConnectAccount />
      </div>
    </header>
  );
};

export default TopBar;
