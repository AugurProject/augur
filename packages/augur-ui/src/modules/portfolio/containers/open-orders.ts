import { connect } from "react-redux";

import OpenOrders from "modules/portfolio/components/orders/open-orders";
import { updateModal } from "modules/modal/actions/update-modal";
import * as constants from "modules/common/constants";
import selectMarketsOpenOrders from "modules/portfolio/selectors/select-markets-open-orders";
import { cancelAllOpenOrders } from "modules/orders/actions/cancel-order";
import { addCanceledOrder } from 'modules/pending-queue/actions/pending-queue-management';
import { TXEventName } from '@augurproject/sdk-lite';

const mapStateToProps = (state) => selectMarketsOpenOrders();

const mapDispatchToProps = (dispatch) => ({
  claimTradingProceeds: (marketId) =>
    dispatch(
      updateModal({ type: constants.MODAL_CLAIM_MARKETS_PROCEEDS, marketId }),
    ),
    cancelAllOpenOrders: (orders) => {
      dispatch(cancelAllOpenOrders(orders));
      orders.forEach(order => {
        dispatch(addCanceledOrder(order.id, TXEventName.Pending, null));
      });
    },
});

const OpenOrdersContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(OpenOrders);

export default OpenOrdersContainer;
