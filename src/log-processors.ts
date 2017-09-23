import { SqlLiteDb, FormattedLog } from "./types";

export const logProcessors: {[contractName: string]: {[eventName: string]: any}} = {
  Augur: {
    MarketCreated: (db: SqlLiteDb, log: FormattedLog, callback: (err?: Error|null) => void): void => {
      const dataToInsert = [log.market, log.address, log.marketType, log.numOutcomes, log.minPrice, log.maxPrice, log.marketCreator, log.creationTime, log.blockNumber, log.creationFee, log.marketCreatorFeeRate, log.topic, log.tag1, log.tag2, log.reportingWindow, log.endTime, log.shortDescription, log.designatedReporter, log.resolutionSource];
      db.run(`INSERT INTO markets
        (contractAddress, universe, marketType, numOutcomes, minPrice, maxPrice, marketCreator, creationTime, creationBlockNumber, creationFee, marketCreatorFeeRate, topic, tag1, tag2, reportingWindow, endTime, shortDescription, designatedReporter, resolutionSource)
        VALUES (${dataToInsert.map(() => '?').join(',')})`, dataToInsert, callback);
    },
    TokensTransferred: (db: SqlLiteDb, log: FormattedLog, callback: (err?: Error|null) => void): void => {
      const dataToInsert = [log.transactionHash, log.logIndex, log.from, log.to, log.token, log.value, log.blockNumber];
      db.run(`INSERT INTO transfers
        (transactionHash, logIndex, sender, recipient, token, value, blockNumber)
        VALUES (${dataToInsert.map(() => '?').join(',')})`, dataToInsert, callback);
    }
  },
  LegacyRepContract: {
    Transfer: (db: SqlLiteDb, log: FormattedLog, callback: (err?: Error|null) => void): void => {
      const dataToInsert = [log.transactionHash, log.logIndex, log.from, log.to, log.address, log.value, log.blockNumber];
      db.run(`INSERT INTO transfers
        (transactionHash, logIndex, sender, recipient, token, value, blockNumber)
        VALUES (${dataToInsert.map(() => '?').join(',')})`, dataToInsert, callback);
    }
  }
};
