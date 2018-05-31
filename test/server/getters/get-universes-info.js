"use strict";

const assert = require("chai").assert;
const setupTestDb = require("../../test.database");
const { getUniversesInfo } = require("../../../build/server/getters/get-universes-info");

describe("server/getters/get-universes-info", () => {
  const test = (t) => {
    it(t.description, (done) => {
      setupTestDb((err, db) => {
        assert.ifError(err);
        getUniversesInfo(db, t.params.augur, t.params.universe, t.params.account, (err, universes) => {
          t.assertions(err, universes);
          db.destroy();
          done();
        });
      });
    });
  };
  test({
    description: "get universes for the user provided genesis universe",
    params: {
      universe: "0x000000000000000000000000000000000000000b",
      account: "0x0000000000000000000000000000000000000021",
    },
    assertions: (err, universes) => {
      assert.ifError(err);
      assert.deepEqual(universes, [
        {
          universe: "0x000000000000000000000000000000000000000b",
          parentUniverse: null,
          balance: "20",
          supply: "10000",
          numMarkets: 15,
          payout: [],
          isInvalid: null,
        },
        {
          universe: "CHILD_UNIVERSE",
          parentUniverse: "0x000000000000000000000000000000000000000b",
          balance: "10",
          supply: "2000",
          numMarkets: 1,
          isInvalid: 0,
          payout: [
            "0",
            "10000",
          ],
        },
      ]);
    },
  });
  test({
    description: "get universes for the user provided child universe",
    params: {
      universe: "CHILD_UNIVERSE",
      account: "0x0000000000000000000000000000000000000021",
    },
    assertions: (err, universes) => {
      assert.ifError(err);
      assert.deepEqual(universes, [
        {
          universe: "0x000000000000000000000000000000000000000b",
          parentUniverse: null,
          balance: "20",
          supply: "10000",
          numMarkets: 15,
          payout: [],
          isInvalid: null,
        },
        {
          universe: "CHILD_UNIVERSE",
          parentUniverse: "0x000000000000000000000000000000000000000b",
          balance: "10",
          supply: "2000",
          numMarkets: 1,
          isInvalid: 0,
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
          isInvalid: null,
        },
        {
          universe: "SECOND_GRAND_CHILD_UNIVERSE",
          parentUniverse: "CHILD_UNIVERSE",
          balance: "0",
          supply: "0",
          numMarkets: 0,
          payout: [],
          isInvalid: null,
        },
      ]);
    },
  });
  test({
    description: "get universes for the user provided grandchild universe",
    params: {
      universe: "FIRST_GRAND_CHILD_UNIVERSE",
      account: "0x0000000000000000000000000000000000000021",
    },
    assertions: (err, universes) => {
      assert.ifError(err);
      assert.deepEqual(universes, [
        {
          universe: "CHILD_UNIVERSE",
          parentUniverse: "0x000000000000000000000000000000000000000b",
          balance: "10",
          supply: "2000",
          numMarkets: 1,
          isInvalid: 0,
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
          isInvalid: null,
        },
        {
          universe: "SECOND_GRAND_CHILD_UNIVERSE",
          parentUniverse: "CHILD_UNIVERSE",
          balance: "0",
          supply: "0",
          numMarkets: 0,
          payout: [],
          isInvalid: null,
        },
      ]);
    },
  });
  test({
    description: "get universes for the user with no REP provided grandchild universe",
    params: {
      universe: "FIRST_GRAND_CHILD_UNIVERSE",
      account: "0x0000000000000000000000000000000000000abe",
    },
    assertions: (err, universes) => {
      assert.ifError(err);
      assert.deepEqual(universes, [
        {
          universe: "CHILD_UNIVERSE",
          parentUniverse: "0x000000000000000000000000000000000000000b",
          balance: "0",
          supply: "2000",
          numMarkets: 1,
          isInvalid: 0,
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
          isInvalid: null,
        },
        {
          universe: "SECOND_GRAND_CHILD_UNIVERSE",
          parentUniverse: "CHILD_UNIVERSE",
          balance: "0",
          supply: "0",
          numMarkets: 0,
          payout: [],
          isInvalid: null,
        },
      ]);
    },
  });
  test({
    description: "get universes will handle the case where the universe does not exist",
    params: {
      universe: "BAD_INPUT",
      account: "0x0000000000000000000000000000000000000abe",
    },
    assertions: (err, universes) => {
      assert.ifError(err);
      assert.deepEqual(universes, []);
    },
  });
});
