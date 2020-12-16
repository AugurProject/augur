import React, { useState } from 'react';
import Styles from 'modules/common/tables.styles.less';
import { UsdIcon } from './icons';
import { PrimaryButton, SecondaryButton } from 'modules/common/buttons';
import classNames from 'classnames';
import { POSITIONS, LIQUIDITY } from 'modules/constants';
import { Pagination } from 'modules/common/pagination';
import { useAppStatusStore } from 'modules/stores/app-status';

interface Position {
  id: string;
  outcome: string;
  quantityOwned: number;
  avgPricePaid: string;
  initialValue: string;
  currentValue: string;
  profitLoss: string;
}

interface PositionsTableProps {
  market: MarketPosition;
  singleMarket?: boolean;
}

interface Liquidity {
  id: string;
  liquiditySharesOwned: number;
  feesEarned: string;
  currentValue: string;
}

interface MarketLiquidity {
  id: string;
  description: string;
  asset: string;
  liquidity: Liquidity[];
}

interface MarketPosition {
  description: string;
  asset: string;
  positions: Position[];
  claimableWinnings?: string;
}

interface LiquidityTableProps {
  market: MarketLiquidity;
  singleMarket?: boolean;
}

const MarketTableHeader = ({ market }) => {
  return (
    <div className={Styles.MarketTableHeader}>
      <span>{market.description}</span>
      {UsdIcon}
    </div>
  );
};

const PositionHeader = () => {
  const {
    isMobile
  } = useAppStatusStore();
  return (
    <ul className={Styles.PositionHeader}>
      <li>outcome</li>
      <li>{isMobile ? <>qty<br/>owned</>  : 'quantity owned'}</li>
      <li>{isMobile ? <>avg.<br/>price</> : 'avg. price paid'}</li>
      <li>init. value</li>
      <li>cur.{isMobile ? <br /> : ' '}value</li>
      <li>p/l</li>
    </ul>
  );
};

const PositionRow = ({ position }) => {
  return (
    <ul className={Styles.PositionRow}>
      <li>{position.outcome}</li>
      <li>{position.quantityOwned}</li>
      <li>{position.avgPricePaid}</li>
      <li>{position.initialValue}</li>
      <li>{position.currentValue}</li>
      <li>{position.profitLoss}</li>
    </ul>
  );
};

interface PositionFooterProps {
  claimableWinnings?: string;
}
export const PositionFooter = ({ claimableWinnings }: PositionFooterProps) => {
  const {
    isMobile
  } = useAppStatusStore();
  if (isMobile && !claimableWinnings) return null;
  return (
    <div className={Styles.PositionFooter}>
      {claimableWinnings && (
        <SecondaryButton text={`${claimableWinnings} in Winnings to claim`} />
      )}
      {!isMobile && <PrimaryButton text="trade" />}
    </div>
  );
};

export const PositionTable = ({
  market,
  singleMarket,
}: PositionsTableProps) => {
  return (
    <div className={Styles.PositionTable}>
      {!singleMarket && <MarketTableHeader market={market} />}
      <PositionHeader />
      {market.positions.map((position) => (
        <PositionRow key={position.id} position={position} />
      ))}
      {!singleMarket && (
        <PositionFooter claimableWinnings={market.claimableWinnings} />
      )}
      {singleMarket && (
        <div className={Styles.PaginationFooter}>
          <Pagination
            page={1}
            itemCount={10}
            itemsPerPage={9}
            action={() => null}
            updateLimit={() => null}
          />
        </div>
      )}
    </div>
  );
};

const LiquidityHeader = () => {
  const {
    isMobile
  } = useAppStatusStore();
  return (
    <ul className={Styles.LiquidityHeader}>
      <li>liquidity shares{isMobile ? <br /> : ''}owned</li>
      <li>init.{isMobile ? <br /> : ''}value</li>
      <li>cur.{isMobile ? <br /> : ''}value</li>
      <li>fees{isMobile ? <br /> : ''}earned</li>
    </ul>
  );
};

const LiquidityRow = ({ liquidity }) => {
  return (
    <ul className={Styles.LiquidityRow}>
      <li>{liquidity.liquiditySharesOwned}</li>
      <li>{liquidity.initialValue}</li>
      <li>{liquidity.currentValue}</li>
      <li>{liquidity.feesEarned}</li>
    </ul>
  );
};

export const LiquidityFooter = () => {
  return (
    <div className={Styles.LiquidityFooter}>
      <PrimaryButton text="remove liquidity" />
      <SecondaryButton text="add liquidity" />
    </div>
  );
};

export const LiquidityTable = ({
  market,
  singleMarket,
}: LiquidityTableProps) => {
  return (
    <div className={Styles.LiquidityTable}>
      {!singleMarket && <MarketTableHeader market={market} />}
      <LiquidityHeader />
      {market.liquidity.map((liquidity) => (
        <LiquidityRow key={liquidity.id} liquidity={liquidity} />
      ))}
      {!singleMarket && <LiquidityFooter />}
      {singleMarket && (
        <div className={Styles.PaginationFooter}>
          <Pagination
            page={1}
            itemCount={10}
            itemsPerPage={9}
            action={() => null}
            updateLimit={() => null}
          />
        </div>
      )}
    </div>
  );
};

interface PositionsLiquidityViewSwitcherProps {
  marketId?: string;
  showActivityButton?: boolean;
  setActivity?: Function;
  setTables?: Function;
}

export const PositionsLiquidityViewSwitcher = ({
  marketId,
  showActivityButton,
  setActivity,
  setTables,
}: PositionsLiquidityViewSwitcherProps) => {
  const [tableView, setTableView] = useState(POSITIONS);
  const { positions, liquidity } = useAppStatusStore();

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
          <button
            className={classNames({ [Styles.selected]: tableView === null })}
            onClick={() => {
              setTableView(null);
              setActivity();
            }}
          >
            Your activity
          </button>
        )}
      </div>
      {tableView !== null && (
        <div>
          {!marketId && (
            <>
              {tableView === POSITIONS &&
                positions.map((market) => (
                  <PositionTable key={market.id} market={market} />
                ))}
              {tableView === LIQUIDITY &&
                liquidity.map((market) => (
                  <LiquidityTable key={market.id} market={market} />
                ))}
              <Pagination
                page={1}
                itemCount={10}
                itemsPerPage={9}
                action={() => null}
                updateLimit={() => null}
              />
            </>
          )}
          {marketId && (
            <>
              {tableView === POSITIONS && (
                <PositionTable singleMarket market={positions[0]} />
              )}
              {tableView === LIQUIDITY && (
                <LiquidityTable singleMarket market={liquidity[0]} />
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

const TransactionsHeader = () => {
  return (
    <ul className={Styles.TransactionsHeader}>
      <li>
        <span>all</span>
        <span>swaps</span>
        <span>adds</span>
        <span>removes</span>
      </li>
      <li>total value</li>
      <li>token amount</li>
      <li>share amount</li>
      <li>account</li>
      <li>time</li>
    </ul>
  );
};

const TransactionRow = ({ transaction }) => {
  return (
    <ul className={Styles.TransactionRow}>
      <li>{transaction.title}</li>
      <li>{transaction.totalValue}</li>
      <li>{transaction.tokenAmount}</li>
      <li>{transaction.shareAmount}</li>
      <li>{transaction.account}</li>
      <li>{transaction.time}</li>
    </ul>
  );
};

export const TransactionsTable = () => {
  const { transactions } = useAppStatusStore();
  return (
    <div className={Styles.TransactionsTable}>
      <TransactionsHeader />
      {transactions[0].transactions.map((transaction) => (
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
    </div>
  );
};
