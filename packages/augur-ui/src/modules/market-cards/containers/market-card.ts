import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import MarketCard from 'modules/market-cards/market-card';
import { toggleFavorite } from 'modules/markets/actions/update-favorites';
import { hasStakeInMarket } from 'modules/account/selectors/has-stake-in-market';
import { MODAL_REPORTING } from 'modules/common/constants';
import { updateModal } from 'modules/modal/actions/update-modal';

const mapStateToProps = (state, ownProps) => {
  const positions = state.accountPositions;
  const hasStaked = hasStakeInMarket(state, ownProps.market.marketId);

  return {
    hasPosition: !!positions[ownProps.market.marketId],
    isLogged: state.authStatus.isLogged,
    isMobile: state.appStatus.isMobile,
    pendingLiquidityOrders: state.pendingLiquidityOrders,
    currentAugurTimestamp: state.blockchain.currentAugurTimestamp,
    reportingWindowStatsEndTime: state.disputeWindowStats.endTime,
    address: state.loginAccount.address,
    isFavorite: !!state.favorites[ownProps.market.marketId],
    hasStaked,
  };
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  toggleFavorite: marketId => dispatch(toggleFavorite(marketId)),
  dispute: (selectedOutcome: string) =>
    dispatch(
      updateModal({
        type: MODAL_REPORTING,
        market: ownProps.market,
        selectedOutcome,
      })
    ),
});

const MarketCardContainer = withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(MarketCard)
);

export default MarketCardContainer;
