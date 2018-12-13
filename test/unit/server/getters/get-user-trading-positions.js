const Augur = require("augur.js");
const setupTestDb = require("../../test.database");
const { dispatchJsonRpcRequest } = require("src/server/dispatch-json-rpc-request");
const augur = new Augur();

describe("server/getters/get-user-trading-positions", () => {
  let db;
  beforeEach(async () => {
    db = await setupTestDb();
  });

  afterEach(async () => {
    await db.destroy();
  });

  const getUserTradingPositions = async (params) => {
    return JSON.parse(JSON.stringify(await dispatchJsonRpcRequest(db, { method: "getUserTradingPositions", params }, augur)));
  };
  it("get user's full position", async () => {
    const userTradingPositions = await getUserTradingPositions({
      universe: "0x000000000000000000000000000000000000000b",
      account: "0xffff000000000000000000000000000000000000",
      marketId: "0x0000000000000000000000000000000000000ff1",
      outcome: null,
      sortBy: null,
      isSortDescending: null,
      limit: null,
      offset: null,
    });

    expect(userTradingPositions).toEqual([
      {
        marketId: "0x0000000000000000000000000000000000000ff1",
        netPosition: "0",
        outcome: 0,
        position: "0.0004",
        realized: "54999999999.58212297261370994338",
        timestamp: 1534435013,
        total: "54999999999.68322533481843430233",
        unrealized: "0.10110236220472435895",
      },
    ]);
  });
  it("get a user's position in one outcome of a market where the user has no position", async () => {
    const userTradingPositions = await getUserTradingPositions({
      universe: "0x000000000000000000000000000000000000000b",
      account: "0xffff000000000000000000000000000000000000",
      marketId: "0x0000000000000000000000000000000000000ff1",
      outcome: 1,
      sortBy: null,
      isSortDescending: null,
      limit: null,
      offset: null,
    });

    expect(userTradingPositions).toEqual([]);
  });

  it("get the positions for an account which has no trades", async () => {
    const userTradingPositions = await getUserTradingPositions({
      account: "0x0000000000000000000000000000000000nobody",
      marketId: "0x0000000000000000000000000000000000000002",
      outcome: 1,
      sortBy: null,
      isSortDescending: null,
      limit: null,
      offset: null,
    });

    expect(userTradingPositions).toEqual([]);
  });
});
