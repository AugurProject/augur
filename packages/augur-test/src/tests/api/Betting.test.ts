import {
  AMERICAN_FOOTBALL,
  groupTypes,
  NFL,
  SECONDS_IN_A_DAY,
  SPORTS,
} from '@augurproject/sdk-lite';
import { TEMPLATES } from '@augurproject/templates';
import {
  ACCOUNTS,
  defaultSeedPath,
  loadSeed,
  TestContractAPI,
} from '@augurproject/tools';
import { buildExtraInfo } from '@augurproject/tools/build/libs/templates';
import { BigNumber } from 'bignumber.js';
import { formatBytes32String } from 'ethers/utils';
import { makeProvider } from '../../libs';

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

  const feePerCashInAttoCash = new BigNumber(10).pow(16);

  beforeAll(async () => {
    const seed = await loadSeed(defaultSeedPath);
    const provider = await makeProvider(seed, ACCOUNTS);
    const config = provider.getConfig();

    john = await TestContractAPI.userWrapper(ACCOUNTS[0], provider, config);
    mary = await TestContractAPI.userWrapper(ACCOUNTS[1], provider, config);
    carl = await TestContractAPI.userWrapper(ACCOUNTS[2], provider, config);

    await john.approve();
    await mary.approve();
    await carl.approve();
  });

  test('mega template', async () => {
    const nflTemplates =
      TEMPLATES[SPORTS].children[AMERICAN_FOOTBALL].children[NFL].templates;
    const [megaMoneyLineTemplate] = nflTemplates.filter(
      (item) => item.groupName === groupTypes.COMBO_MONEY_LINE
    );
    const currentTime = await john.getTimestamp();

    const endTime = currentTime.plus(SECONDS_IN_A_DAY);
    const teamA = 'Arizona Cardinals';
    const teamB = 'Atlanta Falcons';
    const tieNoWinner = 'No Contest';

    const inputs = ['Week 1', teamA, teamB, String(endTime)] as const;

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
    await john.createCategoricalMarket({
      endTime: new BigNumber(endTime),
      feePerCashInAttoCash,
      affiliateFeeDivisor: new BigNumber(0),
      designatedReporter: john.account.address,
      outcomes: ['one', 'two', 'three'].map(formatBytes32String),
      extraInfo: JSON.stringify({
        categories: ['random', 'market'],
        description: 'random categorical market',
      }),
    });
    const yesNoTemplate = nflTemplates[0];
    await john.createYesNoMarket({
      affiliateFeeDivisor: new BigNumber(0),
      endTime: endTime.plus(SECONDS_IN_A_DAY),
      feePerCashInAttoCash,
      designatedReporter: john.account.address,
      extraInfo: JSON.stringify(buildExtraInfo(yesNoTemplate, inputs, [
        SPORTS,
        AMERICAN_FOOTBALL,
      ])),
    });

    await john.sync();

    const bettingMarkets = await john.getBettingMarkets();
    expect(bettingMarkets.markets).toHaveLength(1);
    const market = bettingMarkets.markets[0];

    expect(market.id).toEqual(moneyLineMarket.address);
    expect(market.isTemplate).toEqual(true);
    await expect(market.sportsBook.groupId).not.toBeUndefined();
    await expect(market.sportsBook.groupType).not.toBeUndefined();
    await expect(market.sportsBook.header).not.toBeUndefined();
    expect(market.outcomes).toEqual(
      ['Invalid', teamA, teamB, tieNoWinner].map((item) =>
        expect.objectContaining({
          description: item,
        })
      )
    );
  });
});
