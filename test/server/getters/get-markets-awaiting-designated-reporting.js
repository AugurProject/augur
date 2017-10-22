"use strict";

const unlink = require("fs").unlink;
const join = require("path").join;
const assert = require("chai").assert;
const setupTestDb = require("../../test.database");
const { getMarketsAwaitingDesignatedReporting } = require("../../../build/server/getters/get-markets-awaiting-designated-reporting");

describe("server/getters/get-markets-awaiting-designated-reporting", () => {
  const test = (t) => {
    it(t.description, (done) => {
      setupTestDb((err, db) => {
        if (err) assert.fail(err);
        getMarketsAwaitingDesignatedReporting(db, t.params.designatedReporter, t.params.sortBy, t.params.isSortDescending, t.params.limit, t.params.offset, (err, marketsAwaitingDesignatedReporting) => {
          t.assertions(err, marketsAwaitingDesignatedReporting);
          done();
        });
      });
    });
  };
  test({
    description: "get markets awaiting unknown designated reporter",
    params: {
      designatedReporter: "0xf0f0f0f0f0f0f0f0b0b0b0b0b0b0b0f0f0f0f0b0",
    },
    assertions: (err, marketsAwaitingDesignatedReporting) => {
      assert.isNull(err);
      assert.isUndefined(marketsAwaitingDesignatedReporting);
    }
  });
  test({
    description: "get all markets awaiting designated reporting, sorted ascending by volume",
    params: {
      sortBy: "volume",
      isSortDescending: false,
    },
    assertions: (err, marketsInfo) => {
      assert.isNull(err);
      assert.deepEqual(marketsInfo, [
        {
          "author": "0x0000000000000000000000000000000000000b0b",
          "universe": "0x000000000000000000000000000000000000000b",
          "category": "test category",
          "consensus": null,
          "creationBlock": 1400000,
          "creationFee": 10,
          "creationTime": 1506473474,
          "cumulativeScale": "1",
          "description": "This is a categorical test market created by b0b.",
          "designatedReportStake": 10,
          "designatedReporter": "0x0000000000000000000000000000000000000b0b",
          "endDate": 1506573470,
          "extraInfo": null,
          "finalizationTime": null,
          "id": "0x0000000000000000000000000000000000000001",
          reportingFeeRate: 0.02,
          "marketCreatorFeeRate": 0.01,
          "marketCreatorFeesCollected": 0,
          "maxPrice": 1,
          "minPrice": 0,
          "numOutcomes": 8,
          "numTicks": 24,
          "outcomes": [],
          "outstandingShares": 0,
          "reportingWindow": "0x1000000000000000000000000000000000000000",
          "resolutionSource": "http://www.trusted-third-party.com",
          "tags": [
            "test tag 1",
            "test tag 2",
          ],
          "type": "categorical",
          "volume": 0,
        },
        {
          "author": "0x0000000000000000000000000000000000000b0b",
          "universe": "0x000000000000000000000000000000000000000b",
          "category": "test category",
          "consensus": null,
          "creationBlock": 1400100,
          "creationFee": 10,
          "creationTime": 1506480000,
          "cumulativeScale": "1",
          "description": "This is a binary test market created by b0b.",
          "designatedReportStake": 10,
          "designatedReporter": "0x0000000000000000000000000000000000000b0b",
          "endDate": 1506573480,
          "extraInfo": null,
          "finalizationTime": null,
          "id": "0x0000000000000000000000000000000000000002",
          reportingFeeRate: 0.02,
          "marketCreatorFeeRate": 0.01,
          "marketCreatorFeesCollected": 0,
          "maxPrice": 1,
          "minPrice": 0,
          "numOutcomes": 2,
          "numTicks": 2,
          "outcomes": [],
          "outstandingShares": 0,
          "reportingWindow": "0x1000000000000000000000000000000000000000",
          "resolutionSource": "http://www.trusted-third-party.com",
          "tags": [
            "test tag 1",
            "test tag 2",
          ],
          "type": "binary",
          "volume": 0,
        },
        {
          "author": "0x000000000000000000000000000000000000d00d",
          "universe": "0x000000000000000000000000000000000000000b",
          "category": "test category",
          "consensus": null,
          "creationBlock": 1400101,
          "creationFee": 10,
          "creationTime": 1506480015,
          "cumulativeScale": "1",
          "description": "This is another binary test market created by d00d.",
          "designatedReportStake": 10,
          "designatedReporter": "0x000000000000000000000000000000000000d00d",
          "endDate": 1506573500,
          "extraInfo": null,
          "finalizationTime": null,
          "id": "0x0000000000000000000000000000000000000003",
          reportingFeeRate: 0.02,
          "marketCreatorFeeRate": 0.01,
          "marketCreatorFeesCollected": 0,
          "maxPrice": 1,
          "minPrice": 0,
          "numOutcomes": 2,
          "numTicks": 16,
          "outcomes": [],
          "outstandingShares": 0,
          "reportingWindow": "0x1000000000000000000000000000000000000000",
          "resolutionSource": "http://www.ttp-inc.com/0000000000000000000000000000000000000003",
          "tags": [
            "test tag 1",
            "test tag 2",
          ],
          "type": "binary",
          "volume": 0,
        }      
      ]);
    }
  });
  test({
    description: "get all markets awaiting designated reporting by d00d",
    params: {
      designatedReporter: "0x000000000000000000000000000000000000d00d"      
    },
    assertions: (err, marketsInfo) => {
      assert.isNull(err);
      assert.deepEqual(marketsInfo, [
        {
          "author": "0x000000000000000000000000000000000000d00d",
          "universe": "0x000000000000000000000000000000000000000b",
          "category": "test category",
          "consensus": null,
          "creationBlock": 1400101,
          "creationFee": 10,
          "creationTime": 1506480015,
          "cumulativeScale": "1",
          "description": "This is another binary test market created by d00d.",
          "designatedReportStake": 10,
          "designatedReporter": "0x000000000000000000000000000000000000d00d",
          "endDate": 1506573500,
          "extraInfo": null,
          "finalizationTime": null,
          "id": "0x0000000000000000000000000000000000000003",
          reportingFeeRate: 0.02,
          "marketCreatorFeeRate": 0.01,
          "marketCreatorFeesCollected": 0,
          "maxPrice": 1,
          "minPrice": 0,
          "numOutcomes": 2,
          "numTicks": 16,
          "outcomes": [],
          "outstandingShares": 0,
          "reportingWindow": "0x1000000000000000000000000000000000000000",
          "resolutionSource": "http://www.ttp-inc.com/0000000000000000000000000000000000000003",
          "tags": [
            "test tag 1",
            "test tag 2",
          ],
          "type": "binary",
          "volume": 0,
        }      
      ]);
    }
  });
});
