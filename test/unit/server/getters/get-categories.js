const setupTestDb = require("../../test.database");
const { dispatchJsonRpcRequest } = require("src/server/dispatch-json-rpc-request");

describe("server/getters/get-categories", () => {
  let db;
  beforeEach(async () => {
    db = await setupTestDb();
  });

  afterEach(async () => {
    await db.destroy();
  });

  test("get categories in universe b sorted by popularity", async () => {
    const params = {
      universe: "0x000000000000000000000000000000000000000b",
    };
    await expect(dispatchJsonRpcRequest(db, {
      method: "getCategories",
      params,
    }, null)).resolves.toEqual([
      { "category": "FINANCE", "popularity": "12345", "tags": [] },
      { "category": "POLITICS", "popularity": "5000", "tags": [] },
      { "category": "ETHEREUM", "popularity": "1000", "tags": [] },
      { "category": "AUGUR", "popularity": "500", "tags": [] },
      {
        "category": "TEST CATEGORY",
        "popularity": "0",
        "tags": {
          "AUGUR": 2,
          "ETHEREUM": 1,
          "FINANCE": 2,
          "POLITICS": 1,
          "TAGGED IT": 5,
          "TAGGING IT": 5,
          "TEST TAG 1": 7,
          "TEST TAG 2": 7,
        },
      }],
    );
  });

  test("get categories in bad universe", async () => {
    const params = {
      universe: "0x0000000000000000000000000FFFFFFFFFFEAAAA",
    };
    await expect(dispatchJsonRpcRequest(db, { method: "getCategories", params }, null))
      .rejects.toEqual(new Error("Universe 0x0000000000000000000000000FFFFFFFFFFEAAAA does not exist"));
  });
});
