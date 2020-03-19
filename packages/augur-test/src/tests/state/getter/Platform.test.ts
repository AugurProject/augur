import { ContractInterfaces } from '@augurproject/core';
import {
  ACCOUNTS,
  ContractAPI,
  defaultSeedPath,
  fork,
  loadSeedFile,
} from '@augurproject/tools';
import { TestContractAPI } from '@augurproject/tools';
import { stringTo32ByteHex } from '@augurproject/tools/build/libs/Utils';
import { BigNumber } from 'bignumber.js';
import { makeProvider } from '../../../libs';

describe('State API :: get-platform-activity-stats :: ', () => {
  let john: TestContractAPI;
  let mary: TestContractAPI;

  beforeAll(async () => {
    const seed = await loadSeedFile(defaultSeedPath);
    const provider = await makeProvider(seed, ACCOUNTS);
    const config = provider.getConfig();

    john = await TestContractAPI.userWrapper(
      ACCOUNTS[0],
      provider,
      config
    );
    mary = await TestContractAPI.userWrapper(
      ACCOUNTS[1],
      provider,
      config
    );

    await john.approveCentralAuthority();
    await mary.approveCentralAuthority();
  });

  test('getPlatformActivityStats', async () => {
    // Create markets with multiple users
    const universe = john.augur.contracts.universe;
    const yesNoMarket = await john.createReasonableYesNoMarket();
    const categoricalMarket = await john.createReasonableMarket([
      stringTo32ByteHex('A'),
      stringTo32ByteHex('B'),
      stringTo32ByteHex('C'),
    ]);
    const scalarMarket = await john.createReasonableScalarMarket();

    const bid = new BigNumber(0);
    const outcome2 = new BigNumber(2);
    const numShares = new BigNumber(10).pow(12);
    const price = new BigNumber(22);
    const cost = numShares.times(78).div(10);

    await john.faucet(new BigNumber(1e18));
    await mary.faucet(new BigNumber(1e18));
    mary.repFaucet(new BigNumber(1e18).multipliedBy(1000000));
    john.repFaucet(new BigNumber(1e18).multipliedBy(1000000));

    // Trade
    await placeOrders(john, yesNoMarket, numShares, price);
    await placeOrders(john, categoricalMarket, numShares, price);
    await placeOrders(john, scalarMarket, numShares, price);
    await fillOrders(mary, yesNoMarket, numShares, cost);
    await fillOrders(mary, categoricalMarket, numShares, cost);
    await fillOrders(mary, scalarMarket, numShares, cost);

    // Cancel an order
    await john.cancelNativeOrder(
      await john.getBestOrderId(bid, scalarMarket.address, outcome2)
    );

    // Purchase & sell complete sets
    const numberOfCompleteSets = new BigNumber(1);
    await john.buyCompleteSets(yesNoMarket, numberOfCompleteSets);
    await john.sellCompleteSets(yesNoMarket, numberOfCompleteSets);

    await john.sync();
    const markets = await john.api.route('getMarketsInfo', {
      marketIds: [yesNoMarket.address],
    });
    await fork(john, markets[0]);
    await john.sync();

    const stats = await john.api.route('getPlatformActivityStats', {
      universe: universe.address,
    });

    expect(stats).toMatchObject({
      activeUsers: 2,
      disputedMarkets: 1,
      marketsCreated: 3,
      numberOfTrades: 9,
    });
    expect(stats.amountStaked.toFixed()).toEqual('975612413119039911495168');
    expect(stats.openInterest.toFixed()).toEqual('2040000000000000');
    expect(stats.volume.toFixed()).toEqual('0.006093');
  });
});

async function placeOrders(
  user: ContractAPI,
  market: ContractInterfaces.Market,
  numShares: BigNumber,
  price: BigNumber
): Promise<void> {
  const bid = new BigNumber(0);
  const outcomes = [0, 1, 2].map(n => new BigNumber(n));

  for (const outcome of outcomes) {
    await user.placeOrder(
      market.address,
      bid,
      numShares,
      price,
      outcome,
      stringTo32ByteHex(''),
      stringTo32ByteHex(''),
      stringTo32ByteHex('42')
    );
  }
}

async function fillOrders(
  user: ContractAPI,
  market: ContractInterfaces.Market,
  numShares: BigNumber,
  cost: BigNumber
): Promise<void> {
  const bid = new BigNumber(0);
  const outcomes = [0, 1, 2].map(n => new BigNumber(n));
  const variation = [2, 3, 3];

  for (let i = 0; i < outcomes.length; i++) {
    const outcome = outcomes[i];
    const vary = variation[i];
    const tradeGroupId = Math.floor(Math.random() * 10 ** 12).toFixed();
    const sharesMultiply = vary;
    await user.fillOrder(
      await user.getBestOrderId(bid, market.address, outcome),
      numShares.div(10).times(sharesMultiply),
      tradeGroupId,
      cost
    );
  }
}

async function dispute(
  user: ContractAPI,
  market: ContractInterfaces.Market
): Promise<void> {
  const noPayoutSet = [new BigNumber(0), new BigNumber(100), new BigNumber(0)];
  const yesPayoutSet = [new BigNumber(0), new BigNumber(0), new BigNumber(100)];
  const SOME_REP = new BigNumber(1e18).times(6e7);

  for (let i = 0; i < 20; i++) {
    const disputeWindow = user.augur.contracts.disputeWindowFromAddress(
      await market.getDisputeWindow_()
    );
    // Enter the dispute window.
    const disputeWindowStartTime = await disputeWindow.getStartTime_();
    await user.setTimestamp(disputeWindowStartTime.plus(1));

    // Contribute aka dispute. Opposing sides to keep raising the stakes.
    const numerators = i % 2 === 0 ? yesPayoutSet : noPayoutSet;
    await user.contribute(market, numerators, SOME_REP);
  }
  //
  //
  // for (let disputeRound = 1; disputeRound <= 3; disputeRound++) {
  //   if (disputeRound % 2 !== 0) {
  //     await user.contribute(
  //       market,
  //       yesPayoutSet,
  //       SOME_REP
  //     );
  //     const remainingToFill = await user.getRemainingToFill(
  //       market,
  //       yesPayoutSet
  //     );
  //     await user.contribute(market, yesPayoutSet, remainingToFill);
  //   } else {
  //     await user.contribute(
  //       market,
  //       noPayoutSet,
  //       SOME_REP
  //     );
  //     const remainingToFill = await user.getRemainingToFill(
  //       market,
  //       noPayoutSet
  //     );
  //     await user.contribute(market, noPayoutSet, remainingToFill);
  //   }
  // }
}
