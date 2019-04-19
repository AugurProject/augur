import { connect } from "react-redux";

import OpenOrders from "modules/portfolio/components/orders/open-orders";
import { updateModal } from "modules/modal/actions/update-modal";
import getOpenOrders from "modules/orders/selectors/open-orders";
import * as constants from "src/modules/common-elements/constants";

const mapStateToProps = state => {
  const openOrders = getOpenOrders();
  const markets = openOrders.filter(
    market => market.marketStatus !== constants.MARKET_CLOSED
  );

  const individualOrders = markets.reduce(
    (p, market) => [...p, ...market.userOpenOrders],
    []
  );

  const marketsObj = markets.reduce((obj, market) => {
    obj[market.id] = market;
    return obj;
  }, {});

  const ordersObj = individualOrders.reduce((obj, order) => {
    obj[order.id] = order;
    return obj;
  }, {});

  return {
    markets,
    marketsObj,
    ordersObj,
    openOrders: individualOrders
  };
};

const mapDispatchToProps = dispatch => ({
  claimTradingProceeds: marketId =>
    dispatch(
      updateModal({ type: constants.MODAL_CLAIM_TRADING_PROCEEDS, marketId })
    )
});

const OpenOrdersContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(OpenOrders);

export default OpenOrdersContainer;
