import React, { useState, useEffect } from 'react';
import Styles from './portfolio-view.styles.less';
import { AppViewStats } from '../common/labels';
import Activity from './activity';
import { PositionsLiquidityViewSwitcher } from '../common/tables';
import { useAppStatusStore } from '../stores/app-status';
import { PrimaryButton } from '../common/buttons';
import { NetworkMismatchBanner } from '../common/labels';
import { EthIcon, UsdIcon } from '../common/icons';
import { keyedObjToArray } from '../stores/app-status-hooks';
import { ETH, USDC } from '../constants';
import { formatCashPrice } from '../../utils/format-number';
import { claimMarketWinnings } from '../../utils/contract-calls';

const TABLES = 'TABLES';
const ACTIVITY = 'ACTIVITY';

export const ClaimWinningsSection = () => {
  const {
    isLogged,
    approvals: {
      trade: {
        exit: { ETH: ethApproval },
      },
    },
    // userInfo: { balances: { claimableWinnings }},
    processed: { cashes },
  } = useAppStatusStore();
  const keyedCash = keyedObjToArray(cashes);
  const ethCash = keyedCash.find((c) => c?.name === ETH);
  const usdcCash = keyedCash.find((c) => c?.name === USDC);
  // userInfo: { balances: { claimableWinnings }}
  // console.log(isLogged, claimableWinnings, ethApproval);
  return (
    <div className={Styles.ClaimableWinningsSection}>
      {isLogged && (
        <PrimaryButton
          text={`Claim Winnings (${
            formatCashPrice('24.00', usdcCash?.name).full
          })`}
          icon={UsdIcon}
        />
      )}
      {isLogged && (
        <PrimaryButton
          text={`${ethApproval ? '' : 'Approve to '}Claim Winnings (${
            formatCashPrice('0.87', ethCash?.name).full
          })`}
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
