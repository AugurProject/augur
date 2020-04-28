import React from 'react';
import parseQuery from 'modules/routes/helpers/parse-query';
import { MARKET_ID_PARAM_NAME } from 'modules/routes/constants/param-names';
import { getAddress } from 'ethers/utils/address';
import { selectMarket } from 'modules/markets/selectors/market';
import Styles from 'modules/market/components/market-view/betting-market-view.styles.less';
import { HeadingBar } from '../common/common';

interface BettingMarketViewProps {
  location: Location;
}

const BettingMarketView = ({ location }: BettingMarketViewProps) => {
  const queryId = parseQuery(location.search)[MARKET_ID_PARAM_NAME];
  const marketId = getAddress(queryId);
  const market = selectMarket(marketId);
  return (
    <div className={Styles.BettingMarketView}>
      <HeadingBar market={market} history={history} />
    </div>
  );
};

export default BettingMarketView;
