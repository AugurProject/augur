import { track, MODAL_CLOSED } from 'services/analytics/helpers';
import { AppState } from 'appStore';
import { Action } from 'redux';
import { ThunkDispatch } from "redux-thunk";
import { AppStatusState, AppStatusActions } from 'modules/app/store/app-status';
export const CLOSE_MODAL = 'CLOSE_MODAL';

export const closeModal = () => (
  dispatch: ThunkDispatch<void, any, Action>, getState: () => AppState
) => {
  const { modal } = AppStatusState.get();
  if (modal.type) {
    dispatch(
      track(modal.type + ' - ' + MODAL_CLOSED, {
        modal: modal.type,
      })
    );
  }
  AppStatusActions.actions.closeModal();
};
