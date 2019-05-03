import { createPagesArray } from "modules/common-elements/pagination";

describe(`modules/common-elements/pagination.tsx`, () => {
  test("Should handle 1, 10", () => {
    expect(createPagesArray(1, 10)).toEqual([
      {
        page: 1,
        active: true
      },
      {
        page: 2,
        active: false
      },
      {
        page: 3,
        active: false
      },
      {
        page: 4,
        active: false
      },
      {
        page: 5,
        active: false
      },
      {
        page: 6,
        active: false
      },
      {
        page: 7,
        active: false
      },
      {
        page: null,
        active: false
      },
      {
        page: 10,
        active: false
      }
    ]);
  });
  test("Should handle 2, 10", () => {
    expect(createPagesArray(2, 10)).toEqual([
      {
        page: 1,
        active: false
      },
      {
        page: 2,
        active: true
      },
      {
        page: 3,
        active: false
      },
      {
        page: 4,
        active: false
      },
      {
        page: 5,
        active: false
      },
      {
        page: 6,
        active: false
      },
      {
        page: 7,
        active: false
      },
      {
        page: null,
        active: false
      },
      {
        page: 10,
        active: false
      }
    ]);
  });
  test("Should handle 3, 10", () => {
    expect(createPagesArray(3, 10)).toEqual([
      {
        page: 1,
        active: false
      },
      {
        page: 2,
        active: false
      },
      {
        page: 3,
        active: true
      },
      {
        page: 4,
        active: false
      },
      {
        page: 5,
        active: false
      },
      {
        page: 6,
        active: false
      },
      {
        page: 7,
        active: false
      },
      {
        page: null,
        active: false
      },
      {
        page: 10,
        active: false
      }
    ]);
  });
  test("Should handle 4, 10", () => {
    expect(createPagesArray(4, 10)).toEqual([
      {
        page: 1,
        active: false
      },
      {
        page: 2,
        active: false
      },
      {
        page: 3,
        active: false
      },
      {
        page: 4,
        active: true
      },
      {
        page: 5,
        active: false
      },
      {
        page: 6,
        active: false
      },
      {
        page: 7,
        active: false
      },
      {
        page: null,
        active: false
      },
      {
        page: 10,
        active: false
      }
    ]);
  });
  test("Should handle 5, 10", () => {
    expect(createPagesArray(5, 10)).toEqual([
      {
        page: 1,
        active: false
      },
      {
        page: 2,
        active: false
      },
      {
        page: 3,
        active: false
      },
      {
        page: 4,
        active: false
      },
      {
        page: 5,
        active: true
      },
      {
        page: 6,
        active: false
      },
      {
        page: 7,
        active: false
      },
      {
        page: null,
        active: false
      },
      {
        page: 10,
        active: false
      }
    ]);
  });
  test("Should handle 6, 10", () => {
    expect(createPagesArray(6, 10)).toEqual([
      {
        page: 1,
        active: false
      },
      {
        page: null,
        active: false
      },
      {
        page: 4,
        active: false
      },
      {
        page: 5,
        active: false
      },
      {
        page: 6,
        active: true
      },
      {
        page: 7,
        active: false
      },
      {
        page: 8,
        active: false
      },
      {
        page: 9,
        active: false
      },
      {
        page: 10,
        active: false
      }
    ]);
  });
  test("Should handle 7, 10", () => {
    expect(createPagesArray(7, 10)).toEqual([
      {
        page: 1,
        active: false
      },
      {
        page: null,
        active: false
      },
      {
        page: 4,
        active: false
      },
      {
        page: 5,
        active: false
      },
      {
        page: 6,
        active: false
      },
      {
        page: 7,
        active: true
      },
      {
        page: 8,
        active: false
      },
      {
        page: 9,
        active: false
      },
      {
        page: 10,
        active: false
      }
    ]);
  });
  test("Should handle 8, 10", () => {
    expect(createPagesArray(8, 10)).toEqual([
      {
        page: 1,
        active: false
      },
      {
        page: null,
        active: false
      },
      {
        page: 4,
        active: false
      },
      {
        page: 5,
        active: false
      },
      {
        page: 6,
        active: false
      },
      {
        page: 7,
        active: false
      },
      {
        page: 8,
        active: true
      },
      {
        page: 9,
        active: false
      },
      {
        page: 10,
        active: false
      }
    ]);
  });
  test("Should handle 9, 10", () => {
    expect(createPagesArray(9, 10)).toEqual([
      {
        page: 1,
        active: false
      },
      {
        page: null,
        active: false
      },
      {
        page: 4,
        active: false
      },
      {
        page: 5,
        active: false
      },
      {
        page: 6,
        active: false
      },
      {
        page: 7,
        active: false
      },
      {
        page: 8,
        active: false
      },
      {
        page: 9,
        active: true
      },
      {
        page: 10,
        active: false
      }
    ]);
  });
  test("Should handle 10, 10", () => {
    expect(createPagesArray(10, 10)).toEqual([
      {
        page: 1,
        active: false
      },
      {
        page: null,
        active: false
      },
      {
        page: 4,
        active: false
      },
      {
        page: 5,
        active: false
      },
      {
        page: 6,
        active: false
      },
      {
        page: 7,
        active: false
      },
      {
        page: 8,
        active: false
      },
      {
        page: 9,
        active: false
      },
      {
        page: 10,
        active: true
      }
    ]);
  });
  test("Should handle 3, 6", () => {
    expect(createPagesArray(3, 6)).toEqual([
      {
        page: 1,
        active: false
      },
      {
        page: 2,
        active: false
      },
      {
        page: 3,
        active: true
      },
      {
        page: 4,
        active: false
      },
      {
        page: 5,
        active: false
      },
      {
        page: 6,
        active: false
      }
    ]);
  });
  test("Should handle 5, 12", () => {
    expect(createPagesArray(5, 12)).toEqual([
      {
        page: 1,
        active: false
      },
      {
        page: 2,
        active: false
      },
      {
        page: 3,
        active: false
      },
      {
        page: 4,
        active: false
      },
      {
        page: 5,
        active: true
      },
      {
        page: 6,
        active: false
      },
      {
        page: 7,
        active: false
      },
      {
        page: null,
        active: false
      },
      {
        page: 12,
        active: false
      }
    ]);
  });
  test("Should handle 7, 12", () => {
    expect(createPagesArray(7, 12)).toEqual([
      {
        page: 1,
        active: false
      },
      {
        page: null,
        active: false
      },
      {
        page: 5,
        active: false
      },
      {
        page: 6,
        active: false
      },
      {
        page: 7,
        active: true
      },
      {
        page: 8,
        active: false
      },
      {
        page: 9,
        active: false
      },
      {
        page: null,
        active: false
      },
      {
        page: 12,
        active: false
      }
    ]);
  });
  test("Should handle 8, 12", () => {
    expect(createPagesArray(8, 12)).toEqual([
      {
        page: 1,
        active: false
      },
      {
        page: null,
        active: false
      },
      {
        page: 6,
        active: false
      },
      {
        page: 7,
        active: false
      },
      {
        page: 8,
        active: true
      },
      {
        page: 9,
        active: false
      },
      {
        page: 10,
        active: false
      },
      {
        page: 11,
        active: false
      },
      {
        page: 12,
        active: false
      }
    ]);
  });
  test("Should handle 25, 50", () => {
    expect(createPagesArray(25, 50)).toEqual([
      {
        page: 1,
        active: false
      },
      {
        page: null,
        active: false
      },
      {
        page: 23,
        active: false
      },
      {
        page: 24,
        active: false
      },
      {
        page: 25,
        active: true
      },
      {
        page: 26,
        active: false
      },
      {
        page: 27,
        active: false
      },
      {
        page: null,
        active: false
      },
      {
        page: 50,
        active: false
      }
    ]);
  });
  test("Should handle 1, 3", () => {
    expect(createPagesArray(1, 3)).toEqual([
      {
        page: 1,
        active: true
      },
      {
        page: 2,
        active: false
      },
      {
        page: 3,
        active: false
      }
    ]);
  });
  test("Should handle 2, 3", () => {
    expect(createPagesArray(2, 3)).toEqual([
      {
        page: 1,
        active: false
      },
      {
        page: 2,
        active: true
      },
      {
        page: 3,
        active: false
      }
    ]);
  });
  test("Should handle 3, 3", () => {
    expect(createPagesArray(3, 3)).toEqual([
      {
        page: 1,
        active: false
      },
      {
        page: 2,
        active: false
      },
      {
        page: 3,
        active: true
      }
    ]);
  });
  test("Should handle 1, 8", () => {
    expect(createPagesArray(1, 8)).toEqual([
      {
        page: 1,
        active: true
      },
      {
        page: 2,
        active: false
      },
      {
        page: 3,
        active: false
      },
      {
        page: 4,
        active: false
      },
      {
        page: 5,
        active: false
      },
      {
        page: 6,
        active: false
      },
      {
        page: 7,
        active: false
      },
      {
        page: 8,
        active: false
      }
    ]);
  });
  test("Should handle 2, 8", () => {
    expect(createPagesArray(2, 8)).toEqual([
      {
        page: 1,
        active: false
      },
      {
        page: 2,
        active: true
      },
      {
        page: 3,
        active: false
      },
      {
        page: 4,
        active: false
      },
      {
        page: 5,
        active: false
      },
      {
        page: 6,
        active: false
      },
      {
        page: 7,
        active: false
      },
      {
        page: 8,
        active: false
      }
    ]);
  });
  test("Should handle 7, 8", () => {
    expect(createPagesArray(7, 8)).toEqual([
      {
        page: 1,
        active: false
      },
      {
        page: 2,
        active: false
      },
      {
        page: 3,
        active: false
      },
      {
        page: 4,
        active: false
      },
      {
        page: 5,
        active: false
      },
      {
        page: 6,
        active: false
      },
      {
        page: 7,
        active: true
      },
      {
        page: 8,
        active: false
      }
    ]);
  });
  test("Should handle 8, 8", () => {
    expect(createPagesArray(8, 8)).toEqual([
      {
        page: 1,
        active: false
      },
      {
        page: 2,
        active: false
      },
      {
        page: 3,
        active: false
      },
      {
        page: 4,
        active: false
      },
      {
        page: 5,
        active: false
      },
      {
        page: 6,
        active: false
      },
      {
        page: 7,
        active: false
      },
      {
        page: 8,
        active: true
      }
    ]);
  });
  test("Should handle 1, 9", () => {
    expect(createPagesArray(1, 9)).toEqual([
      {
        page: 1,
        active: true
      },
      {
        page: 2,
        active: false
      },
      {
        page: 3,
        active: false
      },
      {
        page: 4,
        active: false
      },
      {
        page: 5,
        active: false
      },
      {
        page: 6,
        active: false
      },
      {
        page: 7,
        active: false
      },
      {
        page: 8,
        active: false
      },
      {
        page: 9,
        active: false
      }
    ]);
  });
  test("Should handle 2, 9", () => {
    expect(createPagesArray(2, 9)).toEqual([
      {
        page: 1,
        active: false
      },
      {
        page: 2,
        active: true
      },
      {
        page: 3,
        active: false
      },
      {
        page: 4,
        active: false
      },
      {
        page: 5,
        active: false
      },
      {
        page: 6,
        active: false
      },
      {
        page: 7,
        active: false
      },
      {
        page: 8,
        active: false
      },
      {
        page: 9,
        active: false
      }
    ]);
  });
  test("Should handle 8, 9", () => {
    expect(createPagesArray(8, 9)).toEqual([
      {
        page: 1,
        active: false
      },
      {
        page: 2,
        active: false
      },
      {
        page: 3,
        active: false
      },
      {
        page: 4,
        active: false
      },
      {
        page: 5,
        active: false
      },
      {
        page: 6,
        active: false
      },
      {
        page: 7,
        active: false
      },
      {
        page: 8,
        active: true
      },
      {
        page: 9,
        active: false
      }
    ]);
  });
  test("Should handle 9, 9", () => {
    expect(createPagesArray(9, 9)).toEqual([
      {
        page: 1,
        active: false
      },
      {
        page: 2,
        active: false
      },
      {
        page: 3,
        active: false
      },
      {
        page: 4,
        active: false
      },
      {
        page: 5,
        active: false
      },
      {
        page: 6,
        active: false
      },
      {
        page: 7,
        active: false
      },
      {
        page: 8,
        active: false
      },
      {
        page: 9,
        active: true
      }
    ]);
  });
  test("Should handle 9, 13", () => {
    expect(createPagesArray(9, 13)).toEqual([
      {
        page: 1,
        active: false
      },
      {
        page: null,
        active: false
      },
      {
        page: 7,
        active: false
      },
      {
        page: 8,
        active: false
      },
      {
        page: 9,
        active: true
      },
      {
        page: 10,
        active: false
      },
      {
        page: 11,
        active: false
      },
      {
        page: 12,
        active: false
      },
      {
        page: 13,
        active: false
      }
    ]);
  });
  test("Should handle 5, 13", () => {
    expect(createPagesArray(5, 13)).toEqual([
      {
        page: 1,
        active: false
      },
      {
        page: 2,
        active: false
      },
      {
        page: 3,
        active: false
      },
      {
        page: 4,
        active: false
      },
      {
        page: 5,
        active: true
      },
      {
        page: 6,
        active: false
      },
      {
        page: 7,
        active: false
      },
      {
        page: null,
        active: false
      },
      {
        page: 13,
        active: false
      }
    ]);
  });
});
