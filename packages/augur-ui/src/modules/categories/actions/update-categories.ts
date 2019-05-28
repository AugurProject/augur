import { Category } from "modules/types";

export const UPDATE_CATEGORIES = "UPDATE_CATEGORIES";
export const CLEAR_CATEGORIES = "CLEAR_CATEGORIES";

export const updateCategories = (categories: Array<Category>) => ({
  type: UPDATE_CATEGORIES,
  data: { categories }
});
export const clearCategories = () => ({ type: CLEAR_CATEGORIES });
