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
        displayPrice: new BigNumber(0.81),
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
        displayPrice: new BigNumber(0.78),
        displayShares: new BigNumber(100000),
        expirationTime,
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

      const outcomeB = 2;
      const outcomeC = 3;

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
        expirationTime,
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
        expirationTime,
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
        expirationTime,
      });

      await sleep(300);

      await (await johnDB).sync(john.augur, mock.constants.chunkSize, 0);
      marketData = await (await johnDB).Markets.get(market2.address);
      await expect(marketData.liquidity[10]).toEqual(
        '000000000735000000000000000000'
      );

      // Test Invalid Filter
      // Create a market
      const market3 = await john.createReasonableMarket([
        stringTo32ByteHex('A'),
        stringTo32ByteHex('B'),
      ]);

      // With no orders on the book the invalidFilter will be false
      await (await johnDB).sync(john.augur, mock.constants.chunkSize, 0);
      marketData = await (await johnDB).Markets.get(market3.address);
      await expect(marketData.invalidFilter).toEqual(0);

      // Place a bid order on Invalid
      const outcomeInvalid = 0;
      await john.placeBasicYesNoZeroXTrade(
        bid,
        market3.address,
        outcomeInvalid,
        new BigNumber(10),
        new BigNumber(0.2),
        new BigNumber(0),
        new BigNumber(100000)
      );

      await (await johnDB).sync(john.augur, mock.constants.chunkSize, 0);
      marketData = await (await johnDB).Markets.get(market3.address);

      // The Invalid filter is still not hit because the bid would be unprofitable to take if the market were valid, so no one would take it even if the market was Valid
      await expect(marketData.invalidFilter).toEqual(0);

      // Bid something better
      await john.placeBasicYesNoZeroXTrade(
        bid,
        market3.address,
        outcomeInvalid,
        new BigNumber(2000),
        new BigNumber(0.78),
        new BigNumber(0),
        new BigNumber(100000)
      );

      await (await johnDB).sync(john.augur, mock.constants.chunkSize, 0);
      marketData = await (await johnDB).Markets.get(market3.address);

      // The Invalid filter is now hit because this Bid would be profitable for a filler assuming the market were actually Valid
      await expect(marketData.invalidFilter).toEqual(1);
    });
  });
});
