import React, { useState, useEffect } from 'react';
import Styles from './portfolio-view.styles.less';
import { AppViewStats } from '../common/labels';
import Activity from './activity';
import { PositionsLiquidityViewSwitcher } from '../common/tables';
import { useAppStatusStore } from '../stores/app-status';
import { PrimaryButton } from '../common/buttons';
import { NetworkMismatchBanner } from '../common/labels';
import { EthIcon, UsdIcon } from '../common/icons';
import { keyedObjToArray, useCanExitCashPosition } from '../stores/utils';
import { ACTIVITY, ETH, TABLES, TX_STATUS, USDC } from '../constants';
import { formatCash } from '../../utils/format-number';
import { createBigNumber } from '../../utils/create-big-number';
import { claimWinnings } from '../../utils/contract-calls';
import { updateTxStatus } from '../modal/modal-add-liquidity';
import { useGraphDataStore } from '../stores/graph-data';
import { useUserStore } from '../stores/user';

const calculateTotalWinnings = (claimbleMarketsPerCash) => {
  let total = createBigNumber('0');
  let marketIds = [];
  claimbleMarketsPerCash.forEach(({ ammExchange: { marketId }, claimableWinnings: { claimableBalance }}) => {
    total = total.plus(createBigNumber(claimableBalance));
    marketIds.push(marketId);
  });
  return {
    hasWinnings: !total.eq(0),
    total,
    marketIds,
  };
};

const handleClaimAll = (loginAccount, cash, marketIds, addTransaction, updateTransaction) => {
  const from = loginAccount?.account;
  const chainId = loginAccount?.chainId;
  if (from) {
    claimWinnings(from, marketIds, cash).then((response) => {
      // handle transaction response here
      if (response) {
        const { hash } = response;
        addTransaction({
          hash,
          chainId,
          seen: false,
          status: TX_STATUS.PENDING,
          from,
          addedTime: new Date().getTime(),
          message: `Claim All ${cash.name} Winnings`,
          marketDescription: '',
        });
        response
          .wait()
          .then((response) => {
            updateTxStatus(response, updateTransaction);
          });
      }
    }).catch(e => {
      // handle error here
    })
  }
}



export const ClaimWinningsSection = () => {
  const {
    isLogged,
  } = useAppStatusStore();
  const {
    balances: { marketShares },
    loginAccount,
    actions: { addTransaction, updateTransaction },
  } = useUserStore();
  const { cashes } = useGraphDataStore();
  const claimableMarkets = marketShares
    ? keyedObjToArray(marketShares).filter((m) => !!m?.claimableWinnings)
    : [];
  const keyedCash = keyedObjToArray(cashes);
  const ethCash = keyedCash.find((c) => c?.name === ETH);
  const usdcCash = keyedCash.find((c) => c?.name === USDC);
  const claimableEthMarkets = claimableMarkets.filter(
    (m) => m.claimableWinnings.sharetoken === ethCash?.shareToken
  );
  const claimableUSDCMarkets = claimableMarkets.filter(
    (m) => m.claimableWinnings.sharetoken === usdcCash.shareToken
  );
  const ETHTotals = calculateTotalWinnings(claimableEthMarkets);
  const USDCTotals = calculateTotalWinnings(claimableUSDCMarkets);
  const canClaimETH = useCanExitCashPosition(ethCash?.shareToken);

  return (
    <div className={Styles.ClaimableWinningsSection}>
      {isLogged && USDCTotals.hasWinnings && (
        <PrimaryButton
          text={`Claim Winnings (${
            formatCash(USDCTotals.total, usdcCash?.name).full
          })`}
          icon={UsdIcon}
          action={() => {
            handleClaimAll(loginAccount, usdcCash, USDCTotals.marketIds, addTransaction, updateTransaction)
          }}
        />
      )}
      {isLogged && ETHTotals.hasWinnings && (
        <PrimaryButton
          text={`${canClaimETH ? '' : 'Approve to '}Claim Winnings (${
            formatCash(ETHTotals.total, ethCash?.name).full
          })`}
          icon={EthIcon}
          action={() => {
            handleClaimAll(loginAccount, ethCash, ETHTotals.marketIds, addTransaction, updateTransaction)
          }}
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

  useEffect(() => {
    if (!isMobile) setView(TABLES);
  }, [isMobile])

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
          view={view}
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
