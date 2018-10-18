import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { collectMarketCreatorFees } from "modules/markets/actions/market-creator-fees-management";
import MarketPreview from "modules/market/components/market-preview/market-preview";
import { toggleFavorite } from "modules/markets/actions/update-favorites";

const mapStateToProps = state => ({
  isLogged: state.authStatus.isLogged
});

const mapDispatchToProps = dispatch => ({
  collectMarketCreatorFees: (getBalanceOnly, marketId, callback) =>
    dispatch(collectMarketCreatorFees(getBalanceOnly, marketId, callback)),
  toggleFavorite: marketId => dispatch(toggleFavorite(marketId))
});

const ConnectedMarketPreview = connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(MarketPreview));
export default ConnectedMarketPreview;
