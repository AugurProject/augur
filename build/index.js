"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Augur = require("augur.js");
const sqlite3 = require("sqlite3");
const check_augur_db_setup_1 = require("./check-augur-db-setup");
const sync_augur_node_with_blockchain_1 = require("./sync-augur-node-with-blockchain");
const { augurDbPath, ethereumNodeEndpoints, uploadBlockNumbers } = require("../config");
sqlite3.verbose();
const db = new sqlite3.Database(augurDbPath);
const augur = new Augur();
check_augur_db_setup_1.checkAugurDbSetup(db, (err) => {
    sync_augur_node_with_blockchain_1.syncAugurNodeWithBlockchain(db, augur, ethereumNodeEndpoints, uploadBlockNumbers, (err) => {
        if (err)
            console.error(err);
        db.each(`SELECT * FROM transfers WHERE recipient = '0xba691ed1b3dae5b9d443c33bcad403f7f39045cd'`, (err, row) => {
            if (err)
                throw err;
            console.log("transfer:", row);
        });
        db.each(`SELECT * FROM blockchain_sync_history`, (err, row) => {
            if (err)
                throw err;
            console.log("sync:", row);
        });
        db.close(process.exit);
    });
});
function getMarketInfo(marketId) {
}
//# sourceMappingURL=index.js.map