import { API } from "@augurproject/state/src/api/API";
import { MarketInfo } from "@augurproject/state/src/api/Markets";
import { MarketType } from "@augurproject/state/src/api/types";
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
  const {provider, addresses} = await compileAndDeployToGanache(ACCOUNTS);

  john = await ContractAPI.userWrapper(ACCOUNTS, 0, provider, addresses);
  mary = await ContractAPI.userWrapper(ACCOUNTS, 1, provider, addresses);
  db = await mock.makeDB(john.augur, ACCOUNTS);
  api = new API<any>(john.augur, db);
}, 60000);

test("State API :: Markets :: getMarketsInfo", async () => {
  await john.approveCentralAuthority();

  const yesNoMarket = await john.createReasonableMarket(john.augur.contracts.universe, [stringTo32ByteHex("Yes"), stringTo32ByteHex("No")], MarketType.YesNo);
  const categoricalMarket = await john.createReasonableMarket(john.augur.contracts.universe, [stringTo32ByteHex("A"), stringTo32ByteHex("B"), stringTo32ByteHex("C")], MarketType.Categorical);
  const scalarMarket = await john.createReasonableMarket(john.augur.contracts.universe, [stringTo32ByteHex(""), stringTo32ByteHex("")], MarketType.Scalar);

  await db.sync(
    john.augur,
    100000,
    10,
  );

  let markets: Array<MarketInfo> = await api.markets.getMarketsInfo({
    marketIds: [
      yesNoMarket.address,
      categoricalMarket.address,
      scalarMarket.address
    ]
  });

  // TODO Fix this workaround once bug in Jest is fixed: https://github.com/facebook/jest/issues/6184
  expect(markets[0].endTime).not.toBeNaN();
  expect(markets[1].endTime).not.toBeNaN();
  expect(markets[2].endTime).not.toBeNaN();
  delete markets[0].endTime;
  delete markets[1].endTime;
  delete markets[2].endTime;

  expect(markets).toMatchObject(
    [
      {
        "author": "0x8fFf40Efec989Fc938bBA8b19584dA08ead986eE",
        "category": " \u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000",
        "consensus": null,
        "creationBlock": 88,
        "creationTime": undefined,
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
        "numOutcomes": 0,
        "numTicks": "10000",
        "openInterest": "0",
        "outcomes": [
          {
            "description": null,
            "id": 0,
            "price": "0",
          },
          {
            "description": null,
            "id": 1,
            "price": "0",
          },
        ],
        "reportingState": "PRE_REPORTING",
        "resolutionSource": null,
        "scalarDenomination": null,
        "tickSize": "0.0001",
        "universe": "0x4112a78f07D155884b239A29e378D1f853Edd128",
        "volume": "0",
      },
      {
        "author": "0x8fFf40Efec989Fc938bBA8b19584dA08ead986eE",
        "category": " \u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000",
        "consensus": null,
        "creationBlock": 90,
        "creationTime": undefined,
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
        "numOutcomes": 3,
        "numTicks": "10000",
        "openInterest": "0",
        "outcomes": [
          {
            "description": "A\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000",
            "id": 0,
            "price": "0",
          },
          {
            "description": "B\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000",
            "id": 1,
            "price": "0",
          },
          {
            "description": "C\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000",
            "id": 2,
            "price": "0",
          },
        ],
        "reportingState": "PRE_REPORTING",
        "resolutionSource": null,
        "scalarDenomination": null,
        "tickSize": "0.0001",
        "universe": "0x4112a78f07D155884b239A29e378D1f853Edd128",
        "volume": "0",
      },
      {
        "author": "0x8fFf40Efec989Fc938bBA8b19584dA08ead986eE",
        "category": " \u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000",
        "consensus": null,
        "creationBlock": 92,
        "creationTime": undefined,
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
        "numOutcomes": 0,
        "numTicks": "4000",
        "openInterest": "0",
        "outcomes": [
          {
            "description": null,
            "id": 0,
            "price": "0",
          },
          {
            "description": null,
            "id": 1,
            "price": "0",
          },
        ],
        "reportingState": "PRE_REPORTING",
        "resolutionSource": null,
        "scalarDenomination": null,
        "tickSize": "0.00000000000000000001",
        "universe": "0x4112a78f07D155884b239A29e378D1f853Edd128",
        "volume": "0",
      },
    ]
  );

  // TODO Place orders and add checks for volume & open interest

  // TODO Add checks for reportingState, needsMigration, finalizationBlockNumber, & finalizationTime
  // by reporting, disputing, & finalizing a market

  // TODO Add checks for consensus, finalizationTime, outcome prices, & block timestamp
  // once more logs have been added
}, 60000);
