import { ORDER_TYPES, SECONDS_IN_A_DAY } from '@augurproject/sdk';

import { BigNumber } from 'bignumber.js';

import { ACCOUNTS } from '../constants';
import { ContractAPI } from './contract-api';
import { extractSeed, Seed } from './ganache';
import { makeProviderWithDB } from './LocalAugur';
import { stringTo32ByteHex } from './Utils';
import { SDKConfiguration } from '@augurproject/artifacts';

const outcome0 = new BigNumber(0);
const outcome1 = new BigNumber(1);

export async function generateWarpSyncTestData(config: SDKConfiguration, seed: Seed) {
  const metadata = {};

  const [db, provider] = await makeProviderWithDB(seed, ACCOUNTS);

  metadata['checkpoint1_start'] = 0;

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

  await john.faucet(new BigNumber(1e18)); // faucet enough cash for the various fill orders
  await mary.faucet(new BigNumber(1e18)); // faucet enough cash for the various fill orders

  await john.approveCentralAuthority();
  await mary.approveCentralAuthority();

  await john.createReasonableYesNoMarket();
  await john.createReasonableYesNoMarket();

  const yesNoMarket = await john.createReasonableYesNoMarket();
  const categoricalMarket = await john.createReasonableMarket(
    [stringTo32ByteHex('A'), stringTo32ByteHex('B'), stringTo32ByteHex('C')]
  );

  // Move timestamp ahead 12 hours.
  await provider.provider.send('evm_increaseTime', [SECONDS_IN_A_DAY.toNumber() / 2]);

  // Place orders
  const numShares = new BigNumber(10000000000000);
  const price = new BigNumber(22);
  await john.placeOrder(
    yesNoMarket.address,
    ORDER_TYPES.BID,
    numShares,
    price,
    outcome0,
    stringTo32ByteHex(''),
    stringTo32ByteHex(''),
    stringTo32ByteHex('42')
  );

  await john.placeOrder(
    yesNoMarket.address,
    ORDER_TYPES.BID,
    numShares,
    price,
    outcome1,
    stringTo32ByteHex(''),
    stringTo32ByteHex(''),
    stringTo32ByteHex('42')
  );

  metadata['checkpoint1_end'] = await provider.provider.getBlockNumber();

  // Move timestamp ahead 12 hours.
  await provider.provider.send('evm_increaseTime', [SECONDS_IN_A_DAY.toNumber() / 2]);

  await john.placeOrder(
    categoricalMarket.address,
    ORDER_TYPES.BID,
    numShares,
    price,
    outcome0,
    stringTo32ByteHex(''),
    stringTo32ByteHex(''),
    stringTo32ByteHex('42')
  );
  metadata['checkpoint2_start'] = await provider.provider.getBlockNumber();

  await john.placeOrder(
    categoricalMarket.address,
    ORDER_TYPES.BID,
    numShares,
    price,
    outcome1,
    stringTo32ByteHex(''),
    stringTo32ByteHex(''),
    stringTo32ByteHex('42')
  );

  // Fill orders
  const yesNoOrderId0 = await john.getBestOrderId(
    ORDER_TYPES.BID,
    yesNoMarket.address,
    outcome0
  );
  const yesNoOrderId1 = await john.getBestOrderId(
    ORDER_TYPES.BID,
    yesNoMarket.address,
    outcome1
  );

  await john.augur.warpSync.initializeUniverse(seed.addresses.Universe);

  // Move timestamp ahead 12 hours.
  await provider.provider.send('evm_increaseTime', [SECONDS_IN_A_DAY.toNumber() / 2]);

  const categoricalOrderId0 = await john.getBestOrderId(
    ORDER_TYPES.BID,
    categoricalMarket.address,
    outcome0
  );
  const categoricalOrderId1 = await john.getBestOrderId(
    ORDER_TYPES.BID,
    categoricalMarket.address,
    outcome1
  );
  await john.fillOrder(
    yesNoOrderId0,
    numShares.div(10).multipliedBy(2),
    '42'
  );

  metadata['checkpoint2_end'] = await provider.provider.getBlockNumber();

  // Move timestamp ahead 12 hours.
  await provider.provider.send('evm_increaseTime', [SECONDS_IN_A_DAY.toNumber() / 2]);
  await mary.fillOrder(
    yesNoOrderId1,
    numShares.div(10).multipliedBy(3),
    '43'
  );

  metadata['checkpoint3_start'] = await provider.provider.getBlockNumber();

  // Move timestamp ahead 12 hours.
  await provider.provider.send('evm_increaseTime', [SECONDS_IN_A_DAY.toNumber() / 2]);
  await mary.fillOrder(
    categoricalOrderId0,
    numShares.div(10).multipliedBy(2),
    '43'
  );

  metadata['checkpoint3_end'] = await provider.provider.getBlockNumber()

  // Move timestamp ahead 12 hours.
  await provider.provider.send('evm_increaseTime', [SECONDS_IN_A_DAY.toNumber() / 2]);
  await mary.fillOrder(
    categoricalOrderId1,
    numShares.div(10).multipliedBy(4),
    '43'
  );

  metadata['checkpoint4_start'] = await provider.provider.getBlockNumber();

  return {
    data: await extractSeed(db),
    metadata,
  };
}
