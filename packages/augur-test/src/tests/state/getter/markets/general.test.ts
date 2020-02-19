import { WSClient } from '@0x/mesh-rpc-client';
import { ContractAddresses } from '@augurproject/artifacts';
import { sleep } from '@augurproject/core/build/libraries/HelperFunctions';
import { EthersProvider } from '@augurproject/ethersjs-provider';
import {
  BrowserMesh,
  Connectors,
  MarketReportingState,
} from '@augurproject/sdk';
import {
  GetMarketsSortBy,
  MarketList,
} from '@augurproject/sdk/build/state/getter/Markets';
import { ACCOUNTS, defaultSeedPath, loadSeedFile } from '@augurproject/tools';
import { TestContractAPI } from '@augurproject/tools';
import {
  NULL_ADDRESS,
  stringTo32ByteHex,
} from '@augurproject/tools/build/libs/Utils';
import { BigNumber } from 'bignumber.js';
import { formatBytes32String } from 'ethers/utils';
import * as _ from 'lodash';
import { makeProvider, MockGnosisRelayAPI } from '../../../../libs';
import { MockBrowserMesh } from '../../../../libs/MockBrowserMesh';
import { MockMeshServer, stopServer } from '../../../../libs/MockMeshServer';

describe('State API :: General', () => {
  let john: TestContractAPI;

  let mary: TestContractAPI;

  let provider: EthersProvider;
  let addresses: ContractAddresses;

  let meshBrowser: BrowserMesh;
  let meshClient: WSClient;

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
      const johnBrowserMesh = new MockBrowserMesh(meshClient);
      john = await TestContractAPI.userWrapper(
        ACCOUNTS[0],
        provider,
        addresses,
        johnConnector,
        johnGnosis,
        meshClient,
        johnBrowserMesh
      );
      expect(john).toBeDefined();

      johnGnosis.initialize(john);
      johnConnector.initialize(john.augur, john.db);
      await john.approveCentralAuthority();

      const maryConnector = new Connectors.DirectConnector();
      const maryGnosis = new MockGnosisRelayAPI();
      const maryBrowserMesh = new MockBrowserMesh(meshClient);
      mary = await TestContractAPI.userWrapper(
        ACCOUNTS[1],
        provider,
        addresses,
        maryConnector,
        maryGnosis,
        meshClient,
        maryBrowserMesh
      );
      maryGnosis.initialize(mary);
      maryConnector.initialize(mary.augur, mary.db);
      await mary.approveCentralAuthority();

      maryBrowserMesh.addOtherBrowserMeshToMockNetwork(johnBrowserMesh);
      johnBrowserMesh.addOtherBrowserMeshToMockNetwork(maryBrowserMesh);
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

      await john.sync();
      await mary.sync();

      // Test invalid universe address
      let errorMessage = '';
      try {
        await john.api.route('getMarkets', {
          universe: NULL_ADDRESS,
        });
      } catch (error) {
        errorMessage = error.message;
      }
      expect(errorMessage).toEqual('Unknown universe: ' + NULL_ADDRESS);

      // Test market count
      marketList = await john.api.route('getMarkets', {
        universe: addresses.Universe,
        isSortDescending: false,
      });

      expect(marketList.markets.length).toEqual(2);

      // Test creator
      marketList = await john.api.route('getMarkets', {
        universe: addresses.Universe,
        creator: ACCOUNTS[0].publicKey,
        isSortDescending: false,
      });

      expect(marketList.markets.length).toEqual(1);

      marketList = await john.api.route('getMarkets', {
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
      marketList = await john.api.route('getMarkets', {
        universe: addresses.Universe,
        designatedReporter: ACCOUNTS[0].publicKey,
      });
      expect(marketList.markets.length).toEqual(1);

      marketList = await john.api.route('getMarkets', {
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
      marketList = await john.api.route('getMarkets', {
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

      marketList = await john.api.route('getMarkets', {
        universe: addresses.Universe,
        maxFee: '0.1',
      });
      expect(marketList.markets.length).toEqual(2);

      // Test search & categories params
      marketList = await john.api.route('getMarkets', {
        universe: addresses.Universe,
        search: 'Categorical',
      });
      expect(marketList.markets.length).toEqual(1);
      expect(marketList.markets[0].id).toEqual(categoricalMarket1.address);

      marketList = await john.api.route('getMarkets', {
        universe: addresses.Universe,
        categories: ['flash', 'reasonable', 'yesno'],
      });

      expect(marketList.markets.length).toEqual(1);

      marketList = await john.api.route('getMarkets', {
        universe: addresses.Universe,
        search: ACCOUNTS[0].publicKey,
      });
      expect(marketList.markets.length).toEqual(1);
      expect(marketList.markets[0].id).toEqual(yesNoMarket1.address);

      marketList = await john.api.route('getMarkets', {
        universe: addresses.Universe,
        search: 'ipsum ipsum',
      });
      expect(marketList.markets.length).toEqual(0);

      marketList = await john.api.route('getMarkets', {
        universe: addresses.Universe,
        categories: ['ipsum', 'ipsum', 'ipsum'],
      });
      expect(marketList.markets.length).toEqual(0);

      // Test maxLiquiditySpread
      const yesNoMarket2 = await john.createReasonableYesNoMarket();
      const yesNoMarket3 = await john.createReasonableYesNoMarket();
      await john.sync();

      const expirationTimeInSeconds = new BigNumber(
        Math.round(+new Date() / 1000).valueOf()
      ).plus(10000);

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
        expirationTime: expirationTimeInSeconds,
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
        expirationTime: expirationTimeInSeconds,
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
        expirationTime: expirationTimeInSeconds,
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
        expirationTime: expirationTimeInSeconds,
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
        expirationTime: expirationTimeInSeconds,
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
        expirationTime: expirationTimeInSeconds,
      });

      // Terrible, but not clear how else to wait on the mesh event propagating to the callback and it finishing updating the DB...
      await sleep(300);

      await john.sync();
      await john.db.marketDatabase.syncOrderBooks([yesNoMarket1.address, yesNoMarket2.address, yesNoMarket3.address])

      marketList = await john.api.route('getMarkets', {
        universe: addresses.Universe,
        maxLiquiditySpread: '10',
      });

      expect(marketList.markets.length).toEqual(1);
      let marketIds = _.map(marketList.markets, 'id');
      expect(marketIds).toContain(yesNoMarket3.address);
      expect(marketList.meta.filteredOutCount).toEqual(3);

      marketList = await john.api.route('getMarkets', {
        universe: addresses.Universe,
        maxLiquiditySpread: '15',
      });

      expect(marketList.markets.length).toEqual(2);
      marketIds = _.map(marketList.markets, 'id');
      expect(marketIds).toContain(yesNoMarket2.address);
      expect(marketIds).toContain(yesNoMarket3.address);
      expect(marketList.meta.filteredOutCount).toEqual(2);

      marketList = await john.api.route('getMarkets', {
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
      const outcomeInvalid = 0;

      await john.placeBasicYesNoZeroXTrade(
        bid,
        yesNoMarket1.address,
        outcomeInvalid,
        new BigNumber(2000),
        new BigNumber(0.78),
        new BigNumber(0),
        expirationTimeInSeconds
      );

      await john.sync();
      await john.db.marketDatabase.syncOrderBooks([yesNoMarket1.address])

      marketList = await john.api.route('getMarkets', {
        universe: addresses.Universe,
        includeInvalidMarkets: false,
      });
      expect(marketList.markets.length).toEqual(3);

      marketList = await john.api.route('getMarkets', {
        universe: addresses.Universe,
        includeInvalidMarkets: true,
      });

      expect(marketList.markets.length).toEqual(4);

      // Move timestamp to designated reporting phase
      const endTime = await yesNoMarket1.getEndTime_();
      await john.setTimestamp(endTime.plus(1));
      await john.sync();

      // Test reportingStates
      marketList = await john.api.route('getMarkets', {
        universe: addresses.Universe,
        reportingStates: [MarketReportingState.DesignatedReporting],
        isSortDescending: false,
      });

      expect(marketList.markets.length).toEqual(4);

      marketList = await john.api.route('getMarkets', {
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

      await john.sync();

      // Test sortBy
      marketList = await john.api.route('getMarkets', {
        universe: addresses.Universe,
        sortBy: GetMarketsSortBy.endTime,
      });

      expect(marketList.markets.length).toEqual(4);
      expect(marketList.markets[0].id).toEqual(yesNoMarket2.address);

      marketList = await john.api.route('getMarkets', {
        universe: addresses.Universe,
        sortBy: GetMarketsSortBy.disputeRound,
      });

      expect(marketList.markets.length).toEqual(4);
      expect(marketList.markets[0].id).toEqual(yesNoMarket3.address);

      marketList = await john.api.route('getMarkets', {
        universe: addresses.Universe,
        sortBy: GetMarketsSortBy.totalRepStakedInMarket,
      });

      expect(marketList.markets.length).toEqual(4);
      expect(marketList.markets[0].id).toEqual(yesNoMarket3.address);

      marketList = await john.api.route('getMarkets', {
        universe: addresses.Universe,
        sortBy: GetMarketsSortBy.marketOI,
      });

      expect(marketList.markets.length).toEqual(4);
      expect(marketList.markets[0].id).toEqual(yesNoMarket2.address);

      marketList = await john.api.route('getMarkets', {
        universe: addresses.Universe,
        sortBy: GetMarketsSortBy.volume,
      });

      expect(marketList.markets.length).toEqual(4);
      expect(marketList.markets[0].id).toEqual(yesNoMarket2.address);

      // Test Recently Depleted Liquidity + Invalid
      marketList = await john.api.route('getMarkets', {
        universe: addresses.Universe,
        maxLiquiditySpread: '10',
      });

      expect(marketList.markets.length).toEqual(1);
      marketIds = _.map(marketList.markets, 'id');
      expect(marketIds).toContain(yesNoMarket3.address);
      expect(marketList.meta.filteredOutCount).toEqual(3);

      // Make market invalid.
      await john.placeBasicYesNoZeroXTrade(
        bid,
        yesNoMarket3.address,
        outcomeInvalid,
        new BigNumber(5000),
        new BigNumber(0.45),
        new BigNumber(0),
        expirationTimeInSeconds
      );

      // Invalid markets that pass the spread filter should appear as Recently Depleted Liquidity
      await john.sync();
      await john.db.marketDatabase.syncOrderBooks([yesNoMarket3.address])

      marketList = await john.api.route('getMarkets', {
        universe: addresses.Universe,
        maxLiquiditySpread: '0',
        includeInvalidMarkets: true,
      });

      expect(marketList.markets.length).toEqual(1);
      expect(marketList.markets[0].id).toEqual(yesNoMarket3.address);
    });
  });
});
