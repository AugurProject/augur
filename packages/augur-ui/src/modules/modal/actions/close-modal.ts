import { track, MODAL_CLOSED } from 'services/analytics/helpers';
import { AppState } from 'store';
import { Action } from 'redux';
import { NodeStyleCallback } from "modules/types";
import logError from "utils/log-error";
import { ThunkAction, ThunkDispatch } from "redux-thunk";

export const CLOSE_MODAL = 'CLOSE_MODAL';

export const closeModal = () => (
  dispatch: ThunkDispatch<void, any, Action>, getState: () => AppState
) => {
  const { modal } = getState();
  if (modal.type) {
    dispatch(
      track(modal.type + ' - ' + MODAL_CLOSED, {
        modal: modal.type,
      })
    );
  }
  dispatch(close());
};

export function close() {
  return { type: CLOSE_MODAL };
}