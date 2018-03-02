import { UPDATE_FAVORITES, TOGGLE_FAVORITE } from 'modules/markets/actions/update-favorites'
import { CLEAR_LOGIN_ACCOUNT } from 'modules/auth/actions/update-login-account'
import { RESET_STATE } from 'modules/app/actions/reset-state'

const DEFAULT_STATE = {}

export default function (favorites = DEFAULT_STATE, action) {
  let newFavorites
  switch (action.type) {
    case UPDATE_FAVORITES:
      return {
        ...favorites,
        ...action.favorites,
      }
    case TOGGLE_FAVORITE:
      newFavorites = {
        ...favorites,
      }
      if (newFavorites[action.marketId]) {
        delete newFavorites[action.marketId]
      } else {
        newFavorites[action.marketId] = Date.now()
      }
      return newFavorites
    case RESET_STATE:
    case CLEAR_LOGIN_ACCOUNT:
      return DEFAULT_STATE
    default:
      return favorites
  }
}
