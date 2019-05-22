import { UPDATE_MODAL } from "modules/modal/actions/update-modal";
import { CLOSE_MODAL } from "modules/modal/actions/close-modal";
import { RESET_STATE } from "modules/app/actions/reset-state";
import { BaseAction } from "modules/types";

const DEFAULT_STATE = {};

export default function(modal = DEFAULT_STATE, action: BaseAction) {
  switch (action.type) {
    case UPDATE_MODAL:
      return action.data.modalOptions;
    case RESET_STATE:
    case CLOSE_MODAL:
      return DEFAULT_STATE;
    default:
      return modal;
  }
}
