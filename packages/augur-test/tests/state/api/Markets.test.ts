import { ethers } from "ethers";
import { API } from "@augurproject/state/src/api/API";
import { MarketInfo, MarketInfoReportingState, SECONDS_IN_A_DAY } from "@augurproject/state/src/api/Markets";
import { Contracts as compilerOutput } from "@augurproject/artifacts";
import { DB } from "@augurproject/state/src/db/DB";
import {
  ACCOUNTS,
  makeDbMock,
  deployContracts,
  ContractAPI,
} from "../../../libs";
import { stringTo32ByteHex, NULL_ADDRESS } from "../../../libs/Utils";

const mock = makeDbMock();

let db: DB<any>;
let api: API<any>;
let john: ContractAPI;
let mary: ContractAPI;

beforeAll(async () => {
  const { provider, addresses } = await deployContracts(ACCOUNTS, compilerOutput);

  john = await ContractAPI.userWrapper(ACCOUNTS, 0, provider, addresses);
  mary = await ContractAPI.userWrapper(ACCOUNTS, 1, provider, addresses);
  db = await mock.makeDB(john.augur, ACCOUNTS);
  api = new API<any>(john.augur, db);
}, 120000);

// NOTE: Full-text searching is tested more in SyncableDB.test.ts
test("State API :: Markets :: getMarkets", async () => {
  await john.approveCentralAuthority();
  await mary.approveCentralAuthority();

  const universe = john.augur.contracts.universe;
  const endTime = (await john.getTimestamp()).add(SECONDS_IN_A_DAY);
  const lowFeePerCashInAttoCash = new ethers.utils.BigNumber(10).pow(18).div(20); // 5% creator fee
  const highFeePerCashInAttoCash = new ethers.utils.BigNumber(10).pow(18).div(10); // 10% creator fee
  const affiliateFeeDivisor = new ethers.utils.BigNumber(0);
  const designatedReporter = john.account;
  const yesNoMarket1 = await john.createYesNoMarket(
    universe,
    endTime,
    lowFeePerCashInAttoCash,
    affiliateFeeDivisor,
    designatedReporter,
    "yesNo topic 1",
    "{\"description\": \"yesNo description 1\", \"longDescription\": \"yesNo longDescription 1\", \"tags\": [\"yesNo tag1-1\", \"yesNo tag1-2\", \"yesNo tag1-3\"]}"
  );
  const yesNoMarket2 = await john.createYesNoMarket(
    universe,
    endTime,
    lowFeePerCashInAttoCash,
    affiliateFeeDivisor,
    designatedReporter,
    "yesNo topic 2",
    "{\"description\": \"yesNo description 2\", \"longDescription\": \"yesNo longDescription 2\", \"tags\": [\"yesNo tag2-1\", \"yesNo tag2-2\", \"yesNo tag2-3\"]}"
  );
  const categoricalMarket1 = await john.createCategoricalMarket(
    universe,
    endTime,
    lowFeePerCashInAttoCash,
    affiliateFeeDivisor,
    designatedReporter,
    [stringTo32ByteHex("A"), stringTo32ByteHex("B"), stringTo32ByteHex("C")],
    "categorical topic 1",
    "{\"description\": \"categorical description 1\", \"longDescription\": \"categorical longDescription 1\", \"tags\": [\"categorical tag1-1\", \"categorical tag1-2\", \"categorical tag1-3\"]}"
  );
  const categoricalMarket2 = await john.createCategoricalMarket(
    universe,
    endTime,
    highFeePerCashInAttoCash,
    affiliateFeeDivisor,
    designatedReporter,
    [stringTo32ByteHex("A"), stringTo32ByteHex("B"), stringTo32ByteHex("C")],
    "categorical topic 2",
    "{\"description\": \"categorical description 2\", \"longDescription\": \"categorical longDescription 2\", \"tags\": [\"categorical tag2-1\", \"categorical tag2-2\", \"categorical tag2-3\"]}"
  );
  const scalarMarket1 = await john.createScalarMarket(
    universe,
    endTime,
    highFeePerCashInAttoCash,
    affiliateFeeDivisor,
    designatedReporter,
    [new ethers.utils.BigNumber(0), new ethers.utils.BigNumber(100)],
    new ethers.utils.BigNumber(100),
    "scalar topic 1",
    "{\"description\": \"scalar description 1\", \"longDescription\": \"scalar longDescription 1\", \"_scalarDenomination\": \"scalar denom 1\", \"tags\": [\"scalar tag1-1\", \"scalar tag1-2\", \"scalar tag1-3\"]}"
  );
  const scalarMarket2 = await john.createScalarMarket(
    universe,
    endTime,
    highFeePerCashInAttoCash,
    affiliateFeeDivisor,
    designatedReporter,
    [new ethers.utils.BigNumber(0), new ethers.utils.BigNumber(100)],
    new ethers.utils.BigNumber(100),
    "scalar topic 2",
    "{\"description\": \"scalar description 2\", \"longDescription\": \"scalar longDescription 2\", \"_scalarDenomination\": \"scalar denom 2\", \"tags\": [\"scalar tag2-1\", \"scalar tag2-2\", \"scalar tag2-3\"]}"
  );

  await db.sync(john.augur, mock.constants.chunkSize, 0);

  let markets: Array<MarketInfo>;

  // Test non-existent universe address
  const nonexistentAddress = "0x1111111111111111111111111111111111111111";
  let errorMessage = "";
  try {
    let markets: Array<MarketInfo> = await api.route("getMarkets", {
      universe: nonexistentAddress
    });
  } catch (error) {
    errorMessage = error.message;
  }
  expect(errorMessage).toEqual("Unknown universe: 0x1111111111111111111111111111111111111111");

  // Test creator
  markets = await api.route("getMarkets", {
    universe: universe.address,
    creator: ACCOUNTS[0].publicKey
  });
  expect(markets).toEqual(
    [
      yesNoMarket1.address,
      yesNoMarket2.address,
      categoricalMarket1.address,
      categoricalMarket2.address,
      scalarMarket1.address,
      scalarMarket2.address
    ]
  );

  markets = await api.route("getMarkets", {
    universe: universe.address,
    creator: nonexistentAddress
  });
  expect(markets).toEqual([]);

  // Test designatedReporter
  markets = await api.route("getMarkets", {
    universe: universe.address,
    designatedReporter: ACCOUNTS[0].publicKey
  });
  expect(markets).toEqual(
    [
      yesNoMarket1.address,
      yesNoMarket2.address,
      categoricalMarket1.address,
      categoricalMarket2.address,
      scalarMarket1.address,
      scalarMarket2.address
    ]
  );

  markets = await api.route("getMarkets", {
    universe: universe.address,
    designatedReporter: nonexistentAddress
  });
  expect(markets).toEqual([]);

  // Test maxFee
  markets = await api.route("getMarkets", {
    universe: universe.address,
    maxFee: "0.05"
  });
  expect(markets).toEqual([]);

  markets = await api.route("getMarkets", {
    universe: universe.address,
    maxFee: "0.06"
  });
  expect(markets).toEqual(
    [
      yesNoMarket1.address,
      yesNoMarket2.address,
      categoricalMarket1.address
    ]
  );

  markets = await api.route("getMarkets", {
    universe: universe.address,
    maxFee: "0.11"
  });
  expect(markets).toEqual(
    [
      yesNoMarket1.address,
      yesNoMarket2.address,
      categoricalMarket1.address,
      categoricalMarket2.address,
      scalarMarket1.address,
      scalarMarket2.address
    ]
  );

  // Place orders on some markets
  const bid = new ethers.utils.BigNumber(0);
  const outcome0 = new ethers.utils.BigNumber(0);
  const outcome1 = new ethers.utils.BigNumber(1);
  const numShares = new ethers.utils.BigNumber(10000000000000);
  const price = new ethers.utils.BigNumber(22);
  const yesNoOrderId = await john.placeOrder(yesNoMarket1.address, bid, numShares, price, outcome0, stringTo32ByteHex(""), stringTo32ByteHex(""), stringTo32ByteHex("42"));
  await john.cancelOrder(yesNoOrderId);
  await john.placeOrder(yesNoMarket1.address, bid, numShares, price, outcome0, stringTo32ByteHex(""), stringTo32ByteHex(""), stringTo32ByteHex("42"));
  await john.placeOrder(categoricalMarket1.address, bid, numShares, price, outcome0, stringTo32ByteHex(""), stringTo32ByteHex(""), stringTo32ByteHex("42"));
  await john.placeOrder(scalarMarket1.address, bid, numShares, price, outcome0, stringTo32ByteHex(""), stringTo32ByteHex(""), stringTo32ByteHex("42"));

  await db.sync(john.augur, mock.constants.chunkSize, 0);

  // Test hasOrders
  markets = await api.route("getMarkets", {
    universe: universe.address,
    hasOrders: false,
  });
  expect(markets).toEqual(
    [
      yesNoMarket1.address,
      yesNoMarket2.address,
      categoricalMarket1.address,
      categoricalMarket2.address,
      scalarMarket1.address,
      scalarMarket2.address
    ]
  );

  markets = await api.route("getMarkets", {
    universe: universe.address,
    hasOrders: true,
  });
  expect(markets).toEqual(
    [
      yesNoMarket1.address,
      categoricalMarket1.address,
      scalarMarket1.address
    ]
  );

  // Partially fill orders
  const cost = numShares.mul(78).div(2);
  const yesNoOrderId1 = await john.getBestOrderId(bid, yesNoMarket1.address, outcome0);
  const categoricalOrderId1 = await john.getBestOrderId(bid, categoricalMarket1.address, outcome0);
  const scalarOrderId1 = await john.getBestOrderId(bid, scalarMarket1.address, outcome0);
  await john.fillOrder(yesNoOrderId1, cost, numShares.div(2), "42");
  await mary.fillOrder(categoricalOrderId1, cost, numShares.div(2), "43");
  await mary.fillOrder(scalarOrderId1, cost, numShares.div(2), "43");

  await db.sync(john.augur, mock.constants.chunkSize, 0);

  markets = await api.route("getMarkets", {
    universe: universe.address,
    hasOrders: true,
  });
  expect(markets).toEqual(
    [
      yesNoMarket1.address,
      categoricalMarket1.address,
      scalarMarket1.address
    ]
  );

  // Completely fill orders
  await john.fillOrder(yesNoOrderId1, cost, numShares.div(2), "42");
  await mary.fillOrder(categoricalOrderId1, cost, numShares.div(2), "43");
  await mary.fillOrder(scalarOrderId1, cost, numShares.div(2), "43");

  await db.sync(john.augur, mock.constants.chunkSize, 0);

  markets = await api.route("getMarkets", {
    universe: universe.address,
    hasOrders: true,
  });
  expect(markets).toEqual([]);

  // Move timestamp to designated reporting phase
  await john.setTimestamp(endTime);

  await db.sync(john.augur, mock.constants.chunkSize, 0);

  // Test disputeWindow
  markets = await api.route("getMarkets", {
    universe: universe.address,
    disputeWindow: NULL_ADDRESS
  });
  expect(markets).toEqual(
    [
      yesNoMarket1.address,
      yesNoMarket2.address,
      categoricalMarket1.address,
      categoricalMarket2.address,
      scalarMarket1.address,
      scalarMarket2.address
    ]
  );

  // Test reportingState
  markets = await api.route("getMarkets", {
    universe: universe.address,
    reportingState: MarketInfoReportingState.DESIGNATED_REPORTING
  });
  expect(markets).toEqual(
    [
      yesNoMarket1.address,
      yesNoMarket2.address,
      categoricalMarket1.address,
      categoricalMarket2.address,
      scalarMarket1.address,
      scalarMarket2.address
    ]
  );

  markets = await api.route("getMarkets", {
    universe: universe.address,
    reportingState: MarketInfoReportingState.PRE_REPORTING
  });
  expect(markets).toEqual([]);

  await john.setTimestamp(endTime.add(1));

  const noPayoutSet = [new ethers.utils.BigNumber(100), new ethers.utils.BigNumber(0), new ethers.utils.BigNumber(0)];
  await john.doInitialReport(yesNoMarket1, noPayoutSet);

  await db.sync(john.augur, mock.constants.chunkSize, 0);

  // Retest disputeWindow & reportingState
  let disputeWindow = await yesNoMarket1.getDisputeWindow_();
  markets = await api.route("getMarkets", {
    universe: universe.address,
    disputeWindow
  });
  expect(markets).toEqual([yesNoMarket1.address]);

  markets = await api.route("getMarkets", {
    universe: universe.address,
    reportingState: MarketInfoReportingState.DESIGNATED_REPORTING
  });
  expect(markets).toEqual(
    [
      yesNoMarket2.address,
      categoricalMarket1.address,
      categoricalMarket2.address,
      scalarMarket1.address,
      scalarMarket2.address
    ]
  );

  markets = await api.route("getMarkets", {
    universe: universe.address,
    reportingState: MarketInfoReportingState.CROWDSOURCING_DISPUTE
  });
  expect(markets).toEqual([yesNoMarket1.address]);

  markets = await api.route("getMarkets", {
    universe: universe.address,
    reportingState: [
      MarketInfoReportingState.CROWDSOURCING_DISPUTE,
      MarketInfoReportingState.DESIGNATED_REPORTING
    ]
  });
  expect(markets).toEqual(
    [
      yesNoMarket1.address,
      yesNoMarket2.address,
      categoricalMarket1.address,
      categoricalMarket2.address,
      scalarMarket1.address,
      scalarMarket2.address
    ]);
}, 120000);

