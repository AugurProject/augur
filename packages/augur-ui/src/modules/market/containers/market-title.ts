import { connect } from 'react-redux';

import MarketTitle from 'modules/market/components/common/market-title';
import { selectMarket } from 'modules/markets/selectors/market';

const mapStateToProps = (state, ownProps) => {
  const marketId = ownProps.id;
  const market = selectMarket(marketId);
  if (!market) return null;

  return {
    description: market.description || '',
    id: marketId,
  };
};

const MarketTitleContainer = connect(mapStateToProps)(MarketTitle);

export default MarketTitleContainer;
