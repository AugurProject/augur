import { groupTypes } from '@augurproject/artifacts';
import Dexie from 'dexie';
import * as t from 'io-ts';
import * as _ from 'lodash';
import { Augur } from '../../Augur';
import { DB } from '../db/DB';
import { MarketData } from '../logs/types';
import { GetMaxLiquiditySpread } from './Markets';
import { Getter } from './Router';

// From: https://bl.ocks.org/joyrexus/9837596
function nest(seq, keys) {
  if (!keys.length) return seq;
  const first = keys[0];
  const rest = keys.slice(1);
  return _.mapValues(_.groupBy(seq, first), value => {
    return nest(value, rest);
  });
}

interface BaseItem<OutcomeLayout> {
  groupType: groupTypes;
  outcomes: OutcomeLayout[];
  label: string;
  volume: string;
  associatedMarketId: string[];
}

// Any additional info for a given "tile" square would be a specialized version of this.
interface OutcomeLayout {
  magnitude: number;
  volume: number;
}

interface MoneyLineItem extends BaseItem<OutcomeLayout> {
  groupType: groupTypes.MONEY_LINE;
}

interface OverUnderItem extends BaseItem<OutcomeLayout> {
  groupType: groupTypes.OVER_UNDER;
}

interface SpreadMarketItem extends BaseItem<OutcomeLayout> {
  groupType: groupTypes.SPREAD;
}

type AggregatedMarkets = MoneyLineItem | OverUnderItem | SpreadMarketItem;

// These results will be an group by type.
export interface MegaBettingMarketsInfo {
  // This is the megatemplate hash.
  id: string;
  aggregatedMarkets: AggregatedMarkets[];
  additionalMarkets: OverUnderItem[];
}

export class Betting {
  static readonly getBettingMarketsParams = t.intersection([
    t.type({
      universe: t.string,
    }),
    t.partial({
      creator: t.string,
      search: t.string,
      reportingStates: t.array(t.string),
      maxEndTime: t.number,

      // How will this work with rolled up markets.
      maxLiquiditySpread: GetMaxLiquiditySpread,
      includeInvalidMarkets: t.boolean,
      categories: t.array(t.string),

      // Is this needed for betting ui?
      userPortfolioAddress: t.string,
    }),
  ]);
  @Getter('getBettingMarketsParams')
  static async getBettingMarkets(
    augur: Augur,
    db: DB,
    { universe }: t.TypeOf<typeof Betting.getBettingMarketsParams>
  ): Promise<MegaBettingMarketsInfo[]> {
    const dbResults = await db.Markets.where(
      '[universe+templateGroupHash+templateGroupType]'
    )
      .between(
        [universe, Dexie.minKey, Dexie.minKey],
        [universe, Dexie.maxKey, Dexie.maxKey]
      )
      .toArray();

    const nestedResults = nest(dbResults, [
      'templateGroupHash',
      'templateGroupType',
    ]);

    console.log(
      'await db.CurrentOrders.toArray()',
      JSON.stringify(await db.CurrentOrders.toArray())
    );

    console.log(
      'await db.ZeroXOrders.toArray()',
      JSON.stringify(await db.ZeroXOrders.toArray())
    );

    const results: MegaBettingMarketsInfo[] = [];
    for (const [templateGroupHash, templateGroup] of Object.entries(
      nestedResults
    )) {
      // MEGA TEMPLATES:
      // Now we need to build the mega "tiles".
      // 0. Grab just the _MEGA suffix templates.
      // 1. Grab the outcome descriptions from money line template. (What to do if there isn't one?)
      // 2. Need to map the mega outcomes together.
      // 3. Append the over/under markets.
      const aggregatedMarkets: AggregatedMarkets[] = [];
      for (const [templateGroupType, markets] of Object.entries(
        templateGroup
      )) {
        // Need to treat each type differently here:
        switch (templateGroupType) {
          case groupTypes.DAILY_OVER_UNDER:
            processOverUnderMega(augur, db, markets);
            break;
          case groupTypes.DAILY_MONEY_LINE:
            processMoneyLineMega(augur, db, markets);
            break;
          case groupTypes.DAILY_SPREAD:
            processSpreadMega(augur, db, markets);
            break;
          default:
          // Nothing to do.
        }
      }

      // Non-mega templates
      const additionalMarkets: OverUnderItem[] = [];

      results.push({
        id: templateGroupHash,
        aggregatedMarkets,
        additionalMarkets,
      });
    }

    return results;
  }
}

function processMoneyLineMega(augur: Augur, db: DB, markets: MarketData[]) {}
function processOverUnderMega(augur: Augur, db: DB, markets: MarketData[]) {}
function processSpreadMega(augur: Augur, db: DB, markets: MarketData[]) {}
