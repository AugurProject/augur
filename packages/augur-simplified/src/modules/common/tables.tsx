import React, { useEffect, useMemo, useState } from 'react';
import Styles from './tables.styles.less';
import { EthIcon, UpArrow, UsdIcon } from './icons';
import { PrimaryButton, SecondaryButton, TinyButton } from './buttons';
import classNames from 'classnames';
import {
  POSITIONS,
  LIQUIDITY,
  ALL,
  ADD,
  REMOVE,
  SWAP,
  TX_STATUS,
  ETH,
} from '../constants';
import { SmallDropdown } from './selection';
import {
  AmmExchange,
  AmmTransaction,
  LPTokenBalance,
  MarketInfo,
  PositionBalance,
  SimpleBalance,
  Winnings,
  TransactionTypes,
} from '../types';
import {
  formatDai,
  formatCash,
  formatSimplePrice,
  formatSimpleShares,
  formatPercent,
} from '../../utils/format-number';
import { MODAL_ADD_LIQUIDITY, USDC } from '../constants';
import { useAppStatusStore } from '../stores/app-status';
import {
  AddressLink,
  createMarketAmmId,
  MarketLink,
  ReceiptLink,
} from '../routes/helpers/links';
import { sliceByPage, Pagination } from './pagination';
import { claimWinnings, getLPCurrentValue } from '../../utils/contract-calls';
import { updateTxStatus } from '../modal/modal-add-liquidity';
import {
  InvalidFlagTipIcon,
  MovementLabel,
  WarningBanner,
  generateTooltip,
} from './labels';
import { useGraphDataStore } from '../stores/graph-data';
import { useUserStore } from '../stores/user';
import { useCanExitCashPosition } from '../stores/utils';

interface PositionsTableProps {
  market: MarketInfo;
  ammExchange: AmmExchange;
  positions: PositionBalance[];
  claimableWinnings?: Winnings;
  singleMarket?: boolean;
}

interface LiquidityTableProps {
  market: MarketInfo;
  ammExchange: AmmExchange;
  lpTokens?: SimpleBalance;
  singleMarket?: boolean;
}

const MarketTableHeader = ({
  market,
  ammExchange,
}: {
  market: MarketInfo;
  ammExchange: AmmExchange;
}) => {
  return (
    <div className={Styles.MarketTableHeader}>
      <MarketLink id={market.marketId} ammId={market.amm?.id}>
        <span>{market.description}</span>
        <InvalidFlagTipIcon {...{ market }} />
        {ammExchange.cash.name === USDC ? UsdIcon : EthIcon}
      </MarketLink>
    </div>
  );
};

const PositionHeader = () => {
  const { isMobile } = useAppStatusStore();
  return (
    <ul className={Styles.PositionHeader}>
      <li>outcome</li>
      <li>
        {isMobile ? (
          <>
            qty
            <br />
            owned
          </>
        ) : (
          'quantity owned'
        )}
      </li>
      <li>
        {isMobile ? (
          <>
            avg.
            <br />
            price
          </>
        ) : (
          'avg. price paid'
        )}
      </li>
      <li>init. value</li>
      <li>cur.{isMobile ? <br /> : ' '}value</li>
      <li>
        p/l{' '}
        {generateTooltip(
          'Display values might be rounded. Dashes are displayed when liquidity is depleted.',
          'pnltip-positionheader'
        )}
      </li>
    </ul>
  );
};

const PositionRow = ({
  position,
  hasLiquidity = true,
}: {
  position: PositionBalance;
  hasLiquidity: boolean;
}) => (
  <ul className={Styles.PositionRow}>
    <li>{position.outcomeName}</li>
    <li>{formatSimpleShares(position.quantity).formattedValue}</li>
    <li>{formatSimplePrice(position.avgPrice).formattedValue}</li>
    <li>{formatDai(position.initCostUsd).full}</li>
    <li>{hasLiquidity ? formatDai(position.usdValue).full : '-'}</li>
    <li>
      {hasLiquidity ? (
        <MovementLabel
          value={formatDai(position.totalChangeUsd)}
          numberValue={parseFloat(position.totalChangeUsd)}
        />
      ) : (
        '-'
      )}
    </li>
  </ul>
);

