import {makeTestAugur, makeAdditionalTestAugur, ACCOUNTS} from "../../libs/LocalAugur";
import {API} from "@augurproject/state/src/api/API";
import {DB} from "@augurproject/state/src/db/DB";
import {makeDbMock} from "../../libs/MakeDbMock";
import {Augur} from "@augurproject/api";
import {ContractAPI} from "../../libs/ContractAPI";
import {MarketTradingHistory} from "@augurproject/state/src/api/Trading";
import { ethers } from "ethers";
import { EthersProvider } from "@augurproject/ethersjs-provider";
import { stringTo32ByteHex, NULL_ADDRESS } from "../../libs/Utils";

const mock = makeDbMock();

beforeEach(async () => {
  mock.cancelFail();
});

let augur: Augur<any>;
let augur_2: Augur<any>;
let db: DB<any>;
let api: API<any>;
let contractAPI: ContractAPI;
let contractAPI_2: ContractAPI;

beforeAll(async () => {
  augur = await makeTestAugur(ACCOUNTS);
  augur_2 = await makeAdditionalTestAugur(ACCOUNTS[1], augur.provider, augur.addresses);
  db = await mock.makeDB(augur, ACCOUNTS);
  api = new API<any>(augur, db);
  contractAPI = new ContractAPI(augur, augur.provider as EthersProvider, ACCOUNTS[0].publicKey);
  contractAPI_2 = new ContractAPI(augur_2, augur_2.provider as EthersProvider, ACCOUNTS[1].publicKey);
}, 60000);

test("State API :: Trading :: getTradingHistory", async () => {

  await contractAPI.approveCentralAuthority();
  await contractAPI_2.approveCentralAuthority();

  // Create a market
  const market = await contractAPI.createReasonableMarket(augur.contracts.universe, [stringTo32ByteHex("A"), stringTo32ByteHex("B")]);

  // Place an order
  let bid = new ethers.utils.BigNumber(0);
  let outcome = new ethers.utils.BigNumber(0);
  let numShares = new ethers.utils.BigNumber(10000000000000);
  let price = new ethers.utils.BigNumber(2150);
  await contractAPI.placeOrder(market.address, bid, numShares, price, outcome, stringTo32ByteHex(""), stringTo32ByteHex(""), stringTo32ByteHex("42"));

  // Take half the order using the same account
  const cost = numShares.mul(7850).div(2);
  await augur.contracts.cash.faucet(cost);
  const orderId = await contractAPI.getBestOrderId(bid, market.address, outcome);
  await augur.contracts.fillOrder.publicFillOrder(orderId, numShares.div(2), stringTo32ByteHex("42"), false, NULL_ADDRESS);

  // And the rest using another account
  await augur_2.contracts.cash.faucet(cost);
  await augur_2.contracts.fillOrder.publicFillOrder(orderId, numShares.div(2), stringTo32ByteHex("43"), false, NULL_ADDRESS);

  await db.sync(
    augur,
    100000,
    10,
  );

  // Get trades by user
  let trades: Array<MarketTradingHistory> = await api.route("getTradingHistory", {
    account: ACCOUNTS[1].publicKey,
  });

  await expect(trades).toHaveLength(1);

  let trade = trades[0];

  await expect(trade.price).toEqual("0.215");
  await expect(trade.type).toEqual("sell");
  await expect(trade.amount).toEqual("0.05");
  await expect(trade.maker).toEqual(false);
  await expect(trade.outcome).toEqual(0);
  await expect(trade.selfFilled).toEqual(false);

  // Get trades by market
  trades = await api.route("getTradingHistory", {
    marketId: market.address
  });

  await expect(trades).toHaveLength(2);

}, 60000);
