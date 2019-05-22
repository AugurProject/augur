import { Category, BaseAction } from "modules/types";
import {
  UPDATE_CATEGORIES,
  CLEAR_CATEGORIES
} from "modules/categories/actions/update-categories";
import { RESET_STATE } from "modules/app/actions/reset-state";

const DEFAULT_STATE: Array<Category> = [];

// TODO: make sure to merge in new categories/topics when new market comes in on log
export default function(categories = DEFAULT_STATE, { type, data }: BaseAction) {
  switch (type) {
    case UPDATE_CATEGORIES:
      return data.categories;
    case RESET_STATE:
    case CLEAR_CATEGORIES:
      return DEFAULT_STATE;
    default:
      return categories;
  }
}