interface PositionFooterProps {
  claimableWinnings?: Winnings;
  market: MarketInfo;
  showTradeButton?: boolean;
}
export const PositionFooter = ({
  claimableWinnings,
  market: { settlementFee, marketId, amm },
  showTradeButton,
}: PositionFooterProps) => {
  const { isMobile } = useAppStatusStore();
  const {
    account,
    loginAccount,
    actions: { addTransaction, updateTransaction },
  } = useUserStore();
  const canClaimETH = useCanExitCashPosition(claimableWinnings?.sharetoken);
  const isETHClaim = amm?.cash?.name === ETH;

  const claim = () => {
    if (amm && account) {
      claimWinnings(account, [marketId], amm?.cash)
        .then((response) => {
          // handle transaction response here
          if (response) {
            const { hash } = response;
            addTransaction({
              hash,
              chainId: loginAccount?.chainId,
              seen: false,
              status: TX_STATUS.PENDING,
              from: account,
              addedTime: new Date().getTime(),
              message: `Claim Winnings`,
              marketDescription: amm?.market?.description,
            });
            response.wait().then((response) => {
              updateTxStatus(response, updateTransaction);
            });
          }
        })
        .catch((e) => {
          // handle error here
        });
    }
  };
  if (
    (isMobile && !claimableWinnings) ||
    (!claimableWinnings && !showTradeButton)
  )
    return null;

  return (
    <div className={Styles.PositionFooter}>
      {claimableWinnings && (
        <>
          <span>{`${
            formatPercent(settlementFee).full
          } fee charged on settlement`}</span>
          <PrimaryButton
            text={`${
              isETHClaim && !canClaimETH ? 'Approve to ' : ''
            }Claim Winnings (${
              formatCash(claimableWinnings?.claimableBalance, amm?.cash?.name)
                .full
            })`}
            action={claim}
          />
        </>
      )}
      {!isMobile && showTradeButton && (
        <MarketLink id={marketId} ammId={amm?.id}>
          <SecondaryButton text="trade" />
        </MarketLink>
      )}
    </div>
  );
};

export const AllPositionTable = ({ page }) => {
  const {
    balances: { marketShares },
  } = useUserStore();
  const positions = marketShares
    ? ((Object.values(marketShares) as unknown[]) as {
        ammExchange: AmmExchange;
        positions: PositionBalance[];
        claimableWinnings: Winnings;
      }[])
    : [];

  const positionVis = sliceByPage(
    positions,
    page,
    POSITIONS_LIQUIDITY_LIMIT
  ).map((position) => {
    return (
      <PositionTable
        key={`${position.ammExchange.market.marketId}-PositionsTable`}
        market={position.ammExchange.market}
        ammExchange={position.ammExchange}
        positions={position.positions}
        claimableWinnings={position.claimableWinnings}
      />
    );
  });

  return <>{positionVis}</>;
};

export const PositionTable = ({
  market,
  ammExchange,
  positions,
  claimableWinnings,
  singleMarket,
}: PositionsTableProps) => {
  const {
    seenPositionWarnings,
    actions: { updateSeenPositionWarning },
  } = useUserStore();
  const marketAmmId = createMarketAmmId(market.marketId, market?.amm?.id);
  const seenMarketPositionWarningAdd =
    seenPositionWarnings && seenPositionWarnings[marketAmmId]?.add;
  const seenMarketPositionWarningRemove =
    seenPositionWarnings && seenPositionWarnings[marketAmmId]?.remove;
  const hasLiquidity = ammExchange.liquidity !== '0';
  return (
    <>
      <div className={Styles.PositionTable}>
        {!singleMarket && (
          <MarketTableHeader market={market} ammExchange={ammExchange} />
        )}
        <PositionHeader />
        {positions.length === 0 && <span>No positions to show</span>}
        {positions &&
          positions
            .filter((p) => p.visible)
            .map((position, id) => (
              <PositionRow
                key={id}
                position={position}
                hasLiquidity={hasLiquidity}
              />
            ))}
        <PositionFooter
          showTradeButton={!singleMarket}
          market={market}
          claimableWinnings={claimableWinnings}
        />
      </div>
      {!seenMarketPositionWarningAdd &&
        singleMarket &&
        positions.filter((position) => position.positionFromLiquidity).length >
          0 && (
          <WarningBanner
            className={Styles.MarginTop}
            title="Why do I have a position after adding liquidity?"
            subtitle={
              'To maintain the Yes to No percentage ratio, a number of shares are returned to the liquidity provider.'
            }
            onClose={() => updateSeenPositionWarning(marketAmmId, true, ADD)}
          />
        )}
      {!seenMarketPositionWarningRemove &&
        singleMarket &&
        positions.filter((position) => position.positionFromRemoveLiquidity)
          .length > 0 && (
          <WarningBanner
            className={Styles.MarginTop}
            title="Why do I have a position after removing liquidity?"
            subtitle={`To give liquidity providers the most options available to manage their positions. Shares can be sold for ${market?.amm?.cash?.name}.`}
            onClose={() => updateSeenPositionWarning(marketAmmId, true, REMOVE)}
          />
        )}
    </>
  );
};

