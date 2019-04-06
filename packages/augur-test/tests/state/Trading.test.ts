import {makeTestAugur, ACCOUNTS} from "../../libs/LocalAugur";
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
  //await mock.wipeDB();
});

let augur: Augur<any>;
let db: DB<any>;
let api: API<any>;
let contractAPI: ContractAPI;

beforeAll(async () => {
  augur = await makeTestAugur(ACCOUNTS);
  db = await mock.makeDB(augur, ACCOUNTS);
  api = new API<any>(augur, db);
  contractAPI = new ContractAPI(augur, augur.provider as EthersProvider, ACCOUNTS[0].publicKey);
}, 60000);

test("State API :: Trading :: getTradingHistory", async () => {

  await contractAPI.approveCentralAuthority();

  // Create a market
  const market = await contractAPI.createReasonableMarket(augur.contracts.universe, [stringTo32ByteHex("A"), stringTo32ByteHex("B")]);

  // Place an order
  let bid = new ethers.utils.BigNumber(0);
  let outcome = new ethers.utils.BigNumber(0);
  let numShares = new ethers.utils.BigNumber(10000000000000);
  let price = new ethers.utils.BigNumber(2150);
  await contractAPI.placeOrder(market.address, bid, numShares, price, outcome, stringTo32ByteHex(""), stringTo32ByteHex(""), stringTo32ByteHex("42"));

  // Take the order
  const cost = numShares.mul(7850);
  await augur.contracts.cash.faucet(cost.mul(100000));
  const orderId = await contractAPI.getBestOrderId(bid, market.address, outcome);
  await augur.contracts.fillOrder.publicFillOrder(orderId, numShares, stringTo32ByteHex("42"), false, NULL_ADDRESS);

  await db.sync(
    augur,
    100000,
    10,
  );

  const trades: Array<MarketTradingHistory> = await api.trading.getTradingHistory({universe: augur.addresses.Universe});
  const trade = trades[0];

  await expect(trade.price).toEqual("0.215");
  await expect(trade.type).toEqual("buy");
  await expect(trade.amount).toEqual("0.1");
  await expect(trade.maker).toEqual(false);
  await expect(trade.selfFilled).toEqual(true);

}, 60000);
