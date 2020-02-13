import { GenericAugurInterfaces } from '@augurproject/core';
import {
  ACCOUNTS,
  addGanacheScripts,
  addScripts,
  FlashSession,
} from '@augurproject/tools';
import { BigNumber } from 'bignumber.js';

type Market = GenericAugurInterfaces.Market<BigNumber>;

let flash: FlashSession;

beforeAll(async () => {
  flash = new FlashSession(ACCOUNTS);
  addScripts(flash);
  addGanacheScripts(flash);
});

test.skip("flash :: create reasonable market", async () => {
  await flash.call("ganache", { "internal": true });
  await flash.call("load-seed-file", { "use": true });
  const market = await flash.call("create-reasonable-categorical-market", { "outcomes": "music,dance,poetry,oration,drama"}) as unknown as Market;
  await expect(market).toBeDefined();
  await expect(await market.getUniverse_()).toEqual(flash.user.augur.contracts.universe.address);
});
