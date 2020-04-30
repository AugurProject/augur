import { connect } from 'react-redux';

import { MarketHeaderBar } from 'modules/market/components/market-header/market-header-bar';
import { toggleFavorite } from 'modules/markets/actions/update-favorites';
import { AppState } from 'appStore';

const mapStateToProps = (state: AppState, ownProps) => ({
});

const mapDispatchToProps = dispatch => ({
  toggleFavorite: marketId => dispatch(toggleFavorite(marketId)),
});

const MarketHeaderContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(MarketHeaderBar);

export default MarketHeaderContainer;
