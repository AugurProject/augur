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
import { MarketComments } from 'modules/market/components/common/comments/market-comments';
import { getNetworkId } from 'modules/contracts/actions/contractCalls';
import { REPORTING_STATE, THEMES } from 'modules/common/constants';
import { FilterNotice } from 'modules/common/filter-notice';
import { ParagraphButton } from 'modules/common/buttons';
import { useAppStatusStore } from 'modules/app/store/app-status';
import { ClaimWinnings } from 'modules/portfolio/components/common/common';

const { FINALIZED } = REPORTING_STATE;

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
  const {
    actions: { setTheme },
  } = useAppStatusStore();
  const location = useLocation();
  const [showCopied, setShowCopied] = useState(false);
  const [forceLoad, setForceLoad] = useState(false);
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
      updateMarketsData(
        null,
        loadMarketsInfo([marketId], () => setForceLoad(false))
      );
    }
  }, [augurSdk.client, forceLoad]);

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
    if (augurSdk.client && market === null && !forceLoad) {
      setForceLoad(true);
    }
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
    reportingState,
    mostLikelyInvalid,
  } = market;
  const header = sportsBook ? sportsBook.header : description;
  const estDateTime = sportsBook?.estTimestamp;
  const startTimeFormatted =
    estDateTime && convertUnixToFormattedDate(estDateTime);
  const networkId = getNetworkId();
  const isFinalized = reportingState === FINALIZED;
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
              hideContent={isFinalized}
              hint={<h4>Estimated Start Time</h4>}
            />
          ) : (
            <FullTimeLabel
              label="Event Expiration Date"
              time={endTimeFormatted}
              large
              hideContent={isFinalized}
              hint={<h4>Event Expiration Date</h4>}
            />
          )}
        </div>
      </div>
      <span>
        <ClaimWinnings onlyCheckMarketId={marketId} />
        {mostLikelyInvalid ? (
          <FilterNotice
            showDismissButton={false}
            show
            content={
              <div className={Styles.SpreadRisk}>
                <span>
                  Spread market has a high risk of being resolved as Invalid. You can go to Trading and try to sell out your current position.
                </span>
                <ParagraphButton
                  text="Go to trading"
                  action={() => setTheme(THEMES.TRADING)}
                />
              </div>
            }
          />
        ) : null}
      </span>
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
        <SportsGroupCharts
          sportsGroup={sportsGroup.current}
          marketId={marketId}
        />
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
      <MarketComments marketId={marketId} networkId={networkId} />
    </div>
  );
};

export default BettingMarketView;
