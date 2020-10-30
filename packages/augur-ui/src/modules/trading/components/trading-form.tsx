import React, { useMemo } from 'react';
import Wrapper from 'modules/trading/components/wrapper';
import Styles from 'modules/trading/components/trading-form.styles.less';
import { MarketData, NewMarket } from 'modules/types';
import { TradingProvider } from 'modules/trading/store/trading';
import { useAppStatusStore } from 'modules/app/store/app-status';
import {
  calcOrderExpirationTime,
} from 'utils/format-date';
import { IndividualOutcomeOrderbook } from '../helpers/form-helpers';

interface TradingFormProps {
  selectedOutcomeId: number;
  market: MarketData | NewMarket;
  updateSelectedOutcome: Function;
  updateLiquidity?: Function;
  tutorialNext?: Function;
  orderBook: IndividualOutcomeOrderbook;
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
  const expirationDate = calcOrderExpirationTime(market.endTime || (market as NewMarket).setEndTime, currentTimestamp);
  return (
    <TradingProvider presetOrderProperties={{ expirationDate }}>
      <section className={Styles.TradingForm}>
        <Wrapper
          market={(market as MarketData)}
          selectedOutcome={selectedOutcome}
          {...props}
        />
      </section>
   </TradingProvider>
  );
};

export default TradingForm;
