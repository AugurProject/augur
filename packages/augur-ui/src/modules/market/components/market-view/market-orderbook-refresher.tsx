import { useEffect } from 'react';
import { NUMBER_OF_SECONDS_IN_A_DAY } from 'utils/format-date';
import { MIN_ORDER_LIFESPAN } from 'modules/common/constants';

// TODO: when market-view.tsx is refactored to use hooks include this orderbook refresher
export const MarketOrderbookRefresher = ({
  expirationTime,
  currentTimestamp,
  loadMarketOrderBook,
}) => {
  useEffect(() => {
    const expirationMaxSeconds =
      expirationTime - currentTimestamp - MIN_ORDER_LIFESPAN;
    if (
      expirationMaxSeconds > 0 &&
      expirationMaxSeconds < NUMBER_OF_SECONDS_IN_A_DAY
    ) {
      const timer = setTimeout(
        () => loadMarketOrderBook(),
        expirationMaxSeconds * 1000
      );
      return () => clearTimeout(timer);
    }
    return () => {};
  }, [expirationTime]);

  return null;
};
