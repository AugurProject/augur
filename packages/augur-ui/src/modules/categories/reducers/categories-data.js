import {
  UPDATE_CATEGORIES,
  CLEAR_CATEGORIES
} from "modules/categories/actions/update-categories";
import { RESET_STATE } from "modules/app/actions/reset-state";

const DEFAULT_STATE = [];

// categories is of type Array<UICategory<string>>, see augur-node's types.ts
export default function(categories = DEFAULT_STATE, { type, data }) {
  switch (type) {
    case UPDATE_CATEGORIES:
      return data.categories; // NB we ignore pre-existing categories and so UPDATE_CATEGORIES replaces any previous categories. This is consistent with augur.getCategories() which always returns all categories and has no natural support for incrementally updating categories
    case RESET_STATE:
    case CLEAR_CATEGORIES:
      return DEFAULT_STATE;
    default:
      return categories;
  }
}
