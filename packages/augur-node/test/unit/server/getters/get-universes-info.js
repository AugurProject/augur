const setupTestDb = require("../../test.database");
const { dispatchJsonRpcRequest } = require("src/server/dispatch-json-rpc-request");

describe("server/getters/get-universes-info", () => {
  let db;
  beforeEach(async () => {
    db = await setupTestDb();
  });

  afterEach(async () => {
    await db.destroy();
  });

  const runTest = (t) => {
    test(t.description, async () => {
      t.method = "getUniversesInfo";
      const universes = await dispatchJsonRpcRequest(db, t, {});
      t.assertions(universes);
    });
  };
  runTest({
    description: "get universes for the user provided genesis universe",
    params: {
      universe: "0x000000000000000000000000000000000000000b",
      account: "0x0000000000000000000000000000000000000021",
    },
    assertions: (universes) => {
      expect(universes).toEqual([
        {
          universe: "0x000000000000000000000000000000000000000b",
          parentUniverse: null,
          balance: "20",
          supply: "10000",
          numMarkets: 15,
          payout: [],
          isInvalid: false,
        },
        {
          universe: "CHILD_UNIVERSE",
          parentUniverse: "0x000000000000000000000000000000000000000b",
          balance: "10",
          supply: "2000",
          numMarkets: 1,
          isInvalid: false,
          payout: [
            "0",
            "10000",
          ],
        },
      ]);
    },
  });
  runTest({
    description: "get universes for the user provided child universe",
    params: {
      universe: "CHILD_UNIVERSE",
      account: "0x0000000000000000000000000000000000000021",
    },
    assertions: (universes) => {
      expect(universes).toEqual([
        {
          universe: "0x000000000000000000000000000000000000000b",
          parentUniverse: null,
          balance: "20",
          supply: "10000",
          numMarkets: 15,
          payout: [],
          isInvalid: false,
        },
        {
          universe: "CHILD_UNIVERSE",
          parentUniverse: "0x000000000000000000000000000000000000000b",
          balance: "10",
          supply: "2000",
          numMarkets: 1,
          isInvalid: false,
          payout: [
            "0",
            "10000",
          ],
        },
        {
          universe: "FIRST_GRAND_CHILD_UNIVERSE",
          parentUniverse: "CHILD_UNIVERSE",
          balance: "8",
          supply: "200",
          numMarkets: 0,
          payout: [],
          isInvalid: false,
        },
        {
          universe: "SECOND_GRAND_CHILD_UNIVERSE",
          parentUniverse: "CHILD_UNIVERSE",
          balance: "0",
          supply: "0",
          numMarkets: 0,
          payout: [],
          isInvalid: false,
        },
      ]);
    },
  });
  runTest({
    description: "get universes for the user provided grandchild universe",
    params: {
      universe: "FIRST_GRAND_CHILD_UNIVERSE",
      account: "0x0000000000000000000000000000000000000021",
    },
    assertions: (universes) => {
      expect(universes).toEqual([
        {
          universe: "CHILD_UNIVERSE",
          parentUniverse: "0x000000000000000000000000000000000000000b",
          balance: "10",
          supply: "2000",
          numMarkets: 1,
          isInvalid: false,
          payout: [
            "0",
            "10000",
          ],
        },
        {
          universe: "FIRST_GRAND_CHILD_UNIVERSE",
          parentUniverse: "CHILD_UNIVERSE",
          balance: "8",
          supply: "200",
          numMarkets: 0,
          payout: [],
          isInvalid: false,
        },
        {
          universe: "SECOND_GRAND_CHILD_UNIVERSE",
          parentUniverse: "CHILD_UNIVERSE",
          balance: "0",
          supply: "0",
          numMarkets: 0,
          payout: [],
          isInvalid: false,
        },
      ]);
    },
  });
  runTest({
    description: "get universes for the user with no REP provided grandchild universe",
    params: {
      universe: "FIRST_GRAND_CHILD_UNIVERSE",
      account: "0x0000000000000000000000000000000000000abe",
    },
    assertions: (universes) => {
      expect(universes).toEqual([
        {
          universe: "CHILD_UNIVERSE",
          parentUniverse: "0x000000000000000000000000000000000000000b",
          balance: "0",
          supply: "2000",
          numMarkets: 1,
          isInvalid: false,
          payout: [
            "0",
            "10000",
          ],
        },
        {
          universe: "FIRST_GRAND_CHILD_UNIVERSE",
          parentUniverse: "CHILD_UNIVERSE",
          balance: "0",
          supply: "200",
          numMarkets: 0,
          payout: [],
          isInvalid: false,
        },
        {
          universe: "SECOND_GRAND_CHILD_UNIVERSE",
          parentUniverse: "CHILD_UNIVERSE",
          balance: "0",
          supply: "0",
          numMarkets: 0,
          payout: [],
          isInvalid: false,
        },
      ]);
    },
  });
  runTest({
    description: "get universes will handle the case where the universe does not exist",
    params: {
      universe: "BAD_INPUT",
      account: "0x0000000000000000000000000000000000000abe",
    },
    assertions: (universes) => {
      expect(universes).toEqual([]);
    },
  });
});
