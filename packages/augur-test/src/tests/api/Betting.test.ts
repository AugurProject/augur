import { WSClient } from '@0x/mesh-rpc-client';
import {
  AMERICAN_FOOTBALL,
  groupTypes,
  NFL,
  SPORTS,
  TEMPLATES,
} from '@augurproject/artifacts';
import { sleep } from '@augurproject/core/build/libraries/HelperFunctions';
import { SECONDS_IN_A_DAY } from '@augurproject/sdk';
import {
  ACCOUNTS,
  defaultSeedPath,
  loadSeed,
  TestContractAPI,
} from '@augurproject/tools';
import { buildTemplateMarketCreationObject } from '@augurproject/tools/build/libs/templates';
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
      carlBrowserMesh,
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
      item => item.groupName === groupTypes.DAILY_MONEY_LINE
    );

    const [megaSpreadTemplate] = nflTemplates.filter(
      item => item.groupName === groupTypes.DAILY_SPREAD
    );

    const [megaOverUnderMegaTemplate] = nflTemplates.filter(
      item => item.groupName === groupTypes.DAILY_OVER_UNDER
    );

    const currentTime = await john.getTimestamp();

    const endTime = currentTime.plus(SECONDS_IN_A_DAY);

    const inputs = [
      'Week 1',
      'Seattle Seahawks',
      'Los Angeles Rams',
      String(endTime),
      'Tie/No Winner',
    ] as const;

    const expirationTime = new BigNumber(new Date().valueOf()).plus(10000);

    const moneyLineMarket = await john.createCategoricalMarket({
      affiliateFeeDivisor: new BigNumber(0),
      endTime: endTime.plus(SECONDS_IN_A_DAY),
      feePerCashInAttoCash,
      designatedReporter: john.account.address,
      ...buildTemplateMarketCreationObject(megaMoneyLineTemplate, inputs, [
        SPORTS,
        AMERICAN_FOOTBALL,
      ]),
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

    await expect(john.getBettingMarkets()).resolves.toEqual([
      {
        id: expect.any(String),
        outcomes: [
          {
            description: 'Seattle Seahawks',
          },
          {
            description: 'Los Angeles Rams',
          },
          {
            description: 'No Winner',
          },
        ],
      },
    ]);
  });
});
