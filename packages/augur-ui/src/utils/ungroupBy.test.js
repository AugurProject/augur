import { ungroupBy } from "utils/ungroupBy";

describe("utils/ungroupBy.js", () => {
  describe("ungroupBy method", () => {
    // This is the omnibus example.
    it("should collapse trees into an array of flattish objects", () => {
      const obj = {
        v1: {
          v2: {
            v3: [
              {
                id: 1,
                anotherObj: {
                  prop: "yo"
                }
              },
              {
                id: 2
              }
            ]
          }
        }
      };

      expect(ungroupBy(obj, ["a", "b", "c"])).toEqual([
        {
          a: "v1",
          b: "v2",
          c: "v3",
          id: 1,
          anotherObj: {
            prop: "yo"
          }
        },
        {
          a: "v1",
          b: "v2",
          c: "v3",
          id: 2
        }
      ]);
    });
  });

  describe("terminal step", () => {
    let exampleObject;

    beforeEach(() => {
      exampleObject = {
        justSomeProperty: "justSomeProperty"
      };
    });

    it("should push the passed object onto results array", () => {
      const result = ungroupBy(exampleObject, []);
      expect(result).toEqual([
        {
          justSomeProperty: "justSomeProperty"
        }
      ]);
    });
  });

  describe("single depth", () => {
    it("should collapse the first key and push the result on the array", () => {
      const exampleObject = {
        v1: {
          v2: "justSomeProperty"
        }
      };
      const results = ungroupBy(exampleObject, ["key1"]);
      console.log(results);
      expect(results).toEqual([
        {
          key1: "v1",
          v2: "justSomeProperty"
        }
      ]);
    });
  });

  describe("split in tree", () => {
    it("should collapse both branches", () => {
      const exampleObject = {
        v1: {
          v2: "justSomeProperty"
        },
        v3: {
          v4: "justAnotherProperty"
        }
      };
      const results = ungroupBy(exampleObject, ["key1"]);
      expect(results).toEqual([
        {
          key1: "v1",
          v2: "justSomeProperty"
        },
        {
          key1: "v3",
          v4: "justAnotherProperty"
        }
      ]);
    });
  });

  describe("arrays", () => {
    it("should collapse as if it were not there", () => {
      const exampleObject = {
        v1: [
          {
            v2: "justSomeProperty"
          },
          {
            v3: "justAnotherProperty"
          }
        ]
      };
      const results = ungroupBy(exampleObject, ["key1"]);
      expect(results).toEqual([
        {
          key1: "v1",
          v2: "justSomeProperty"
        },
        {
          key1: "v1",
          v3: "justAnotherProperty"
        }
      ]);
    });
  });
});
