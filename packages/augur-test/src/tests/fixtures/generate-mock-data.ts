import { writeFileSync } from 'fs';
import * as path from 'path';

import { makeProvider } from '../../libs';
import {
  ContractAPI,
  loadSeedFile,
  ACCOUNTS,
  defaultSeedPath,
} from '@augurproject/tools';

(async () => {
  const seed = await loadSeedFile(defaultSeedPath);
  const provider = await makeProvider(seed, ACCOUNTS);

  const john = await ContractAPI.userWrapper(
    ACCOUNTS[0],
    provider,
    seed.addresses
  );
  await john.approveCentralAuthority();

  await john.createReasonableYesNoMarket();
  await john.createReasonableYesNoMarket();

  const logs = await provider.getLogs({
    fromBlock: '0x0',
    toBlock: 'latest',
  });

  const data = JSON.stringify(logs, null, 2);

  writeFileSync(
    path.resolve('./src/tests/fixtures/scenario-1.json'),
    data
  );
})().catch(e => console.error(e));
