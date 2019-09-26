import { makeProvider } from "../../libs";
import { Contracts } from '@augurproject/sdk';
import { ACCOUNTS, loadSeedFile, makeSigner, makeDependencies, defaultSeedPath } from '@augurproject/tools';
import { GenericAugurInterfaces } from '@augurproject/core';
import { ContractDependenciesEthers } from 'contract-dependencies-ethers';
import { BigNumber } from 'bignumber.js';
import { formatBytes32String } from "ethers/utils";
import { ContractAddresses } from '@augurproject/artifacts';
import { TestNetReputationToken } from "@augurproject/core/build/libraries/ContractInterfaces";

interface MarketCreatedEvent {
  name: 'MarketCreated';
  parameters: {
    market: string;
  };
}

let addresses: ContractAddresses;
let dependencies: ContractDependenciesEthers;
let contracts: Contracts;
beforeAll(async () => {
  const seed = await loadSeedFile(defaultSeedPath);
  const provider = await makeProvider(seed, ACCOUNTS);
  const signer = await makeSigner(ACCOUNTS[0], provider);
  dependencies = makeDependencies(ACCOUNTS[0], provider, signer);
  addresses = seed.addresses;

  contracts = new Contracts(addresses, dependencies);
});

test('Contract :: ReputationToken', async () => {
  expect(contracts.reputationToken).toBe(null);

  await contracts.setReputationToken('1'); // "1" -> production network
  expect(contracts.reputationToken).toBeInstanceOf(
    GenericAugurInterfaces.ReputationToken
  );

  await contracts.setReputationToken('2'); // not-"1" -> test network
  expect(contracts.reputationToken).toBeInstanceOf(
    GenericAugurInterfaces.TestNetReputationToken
  );

  if (
    contracts.reputationToken instanceof
    GenericAugurInterfaces.TestNetReputationToken
  ) {
    const initialBalance = new BigNumber(
      await contracts.reputationToken.balanceOf_(ACCOUNTS[0].publicKey)
    );
    const delta = new BigNumber('1000');
    await contracts.reputationToken.faucet(delta, {
      sender: ACCOUNTS[0].publicKey,
    });
    const newBalance = await contracts.reputationToken.balanceOf_(
      ACCOUNTS[0].publicKey
    );
    expect(new BigNumber(newBalance)).toEqual(initialBalance.plus(delta));
  }
});

test('Contract :: Cash', async () => {
  const cash = contracts.cash;
  const universe = contracts.universe;
  const marketCreationCost = await universe.getOrCacheValidityBond_();
  await cash.faucet(marketCreationCost, { sender: ACCOUNTS[0].publicKey });
  await cash.approve(addresses.Augur, marketCreationCost, {
    sender: ACCOUNTS[0].publicKey,
  });
  expect(await cash.allowance_(ACCOUNTS[0].publicKey, addresses.Augur)).toEqual(
    marketCreationCost
  );
});

test('Contract :: Universe :: Create Market', async () => {
  const universe = contracts.universe;

  const marketCreationCost = await universe.getOrCacheValidityBond_();
  const cash = contracts.cash;
  await cash.faucet(marketCreationCost, { sender: ACCOUNTS[0].publicKey });
  await cash.approve(addresses.Augur, marketCreationCost, {
    sender: ACCOUNTS[0].publicKey,
  });

  const reputationToken = contracts.getReputationToken() as TestNetReputationToken;
  const repBond = await universe.getOrCacheMarketRepBond_();
  await reputationToken.faucet(repBond);

  const endTime = new BigNumber(
    Math.round(new Date().getTime() / 1000) + 30 * 24 * 60 * 60
  );
  const fee = new BigNumber(10).pow(16);
  const affiliateFeeDivisor = new BigNumber(25);
  const outcomes: string[] = [
    formatBytes32String('big'),
    formatBytes32String('small'),
  ];
  const categories: string[] = [
    'boba',
  ];
  const description = 'Will big or small boba be the most popular in 2019?';
  const extraInfo = JSON.stringify({ description, categories });
  const maybeMarketCreatedEvent = (await universe.createCategoricalMarket(
    endTime,
    fee,
    affiliateFeeDivisor,
    ACCOUNTS[0].publicKey,
    outcomes,
    extraInfo,
    { sender: ACCOUNTS[0].publicKey }
  )).pop();

  if (typeof maybeMarketCreatedEvent === 'undefined') {
    throw Error('universe.createCategoricalMarket(...) returned no logs');
  } else if (maybeMarketCreatedEvent.name !== 'MarketCreated') {
    throw Error(
      `Expected "MarketCreated" log but got ${maybeMarketCreatedEvent.name}`
    );
  }

  const marketCreatedEvent = maybeMarketCreatedEvent as MarketCreatedEvent;

  const marketAddress = marketCreatedEvent.parameters.market;
  const market = contracts.marketFromAddress(marketAddress);

  const numticks = new BigNumber(100);
  await expect(await market.getNumTicks_()).toEqual(numticks);
});
