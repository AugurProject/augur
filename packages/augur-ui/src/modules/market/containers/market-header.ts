import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import MarketHeader from 'modules/market/components/market-header/market-header';
import { ZERO, REPORTING_STATE } from 'modules/common/constants';
import { selectMarket } from 'modules/markets/selectors/market';
import { toggleFavorite } from 'modules/markets/actions/update-favorites';
import { marketLinkCopied } from 'services/analytics/helpers';
import { isSameAddress } from 'utils/isSameAddress';
import { AppStatus } from 'modules/app/store/app-status';

const mapStateToProps = (state, ownProps) => {
  const market = ownProps.market || selectMarket(ownProps.marketId);
  const { reportingState, consensusFormatted: consensus } = market;
  let reportingBarShowing = false;
  const {
    loginAccount: { address: userAccount },
    universe: { forkingInfo },
    blockchain: { currentAugurTimestamp },
  } = AppStatus.get();

  if (
    consensus ||
    reportingState === REPORTING_STATE.CROWDSOURCING_DISPUTE ||
    reportingState === REPORTING_STATE.OPEN_REPORTING ||
    (reportingState === REPORTING_STATE.DESIGNATED_REPORTING &&
      isSameAddress(market.designatedReporter, userAccount))
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
    currentTime: currentAugurTimestamp,
    isForking: forkingInfo,
    market,
    isFavorite: !!state.favorites[ownProps.marketId],
    currentAugurTimestamp,
    reportingBarShowing,
    preview: ownProps.preview,
    userAccount,
  };
};

const mapDispatchToProps = dispatch => ({
  toggleFavorite: marketId => dispatch(toggleFavorite(marketId)),
  marketLinkCopied: (marketId, location) =>
    dispatch(marketLinkCopied(marketId, location)),
});

const MarketHeaderContainer = withRouter(
  connect(mapStateToProps, mapDispatchToProps)(MarketHeader)
);

export default MarketHeaderContainer;
