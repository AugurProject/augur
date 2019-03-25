import { ACCOUNTS, compileAndDeployToGanache } from "../../libs/LocalAugur";
import {Contracts} from "@augurproject/api/src/api/Contracts";
import { GenericAugurInterfaces } from "@augurproject/core";
import { ContractDependenciesEthers } from "contract-dependencies-ethers";
import { stringTo32ByteHex } from "@augurproject/core/source/libraries/HelperFunctions";
import {ethers} from "ethers";

interface MarketCreatedEvent {
  name: "MarketCreated";
  parameters: {
    market: string;
  };
}

let addresses: any;
let dependencies: ContractDependenciesEthers;
beforeAll(async () => {
  const result = await compileAndDeployToGanache(ACCOUNTS);
  addresses = result.addresses;
  dependencies = result.dependencies;
}, 60000);

let contracts: Contracts<any>;
beforeEach(async () => {
  contracts = new Contracts(addresses, dependencies);
});

test("Contract :: ReputationToken", async () => {
  expect(contracts.reputationToken).toBe(null);

  await contracts.setReputationToken(false);
  expect(contracts.reputationToken).toBeInstanceOf(GenericAugurInterfaces.ReputationToken);

  await contracts.setReputationToken(true);
  expect(contracts.reputationToken).toBeInstanceOf(GenericAugurInterfaces.TestNetReputationToken);

  if (contracts.reputationToken instanceof GenericAugurInterfaces.TestNetReputationToken) {
    const initialBalance = new ethers.utils.BigNumber(await contracts.reputationToken.balanceOf_(ACCOUNTS[0].publicKey));
    const delta = new ethers.utils.BigNumber("1000");
    await contracts.reputationToken.faucet(delta, {sender: ACCOUNTS[0].publicKey});
    const newBalance = await contracts.reputationToken.balanceOf_(ACCOUNTS[0].publicKey);
    expect(new ethers.utils.BigNumber(newBalance)).toEqual(initialBalance.add(delta));
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

  const endTime = new ethers.utils.BigNumber(Math.round(new Date().getTime() / 1000) + 30 * 24 * 60 * 60);
  const fee = (new ethers.utils.BigNumber(10)).pow(new ethers.utils.BigNumber(16));
  const affiliateFeeDivisor = new ethers.utils.BigNumber(25);
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
    description,
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

  const numticks = new ethers.utils.BigNumber("0x2710");
  await expect(await market.getNumTicks_()).toEqual(numticks);
});
