import { SECONDS_IN_A_DAY } from '@augurproject/sdk';
import {
  ACCOUNTS,
  defaultSeedPath,
  loadSeedFile,
  TestContractAPI,
} from '@augurproject/tools';
import { TestEthersProvider } from '@augurproject/tools/build/libs/TestEthersProvider';
import { stringTo32ByteHex } from '@augurproject/tools/build/libs/Utils';

import { BigNumber } from 'bignumber.js';
import { makeProvider } from '../../../../libs';

export const CHUNK_SIZE = 100000;
export const outcome0 = new BigNumber(0);
export const outcome1 = new BigNumber(1);

export interface AllState {
  baseProvider: TestEthersProvider;
  markets: { [name: string]: string };
}

export interface SomeState {
  john: TestContractAPI;
  mary: TestContractAPI;
  bob: TestContractAPI;
}

export async function _beforeAll(): Promise<AllState> {
  const seed = await loadSeedFile(defaultSeedPath);
  const baseProvider = await makeProvider(seed, ACCOUNTS);
  const addresses = baseProvider.getContractAddresses();

  const john = await TestContractAPI.userWrapper(
    ACCOUNTS[0],
    baseProvider,
    addresses
  );
  const mary = await TestContractAPI.userWrapper(
    ACCOUNTS[1],
    baseProvider,
    addresses
  );
  const bob = await TestContractAPI.userWrapper(
    ACCOUNTS[2],
    baseProvider,
    addresses
  );
  await john.approveCentralAuthority();
  await mary.approveCentralAuthority();
  await bob.approveCentralAuthority();

  let endTime = (await john.getTimestamp()).plus(SECONDS_IN_A_DAY);
  const lowFeePerCashInAttoCash = new BigNumber(10).pow(18).div(20); // 5% creator fee
  const highFeePerCashInAttoCash = new BigNumber(10).pow(18).div(10); // 10% creator fee
  const affiliateFeeDivisor = new BigNumber(0);
  const designatedReporter = john.account.publicKey;
  const markets = {};
  markets['yesNoMarket1'] = (await john.createYesNoMarket({
    endTime,
    feePerCashInAttoCash: lowFeePerCashInAttoCash,
    affiliateFeeDivisor,
    designatedReporter,
    extraInfo:
      '{"categories": ["common", "yesNo 1 secondary", "yesNo 1 tertiary"], "description": "yesNo description 1", "longDescription": "yesNo longDescription 1"}',
  })).address;
  markets['yesNoMarket2'] = (await john.createYesNoMarket({
    endTime,
    feePerCashInAttoCash: lowFeePerCashInAttoCash,
    affiliateFeeDivisor,
    designatedReporter,
    extraInfo:
      '{"categories": ["yesNo 2 primary", "yesNo 2 secondary", "yesNo 2 tertiary"], "description": "yesNo description 2", "longDescription": "yesNo longDescription 2"}',
  })).address;
  markets['categoricalMarket1'] = (await john.createCategoricalMarket({
    endTime,
    feePerCashInAttoCash: lowFeePerCashInAttoCash,
    affiliateFeeDivisor,
    designatedReporter,
    outcomes: [
      stringTo32ByteHex('A'),
      stringTo32ByteHex('B'),
      stringTo32ByteHex('C'),
    ],
    extraInfo:
      '{"categories": ["categorical 1 primary", "categorical 1 secondary", "categorical 1 tertiary"], "description": "categorical description 1", "longDescription": "categorical longDescription 1"}',
  })).address;
  markets['categoricalMarket2'] = (await john.createCategoricalMarket({
    endTime,
    feePerCashInAttoCash: highFeePerCashInAttoCash,
    affiliateFeeDivisor,
    designatedReporter,
    outcomes: [
      stringTo32ByteHex('A'),
      stringTo32ByteHex('B'),
      stringTo32ByteHex('C'),
    ],
    extraInfo:
      '{"categories": ["categorical 2 primary", "categorical 2 secondary", "categorical 2 tertiary"], "description": "categorical description 2", "longDescription": "categorical longDescription 2"}',
  })).address;
  markets['scalarMarket1'] = (await john.createScalarMarket({
    endTime,
    feePerCashInAttoCash: highFeePerCashInAttoCash,
    affiliateFeeDivisor,
    designatedReporter,
    prices: [new BigNumber(0), new BigNumber(100).multipliedBy(10 ** 18)],
    numTicks: new BigNumber(100),
    extraInfo:
      '{"categories": ["common", "scalar 1 secondary", "scalar 1 tertiary"], "description": "scalar description 1", "longDescription": "scalar longDescription 1", "_scalarDenomination": "scalar denom 1"}',
  })).address;
  endTime = endTime.plus(1);
  markets['scalarMarket2'] = (await john.createScalarMarket({
    endTime,
    feePerCashInAttoCash: highFeePerCashInAttoCash,
    affiliateFeeDivisor,
    designatedReporter,
    prices: [new BigNumber(0), new BigNumber(100).multipliedBy(10 ** 18)],
    numTicks: new BigNumber(100),
    extraInfo:
      '{"categories": ["scalar 2 primary", "scalar 2 secondary", "scalar 2 tertiary"], "description": "scalar description 2", "longDescription": "scalar longDescription 2", "_scalarDenomination": "scalar denom 2"}',
  })).address;

  return { baseProvider, markets };
}

export async function _beforeEach(allState: AllState): Promise<SomeState> {
  const { baseProvider } = allState;

  const provider = await baseProvider.fork();
  const addresses = baseProvider.getContractAddresses();
  const john = await TestContractAPI.userWrapper(
    ACCOUNTS[0],
    provider,
    addresses
  );
  const mary = await TestContractAPI.userWrapper(
    ACCOUNTS[1],
    provider,
    addresses
  );
  const bob = await TestContractAPI.userWrapper(
    ACCOUNTS[2],
    provider,
    addresses
  );

  return {
    john,
    mary,
    bob,
  };
}
