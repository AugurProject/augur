#!/usr/bin/env ts-node

import { EthersProvider } from "@augurproject/ethersjs-provider";
import { AccountList, ContractAPI, ACCOUNTS, deployContracts} from "../libs";
import { BigNumber as DecimalBigNumber } from "bignumber.js";
import { BigNumber } from "ethers/utils";
import { ContractAddresses, Contracts as compilerOutput } from "@augurproject/artifacts";
import { stringTo32ByteHex } from "@augurproject/core/source/libraries/HelperFunctions";
import { NULL_ADDRESS } from "../libs/Utils";
import { cannedMarkets, CannedMarket, OrderBook } from "./data/canned-markets";
import { GenericAugurInterfaces } from "@augurproject/core";
import { numTicksToTickSize, convertDisplayAmountToOnChainAmount, convertDisplayPriceToOnChainPrice } from "@augurproject/sdk";
import { ArgumentParser } from "argparse";

async function createCannedMarket(person: ContractAPI, can: CannedMarket): Promise<GenericAugurInterfaces.Market<BigNumber>> {
  const contracts = person.augur.contracts;
  const universe = contracts.universe;

  const {endTime, affiliateFeeDivisor } = can;
  const feePerEthInWei = new BigNumber(10).pow(16);
  const designatedReporter = person.account;

  let market: GenericAugurInterfaces.Market<BigNumber>;
  switch (can.marketType) {
    case "yesNo":
      market = await person.createYesNoMarket(
        universe,
        new BigNumber(endTime),
        feePerEthInWei,
        new BigNumber(affiliateFeeDivisor),
        designatedReporter,
        can.topic,
        JSON.stringify(can.extraInfo)
      );
      break;
    case "scalar":
      if (!can.minPrice || !can.maxPrice || !can.tickSize) {
        throw Error(`Scalar market must have minPrice, maxPrice, and tickSize.`);
      }

      const minPrice = new DecimalBigNumber(can.minPrice);
      const maxPrice = new DecimalBigNumber(can.maxPrice);
      const tickSize = new DecimalBigNumber(can.tickSize);
      const numTicks = maxPrice.minus(minPrice).div(tickSize);

      market = await person.createScalarMarket(
        universe,
        new BigNumber(endTime),
        feePerEthInWei,
        new BigNumber(affiliateFeeDivisor),
        designatedReporter,
        [dbn2bn(minPrice), dbn2bn(maxPrice)],
        dbn2bn(numTicks),
        can.topic,
        JSON.stringify(can.extraInfo)
      );
      break;
    case "categorical":
      if (typeof can.outcomes === "undefined") {
        throw Error(`CannedMarket.outcomes must not be undefined in a scalar market`);
      }
      market = await person.createCategoricalMarket(
        universe,
        new BigNumber(endTime),
        feePerEthInWei,
        new BigNumber(affiliateFeeDivisor),
        designatedReporter,
        can.outcomes,
        can.topic,
        JSON.stringify(can.extraInfo)
      );
      break;
    default:
      throw Error(`Invalid CannedMarket.marketType "${can.marketType}"`);
  }

  return market;
}

function generateRandom32ByteHex() {
  return stringTo32ByteHex(String(Date.now()));
}

function dbn2bn (dbn: DecimalBigNumber): BigNumber {
  return new BigNumber(dbn.toFixed());
}

async function placeOrder(person: ContractAPI,
                          market: GenericAugurInterfaces.Market<BigNumber>,
                          can: CannedMarket,
                          tradeGroupId: string,
                          outcome: BigNumber,
                          orderType: BigNumber,
                          shares: DecimalBigNumber,
                          price: DecimalBigNumber) {
  const tickSize = can.tickSize
    ? new DecimalBigNumber(can.tickSize)
    : numTicksToTickSize(new DecimalBigNumber("10000"), new DecimalBigNumber("0"), new DecimalBigNumber("0x0de0b6b3a7640000"));

  const minPrice = new DecimalBigNumber(can.minPrice || 0);

  const attoShares = dbn2bn(convertDisplayAmountToOnChainAmount(shares, tickSize));
  const attoPrice = dbn2bn(convertDisplayPriceToOnChainPrice(price, minPrice, tickSize));
  const betterOrderId = stringTo32ByteHex("");
  const worseOrderId = stringTo32ByteHex("");

  return await person.placeOrder(
    market.address,
    orderType,
    attoShares,
    attoPrice,
    outcome,
    betterOrderId,
    worseOrderId,
    tradeGroupId,
  );
}

async function createOrderBook(person: ContractAPI, market: GenericAugurInterfaces.Market<BigNumber>, can: CannedMarket) {
  const tradeGroupId = generateRandom32ByteHex();

  for (let a = 0; a < Object.keys(can.orderBook).length; a++) {
    const outcome = Object.keys(can.orderBook)[a];
    const buySell = Object.values(can.orderBook)[a];

    const { buy, sell } = buySell;

    for (const { shares, price } of buy) {
      const buyOrderType = new BigNumber(0);
      await placeOrder(person, market, can, tradeGroupId, new BigNumber(outcome), buyOrderType, new DecimalBigNumber(shares), new DecimalBigNumber(price));
    }

    for (const { shares, price } of sell) {
      const sellOrderType = new BigNumber(1);
      await placeOrder(person, market, can, tradeGroupId, new BigNumber(outcome), sellOrderType, new DecimalBigNumber(shares), new DecimalBigNumber(price));
    }
  }
}

export async function createCannedMarketsAndOrders(accounts: AccountList, provider: EthersProvider, addresses: ContractAddresses) {
  const person = await ContractAPI.userWrapper(accounts, 0, provider, addresses);
  await person.approveCentralAuthority();

  for (const can of cannedMarkets) {
    const market = await createCannedMarket(person, can);
    await createOrderBook(person, market, can);
    await verifyOrderBook(person, market.address, can.orderBook);
  }
}

enum OrderType {
  bid = 0,
  ask = 1,

  buy = 0,
  sell = 1,
}

function getBestOrder(person: ContractAPI, marketAddress: string, orderType: OrderType, outcome: string) {
  return person.augur.contracts.orders.getBestOrderId_(new BigNumber(orderType), marketAddress, new BigNumber(outcome), NULL_ADDRESS);
}

function verifyOrderBook(person: ContractAPI, marketAddress: string, orderBook: OrderBook) {
  return Promise.all(Object.keys(orderBook).map(async (outcome) => {
    const bestBid = await getBestOrder(person, marketAddress, OrderType.bid, outcome);
    const bestAsk = await getBestOrder(person, marketAddress, OrderType.ask, outcome);

    console.log("verify", marketAddress, outcome, bestBid, bestAsk);

    // expect((new BigNumber(bestBid)).eq(0x0)).toEqual(false);
    // expect((new BigNumber(bestAsk)).eq(0x0)).toEqual(false);
  }));
}

function parse() {
  const parser = new ArgumentParser({
    version: "1.0.0",
    addHelp: true,
    description: "Populate blockchain with test markets and orders.",
  });

  parser.addArgument(
    ["--network"],
    {
      help: "specify blockchain network number",
    },
  );

  return parser.parseArgs();
}

async function main() {
  const args = parse();
  console.log(args);

  const { provider, addresses } = await deployContracts(ACCOUNTS, compilerOutput);

  await createCannedMarketsAndOrders(ACCOUNTS, provider, addresses);
}

if (require.main === module) {
  main();
}
