import { UPDATE_NEW_MARKET, CLEAR_NEW_MARKET } from 'modules/create-market/actions/update-new-market';

const DEFAULT_STATE = {
  previousStep: null,
  currentStep: 0,
  nextStep: 1
};

export default function (newMarket = DEFAULT_STATE, action) {
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
