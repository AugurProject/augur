jest.mock("src/blockchain/process-block");
const Augur = require("augur.js");
const setupTestDb = require("../../test.database");
const { dispatchJsonRpcRequest } = require("src/server/dispatch-json-rpc-request");
const processBlock= require("src/blockchain/process-block");
const augur = new Augur();

describe("server/getters/get-user-trading-positions", () => {
  let db;
  beforeEach(async () => {
    db = await setupTestDb();
    processBlock.getCurrentTime.mockReturnValue(Date.now()/1000);
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
      endTime: 1534435013,
    });

    expect(userTradingPositions).toEqual([
      {
        averagePrice: "26.99662542182234436667",
        cost: "0.00809898762654670331",
        marketId: "0x0000000000000000000000000000000000000ff1",
        netPosition: "-0.0003",
        outcome: 1,
        position: "0",
        realized: "54999999999.56442531007152770894",
        timestamp: 1534435013,
        total: "54999999999.56442531007152770894",
        unrealized: "0",
      },
    ]);
  });

  it("get a user's position in one outcome of a market where the user has a synthetic short position", async () => {
    const userTradingPositions = await getUserTradingPositions({
      universe: "0x000000000000000000000000000000000000000b",
      account: "0xffff000000000000000000000000000000000000",
      marketId: "0x0000000000000000000000000000000000000ff1",
      outcome: 1,
      sortBy: null,
      isSortDescending: null,
      limit: null,
      offset: null,
      endTime: 1544804660,
    });

    expect(userTradingPositions).toEqual([{
      "averagePrice": "26.99662542182234436667",
      "cost": "0.00809898762654670331",
      "marketId": "0x0000000000000000000000000000000000000ff1",
      "netPosition": "-0.0003",
      "outcome": 1,
      "position": "0",
      "realized": "54999999999.56442531007152770894",
      "timestamp": 1534435013,
      "total": "54999999999.55662632244498100563",
      "unrealized": "-0.00779898762654670331",
    }]);
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
      endTime: 1544804660,
    });

    expect(userTradingPositions).toEqual([]);
  });

  it("gets a users position when there's only one entry in the p_l_timeseries table", async () => {
    const userTradingPositions = await getUserTradingPositions({
      account: "0x913da4198e6be1d5f5e4a40d0667f70c0b5430eb",
      marketId: "0xfd9d2cab985b4e1052502c197d989fdf9e7d4b1e",
      sortBy: null,
      isSortDescending: null,
      limit: null,
      offset: null,
      endTime: 1544804660,
    });

    expect(userTradingPositions).toEqual([
      {
        marketId: "0xfd9d2cab985b4e1052502c197d989fdf9e7d4b1e",
        netPosition: "30",
        outcome: 1,
        position: "30",
        averagePrice: "0.963",
        realized: "0",
        timestamp: 1544804660,
        total: "-25.89",
        unrealized: "-25.89",
        cost: "28.89",
      },
    ]);
  });
});
