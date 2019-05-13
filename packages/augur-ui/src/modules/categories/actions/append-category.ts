import { updateCategories } from "modules/categories/actions/update-categories";

// makeUICategory returns a new category literal, ie. an
// object matching the type of augur-node's UICategory<string>.
function makeUICategory(
  categoryName: String,
  tagName1: String,
  tagName2: String
) {
  function makeTagAggregation(tagName: String) {
    return {
      nonFinalizedOpenInterest: "0",
      numberOfMarketsWithThisTag: 1,
      openInterest: "0",
      tagName
    };
  }
  const tags = [];
  if (tagName1) tags.push(makeTagAggregation(tagName1));
  if (tagName2) tags.push(makeTagAggregation(tagName2));
  return {
    categoryName,
    nonFinalizedOpenInterest: "0",
    openInterest: "0",
    tags
  };
}

export function appendCategoryIfNew(
  dispatch: Function,
  categories: Array<any>,
  marketWithMaybeNewCategory: any
) {
  const isExistingCategory = categories.find(
    c => c.categoryName === marketWithMaybeNewCategory.category
  );
  if (!isExistingCategory) {
    dispatch(
      updateCategories([
        ...categories,
        makeUICategory(
          marketWithMaybeNewCategory.category,
          marketWithMaybeNewCategory.tags[0],
          marketWithMaybeNewCategory.tags[1]
        )
      ])
    );
  }
}
