#!/usr/bin/env ts-node

import { BigNumber } from "bignumber.js";
import { formatBytes32String } from "ethers/utils";

import { EthersProvider } from "@augurproject/ethersjs-provider";
import { GenericAugurInterfaces } from "@augurproject/core";
import { ContractAddresses } from "@augurproject/artifacts";
import { numTicksToTickSize, convertDisplayAmountToOnChainAmount, convertDisplayPriceToOnChainPrice, QUINTILLION } from "@augurproject/sdk";

import { AccountList, ContractAPI } from "../libs";
import { cannedMarkets, CannedMarket } from "./data/canned-markets";

async function createCannedMarket(person: ContractAPI, can: CannedMarket): Promise<GenericAugurInterfaces.Market<BigNumber>> {
  console.log("CREATING CANNED MARKET: ", can.extraInfo.description);
  const { endTime, affiliateFeeDivisor } = can;
  const feePerEthInWei = new BigNumber(10).pow(16);
  const designatedReporter = person.account;

  let market: GenericAugurInterfaces.Market<BigNumber>;
  switch (can.marketType) {
    case "yesNo":
      market = await person.createYesNoMarket({
        endTime: new BigNumber(endTime),
        feePerCashInAttoCash: feePerEthInWei,
        affiliateFeeDivisor: new BigNumber(affiliateFeeDivisor),
        designatedReporter,
        topic: can.topic,
        extraInfo: JSON.stringify(can.extraInfo),
      });
      break;
    case "scalar":
      if (!can.minPrice || !can.maxPrice || !can.tickSize) {
        throw Error(`Scalar market must have minPrice, maxPrice, and tickSize.`);
      }

      const minDisplayPrice = new BigNumber(can.minPrice);
      const maxDisplayPrice = new BigNumber(can.maxPrice);
      const tickSize = new BigNumber(can.tickSize).times(QUINTILLION);

      const minPrice = minDisplayPrice.times(QUINTILLION);
      const maxPrice = maxDisplayPrice.times(QUINTILLION);
      const numTicks = maxPrice.minus(minPrice).div(tickSize);

      market = await person.createScalarMarket({
        endTime: new BigNumber(endTime),
        feePerCashInAttoCash: feePerEthInWei,
        affiliateFeeDivisor: new BigNumber(affiliateFeeDivisor),
        designatedReporter,
        prices: [minPrice, maxPrice],
        numTicks,
        topic: can.topic,
        extraInfo: JSON.stringify(can.extraInfo),
      });
      break;
    case "categorical":
      if (typeof can.outcomes === "undefined") {
        throw Error(`CannedMarket.outcomes must not be undefined in a scalar market`);
      }
      market = await person.createCategoricalMarket({
        endTime: new BigNumber(endTime),
        feePerCashInAttoCash: feePerEthInWei,
        affiliateFeeDivisor: new BigNumber(affiliateFeeDivisor),
        designatedReporter,
        outcomes: can.outcomes,
        topic: can.topic,
        extraInfo: JSON.stringify(can.extraInfo),
      });
      break;
    default:
      throw Error(`Invalid CannedMarket.marketType "${can.marketType}"`);
  }

  console.log(`MARKET CREATED: ${market.address}`);
  return market;
}

function generateRandom32ByteHex() {
  return formatBytes32String(String(Date.now()));
}

async function placeOrder(person: ContractAPI,
                          market: GenericAugurInterfaces.Market<BigNumber>,
                          can: CannedMarket,
                          tradeGroupId: string,
                          outcome: BigNumber,
                          orderType: BigNumber,
                          shares: BigNumber,
                          price: BigNumber) {
  const tickSize = can.tickSize
    ? new BigNumber(can.tickSize)
    : numTicksToTickSize(new BigNumber("100"), new BigNumber("0"), new BigNumber("0x0de0b6b3a7640000"));

  const minDisplayPrice = new BigNumber(can.minPrice || "0");
  const attoShares = convertDisplayAmountToOnChainAmount(shares, tickSize);
  const attoPrice = convertDisplayPriceToOnChainPrice(price, minDisplayPrice, tickSize);
  const betterOrderId = formatBytes32String("");
  const worseOrderId = formatBytes32String("");

  console.log("Shares:", attoShares.toString());
  console.log("Price:", attoPrice.toString());

  return person.placeOrder(
    market.address,
    orderType,
    attoShares,
    attoPrice,
    outcome,
    betterOrderId,
    worseOrderId,
    tradeGroupId
  );
}

async function createOrderBook(person: ContractAPI, market: GenericAugurInterfaces.Market<BigNumber>, can: CannedMarket) {
  const tradeGroupId = generateRandom32ByteHex();

  for (let a = 0; a < Object.keys(can.orderBook).length; a++) {
    const outcome = Object.keys(can.orderBook)[a];
    const buySell = Object.values(can.orderBook)[a];

    const { buy, sell } = buySell;

    const promises = [];

    for (const { shares, price } of buy) {
      const buyOrderType = new BigNumber(0);
      promises.push(placeOrder(person, market, can, tradeGroupId, new BigNumber(outcome), buyOrderType, new BigNumber(shares), new BigNumber(price)));
    }

    for (const { shares, price } of sell) {
      const sellOrderType = new BigNumber(1);
      promises.push(placeOrder(person, market, can, tradeGroupId, new BigNumber(outcome), sellOrderType, new BigNumber(shares), new BigNumber(price)));
    }

    await Promise.all(promises);
  }
}

export async function createCannedMarketsAndOrders(accounts: AccountList, provider: EthersProvider, addresses: ContractAddresses) {
  const person = await ContractAPI.userWrapper(accounts, 0, provider, addresses);
  await person.approveCentralAuthority();

  await person.faucet(new BigNumber(10).pow(18).multipliedBy(1000000));

  await Promise.all(cannedMarkets.map(async (can) => {
    const market = await createCannedMarket(person, can);
    await createOrderBook(person, market, can);
  }));
}
