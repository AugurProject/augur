import { BigNumber } from 'bignumber.js';
import { ContractAPI } from '..';
import { OrderBookConfig, OrderBookShaper, OrderPriceVol } from './orderbook-shaper';
import { QUINTILLION } from '@augurproject/sdk';
import { cycle, sleep } from './util';

/* Generates orders to replicate a somewhat realistic orderbook.
 *
 * Loops over the users parameter, creating one order per user.
 * Then starts again at the first user.
 */
export async function orderFirehose(
  marketIds: string[],
  orderOutcomes: number[],
  delayBetweenBursts: number,
  numOrderLimit: number,
  burstRounds: number,
  orderSize: number,
  expiration: BigNumber,
  skipFaucetOrApproval: boolean,
  users: ContractAPI[],
) {
  if (users.length === 0) {
    throw Error('orderFirehose users param must contain at least one user');
  }

  const userGenerator = cycle(users);

  if (!skipFaucetOrApproval) {
    console.log('order-firehose, faucet and approval');
    await Promise.all(users.map(async (user) => {
      await user.faucetCashUpTo(QUINTILLION.multipliedBy(10000));
      await user.approveIfNecessary();
    }));
  }
  const config = createTightOrderBookConfig(orderSize);
  const shapers = marketIds.map((m) => new OrderBookShaper(m, null, expiration, orderOutcomes, config));
  for (let roundNumber = 0; roundNumber < burstRounds; roundNumber++) {
    const timestamp = new BigNumber(await users[0].getTimestamp());
    for (let i = 0; i < shapers.length; i++) {
      const shaper: OrderBookShaper = shapers[i];
      const orders = shaper.nextRun({}, timestamp);
      if (orders.length > 0) {
        let totalOrdersCreated = 0;
        while (totalOrdersCreated < numOrderLimit) {
          const ordersLeft = numOrderLimit - totalOrdersCreated;
          const grabAmount = Math.min(ordersLeft, orders.length);
          const createOrders = orders.splice(0, grabAmount); // creates the same orders repeatedly
          createOrders.forEach(order => console.log(`${order.market} Creating ${order.displayAmount} at ${order.displayPrice} on outcome ${order.outcome}`));
          await userGenerator().placeZeroXOrders(createOrders).catch(console.error);
          totalOrdersCreated += createOrders.length;
        }
      }
    }
    if (roundNumber < burstRounds - 1) {
      console.log(`pausing before next burst of ${numOrderLimit} orders, waiting ${delayBetweenBursts} ms`);
      await sleep(delayBetweenBursts);
    }
  }
}

export function createTightOrderBookConfig(orderSize: number): OrderBookConfig {
  const bids: OrderPriceVol = {};
  const asks: OrderPriceVol = {};
  for (let i = 1; i < 49; i++) {
    bids[((0.01 * i).toString().slice(0, 4))] = orderSize
  }
  for (let i = 50; i < 99; i++) {
    asks[((0.01 * i).toString().slice(0, 4))] = orderSize
  }
  return { bids, asks };
}
