import { WSClient } from '@0x/mesh-rpc-client';
import {
  AMERICAN_FOOTBALL,
  groupTypes,
  NFL,
  SPORTS,
} from '@augurproject/sdk-lite';
import {
  TEMPLATES,
} from '@augurproject/templates';
import { sleep } from '@augurproject/core/build/libraries/HelperFunctions';
import { SECONDS_IN_A_DAY } from '@augurproject/sdk';
import {
  ACCOUNTS,
  defaultSeedPath,
  loadSeed,
  TestContractAPI,
} from '@augurproject/tools';
import { buildExtraInfo } from '@augurproject/tools/build/libs/templates';
import { BigNumber } from 'bignumber.js';
import { formatBytes32String } from 'ethers/utils';
import { enableZeroX, makeProvider } from '../../libs';
import { MockBrowserMesh } from '../../libs/MockBrowserMesh';
import { MockMeshServer, stopServer } from '../../libs/MockMeshServer';

// Non-destructive version of splice
function addItemToArray(arr, postion, ...items) {
  const temp = arr.slice();
  temp.splice(postion, 0, ...items);
  return temp;
}

describe('Betting', () => {
  let john: TestContractAPI;
  let mary: TestContractAPI;
  let carl: TestContractAPI;

  let meshClient: WSClient;

  const feePerCashInAttoCash = new BigNumber(10).pow(16);

  beforeAll(async () => {
    const { port } = await MockMeshServer.create();
    meshClient = new WSClient(`ws://localhost:${port}`);

    const browserMesh = new MockBrowserMesh(meshClient);

    const seed = await loadSeed(defaultSeedPath);
    const provider = await makeProvider(seed, ACCOUNTS);
    const config = enableZeroX(provider.getConfig());

    john = await TestContractAPI.userWrapper(ACCOUNTS[0], provider, config);
    mary = await TestContractAPI.userWrapper(ACCOUNTS[1], provider, config);
    carl = await TestContractAPI.userWrapper(ACCOUNTS[2], provider, config);

    const johnBrowserMesh = new MockBrowserMesh(meshClient);
    const maryBrowserMesh = new MockBrowserMesh(meshClient);
    const carlBrowserMesh = new MockBrowserMesh(meshClient);

    johnBrowserMesh.addOtherBrowserMeshToMockNetwork([
      maryBrowserMesh,
    ]);

    john.augur.zeroX.mesh = johnBrowserMesh;
    john.augur.zeroX.rpc = meshClient;
    mary.augur.zeroX.mesh = maryBrowserMesh;
    mary.augur.zeroX.rpc = meshClient;
    carl.augur.zeroX.mesh = carlBrowserMesh;
    carl.augur.zeroX.rpc = meshClient;

    await john.approve();
    await mary.approve();
    await carl.approve();
  });

  afterAll(() => {
    meshClient.destroy();
    stopServer();
  });

  test('mega template', async () => {
    const nflTemplates =
      TEMPLATES[SPORTS].children[AMERICAN_FOOTBALL].children[NFL].templates;

    const [futuresTemplate] = nflTemplates.filter(
      item => item.groupName === groupTypes.FUTURES
    );

    const [megaMoneyLineTemplate] = nflTemplates.filter(
      item => item.groupName === groupTypes.COMBO_MONEY_LINE
    );

    const [megaSpreadTemplate] = nflTemplates.filter(
      item => item.groupName === groupTypes.COMBO_SPREAD
    );

    const [megaOverUnderMegaTemplate] = nflTemplates.filter(
      item => item.groupName === groupTypes.COMBO_OVER_UNDER
    );

    const currentTime = await john.getTimestamp();

    const endTime = currentTime.plus(SECONDS_IN_A_DAY);
    const teamA = 'Arizona Cardinals';
    const teamB = 'Atlanta Falcons';
    const tieNoWinner = 'Tie/No Contest';

    const inputs = [
      'Week 1',
      teamA,
      teamB,
      String(endTime),
    ] as const;

    const expirationTime = new BigNumber(new Date().valueOf()).plus(10000);

    const moneyLineMarket = await john.createCategoricalMarket({
      affiliateFeeDivisor: new BigNumber(0),
      endTime: endTime.plus(SECONDS_IN_A_DAY),
      feePerCashInAttoCash,
      designatedReporter: john.account.address,
      extraInfo: JSON.stringify(buildExtraInfo(megaMoneyLineTemplate, inputs, [
        SPORTS,
        AMERICAN_FOOTBALL,
      ])),
      outcomes: [teamA, teamB, tieNoWinner].map(formatBytes32String),
    });
    const randomMarket = await john.createCategoricalMarket({
      endTime: new BigNumber(endTime),
      feePerCashInAttoCash,
      affiliateFeeDivisor: new BigNumber(0),
      designatedReporter: john.account.address,
      outcomes: ['one', 'two', 'three'].map(formatBytes32String),
      extraInfo: JSON.stringify({
        categories: ['random', 'market'],
        description: 'random categorical market'
      }),
    });
    const yesNoTemplate = nflTemplates[0];
    const yesNoMarket = await john.createYesNoMarket({
      affiliateFeeDivisor: new BigNumber(0),
      endTime: endTime.plus(SECONDS_IN_A_DAY),
      feePerCashInAttoCash,
      designatedReporter: john.account.address,
      extraInfo: JSON.stringify(buildExtraInfo(yesNoTemplate, inputs, [
        SPORTS,
        AMERICAN_FOOTBALL,
      ])),
    });
    /*
    const spreadMarket = await john.createCategoricalMarket({
      affiliateFeeDivisor: new BigNumber(0),
      endTime: endTime.plus(SECONDS_IN_A_DAY),
      feePerCashInAttoCash,
      designatedReporter: john.account.address,
      ...buildTemplateMarketCreationObject(
        megaSpreadTemplate,
        addItemToArray(inputs, 2, '10'),
        [SPORTS, AMERICAN_FOOTBALL]
      ),
    });
    await mary.placeZeroXOrder({
      direction: 0,
      market: spreadMarket.address,
      numTicks: await spreadMarket.getNumTicks_(),
      numOutcomes: 3,
      outcome: 0,
      tradeGroupId: '42',
      fingerprint: formatBytes32String('11'),
      doNotCreateOrders: false,
      displayMinPrice: new BigNumber(0),
      displayMaxPrice: new BigNumber(1),
      displayAmount: new BigNumber(10),
      displayPrice: new BigNumber(0.22),
      displayShares: new BigNumber(100000),
      expirationTime,
    });

    const overUnderMarket1 = await john.createCategoricalMarket({
      affiliateFeeDivisor: new BigNumber(0),
      endTime: endTime.plus(SECONDS_IN_A_DAY),
      feePerCashInAttoCash,
      designatedReporter: john.account.address,
      ...buildTemplateMarketCreationObject(
        megaOverUnderMegaTemplate,
        addItemToArray(inputs, 3, '10'),
        [SPORTS, AMERICAN_FOOTBALL]
      ),
    });

    // This should rollup under the same tile.
    const overUnderMarket2 = await mary.createCategoricalMarket({
      affiliateFeeDivisor: new BigNumber(0),
      endTime: endTime.plus(SECONDS_IN_A_DAY),
      feePerCashInAttoCash,
      designatedReporter: john.account.address,
      ...buildTemplateMarketCreationObject(
        megaOverUnderMegaTemplate,
        addItemToArray(inputs, 3, '10'),
        [SPORTS, AMERICAN_FOOTBALL]
      ),
    });

    const overUnderMarket3 = await mary.createCategoricalMarket({
      affiliateFeeDivisor: new BigNumber(0),
      endTime: endTime.plus(SECONDS_IN_A_DAY),
      feePerCashInAttoCash,
      designatedReporter: john.account.address,
      ...buildTemplateMarketCreationObject(
        megaOverUnderMegaTemplate,
        addItemToArray(inputs, 3, '10'),
        [SPORTS, AMERICAN_FOOTBALL]
      ),
    });
    */
    await sleep(300);

    await john.sync();

    const bettingMarkets = await john.getBettingMarkets();
    expect(bettingMarkets.markets).toHaveLength(1);
    const market = bettingMarkets.markets[0];

    expect(market.id).toEqual(moneyLineMarket.address);
    expect(market.isTemplate).toEqual(true);
    await expect(market.sportsBook.groupId).not.toBeUndefined();
    await expect(market.sportsBook.groupType).not.toBeUndefined();
    await expect(market.sportsBook.header).not.toBeUndefined();
    market.outcomes.map(outcome => expect(['Invalid', teamA, teamB, tieNoWinner].includes(outcome.description)).toEqual(true));
  });
});
