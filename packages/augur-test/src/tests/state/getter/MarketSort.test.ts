import { makeDbMock, makeProvider } from "../../../libs";
import { ContractAPI, ACCOUNTS, loadSeedFile, defaultSeedPath } from "@augurproject/tools";
import { DB } from '@augurproject/sdk/build/state/db/DB';
import { BigNumber } from 'bignumber.js';
import { stringTo32ByteHex } from '../../../libs/Utils';

const mock = makeDbMock();

describe('State API :: Market Sorts', () => {
  let db: Promise<DB>;
  let john: ContractAPI;

  beforeAll(async () => {
    const seed = await loadSeedFile(defaultSeedPath);
    const provider = await makeProvider(seed, ACCOUNTS);

    john = await ContractAPI.userWrapper(ACCOUNTS[0], provider, seed.addresses);
    db = mock.makeDB(john.augur, ACCOUNTS);
  });

  test(':invalidFilter', async () => {
    await john.approveCentralAuthority();

    // Create a market
    const market = await john.createReasonableMarket([stringTo32ByteHex('A'), stringTo32ByteHex('B')]);

    // With no orders on the book the invalidFilter will be false
    await (await db).sync(john.augur, mock.constants.chunkSize, 0);
    let marketData = await (await db).Markets.get(market.address);
    await expect(marketData.invalidFilter).toEqual(0);

    // Place a bid order on Invalid
    let bid = new BigNumber(0);
    let outcome = new BigNumber(0);
    let numShares = new BigNumber(1);
    let price = new BigNumber(1);

    await john.simplePlaceOrder(market.address, bid, numShares, price, outcome);

    await (await db).sync(john.augur, mock.constants.chunkSize, 0);
    marketData = await (await db).Markets.get(market.address);

    // The Invalid filter is still not hit because the bid would be unprofitable to take if the market were valid, so no one would take it even if the market was Valid
    await expect(marketData.invalidFilter).toEqual(0);

    // Bid something better
    numShares = new BigNumber(10**18);
    price = new BigNumber(50);
    await john.simplePlaceOrder(market.address, bid, numShares, price, outcome);

    await (await db).sync(john.augur, mock.constants.chunkSize, 0);
    marketData = await (await db).Markets.get(market.address);

    // The Invalid filter is now hit because this Bid would be profitable for a filler assuming the market were actually Valid
    await expect(marketData.invalidFilter).toEqual(1);

  });
  test(': horizontal liquidity', async () => {
    await john.approveCentralAuthority();

    // Create a market
    const market = await john.createReasonableMarket([stringTo32ByteHex('A'), stringTo32ByteHex('B')]);
    const outcomeA = new BigNumber(1);

    // With no orders on the book the liquidity scores won't exist
    await (await db).sync(john.augur, mock.constants.chunkSize, 0);
    let marketData = await (await db).Markets.get(market.address);
    await expect(marketData.liquidity).toEqual({
      "0": "000000000000000000000000000000",
      "10": "000000000000000000000000000000",
      "100": "000000000000000000000000000000",
      "15": "000000000000000000000000000000",
      "20": "000000000000000000000000000000"
    });

    // Place a Bid on A and an Ask on A
    const bid = new BigNumber(0);
    const ask = new BigNumber(1);
    let numShares = new BigNumber(10**18);
    let price = new BigNumber(51);

    await john.simplePlaceOrder(market.address, bid, numShares, price, outcomeA);

    price = new BigNumber(49);

    await john.simplePlaceOrder(market.address, ask, numShares, price, outcomeA);

    await (await db).sync(john.augur, mock.constants.chunkSize, 0);
    marketData = await (await db).Markets.get(market.address);

    await expect(marketData.liquidity[10]).toEqual("000000000102000000000000000000");

  });

  test(':vertical liquidity', async () => {
    await john.approveCentralAuthority();

    // Create a market
    const market = await john.createReasonableMarket([stringTo32ByteHex('A'), stringTo32ByteHex('B'), stringTo32ByteHex('C')]);
    const outcomeA = new BigNumber(1);
    const outcomeB = new BigNumber(2);
    const outcomeC = new BigNumber(3);

    // Place a an Ask on A. This won't rank for liquidity
    const ask = new BigNumber(1);
    let numShares = new BigNumber(10 * 10**18);
    let askPrice = new BigNumber(51);

    await john.simplePlaceOrder(market.address, ask, numShares, askPrice, outcomeA);

    await (await db).sync(john.augur, mock.constants.chunkSize, 0);
    let marketData = await (await db).Markets.get(market.address);

    await expect(marketData.liquidity[10]).toEqual("000000000000000000000000000000");

    // Set up vertical liquidity and confirm it ranks
    await john.simplePlaceOrder(market.address, ask, numShares, askPrice, outcomeB);
    await john.simplePlaceOrder(market.address, ask, numShares, askPrice, outcomeC);

    await (await db).sync(john.augur, mock.constants.chunkSize, 0);
    marketData = await (await db).Markets.get(market.address);

    await expect(marketData.liquidity[10]).toEqual("000000001470000000000000000000");

  });
});
