import {
  UPDATE_FAVORITES,
  TOGGLE_FAVORITE
} from "modules/markets/actions/update-favorites";
import { LOGIN_ACTIONS } from "modules/common/types/login-account";
import { RESET_STATE } from "modules/app/actions/reset-state";

const DEFAULT_STATE = {};

export default function(favorites = DEFAULT_STATE, { type, data }) {
  switch (type) {
    case UPDATE_FAVORITES:
      return {
        ...favorites,
        ...data.favorites
      };
    case TOGGLE_FAVORITE: {
      const { marketId, timestamp } = data;
      const newFavorites = {
        ...favorites
      };
      if (newFavorites[marketId]) {
        delete newFavorites[marketId];
      } else {
        newFavorites[marketId] = timestamp;
      }
      return newFavorites;
    }
    case RESET_STATE:
    case LOGIN_ACTIONS.CLEAR_LOGIN_ACCOUNT:
      return DEFAULT_STATE;
    default:
      return favorites;
  }
}
