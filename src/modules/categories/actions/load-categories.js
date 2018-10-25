import { augur } from "services/augurjs";
import {
  clearCategories,
  updateCategories
} from "modules/categories/actions/update-categories";
import logError from "utils/log-error";
import { assign } from "lodash";

const loadCategories = (callback = logError) => (dispatch, getState) => {
  const { universe } = getState();
  if (!universe.id) return callback(null);
  augur.markets.getCategories({ universe: universe.id }, (err, categories) => {
    if (err) return callback(err);
    if (categories == null) return callback(null);

    const newCategories = categories.reduce(
      (p, c) => [...p, assign(c, { tags: ["hello", "bye"] })],
      []
    );

    dispatch(clearCategories());
    dispatch(updateCategories(newCategories));

    callback(null, newCategories);
  });
};

export default loadCategories;
