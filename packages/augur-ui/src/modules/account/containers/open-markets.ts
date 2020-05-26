import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { AppState } from "appStore";
import OpenMarkets from "modules/account/components/open-markets";
import getLoginAccountPositionsMarkets from "modules/positions/selectors/login-account-positions-markets";

const mapStateToProps = (state: AppState) => {
  return getLoginAccountPositionsMarkets();
};

const OpenMarketsContainer = withRouter(connect(mapStateToProps)(OpenMarkets));

export default OpenMarketsContainer;
