import { ACCOUNTS, FlashSession, addScripts, addGanacheScripts } from "@augurproject/tools";
import { GenericAugurInterfaces } from "@augurproject/core";
import { BigNumber } from "bignumber.js";

type Market = GenericAugurInterfaces.Market<BigNumber>;

let flash: FlashSession;

beforeAll(async () => {
  flash = new FlashSession(ACCOUNTS);
  addScripts(flash);
  addGanacheScripts(flash);
});

test("flash :: create canned markets", async () => {
  await flash.call("ganache", { "internal": "true"});
  const markets = await flash.call("create-canned-markets-and-orders", {}) as unknown as Market[];

  await expect(markets.length).toEqual(20);
  await expect(await markets[0].getUniverse_()).toEqual(flash.user.augur.contracts.universe.address);
}, 600000);
