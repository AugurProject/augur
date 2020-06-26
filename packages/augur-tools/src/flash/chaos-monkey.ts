import { Augur } from '@augurproject/sdk';
import { SubscriptionEventName } from '@augurproject/sdk-lite';
import { MarketInfo } from '@augurproject/sdk-lite';
import { MarketTradingPosition } from '@augurproject/sdk/build/state/getter/Users';
import { BigNumber } from 'bignumber.js';
import { ContractAPI } from '..';
import { orderFirehose } from './order-firehose';
import { randomBoolean, randomSelect } from './util';

abstract class Persona {
  constructor(protected user: ContractAPI, protected augur: Augur) {
  }

  async trade(): Promise<void> {
    // Identify markets we want to trade.
    const markets = await this.marketsToTrade();
    const universe = this.augur.contracts.universe.address;

    const positions = await this.augur.getUserTradingPositions({
      account: this.user.account.address,
      universe,
    });

    // Craft and submit trades.
    for(const market of markets) {
      await this.executeTrades(market, positions.tradingPositionsPerMarket[market.id])
    }
  }

  abstract executeTrades(marketInfo:MarketInfo, positions: MarketTradingPosition);

  /**
   * Query for markets we care about.
   */
  abstract marketsToTrade(): Promise<MarketInfo[]>;
}

class FirehosePersona extends Persona {
  async executeTrades(marketInfo: MarketInfo, positions: MarketTradingPosition) {
    const displayMaxPrice = new BigNumber(marketInfo.maxPrice);
    const displayMinPrice = new BigNumber(marketInfo.minPrice);

    // select outcome.
    const outcome = randomSelect(marketInfo.outcomes);
    await orderFirehose(
      [marketInfo]
      , [
      outcome.id
    ], 1,
      20,
      1,
      10,
      (await this.user.getTimestamp()).plus(300),
      true,
      [this.user]
      )
  }

  async marketsToTrade() {
    const universe = this.augur.contracts.universe.address;

    const {markets = [] } = await this.augur.getMarkets({
      universe,
    });

    return markets.filter(randomBoolean);
  }
}

// Initially we will not have any market makers, just traders.
class ChaosMonkey {
  private personas: Persona[] = [];

  constructor(private augur:Augur, users: ContractAPI[]) {
    for(const user of users) {
      // For now we will just Use the FirehosePersona. Need to figure how to add more.
      this.personas.push(new FirehosePersona(user, augur));
    }
  }

  async run() {
    return this.personas.map((persona) => persona.trade())
  }
}

export const runChaosMonkey = async (augur: Augur, users:ContractAPI[] = []) => {
  const chaosMonkey = new ChaosMonkey(augur, users);
  augur.events.on(SubscriptionEventName.NewBlock, async () => {
    const universe = augur.contracts.universe.address;
    const {markets = [] } = await augur.getMarkets({
      universe,
    });

    chaosMonkey.run();

  });
};
