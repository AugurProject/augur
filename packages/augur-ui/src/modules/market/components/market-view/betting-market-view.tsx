import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router';
import parseQuery from 'modules/routes/helpers/parse-query';
import { MARKET_ID_PARAM_NAME } from 'modules/routes/constants/param-names';
import { getAddress } from 'ethers/utils/address';
import { selectMarket } from 'modules/markets/selectors/market';
import Styles from 'modules/market/components/market-view/betting-market-view.styles.less';
import {
  HeadingBar,
  InfoTicket,
} from 'modules/market/components/common/common';
import { PropertyLabel, FullTimeLabel } from 'modules/common/labels';
import { formatPercent, formatDai } from 'utils/format-number';
import { Subheaders } from 'modules/reporting/common';
import { BetsIcon, BettorsIcon, DaiLogoIcon } from 'modules/common/icons';
import { SportsGroupMarkets } from 'modules/market-cards/common';
import { getSportsGroupsFromSportsIDs } from 'modules/markets-list/components/markets-list';
import { getMarkets } from 'modules/markets/selectors/markets-all';
import { loadMarketsInfo } from 'modules/markets/actions/load-markets-info';
import { useMarketsStore } from 'modules/markets/store/markets';
import { MARKET } from 'modules/routes/constants/views';
import parsePath from 'modules/routes/helpers/parse-path';
import { convertUnixToFormattedDate } from 'utils/format-date';
import { bulkLoadMarketTradingHistory } from 'modules/markets/actions/market-trading-history-management';
import { augurSdk } from 'services/augursdk';
import { SportsGroupCharts } from 'modules/market-charts/sports-group-charts';

export const isMarketView = location => {
  const isGroupPage = parsePath(location.pathname)[0] === MARKET;
  const queryId = parseQuery(location.search)[MARKET_ID_PARAM_NAME];
  let marketId = null;
  if (queryId) {
    marketId = getAddress(queryId);
  }
  return {
    isGroupPage,
    marketId,
  };
};
const BettingMarketView = () => {
  const {
    marketTradingHistory,
    actions: { updateMarketsData, bulkMarketTradingHistory },
  } = useMarketsStore();
  const location = useLocation();
  const [showCopied, setShowCopied] = useState(false);
  const totalBets = useRef(0);
  const totalBettors = useRef(0);
  const uniqueAddresses = useRef([]);
  const sportsGroup = useRef(null);
  const marketIds = useRef([]);
  const sportsGroupTradeHistory = useRef([]);
  const queryId = parseQuery(location.search)[MARKET_ID_PARAM_NAME];
  const marketId = getAddress(queryId);
  const market = selectMarket(marketId);
  const markets = getMarkets();

  useEffect(() => {
    if (!market?.sportsBook) {
      updateMarketsData(null, loadMarketsInfo([marketId]));
    }
  }, [augurSdk.client]);

  useEffect(() => {
    let isMounted = true;
    if (showCopied) {
      setTimeout(() => {
        if (isMounted) setShowCopied(false);
      }, 4000);
    }
    return () => (isMounted = false);
  }, [showCopied]);

  useEffect(() => {
    if (sportsGroup.current === null && market?.sportsBook?.groupId) {
      sportsGroup.current = getSportsGroupsFromSportsIDs(
        [market.sportsBook.groupId],
        markets
      )[0];
      marketIds.current = sportsGroup.current.markets.map(market => market.id);
      if (marketIds.current.length > 0) {
        bulkLoadMarketTradingHistory(marketIds.current, (err, tradeHistory) => {
          bulkMarketTradingHistory(tradeHistory);
        });
      }
    }
  }, [market?.sportsBook]);

  useEffect(() => {
    let tradeCount = 0;
    sportsGroupTradeHistory.current = marketIds.current
      .map(marketId => {
        if (marketTradingHistory[marketId]) {
          tradeCount = tradeCount + marketTradingHistory[marketId].length;
          return marketTradingHistory[marketId];
        }
      })
      .filter(item => !!item);
    if (
      sportsGroupTradeHistory.current.length > 0 &&
      tradeCount !== totalBets.current
    ) {
      sportsGroupTradeHistory.current.forEach(MarketTradeHistoryArray => {
        MarketTradeHistoryArray.forEach(({ creator, filler }) => {
          if (!uniqueAddresses.current.includes(creator)) {
            uniqueAddresses.current.push(creator);
          }
          if (!uniqueAddresses.current.includes(filler)) {
            uniqueAddresses.current.push(filler);
          }
        });
      });
      totalBets.current = tradeCount;
      totalBettors.current = uniqueAddresses.current.length;
    }
  }, [marketTradingHistory[marketId]]);

  if (!market) {
    return <div />;
  }

  const {
    endTimeFormatted,
    settlementFeePercent,
    creationTimeFormatted,
    description,
    details,
    settlementFee,
    template,
    sportsBook,
  } = market;
  const header = sportsBook ? sportsBook.header : description;
  const estDateTime = sportsBook?.estTimestamp;
  const startTimeFormatted =
    estDateTime && convertUnixToFormattedDate(estDateTime);
  return (
    <div className={Styles.BettingMarketView}>
      <div>
        <HeadingBar
          market={market}
          showReportingLabel
          showCopied={showCopied}
          setShowCopied={() => setShowCopied(true)}
        />
        <span>{header}</span>
        <div>
          <PropertyLabel
            label="matched"
            value={formatDai(sportsGroup.current?.totalVolume || '0').full}
            hint={<h4>Matched</h4>}
            large
          />
          <PropertyLabel
            label="fee"
            hint={<h4>Fee</h4>}
            large
            value={
              settlementFeePercent
                ? formatPercent(settlementFeePercent.formattedValue).full
                : formatPercent(Number(settlementFee) * 100).full
            }
          />
          {estDateTime ? (
            <FullTimeLabel
              label="Estimated Start Time"
              time={startTimeFormatted}
              large
              hint={<h4>Estimated Start Time</h4>}
            />
          ) : (
            <FullTimeLabel
              label="Event Expiration Date"
              time={endTimeFormatted}
              large
              hint={<h4>Event Expiration Date</h4>}
            />
          )}
        </div>
      </div>
      {sportsGroup.current && (
        <SportsGroupMarkets sportsGroup={sportsGroup.current} />
      )}
      <div>
        <Subheaders
          header="creation date"
          subheader={creationTimeFormatted.formattedUtc}
        />
        <Subheaders
          header="event expiration date"
          subheader={endTimeFormatted.formattedUtc}
          info
          tooltipText="event expiration date"
        />
        {details?.length > 0 && (
          <Subheaders header="rules" subheader={details} />
        )}
      </div>
      {sportsGroup.current && (
        <SportsGroupCharts sportsGroup={sportsGroup.current} />
      )}
      <div>
        <InfoTicket
          icon={BettorsIcon}
          value={String(totalBettors.current)}
          subheader="Number of bettors on this event"
        />
        <InfoTicket
          icon={BetsIcon}
          value={String(totalBets.current)}
          subheader="Bets were placed on this event"
        />
        <InfoTicket
          icon={DaiLogoIcon}
          value={formatDai(sportsGroup.current?.totalVolume || '0').full}
          subheader="Is the amount traded on this event"
        />
      </div>
    </div>
  );
};

export default BettingMarketView;