const LiquidityHeader = () => (
  <ul className={Styles.LiquidityHeader}>
    <li>LP tokens owned</li>
    <li>init. value</li>
    <li>cur. value</li>
  </ul>
);

const LiquidityRow = ({
  liquidity,
  amm,
}: {
  liquidity: LPTokenBalance;
  amm: AmmExchange;
}) => {
  const [currValue, setInitValue] = useState(null);
  useEffect(() => {
    let isMounted = true;
    const getCurrentValue = async (balance: string, amm: AmmExchange) => {
      const value = await getLPCurrentValue(balance, amm);
      if (isMounted) {
        setInitValue(value);
      }
    };
    getCurrentValue(liquidity.balance, amm);
    return () => (isMounted = false);
  }, []);
  return (
    <ul className={Styles.LiquidityRow}>
      <li>{formatDai(liquidity.balance).formatted}</li>
      <li>{formatDai(liquidity.initCostUsd).full}</li>
      <li>{currValue ? formatDai(currValue).full : '-'}</li>
    </ul>
  );
};

export const LiquidityFooter = ({ market }: { market: MarketInfo }) => {
  const {
    actions: { setModal },
  } = useAppStatusStore();
  return (
    <div className={Styles.LiquidityFooter}>
      <PrimaryButton
        text="remove liquidity"
        action={() =>
          setModal({
            type: MODAL_ADD_LIQUIDITY,
            market,
            currency: market?.amm?.cash?.name,
            liquidityModalType: REMOVE,
          })
        }
      />
      <SecondaryButton
        text="add liquidity"
        action={() =>
          setModal({
            type: MODAL_ADD_LIQUIDITY,
            market,
            currency: market?.amm?.cash?.name,
            liquidityModalType: ADD,
          })
        }
      />
    </div>
  );
};

export const AllLiquidityTable = ({ page }) => {
  const {
    balances: { lpTokens },
  } = useUserStore();
  const { ammExchanges } = useGraphDataStore();
  const liquidities = lpTokens
    ? Object.keys(lpTokens).map((ammId) => ({
        ammExchange: ammExchanges[ammId],
        market: ammExchanges[ammId].market,
        lpTokens: lpTokens[ammId],
      }))
    : [];
  const liquiditiesViz = sliceByPage(
    liquidities,
    page,
    POSITIONS_LIQUIDITY_LIMIT
  ).map((liquidity) => {
    return (
      <LiquidityTable
        key={`${liquidity.market.marketId}-liquidityTable`}
        market={liquidity.market}
        ammExchange={liquidity.ammExchange}
        lpTokens={liquidity.lpTokens}
      />
    );
  });

  return <>{liquiditiesViz}</>;
};

export const LiquidityTable = ({
  market,
  singleMarket,
  ammExchange,
  lpTokens,
}: LiquidityTableProps) => {
  const {
    isLogged,
    actions: { setModal },
  } = useAppStatusStore();
  return (
    <div className={Styles.LiquidityTable}>
      {!singleMarket && (
        <MarketTableHeader market={market} ammExchange={ammExchange} />
      )}
      <LiquidityHeader />
      {!lpTokens && (
        <span>
          No liquidity to show
          <PrimaryButton
            action={() => {
              if (isLogged) {
                setModal({
                  type: MODAL_ADD_LIQUIDITY,
                  market,
                  liquidityModalType: ADD,
                  currency: ammExchange?.cash?.name,
                });
              }
            }}
            disabled={!isLogged}
            text="Earn fees as a liquidity provider"
          />
        </span>
      )}
      {lpTokens && <LiquidityRow liquidity={lpTokens} amm={ammExchange} />}
      {lpTokens && <LiquidityFooter market={market} />}
    </div>
  );
};

