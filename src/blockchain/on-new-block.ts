import Augur = require("augur.js");
import { Database } from "sqlite3";
import { logError } from "../utils/log-error";

export function onNewBlock(db: Database, augur: Augur, blockNumber: string) {
  augur.rpc.eth.getBlockByNumber([blockNumber, false], (block: any): void => {
    if (!block || block.error || !block.timestamp) return logError(new Error(JSON.stringify(block)));
    console.log("new block:", parseInt(blockNumber, 16), parseInt(block.timestamp, 16));
    const dataToInsertOrReplace: (string|number)[] = [parseInt(blockNumber, 16), parseInt(block.timestamp, 16)];
    db.run(`INSERT OR REPLACE INTO blocks (block_number, block_timestamp) VALUES (?, ?)`, dataToInsertOrReplace, logError);
  });
}
