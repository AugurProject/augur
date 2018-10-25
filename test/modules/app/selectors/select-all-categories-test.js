import { selectAllCategories } from "modules/categories/selectors/select-all-categories";

describe("modules/categories/selectors/select-all-categories.js", () => {
  let result;
  const state = {
    categories: [
      {
        category: "category-with-tags-0",
        tags: { "unique-tag": 1 }
      },
      {
        category: "categOry-With-Tags",
        tags: { "unique-tag-1": 1, "duplicate-tag": 2 }
      },
      {
        category: "category-with-tags-2",
        tags: { "unique-tag-1": 2, "duplicate-tag": 1, "another-tag": 3 }
      },
      {
        category: "category-without-tags",
        tags: {}
      }
    ]
  };

  beforeEach(() => {
    result = selectAllCategories(state);
  });

  it("should group tags by category", () => {
    const expected = {
      "CATEGORY-WITH-TAGS-0": ["unique-tag"],
      "CATEGORY-WITH-TAGS": ["unique-tag", "duplicate-tag"],
      "CATEGORY-WITH-TAGS-2": ["unique-tag-1", "duplicate-tag", "another-tag"],
      "CATEGORY-WITHOUT-TAGS": []
    };

    assert.deepEqual(result, expected);
  });
});
