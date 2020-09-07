import React, { useState, useEffect } from 'react';

import { loadCandleStickData } from 'modules/markets/actions/load-candlestick-data';
import logError from 'utils/log-error';
import OutcomeCandlestick from 'modules/market-charts/components/candlestick/outcome-candlestick';
import { BigNumber } from 'bignumber.js';
import {
  DEFAULT_SHORT_PERIODS_VALUE,
  DEFAULT_PERIODS_VALUE,
} from 'modules/common/constants';
import { useAppStatusStore } from 'modules/app/store/app-status';

interface CandlestickProps {
  marketId: string;
  maxPrice: BigNumber;
  minPrice: BigNumber;
  selectedOutcomeId: number;
  daysPassed: number;
  isArchived?: boolean;
}

export const Candlestick = ({
  marketId,
  maxPrice: marketMax,
  minPrice: marketMin,
  selectedOutcomeId,
  daysPassed,
  isArchived,
}: CandlestickProps) => {
  const {
    blockchain: { currentAugurTimestamp: end },
  } = useAppStatusStore();
  const [priceTimeSeries, setPriceTimeSeries] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState(
    daysPassed < 1 ? DEFAULT_SHORT_PERIODS_VALUE : DEFAULT_PERIODS_VALUE
  );
  useEffect(() => {
    if (!isArchived) return;
    let isMounted = true;
    loadCandleStickData(
      {
        marketId,
        period: selectedPeriod,
        end,
        start: 0,
        outcome: selectedOutcomeId,
      },
      (err, data) => {
        if (err) return logError(err);
        if (!isMounted) return;
        const updatedPriceTimeSeries = data[selectedOutcomeId] || [];
        setPriceTimeSeries(updatedPriceTimeSeries);
      }
    );
    return () => (isMounted = false);
  }, [
    marketId,
    selectedPeriod,
    end,
    selectedOutcomeId,
    isArchived,
  ]);
  return (
    <OutcomeCandlestick
      {...{
        priceTimeSeries,
        selectedPeriod,
        marketMax,
        marketMin,
        isArchived,
        updateSelectedPeriod: v => setSelectedPeriod(v),
      }}
    />
  );
};
