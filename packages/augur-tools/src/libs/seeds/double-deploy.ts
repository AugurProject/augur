const compilerOutput = require('@augurproject/artifacts/build/contracts.json');
import {
  SDKConfiguration,
  ContractAddresses
} from '@augurproject/utils';
import { BigNumber } from 'ethers/utils';
import { Account, ACCOUNTS } from '../../constants';
import { deployContracts } from '../blockchain';
import { ContractAPI } from '../contract-api';
import { createSeed, Seed } from './../ganache';
import { makeProviderWithDB } from './../LocalAugur';

export async function generateDoubleDeploy(
  config: SDKConfiguration,
  seed: Seed,
  initialAddresses: ContractAddresses,
  account: Account,
  network: string
) {
  const [db, provider] = await makeProviderWithDB(seed, ACCOUNTS);
  provider.overrideGasPrice = new BigNumber(100);

  const john = await ContractAPI.userWrapper(ACCOUNTS[0], provider, config);

  await john.createReasonableYesNoMarket();
  await john.createReasonableYesNoMarket();
  await john.createReasonableYesNoMarket();
  await john.createReasonableYesNoMarket();
  await john.createReasonableYesNoMarket();

  const blockNumberBeforeDeploy = await provider.getBlockNumber();

  const { addresses } = await deployContracts(
    network,
    provider,
    account,
    compilerOutput,
    config
  );

  return createSeed(provider, db, initialAddresses, {
    addresses,
    blockNumberBeforeDeploy,
  });
}
