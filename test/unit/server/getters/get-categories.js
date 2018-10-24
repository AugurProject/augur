const setupTestDb = require("../../test.database");
const { dispatchJsonRpcRequest } = require("src/server/dispatch-json-rpc-request");

describe("server/getters/get-categories", () => {
  const runTest = (t) => {
    test(t.description, async (done) => {
      const db = await setupTestDb();
      t.method = "getCategories";
      const categoriesInfo = await dispatchJsonRpcRequest(db, t, null);
      t.assertions(categoriesInfo);
      db.destroy();
      done();
    });
  };
  runTest({
    description: "get categories in universe b sorted by popularity",
    params: {
      universe: "0x000000000000000000000000000000000000000b",
      sortBy: "popularity",
      isSortDescending: true,
    },
    assertions: (categoriesInfo) => {
      expect(categoriesInfo).toEqual([
        { category: "FINANCE", popularity: "12345" },
        { category: "POLITICS", popularity: "5000" },
        { category: "ETHEREUM", popularity: "1000" },
        { category: "AUGUR", popularity: "500" },
        { category: "TEST CATEGORY", popularity: "0" },
      ]);
    },
  });
  runTest({
    description: "nonexistent universe",
    params: {
      universe: "0x1010101010101010101010101010101010101010",
    },
    assertions: (categoriesInfo) => {
      expect(categoriesInfo).toEqual([]);
    },
  });
});
