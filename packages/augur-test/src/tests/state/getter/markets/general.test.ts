import { WSClient } from '@0x/mesh-rpc-client';
import { BigNumber } from 'bignumber.js';
import { formatBytes32String } from 'ethers/utils';
import * as _ from 'lodash';
import {
  ContractAPI,
  ACCOUNTS,
  loadSeedFile,
  defaultSeedPath,
} from '@augurproject/tools';
import { EthersProvider } from '@augurproject/ethersjs-provider';
import { ContractAddresses } from '@augurproject/artifacts';
import { DB } from '@augurproject/sdk/build/state/db/DB';
import {
  Connectors,
  BrowserMesh,
  MarketReportingState,
} from '@augurproject/sdk';
import { API } from '@augurproject/sdk/build/state/getter/API';
import {
  sleep,
  stringTo32ByteHex,
} from '@augurproject/core/build/libraries/HelperFunctions';
import { MockMeshServer, stopServer } from '../../../../libs/MockMeshServer';
import { MockBrowserMesh } from '../../../../libs/MockBrowserMesh';
import { makeDbMock, makeProvider, MockGnosisRelayAPI } from '../../../../libs';
import {
  MarketList,
  GetMarketsSortBy,
} from '@augurproject/sdk/build/state/getter/Markets';
import { NULL_ADDRESS } from '../../../../libs/Utils';

