"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const create_augur_db_tables_1 = require("./create-augur-db-tables");
const insert_test_data_into_augur_db_1 = require("./insert-test-data-into-augur-db");
function checkAugurDbSetup(db, callback) {
    db.get(`SELECT count(*) AS is_already_setup FROM sqlite_master WHERE type='table' AND name='blockchain_sync_history'`, (err, row) => {
        if (err)
            return callback(err);
        if (row.is_already_setup === 1)
            return callback(null);
        create_augur_db_tables_1.createAugurDbTables(db, (err) => insert_test_data_into_augur_db_1.insertTestDataIntoAugurDb(db, callback));
    });
}
exports.checkAugurDbSetup = checkAugurDbSetup;
//# sourceMappingURL=check-augur-db-setup.js.map