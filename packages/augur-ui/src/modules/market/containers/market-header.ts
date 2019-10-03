import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import MarketHeader from 'modules/market/components/market-header/market-header';
import {
  ZERO,
  EXPIRY_SOURCE_GENERIC,
  REPORTING_STATE,
} from 'modules/common/constants';
import { selectMarket } from 'modules/markets/selectors/market';
import { toggleFavorite } from 'modules/markets/actions/update-favorites';
import { createBigNumber } from 'utils/create-big-number';

const mapStateToProps = (state, ownProps) => {
  const market = ownProps.market || selectMarket(ownProps.marketId);

  const { reportingState, consensusFormatted: consensus } = market;
  let reportingBarShowing = false;
  const isDesignatedReporter =
    market.designatedReporter === state.loginAccount.address;

  if (
    consensus ||
    reportingState === REPORTING_STATE.CROWDSOURCING_DISPUTE ||
    reportingState === REPORTING_STATE.OPEN_REPORTING ||
    (reportingState === REPORTING_STATE.DESIGNATED_REPORTING &&
      isDesignatedReporter)
  ) {
    reportingBarShowing = true;
  }

  return {
    description: market.description || '',
    details: market.details || market.detailsText || '',
    marketType: market.marketType,
    maxPrice: market.maxPriceBigNumber || ZERO,
    minPrice: market.minPriceBigNumber || ZERO,
    scalarDenomination: market.scalarDenomination,
    resolutionSource: market.resolutionSource
      ? market.resolutionSource
      : (market.expirySourceType === EXPIRY_SOURCE_GENERIC &&
          'General knowledge') ||
        market.expirySource,
    currentTime: (state.blockchain || {}).currentAugurTimestamp,
    isLogged: state.authStatus.isLogged,
    isForking: state.universe.forkingInfo,
    market,
    isFavorite: !!state.favorites[ownProps.marketId],
    currentAugurTimestamp: state.blockchain.currentAugurTimestamp,
    reportingBarShowing,
  };
};

const mapDispatchToProps = dispatch => ({
  toggleFavorite: marketId => dispatch(toggleFavorite(marketId)),
});

const MarketHeaderContainer = withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(MarketHeader)
);

export default MarketHeaderContainer;