describe('State API :: General', () => {
  let john: ContractAPI;
  let johnDB: Promise<DB>;
  let johnAPI: API;

  let mary: ContractAPI;
  let maryDB: Promise<DB>;
  let maryAPI: API;

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

      const maryConnector = new Connectors.DirectConnector();
      const maryGnosis = new MockGnosisRelayAPI();
      mary = await ContractAPI.userWrapper(
        ACCOUNTS[1],
        provider,
        addresses,
        maryConnector,
        maryGnosis,
        meshClient,
        meshBrowser
      );
      maryGnosis.initialize(mary);
      maryDB = mock.makeDB(mary.augur, ACCOUNTS);
      maryConnector.initialize(mary.augur, await maryDB);
      maryAPI = new API(mary.augur, maryDB);
      await mary.approveCentralAuthority();
    });
    test('State API :: Market :: getMarkets', async () => {
      let marketList: MarketList;
      const bid = 0;
      const ask = 1;

      // Create some markets
      const yesNoMarket1 = await john.createReasonableYesNoMarket();

      const categoricalMarket1 = await mary.createReasonableMarket([
        stringTo32ByteHex('A'),
        stringTo32ByteHex('B'),
      ]);

      await (await johnDB).sync(john.augur, mock.constants.chunkSize, 0);
      await (await maryDB).sync(mary.augur, mock.constants.chunkSize, 0);

      // Test invalid universe address
      let errorMessage = '';
      try {
        await johnAPI.route('getMarkets', {
          universe: NULL_ADDRESS,
        });
      } catch (error) {
        errorMessage = error.message;
      }
      expect(errorMessage).toEqual('Unknown universe: ' + NULL_ADDRESS);

      // Test market count
      marketList = await johnAPI.route('getMarkets', {
        universe: addresses.Universe,
        isSortDescending: false,
      });

      expect(marketList.markets.length).toEqual(2);

      // Test creator
      marketList = await johnAPI.route('getMarkets', {
        universe: addresses.Universe,
        creator: ACCOUNTS[0].publicKey,
        isSortDescending: false,
      });

      expect(marketList.markets.length).toEqual(1);

      marketList = await johnAPI.route('getMarkets', {
        universe: addresses.Universe,
        creator: NULL_ADDRESS,
      });
      expect(marketList).toEqual({
        markets: [],
        meta: {
          categories: {},
          filteredOutCount: 2,
          marketCount: 0,
        },
      });

      // Test designatedReporter
      marketList = await johnAPI.route('getMarkets', {
        universe: addresses.Universe,
        designatedReporter: ACCOUNTS[0].publicKey,
      });
      expect(marketList.markets.length).toEqual(1);

      marketList = await johnAPI.route('getMarkets', {
        universe: addresses.Universe,
        designatedReporter: NULL_ADDRESS,
      });
      expect(marketList).toEqual({
        markets: [],
        meta: {
          categories: {},
          filteredOutCount: 2,
          marketCount: 0,
        },
      });

      // Test maxFee
      marketList = await johnAPI.route('getMarkets', {
        universe: addresses.Universe,
        maxFee: '0',
      });
      expect(marketList).toEqual({
        markets: [],
        meta: {
          categories: {},
          filteredOutCount: 2,
          marketCount: 0,
        },
      });

      marketList = await johnAPI.route('getMarkets', {
        universe: addresses.Universe,
        maxFee: '0.1',
      });
      expect(marketList.markets.length).toEqual(2);

      // Test search & categories params
      marketList = await johnAPI.route('getMarkets', {
        universe: addresses.Universe,
        search: 'Categorical',
      });
      expect(marketList.markets.length).toEqual(1);
      expect(marketList.markets[0].id).toEqual(categoricalMarket1.address);


      marketList = await johnAPI.route('getMarkets', {
        universe: addresses.Universe,
        categories: ['flash', 'reasonable', 'yesno'],
      });

      expect(marketList.markets.length).toEqual(1);

      marketList = await johnAPI.route('getMarkets', {
        universe: addresses.Universe,
        search: ACCOUNTS[0].publicKey,
      });
      expect(marketList.markets.length).toEqual(1);
      expect(marketList.markets[0].id).toEqual(yesNoMarket1.address);

      marketList = await johnAPI.route('getMarkets', {
        universe: addresses.Universe,
        search: 'ipsum ipsum',
      });
      expect(marketList.markets.length).toEqual(0);

      marketList = await johnAPI.route('getMarkets', {
        universe: addresses.Universe,
        categories: ['ipsum', 'ipsum', 'ipsum'],
      });
      expect(marketList.markets.length).toEqual(0);

      // Test maxLiquiditySpread
      const yesNoMarket2 = await john.createReasonableYesNoMarket();
      const yesNoMarket3 = await john.createReasonableYesNoMarket();
      await (await johnDB).sync(john.augur, mock.constants.chunkSize, 0);

      const expirationTime = new BigNumber(new Date().valueOf()).plus(10000);

      await john.placeZeroXOrder({
        direction: ask,
        market: yesNoMarket1.address,
        numTicks: await yesNoMarket1.getNumTicks_(),
        numOutcomes: 3,
        outcome: 1,
        tradeGroupId: '42',
        fingerprint: formatBytes32String('11'),
        doNotCreateOrders: false,
        displayMinPrice: new BigNumber(0),
        displayMaxPrice: new BigNumber(1),
        displayAmount: new BigNumber(500),
        displayPrice: new BigNumber(0.75),
        displayShares: new BigNumber(100000),
        expirationTime,
      });

      await john.placeZeroXOrder({
        direction: bid,
        market: yesNoMarket1.address,
        numTicks: await yesNoMarket1.getNumTicks_(),
        numOutcomes: 3,
        outcome: 1,
        tradeGroupId: '42',
        fingerprint: formatBytes32String('11'),
        doNotCreateOrders: false,
        displayMinPrice: new BigNumber(0),
        displayMaxPrice: new BigNumber(1),
        displayAmount: new BigNumber(500),
        displayPrice: new BigNumber(0.55),
        displayShares: new BigNumber(100000),
        expirationTime,
      });

      await john.placeZeroXOrder({
        direction: ask,
        market: yesNoMarket2.address,
        numTicks: await yesNoMarket2.getNumTicks_(),
        numOutcomes: 3,
        outcome: 1,
        tradeGroupId: '42',
        fingerprint: formatBytes32String('11'),
        doNotCreateOrders: false,
        displayMinPrice: new BigNumber(0),
        displayMaxPrice: new BigNumber(1),
        displayAmount: new BigNumber(500),
        displayPrice: new BigNumber(0.75),
        displayShares: new BigNumber(100000),
        expirationTime,
      });

      await john.placeZeroXOrder({
        direction: bid,
        market: yesNoMarket2.address,
        numTicks: await yesNoMarket2.getNumTicks_(),
        numOutcomes: 3,
        outcome: 1,
        tradeGroupId: '42',
        fingerprint: formatBytes32String('11'),
        doNotCreateOrders: false,
        displayMinPrice: new BigNumber(0),
        displayMaxPrice: new BigNumber(1),
        displayAmount: new BigNumber(500),
        displayPrice: new BigNumber(0.6),
        displayShares: new BigNumber(100000),
        expirationTime,
      });

      await john.placeZeroXOrder({
        direction: ask,
        market: yesNoMarket3.address,
        numTicks: await yesNoMarket3.getNumTicks_(),
        numOutcomes: 3,
        outcome: 1,
        tradeGroupId: '42',
        fingerprint: formatBytes32String('11'),
        doNotCreateOrders: false,
        displayMinPrice: new BigNumber(0),
        displayMaxPrice: new BigNumber(1),
        displayAmount: new BigNumber(500),
        displayPrice: new BigNumber(0.75),
        displayShares: new BigNumber(100000),
        expirationTime,
      });

      await john.placeZeroXOrder({
        direction: bid,
        market: yesNoMarket3.address,
        numTicks: await yesNoMarket3.getNumTicks_(),
        numOutcomes: 3,
        outcome: 1,
        tradeGroupId: '42',
        fingerprint: formatBytes32String('11'),
        doNotCreateOrders: false,
        displayMinPrice: new BigNumber(0),
        displayMaxPrice: new BigNumber(1),
        displayAmount: new BigNumber(500),
        displayPrice: new BigNumber(0.65),
        displayShares: new BigNumber(100000),
        expirationTime,
      });

      // Terrible, but not clear how else to wait on the mesh event propagating to the callback and it finishing updating the DB...
      await sleep(300);

      await (await johnDB).sync(john.augur, mock.constants.chunkSize, 0);

      marketList = await johnAPI.route('getMarkets', {
        universe: addresses.Universe,
        maxLiquiditySpread: '10',
      });

      expect(marketList.markets.length).toEqual(1);
      let marketIds = _.map(marketList.markets, 'id');
      expect(marketIds).toContain(yesNoMarket3.address);
      expect(marketList.meta.filteredOutCount).toEqual(3);

      marketList = await johnAPI.route('getMarkets', {
        universe: addresses.Universe,
        maxLiquiditySpread: '15',
      });

      expect(marketList.markets.length).toEqual(2);
      marketIds = _.map(marketList.markets, 'id');
      expect(marketIds).toContain(yesNoMarket2.address);
      expect(marketIds).toContain(yesNoMarket3.address);
      expect(marketList.meta.filteredOutCount).toEqual(2);

      marketList = await johnAPI.route('getMarkets', {
        universe: addresses.Universe,
        maxLiquiditySpread: '20',
      });

      expect(marketList.markets.length).toEqual(3);
      marketIds = _.map(marketList.markets, 'id');
      expect(marketIds).toContain(yesNoMarket1.address);
      expect(marketIds).toContain(yesNoMarket2.address);
      expect(marketIds).toContain(yesNoMarket3.address);
      expect(marketList.meta.filteredOutCount).toEqual(1);

      // Test includeInvalidMarkets
      await john.placeBasicYesNoZeroXTrade(
        0,
        yesNoMarket1.address,
        0,
        new BigNumber(2000),
        new BigNumber(0.78),
        new BigNumber(0),
        new BigNumber(100000)
      );

      await (await johnDB).sync(john.augur, mock.constants.chunkSize, 0);

      marketList = await johnAPI.route('getMarkets', {
        universe: addresses.Universe,
        includeInvalidMarkets: false,
      });
      expect(marketList.markets.length).toEqual(3);

      marketList = await johnAPI.route('getMarkets', {
        universe: addresses.Universe,
        includeInvalidMarkets: true,
      });

      expect(marketList.markets.length).toEqual(4);

      // Move timestamp to designated reporting phase
      const endTime = await yesNoMarket1.getEndTime_();
      await john.setTimestamp(endTime.plus(1));
      await (await johnDB).sync(john.augur, mock.constants.chunkSize, 0);

      // Test reportingStates
      marketList = await johnAPI.route('getMarkets', {
        universe: addresses.Universe,
        reportingStates: [MarketReportingState.DesignatedReporting],
        isSortDescending: false,
      });

      expect(marketList.markets.length).toEqual(4);

      marketList = await johnAPI.route('getMarkets', {
        universe: addresses.Universe,
        reportingStates: [MarketReportingState.PreReporting],
      });

      expect(marketList.markets).toEqual([]);

      const noPayoutSet = [
        new BigNumber(0),
        new BigNumber(100),
        new BigNumber(0),
      ];

      await john.doInitialReport(yesNoMarket3, noPayoutSet);

      await (await johnDB).sync(john.augur, mock.constants.chunkSize, 0);

      // Test sortBy
      marketList = await johnAPI.route('getMarkets', {
        universe: addresses.Universe,
        sortBy: GetMarketsSortBy.endTime,
      });

      expect(marketList.markets.length).toEqual(4);
      expect(marketList.markets[0].id).toEqual(yesNoMarket2.address);

      marketList = await johnAPI.route('getMarkets', {
        universe: addresses.Universe,
        sortBy: GetMarketsSortBy.marketOI,
      });

      expect(marketList.markets.length).toEqual(4);
      expect(marketList.markets[0].id).toEqual(yesNoMarket2.address);

      marketList = await johnAPI.route('getMarkets', {
        universe: addresses.Universe,
        sortBy: GetMarketsSortBy.volume,
      });

      expect(marketList.markets.length).toEqual(4);
      expect(marketList.markets[0].id).toEqual(yesNoMarket2.address);

      marketList = await johnAPI.route('getMarkets', {
        universe: addresses.Universe,
        sortBy: GetMarketsSortBy.disputeRound,
      });

      expect(marketList.markets.length).toEqual(4);
      expect(marketList.markets[0].id).toEqual(yesNoMarket3.address);

      marketList = await johnAPI.route('getMarkets', {
        universe: addresses.Universe,
        sortBy: GetMarketsSortBy.totalRepStakedInMarket,
      });

      expect(marketList.markets.length).toEqual(4);
      expect(marketList.markets[0].id).toEqual(yesNoMarket3.address);
    });
  });
});
