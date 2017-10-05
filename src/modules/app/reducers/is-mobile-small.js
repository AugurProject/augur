import { UPDATE_IS_MOBILE_SMALL } from 'modules/app/actions/update-is-mobile'

const DEFAULT_STATE = false

export default function (isMobileSmall = DEFAULT_STATE, action) {
  switch (action.type) {
    case UPDATE_IS_MOBILE_SMALL:
      return action.data.isMobileSmall
    default:
      return isMobileSmall
  }
}
