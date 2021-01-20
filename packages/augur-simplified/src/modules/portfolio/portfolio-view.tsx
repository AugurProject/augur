import React, { useState, useEffect } from 'react';
import Styles from './portfolio-view.styles.less';
import { AppViewStats } from '../common/labels';
import Activity from './activity';
import { PositionsLiquidityViewSwitcher } from '../common/tables';
import { useAppStatusStore } from '../stores/app-status';
import { PrimaryButton } from '../common/buttons';
import { NetworkMismatchBanner } from '../common/labels';
import { EthIcon, UsdIcon } from '../common/icons';

const TABLES = 'TABLES';
const ACTIVITY = 'ACTIVITY';

export const ClaimWinningsSection = () => {
  const { isLogged } = useAppStatusStore();
  // userInfo: { balances: { claimableWinnings }}
  // console.log(isLogged, claimableWinnings);
  return (
    <div className={Styles.ClaimableWinningsSection}>
      {isLogged && (
        <PrimaryButton text="Claim Winnings ($24.00)" icon={UsdIcon} />
      )}
      {isLogged && (
        <PrimaryButton
          text="Approve to Claim Winnings (0.87 ETH)"
          icon={EthIcon}
        />
      )}
    </div>
  );
};

export const PortfolioView = () => {
  const { isMobile } = useAppStatusStore();
  const [view, setView] = useState(TABLES);

  useEffect(() => {
    // initial render only.
    document.getElementById('mainContent')?.scrollTo(0, 0);
    window.scrollTo(0, 1);
  }, []);

  return (
    <div className={Styles.PortfolioView}>
      <section>
        <NetworkMismatchBanner />
        <AppViewStats />
        <ClaimWinningsSection />
        <PositionsLiquidityViewSwitcher
          showActivityButton={isMobile}
          setTables={() => setView(TABLES)}
          setActivity={() => setView(ACTIVITY)}
        />
        {view === ACTIVITY && <Activity />}
      </section>
      <section>
        <Activity />
      </section>
    </div>
  );
};

export default PortfolioView;
