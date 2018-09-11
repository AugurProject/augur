import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { collectMarketCreatorFees } from "modules/markets/actions/market-creator-fees-management";
import MarketPreview from "modules/market/components/market-preview/market-preview";

const mapStateToProps = state => ({
  isLogged: state.authStatus.isLogged
});

const mapDispatchToProps = dispatch => ({
  collectMarketCreatorFees: (getBalanceOnly, marketId, callback) =>
    dispatch(collectMarketCreatorFees(getBalanceOnly, marketId, callback))
});

const ConnectedMarketPreview = connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(MarketPreview));
export default ConnectedMarketPreview;
