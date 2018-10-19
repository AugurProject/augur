import { createSelector } from "reselect";
import { selectOrphanOrders } from "src/select-state";

const selectUndissmissedOrphanedOrdersSelector = () =>
  createSelector(selectOrphanOrders, orders =>
    orders.filter(it => !it.dismissed)
  );

export const selectUndissmissedOrphanedOrders = selectUndissmissedOrphanedOrdersSelector();
