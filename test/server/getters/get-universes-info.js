"use strict";

const { BigNumber } = require("bignumber.js");
const assert = require("chai").assert;
const setupTestDb = require("../../test.database");
const { getUniversesInfo } = require("../../../build/server/getters/get-universes-info");

describe("server/getters/get-universes-info", () => {
  const test = (t) => {
    it(t.description, (done) => {
      setupTestDb((err, db) => {
        assert.isNull(err);
        getUniversesInfo(db, t.params.augur, t.params.universe, t.params.account, (err, universes) => {
          t.assertions(err, universes);
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
      assert.isNull(err);
      assert.deepEqual(universes, [
        {
          universe: "0x000000000000000000000000000000000000000b",
          parentUniverse: null,
          balance: "20",
          supply: "10000",
          numMarkets: 14,
        },
        {
          universe: "CHILD_UNIVERSE",
          parentUniverse: "0x000000000000000000000000000000000000000b",
          balance: "10",
          supply: "2000",
          numMarkets: 1,
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
      assert.isNull(err);
      assert.deepEqual(universes, [
        {
          universe: "0x000000000000000000000000000000000000000b",
          parentUniverse: null,
          balance: "20",
          supply: "10000",
          numMarkets: 14,
        },
        {
          universe: "CHILD_UNIVERSE",
          parentUniverse: "0x000000000000000000000000000000000000000b",
          balance: "10",
          supply: "2000",
          numMarkets: 1,
        },
        {
          universe: "FIRST_GRAND_CHILD_UNIVERSE",
          parentUniverse: "CHILD_UNIVERSE",
          balance: "8",
          supply: "200",
          numMarkets: 0,
        },
        {
          universe: "SECOND_GRAND_CHILD_UNIVERSE",
          parentUniverse: "CHILD_UNIVERSE",
          balance: "4",
          supply: "300",
          numMarkets: 0,
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
      assert.isNull(err);
      assert.deepEqual(universes, [
        {
          universe: "CHILD_UNIVERSE",
          parentUniverse: "0x000000000000000000000000000000000000000b",
          balance: "10",
          supply: "2000",
          numMarkets: 1,
        },
        {
          universe: "FIRST_GRAND_CHILD_UNIVERSE",
          parentUniverse: "CHILD_UNIVERSE",
          balance: "8",
          supply: "200",
          numMarkets: 0,
        },
        {
          universe: "SECOND_GRAND_CHILD_UNIVERSE",
          parentUniverse: "CHILD_UNIVERSE",
          balance: "4",
          supply: "300",
          numMarkets: 0,
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
      assert.isNull(err);
      assert.deepEqual(universes, [
        {
          universe: "CHILD_UNIVERSE",
          parentUniverse: "0x000000000000000000000000000000000000000b",
          balance: null,
          supply: "2000",
          numMarkets: 1,
        },
        {
          universe: "FIRST_GRAND_CHILD_UNIVERSE",
          parentUniverse: "CHILD_UNIVERSE",
          balance: null,
          supply: "200",
          numMarkets: 0,
        },
        {
          universe: "SECOND_GRAND_CHILD_UNIVERSE",
          parentUniverse: "CHILD_UNIVERSE",
          balance: null,
          supply: "300",
          numMarkets: 0,
        },
      ]);
    },
  });
});
