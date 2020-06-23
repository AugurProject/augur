import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import MarketOrdersPositionsTable from 'modules/market/components/market-orders-positions-table/market-orders-positions-table';
import { selectMarket } from 'modules/markets/selectors/market';
import { cancelAllOpenOrders } from 'modules/orders/actions/cancel-order';
import { selectUserFilledOrders } from 'modules/orders/selectors/filled-orders';
import getUserOpenOrders from 'modules/orders/selectors/user-open-orders';
import { TXEventName } from '@augurproject/sdk-lite';
import { addCanceledOrder } from 'modules/pending-queue/actions/pending-queue-management';

const mapStateToProps = (state, ownProps) => {
  const market = ownProps.market || selectMarket(ownProps.marketId);
  let openOrders = getUserOpenOrders(market.id) || [];

  let filledOrders = market.id
    ? selectUserFilledOrders(state, market.id)
    : [];
  const hasPending = Boolean(openOrders.find(order => order.pending));

  if (ownProps.preview && !ownProps.tradingTutorial) {
    openOrders = [];
    Object.values(market.orderBook).map(outcome => {
      openOrders = openOrders.concat(outcome);
    });
  }

  if (ownProps.tradingTutorial && ownProps.orders) {
    openOrders = ownProps.orders;
  }

  if (ownProps.tradingTutorial && ownProps.fills) {
    filledOrders = ownProps.fills;
  }

  return {
    winningOutcome: market.consensus && market.consensus.winningOutcome,
    hasPending,
    outcomes: market.outcomes || [],
    openOrders,
    market,
    filledOrders,
  };
};

const mapDispatchToProps = dispatch => ({
  cancelAllOpenOrders: (orders) => {
    dispatch(cancelAllOpenOrders(orders));
    orders.forEach(order => {
      dispatch(addCanceledOrder(order.id, TXEventName.Pending, null));
    });
  },
});

const MarketOrdersPositionsTableContainer = withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(MarketOrdersPositionsTable)
);

export default MarketOrdersPositionsTableContainer;
