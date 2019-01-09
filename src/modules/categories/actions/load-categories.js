import { augur } from "services/augurjs";
import {
  clearCategories,
  updateCategories
} from "modules/categories/actions/update-categories";
import logError from "utils/log-error";

const loadCategories = (callback = logError) => (dispatch, getState) => {
  const { universe } = getState();
  if (!universe.id) return callback(null);
  augur.markets.getCategories({ universe: universe.id }, (err, categories) => {
    if (err) return callback(err);
    if (categories == null) return callback(null);
    dispatch(clearCategories());

    // Categories currently don't allow the user to specify how they should be
    // sorted; to enable users to discover interesting markets, sort categories
    // and their nested tags by non-finalized open interest. Do this here
    // because this sort is expensive and we only want to do it once, upstream
    // of redux store. Possibly this could be done in augur-node instead,
    // such that the UI would just rely on categories already being sorted.
    categories.sort(sortByNonFinalizedOpenInterestDescending);
    categories.forEach(c =>
      c.tags.sort(sortByNonFinalizedOpenInterestDescending)
    );

    dispatch(updateCategories(categories));
    callback(null, categories);
  });
};

export default loadCategories;

function sortByNonFinalizedOpenInterestDescending(a, b) {
  // If optimization needed, parseFloat for each object up
  // front instead of redundantly doing it each comparison.
  const oiA = parseFloat(a.nonFinalizedOpenInterest);
  const oiB = parseFloat(b.nonFinalizedOpenInterest);
  if (isNaN(oiA)) {
    return -1;
  }
  if (isNaN(oiB)) {
    return 1;
  }
  return oiB - oiA;
}
