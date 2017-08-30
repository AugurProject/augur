import { UPDATE_FAVORITES, TOGGLE_FAVORITE } from 'modules/markets/actions/update-favorites'
import { CLEAR_LOGIN_ACCOUNT } from 'modules/auth/actions/update-login-account'

const DEFAULT_STATE = {}

export default function (favorites = DEFAULT_STATE, action) {
  let newFavorites

  switch (action.type) {
    case UPDATE_FAVORITES:
      return {
        ...favorites,
        ...action.favorites
      }

    case TOGGLE_FAVORITE:
      newFavorites = {
        ...favorites
      }
      if (newFavorites[action.marketID]) {
        delete newFavorites[action.marketID]
      } else {
        newFavorites[action.marketID] = Date.now()
      }
      return newFavorites

    case CLEAR_LOGIN_ACCOUNT:
      return DEFAULT_STATE

    default:
      return favorites
  }
}
