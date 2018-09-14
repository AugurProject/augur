import * as Knex from "knex";
import * as _ from "lodash";
import { ZERO } from "../constants";
import { numTicksToTickSize } from "../utils/convert-fixed-point-to-decimal";

interface MinimalTradeRow {
  price: BigNumber;
  amount: BigNumber;
  marketId: string;
  outcome: number;
}

interface MarketRow {
  minPrice: BigNumber;
  maxPrice: BigNumber;
  numTicks: BigNumber;
}

function getVolumesFromTrades(marketOutcomes: Array<MinimalTradeRow>, minPrice: BigNumber, tickSize: BigNumber) {
  const volumes = _.reduce(marketOutcomes, (acc, trade) => {
    const fullPrecisionPrice = trade.price.minus(minPrice).dividedBy(tickSize);
    return {
      shareVolume: acc.shareVolume.plus(trade.amount),
      volume: acc.volume.plus(trade.amount.multipliedBy(fullPrecisionPrice)),
    };
  }, { shareVolume: ZERO, volume: ZERO });
  return _.mapValues(volumes, (volume) => volume.toString());
}

exports.up = async (knex: Knex): Promise<any> => {
  const marketShareVolumeCreated = await knex.schema.hasColumn("markets", "shareVolume").then(async(exists) => {
    if (exists) return false;
    await knex.schema.table("markets", (t) => t.string("shareVolume").defaultTo("0"));
    return true;
  });
  const outcomeShareVolumeCreated = await knex.schema.hasColumn("outcomes", "shareVolume").then(async(exists) => {
    if (exists) return false;
    await knex.schema.table("outcomes", (t) => t.string("shareVolume").defaultTo("0"));
    return true;
  });

  if (marketShareVolumeCreated || outcomeShareVolumeCreated) {
    const tradeRows: Array<MinimalTradeRow> = await knex("trades").select(["price", "amount", "marketId", "outcome"]);
    const tradeRowsByMarket = _.groupBy(tradeRows, "marketId" );
    for (const marketId in tradeRowsByMarket) {
      if (!tradeRowsByMarket.hasOwnProperty(marketId)) continue;
      const marketTrades = tradeRowsByMarket[marketId];
      const marketRow: MarketRow = await knex("markets").select("minPrice", "maxPrice", "numTicks").where({ marketId });
      const minPrice = marketRow.minPrice!;
      const maxPrice = marketRow.maxPrice!;
      const numTicks = marketRow.numTicks!;
      const tickSize = numTicksToTickSize(numTicks, minPrice, maxPrice);
      const marketVolumes = getVolumesFromTrades(marketTrades, minPrice, tickSize);
      await knex("markets").update(marketVolumes).where({marketId});
      const outcomeTradesByOutcome = _.groupBy(marketTrades, "outcome");
      for (const outcome in outcomeTradesByOutcome) {
        if (!outcomeTradesByOutcome.hasOwnProperty(outcome)) continue;
        const outcomeTrades = outcomeTradesByOutcome[outcome];
        const tradeVolumes = getVolumesFromTrades(outcomeTrades, minPrice, tickSize);
        await knex("outcomes").update(tradeVolumes).where({marketId, outcome});
      }
    }
  }

};

exports.down = async (knex: Knex): Promise<any> => {
  await knex.schema.table("markets", (table: Knex.CreateTableBuilder): void => {
    table.dropColumn("shareVolume");
  });
  return knex.schema.table("outcomes", (table: Knex.CreateTableBuilder): void => {
    table.dropColumn("shareVolume");
  });
};
