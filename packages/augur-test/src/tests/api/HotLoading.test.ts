import { ContractAPI, ACCOUNTS, loadSeedFile, defaultSeedPath } from "@augurproject/tools";
import { BigNumber } from 'bignumber.js';
import { makeProvider } from "../../libs";

let john: ContractAPI;

beforeAll(async () => {
  const seed = await loadSeedFile(defaultSeedPath);
  const provider = await makeProvider(seed, ACCOUNTS);

  john = await ContractAPI.userWrapper(ACCOUNTS[0], provider, seed.addresses);
  await john.approveCentralAuthority();
});

test('Hot Loading :: Get Market Data', async () => {
  const market = await john.createReasonableYesNoMarket();
  await john.getHotLoadingMarketData(market.address);
});
