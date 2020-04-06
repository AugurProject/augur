import { SDKConfiguration } from '@augurproject/artifacts';
import { SECONDS_IN_A_DAY } from '@augurproject/sdk';
import { BigNumber } from 'bignumber.js';
import { ACCOUNTS } from '../constants';
import { awaitUserInput } from '../flash/util';
import { ContractAPI } from './contract-api';
import { extractSeed, Seed } from './ganache';
import { makeProviderWithDB } from './LocalAugur';

export async function generatePruneTestData(config: SDKConfiguration, seed: Seed) {
  const metadata = {};
  const [db, provider] = await makeProviderWithDB(seed, ACCOUNTS);

  const john = await ContractAPI.userWrapper(
    ACCOUNTS[0],
    provider,
    config
  );
  const mary = await ContractAPI.userWrapper(
    ACCOUNTS[1],
    provider,
    config
  );

  await john.faucet(new BigNumber(1000000000));

  await john.approveCentralAuthority();
  await mary.approveCentralAuthority();

  // Market to sunset.
  const market = await john.createReasonableYesNoMarket();

  const marketEndTime = await market.getEndTime_();

  const orderAmount = new BigNumber(1);
  const orderPrice = new BigNumber(0.4);

  await john.placeBasicYesNoTrade(
    0,
    market,
    1,
    orderAmount,
    orderPrice,
    new BigNumber(0)
  );

  await mary.placeBasicYesNoTrade(
    1,
    market,
    1,
    orderAmount,
    orderPrice,
    new BigNumber(0)
  );

  await john.setTimestamp(marketEndTime.plus(SECONDS_IN_A_DAY));

  const yesPayoutSet = [
    new BigNumber(0),
    new BigNumber(100),
    new BigNumber(0),
  ];
  await john.doInitialReport(market, yesPayoutSet);

  const finalTimestamp = (await john.getTimestamp()).plus(SECONDS_IN_A_DAY.multipliedBy(2))

  await john.setTimestamp(finalTimestamp);

  await market.finalize();

  return {
    data: await extractSeed(db),
    metadata,
  };
}
