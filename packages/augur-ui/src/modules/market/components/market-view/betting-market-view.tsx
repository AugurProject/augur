import React from 'react';
import { useLocation } from 'react-router';
import parseQuery from 'modules/routes/helpers/parse-query';
import { MARKET_ID_PARAM_NAME } from 'modules/routes/constants/param-names';
import { getAddress } from 'ethers/utils/address';
import { selectMarket } from 'modules/markets/selectors/market';
import Styles from 'modules/market/components/market-view/betting-market-view.styles.less';
import { HeadingBar, InfoTicket } from 'modules/market/components/common/common';
import { PropertyLabel, FullTimeLabel } from 'modules/common/labels';
import { formatPercent, formatDai } from 'utils/format-number';
import { Subheaders } from 'modules/reporting/common';
import {
  BetsIcon,
  BettorsIcon,
  DaiLogoIcon
} from 'modules/common/icons';
import { SportsGroupMarkets } from 'modules/market-cards/common';
import { getSportsGroupsFromSportsIDs } from 'modules/markets-list/components/markets-list';
import { getMarkets } from 'modules/markets/selectors/markets-all';
import { loadMarketsInfo } from 'modules/markets/actions/load-markets-info';
import { useMarketsStore } from 'modules/markets/store/markets';
import { MARKET } from 'modules/routes/constants/views';
import parsePath from 'modules/routes/helpers/parse-path';
import { convertInputs, findStartTime } from '../common/market-title';
import { convertUnixToFormattedDate } from 'utils/format-date';

export const isMarketView = location =>
  parsePath(location.pathname)[0] === MARKET;

const BettingMarketView = () => {
  const {
    actions: { updateMarketsData },
  } = useMarketsStore();
  const location = useLocation();
  const queryId = parseQuery(location.search)[MARKET_ID_PARAM_NAME];
  const marketId = getAddress(queryId);
  const market = selectMarket(marketId);
  const markets = getMarkets();
  let sportsGroup = null;
  if (market.sportsBook) {
    sportsGroup = getSportsGroupsFromSportsIDs(
      [market.sportsBook.groupId],
      markets
    )[0];
  } else {
    updateMarketsData(null, loadMarketsInfo([marketId]));
  }

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
  const convertedInputs = template && convertInputs(template.inputs);
  const estDateTime = convertedInputs && findStartTime(convertedInputs);
  const startTimeFormatted =
    estDateTime && convertUnixToFormattedDate(estDateTime.timestamp);
  console.log(startTimeFormatted, endTimeFormatted);
  return (
    <div className={Styles.BettingMarketView}>
      <div>
        <HeadingBar market={market} showReportingLabel />
        <span>{header}</span>
        <div>
          <PropertyLabel
            label="matched"
            value={formatDai(0).full}
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
          {startTimeFormatted ? (
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
      {sportsGroup && <SportsGroupMarkets sportsGroup={sportsGroup} />}
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
          <Subheaders header="resolution rules" subheader={details} />
        )}
      </div>
      <div>
        <InfoTicket
          icon={BettorsIcon}
          value="43"
          subheader="Number of bettors on this event"
        />
        <InfoTicket
          icon={BetsIcon}
          value="148"
          subheader="Bets were placed on this event"
        />
        <InfoTicket
          icon={DaiLogoIcon}
          value={formatDai(sportsGroup?.totalVolume || '0').full}
          subheader="Is the amount traded on this event"
        />
      </div>
    </div>
  );
};

export default BettingMarketView;
