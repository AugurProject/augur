import React from 'react';
import parseQuery from 'modules/routes/helpers/parse-query';
import { MARKET_ID_PARAM_NAME } from 'modules/routes/constants/param-names';
import { getAddress } from 'ethers/utils/address';
import { selectMarket } from 'modules/markets/selectors/market';
import Styles from 'modules/market/components/market-view/betting-market-view.styles.less';
import { HeadingBar, InfoTicket } from '../common/common';
import { PropertyLabel, TimeLabel } from 'modules/common/labels';
import { formatPercent, formatDai } from 'utils/format-number';
import { Subheaders } from 'modules/reporting/common';
import { StarIconSportsBetting, BetsIcon, PositionIcon } from 'modules/common/icons';

interface BettingMarketViewProps {
  location: Location;
}

const BettingMarketView = ({ location }: BettingMarketViewProps) => {
  const queryId = parseQuery(location.search)[MARKET_ID_PARAM_NAME];
  const marketId = getAddress(queryId);
  const market = selectMarket(marketId);
  const {
    description,
    endTimeFormatted,
    settlementFeePercent,
    settlementFee,
    details,
    creationTimeFormatted
  } = market;

  return (
    <div className={Styles.BettingMarketView}>
      <div>
        <HeadingBar market={market} showReportingLabel history={history} />
        <span>{description}</span>
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
          <TimeLabel
            label="Estimated Start Time"
            time={endTimeFormatted}
            showLocal
            large
            hint={<h4>Estimated Start Time</h4>}
          />
        </div>
      </div>
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
          <Subheaders
            header="resolution rules"
            subheader={details}
          />
      </div>
      <div>
        <InfoTicket icon={StarIconSportsBetting} value='43' subheader='People tagged this market as favorite' />
        <InfoTicket icon={BetsIcon} value='148' subheader='Bets were placed on this market' />
        <InfoTicket icon={PositionIcon} value='$146.54' subheader='Is the amount traded on this market' />
      </div>
    </div>
  );
};

export default BettingMarketView;
