import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { MarketCard } from 'modules/market-cards/market-card';
import { toggleFavorite } from 'modules/markets/actions/update-favorites';
import { hasStakeInMarket } from 'modules/account/selectors/has-stake-in-market';
import {
  MODAL_MIGRATE_MARKET,
  MODAL_REPORTING,
} from 'modules/common/constants';
import { updateModal } from 'modules/modal/actions/update-modal';
import { marketLinkCopied } from 'services/analytics/helpers';

const mapStateToProps = (state, ownProps) => {
  const positions = state.accountPositions;
  const hasStaked = hasStakeInMarket(state, ownProps.market.marketId);

  return {
    theme: state.appStatus.theme,
    hasPosition: !!positions[ownProps.market.marketId],
    isLogged: state.authStatus.isLogged,
    pendingLiquidityOrders: state.pendingLiquidityOrders,
    currentAugurTimestamp: state.blockchain.currentAugurTimestamp,
    disputingWindowEndTime: state.universe.disputeWindow && state.universe.disputeWindow.endTime || 0,
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
  migrateMarketModal: () =>
    dispatch(
      updateModal({
        type: MODAL_MIGRATE_MARKET,
        market: ownProps.market,
      })
    ),
  marketLinkCopied: (marketId, location) => dispatch(marketLinkCopied(marketId, location)),
});

const MarketCardContainer = withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(MarketCard)
);

export default MarketCardContainer;
