"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Augur = require("augur.js");
const sqlite3 = require("sqlite3");
const create_augur_db_tables_1 = require("./create-augur-db-tables");
const insert_test_data_into_augur_db_1 = require("./insert-test-data-into-augur-db");
const start_augur_listeners_1 = require("./start-augur-listeners");
const download_augur_logs_1 = require("./download-augur-logs");
sqlite3.verbose();
const db = new sqlite3.Database("./augur.db");
const ethereumNodeEndpoints = {
    http: "http://127.0.0.1:8545",
    ws: "ws://127.0.0.1:8546"
};
create_augur_db_tables_1.createAugurDbTables(db, (err) => insert_test_data_into_augur_db_1.insertTestDataIntoAugurDb(db, (err) => {
    const augur = new Augur();
    augur.connect(ethereumNodeEndpoints, () => start_augur_listeners_1.startAugurListeners(db, augur, () => download_augur_logs_1.downloadAugurLogs(db, augur, (err) => {
        if (err)
            console.error(err);
        // example lookup...
        db.each(`SELECT * FROM transfers WHERE recipient = '0xba691ed1b3dae5b9d443c33bcad403f7f39045cd'`, (err, row) => {
            if (err)
                throw err;
            console.log("transfer:", row);
        });
        db.close(process.exit);
    })));
}));
//# sourceMappingURL=index.js.map