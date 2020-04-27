import React, { useMemo } from 'react';
import { SelectedOrderProperties } from 'modules/trading/components/wrapper';
import Wrapper from 'modules/trading/containers/wrapper';
import Styles from 'modules/trading/components/trading-form.styles.less';
import { MarketData, NewMarket } from 'modules/types';
import { useAppStatusStore } from 'modules/app/store/app-status';

interface TradingFormProps {
  market: MarketData | NewMarket;
  selectedOrderProperties: SelectedOrderProperties;
  selectedOutcomeId: number;
  updateSelectedOrderProperties: Function;
  updateSelectedOutcome: Function;
  updateLiquidity?: Function;
  initialLiquidity?: boolean;
  tradingTutorial?: boolean;
  tutorialNext?: Function;
}

const TradingForm = ({
  selectedOutcomeId = 2,
  market,
  selectedOrderProperties,
  updateSelectedOutcome,
  updateLiquidity,
  initialLiquidity,
  tradingTutorial,
  tutorialNext,
  updateSelectedOrderProperties,
}: TradingFormProps) => {
  const { zeroXEnabled } = useAppStatusStore();
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
        zeroXEnabled={zeroXEnabled}
        market={market}
        selectedOutcome={selectedOutcome}
        selectedOrderProperties={selectedOrderProperties}
        updateSelectedOrderProperties={updateSelectedOrderProperties}
        updateSelectedOutcome={updateSelectedOutcome}
        updateLiquidity={updateLiquidity}
        initialLiquidity={initialLiquidity}
        tradingTutorial={tradingTutorial}
        tutorialNext={tutorialNext}
      />
    </section>
  );
};
export default TradingForm;
