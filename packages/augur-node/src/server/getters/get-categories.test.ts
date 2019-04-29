import { setupTestDb } from 'test/unit/test.database';
import { dispatchJsonRpcRequest } from '../dispatch-json-rpc-request';

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
      {"categoryName": "AUGUR", "nonFinalizedOpenInterest": "0", "openInterest": "3", "tags": []},
      {"categoryName": "ETHEREUM", "nonFinalizedOpenInterest": "4.5", "openInterest": "4.5", "tags": []},
      {"categoryName": "FINANCE", "nonFinalizedOpenInterest": "2.5", "openInterest": "2.6", "tags": []},
      {"categoryName": "POLITICS", "nonFinalizedOpenInterest": "3", "openInterest": "12", "tags": []},
      {"categoryName": "TEST CATEGORY", "nonFinalizedOpenInterest": "0", "openInterest": "0", "tags": [
        {"nonFinalizedOpenInterest": "0", "numberOfMarketsWithThisTag": 6, "openInterest": "0", "tagName": "test tag 1"},
        {"nonFinalizedOpenInterest": "0", "numberOfMarketsWithThisTag": 6, "openInterest": "0", "tagName": "test tag 2"},
        {"nonFinalizedOpenInterest": "0", "numberOfMarketsWithThisTag": 2, "openInterest": "0", "tagName": "Finance"},
        {"nonFinalizedOpenInterest": "0", "numberOfMarketsWithThisTag": 2, "openInterest": "0", "tagName": "Augur"},
        {"nonFinalizedOpenInterest": "0", "numberOfMarketsWithThisTag": 1, "openInterest": "0", "tagName": "politics"},
        {"nonFinalizedOpenInterest": "0", "numberOfMarketsWithThisTag": 1, "openInterest": "0", "tagName": "ethereum"},
        {"nonFinalizedOpenInterest": "0", "numberOfMarketsWithThisTag": 5, "openInterest": "0", "tagName": "tagging it"},
        {"nonFinalizedOpenInterest": "0", "numberOfMarketsWithThisTag": 5, "openInterest": "0", "tagName": "tagged it"},
      ]},
      {"categoryName": "ethereum", "nonFinalizedOpenInterest": "0", "openInterest": "0", "tags": []},
    ]);
  });

  test("get categories in bad universe", async () => {
    const params = {
      universe: "0x0000000000000000000000000FFFFFFFFFFEAAAA",
    };
    await expect(dispatchJsonRpcRequest(db, { method: "getCategories", params }, null))
      .rejects.toEqual(new Error("Universe 0x0000000000000000000000000FFFFFFFFFFEAAAA does not exist"));
  });
});
