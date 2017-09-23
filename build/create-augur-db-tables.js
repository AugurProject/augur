"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function createAugurDbTables(db, callback) {
    db.serialize(() => {
        db.run(`DROP TABLE IF EXISTS markets`)
            .run(`CREATE TABLE markets (
              contractAddress varchar(66) PRIMARY KEY,
              universe varchar(66) NOT NULL,
              marketType varchar(11) NOT NULL,
              numOutcomes int NOT NULL,
              minPrice int NOT NULL,
              maxPrice int NOT NULL,
              marketCreator varchar(66) NOT NULL,
              creationTime int NOT NULL,
              creationBlockNumber int NOT NULL,
              creationFee int NOT NULL,
              marketCreatorFeeRate int NOT NULL,
              marketCreatorFeesCollected int DEFAULT 0,
              topic varchar(255) NOT NULL,
              tag1 varchar(255),
              tag2 varchar(255),
              volume int DEFAULT 0,
              sharesOutstanding int DEFAULT 0,
              reportingWindow varchar(66),
              endTime int NOT NULL,
              finalizationTime int,
              shortDescription varchar(1000) NOT NULL,
              longDescription text,
              designatedReporter varchar(66) NOT NULL,
              resolutionSource text
            )`)
            .run(`DROP TABLE IF EXISTS orders`)
            .run(`CREATE TABLE orders (
              orderId varchar(66) PRIMARY KEY,
              market varchar(66) NOT NULL,
              outcome int NOT NULL,
              orderType int NOT NULL,
              orderCreator varchar(66) NOT NULL,
              creationTime int NOT NULL,
              creationBlockNumber int NOT NULL,
              price int NOT NULL,
              amount int NOT NULL,
              moneyEscrowed int NOT NULL,
              sharesEscrowed int NOT NULL,
              betterOrderId varchar(66),
              worseOrderId varchar(66)
            )`)
            .run(`DROP TABLE IF EXISTS balances`)
            .run(`CREATE TABLE balances (
              owner varchar(66) NOT NULL,
              token varchar(66) NOT NULL,
              balance int NOT NULL DEFAULT 0,
              UNIQUE(owner, token)
            )`)
            .run(`DROP TABLE IF EXISTS tokens`)
            .run(`CREATE TABLE tokens (
              symbol varchar(10) PRIMARY KEY,
              contractAddress varchar(66) NOT NULL,
              networkId int NOT NULL,
              UNIQUE(networkId, contractAddress)
            )`)
            .run(`DROP TABLE IF EXISTS topics`)
            .run(`CREATE TABLE topics (
              name varchar(255) PRIMARY KEY,
              popularity int DEFAULT 0
            )`)
            .run(`DROP TABLE IF EXISTS transfers`)
            .run(`CREATE TABLE transfers (
              transactionHash varchar(66) NOT NULL,
              logIndex int NOT NULL,
              sender varchar(66) NOT NULL,
              recipient varchar(66) NOT NULL,
              token varchar(66) NOT NULL,
              value int NOT NULL,
              blockNumber int NOT NULL,
              UNIQUE(transactionHash, logIndex)
            )`);
        callback(null);
    });
}
exports.createAugurDbTables = createAugurDbTables;
//# sourceMappingURL=create-augur-db-tables.js.map