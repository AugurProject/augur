import { MarketReportingState, SECONDS_IN_A_DAY } from '@augurproject/sdk-lite';
import {
  ACCOUNTS,
  ContractAPI,
  defaultSeedPath,
  loadSeed,
} from '@augurproject/tools';
import { TestContractAPI } from '@augurproject/tools';
import { TestEthersProvider } from '@augurproject/tools/build/libs/TestEthersProvider';
import { BigNumber } from 'bignumber.js';
import { makeProvider } from '../../../libs';

const CHUNK_SIZE = 100000;

const invalidPayoutSet = [
  new BigNumber(1000),
  new BigNumber(0),
  new BigNumber(0),
];
const noPayoutSet = [new BigNumber(0), new BigNumber(1000), new BigNumber(0)];
const yesPayoutSet = [new BigNumber(0), new BigNumber(0), new BigNumber(1000)];

describe('State API :: Markets :: ', () => {
  let john: TestContractAPI;
  let mary: TestContractAPI;
  let bob: TestContractAPI;

  let baseProvider: TestEthersProvider;
  const markets = {};

  beforeAll(async () => {
    const seed = await loadSeed(defaultSeedPath);
    baseProvider = await makeProvider(seed, ACCOUNTS);
    const config = baseProvider.getConfig();

    john = await TestContractAPI.userWrapper(ACCOUNTS[0], baseProvider, config);
    mary = await TestContractAPI.userWrapper(ACCOUNTS[1], baseProvider, config);
    bob = await TestContractAPI.userWrapper(ACCOUNTS[2], baseProvider, config);

    await john.approve();
    await mary.approve();
    await bob.approve();

    const endTime = (await john.getTimestamp()).plus(SECONDS_IN_A_DAY);
    const feePerCashInAttoCash = new BigNumber(10).pow(18).div(20); // 5% creator fee
    const affiliateFeeDivisor = new BigNumber(0);
    const designatedReporter = john.account.address;
    markets['yesNoMarket1'] = await john.createYesNoMarket({
      endTime,
      feePerCashInAttoCash,
      affiliateFeeDivisor,
      designatedReporter,
      extraInfo:
        '{"categories": ["yesNo 1 primary", "yesNo 1 secondary", "yesNo 1 tertiary"], "description": "yesNo description 1", "longDescription": "yesNo longDescription 1"}',
    });
    markets['yesNoMarket2'] = await john.createYesNoMarket({
      endTime,
      feePerCashInAttoCash,
      affiliateFeeDivisor,
      designatedReporter,
      extraInfo:
        '{"categories": ["yesNo 2 primary", "yesNo 2 secondary", "yesNo 2 tertiary"], "description": "yesNo description 2", "longDescription": "yesNo longDescription 2"}',
    });
  });

  beforeEach(async () => {
    const provider = await baseProvider.fork();
    const config = baseProvider.getConfig();
    john = await TestContractAPI.userWrapper(ACCOUNTS[0], provider, config);
    mary = await TestContractAPI.userWrapper(ACCOUNTS[1], provider, config);
    bob = await TestContractAPI.userWrapper(ACCOUNTS[2], provider, config);
  });

  test(':getMarketsInfo DisputeInfo', async () => {
    // Skip to yes/no market end time
    const yesNoMarket = markets['yesNoMarket1'];
    const newTime = (await yesNoMarket.getEndTime_()).plus(1);
    await john.setTimestamp(newTime);

    await john.sync();

    let marketsInfo = await john.api.route('getMarketsInfo', {
      marketIds: [yesNoMarket.address],
    });

    expect(marketsInfo[0].reportingState).toBe(
      MarketReportingState.DesignatedReporting
    );

    // Submit intial report with additional stake
    const additionalRep = new BigNumber(100).multipliedBy(10 ** 18).toFixed();
    await john.faucetRep(new BigNumber(1e27));
    await john.doInitialReport(yesNoMarket, noPayoutSet, '', additionalRep);

    await john.sync();

    marketsInfo = await john.api.route('getMarketsInfo', {
      marketIds: [yesNoMarket.address],
    });

    await expect(marketsInfo[0].disputeInfo.stakes[0].stakeCurrent).toEqual(
      additionalRep
    );
    await expect(marketsInfo[0].disputeInfo.stakes[0].bondSizeCurrent).toEqual(
      '0'
    );
  });
});