interface PositionsLiquidityViewSwitcherProps {
  ammExchange?: AmmExchange;
  showActivityButton?: boolean;
  setActivity?: Function;
  setTables?: Function;
}

const POSITIONS_LIQUIDITY_LIMIT = 5;

export const PositionsLiquidityViewSwitcher = ({
  ammExchange,
  showActivityButton,
  setActivity,
  setTables,
}: PositionsLiquidityViewSwitcherProps) => {
  const [tableView, setTableView] = useState(POSITIONS);
  const [page, setPage] = useState(1);
  const {
    balances: { lpTokens, marketShares },
  } = useUserStore();
  const { ammExchanges } = useGraphDataStore();

  const ammId = ammExchange?.id;
  let userPositions = [];
  let liquidity = null;
  let winnings = null;
  if (ammId && marketShares) {
    userPositions = marketShares[ammId] ? marketShares[ammId].positions : [];
    liquidity = lpTokens[ammId] ? lpTokens[ammId] : null;
    winnings = marketShares[ammId]
      ? marketShares[ammId]?.claimableWinnings
      : null;
  }
  const market = ammExchange?.market;

  const positions = marketShares
    ? ((Object.values(marketShares) as unknown[]) as {
        ammExchange: AmmExchange;
        positions: PositionBalance[];
        claimableWinnings: Winnings;
      }[])
    : [];
  const liquidities = lpTokens
    ? Object.keys(lpTokens).map((ammId) => ({
        ammExchange: ammExchanges[ammId],
        market: ammExchanges[ammId].market,
        lpTokens: lpTokens[ammId],
      }))
    : [];
  return (
    <div className={Styles.PositionsLiquidityViewSwitcher}>
      <div>
        <span
          onClick={() => {
            setTables && setTables();
            setTableView(POSITIONS);
          }}
          className={classNames({
            [Styles.Selected]: tableView === POSITIONS,
          })}
        >
          {POSITIONS}
        </span>
        <span
          onClick={() => {
            setTables && setTables();
            setTableView(LIQUIDITY);
          }}
          className={classNames({
            [Styles.Selected]: tableView === LIQUIDITY,
          })}
        >
          {LIQUIDITY}
        </span>
        {showActivityButton && (
          <TinyButton
            action={() => {
              setTableView(null);
              setActivity();
            }}
            text="your activity"
            selected={tableView === null}
          />
        )}
      </div>
      {tableView !== null && (
        <div>
          {!ammId && (positions.length > 0 || liquidities.length > 0) && (
            <>
              {tableView === POSITIONS && <AllPositionTable page={page} />}
              {tableView === LIQUIDITY && <AllLiquidityTable page={page} />}
            </>
          )}
          {!ammId &&
            ((positions.length > 0 && tableView === POSITIONS) ||
              (liquidities.length > 0 && tableView === LIQUIDITY)) && (
              <Pagination
                page={page}
                itemCount={
                  tableView === POSITIONS
                    ? positions.length
                    : liquidities.length
                }
                itemsPerPage={POSITIONS_LIQUIDITY_LIMIT}
                action={(page) => setPage(page)}
                updateLimit={() => null}
              />
            )}
          {ammId && (
            <>
              {tableView === POSITIONS && (
                <PositionTable
                  singleMarket
                  market={market}
                  ammExchange={ammExchange}
                  positions={userPositions}
                  claimableWinnings={winnings}
                />
              )}
              {tableView === LIQUIDITY && (
                <LiquidityTable
                  singleMarket
                  market={market}
                  ammExchange={ammExchange}
                  lpTokens={liquidity}
                />
              )}
            </>
          )}
        </div>
      )}
      {positions?.length === 0 && !ammId && tableView === POSITIONS && (
        <span>No positions to show</span>
      )}
      {liquidities?.length === 0 && !ammId && tableView === LIQUIDITY && (
        <span>No liquidity to show</span>
      )}
    </div>
  );
};

