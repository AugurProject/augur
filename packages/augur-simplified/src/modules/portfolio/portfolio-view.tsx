import React, { useState, useEffect } from 'react';
import Styles from './portfolio-view.styles.less';
import Activity from './activity';
import { PositionsLiquidityViewSwitcher } from '../common/tables';
import { AppViewStats, NetworkMismatchBanner } from '../common/labels';
import {
  ContractCalls,
  Formatter,
  Icons,
  Constants,
  createBigNumber,
  Stores,
  PARA_CONFIG,
  ApprovalHooks,
  SEO,
  ButtonComps,
} from '@augurproject/augur-comps';
import { PORTFOLIO_HEAD_TAGS } from '../seo-config';

const { claimWinnings } = ContractCalls;
const { approveERC1155Contract } = ApprovalHooks;
const { formatCash } = Formatter;
const { ACTIVITY, ETH, TABLES, TX_STATUS, USDC } = Constants;
const {
  Hooks: {
    useGraphDataStore,
    useAppStatusStore,
    useScrollToTopOnMount,
    useCanExitCashPosition,
    useUserStore,
  },
  Utils: { keyedObjToArray },
} = Stores;
const { EthIcon, UsdIcon } = Icons;
const { PrimaryButton } = ButtonComps;

const calculateTotalWinnings = (claimbleMarketsPerCash) => {
  let total = createBigNumber('0');
  let marketIds = [];
  claimbleMarketsPerCash.forEach(
    ({
      ammExchange: { marketId },
      claimableWinnings: { claimableBalance },
    }) => {
      total = total.plus(createBigNumber(claimableBalance));
      marketIds.push(marketId);
    }
  );
  return {
    hasWinnings: !total.eq(0),
    total,
    marketIds,
  };
};

const handleClaimAll = (
  loginAccount,
  cash,
  marketIds,
  addTransaction,
  canClaim,
  setPendingClaim
) => {
  const from = loginAccount?.account;
  const chainId = loginAccount?.chainId;
  const {
    addresses: { WethWrapperForAMMExchange },
  } = PARA_CONFIG;
  if (from && canClaim) {
    setPendingClaim(true);
    claimWinnings(from, marketIds, cash)
      .then((response) => {
        // handle transaction response here
        setPendingClaim(false);
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
        }
      })
      .catch((e) => {
        setPendingClaim(false);
        // handle error here
      });
  } else if (from) {
    const approveEth = async () => {
      const tx = await approveERC1155Contract(
        cash?.shareToken,
        `To Claim Winnings`,
        WethWrapperForAMMExchange,
        loginAccount
      );
      addTransaction(tx);
    };
    // need to approve here
    approveEth();
  }
};

export const ClaimWinningsSection = () => {
  const { isLogged } = useAppStatusStore();
  const {
    balances: { marketShares },
    loginAccount,
    actions: { addTransaction },
  } = useUserStore();
  const [pendingClaim, setPendingClaim] = useState(false);
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
  const canClaimETH = useCanExitCashPosition(ethCash);

  return (
    <div className={Styles.ClaimableWinningsSection}>
      {isLogged && USDCTotals.hasWinnings && (
        <PrimaryButton
          text={
            !pendingClaim
              ? `Claim Winnings (${
                  formatCash(USDCTotals.total, usdcCash?.name).full
                })`
              : `Waiting for Confirmation`
          }
          subText={pendingClaim && `(Confirm this transaction in your wallet)`}
          disabled={pendingClaim}
          icon={!pendingClaim && UsdIcon}
          action={() => {
            handleClaimAll(
              loginAccount,
              usdcCash,
              USDCTotals.marketIds,
              addTransaction,
              true,
              setPendingClaim
            );
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
            handleClaimAll(
              loginAccount,
              ethCash,
              ETHTotals.marketIds,
              addTransaction,
              canClaimETH
            );
          }}
        />
      )}
    </div>
  );
};

export const PortfolioView = () => {
  const { isMobile } = useAppStatusStore();
  const [view, setView] = useState(TABLES);

  useScrollToTopOnMount();

  useEffect(() => {
    if (!isMobile) setView(TABLES);
  }, [isMobile]);

  return (
    <div className={Styles.PortfolioView}>
      <SEO {...PORTFOLIO_HEAD_TAGS} />
      <section>
        <NetworkMismatchBanner />
        <AppViewStats small />
        <ClaimWinningsSection />
        <PositionsLiquidityViewSwitcher
          showActivityButton={isMobile}
          setTables={() => setView(TABLES)}
          setActivity={() => setView(ACTIVITY)}
          view={view}
          claimableFirst
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
