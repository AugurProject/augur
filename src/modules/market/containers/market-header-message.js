import { connect } from "react-redux";
import MarketHeaderMessage from "modules/market/components/market-header-message/market-header-message";
import { addMarketBanner } from "modules/markets/actions/market-banners";

const mapStateToProps = state => ({
  marketBanners: state.marketBanners,
  isLoggedIn: (state.loginAccount || {}).address
});

const mapDispatchToProps = dispatch => ({
  dismiss: marketId => dispatch(addMarketBanner(marketId))
});

const mergeProps = (sP, dP, oP) => {
  const { marketId } = oP;

  const hasSeen = sP.marketBanners.indexOf(marketId) !== -1;

  return {
    show: !hasSeen,
    loggedIn: !!sP.isLoggedIn,
    ...oP,
    ...sP,
    ...dP
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(MarketHeaderMessage);
