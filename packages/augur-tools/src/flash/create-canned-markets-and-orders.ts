import { BigNumber } from 'bignumber.js';
import { formatBytes32String } from 'ethers/utils';

import { GenericAugurInterfaces } from '@augurproject/core';
import { numTicksToTickSize, convertDisplayAmountToOnChainAmount, convertDisplayPriceToOnChainPrice, QUINTILLION } from '@augurproject/sdk';

import { ContractAPI } from '../libs/contract-api';
import { cannedMarkets, CannedMarket, templatedCannedMarkets, templatedCannedBettingMarkets, testBadTemplateMarkets } from './data/canned-markets';
import { _1_ETH } from '../constants';

export type Market = GenericAugurInterfaces.Market<BigNumber>;
export interface CreatedCannedMarket {
  market: Market;
  canned: CannedMarket;
}

async function createCannedMarket(person: ContractAPI, can: CannedMarket, faucet=true): Promise<CreatedCannedMarket> {
  console.log('CREATING CANNED MARKET: ', can.extraInfo.description);

  const { endTime, affiliateFeeDivisor } = can;
  const feePerEthInWei = can.creatorFeeDecimal ? new BigNumber(can.creatorFeeDecimal).times(_1_ETH) : new BigNumber(10).pow(16);
  const designatedReporter = person.account.address;

  let market: Market;
  switch (can.marketType) {
    case 'yesNo':
      market = await person.createYesNoMarket({
        endTime: new BigNumber(endTime),
        feePerCashInAttoCash: feePerEthInWei,
        affiliateFeeDivisor: new BigNumber(affiliateFeeDivisor),
        designatedReporter,
        extraInfo: JSON.stringify(can.extraInfo),
      }, faucet);
      break;
    case 'scalar':
      if (!can.minPrice || !can.maxPrice || !can.tickSize) {
        throw Error('Scalar market must have minPrice, maxPrice, and tickSize.');
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
        extraInfo: JSON.stringify(can.extraInfo),
      }), faucet;
      break;
    case 'categorical':
      if (typeof can.outcomes === 'undefined') {
        throw Error('CannedMarket.outcomes must not be undefined in a categorical market');
      }
      market = await person.createCategoricalMarket({
        endTime: new BigNumber(endTime),
        feePerCashInAttoCash: feePerEthInWei,
        affiliateFeeDivisor: new BigNumber(affiliateFeeDivisor),
        designatedReporter,
        outcomes: can.outcomes,
        extraInfo: JSON.stringify(can.extraInfo),
      }, faucet);
      break;
    default:
      throw Error(`Invalid CannedMarket.marketType "${can.marketType}"`);
  }

  console.log(`MARKET CREATED: ${market.address}`);
  return { market, canned: can };
}

function generateRandom32ByteHex() {
  return formatBytes32String(String(Date.now()));
}

async function placeOrder(person: ContractAPI,
                          market: Market,
                          can: CannedMarket,
                          tradeGroupId: string,
                          outcome: BigNumber,
                          orderType: BigNumber,
                          shares: BigNumber,
                          price: BigNumber): Promise<string> {
  const tickSize = can.tickSize
    ? new BigNumber(can.tickSize)
    : numTicksToTickSize(new BigNumber('100'), new BigNumber('0'), new BigNumber('0x0de0b6b3a7640000'));

  const minDisplayPrice = new BigNumber(can.minPrice || '0');
  const attoShares = convertDisplayAmountToOnChainAmount(shares, tickSize);
  const attoPrice = convertDisplayPriceToOnChainPrice(price, minDisplayPrice, tickSize);
  const betterOrderId = formatBytes32String('');
  const worseOrderId = formatBytes32String('');

  console.log('Shares:', attoShares.toString());
  console.log('Price:', attoPrice.toString());

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

async function createOrderBook(person: ContractAPI, market: Market, can: CannedMarket) {
  const tradeGroupId = generateRandom32ByteHex();

  for (let a = 0; a < Object.keys(can.orderBook).length; a++) {
    const outcome = Object.keys(can.orderBook)[a];
    const buySell = Object.values(can.orderBook)[a];

    const { buy, sell } = buySell;

    for (const { shares, price } of buy) {
      const buyOrderType = new BigNumber(0);
      await placeOrder(person, market, can, tradeGroupId, new BigNumber(outcome), buyOrderType, new BigNumber(shares), new BigNumber(price));
    }

    for (const { shares, price } of sell) {
      const sellOrderType = new BigNumber(1);
      await placeOrder(person, market, can, tradeGroupId, new BigNumber(outcome), sellOrderType, new BigNumber(shares), new BigNumber(price));
    }
  }
}

export async function createCannedMarkets(person: ContractAPI, faucet=true): Promise<CreatedCannedMarket[]> {
  const markets = [];
  for (const can of cannedMarkets) {
    const market = await createCannedMarket(person, can, faucet);
    markets.push(market);
  }
  markets.push(await createTemplatedMarkets(person, faucet));
  return markets;
}

export async function createCannedMarketsAndOnChainOrders(person: ContractAPI, faucet=true): Promise<CreatedCannedMarket[]> {
  const markets = [];
  for (const can of cannedMarkets) {
    const createdMarket = await createCannedMarket(person, can, faucet);
    markets.push(createdMarket.market);
    await createOrderBook(person, createdMarket.market, can);
  }
  return markets;
}


export async function createTemplatedMarkets(person: ContractAPI, faucet=true): Promise<CreatedCannedMarket[]> {
  const markets = [];
  for (const can of templatedCannedMarkets()) {
    const market = await createCannedMarket(person, can, faucet);
    markets.push(market);
  }
  return markets;
}

export async function createTemplatedBettingMarkets(person: ContractAPI, faucet=true): Promise<CreatedCannedMarket[]> {
  const markets = [];
  for (const can of templatedCannedBettingMarkets()) {
    const market = await createCannedMarket(person, can, faucet);
    markets.push(market);
  }
  return markets;
}

export async function createBadTemplatedMarkets(person: ContractAPI, faucet=true): Promise<CreatedCannedMarket[]> {
  const markets = [];
  for (const can of testBadTemplateMarkets()) {
    const market = await createCannedMarket(person, can, faucet);
    markets.push(market);
  }
  return markets;
}
