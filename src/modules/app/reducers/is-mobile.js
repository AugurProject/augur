import { UPDATE_IS_MOBILE } from 'modules/app/actions/update-is-mobile'

const DEFAULT_STATE = false

export default function (isMobile = DEFAULT_STATE, action) {
  switch (action.type) {
    case UPDATE_IS_MOBILE:
      return action.data.isMobile
    default:
      return isMobile
  }
}
