import React, { useState, useEffect } from 'react';
import Styles from 'modules/portfolio/portfolio-view.styles.less';
import { AppViewStats } from 'modules/common/labels';
import Activity from './activity';
import { PositionsLiquidityViewSwitcher } from 'modules/common/tables';
import { useAppStatusStore } from 'modules/stores/app-status';
import { PrimaryButton } from '../common/buttons';
import { NetworkMismatchBanner } from '../common/labels';

const TABLES = 'TABLES';
const ACTIVITY = 'ACTIVITY';

export const PortfolioView = () => {
  const { loginAccount, isMobile } = useAppStatusStore();
  const [view, setView] = useState(TABLES);
  const isLogged = loginAccount?.account !== null;

  useEffect(() => {
    // initial render only.
    document.getElementById("mainContent")?.scrollTo(0, 0);
    window.scrollTo(0, 1);
  }, []);

  return (
    <div className={Styles.PortfolioView}>
      {!isMobile && (
        <>
          <section>
            <NetworkMismatchBanner />
            <AppViewStats />
            {isLogged && <PrimaryButton text="Claim Winnings ($24.00)" />}
            <PositionsLiquidityViewSwitcher />
          </section>
          <section>
            <Activity />
          </section>
        </>
      )}
      {isMobile &&
      <>
        <NetworkMismatchBanner />
        <AppViewStats />
        {isLogged && <PrimaryButton text="Claim Winnings ($24.00)" />}
        <PositionsLiquidityViewSwitcher showActivityButton setTables={() => setView(TABLES)} setActivity={() => setView(ACTIVITY)}/>
        {view === ACTIVITY && <Activity />}
      </>
      }
    </div>
  );
};

export default PortfolioView;
