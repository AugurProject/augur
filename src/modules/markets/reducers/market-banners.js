import {
  ADD_MARKET_BANNER,
  ADD_ALL_MARKET_BANNERS
} from "modules/markets/actions/market-banners";
import { CLEAR_LOGIN_ACCOUNT } from "modules/auth/actions/update-login-account";
import { RESET_STATE } from "modules/app/actions/reset-state";

const DEFAULT_STATE = [];

export default function(marketBanners = DEFAULT_STATE, { type, data }) {
  switch (type) {
    case ADD_MARKET_BANNER:
      return [...marketBanners, data.marketId];
    case ADD_ALL_MARKET_BANNERS:
      return data;
    case RESET_STATE:
    case CLEAR_LOGIN_ACCOUNT:
      return DEFAULT_STATE;
    default:
      return marketBanners;
  }
}
