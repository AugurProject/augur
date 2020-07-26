import { cannedMarkets, singleOutcomeAsks, singleOutcomeBids } from './data/canned-markets';
import { BigNumber } from 'bignumber.js';
import { formatBytes32String } from 'ethers/utils';
import { QUINTILLION, numTicksToTickSizeWithDisplayPrices } from '@augurproject/sdk';
import { ContractAPI } from '..';

const MILLION = QUINTILLION.multipliedBy(1000000);

export async function createYesNoZeroXOrders(
  user: ContractAPI,
  market: string,
  skipFaucetApproval: boolean,
) {
  if (!skipFaucetApproval) {
    await user.faucetCashUpTo(MILLION, MILLION);
    await user.approve();
  }
  const yesNoMarket = cannedMarkets.find(c => c.marketType === 'yesNo');
  const orderBook = yesNoMarket.orderBook;
  const timestamp = await user.getTimestamp();
  const tradeGroupId = String(Date.now());
  const oneHundredDays = new BigNumber(8640000);
  const expirationTime = new BigNumber(timestamp).plus(oneHundredDays);
  const orders = [];
  for (let a = 0; a < Object.keys(orderBook).length; a++) {
    const outcome = Number(Object.keys(orderBook)[a]) as 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
    const buySell = Object.values(orderBook)[a];

    const { buy, sell } = buySell;

    for (const { shares, price } of buy) {
      console.log(`creating buy order, ${shares} @ ${price}`);
      orders.push({
        direction: 0,
        market,
        numTicks: new BigNumber(1000),
        numOutcomes: 3,
        outcome,
        tradeGroupId,
        fingerprint: formatBytes32String('11'),
        doNotCreateOrders: false,
        displayMinPrice: new BigNumber(0),
        displayMaxPrice: new BigNumber(1),
        displayAmount: new BigNumber(shares),
        displayPrice: new BigNumber(price),
        displayShares: new BigNumber(0),
        expirationTime,
      });
    }

    for (const { shares, price } of sell) {
      console.log(`creating sell order, ${shares} @ ${price}`);
      orders.push({
        direction: 1,
        market,
        numTicks: new BigNumber(1000),
        numOutcomes: 3,
        outcome,
        tradeGroupId,
        fingerprint: formatBytes32String('11'),
        doNotCreateOrders: false,
        displayMinPrice: new BigNumber(0),
        displayMaxPrice: new BigNumber(1),
        displayAmount: new BigNumber(shares),
        displayPrice: new BigNumber(price),
        displayShares: new BigNumber(0),
        expirationTime,
      });
    }
  }

  await user.placeZeroXOrders(orders).catch(console.error);
}

export async function createCatZeroXOrders(
  user: ContractAPI,
  market: string,
  skipFaucetApproval: boolean,
  numOutcomes: number = 3,
) {
  if (!skipFaucetApproval) {
    await user.faucetCashUpTo(MILLION, MILLION);
    await user.approve();
  }

  const orderBook = {
    1: {
      buy: singleOutcomeBids,
      sell: singleOutcomeAsks,
    },
    2: {
      buy: singleOutcomeBids,
      sell: singleOutcomeAsks,
    },
    3: {
      buy: singleOutcomeBids,
      sell: singleOutcomeAsks,
    },
    4: {
      buy: singleOutcomeBids,
      sell: singleOutcomeAsks,
    },
    5: {
      buy: singleOutcomeBids,
      sell: singleOutcomeAsks,
    },
    6: {
      buy: singleOutcomeBids,
      sell: singleOutcomeAsks,
    },
    7: {
      buy: singleOutcomeBids,
      sell: singleOutcomeAsks,
    },
  };

  const timestamp = await user.getTimestamp();
  const tradeGroupId = String(Date.now());
  const oneHundredDays = new BigNumber(8640000);
  const expirationTime = new BigNumber(timestamp).plus(oneHundredDays);
  const orders = [];
  for (let a = 0; a < numOutcomes; a++) {
    const outcome = Number(Object.keys(orderBook)[a]) as 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
    const buySell = Object.values(orderBook)[a];

    const { buy, sell } = buySell;

    for (const { shares, price } of buy) {
      console.log(`creating buy order, ${shares} @ ${price}`);
      orders.push({
        direction: 0,
        market,
        numTicks: new BigNumber(1000),
        numOutcomes: numOutcomes,
        outcome,
        tradeGroupId,
        fingerprint: formatBytes32String('11'),
        doNotCreateOrders: false,
        displayMinPrice: new BigNumber(0),
        displayMaxPrice: new BigNumber(1),
        displayAmount: new BigNumber(shares),
        displayPrice: new BigNumber(price),
        displayShares: new BigNumber(0),
        expirationTime,
      });
    }

    for (const { shares, price } of sell) {
      console.log(`creating sell order, ${shares} @ ${price}`);
      orders.push({
        direction: 1,
        market,
        numTicks: new BigNumber(1000),
        numOutcomes: 3,
        outcome,
        tradeGroupId,
        fingerprint: formatBytes32String('11'),
        doNotCreateOrders: false,
        displayMinPrice: new BigNumber(0),
        displayMaxPrice: new BigNumber(1),
        displayAmount: new BigNumber(shares),
        displayPrice: new BigNumber(price),
        displayShares: new BigNumber(0),
        expirationTime,
      });
    }
  }
  await user.placeZeroXOrders(orders).catch(console.error);
}

