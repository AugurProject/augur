import React, { useState } from 'react';
import Styles from 'modules/portfolio/portfolio-view.styles.less';
import { AppViewStats } from 'modules/common/labels';
import Activity from './activity';
import { SecondaryButton } from 'modules/common/buttons';
import { LIQUIDITY, POSITIONS, USDC } from 'modules/constants';
import classNames from 'classnames';
import { PositionTable } from 'modules/common/tables';

const fakePositionsData = [
  {
    description: `Will Pfizer's COVID-19 vaccine be the first to receive FDA approval or Emergency Use Authorization (EUA)?`,
    asset: USDC,
    positions: [
      {
        outcome: 'Yes',
        quantityOwned: 300,
        avgPricePaid: '$0.67',
        initialValue: '$201.00',
        currentValue: '$225.00',
        profitLoss: '+$24.00',
      },
      {
        outcome: 'Invalid',
        quantityOwned: 10,
        avgPricePaid: '$0.05',
        initialValue: '$201.00',
        currentValue: '$225.00',
        profitLoss: '+$24.00',
      },
    ],
    claimableWinnings: '$24.00',
  },
  {
    description: `Which team will win the 2021 English Premier League?`,
    asset: USDC,
    positions: [
      {
        outcome: 'Liverpool F.C.',
        quantityOwned: 300,
        avgPricePaid: '$0.67',
        initialValue: '$201.00',
        currentValue: '$225.00',
        profitLoss: '+$24.00',
      },
    ],
  },
];

const fakeLiquidityData = [
  {
    description: `Will Pfizer's COVID-19 vaccine be the first to receive FDA approval or Emergency Use Authorization (EUA)?`,
    asset: USDC,
    liquidity: [
      {
        liquiditySharesOwned: 300,
        feesEarned: '$0.67',
        initialValue: '$201.00',
        currentValue: '$225.00',
      },
    ],
  },
  {
    description: `How many electoral college votes will be cast for Joe Biden?`,
    asset: USDC,
    liquidity: [
      {
        liquiditySharesOwned: 300,
        feesEarned: '$0.67',
        initialValue: '$201.00',
        currentValue: '$225.00',
      },
    ],
  },
];

export const PortfolioView = () => {
  const [tableView, setTableView] = useState(POSITIONS);

  return (
    <div className={Styles.PortfolioView}>
      <section>
        <AppViewStats />
        <SecondaryButton text={'$24.00 in Winnings to claim'} />
        <div>
          <span
            onClick={() => setTableView(POSITIONS)}
            className={classNames({
              [Styles.Selected]: tableView === POSITIONS,
            })}
          >
            {POSITIONS}
          </span>
          <span
            onClick={() => setTableView(LIQUIDITY)}
            className={classNames({
              [Styles.Selected]: tableView === LIQUIDITY,
            })}
          >
            {LIQUIDITY}
          </span>
        </div>
        <div>
          {tableView === POSITIONS && fakePositionsData.map(market => <PositionTable market={market} />)}
        </div>
      </section>
      <section>
        <Activity />
      </section>
    </div>
  );
};

export default PortfolioView;
