import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import getValue from "utils/get-value";
import {
  removeLiquidityOrder,
  startOrderSending,
  clearMarketLiquidityOrders
} from "modules/orders/actions/liquidity-management";
import { updateModal } from "modules/modal/actions/update-modal";
import { closeModal } from "modules/modal/actions/close-modal";
import { MODAL_CONFIRM } from "modules/common-elements/constants";
import { getGasPrice } from "modules/auth/selectors/get-gas-price";
import MarketLiquidity from "modules/market/components/market-liquidity/market-liquidity";

const mapStateToProps = (state, ownProps) => ({
  isLogged: state.authStatus.isLogged,
  isMobile: state.appStatus.isMobile,
  isMobileSmall: state.appStatus.isMobileSmall,
  availableEth: getValue(state, "loginAccount.eth") || "0",
  loginAccount: state.loginAccount,
  gasPrice: getGasPrice(state)
});

const mapDispatchToProps = dispatch => ({
  clearMarketLiquidityOrders: data =>
    dispatch(clearMarketLiquidityOrders(data)),
  removeLiquidityOrder: data => dispatch(removeLiquidityOrder(data)),
  submitLiquidityOrders: data => dispatch(startOrderSending(data)),
  updateModal: data => dispatch(updateModal({ type: MODAL_CONFIRM, ...data })),
  closeModal: () => dispatch(closeModal())
});

const MarketLiquidityContainer = withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(MarketLiquidity)
);

export default MarketLiquidityContainer;
