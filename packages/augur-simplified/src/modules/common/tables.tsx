import React, { useMemo, useState } from 'react';
import Styles from 'modules/common/tables.styles.less';
import { EthIcon, UsdIcon } from './icons';
import {
  PrimaryButton,
  SecondaryButton,
  TinyButton,
} from 'modules/common/buttons';
import classNames from 'classnames';
import {
  POSITIONS,
  LIQUIDITY,
  ALL,
  ADD,
  REMOVE,
  SWAP,
} from 'modules/constants';
import { Pagination } from 'modules/common/pagination';
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
import { formatDai } from '../../utils/format-number';
import { MODAL_ADD_LIQUIDITY, USDC } from '../constants';
import { useAppStatusStore } from '../stores/app-status';
import { AddressLink, MarketLink } from '../routes/helpers/links';

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
        {ammExchange.cash.symbol === USDC ? UsdIcon : EthIcon}
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
      <li>p/l</li>
    </ul>
  );
};

const PositionRow = ({ position }: { position: PositionBalance }) => {
  return (
    <ul className={Styles.PositionRow}>
      <li>{position.outcomeName}</li>
      <li>{position.quantity}</li>
      <li>{position.avgPrice}</li>
      <li>{formatDai(position.initCostUsd).full}</li>
      <li>{formatDai(position.usdValue).full}</li>
      <li>{position.totalChangeUsd}</li>
    </ul>
  );
};

interface PositionFooterProps {
  claimableWinnings?: Winnings;
}
export const PositionFooter = ({ claimableWinnings }: PositionFooterProps) => {
  const { isMobile } = useAppStatusStore();
  if (isMobile && !claimableWinnings) return null;
  return (
    <div className={Styles.PositionFooter}>
      {claimableWinnings && (
        <SecondaryButton
          text={`${claimableWinnings.claimableBalance} in Winnings to claim`}
        />
      )}
      {!isMobile && <PrimaryButton text="trade" />}
    </div>
  );
};

export const AllPositionTable = () => {
  const {
    userInfo: {
      balances: { marketShares },
    },
  } = useAppStatusStore();
  const positions = marketShares
    ? ((Object.values(marketShares) as unknown[]) as {
        ammExchange: AmmExchange;
        positions: PositionBalance[];
        claimableWinnings: Winnings;
      }[])
    : [];

  const positionVis = positions.map((position) => {
    return (
      <PositionTable
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
  return (
    <div className={Styles.PositionTable}>
      {!singleMarket && (
        <MarketTableHeader market={market} ammExchange={ammExchange} />
      )}
      <PositionHeader />
      {positions.length === 0 && <span>No positions to show</span>}
      {positions &&
        positions
          .filter((p) => p.visible)
          .map((position, id) => <PositionRow key={id} position={position} />)}
      {!singleMarket && (
        <PositionFooter claimableWinnings={claimableWinnings} />
      )}
      {singleMarket && positions.length !== 0 && (
        <div className={Styles.PaginationFooter} />
      )}
    </div>
  );
};

const LiquidityHeader = () => {
  const { isMobile } = useAppStatusStore();
  return (
    <ul className={Styles.LiquidityHeader}>
      <li>liquidity shares{isMobile ? <br /> : ' '}owned</li>
      <li>init.{isMobile ? <br /> : ' '}value</li>
      <li>cur.{isMobile ? <br /> : ' '}value</li>
      <li>fees{isMobile ? <br /> : ' '}earned</li>
    </ul>
  );
};

const LiquidityRow = ({ liquidity }: { liquidity: LPTokenBalance }) => {
  return (
    <ul className={Styles.LiquidityRow}>
      <li>{formatDai(liquidity.balance).formatted}</li>
      <li>{formatDai(liquidity.initCostUsd).full}</li>
      <li>{liquidity.usdValue ? formatDai(liquidity.usdValue).full : '-'}</li>
      <li>
        {
          '-' /*liquidity.feesEarned ? formatDai(liquidity.feesEarned).full : '-'*/
        }
      </li>
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

export const AllLiquidityTable = () => {
  const {
    processed,
    userInfo: {
      balances: { lpTokens },
    },
  } = useAppStatusStore();
  const { ammExchanges } = processed;
  const liquidities = lpTokens
    ? Object.keys(lpTokens).map((ammId) => ({
        ammExchange: ammExchanges[ammId],
        market: ammExchanges[ammId].market,
        lpTokens: lpTokens[ammId],
      }))
    : [];
  const liquiditiesViz = liquidities.map((liquidity) => {
    return (
      <LiquidityTable
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
            action={() =>
              setModal({
                type: MODAL_ADD_LIQUIDITY,
                market,
                liquidityModalType: ADD,
                currency: ammExchange?.cash?.name,
              })
            }
            text="Earn fees as a liquidity provider"
          />
        </span>
      )}
      {lpTokens && <LiquidityRow liquidity={lpTokens} />}
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

export const PositionsLiquidityViewSwitcher = ({
  ammExchange,
  showActivityButton,
  setActivity,
  setTables,
}: PositionsLiquidityViewSwitcherProps) => {
  const [tableView, setTableView] = useState(POSITIONS);
  const {
    processed,
    userInfo: {
      balances: { lpTokens, marketShares },
    },
  } = useAppStatusStore();
  const { ammExchanges } = processed;

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
              {tableView === POSITIONS && <AllPositionTable />}
              {tableView === LIQUIDITY && <AllLiquidityTable />}
            </>
          )}
          {!ammId &&
            ((positions.length > 0 && tableView === POSITIONS) ||
              (liquidities.length > 0 && tableView === LIQUIDITY)) && (
              <Pagination
                page={1}
                itemCount={10}
                itemsPerPage={9}
                action={() => null}
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

const TransactionsHeader = ({ selectedType, setSelectedType }) => {
  const { isMobile } = useAppStatusStore();
  return (
    <ul className={Styles.TransactionsHeader}>
      <li>
        {isMobile ? (
          <SmallDropdown
            onChange={(value) => setSelectedType(value)}
            options={[
              { label: ALL, value: 0 },
              { label: SWAP, value: 1 },
              { label: ADD, value: 2 },
              { label: REMOVE, value: 3 },
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
      <li>time</li>
    </ul>
  );
};

interface TransactionProps {
  transaction: AmmTransaction;
}

const TransactionRow = ({ transaction }: TransactionProps) => {
  return (
    <ul className={Styles.TransactionRow}>
      <li>{transaction.subheader}</li>
      <li>{formatDai(transaction.value).full}</li>
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
        .sort((a, b) => b.timestamp - a.timestamp),
    [selectedType, transactions]
  );

  return (
    <div className={Styles.TransactionsTable}>
      {transactions?.length > 0 ? (
        <>
          <TransactionsHeader {...{ selectedType, setSelectedType }} />
          {filteredTransactions.map((transaction) => (
            <TransactionRow key={transaction.id} transaction={transaction} />
          ))}
          <div className={Styles.PaginationFooter}>
            <Pagination
              page={1}
              itemCount={10}
              itemsPerPage={9}
              action={() => null}
              updateLimit={() => null}
            />
          </div>
        </>
      ) : (
        <span>No transactions to show</span>
      )}
    </div>
  );
};
