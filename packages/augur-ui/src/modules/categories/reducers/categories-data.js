import BigNumber from "bignumber.js";
import {
  UPDATE_CATEGORIES,
  CLEAR_CATEGORIES,
  UPDATE_CATEGORY_POPULARITY
} from "modules/categories/actions/update-categories";
import { RESET_STATE } from "modules/app/actions/reset-state";

const DEFAULT_STATE = {};

export default function(categories = DEFAULT_STATE, { type, data }) {
  switch (type) {
    case UPDATE_CATEGORIES:
      return {
        ...categories,
        ...data.categories
      };
    case UPDATE_CATEGORY_POPULARITY: {
      const { category, amount } = data;
      return {
        ...categories,
        [category]: !categories[category]
          ? amount
          : new BigNumber(categories[category], 10)
              .plus(new BigNumber(amount, 10))
              .toFixed()
      };
    }
    case RESET_STATE:
    case CLEAR_CATEGORIES:
      return DEFAULT_STATE;
    default:
      return categories;
  }
}
