import {
  ACCOUNTS,
  makeDbMock,
  compileAndDeployToGanache,
  ContractAPI,
} from "../../../libs";
import { API } from "@augurproject/state/src/api/API";
import { DB } from "@augurproject/state/src/db/DB";
import { MarketTradingHistory } from "@augurproject/state/src/api/Trading";
import { ethers } from "ethers";
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

test("State API :: Trading :: getTradingHistory", async () => {
  await john.approveCentralAuthority();
  await mary.approveCentralAuthority();

  // Create a market
  const market = await john.createReasonableMarket(john.augur.contracts.universe, [stringTo32ByteHex("A"), stringTo32ByteHex("B")]);

  // Place an order
  const bid = new ethers.utils.BigNumber(0);
  const outcome = new ethers.utils.BigNumber(0);
  const numShares = new ethers.utils.BigNumber(10000000000000);
  const price = new ethers.utils.BigNumber(2150);
  await john.placeOrder(market.address, bid, numShares, price, outcome, stringTo32ByteHex(""), stringTo32ByteHex(""), stringTo32ByteHex("42"));

  // Take half the order using the same account
  const cost = numShares.mul(7850).div(2);
  const orderId = await john.getBestOrderId(bid, market.address, outcome);
  await john.fillOrder(orderId, cost, numShares.div(2), "42");

  // And the rest using another account
  await mary.fillOrder(orderId, cost, numShares.div(2), "43");

  await db.sync(
    john.augur,
    mock.constants.chunkSize,
    mock.constants.blockstreamDelay,
  );

  // Get trades by user
  let trades: Array<MarketTradingHistory> = await api.route("getTradingHistory", {
    account: mary.account,
  });

  await expect(trades).toHaveLength(1);

  const trade = trades[0];
  await expect(trade.price).toEqual("0.215");
  await expect(trade.type).toEqual("sell");
  await expect(trade.amount).toEqual("0.05");
  await expect(trade.maker).toEqual(false);
  await expect(trade.outcome).toEqual(0);
  await expect(trade.selfFilled).toEqual(false);

  // Get trades by market
  trades = await api.route("getTradingHistory", {
    marketId: market.address,
  });

  await expect(trades).toHaveLength(2);

}, 60000);
