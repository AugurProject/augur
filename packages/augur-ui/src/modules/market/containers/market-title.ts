import { connect } from 'react-redux';

import MarketTitle from 'modules/market/components/common/market-title';
import { selectMarket } from 'modules/markets/selectors/market';

const mapStateToProps = (state, ownProps) => {
  const marketId = ownProps.id;
  const market = selectMarket(marketId);
  if (!market) return {};

  return {
    description: market.description || '',
    id: marketId,
    isTemplate: market.isTemplate,
    template: market.template,
  };
};

const MarketTitleContainer = connect(mapStateToProps)(MarketTitle);

export default MarketTitleContainer;
