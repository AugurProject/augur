import { SECONDS_IN_A_DAY } from '@augurproject/sdk';
import { MarketReportingState } from '@augurproject/sdk/build/constants';
import { DB } from '@augurproject/sdk/build/state/db/DB';
import { API } from '@augurproject/sdk/build/state/getter/API';
import { BulkSyncStrategy } from '@augurproject/sdk/build/state/sync/BulkSyncStrategy';
import {
  ACCOUNTS,
  ContractAPI,
  defaultSeedPath,
  loadSeedFile,
} from '@augurproject/tools';
import { TestEthersProvider } from '@augurproject/tools/build/libs/TestEthersProvider';
import { BigNumber } from 'bignumber.js';
import { makeDbMock, makeProvider } from '../../../libs';

const CHUNK_SIZE = 100000;

const invalidPayoutSet = [
    new BigNumber(100),
    new BigNumber(0),
    new BigNumber(0),
];
const noPayoutSet = [
    new BigNumber(0),
    new BigNumber(100),
    new BigNumber(0),
];
const yesPayoutSet = [
    new BigNumber(0),
    new BigNumber(0),
    new BigNumber(100),
];

describe('State API :: Markets :: ', () => {
  let db: Promise<DB>;
  let api: API;
  let john: ContractAPI;
  let mary: ContractAPI;
  let bob: ContractAPI;
  let bulkSyncStrategy: BulkSyncStrategy;

  let baseProvider: TestEthersProvider;
  const markets = {};

  beforeAll(async () => {
    const seed = await loadSeedFile(defaultSeedPath);
    baseProvider = await makeProvider(seed, ACCOUNTS);
    const addresses = baseProvider.getContractAddresses();

    john = await ContractAPI.userWrapper(ACCOUNTS[0], baseProvider, addresses);
    mary = await ContractAPI.userWrapper(ACCOUNTS[1], baseProvider, addresses);
    bob = await ContractAPI.userWrapper(ACCOUNTS[2], baseProvider, addresses);
    db = makeDbMock().makeDB(john.augur, ACCOUNTS);
    api = new API(john.augur, db);

    await john.approveCentralAuthority();
    await mary.approveCentralAuthority();
    await bob.approveCentralAuthority();

    let endTime = (await john.getTimestamp()).plus(SECONDS_IN_A_DAY);
    const feePerCashInAttoCash = new BigNumber(10).pow(18).div(20); // 5% creator fee
    const affiliateFeeDivisor = new BigNumber(0);
    const designatedReporter = john.account.publicKey;
    markets['yesNoMarket1'] = (await john.createYesNoMarket({
      endTime,
      feePerCashInAttoCash,
      affiliateFeeDivisor,
      designatedReporter,
      extraInfo: '{"categories": ["yesNo 1 primary", "yesNo 1 secondary", "yesNo 1 tertiary"], "description": "yesNo description 1", "longDescription": "yesNo longDescription 1"}',
    }));
    markets['yesNoMarket2'] = (await john.createYesNoMarket({
      endTime,
      feePerCashInAttoCash,
      affiliateFeeDivisor,
      designatedReporter,
      extraInfo: '{"categories": ["yesNo 2 primary", "yesNo 2 secondary", "yesNo 2 tertiary"], "description": "yesNo description 2", "longDescription": "yesNo longDescription 2"}',
    }));
  });

  beforeEach(async () => {
    const provider = await baseProvider.fork();
    const addresses = baseProvider.getContractAddresses();
    john = await ContractAPI.userWrapper(ACCOUNTS[0], provider, addresses);
    mary = await ContractAPI.userWrapper(ACCOUNTS[1], provider, addresses);
    bob = await ContractAPI.userWrapper(ACCOUNTS[2], provider, addresses);
    db = makeDbMock().makeDB(john.augur, ACCOUNTS);
    api = new API(john.augur, db);

    bulkSyncStrategy = new BulkSyncStrategy(
      john.provider.getLogs,
      (await db).logFilters.buildFilter,
      (await db).logFilters.onLogsAdded,
      john.augur.contractEvents.parseLogs
    );
  });

  test(':getMarketsInfo DisputeInfo', async () => {
    // Skip to yes/no market end time
    const yesNoMarket = markets['yesNoMarket1'];
    let newTime = (await yesNoMarket.getEndTime_()).plus(1);
    await john.setTimestamp(newTime);

    await bulkSyncStrategy.start(0, await john.provider.getBlockNumber());

    let marketsInfo = await api.route('getMarketsInfo', {
      marketIds: [
        yesNoMarket.address
      ],
    });

    expect(marketsInfo[0].reportingState).toBe(MarketReportingState.DesignatedReporting);

    // Submit intial report with additional stake
    const additionalRep = new BigNumber(100).multipliedBy(10**18).toFixed();
    await john.repFaucet(new BigNumber(1e27));
    await john.doInitialReport(yesNoMarket, noPayoutSet, "", additionalRep);

    await bulkSyncStrategy.start(0, await john.provider.getBlockNumber());;

    marketsInfo = await api.route('getMarketsInfo', {
      marketIds: [
        yesNoMarket.address
      ],
    });

    await expect(marketsInfo[0].disputeInfo.stakes[0].stakeCurrent).toEqual(additionalRep);
    await expect(marketsInfo[0].disputeInfo.stakes[0].bondSizeCurrent).toEqual("0");
  });

});
