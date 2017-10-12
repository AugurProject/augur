import { UPDATE_UNIVERSE } from 'modules/universe/actions/update-universe'

export default function (universe = {}, action) {
  switch (action.type) {
    case UPDATE_UNIVERSE:
      return {
        ...universe,
        ...action.universe
      }

    default:
      return universe
  }
}
