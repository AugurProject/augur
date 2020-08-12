import React from 'react';
import classNames from 'classnames';
import PriceHistory from 'modules/market-charts/components/price-history/price-history';
import Styles from 'modules/market-charts/sports-group-charts.styles';
import { selectMarket } from 'modules/markets/selectors/market';

export const SportsGroupCharts = ({ sportsGroup }) => {
  const market = selectMarket(sportsGroup.markets[0].id);
  const outcomes = market.outcomesFormatted;
  const invalid = outcomes.shift();
  outcomes.push(invalid);
  return (
    <section className={Styles.Container}>
      <div className={Styles.ChartArea}>
        <h4>Price History</h4>
        <PriceHistory marketId={market.id} market={market} />
      </div>
      <div className={Styles.Legend}>
        <h5>References:</h5>
        <ul>
          {outcomes.map(outcome => (
            <li
              key={outcome.id}
              id={`legend-outcome-${outcome.id}`}
              className={classNames({
                [Styles.hidden]:
                  outcome.id === 0 && outcome.lastPricePercent.value === 0,
              })}
            >
              <span>{outcome.description}</span>
              <span>{outcome.lastPricePercent.full}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};
