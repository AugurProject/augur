import { Database } from "sqlite3";
import { FormattedLog, LogProcessor, ErrorCallback } from "./types";

export const logProcessors: {[contractName: string]: {[eventName: string]: LogProcessor}} = {
  Augur: {
    MarketCreated: (db: Database, log: FormattedLog, callback: ErrorCallback): void => {
      const dataToInsert = [log.market, log.address, log.marketType, log.numOutcomes, log.minPrice, log.maxPrice, log.marketCreator, log.creationTime, log.blockNumber, log.creationFee, log.marketCreatorFeeRate, log.topic, log.tag1, log.tag2, log.reportingWindow, log.endTime, log.shortDescription, log.designatedReporter, log.resolutionSource];
      db.run(`INSERT INTO markets
        (contract_address, universe, market_type, num_outcomes, min_price, max_price, market_creator, creation_time, creation_block_number, creation_fee, market_creator_fee_rate, topic, tag1, tag2, reporting_window, end_time, short_description, designated_reporter, resolution_source)
        VALUES (${dataToInsert.map(() => '?').join(',')})`, dataToInsert, callback);
    },
    TokensTransferred: (db: Database, log: FormattedLog, callback: ErrorCallback): void => {
      const dataToInsert = [log.transactionHash, log.logIndex, log.from, log.to, log.token, log.value, log.blockNumber];
      db.run(`INSERT INTO transfers
        (transaction_hash, log_index, sender, recipient, token, value, block_number)
        VALUES (${dataToInsert.map(() => '?').join(',')})`, dataToInsert, callback);
    }
  },
  LegacyRepContract: {
    Transfer: (db: Database, log: FormattedLog, callback: ErrorCallback): void => {
      const dataToInsert = [log.transactionHash, log.logIndex, log.from, log.to, log.address, log.value, log.blockNumber];
      db.get(`SELECT symbol FROM tokens WHERE contract_address = ?`, [], (err?: Error, row?: Object) => {
        db.run(`INSERT INTO transfers
          (transaction_hash, log_index, sender, recipient, token, value, block_number)
          VALUES (${dataToInsert.map(() => '?').join(',')})`, dataToInsert, callback);
      });
    }
  }
};
