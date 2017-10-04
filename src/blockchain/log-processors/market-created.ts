import { Database } from "sqlite3";
import { FormattedLog, ErrorCallback } from "../../types";

export function processMarketCreatedLog(db: Database, log: FormattedLog, callback: ErrorCallback): void {
  const dataToInsert: (string|number)[] = [
    log.market, log.address, log.marketType, log.numOutcomes, log.minPrice, log.maxPrice, log.marketCreator, log.creationTime, log.blockNumber, log.creationFee, log.marketCreatorFeeRate, log.topic, log.tag1, log.tag2, log.reportingWindow, log.endTime, log.shortDescription, log.designatedReporter, log.resolutionSource
  ];
  db.run(`INSERT INTO markets
    (contract_address, universe, market_type, num_outcomes, min_price, max_price, market_creator, creation_time, creation_block_number, creation_fee, market_creator_fee_rate, topic, tag1, tag2, reporting_window, end_time, short_description, designated_reporter, resolution_source)
    VALUES (${dataToInsert.map(() => '?').join(',')})`, dataToInsert, callback);
}