export async function createSingleCatZeroXOrder(
  user: ContractAPI,
  market: string,
  skipFaucetApproval: boolean,
  numOutcomes: number,
  direction: number,
  price: string,
  shares: string,
  outcome: number,
) {
  if (!skipFaucetApproval) {
    await user.faucetCashUpTo(MILLION, MILLION);
    await user.approve();
  }

  const timestamp = await user.getTimestamp();
  const tradeGroupId = String(Date.now());
  const oneHundredDays = new BigNumber(8640000);
  const expirationTime = new BigNumber(timestamp).plus(oneHundredDays);
  const orders = [];
  console.log(`creating ${direction} order, ${shares} @ ${price}`);
  orders.push({
    direction,
    market,
    numTicks: new BigNumber(1000),
    numOutcomes: numOutcomes,
    outcome,
    tradeGroupId,
    fingerprint: formatBytes32String('11'),
    doNotCreateOrders: false,
    displayMinPrice: new BigNumber(0),
    displayMaxPrice: new BigNumber(1),
    displayAmount: new BigNumber(shares),
    displayPrice: new BigNumber(price),
    displayShares: new BigNumber(0),
    expirationTime,
  });

  await user.placeZeroXOrders(orders).catch(console.error);
}

export async function createScalarZeroXOrders(
  user: ContractAPI,
  market: string,
  skipFaucetApproval: boolean,
  onInvalid: boolean,
  numTicks: BigNumber,
  minPrice: BigNumber,
  maxPrice: BigNumber,
) {
  if (!skipFaucetApproval) {
    await user.faucetCashUpTo(MILLION, MILLION);
    await user.approve();
  }

  const timestamp = await user.getTimestamp();
  const tradeGroupId = String(Date.now());
  const oneHundredDays = new BigNumber(8640000);
  const tickSize = numTicksToTickSizeWithDisplayPrices(numTicks, minPrice, maxPrice);
  const midPrice = maxPrice.minus((numTicks.dividedBy(2)).times(tickSize));

  const orderBook = {
    2: {
      sell: [
        { shares: '3', price: midPrice.plus(tickSize.times(3)) },
        { shares: '2', price: midPrice.plus(tickSize.times(2)) },
        { shares: '1', price: midPrice.plus(tickSize) },
      ],
      buy: [
        { shares: '1', price: midPrice.minus(tickSize) },
        { shares: '2', price: midPrice.minus(tickSize.times(2)) },
        { shares: '3', price: midPrice.minus(tickSize.times(3)) },
      ],
    },
  };
  const expirationTime = new BigNumber(timestamp).plus(oneHundredDays);
  const orders = [];
  for (let a = 0; a < Object.keys(orderBook).length; a++) {
    const outcome = !onInvalid ? Number(Object.keys(orderBook)[a]) as 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 : 0;
    const buySell = Object.values(orderBook)[a];

    const { buy, sell } = buySell;

    for (const { shares, price } of buy) {
      console.log(`creating buy order, ${shares} @ ${price}`);
      const order = {
        direction: 0 as 0 | 1,
        market,
        numTicks,
        numOutcomes: 3 as 3 | 4 | 5 | 6 | 7,
        outcome,
        tradeGroupId,
        fingerprint: formatBytes32String('11'),
        doNotCreateOrders: false,
        displayMinPrice: minPrice,
        displayMaxPrice: maxPrice,
        displayAmount: new BigNumber(shares),
        displayPrice: new BigNumber(price),
        displayShares: new BigNumber(0),
        expirationTime,
      };
      console.log(JSON.stringify(order));
      orders.push(order);
    }

    for (const { shares, price } of sell) {
      console.log(`creating sell order, ${shares} @ ${price}`);
      const order = {
        direction: 1 as 0 | 1,
        market,
        numTicks,
        numOutcomes: 3 as 3 | 4 | 5 | 6 | 7,
        outcome,
        tradeGroupId,
        fingerprint: formatBytes32String('11'),
        doNotCreateOrders: false,
        displayMinPrice: minPrice,
        displayMaxPrice: maxPrice,
        displayAmount: new BigNumber(shares),
        displayPrice: new BigNumber(price),
        displayShares: new BigNumber(0),
        expirationTime,
      };
      console.log(JSON.stringify(order));
      orders.push(order);
    }
  }
  await user.placeZeroXOrders(orders).catch(console.error);
}
