import { UPDATE_FOOTER_HEIGHT } from 'modules/app/actions/update-footer-height'

const DEFAULT_STATE = 0

export default function (footerHeight = DEFAULT_STATE, action) {
  switch (action.type) {
    case UPDATE_FOOTER_HEIGHT:
      return action.data.footerHeight
    default:
      return footerHeight
  }
}
