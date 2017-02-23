import { UPDATE_NEW_MARKET, CLEAR_NEW_MARKET } from 'modules/create-market/actions/update-new-market';

export default function (newMarket = {}, action) {
  switch (action.type) {
    case UPDATE_NEW_MARKET:
      return {
        ...newMarket,
        ...action.data
      };
    case CLEAR_NEW_MARKET:
      return {};
    default:
      return newMarket;
  }
}
