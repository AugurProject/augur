import { WSClient } from '@0x/mesh-rpc-client';
import { ContractAddresses } from '@augurproject/artifacts';
import { EthersProvider } from '@augurproject/ethersjs-provider';
import { BrowserMesh, Connectors } from '@augurproject/sdk';
import { DB } from '@augurproject/sdk/build/state/db/DB';
import { API } from '@augurproject/sdk/build/state/getter/API';
import { MarketLiquidityRanking } from '@augurproject/sdk/build/state/getter/Liquidity';
import { BulkSyncStrategy } from '@augurproject/sdk/build/state/sync/BulkSyncStrategy';
import {
  ACCOUNTS,
  ContractAPI,
  defaultSeedPath,
  loadSeedFile,
} from '@augurproject/tools';
import { stringTo32ByteHex } from '@augurproject/tools/build/libs/Utils';
import { BigNumber } from 'bignumber.js';
import { formatBytes32String } from 'ethers/utils';
import { makeDbMock, makeProvider, MockGnosisRelayAPI } from '../../../libs';
import { MockBrowserMesh } from '../../../libs/MockBrowserMesh';
import { MockMeshServer, stopServer } from '../../../libs/MockMeshServer';

const mock = makeDbMock();

describe('State API :: Liquidity', () => {
  let john: ContractAPI;
  let johnDB: Promise<DB>;
  let johnAPI: API;
  let bulkSyncStrategy: BulkSyncStrategy;

  let provider: EthersProvider;
  let addresses: ContractAddresses;

  let meshBrowser: BrowserMesh;
  let meshClient: WSClient;
  const mock = makeDbMock();

  beforeAll(async () => {
    const { port } = await MockMeshServer.create();
    meshClient = new WSClient(`ws://localhost:${port}`);
    meshBrowser = new MockBrowserMesh(meshClient);

    const seed = await loadSeedFile(defaultSeedPath);
    addresses = seed.addresses;
    provider = await makeProvider(seed, ACCOUNTS);
  });

  afterAll(() => {
    meshClient.destroy();
    stopServer();
  });
  describe('with gnosis', () => {
    beforeAll(async () => {
      const johnConnector = new Connectors.DirectConnector();
      const johnGnosis = new MockGnosisRelayAPI();
      john = await ContractAPI.userWrapper(
        ACCOUNTS[0],
        provider,
        addresses,
        johnConnector,
        johnGnosis,
        meshClient,
        meshBrowser
      );
      expect(john).toBeDefined();

      johnGnosis.initialize(john);
      johnDB = mock.makeDB(john.augur, ACCOUNTS);
      johnConnector.initialize(john.augur, await johnDB);
      johnAPI = new API(john.augur, johnDB);

      bulkSyncStrategy = new BulkSyncStrategy(
        provider.getLogs,
        (await johnDB).logFilters.buildFilter,
        (await johnDB).logFilters.onLogsAdded,
        john.augur.contractEvents.parseLogs,
      );


      await john.approveCentralAuthority();
    });
    test(': Liquidity Ranking', async () => {
      let liquidityRankingParams = {
        orderBook: {
          1: {
            bids: [],
            asks: [],
          },
        },
        numTicks: '100',
        marketType: 0,
        reportingFeeDivisor: '0',
        feePerCashInAttoCash: '0',
        numOutcomes: 3,
        spread: 10,
      };

      // Request with no markets and no orders
      let liquidityRanking: MarketLiquidityRanking = await johnAPI.route(
        'getMarketLiquidityRanking',
        liquidityRankingParams
      );
      await expect(liquidityRanking.marketRank).toEqual(0);
      await expect(liquidityRanking.totalMarkets).toEqual(1);
      await expect(liquidityRanking.hasLiquidity).toEqual(false);

      // Create a market
      const market = await john.createReasonableMarket([
        stringTo32ByteHex('A'),
        stringTo32ByteHex('B'),
      ]);

      // With no orders on the book the liquidity scores won't exist
      await bulkSyncStrategy.start(0, await john.provider.getBlockNumber());
      let marketData = await (await johnDB).Markets.get(market.address);

      await expect(marketData.liquidity).toEqual({
        '10': '000000000000000000000000000000',
        '100': '000000000000000000000000000000',
        '15': '000000000000000000000000000000',
        '20': '000000000000000000000000000000',
      });

      // Place a Bid on A and an Ask on A
      const outcomeA = 1;
      const bid = 0;
      const ask = 1;
      const expirationTime = new BigNumber(new Date().valueOf()).plus(10000);

      await john.placeZeroXOrder({
        direction: ask,
        market: market.address,
        numTicks: await market.getNumTicks_(),
        numOutcomes: 3,
        outcome: outcomeA,
        tradeGroupId: '42',
        fingerprint: formatBytes32String('11'),
        doNotCreateOrders: false,
        displayMinPrice: new BigNumber(0),
        displayMaxPrice: new BigNumber(1),
        displayAmount: new BigNumber(500),
        displayPrice: new BigNumber(0.51),
        displayShares: new BigNumber(100000),
        expirationTime,
      });

      await john.placeZeroXOrder({
        direction: bid,
        market: market.address,
        numTicks: await market.getNumTicks_(),
        numOutcomes: 3,
        outcome: outcomeA,
        tradeGroupId: '42',
        fingerprint: formatBytes32String('11'),
        doNotCreateOrders: false,
        displayMinPrice: new BigNumber(0),
        displayMaxPrice: new BigNumber(1),
        displayAmount: new BigNumber(500),
        displayPrice: new BigNumber(0.49),
        displayShares: new BigNumber(100000),
        expirationTime,
      });

      await bulkSyncStrategy.start(0, await john.provider.getBlockNumber());;
      marketData = await (await johnDB).Markets.get(market.address);

      await expect(marketData.liquidity[10]).toEqual(
        '000000000490000000000000000000'
      );

      // Request with 1 market and no liquidity. Doesnt Rank. 2 Markets total

      liquidityRanking = await johnAPI.route(
        'getMarketLiquidityRanking',
        liquidityRankingParams
      );
      await expect(liquidityRanking.marketRank).toEqual(0);
      await expect(liquidityRanking.totalMarkets).toEqual(2);
      await expect(liquidityRanking.hasLiquidity).toEqual(false);

      // Place lesser liquidity. Ranks second place

      liquidityRankingParams.orderBook[1] = {
        bids: [
          {
            price: '51',
            amount: new BigNumber(10 ** 18 / 2).toFixed(),
          },
        ],
        asks: [
          {
            price: '49',
            amount: new BigNumber(10 ** 18 / 2).toFixed(),
          },
        ],
      };

      liquidityRanking = await johnAPI.route(
        'getMarketLiquidityRanking',
        liquidityRankingParams
      );
      await expect(liquidityRanking.marketRank).toEqual(2);
      await expect(liquidityRanking.totalMarkets).toEqual(2);
      await expect(liquidityRanking.hasLiquidity).toEqual(true);

      // Place higher liquidity. Ranks first place

      liquidityRankingParams.orderBook[1] = {
        bids: [
          {
            price: '51',
            amount: new BigNumber(10 ** 18 * 10).toFixed(),
          },
        ],
        asks: [
          {
            price: '49',
            amount: new BigNumber(10 ** 18 * 10).toFixed(),
          },
        ],
      };

      liquidityRanking = await johnAPI.route(
        'getMarketLiquidityRanking',
        liquidityRankingParams
      );
      await expect(liquidityRanking.marketRank).toEqual(1);
      await expect(liquidityRanking.totalMarkets).toEqual(2);
      await expect(liquidityRanking.hasLiquidity).toEqual(true);
    });
  });
});
