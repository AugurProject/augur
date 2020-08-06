import React from 'react';
import classNames from 'classnames';
import PriceHistory from 'modules/market-charts/components/price-history/price-history';
import Styles from 'modules/market-charts/sports-group-charts.styles';

export const SportsGroupCharts = ({ sportsGroup }) => {
  const market = sportsGroup.markets[0];
  console.log(market);
  return (
    <section className={Styles.Container}>
      <div className={Styles.ChartArea}>
        <h4>Price History</h4>
        <PriceHistory
          marketId={market.id}
          market={market}
          selectedOutcomeId={1}
        />
      </div>
      <div className={Styles.Legend}>
        <h5>References:</h5>
        <ul>
          {market.outcomesFormatted.map(outcome => {
            if (outcome.id === 0) return null;
            return (
              <li key={outcome.id} className={classNames({[`Styles.${outcome.id}`]: true}}>
                <span>{outcome.description}</span>
                <span>{outcome.lastPricePercent.full}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
};
