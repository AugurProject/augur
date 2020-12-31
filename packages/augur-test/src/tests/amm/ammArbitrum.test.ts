import BigNumber from 'bignumber.js';

import {TestContractAPI, ACCOUNTS, defaultSeedPath, loadSeed} from '@augurproject/tools';
import {
  SDKConfiguration,
} from '@augurproject/utils';

import {AMM} from '@augurproject/sdk-lite';
import {makeProvider} from '../../libs';
import {ContractInterfaces} from '@augurproject/core';


describe('AMM Middleware for Arbitrum', () => {
  let john: TestContractAPI;
  let mary: TestContractAPI;
  let bob: TestContractAPI;
  let config: SDKConfiguration;

  function bn(n: string | number | BigNumber): BigNumber {
    return new BigNumber(n);
  }

  beforeAll(async () => {
    const seed = await loadSeed(defaultSeedPath, 'side');
    const provider = await makeProvider(seed, ACCOUNTS);
    config = provider.getConfig();

    john = await TestContractAPI.userWrapper(
      ACCOUNTS[0],
      provider,
      config
    );
    mary = await TestContractAPI.userWrapper(
      ACCOUNTS[1],
      provider,
      config
    );
    bob = await TestContractAPI.userWrapper(
      ACCOUNTS[2],
      provider,
      config
    );
  });

  describe('deploy worked', () => {
    test('config', async () => {
      console.log(JSON.stringify(config, null, 2))
      expect(config.sideChain).toBeTruthy();
      expect(config.sideChain.name).toEqual('arbitrum');
      expect(config.sideChain.uploadBlockNumber).toBeGreaterThan(config.uploadBlockNumber);
    })
  });
});
