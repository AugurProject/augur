import React, { useState } from 'react';
import Styles from 'modules/portfolio/portfolio-view.styles.less';
import { AppViewStats } from 'modules/common/labels';
import Activity from './activity';
import { SecondaryButton } from 'modules/common/buttons';
import { PositionsLiquidityViewSwitcher } from 'modules/common/tables';
import { useAppStatusStore } from 'modules/stores/app-status';

const TABLES = 'TABLES';
const ACTIVITY = 'ACTIVITY';

export const PortfolioView = () => {
  const { isMobile, loginAccount } = useAppStatusStore();
  const [view, setView] = useState(TABLES);
  const isLogged = loginAccount !== null;

  return (
    <div className={Styles.PortfolioView}>
      {!isMobile && (
        <>
          <section>
            <AppViewStats />
            {isLogged && <SecondaryButton text="$24.00 in Winnings to claim" />}
            <PositionsLiquidityViewSwitcher />
          </section>
          <section>
            <Activity />
          </section>
        </>
      )}
      {isMobile &&
      <>
        <AppViewStats />
        {isLogged && <SecondaryButton text="$24.00 in Winnings to claim" />}
        <PositionsLiquidityViewSwitcher showActivityButton setTables={() => setView(TABLES)} setActivity={() => setView(ACTIVITY)}/>
        {view === ACTIVITY && <Activity />}
      </>
      }
    </div>
  );
};

export default PortfolioView;
