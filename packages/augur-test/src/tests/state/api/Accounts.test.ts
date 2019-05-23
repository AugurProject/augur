import { ethers } from "ethers";
import { API } from "@augurproject/sdk/build/state/api/API";
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
  // Create markets with multiple users
  const johnYesNoMarket = await john.createReasonableYesNoMarket(john.augur.contracts.universe);
  const johnCategoricalMarket = await john.createReasonableMarket(john.augur.contracts.universe, [stringTo32ByteHex("A"), stringTo32ByteHex("B"), stringTo32ByteHex("C")]);
  const johnScalarMarket = await john.createReasonableScalarMarket(john.augur.contracts.universe);
  const maryYesNoMarket = await john.createReasonableYesNoMarket(john.augur.contracts.universe);
  const maryCategoricalMarket = await john.createReasonableMarket(john.augur.contracts.universe, [stringTo32ByteHex("A"), stringTo32ByteHex("B"), stringTo32ByteHex("C")]);
  const maryScalarMarket = await john.createReasonableScalarMarket(john.augur.contracts.universe);

  // Place orders
  const bid = new ethers.utils.BigNumber(0);
  const outcome0 = new ethers.utils.BigNumber(0);
  const outcome1 = new ethers.utils.BigNumber(1);
  const outcome2 = new ethers.utils.BigNumber(1);
  const numShares = new ethers.utils.BigNumber(10000000000000);
  const price = new ethers.utils.BigNumber(22);
  await john.placeOrder(johnYesNoMarket.address, bid, numShares, price, outcome0, stringTo32ByteHex(""), stringTo32ByteHex(""), stringTo32ByteHex("42"));
  await john.placeOrder(johnYesNoMarket.address, bid, numShares, price, outcome1, stringTo32ByteHex(""), stringTo32ByteHex(""), stringTo32ByteHex("42"));
  await john.placeOrder(johnYesNoMarket.address, bid, numShares, price, outcome2, stringTo32ByteHex(""), stringTo32ByteHex(""), stringTo32ByteHex("42"));
  await john.placeOrder(johnCategoricalMarket.address, bid, numShares, price, outcome0, stringTo32ByteHex(""), stringTo32ByteHex(""), stringTo32ByteHex("42"));
  await john.placeOrder(johnCategoricalMarket.address, bid, numShares, price, outcome1, stringTo32ByteHex(""), stringTo32ByteHex(""), stringTo32ByteHex("42"));
  await john.placeOrder(johnCategoricalMarket.address, bid, numShares, price, outcome2, stringTo32ByteHex(""), stringTo32ByteHex(""), stringTo32ByteHex("42"));
  await john.placeOrder(johnScalarMarket.address, bid, numShares, price, outcome0, stringTo32ByteHex(""), stringTo32ByteHex(""), stringTo32ByteHex("42"));
  await john.placeOrder(johnScalarMarket.address, bid, numShares, price, outcome1, stringTo32ByteHex(""), stringTo32ByteHex(""), stringTo32ByteHex("42"));
  await john.placeOrder(johnScalarMarket.address, bid, numShares, price, outcome2, stringTo32ByteHex(""), stringTo32ByteHex(""), stringTo32ByteHex("42"));

  // Fill orders
  const cost = numShares.mul(78).div(10);
  await john.fillOrder(await john.getBestOrderId(bid, johnYesNoMarket.address, outcome0), cost, numShares.div(10).mul(2), "42");
  await john.fillOrder(await john.getBestOrderId(bid, johnYesNoMarket.address, outcome1), cost, numShares.div(10).mul(3), "43");
  await john.fillOrder(await john.getBestOrderId(bid, johnYesNoMarket.address, outcome2), cost, numShares.div(10).mul(3), "43");
  await john.fillOrder(await john.getBestOrderId(bid, johnCategoricalMarket.address, outcome0), cost, numShares.div(10).mul(2), "42");
  await john.fillOrder(await john.getBestOrderId(bid, johnCategoricalMarket.address, outcome1), cost, numShares.div(10).mul(3), "43");
  await john.fillOrder(await john.getBestOrderId(bid, johnCategoricalMarket.address, outcome2), cost, numShares.div(10).mul(3), "43");
  await john.fillOrder(await john.getBestOrderId(bid, johnScalarMarket.address, outcome0), cost, numShares.div(10).mul(2), "42");
  await john.fillOrder(await john.getBestOrderId(bid, johnScalarMarket.address, outcome1), cost, numShares.div(10).mul(3), "43");

  // Cancel an order
  await john.cancelOrder(await john.getBestOrderId(bid, johnScalarMarket.address, outcome2));

  // Purchase & sell complete sets
  const numberOfCompleteSets = new ethers.utils.BigNumber(1);
  await john.buyCompleteSets(johnYesNoMarket, numberOfCompleteSets);
  await john.sellCompleteSets(johnYesNoMarket, numberOfCompleteSets);

  // Purchase participation tokens
  const disputeWindowAddress = await john.augur.contracts.universe.getCurrentDisputeWindow_(false);
  john.buyParticipationTokens(disputeWindowAddress, new ethers.utils.BigNumber(1));

  // const newTime = (await john.getTimestamp()).add(SECONDS_IN_A_DAY);
  // await john.setTimestamp(newTime);

  // Submit initial reports & dispute outcomes

  // Finalize market & redeem crowdsourcer funds

  // Redeem participation tokens
  john.redeemParticipationTokens(disputeWindowAddress);

  await db.sync(john.augur, mock.constants.chunkSize, 0);

  let accountTransactionHistory = await api.route("getAccountTransactionHistory", {
    universe: john.augur.contracts.universe.address,
    account: ACCOUNTS[0].publicKey
  });
  console.log(accountTransactionHistory);
  // expect(yesNoMarketTransactionHistory).toMatchObject(
  // );
}, 120000);
