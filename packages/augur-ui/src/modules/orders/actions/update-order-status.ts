import { ThunkDispatch } from "redux-thunk";
import { Action } from "redux";

export const UPDATE_ORDER_STATUS = "UPDATE_ORDER_STATUS";
export const UPDATE_ORDER_REMOVE = "UPDATE_ORDER_REMOVE";

export const addCanceledOrder = (orderId: string, status: string) => (dispatch: ThunkDispatch<void, any, Action>) =>
dispatch({ type: UPDATE_ORDER_STATUS, data: { orderId, status } });

export const removeCanceledOrder = (orderId: string) => (dispatch: ThunkDispatch<void, any, Action>) =>
  dispatch({ type: UPDATE_ORDER_REMOVE, data: { orderId } });

