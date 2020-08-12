import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { InvalidLabel } from 'modules/common/labels';
import { MODAL_INVALID_MARKET_RULES, SCALAR, } from 'modules/common/constants';
import { updateModal } from 'modules/modal/actions/update-modal';
import { AppState } from 'appStore';
import { selectMarket } from 'modules/markets/selectors/market';
import { InvalidTradingTooltip, InvalidTradingScalarTooltip } from 'modules/create-market/constants';

interface InvalidProps {
  marketId?: string;
}
const mapStateToProps = (state: AppState, ownProps: InvalidProps) => {
  let phrase = InvalidTradingTooltip;
  const market = ownProps.marketId ? selectMarket(ownProps.marketId) : null;
  if (market && market.marketType === SCALAR) {
    const maxPrice = String(market.maxPriceBigNumber);
    const denomination = market.outcomes[1]?.description;
    phrase = InvalidTradingScalarTooltip(maxPrice, denomination);
  }
  return {
    phrase
  };
};

const mapDispatchToProps = dispatch => ({
  openInvalidMarketRulesModal: () => dispatch(updateModal({type: MODAL_INVALID_MARKET_RULES})),
});

const InvalidLabelContainer = withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(InvalidLabel)
);

export default InvalidLabelContainer;
