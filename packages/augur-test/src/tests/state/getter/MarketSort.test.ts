import { makeDbMock, makeProvider, seedPath } from "../../../libs";
import { ContractAPI, loadSeed, ACCOUNTS } from "@augurproject/tools";
import { DB } from '@augurproject/sdk/build/state/db/DB';
import { BigNumber } from 'bignumber.js';
import { stringTo32ByteHex } from '../../../libs/Utils';

const mock = makeDbMock();

describe('State API :: Invalid Filter', () => {
  let db: Promise<DB>;
  let john: ContractAPI;

  beforeAll(async () => {
    const { addresses } = loadSeed(seedPath);
    const provider = await makeProvider(ACCOUNTS);

    john = await ContractAPI.userWrapper(ACCOUNTS[0], provider, addresses);
    db = mock.makeDB(john.augur, ACCOUNTS);
  }, 120000);

  test(':getTradingHistory', async () => {
    await john.approveCentralAuthority();

    // Create a market
    const market = await john.createReasonableMarket([stringTo32ByteHex('A'), stringTo32ByteHex('B')]);

    // With no orders on the book the invalidFilter will be undefined
    await (await db).sync(john.augur, mock.constants.chunkSize, 0);
    let marketData = await (await db).findMarkets({selector: { market: market.address }});
    await expect(marketData[0].invalidFilter).toEqual(undefined);

    // Place a bid order on Invalid
    let bid = new BigNumber(0);
    let outcome = new BigNumber(0);
    let numShares = new BigNumber(1);
    let price = new BigNumber(1);

    await john.simplePlaceOrder(market.address, bid, numShares, price, outcome);

    await (await db).sync(john.augur, mock.constants.chunkSize, 0);
    marketData = await (await db).findMarkets({selector: { market: market.address }});

    // The Invalid filter is still not hit because the bid would be unprofitable to take if the market were valid, so no one would take it even if the market was Valid
    await expect(marketData[0].invalidFilter).toEqual(false);

    // Bid something better
    numShares = new BigNumber(10**18);
    price = new BigNumber(50);
    await john.simplePlaceOrder(market.address, bid, numShares, price, outcome);

    await (await db).sync(john.augur, mock.constants.chunkSize, 0);
    marketData = await (await db).findMarkets({selector: { market: market.address }});

    // The Invalid filter is now hit because this Bid would be profitable for a filler assuming the market were actually Valid
    await expect(marketData[0].invalidFilter).toEqual(true);

  }, 60000);

});
