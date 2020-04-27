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
  const { marketId } = ownProps.market;
  const {
    accountPositions: positions,
    universe,
    authStatus,
    appStatus,
    blockchain,
    pendingLiquidityOrders,
    loginAccount,
    favorites,
    orderBooks,
  } = state;
  const hasStaked = hasStakeInMarket(state, marketId);
  const { forkingInfo } = universe;
  
  return {
    theme: appStatus.theme,
    hasPosition: !!positions[marketId],
    orderBook: orderBooks[marketId]?.orderBook,
    isLogged: authStatus.isLogged,
    isForking: !!forkingInfo,
    pendingLiquidityOrders,
    currentAugurTimestamp: blockchain.currentAugurTimestamp,
    disputingWindowEndTime: universe.disputeWindow?.endTime || 0,
    address: loginAccount.address,
    isFavorite: !!favorites[marketId],
    hasStaked,
    forkingMarket: forkingInfo?.forkingMarket,
    forkingEndTime: forkingInfo?.forkEndTime
  };
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  toggleFavorite: marketId => dispatch(toggleFavorite(marketId)),
  dispute: (selectedOutcome: string, isInvalid: boolean) =>
    dispatch(
      updateModal({
        type: MODAL_REPORTING,
        market: ownProps.market,
        selectedOutcome,
        isInvalid,
      })
    ),
  migrateMarketModal: () =>
    dispatch(
      updateModal({
        type: MODAL_MIGRATE_MARKET,
        market: ownProps.market,
      })
    ),
  marketLinkCopied: (marketId, location) =>
    dispatch(marketLinkCopied(marketId, location)),
});

const MarketCardContainer = withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(MarketCard)
);

export default MarketCardContainer;
