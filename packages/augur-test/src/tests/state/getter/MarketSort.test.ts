import { makeDbMock, makeProvider, MockGnosisRelayAPI } from '../../../libs';
import {
  ContractAPI,
  ACCOUNTS,
  loadSeedFile,
  defaultSeedPath,
} from '@augurproject/tools';
import { DB } from '@augurproject/sdk/build/state/db/DB';
import { BigNumber } from 'bignumber.js';
import { stringTo32ByteHex } from '../../../libs/Utils';
import { WSClient } from '@0x/mesh-rpc-client';
import * as _ from 'lodash';
import { EthersProvider } from '@augurproject/ethersjs-provider';
import { ContractAddresses } from '@augurproject/artifacts';
import { Connectors, BrowserMesh } from '@augurproject/sdk';
import { MockMeshServer, stopServer } from '../../../libs/MockMeshServer';
import { MockBrowserMesh } from '../../../libs/MockBrowserMesh';
import { API } from '@augurproject/sdk/build/state/getter/API';
import { formatBytes32String } from 'ethers/utils';
import { sleep } from '@augurproject/core/build/libraries/HelperFunctions';

describe('State API :: Market Sorts', () => {
  let john: ContractAPI;
  let johnDB: Promise<DB>;
  let johnAPI: API;

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
      await john.approveCentralAuthority();
    });

    test(':horizontal/vertical liquidity', async () => {
      const outcomeA = 1;
      const outcomeB = 2;
      const outcomeC = 3;
      const outcomeInvalid = 0;
      const bid = 0;
      const ask = 1;
      const expirationTimeInSeconds = new BigNumber(Math.round(+new Date() / 1000).valueOf()).plus(10000);
      const nowPlus50Seconds = new BigNumber(Math.round(+new Date() / 1000).valueOf()).plus(50);

      // Test horizontal liquidity

      // Create a market
      const market = await john.createReasonableMarket([
        stringTo32ByteHex('A'),
        stringTo32ByteHex('B'),
      ]);

      // With no orders on the book the liquidity scores won't exist
      await (await johnDB).sync(john.augur, mock.constants.chunkSize, 0);
      let marketData = await (await johnDB).Markets.get(market.address);
      await expect(marketData.liquidity).toEqual({
        '10': '000000000000000000000000000000',
        '100': '000000000000000000000000000000',
        '15': '000000000000000000000000000000',
        '20': '000000000000000000000000000000',
      });

      // Place a Bid on A and an Ask on A
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
        displayPrice: new BigNumber(0.81),
        displayShares: new BigNumber(100000),
        expirationTime: expirationTimeInSeconds,
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
        displayPrice: new BigNumber(0.78),
        displayShares: new BigNumber(100000),
        expirationTime: expirationTimeInSeconds,
      });
      await (await johnDB).sync(john.augur, mock.constants.chunkSize, 0);
      marketData = await (await johnDB).Markets.get(market.address);

      await expect(marketData.liquidity[10]).toEqual(
        '000000000485000000000000000000'
      );

      // Test vertical liquidity

      // Create a market
      const market2 = await john.createReasonableMarket([
        stringTo32ByteHex('A'),
        stringTo32ByteHex('B'),
        stringTo32ByteHex('C'),
      ]);

      await (await johnDB).sync(john.augur, mock.constants.chunkSize, 0);

      // Place a an Ask on A. This won't rank for liquidity
      await john.placeZeroXOrder({
        direction: ask,
        market: market2.address,
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
        expirationTime: expirationTimeInSeconds,
      });

      // await john.simplePlaceOrder(market.address, ask, numShares, askPrice, outcomeA);
      await (await johnDB).sync(john.augur, mock.constants.chunkSize, 0);
      marketData = await (await johnDB).Markets.get(market2.address);
      await expect(marketData.liquidity[10]).toEqual(
        '000000000000000000000000000000'
      );

      // Set up vertical liquidity and confirm it ranks
      await john.placeZeroXOrder({
        direction: ask,
        market: market2.address,
        numTicks: await market2.getNumTicks_(),
        numOutcomes: 3,
        outcome: outcomeB,
        tradeGroupId: '42',
        fingerprint: formatBytes32String('11'),
        doNotCreateOrders: false,
        displayMinPrice: new BigNumber(0),
        displayMaxPrice: new BigNumber(1),
        displayAmount: new BigNumber(500),
        displayPrice: new BigNumber(0.51),
        displayShares: new BigNumber(100000),
        expirationTime: expirationTimeInSeconds,
      });

      await john.placeZeroXOrder({
        direction: ask,
        market: market2.address,
        numTicks: await market2.getNumTicks_(),
        numOutcomes: 3,
        outcome: outcomeC,
        tradeGroupId: '42',
        fingerprint: formatBytes32String('11'),
        doNotCreateOrders: false,
        displayMinPrice: new BigNumber(0),
        displayMaxPrice: new BigNumber(1),
        displayAmount: new BigNumber(500),
        displayPrice: new BigNumber(0.51),
        displayShares: new BigNumber(100000),
        expirationTime: expirationTimeInSeconds,
      });

      await sleep(300);

      await (await johnDB).sync(john.augur, mock.constants.chunkSize, 0);
      marketData = await (await johnDB).Markets.get(market2.address);
      await expect(marketData.liquidity[10]).toEqual(
        '000000000735000000000000000000'
      );

      // Test Invalid Filter
      // Create a market
      const market3 = await john.createReasonableYesNoMarket();

      // With no orders on the book the invalidFilter will be false
      await (await johnDB).sync(john.augur, mock.constants.chunkSize, 0);
      marketData = await (await johnDB).Markets.get(market3.address);
      await expect(marketData.invalidFilter).toEqual(0);

      // Place a bid order on Invalid
      await john.placeBasicYesNoZeroXTrade(
        bid,
        market3.address,
        outcomeInvalid,
        new BigNumber(20),
        new BigNumber(0.79),
        new BigNumber(0),
        expirationTimeInSeconds
      );


      // The Invalid filter is still not hit because the bid would be unprofitable to take if the market were valid, so no one would take it even if the market was Valid
      await (await johnDB).sync(john.augur, mock.constants.chunkSize, 0);
      marketData = await (await johnDB).Markets.get(market3.address);
      await expect(marketData.invalidFilter).toEqual(0);

      // Bid something better
      await john.placeBasicYesNoZeroXTrade(
        bid,
        market3.address,
        outcomeInvalid,
        new BigNumber(2000),
        new BigNumber(0.79),
        new BigNumber(0),
        expirationTimeInSeconds
      );

      // The Invalid filter is now hit because this Bid would be profitable for a filler assuming the market were actually Valid
      await (await johnDB).sync(john.augur, mock.constants.chunkSize, 0);
      marketData = await (await johnDB).Markets.get(market3.address);
      await expect(marketData.invalidFilter).toEqual(1);

      // Don't include orders in liquidity calculations that expiry within 70 seconds
      const market4 = await john.createReasonableMarket([
        stringTo32ByteHex('A'),
        stringTo32ByteHex('B'),
      ]);

      // Add ask
      await john.placeBasicYesNoZeroXTrade(
        ask,
        market4.address,
        outcomeA,
        new BigNumber(500),
        new BigNumber(0.83),
        new BigNumber(0),
        expirationTimeInSeconds
      );

      // Add bid and Iinclude an expiry that will fall outside the 70seconds limit for liquidity calculations
      await john.placeBasicYesNoZeroXTrade(
        bid,
        market4.address,
        outcomeA,
        new BigNumber(500),
        new BigNumber(0.82),
        new BigNumber(0),
        nowPlus50Seconds,
      );

      // Should ignore above bid and calculate zero liquidity
      await (await johnDB).sync(john.augur, mock.constants.chunkSize, 0);
      marketData = await (await johnDB).Markets.get(market4.address);
      await expect(marketData.liquidity).toEqual({
        '10': '000000000000000000000000000000',
        '100': '000000000000000000000000000000',
        '15': '000000000000000000000000000000',
        '20': '000000000000000000000000000000',
      });


      // Test Recently Depleted Liquidity + Invalid
      await john.placeBasicYesNoZeroXTrade(
        ask,
        market4.address,
        outcomeB,
        new BigNumber(500),
        new BigNumber(0.83),
        new BigNumber(0),
        expirationTimeInSeconds
      );

      await john.placeBasicYesNoZeroXTrade(
        bid,
        market4.address,
        outcomeB,
        new BigNumber(500),
        new BigNumber(0.82),
        new BigNumber(0),
        expirationTimeInSeconds
      );

      // Should pass spread check and not be invalid
      await (await johnDB).sync(john.augur, mock.constants.chunkSize, 0);
      marketData = await (await johnDB).Markets.get(market4.address);
      await expect(marketData.liquidity).toEqual({
        '10': '000000000580000000000000000000',
        '100': '000000000580000000000000000000',
        '15': '000000000580000000000000000000',
        '20': '000000000580000000000000000000',
      });
      await expect(marketData.invalidFilter).toEqual(0);


      // Add an invalid bid to throw the market into an Invalid state
      await john.placeBasicYesNoZeroXTrade(
        bid,
        market4.address,
        outcomeInvalid,
        new BigNumber(2000),
        new BigNumber(0.78),
        new BigNumber(0),
        expirationTimeInSeconds
      );

      // Invalid that had spread should be set as hasRecentlyDepletedLiquidity
      await (await johnDB).sync(john.augur, mock.constants.chunkSize, 0);
      marketData = await (await johnDB).Markets.get(market4.address);
      await expect(marketData.invalidFilter).toEqual(1);
      await expect(marketData.hasRecentlyDepletedLiquidity).toEqual(true);
    });
  });
});
