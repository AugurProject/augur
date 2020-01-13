import { makeDbMock, makeProvider } from "../../../libs";
import { ContractAPI, ACCOUNTS, loadSeedFile, defaultSeedPath } from "@augurproject/tools";
import { DB } from '@augurproject/sdk/build/state/db/DB';
import { API } from '@augurproject/sdk/build/state/getter/API';
import { BigNumber } from 'bignumber.js';
import { stringTo32ByteHex } from '@augurproject/tools/build/libs/Utils';
import {
    MarketLiquidityRanking,
} from '@augurproject/sdk/build/state/getter/Liquidity';

const mock = makeDbMock();

describe('State API :: Liquidity', () => {
  let db: Promise<DB>;
  let john: ContractAPI;
  let api: API;

  beforeAll(async () => {
    const seed = await loadSeedFile(defaultSeedPath);
    const provider = await makeProvider(seed, ACCOUNTS);

    john = await ContractAPI.userWrapper(ACCOUNTS[0], provider, seed.addresses);
    db = mock.makeDB(john.augur, ACCOUNTS);
    api = new API(john.augur, db);
  });

  test(': Liquidity Ranking', async () => {
    await john.approveCentralAuthority();

    let liquidityRankingParams = {
        orderBook: {
            1: {
                bids: [],
                asks: []
            }
        },
        numTicks: "100",
        marketType: 0,
        reportingFeeDivisor: "0",
        feePerCashInAttoCash: "0",
        numOutcomes: 3,
        spread: 10,
    }

    // Request with no markets and no orders
    let liquidityRanking: MarketLiquidityRanking = await api.route('getMarketLiquidityRanking', liquidityRankingParams);
    await expect(liquidityRanking.marketRank).toEqual(0);
    await expect(liquidityRanking.totalMarkets).toEqual(1);
    await expect(liquidityRanking.hasLiquidity).toEqual(false);

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
        "20": "000000000000000000000000000000",
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

    // Request with 1 market and no liquidity. Doesnt Rank. 2 Markets total

    liquidityRanking = await api.route('getMarketLiquidityRanking', liquidityRankingParams);
    await expect(liquidityRanking.marketRank).toEqual(0);
    await expect(liquidityRanking.totalMarkets).toEqual(2);
    await expect(liquidityRanking.hasLiquidity).toEqual(false);

    // Place lesser liquidity. Ranks second place

    liquidityRankingParams.orderBook[1] = {
        bids: [{
            price: "51",
            amount: new BigNumber(10**18 / 2).toFixed(),
        }],
        asks: [{
            price: "49",
            amount: new BigNumber(10**18 / 2).toFixed(),
        }]
    }

    liquidityRanking = await api.route('getMarketLiquidityRanking', liquidityRankingParams);
    await expect(liquidityRanking.marketRank).toEqual(2);
    await expect(liquidityRanking.totalMarkets).toEqual(2);
    await expect(liquidityRanking.hasLiquidity).toEqual(true);

    // Place higher liquidity. Ranks first place

    liquidityRankingParams.orderBook[1] = {
        bids: [{
            price: "51",
            amount: new BigNumber(10**18 * 10).toFixed(),
        }],
        asks: [{
            price: "49",
            amount: new BigNumber(10**18 * 10).toFixed(),
        }]
    }

    liquidityRanking = await api.route('getMarketLiquidityRanking', liquidityRankingParams);
    await expect(liquidityRanking.marketRank).toEqual(1);
    await expect(liquidityRanking.totalMarkets).toEqual(2);
    await expect(liquidityRanking.hasLiquidity).toEqual(true);

  });

});
