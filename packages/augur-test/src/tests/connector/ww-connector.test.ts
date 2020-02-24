// import {
//   ACCOUNTS,
//   makeDbMock,
// } from "../../libs";

// import { API } from "@augurproject/sdk/build/state/getter/API";
// import { BigNumber } from "bignumber.js";
// import { Contracts as compilerOutput } from "@augurproject/artifacts";
// import { DB } from "@augurproject/sdk/build/state/db/DB";
// import { EthersProvider } from "@augurproject/ethersjs-provider";
// import { Markets, SECONDS_IN_A_DAY } from "@augurproject/sdk/build/state/getter/Markets";
// import { WebWorkerConnector } from "@augurproject/sdk/build/connector/ww-connector";
// import { SubscriptionEventNames } from "@augurproject/sdk/build/constants";

// let connector: WebWorkerConnector;
// let provider: EthersProvider;
// let john: TestContractAPI;
// let addresses: any;
//

//

// jest.mock("@augurproject/sdk/build/state/Sync.worker", () => {
//   return {
//     __esModule: true,
//     default: () => ({
//       onMessage: (event: MessageEvent) => { },
//       terminate: () => { },
//       postMessage: (message: any) => { },
//     }),
//   };
// });

// jest.mock("@augurproject/sdk/build/state/index", () => {
//   return {
//     __esModule: true,
//   };
// });

// beforeAll(async () => {
//   connector = new WebWorkerConnector();

//   const contractData = await deployContracts(ACCOUNTS, compilerOutput);
//   provider = contractData.provider;
//   addresses = contractData.addresses;

//   john = await TestContractAPI.userWrapper(ACCOUNTS, 0, provider, addresses);
//   db = mock.makeDB(john.augur, ACCOUNTS);

//   await john.approveCentralAuthority();
// }, 120000);

test('WebWorkerConnector :: Should route correctly and handle events', async done => {
  // const universe = john.augur.contracts.universe;
  // const endTime = (await john.getTimestamp()).plus(SECONDS_IN_A_DAY);
  // const lowFeePerCashInAttoCash = new BigNumber(10).pow(18).div(20); // 5% creator fee
  // const affiliateFeeDivisor = new BigNumber(0);
  // const designatedReporter = john.account;

  // const yesNoMarket1 = await john.createYesNoMarket(
  //   universe,
  //   endTime,
  //   lowFeePerCashInAttoCash,
  //   affiliateFeeDivisor,
  //   designatedReporter,
  //   "{\"categories\": [\"yesNo category 1\"], \"description\": \"yesNo description 1\", \"longDescription\": \"yesNo longDescription 1\", \"tags\": [\"yesNo tag1-1\", \"yesNo tag1-2\", \"yesNo tag1-3\"]}",
  // );

  // await connector.connect("");

  // await connector.on(SubscriptionEventNames.NewBlock, async (...args: Array<any>): Promise<void> => {
  //   expect(args).toEqual([{
  //     highestAvailableBlockNumber: 88,
  //     lastSyncedBlockNumber: 88,
  //     blocksBehindCurrent: 0,
  //     percentSynced: "0.0000",
  //   }]);

  //   await (await db).sync(john.augur, mock.constants.chunkSize, 0);
  //   const getMarkets = connector.bindTo(Markets.getMarkets);
  //   const marketList = await getMarkets({
  //     universe: john.augur.contracts.universe.address,
  //   });
  //   expect(marketList.markets).toEqual([yesNoMarket1.address]);

  //   await connector.off(SubscriptionEventNames.NewBlock);

  //   expect(connector.subscriptions).toEqual({});
  //   connector.disconnect();
  //   done();
  // });

  // // process subscription
  // connector.messageReceived({
  //   subscribed: SubscriptionEventNames.NewBlock,
  //   subscription: "12345",
  // });

  // // this should invoke the callback ... if not done won't be called
  // connector.messageReceived({
  //   eventName: SubscriptionEventNames.NewBlock,
  //   result: [{
  //     highestAvailableBlockNumber: 88,
  //     lastSyncedBlockNumber: 88,
  //     blocksBehindCurrent: 0,
  //     percentSynced: "0.0000",
  //   }],
  // });
  done();
});