const TransactionsHeader = ({
  selectedType,
  setSelectedType,
  sortUp,
  setSortUp,
}) => {
  const { isMobile } = useAppStatusStore();
  return (
    <ul className={Styles.TransactionsHeader}>
      <li>
        {isMobile ? (
          <SmallDropdown
            onChange={(value) => setSelectedType(value)}
            options={[
              { label: ALL, value: ALL },
              { label: SWAP, value: SWAP },
              { label: ADD, value: ADD },
              { label: REMOVE, value: REMOVE },
            ]}
            defaultValue={ALL}
          />
        ) : (
          <>
            <span
              className={classNames({
                [Styles.Selected]: selectedType === ALL,
              })}
              onClick={() => setSelectedType(ALL)}
            >
              all
            </span>
            <span
              className={classNames({
                [Styles.Selected]: selectedType === SWAP,
              })}
              onClick={() => setSelectedType(SWAP)}
            >
              swaps
            </span>
            <span
              className={classNames({
                [Styles.Selected]: selectedType === ADD,
              })}
              onClick={() => setSelectedType(ADD)}
            >
              adds
            </span>
            <span
              className={classNames({
                [Styles.Selected]: selectedType === REMOVE,
              })}
              onClick={() => setSelectedType(REMOVE)}
            >
              removes
            </span>
          </>
        )}
      </li>
      <li>total value</li>
      <li>token amount</li>
      <li>share amount</li>
      <li>account</li>
      <li
        className={classNames({ [Styles.SortUp]: sortUp })}
        onClick={() => setSortUp()}
      >
        time {UpArrow}
      </li>
    </ul>
  );
};

interface TransactionProps {
  transaction: AmmTransaction;
}

const TX_PAGE_LIMIT = 10;

const TransactionRow = ({ transaction }: TransactionProps) => {
  return (
    <ul className={Styles.TransactionRow} key={transaction.id}>
      <li>
        <ReceiptLink hash={transaction.tx_hash} label={transaction.subheader} />
      </li>
      <li>{formatDai(transaction.cashValueUsd).full}</li>
      <li>{transaction.tokenAmount}</li>
      <li>{transaction.shareAmount}</li>
      <li>
        <AddressLink account={transaction.sender} short />
      </li>
      <li>{transaction.time}</li>
    </ul>
  );
};

interface TransactionsProps {
  transactions: AmmTransaction[];
}

export const TransactionsTable = ({ transactions }: TransactionsProps) => {
  const [selectedType, setSelectedType] = useState(ALL);
  const [page, setPage] = useState(1);
  const [sortUp, setSortUp] = useState(false);
  const filteredTransactions = useMemo(
    () =>
      []
        .concat(transactions)
        .filter(({ tx_type }) => {
          switch (selectedType) {
            case SWAP: {
              return (
                tx_type === TransactionTypes.ENTER ||
                tx_type === TransactionTypes.EXIT
              );
            }
            case ADD: {
              return tx_type === TransactionTypes.ADD_LIQUIDITY;
            }
            case REMOVE: {
              return tx_type === TransactionTypes.REMOVE_LIQUIDITY;
            }
            case ALL:
            default:
              return true;
          }
        })
        .sort((a, b) =>
          !sortUp ? b.timestamp - a.timestamp : a.timestamp - b.timestamp
        ),
    [selectedType, transactions, sortUp]
  );

  return (
    <div className={Styles.TransactionsTable}>
      <TransactionsHeader
        selectedType={selectedType}
        setSelectedType={(type) => {
          setPage(1);
          setSelectedType(type);
        }}
        sortUp={sortUp}
        setSortUp={() => setSortUp(!sortUp)}
      />
      {sliceByPage(filteredTransactions, page, TX_PAGE_LIMIT).map(
        (transaction) => (
          <TransactionRow key={transaction.id} transaction={transaction} />
        )
      )}
      {filteredTransactions.length > 0 && (
        <div className={Styles.PaginationFooter}>
          <Pagination
            page={page}
            itemCount={filteredTransactions.length}
            itemsPerPage={TX_PAGE_LIMIT}
            action={(page) => setPage(page)}
            updateLimit={() => null}
          />
        </div>
      )}
      {filteredTransactions.length === 0 && (
        <span>No transactions to show</span>
      )}
    </div>
  );
};
