import { selectCategories } from "modules/categories/selectors/categories";

describe(`modules/categories/selectors/categories.js`, () => {
  test("no categories", () => {
    const categories = {};
    const output = selectCategories({ categories });
    expect(output).toEqual([]);
  });
  test("1 category", () => {
    const categories = {
      0: {
        category: "testing",
        popularity: 10
      }
    };
    const output = selectCategories({ categories });
    expect(output).toEqual([{ category: "testing", popularity: 10 }]);
  });
  test("2 categories of unequal popularity", () => {
    const categories = {
      0: {
        category: "testing",
        popularity: 10
      },
      1: {
        category: "backflips",
        popularity: 2
      }
    };
    const output = selectCategories({ categories });
    expect(output).toEqual([
      { category: "testing", popularity: 10 },
      { category: "backflips", popularity: 2 }
    ]);
  });
  test("2 categories of equal popularity", () => {
    const categories = {
      0: {
        category: "testing",
        popularity: 10
      },
      1: {
        category: "frontflips",
        popularity: 10
      }
    };
    const output = selectCategories({ categories });
    expect(output).toEqual([
      { category: "testing", popularity: 10 },
      { category: "frontflips", popularity: 10 }
    ]);
  });
  test("3 categories of unequal popularity", () => {
    const categories = {
      0: {
        category: "testing",
        popularity: 10
      },
      1: {
        category: "backflips",
        popularity: 2
      },
      2: {
        category: "sideflips",
        popularity: 5
      }
    };
    const output = selectCategories({ categories });
    expect(output).toEqual([
      { category: "testing", popularity: 10 },
      { category: "sideflips", popularity: 5 },
      { category: "backflips", popularity: 2 }
    ]);
  });
  test("3 categories, 2 of equal popularity", () => {
    const categories = {
      0: {
        category: "testing",
        popularity: 10
      },
      1: {
        category: "backflips",
        popularity: 2
      },
      2: {
        category: "frontflips",
        popularity: 10
      }
    };
    const output = selectCategories({ categories });
    expect(output).toEqual([
      { category: "testing", popularity: 10 },
      { category: "frontflips", popularity: 10 },
      { category: "backflips", popularity: 2 }
    ]);
  });
  test("3 categories of equal popularity", () => {
    const categories = {
      0: {
        category: "testing",
        popularity: 10
      },
      1: {
        category: "twirling",
        popularity: 10
      },
      2: {
        category: "frontflips",
        popularity: 10
      }
    };
    const output = selectCategories({ categories });
    expect(output).toEqual([
      { category: "testing", popularity: 10 },
      { category: "twirling", popularity: 10 },
      { category: "frontflips", popularity: 10 }
    ]);
  });
  test("4 categories of equal popularity, one is empty name and shouldnt get passed out of selector.", () => {
    const categories = {
      0: {
        category: "testing",
        popularity: 10
      },
      1: {
        category: "twirling",
        popularity: 10
      },
      2: {
        category: "frontflips",
        popularity: 10
      },
      3: {
        category: "",
        popularity: 10
      }
    };
    const output = selectCategories({ categories });
    expect(output).toEqual([
      { category: "testing", popularity: 10 },
      { category: "twirling", popularity: 10 },
      { category: "frontflips", popularity: 10 }
    ]);
  });
});
