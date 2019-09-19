import { connect } from 'react-redux';

import MarketHeaderBar from 'modules/market/components/market-header/market-header-bar';
import { toggleFavorite } from 'modules/markets/actions/update-favorites';
import { AppState } from 'store';

const mapStateToProps = (state: AppState, ownProps) => ({
  isLogged: state.authStatus.isLogged,
  currentAugurTimestamp: state.blockchain.currentAugurTimestamp,
  disputingWindowEndTime: state.universe.disputeWindow.endTime,
});

const mapDispatchToProps = dispatch => ({
  toggleFavorite: marketId => dispatch(toggleFavorite(marketId)),
});

const MarketHeaderContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(MarketHeaderBar);

export default MarketHeaderContainer;
