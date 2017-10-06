"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Augur = require("augur.js");
const sqlite3 = require("sqlite3");
const check_augur_db_setup_1 = require("./setup/check-augur-db-setup");
const sync_augur_node_with_blockchain_1 = require("./blockchain/sync-augur-node-with-blockchain");
const run_websocket_server_1 = require("./server/run-websocket-server");
const { augurDbPath, ethereumNodeEndpoints, uploadBlockNumbers, websocketPort } = require("../config");
sqlite3.verbose();
const db = new sqlite3.Database(augurDbPath);
const augur = new Augur();
augur.rpc.setDebugOptions({ broadcast: false });
check_augur_db_setup_1.checkAugurDbSetup(db, (err) => {
    if (err)
        return console.error("checkAugurDbSetup:", err);
    sync_augur_node_with_blockchain_1.syncAugurNodeWithBlockchain(db, augur, ethereumNodeEndpoints, uploadBlockNumbers, (err) => {
        if (err)
            return console.error("syncAugurNodeWithBlockchain:", err);
        console.log("Sync with blockchain complete, starting websocket server...");
        run_websocket_server_1.runWebsocketServer(db, websocketPort);
    });
});
//# sourceMappingURL=index.js.map