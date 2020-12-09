import React from 'react';
import Styles from 'modules/common/tables.styles.less';
import { UsdIcon } from './icons';

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

interface Position {
  outcome: string;
  quantityOwned: number;
  avgPricePaid: string;
  initialValue: string;
  currentValue: string;
  profitLoss: string;
}

interface Market {
  description: string;
  asset: string;
  positions: Position[];
}

interface PositionsTableProps {
  market: Market;
}

export const PositionTable = ({ market }: PositionsTableProps) => {
  return (
    <div className={Styles.PositionTable}>
      <div>
        <span>{market.description}</span>
        {UsdIcon}
      </div>
      <PositionHeader />
      {market.positions.map((position) => (
        <PositionRow position={position} />
      ))}
    </div>
  );
};
