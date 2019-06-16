import {
  UPDATE_FAVORITES,
  TOGGLE_FAVORITE
} from "modules/markets/actions/update-favorites";
import { CLEAR_LOGIN_ACCOUNT } from "modules/account/actions/login-account";
import { RESET_STATE } from "modules/app/actions/reset-state";
import { Favorite, BaseAction } from "modules/types";

const DEFAULT_STATE = {};

export default function(favorites = DEFAULT_STATE, { type, data }: BaseAction): Favorite {
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
    case CLEAR_LOGIN_ACCOUNT:
      return DEFAULT_STATE;
    default:
      return favorites;
  }
}
