import { ACCOUNTS, defaultSeedPath, loadSeed } from '@augurproject/tools';
import { TestContractAPI } from '@augurproject/tools';
import { makeProvider } from '../../libs';
import { BigNumber } from 'bignumber.js';

let john: TestContractAPI;

beforeAll(async () => {
  const seed = await loadSeed(defaultSeedPath);
  const provider = await makeProvider(seed, ACCOUNTS);

  john = await TestContractAPI.userWrapper(
    ACCOUNTS[0],
    provider,
    provider.getConfig()
  );
});

test('Uniswap :: Token Exchange', async () => {
  const cash = john.augur.contracts.cash;
  const rep = john.augur.contracts.getReputationToken();
  const uniswap = john.augur.uniswap;

  const approvalAmount = (new BigNumber(2)).pow(255);
  // These amounts are intended to be the same as in deployment
  const cashAmount = new BigNumber(100 * 10**18);
  const repAmount = new BigNumber(10 * 10**18);

  await cash.faucet(cashAmount);
  await rep['faucet'](repAmount);
  await cash.approve(john.augur.contracts.uniswap.address, approvalAmount);
  await rep.approve(john.augur.contracts.uniswap.address, approvalAmount);

  // Check the exchange rate from when liquidity was added in deployment
  const exchangeRate = await uniswap.getExchangeRate(rep.address, cash.address);
  const expectedExchangeRate = repAmount.div(cashAmount).toString();
  await expect(exchangeRate.toString()).toEqual(expectedExchangeRate.toString());

  // Buy Exactly .1 REP
  const exactRep = new BigNumber(10**17);
  const maxDAI = new BigNumber(1.1 * 10**18);
  await cash.faucet(maxDAI);
  await uniswap.swapTokensForExactTokens(cash.address, rep.address, maxDAI, exactRep);

  // Buy some REP with exactly 1 Dai
  const exactDAI = new BigNumber(10**18);
  const minRep = new BigNumber(.95 * 10**17);
  await cash.faucet(exactDAI);
  await uniswap.swapExactTokensForTokens(cash.address, rep.address, exactDAI, minRep);
});
