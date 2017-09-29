"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function checkAugurDbSetup(db, callback) {
    db.get(`SELECT count(*) AS is_already_setup FROM sqlite_master WHERE type='table' AND name='blockchain_sync_history'`, (err, row) => {
        if (err)
            return callback(err);
    });
}
exports.checkAugurDbSetup = checkAugurDbSetup;
//# sourceMappingURL=is-augur-db-already-setup.js.map