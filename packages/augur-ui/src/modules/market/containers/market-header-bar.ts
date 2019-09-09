import { connect } from 'react-redux';

import MarketHeaderBar from 'modules/market/components/market-header/market-header-bar';
import { toggleFavorite } from 'modules/markets/actions/update-favorites';

const mapStateToProps = (state, ownProps) => ({
  isLogged: state.authStatus.isLogged,
  currentAugurTimestamp: state.blockchain.currentAugurTimestamp,
  reportingWindowStatsEndTime: state.disputeWindowStats.endTime,
});

const mapDispatchToProps = dispatch => ({
  toggleFavorite: marketId => dispatch(toggleFavorite(marketId)),
});

const MarketHeaderContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(MarketHeaderBar);

export default MarketHeaderContainer;
