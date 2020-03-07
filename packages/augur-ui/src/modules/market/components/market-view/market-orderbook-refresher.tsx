import { useEffect, useState } from 'react';
import { NUMBER_OF_SECONDS_IN_A_DAY } from 'utils/format-date';

export const MarketOrderbookRefresher = ({
  expirationTime,
  currentTimestamp,
  getGasConfirmEstimate,
  loadMarketOrderBook,
}) => {
  const [refreshTimer, setRefreshTimer] = useState();

  useEffect(() => {
    const expirationMaxSeconds = expirationTime - currentTimestamp;
    if (
      expirationMaxSeconds > 0 &&
      expirationMaxSeconds < NUMBER_OF_SECONDS_IN_A_DAY
    ) {
      getGasConfirmEstimate().then(addedTime => {
        const expireTime = expirationMaxSeconds - addedTime;
        const timer = setTimeout(
          () => loadMarketOrderBook(),
          expireTime * 1000
        );
        setRefreshTimer(timer);
      });
    }
  }, [expirationTime]);

  useEffect(() => {
    if (refreshTimer) {
      clearTimeout(refreshTimer);
    }
  }, []);

  return null;
};
