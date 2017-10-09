import * as Knex from "knex";
import { FormattedLog, ErrorCallback } from "../../types";

export function processMarketCreatedLog(db: Knex, trx: Knex.Transaction, log: FormattedLog, callback: ErrorCallback): void {
  const dataToInsert: {} = {
    contract_address:        log.market,
    universe:                log.address,
    market_type:             log.marketType,
    num_outcomes:            log.numOutcomes,
    min_price:               log.minPrice,
    max_price:               log.maxPrice,
    market_creator:          log.marketCreator,
    creation_time:           log.creationTime,
    creation_block_number:   log.blockNumber,
    creation_fee:            log.creationFee,
    market_creator_fee_rate: log.marketCreatorFeeRate,
    topic:                   log.topic,
    tag1:                    log.tag1,
    tag2:                    log.tag2,
    reporting_window:        log.reportingWindow,
    end_time:                log.endTime,
    short_description:       log.shortDescription,
    designated_reporter:     log.designatedReporter,
    resolution_source:       log.resolutionSource
  };
  db.transacting(trx).insert(dataToInsert).into("markets").asCallback((err?: Error|null): void => {
      if (err) return callback(err);
      db.raw(`SELECT popularity FROM topics WHERE topic = ?`, [log.topic]).asCallback((err?: Error|null, row?: {popularity: number}): void => {
        if (err) return callback(err);
        if (row) return callback(null);

        db.insert({topic: log.topic, universe: log.address}).into("topics").asCallback(callback);
      });
  });
}
