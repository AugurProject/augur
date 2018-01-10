import { UPDATE_MODAL } from 'modules/modal/actions/update-modal'
import { CLOSE_MODAL } from 'modules/modal/actions/close-modal'

const DEFAULT_STATE = {}

export default function (modal = DEFAULT_STATE, action) {
  switch (action.type) {
    case (UPDATE_MODAL):
      return action.data
    case (CLOSE_MODAL):
      return DEFAULT_STATE
    default:
      return modal
  }
}
