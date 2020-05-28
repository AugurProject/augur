import { track, MODAL_CLOSED } from 'services/analytics/helpers';
import { AppStatus } from 'modules/app/store/app-status';
export const CLOSE_MODAL = 'CLOSE_MODAL';

export const closeModal = () => {
  const { modal: { type: modal } } = AppStatus.get();
  if (modal) {
    track(`${modal} - ${MODAL_CLOSED}`, {
      modal,
    });
  }
  AppStatus.actions.closeModal();
};
