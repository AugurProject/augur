import { filterArrayByArrayPredicate } from "src/modules/filter-sort/helpers/filter-array-of-objects-by-array";

import { identity } from "lodash/fp";

describe("src/modules/filter-sort/helpers/filter-array-of-objects-by-array.js", () => {
  const examplePropertyToFilterOn = "some-prop";
  let result;

  describe("when propertyToFilterOn is null", () => {
    beforeEach(() => {
      result = filterArrayByArrayPredicate(null, []);
    });

    test("should return identity function", () => {
      expect(result).toEqual(identity);
    });
  });

  describe("when arrayToFilterBy is null", () => {
    beforeEach(() => {
      result = filterArrayByArrayPredicate(examplePropertyToFilterOn, null);
    });

    test("should return identity function", () => {
      expect(result).toEqual(identity);
    });
  });

  describe("when arrayToFilterBy is an empty array", () => {
    beforeEach(() => {
      result = filterArrayByArrayPredicate("some-prop", []);
    });

    test("should return identity function", () => {
      expect(result).toEqual(identity);
    });
  });

  describe("when arrayToFilterBy is non-empty", () => {
    let exampleArrayToFilterBy;
    let filterPredicateFn;

    beforeEach(() => {
      exampleArrayToFilterBy = ["prop1", "prop2"];
      filterPredicateFn = filterArrayByArrayPredicate(
        examplePropertyToFilterOn,
        exampleArrayToFilterBy
      );
    });

    test("should return a filter function", () => {
      expect(typeof filterPredicateFn).toBe("function");
    });

    describe("when passed an object that has one matching members", () => {
      beforeEach(() => {
        result = filterPredicateFn({
          [examplePropertyToFilterOn]: ["prop1"]
        });
      });

      test("should be true", () => {
        expect(result).toBeTruthy();
      });
    });

    describe("when passed an object with two matching members", () => {
      beforeEach(() => {
        result = filterPredicateFn({
          [examplePropertyToFilterOn]: ["prop1", "prop2"]
        });
      });

      test("should be true", () => {
        expect(result).toBeTruthy();
      });
    });

    describe("when passed an object without matching member", () => {
      beforeEach(() => {
        result = filterPredicateFn({
          [examplePropertyToFilterOn]: ["prop3"]
        });
      });

      test("should be true", () => {
        expect(result).toBeFalsy();
      });
    });

    describe("when passed an object without property to filter on", () => {
      beforeEach(() => {
        result = filterPredicateFn({});
      });

      test("should be false", () => {
        expect(result).toBeFalsy();
      });
    });
  });
});