test("State API :: Markets :: getMarketsInfo", async () => {
  await john.approveCentralAuthority();
  await mary.approveCentralAuthority();

  const yesNoMarket = await john.createReasonableYesNoMarket(john.augur.contracts.universe);
  const categoricalMarket = await john.createReasonableMarket(john.augur.contracts.universe, [stringTo32ByteHex("A"), stringTo32ByteHex("B"), stringTo32ByteHex("C")]);
  const scalarMarket = await john.createReasonableScalarMarket(john.augur.contracts.universe);

  // Place orders
  const bid = new ethers.utils.BigNumber(0);
  const outcome0 = new ethers.utils.BigNumber(0);
  const outcome1 = new ethers.utils.BigNumber(1);
  const numShares = new ethers.utils.BigNumber(10000000000000);
  const price = new ethers.utils.BigNumber(22);
  await john.placeOrder(yesNoMarket.address, bid, numShares, price, outcome0, stringTo32ByteHex(""), stringTo32ByteHex(""), stringTo32ByteHex("42"));
  await john.placeOrder(yesNoMarket.address, bid, numShares, price, outcome1, stringTo32ByteHex(""), stringTo32ByteHex(""), stringTo32ByteHex("42"));
  await john.placeOrder(categoricalMarket.address, bid, numShares, price, outcome0, stringTo32ByteHex(""), stringTo32ByteHex(""), stringTo32ByteHex("42"));
  await john.placeOrder(categoricalMarket.address, bid, numShares, price, outcome1, stringTo32ByteHex(""), stringTo32ByteHex(""), stringTo32ByteHex("42"));
  await john.placeOrder(scalarMarket.address, bid, numShares, price, outcome0, stringTo32ByteHex(""), stringTo32ByteHex(""), stringTo32ByteHex("42"));
  await john.placeOrder(scalarMarket.address, bid, numShares, price, outcome1, stringTo32ByteHex(""), stringTo32ByteHex(""), stringTo32ByteHex("42"));

  // Partially fill orders
  const cost = numShares.mul(78).div(2);
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

  await db.sync(john.augur, mock.constants.chunkSize, 0);

  let markets: Array<MarketInfo> = await api.route("getMarketsInfo", {
    marketIds: [
      yesNoMarket.address,
      categoricalMarket.address,
      scalarMarket.address
    ]
  });

  expect(markets[0].reportingState).toBe(MarketInfoReportingState.PRE_REPORTING);
  expect(markets[1].reportingState).toBe(MarketInfoReportingState.PRE_REPORTING);
  expect(markets[2].reportingState).toBe(MarketInfoReportingState.PRE_REPORTING);

  // Skip to yes/no market end time
  let newTime = (await yesNoMarket.getEndTime_()).add(1);
  await john.setTimestamp(newTime);

  await db.sync(john.augur, mock.constants.chunkSize, 0);

  markets = await api.route("getMarketsInfo", {
    marketIds: [
      yesNoMarket.address,
      categoricalMarket.address,
      scalarMarket.address
    ]
  });

  expect(markets[0].reportingState).toBe(MarketInfoReportingState.DESIGNATED_REPORTING);
  expect(markets[1].reportingState).toBe(MarketInfoReportingState.DESIGNATED_REPORTING);
  expect(markets[2].reportingState).toBe(MarketInfoReportingState.DESIGNATED_REPORTING);

    // Skip to open reporting
  newTime = newTime.add(SECONDS_IN_A_DAY * 7);
  await john.setTimestamp(newTime);

  await db.sync(john.augur, mock.constants.chunkSize, 0);

  markets = await api.route("getMarketsInfo", {
    marketIds: [
      yesNoMarket.address,
      categoricalMarket.address,
      scalarMarket.address
    ]
  });

  expect(markets[0].reportingState).toBe(MarketInfoReportingState.OPEN_REPORTING);
  expect(markets[1].reportingState).toBe(MarketInfoReportingState.OPEN_REPORTING);
  expect(markets[2].reportingState).toBe(MarketInfoReportingState.OPEN_REPORTING);

  // Submit intial reports
  const categoricalMarketPayoutSet = [
    new ethers.utils.BigNumber(100),
    new ethers.utils.BigNumber(0),
    new ethers.utils.BigNumber(0),
    new ethers.utils.BigNumber(0)
  ];
  await john.doInitialReport(categoricalMarket, categoricalMarketPayoutSet);

  const noPayoutSet = [new ethers.utils.BigNumber(100), new ethers.utils.BigNumber(0), new ethers.utils.BigNumber(0)];
  const yesPayoutSet = [new ethers.utils.BigNumber(0), new ethers.utils.BigNumber(100), new ethers.utils.BigNumber(0)];
  await john.doInitialReport(yesNoMarket, noPayoutSet);

  await db.sync(john.augur, mock.constants.chunkSize, 0);

  markets = await api.route("getMarketsInfo", {
    marketIds: [
      yesNoMarket.address,
      categoricalMarket.address,
      scalarMarket.address
    ]
  });

  expect(markets[0].reportingState).toBe(MarketInfoReportingState.CROWDSOURCING_DISPUTE);
  expect(markets[1].reportingState).toBe(MarketInfoReportingState.CROWDSOURCING_DISPUTE);
  expect(markets[2].reportingState).toBe(MarketInfoReportingState.OPEN_REPORTING);

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

  await db.sync(john.augur, mock.constants.chunkSize, 0);

  markets = await api.route("getMarketsInfo", {
    marketIds: [
      yesNoMarket.address,
      categoricalMarket.address,
      scalarMarket.address
    ]
  });

  expect(markets[0].reportingState).toBe(MarketInfoReportingState.AWAITING_NEXT_WINDOW);
  expect(markets[1].reportingState).toBe(MarketInfoReportingState.CROWDSOURCING_DISPUTE);
  expect(markets[2].reportingState).toBe(MarketInfoReportingState.OPEN_REPORTING);

  newTime = newTime.add(SECONDS_IN_A_DAY * 7);
  await john.setTimestamp(newTime);

  await db.sync(john.augur, mock.constants.chunkSize, 0);

  markets = await api.route("getMarketsInfo", {
    marketIds: [
      yesNoMarket.address,
      categoricalMarket.address,
      scalarMarket.address
    ]
  });

  expect(markets[0].reportingState).toBe(MarketInfoReportingState.CROWDSOURCING_DISPUTE);
  expect(markets[1].reportingState).toBe(MarketInfoReportingState.CROWDSOURCING_DISPUTE);
  expect(markets[2].reportingState).toBe(MarketInfoReportingState.OPEN_REPORTING);

  // Continue disputing
  for (let disputeRound = 12; disputeRound <= 19; disputeRound++) {
    if (disputeRound % 2 !== 0) {
      await mary.contribute(yesNoMarket, yesPayoutSet, new ethers.utils.BigNumber(25000));
      let remainingToFill = await john.getRemainingToFill(yesNoMarket, yesPayoutSet);
      await mary.contribute(yesNoMarket, yesPayoutSet, remainingToFill);
    } else {
      await john.contribute(yesNoMarket, noPayoutSet, new ethers.utils.BigNumber(25000));
      let remainingToFill = await john.getRemainingToFill(yesNoMarket, noPayoutSet);
      await john.contribute(yesNoMarket, noPayoutSet, remainingToFill);
    }
    newTime = newTime.add(SECONDS_IN_A_DAY * 7);
    await john.setTimestamp(newTime);
  }

  await john.finalizeMarket(categoricalMarket);

  // Fork market
  await john.contribute(yesNoMarket, noPayoutSet, new ethers.utils.BigNumber(25000));
  let remainingToFill = await john.getRemainingToFill(yesNoMarket, noPayoutSet);
  await john.contribute(yesNoMarket, noPayoutSet, remainingToFill);

  await db.sync(john.augur, mock.constants.chunkSize, 0);

  markets = await api.route("getMarketsInfo", {
    marketIds: [
      yesNoMarket.address,
      categoricalMarket.address,
      scalarMarket.address
    ]
  });

  expect(markets).toMatchObject(
    [
      {
        "author": "0x8fFf40Efec989Fc938bBA8b19584dA08ead986eE",
        "category": " \u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000",
        "consensus": null,
        "cumulativeScale": "1000000000000000000",
        "details": null,
        "finalizationTime": null,
        "marketType": "yesNo",
        "maxPrice": "1000000000000000000",
        "minPrice": "0",
        "needsMigration": false,
        "numOutcomes": 3,
        "numTicks": "100",
        "openInterest": "1500000000000000",
        "outcomes": [
          {
            "description": "Invalid",
            "id": 0,
            "price": "22",
          },
          {
            "description": "No",
            "id": 1,
            "price": "22",
          },
          {
            "description": "Yes",
            "id": 2,
            "price": "0",
          },
        ],
        "reportingState": "FORKING",
        "resolutionSource": null,
        "scalarDenomination": null,
        "tickSize": "0.01",
        "universe": "0x4112a78f07D155884b239A29e378D1f853Edd128",
        "volume": "1000000000000000",
      },
      {
        "author": "0x8fFf40Efec989Fc938bBA8b19584dA08ead986eE",
        "category": " \u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000",
        "consensus": [
          "100",
          "0",
          "0",
          "0",
        ],
        "cumulativeScale": "1000000000000000000",
        "details": null,
        "marketType": "categorical",
        "maxPrice": "1000000000000000000",
        "minPrice": "0",
        "needsMigration": false,
        "numOutcomes": 4,
        "numTicks": "10000",
        "openInterest": "1500000000000000",
        "outcomes": [
          {
            "description": "Invalid",
            "id": 0,
            "price": "22",
          },
          {
            "description": "A\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000",
            "id": 1,
            "price": "22",
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
        "reportingState": "FINALIZED",
        "resolutionSource": null,
        "scalarDenomination": null,
        "tickSize": "0.0001",
        "universe": "0x4112a78f07D155884b239A29e378D1f853Edd128",
        "volume": "610000000000000",
      },
      {
        "author": "0x8fFf40Efec989Fc938bBA8b19584dA08ead986eE",
        "category": " \u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000",
        "consensus": null,
        "cumulativeScale": "200000000000000000000",
        "details": null,
        "finalizationTime": null,
        "marketType": "scalar",
        "maxPrice": "250000000000000000000",
        "minPrice": "50000000000000000000",
        "needsMigration": true,
        "numOutcomes": 3,
        "numTicks": "2000000",
        "openInterest": "30000000000000000000",
        "outcomes": [
          {
            "description": "Invalid",
            "id": 0,
            "price": "22",
          },
          {
            "description": "50000000000000000000",
            "id": 1,
            "price": "22",
          },
          {
            "description": "250000000000000000000",
            "id": 2,
            "price": "0",
          },
        ],
        "reportingState": "AWAITING_FORK_MIGRATION",
        "resolutionSource": null,
        "scalarDenomination": null,
        "tickSize": "0.0001",
        "universe": "0x4112a78f07D155884b239A29e378D1f853Edd128",
        "volume": "10000110000000000000",
      },
    ]
  );

  expect(markets[0]).toHaveProperty("creationBlock");
  expect(markets[1]).toHaveProperty("creationBlock");
  expect(markets[2]).toHaveProperty("creationBlock");

  expect(markets[0]).toHaveProperty("endTime");
  expect(markets[1]).toHaveProperty("endTime");
  expect(markets[2]).toHaveProperty("endTime");

  expect(markets[0]).toHaveProperty("finalizationTime");
  expect(markets[1]).toHaveProperty("finalizationTime");
  expect(markets[2]).toHaveProperty("finalizationTime");

  expect(markets[0]).toHaveProperty("id");
  expect(markets[1]).toHaveProperty("id");
  expect(markets[2]).toHaveProperty("id");
}, 180000);
