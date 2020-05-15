import { track, MODAL_CLOSED } from 'services/analytics/helpers';
import { AppState } from 'appStore';
import { Action } from 'redux';
import { ThunkDispatch } from "redux-thunk";
import { AppStatus } from 'modules/app/store/app-status';
export const CLOSE_MODAL = 'CLOSE_MODAL';

export const closeModal = () => (
  dispatch: ThunkDispatch<void, any, Action>, getState: () => AppState
) => {
  const { modal: { type: modal } } = AppStatus.get();
  if (modal) {
    dispatch(
      track(`${modal} - ${MODAL_CLOSED}`, {
        modal: modal,
      })
    );
  }
  AppStatus.actions.closeModal();
};
