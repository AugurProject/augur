import React, { useMemo } from 'react';
import Wrapper from 'modules/trading/components/wrapper';
import Styles from 'modules/trading/components/trading-form.styles.less';
import { MarketData, NewMarket, IndividualOutcomeOrderBook } from 'modules/types';
import { TradingProvider } from 'modules/trading/store/trading';
import { useAppStatusStore } from 'modules/app/store/app-status';
import {
  calcOrderExpirationTime,
} from 'utils/format-date';

interface TradingFormProps {
  selectedOutcomeId: number;
  market: MarketData | NewMarket;
  updateSelectedOutcome: Function;
  updateLiquidity?: Function;
  tutorialNext?: Function;
  orderBook: IndividualOutcomeOrderBook;
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
  const {
    blockchain: { currentAugurTimestamp: currentTimestamp },
  } = useAppStatusStore();
  const expirationDate = calcOrderExpirationTime(market.endTime || market.setEndTime, currentTimestamp);
  return (
    <TradingProvider presetOrderProperties={{ expirationDate }}>
      <section className={Styles.TradingForm}>
        <Wrapper
          market={market}
          selectedOutcome={selectedOutcome}
          {...props}
        />
      </section>
   </TradingProvider>
  );
};

export default TradingForm;
