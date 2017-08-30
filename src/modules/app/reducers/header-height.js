import { UPDATE_HEADER_HEIGHT } from 'modules/app/actions/update-header-height'

const DEFAULT_STATE = 0

export default function (headerHeight = DEFAULT_STATE, action) {
  switch (action.type) {
    case UPDATE_HEADER_HEIGHT:
      return action.data.headerHeight
    default:
      return headerHeight
  }
}
