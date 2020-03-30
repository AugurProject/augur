import React, { useState, useEffect } from 'react';

import { loadCandleStickData } from 'modules/markets/actions/load-candlestick-data';
import logError from 'utils/log-error';
import OutcomeCandlestick from 'modules/market-charts/components/candlestick/outcome-candlestick';
import { BigNumber } from 'bignumber.js';
import {
  DEFAULT_SHORT_PERIODS_VALUE,
  DEFAULT_PERIODS_VALUE,
} from 'modules/common/constants';

interface CandlestickProps {
  currentTimeInSeconds: number;
  marketId: string;
  maxPrice: BigNumber;
  minPrice: BigNumber;
  selectedOutcomeId: number;
  daysPassed: number;
  isArchived?: boolean;
}

export const Candlestick = ({
  currentTimeInSeconds,
  marketId,
  maxPrice,
  minPrice,
  selectedOutcomeId,
  daysPassed,
  isArchived
}: CandlestickProps) => {
  const [priceTimeSeries, setPriceTimeSeries] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState(
    daysPassed < 1 ? DEFAULT_SHORT_PERIODS_VALUE : DEFAULT_PERIODS_VALUE
  );

  useEffect(() => {
    loadCandleStickData(
      {
        marketId,
        period: selectedPeriod,
        end: currentTimeInSeconds,
        start: 0,
        outcome: selectedOutcomeId,
      },
      (err, data) => {
        if (err) return logError(err);
        const updatedPriceTimeSeries = data[selectedOutcomeId] || [];
        setPriceTimeSeries(updatedPriceTimeSeries);
      }
    );
  }, [marketId, selectedPeriod, currentTimeInSeconds, selectedOutcomeId]);

  return (
    <OutcomeCandlestick
      priceTimeSeries={isArchived ? [] : priceTimeSeries}
      fixedPrecision={2}
      pricePrecision={2}
      selectedPeriod={selectedPeriod}
      updateSelectedPeriod={v => setSelectedPeriod(v)}
      marketMax={maxPrice}
      marketMin={minPrice}
      isArchived={isArchived}
    />
  );
};
