import React, { useMemo } from 'react';
import { SelectedOrderProperties } from 'modules/trading/components/wrapper';
import Wrapper from 'modules/trading/containers/wrapper';
import Styles from 'modules/trading/components/trading-form.styles.less';
import { MarketData, NewMarket } from 'modules/types';

interface TradingFormProps {
  selectedOutcomeId: number;
  market: MarketData | NewMarket;
  selectedOrderProperties: SelectedOrderProperties;
  updateSelectedOrderProperties: Function;
  updateSelectedOutcome: Function;
  updateLiquidity?: Function;
  tutorialNext?: Function;
  initialLiquidity?: boolean;
  tradingTutorial?: boolean;
}

const TradingForm = ({
  selectedOutcomeId = 2,
  market,
  ...props
}: TradingFormProps) => {
  const selectedOutcome = useMemo(
    () =>
      market.outcomesFormatted.find(
        ({ id }) => id === selectedOutcomeId
      ),
    [selectedOutcomeId, market]
  );
  
  return (
    <section className={Styles.TradingForm}>
      <Wrapper
        market={market}
        selectedOutcome={selectedOutcome}
        {...props}
      />
    </section>
  );
};

export default TradingForm;
