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

  test("should group tags by category", () => {
    const expected = {
      "CATEGORY-WITH-TAGS-0": ["unique-tag"],
      "CATEGORY-WITH-TAGS": ["unique-tag-1", "duplicate-tag"],
      "CATEGORY-WITH-TAGS-2": ["unique-tag-1", "duplicate-tag", "another-tag"],
      "CATEGORY-WITHOUT-TAGS": []
    };

    expect(result).toEqual(expected);
  });
});
