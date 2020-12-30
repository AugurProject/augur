import React, { useState } from 'react';
import Styles from 'modules/common/tables.styles.less';
import { UsdIcon } from './icons';
import {
  PrimaryButton,
  SecondaryButton,
  SmallRoundedButton,
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
import { useAppStatusStore } from 'modules/stores/app-status';
import { SmallDropdown } from './selection';
import { AmmExchange, AmmTransaction } from '../types';
import { formatDai } from '../../utils/format-number';

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
  const { isMobile } = useAppStatusStore();
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
  const { isMobile } = useAppStatusStore();
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
  const { positions, liquidity, loginAccount } = useAppStatusStore();
  const isLogged = loginAccount !== null;
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
          <SmallRoundedButton
            action={() => {
              setTableView(null);
              setActivity();
            }}
            text="your activity"
            selected={tableView === null}
          />
        )}
      </div>
      {tableView !== null && isLogged && (
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
      {!isLogged && <span>No {tableView === LIQUIDITY ? 'liquidity' : 'positions'} to show</span>}
    </div>
  );
};

const TransactionsHeader = () => {
  const [selectedType, setSelectedType] = useState(ALL);
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

const AccountLink = ({ account }) => {
  // TODO: make this a etherscan link
  return (
    <span>{account && account.slice(0, 6) + '...' + account.slice(38, 42)}</span>
  )
}

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
      <li><AccountLink account={transaction.sender} /></li>
      <li>{transaction.time}</li>
    </ul>
  );
};

interface TransactionsProps {
  transactions: AmmTransaction[];
}

export const TransactionsTable = ({ transactions }: TransactionsProps) => {
  return (
    <div className={Styles.TransactionsTable}>
      {transactions?.length > 0 ? (
        <>
          <TransactionsHeader />
          {transactions.map((transaction) => (
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
