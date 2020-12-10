import React from 'react';
import Styles from 'modules/common/tables.styles.less';
import { UsdIcon } from './icons';
import { PrimaryButton, SecondaryButton } from './buttons';

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
  return (
    <ul className={Styles.PositionHeader}>
      <li>outcome</li>
      <li>quantity owned</li>
      <li>avg. price paid</li>
      <li>init. value</li>
      <li>cur. value</li>
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
  return (
    <div className={Styles.PositionFooter}>
      {claimableWinnings && <SecondaryButton text={`${claimableWinnings} in Winnings to claim`} />}
      <PrimaryButton text="trade" />
    </div>
  );
};

export const PositionTable = ({ market }: PositionsTableProps) => {
  return (
    <div className={Styles.PositionTable}>
      <MarketTableHeader market={market} />
      <PositionHeader />
      {market.positions.map((position) => (
        <PositionRow key={position.id} position={position} />
      ))}
      <PositionFooter claimableWinnings={market.claimableWinnings} />
    </div>
  );
};

const LiquidityHeader = () => {
  return (
    <ul className={Styles.LiquidityHeader}>
      <li>liquidity shares owned</li>
      <li>cur. value</li>
      <li>fees earned</li>
      <li>fees earned</li>
    </ul>
  );
};

const LiquidityRow = ({ liquidity }) => {
  return (
    <ul className={Styles.LiquidityRow}>
      <li>{liquidity.liquiditySharesOwned}</li>
      <li>{liquidity.currentValue}</li>
      <li>{liquidity.feesEarned}</li>
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

export const LiquidityTable = ({ market }: LiquidityTableProps) => {
  return (
    <div className={Styles.LiquidityTable}>
      <MarketTableHeader market={market} />
      <LiquidityHeader />
      {market.liquidity.map((liquidity) => (
        <LiquidityRow key={liquidity.id} liquidity={liquidity} />
      ))}
      <LiquidityFooter />
    </div>
  );
};
