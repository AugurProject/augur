import { ethers } from "ethers";
import { API } from "@augurproject/sdk/build/state/api/API";
import { MarketInfo, MarketInfoReportingState, SECONDS_IN_A_DAY } from "@augurproject/sdk/build/state/api/Markets";
import { Contracts as compilerOutput } from "@augurproject/artifacts";
import { DB } from "@augurproject/sdk/build/state/db/DB";
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
  await john.approveCentralAuthority();
  await mary.approveCentralAuthority();
}, 120000);

test("State API :: Accounts :: getAccountTransactionHistory", async () => {
  const yesNoMarket = await john.createReasonableYesNoMarket(john.augur.contracts.universe);

  // Place orders
  const bid = new ethers.utils.BigNumber(0);
  const outcome0 = new ethers.utils.BigNumber(0);
  const outcome1 = new ethers.utils.BigNumber(1);
  const numShares = new ethers.utils.BigNumber(10000000000000);
  const price = new ethers.utils.BigNumber(22);
  await john.placeOrder(yesNoMarket.address, bid, numShares, price, outcome0, stringTo32ByteHex(""), stringTo32ByteHex(""), stringTo32ByteHex("42"));
  await john.placeOrder(yesNoMarket.address, bid, numShares, price, outcome1, stringTo32ByteHex(""), stringTo32ByteHex(""), stringTo32ByteHex("42"));

  // Fill orders
  const cost = numShares.mul(78).div(10);
  let yesNoOrderId0 = await john.getBestOrderId(bid, yesNoMarket.address, outcome0);
  let yesNoOrderId1 = await john.getBestOrderId(bid, yesNoMarket.address, outcome1);
  await john.fillOrder(yesNoOrderId0, cost, numShares.div(10).mul(2), "42");
  await mary.fillOrder(yesNoOrderId1, cost, numShares.div(10).mul(3), "43");

  await db.sync(john.augur, mock.constants.chunkSize, 0);

  let accountTransactionHistory = await api.route("getAccountTransactionHistory", {
    universe: john.augur.contracts.universe.address,
    account: ACCOUNTS[0].publicKey
  });
  console.log(accountTransactionHistory);
  // expect(yesNoMarketTransactionHistory).toMatchObject(
  // );
}, 120000);
