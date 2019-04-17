import { ethers } from "ethers";
import { API } from "@augurproject/state/src/api/API";
import { MarketInfo } from "@augurproject/state/src/api/Markets";
import { DB } from "@augurproject/state/src/db/DB";
import {
  ACCOUNTS,
  makeDbMock,
  compileAndDeployToGanache,
  ContractAPI,
} from "../../../libs";
import { stringTo32ByteHex } from "../../../libs/Utils";

const mock = makeDbMock();

beforeEach(async () => {
  mock.cancelFail();
});

let db: DB<any>;
let api: API<any>;
let john: ContractAPI;
let mary: ContractAPI;

beforeAll(async () => {
  const { provider, addresses } = await compileAndDeployToGanache(ACCOUNTS);

  john = await ContractAPI.userWrapper(ACCOUNTS, 0, provider, addresses);
  mary = await ContractAPI.userWrapper(ACCOUNTS, 1, provider, addresses);
  db = await mock.makeDB(john.augur, ACCOUNTS);
  api = new API<any>(john.augur, db);
}, 60000);

test("State API :: Markets :: getMarketsInfo", async () => {
  await john.approveCentralAuthority();
  await mary.approveCentralAuthority();

  const yesNoMarket = await john.createReasonableYesNoMarket(john.augur.contracts.universe);
  const categoricalMarket = await john.createReasonableMarket(john.augur.contracts.universe, [stringTo32ByteHex("A"), stringTo32ByteHex("B"), stringTo32ByteHex("C")]);
  const scalarMarket = await john.createReasonableScalarMarket(john.augur.contracts.universe, [stringTo32ByteHex(""), stringTo32ByteHex("")]);

  // Place orders
  const bid = new ethers.utils.BigNumber(0);
  const outcome0 = new ethers.utils.BigNumber(0);
  const outcome1 = new ethers.utils.BigNumber(1);
  const numShares = new ethers.utils.BigNumber(10000000000000);
  const price = new ethers.utils.BigNumber(2150);
  await john.placeOrder(yesNoMarket.address, bid, numShares, price, outcome0, stringTo32ByteHex(""), stringTo32ByteHex(""), stringTo32ByteHex("42"));
  await john.placeOrder(yesNoMarket.address, bid, numShares, price, outcome1, stringTo32ByteHex(""), stringTo32ByteHex(""), stringTo32ByteHex("42"));
  await john.placeOrder(categoricalMarket.address, bid, numShares, price, outcome0, stringTo32ByteHex(""), stringTo32ByteHex(""), stringTo32ByteHex("42"));
  await john.placeOrder(categoricalMarket.address, bid, numShares, price, outcome1, stringTo32ByteHex(""), stringTo32ByteHex(""), stringTo32ByteHex("42"));
  await john.placeOrder(scalarMarket.address, bid, numShares, price, outcome0, stringTo32ByteHex(""), stringTo32ByteHex(""), stringTo32ByteHex("42"));
  await john.placeOrder(scalarMarket.address, bid, numShares, price, outcome1, stringTo32ByteHex(""), stringTo32ByteHex(""), stringTo32ByteHex("42"));

  // Partially fill orders
  const cost = numShares.mul(7850).div(2);
  const yesNoOrderId0 = await john.getBestOrderId(bid, yesNoMarket.address, outcome0);
  const yesNoOrderId1 = await john.getBestOrderId(bid, yesNoMarket.address, outcome1);
  const categoricalOrderId0 = await john.getBestOrderId(bid, categoricalMarket.address, outcome0);
  const categoricalOrderId1 = await john.getBestOrderId(bid, categoricalMarket.address, outcome1);
  const scalarOrderId0 = await john.getBestOrderId(bid, scalarMarket.address, outcome0);
  const scalarOrderId1 = await john.getBestOrderId(bid, scalarMarket.address, outcome1);
  await john.fillOrder(yesNoOrderId0, cost, numShares.div(2), "42");
  await mary.fillOrder(yesNoOrderId1, cost, numShares.div(2), "43");
  await mary.fillOrder(categoricalOrderId0, cost, numShares.div(2), "43");
  await mary.fillOrder(categoricalOrderId1, cost, numShares.div(2), "43");
  await mary.fillOrder(scalarOrderId0, cost, numShares.div(2), "43");
  await mary.fillOrder(scalarOrderId1, cost, numShares.div(2), "43");

  // Purchase complete sets
  await mary.buyCompleteSets(yesNoMarket, numShares);
  await mary.buyCompleteSets(categoricalMarket, numShares);
  await mary.buyCompleteSets(scalarMarket, numShares);

  await db.sync(john.augur, 100000, 0);

  let markets: Array<MarketInfo> = await api.route("getMarketsInfo", {
    marketIds: [
      yesNoMarket.address,
      categoricalMarket.address,
      scalarMarket.address
    ]
  });

  expect(markets[0].reportingState).toBe("PRE_REPORTING");
  expect(markets[1].reportingState).toBe("PRE_REPORTING");
  expect(markets[2].reportingState).toBe("PRE_REPORTING");

  // Skip to yes/no market end time
  let newTime = (await yesNoMarket.getEndTime_()).add(1);
  await john.setTimestamp(newTime);

  await db.sync(john.augur, 100000, 0);

  markets = await api.route("getMarketsInfo", {
    marketIds: [
      yesNoMarket.address,
      categoricalMarket.address,
      scalarMarket.address
    ]
  });

  expect(markets[0].reportingState).toBe("DESIGNATED_REPORTING");
  expect(markets[1].reportingState).toBe("DESIGNATED_REPORTING");
  expect(markets[2].reportingState).toBe("DESIGNATED_REPORTING");

  // Submit intial reports
  const categoricalMarketPayoutSet = [
    new ethers.utils.BigNumber(10000),
    new ethers.utils.BigNumber(0),
    new ethers.utils.BigNumber(0),
    new ethers.utils.BigNumber(0)
  ];
  await john.doInitialReport(categoricalMarket, categoricalMarketPayoutSet);

  const noPayoutSet = [new ethers.utils.BigNumber(10000), new ethers.utils.BigNumber(0), new ethers.utils.BigNumber(0)];
  const yesPayoutSet = [new ethers.utils.BigNumber(0), new ethers.utils.BigNumber(10000), new ethers.utils.BigNumber(0)];
  await john.doInitialReport(yesNoMarket, noPayoutSet);

  await db.sync(john.augur, 100000, 0);

  markets = await api.route("getMarketsInfo", {
    marketIds: [
      yesNoMarket.address,
      categoricalMarket.address,
      scalarMarket.address
    ]
  });

  expect(markets[0].reportingState).toBe("CROWDSOURCING_DISPUTE");
  expect(markets[1].reportingState).toBe("CROWDSOURCING_DISPUTE");
  expect(markets[2].reportingState).toBe("DESIGNATED_REPORTING");

  expect(markets).toMatchObject(
    [
      {
        "author": "0x8fFf40Efec989Fc938bBA8b19584dA08ead986eE",
        "category": " \u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000",
        "consensus": null,
        "creationBlock": 89,
        "cumulativeScale": "1000000000000000000",
        "description": "description",
        "details": null,
        "finalizationBlockNumber": null,
        "finalizationTime": null,
        "id": "0xa223fFddee6e9eB50513Be1B3C5aE9159c7B3407",
        "marketType": "yesNo",
        "maxPrice": "1000000000000000000",
        "minPrice": "0",
        "needsMigration": false,
        "numOutcomes": 3,
        "numTicks": "10000",
        "openInterest": "150000000000000000",
        "outcomes": [
          {
            "description": "Invalid",
            "id": 0,
            "price": "2150",
          },
          {
            "description": "No",
            "id": 1,
            "price": "2150",
          },
          {
            "description": "Yes",
            "id": 2,
            "price": "0",
          },
        ],
        "reportingState": "CROWDSOURCING_DISPUTE",
        "resolutionSource": null,
        "scalarDenomination": null,
        "tickSize": "0.0001",
        "universe": "0x4112a78f07D155884b239A29e378D1f853Edd128",
        "volume": "100000000000000000",
      },
      {
        "author": "0x8fFf40Efec989Fc938bBA8b19584dA08ead986eE",
        "category": " \u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000",
        "consensus": null,
        "creationBlock": 91,
        "cumulativeScale": "1000000000000000000",
        "description": "description",
        "details": null,
        "finalizationBlockNumber": null,
        "finalizationTime": null,
        "id": "0x253CDD7C827E9167797aEcBe2Bc055d879F2B164",
        "marketType": "categorical",
        "maxPrice": "1000000000000000000",
        "minPrice": "0",
        "needsMigration": false,
        "numOutcomes": 4,
        "numTicks": "10000",
        "openInterest": "150000000000000000",
        "outcomes": [
          {
            "description": "Invalid",
            "id": 0,
            "price": "0",
          },
          {
            "description": "A\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000",
            "id": 1,
            "price": "0",
          },
          {
            "description": "B\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000",
            "id": 2,
            "price": "0",
          },
          {
            "description": "C\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000",
            "id": 3,
            "price": "0",
          },
        ],
        "reportingState": "CROWDSOURCING_DISPUTE",
        "resolutionSource": null,
        "scalarDenomination": null,
        "tickSize": "0.0001",
        "universe": "0x4112a78f07D155884b239A29e378D1f853Edd128",
        "volume": "60750000000000000",
      },
      {
        "author": "0x8fFf40Efec989Fc938bBA8b19584dA08ead986eE",
        "category": " \u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000",
        "consensus": null,
        "creationBlock": 93,
        "cumulativeScale": "40",
        "description": "description",
        "details": null,
        "finalizationBlockNumber": null,
        "finalizationTime": null,
        "id": "0x4976474ff73f3CA6a5fc17e8175ce41eAb31C77d",
        "marketType": "scalar",
        "maxPrice": "40",
        "minPrice": "0",
        "needsMigration": false,
        "numOutcomes": 3,
        "numTicks": "4000",
        "openInterest": "60000000000000000",
        "outcomes": [
          {
            "description": "Invalid",
            "id": 0,
            "price": "2150",
          },
          {
            "description": "0",
            "id": 1,
            "price": "2150",
          },
          {
            "description": "40",
            "id": 2,
            "price": "0",
          },
        ],
        "reportingState": "DESIGNATED_REPORTING",
        "resolutionSource": null,
        "scalarDenomination": null,
        "tickSize": "0.00000000000000000001",
        "universe": "0x4112a78f07D155884b239A29e378D1f853Edd128",
        "volume": "30750000000000000",
      },
    ]
  );
/*
  newTime = newTime.add(60 * 60 * 24 * 7);
  await john.setTimestamp(newTime);
  console.log("NEW TIME: ", newTime);
  const disputeWindowEndTime = await john.getDisputeWindowEndTime(yesNoMarket);
  console.log("Dispute window end time: ", disputeWindowEndTime);
  console.log("BEFORE FINALIZE");
  await john.finalizeMarket(yesNoMarket);
  console.log("AFTER FINALIZE");

  // Dispute 10 times
  for (let disputeRound = 1; disputeRound <= 11; disputeRound++) {
    if (disputeRound % 2 !== 0) {
      await mary.contribute(yesNoMarket, yesPayoutSet, new ethers.utils.BigNumber(25000));
      let remainingToFill = await john.getRemainingToFill(yesNoMarket, yesPayoutSet);
      await mary.contribute(yesNoMarket, yesPayoutSet, remainingToFill);
    } else {
      await john.contribute(yesNoMarket, noPayoutSet, new ethers.utils.BigNumber(25000));
      let remainingToFill = await john.getRemainingToFill(yesNoMarket, noPayoutSet);
      await john.contribute(yesNoMarket, noPayoutSet, remainingToFill);
    }
  }

  await db.sync(john.augur, 100000, 0);

  markets = await api.route("getMarketsInfo", {
    marketIds: [
      yesNoMarket.address,
      categoricalMarket.address,
      scalarMarket.address
    ]
  });

  expect(markets[0].reportingState).toBe("AWAITING_NEXT_WINDOW");
  expect(markets[1].reportingState).toBe("CROWDSOURCING_DISPUTE");
  expect(markets[2].reportingState).toBe("DESIGNATED_REPORTING");

  // Continue disputing
  for (let disputeRound = 12; disputeRound <= 19; disputeRound++) {
    newTime = newTime.add(60 * 60 * 24 * 7);
    await john.setTimestamp(newTime);

    if (disputeRound % 2 !== 0) {
      await mary.contribute(yesNoMarket, yesPayoutSet, new ethers.utils.BigNumber(25000));
      let remainingToFill = await john.getRemainingToFill(yesNoMarket, yesPayoutSet);
      await mary.contribute(yesNoMarket, yesPayoutSet, remainingToFill);
    } else {
      await john.contribute(yesNoMarket, noPayoutSet, new ethers.utils.BigNumber(25000));
      let remainingToFill = await john.getRemainingToFill(yesNoMarket, noPayoutSet);
      await john.contribute(yesNoMarket, noPayoutSet, remainingToFill);
    }
  }

  console.log("BEFORE FINALIZE")
  await john.finalizeMarket(categoricalMarket);
  console.log("AFTER FINALIZE")

  await db.sync(john.augur, 100000, 0);

  markets = await api.route("getMarketsInfo", {
    marketIds: [
      yesNoMarket.address,
      categoricalMarket.address,
      scalarMarket.address
    ]
  });

  expect(markets[0].reportingState).toBe("AWAITING_NEXT_WINDOW");
  expect(markets[1].reportingState).toBe("FINALIZED");
  expect(markets[2].reportingState).toBe("DESIGNATED_REPORTING");

  // Fork market
  await john.contribute(yesNoMarket, noPayoutSet, new ethers.utils.BigNumber(25000));
  let remainingToFill = await john.getRemainingToFill(yesNoMarket, noPayoutSet);
  await john.contribute(yesNoMarket, noPayoutSet, remainingToFill);

  newTime = newTime.add(60 * 60 * 24 * 7);
  await john.setTimestamp(newTime);

  await db.sync(john.augur, 100000, 0);

  markets = await api.route("getMarketsInfo", {
    marketIds: [
      yesNoMarket.address,
      categoricalMarket.address,
      scalarMarket.address
    ]
  });

  expect(markets[0].reportingState).toBe("AWAITING_FORK_MIGRATION");
  expect(markets[1].reportingState).toBe("AWAITING_FORK_MIGRATION");
  expect(markets[2].reportingState).toBe("DESIGNATED_REPORTING");

  // newTime = newTime.add(60 * 60 * 24 * 60);
  // await john.setTimestamp(newTime);


  // TODO Add checks for reportingState, needsMigration, consensus,
  // finalizationBlockNumber, & finalizationTime by reporting, disputing, & finalizing a market

  // TODO Fix this workaround once bug in Jest is fixed: https://github.com/facebook/jest/issues/6184
  expect(markets[0].endTime).not.toBeNaN();
  expect(markets[1].endTime).not.toBeNaN();
  expect(markets[2].endTime).not.toBeNaN();
  delete markets[0].endTime;
  delete markets[1].endTime;
  delete markets[2].endTime;

  // TODO Add checks for outcome prices

  expect(markets).toMatchObject(
    [
      {
        "author": "0x8fFf40Efec989Fc938bBA8b19584dA08ead986eE",
        "category": " \u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000",
        "consensus": null,
        "creationBlock": 89,
        "cumulativeScale": "1000000000000000000",
        "description": "description",
        "details": null,
        "finalizationBlockNumber": null,
        "finalizationTime": null,
        "id": "0xa223fFddee6e9eB50513Be1B3C5aE9159c7B3407",
        "marketType": "yesNo",
        "maxPrice": "1000000000000000000",
        "minPrice": "0",
        "needsMigration": false,
        "numOutcomes": 3,
        "numTicks": "10000",
        "openInterest": "150000000000000000",
        "outcomes": [
          {
            "description": "Invalid",
            "id": 0,
            "price": "2150",
          },
          {
            "description": "No",
            "id": 1,
            "price": "2150",
          },
          {
            "description": "Yes",
            "id": 2,
            "price": "0",
          },
        ],
        "reportingState": "FINALIZED",
        "resolutionSource": null,
        "scalarDenomination": null,
        "tickSize": "0.0001",
        "universe": "0x4112a78f07D155884b239A29e378D1f853Edd128",
        "volume": "100000000000000000",
      },
      {
        "author": "0x8fFf40Efec989Fc938bBA8b19584dA08ead986eE",
        "category": " \u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000",
        "consensus": null,
        "creationBlock": 91,
        "cumulativeScale": "1000000000000000000",
        "description": "description",
        "details": null,
        "finalizationBlockNumber": null,
        "finalizationTime": null,
        "id": "0x253CDD7C827E9167797aEcBe2Bc055d879F2B164",
        "marketType": "categorical",
        "maxPrice": "1000000000000000000",
        "minPrice": "0",
        "needsMigration": false,
        "numOutcomes": 4,
        "numTicks": "10000",
        "openInterest": "150000000000000000",
        "outcomes": [
          {
            "description": "Invalid",
            "id": 0,
            "price": "0",
          },
          {
            "description": "A\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000",
            "id": 1,
            "price": "0",
          },
          {
            "description": "B\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000",
            "id": 2,
            "price": "0",
          },
          {
            "description": "C\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000",
            "id": 3,
            "price": "0",
          },
        ],
        "reportingState": "DESIGNATED_REPORTING",
        "resolutionSource": null,
        "scalarDenomination": null,
        "tickSize": "0.0001",
        "universe": "0x4112a78f07D155884b239A29e378D1f853Edd128",
        "volume": "60750000000000000",
      },
      {
        "author": "0x8fFf40Efec989Fc938bBA8b19584dA08ead986eE",
        "category": " \u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000",
        "consensus": null,
        "creationBlock": 93,
        "cumulativeScale": "40",
        "description": "description",
        "details": null,
        "finalizationBlockNumber": null,
        "finalizationTime": null,
        "id": "0x4976474ff73f3CA6a5fc17e8175ce41eAb31C77d",
        "marketType": "scalar",
        "maxPrice": "40",
        "minPrice": "0",
        "needsMigration": false,
        "numOutcomes": 3,
        "numTicks": "4000",
        "openInterest": "60000000000000000",
        "outcomes": [
          {
            "description": "Invalid",
            "id": 0,
            "price": "2150",
          },
          {
            "description": "0",
            "id": 1,
            "price": "2150",
          },
          {
            "description": "40",
            "id": 2,
            "price": "0",
          },
        ],
        "reportingState": "DESIGNATED_REPORTING",
        "resolutionSource": null,
        "scalarDenomination": null,
        "tickSize": "0.00000000000000000001",
        "universe": "0x4112a78f07D155884b239A29e378D1f853Edd128",
        "volume": "30750000000000000",
      },
    ]
  );
*/
}, 120000);
