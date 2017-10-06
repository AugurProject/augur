import { Database } from "sqlite3";
import { Address } from "../../types";

interface TopicsRow {
  topic: string,
  popularity: number
}

type TopicsInfo = TopicsRow[];

export function getTopics(db: Database, universe: Address, callback: (err?: Error|null, result?: TopicsInfo) => void): void {
  db.all(`SELECT topic, popularity FROM topics WHERE universe = ? ORDER BY popularity DESC`, [universe], (err?: Error|null, topicsInfo?: TopicsInfo): void => {
    if (err) return callback(err);
    if (!topicsInfo || !topicsInfo.length) return callback(null);
    callback(null, topicsInfo);
  });
}
