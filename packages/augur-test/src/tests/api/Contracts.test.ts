import { ACCOUNTS, deployContracts } from "../../libs";
import { Contracts } from "@augurproject/sdk/build/api/Contracts";
import { GenericAugurInterfaces } from "@augurproject/core";
import { ContractDependenciesEthers } from "contract-dependencies-ethers";
import { stringTo32ByteHex } from "@augurproject/core/build/libraries/HelperFunctions";
import { ethers } from "ethers";
import { BigNumber } from "bignumber.js";
import { ContractAddresses, Contracts as compilerOutput } from "@augurproject/artifacts";

interface MarketCreatedEvent {
  name: "MarketCreated";
  parameters: {
    market: string;
  };
}

let addresses: ContractAddresses;
let dependencies: ContractDependenciesEthers;
let contracts: Contracts;
beforeAll(async () => {
  const result = await deployContracts(ACCOUNTS, compilerOutput);
  addresses = result.addresses;
  dependencies = result.dependencies;
  contracts = new Contracts(addresses, dependencies);
}, 120000);

test("Contract :: ReputationToken", async () => {
  expect(contracts.reputationToken).toBe(null);

  await contracts.setReputationToken("1");  // "1" -> production network
  expect(contracts.reputationToken).toBeInstanceOf(GenericAugurInterfaces.ReputationToken);

  await contracts.setReputationToken("2");  // not-"1" -> test network
  expect(contracts.reputationToken).toBeInstanceOf(GenericAugurInterfaces.TestNetReputationToken);

  if (contracts.reputationToken instanceof GenericAugurInterfaces.TestNetReputationToken) {
    const initialBalance = new BigNumber(await contracts.reputationToken.balanceOf_(ACCOUNTS[0].publicKey));
    const delta = new BigNumber("1000");
    await contracts.reputationToken.faucet(delta, {sender: ACCOUNTS[0].publicKey});
    const newBalance = await contracts.reputationToken.balanceOf_(ACCOUNTS[0].publicKey);
    expect(new BigNumber(newBalance)).toEqual(initialBalance.plus(delta));
  }
});

test("Contract :: Cash", async () => {
  const cash = contracts.cash;
  const universe = contracts.universe;
  const marketCreationCost = await universe.getOrCacheMarketCreationCost_();
  await cash.faucet(marketCreationCost, { sender: ACCOUNTS[0].publicKey });
  await cash.approve(addresses.Augur, marketCreationCost, { sender: ACCOUNTS[0].publicKey });
  expect((await cash.allowance_(ACCOUNTS[0].publicKey, addresses.Augur))).toEqual(marketCreationCost);
});

test("Contract :: Universe :: Create Market", async() => {
  const cash = contracts.cash;
  const universe = contracts.universe;
  const marketCreationCost = await universe.getOrCacheMarketCreationCost_();
  await cash.faucet(marketCreationCost, { sender: ACCOUNTS[0].publicKey });
  await cash.approve(addresses.Augur, marketCreationCost, { sender: ACCOUNTS[0].publicKey });

  const endTime = new BigNumber(Math.round(new Date().getTime() / 1000) + 30 * 24 * 60 * 60);
  const fee = (new BigNumber(10)).pow(16);
  const affiliateFeeDivisor = new BigNumber(25);
  const outcomes: Array<string> = [stringTo32ByteHex("big"), stringTo32ByteHex("small")];
  const topic = stringTo32ByteHex("boba");
  const description = "Will big or small boba be the most popular in 2019?";
  const extraInfo = "";
  const maybeMarketCreatedEvent = (await universe.createCategoricalMarket(
    endTime,
    fee,
    affiliateFeeDivisor,
    ACCOUNTS[0].publicKey,
    outcomes,
    topic,
    extraInfo,
    { sender: ACCOUNTS[0].publicKey },
  )).pop();

  if (typeof(maybeMarketCreatedEvent) === "undefined") {
    throw Error("universe.createCategoricalMarket(...) returned no logs");
  } else if (maybeMarketCreatedEvent.name !== "MarketCreated") {
    throw Error(`Expected "MarketCreated" log but got ${maybeMarketCreatedEvent.name}`);
  }

  const marketCreatedEvent = maybeMarketCreatedEvent as MarketCreatedEvent;

  const marketAddress = marketCreatedEvent.parameters.market;
  const market = contracts.marketFromAddress(marketAddress);

  const numticks = new BigNumber(100);
  await expect(await market.getNumTicks_()).toEqual(numticks);
}, 15000);
